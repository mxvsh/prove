import { createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";
import type { SearchProvider, Stage } from "@prove.ink/core";
import type { Logger } from "@prove.ink/logger";
import { createValidatorAgent } from "./agent.js";
import { CLARITY_PROMPT } from "./prompts/clarity.js";
import { PAIN_URGENCY_PROMPT } from "./prompts/pain-urgency.js";
import { DIFFERENTIATION_PROMPT } from "./prompts/differentiation.js";
import { MVP_VALIDATION_PROMPT } from "./prompts/mvp-validation.js";
import { DECISION_PROMPT } from "./prompts/decision.js";
import { ideaCaptureStep } from "./steps/idea-capture.js";
import { clarityStep } from "./steps/clarity.js";
import { painUrgencyStep } from "./steps/pain-urgency.js";
import { differentiationStep } from "./steps/differentiation.js";
import { mvpValidationStep } from "./steps/mvp-validation.js";
import { decisionStep } from "./steps/decision.js";

const STAGE_PROMPTS: Partial<Record<Stage, string>> = {
  clarity: CLARITY_PROMPT,
  pain_urgency: PAIN_URGENCY_PROMPT,
  differentiation: DIFFERENTIATION_PROMPT,
  mvp_validation: MVP_VALIDATION_PROMPT,
  decision: DECISION_PROMPT,
};

/** Mastra workflow defining the validation stage progression. */
export const validationWorkflow = createWorkflow({
  id: "validation-workflow",
  inputSchema: z.object({
    projectId: z.string(),
    idea: z.string(),
  }),
  outputSchema: z.object({
    projectId: z.string(),
    complete: z.boolean(),
  }),
})
  .then(ideaCaptureStep)
  .then(clarityStep)
  .then(painUrgencyStep)
  .then(differentiationStep)
  .then(mvpValidationStep)
  .then(decisionStep)
  .commit();

export interface ChatResult {
  response: string;
  stage: Stage;
  isComplete: boolean;
}

/**
 * Creates the validation engine wrapping Mastra workflow + agent.
 *
 * The workflow defines stage progression (suspend at each stage).
 * The agent handles the conversational AI interaction.
 * On each user message we:
 *   1. Send the message + context to the agent
 *   2. Agent uses tools to update state, insights, advance stages
 */
export function createValidationEngine(deps: {
  storage: StorageProvider;
  eventBus: EventBus;
  searchProvider: SearchProvider | null;
  logger: Logger;
  model?: string;
}) {
  const agent = createValidatorAgent(deps);
  const { storage, eventBus, logger } = deps;

  async function addTokenUsage(
    projectId: string,
    usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number }
  ): Promise<void> {
    if (!usage) return;
    const project = await storage.getProject(projectId);
    if (!project) return;

    const nextInput =
      (project.token_usage?.input_tokens ?? 0) + (usage.inputTokens ?? 0);
    const nextOutput =
      (project.token_usage?.output_tokens ?? 0) + (usage.outputTokens ?? 0);
    const nextTotal =
      (project.token_usage?.total_tokens ?? 0) + (usage.totalTokens ?? 0);

    await storage.updateProject(projectId, {
      token_usage: {
        input_tokens: nextInput,
        output_tokens: nextOutput,
        total_tokens: nextTotal,
      },
    });
  }

  async function streamAgentResponse(
    projectId: string,
    prompt: string
  ): Promise<{
    responseText: string;
    usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
  }> {
    let responseText = "";

    const emitDelta = (delta: string) => {
      if (!delta) return;
      responseText += delta;
      eventBus.emit("message:delta", {
        projectId,
        delta,
        content: responseText,
      });
    };

    const stream = await agent.stream(prompt, {
      maxSteps: 5,
      onChunk: (chunk) => {
        const typed = chunk as {
          type?: string;
          payload?: Record<string, unknown>;
          textDelta?: string;
          delta?: string;
          toolName?: string;
        };
        const type = typed.type;
        const payload = typed.payload ?? {};

        if (type === "text-delta") {
          const delta =
            (payload.text as string | undefined) ??
            typed.textDelta ??
            typed.delta ??
            "";
          emitDelta(delta);
          return;
        }

        if (type === "step-start") {
          eventBus.emit("agent:activity", {
            projectId,
            phase: "thinking",
            message: "Thinking...",
          });
          return;
        }

        if (
          type === "tool-call" ||
          type === "tool-call-streaming-start" ||
          type === "tool-call-input-streaming-start"
        ) {
          const toolName =
            (payload.toolName as string | undefined) ?? typed.toolName ?? "tool";
          eventBus.emit("agent:activity", {
            projectId,
            phase: "tool_call",
            toolName,
            message: `Using tool: ${toolName}`,
          });
          return;
        }

        if (type === "tool-result") {
          const toolName =
            (payload.toolName as string | undefined) ?? typed.toolName ?? "tool";
          eventBus.emit("agent:activity", {
            projectId,
            phase: "tool_result",
            toolName,
            message: `Tool completed: ${toolName}`,
          });
        }
      },
    });

    await stream.consumeStream();

    if (!responseText) {
      const fullText = await stream.text;
      if (fullText) {
        emitDelta(fullText);
      }
    }

    const usage = await stream.totalUsage;
    return { responseText, usage };
  }

  async function startProject(
    projectId: string,
    idea: string
  ): Promise<ChatResult> {
    const project = await storage.getProject(projectId);
    if (!project) throw new Error(`Project ${projectId} not found`);

    await storage.updateProject(projectId, { stage: "clarity" });
    eventBus.emit("stage:changed", {
      projectId,
      from: "idea_capture",
      to: "clarity",
    });

    const stagePrompt = STAGE_PROMPTS.clarity!;
    const { responseText, usage } = await streamAgentResponse(
      projectId,
      `[PROJECT_ID: ${projectId}]

${stagePrompt}

The user has submitted this idea: "${idea}"

Start the clarity stage. First, call get_state to see the current project state, then ask your first probing question about this idea. Remember to be specific and challenge vagueness.`,
    );
    const timestamp = new Date().toISOString();

    await storage.appendMessage(projectId, {
      role: "assistant",
      content: responseText,
      timestamp,
    });
    await addTokenUsage(projectId, usage);
    eventBus.emit("message:agent", { projectId, content: responseText, timestamp });

    const updated = await storage.getProject(projectId);
    return {
      response: responseText,
      stage: updated?.stage ?? "clarity",
      isComplete: updated?.stage === "complete",
    };
  }

  async function resumeChat(
    projectId: string,
    userMessage: string
  ): Promise<ChatResult> {
    const project = await storage.getProject(projectId);
    if (!project) throw new Error(`Project ${projectId} not found`);

    const userTimestamp = new Date().toISOString();
    await storage.appendMessage(projectId, {
      role: "user",
      content: userMessage,
      timestamp: userTimestamp,
    });
    eventBus.emit("message:user", {
      projectId,
      content: userMessage,
      timestamp: userTimestamp,
    });

    const stagePrompt = STAGE_PROMPTS[project.stage] ?? "";
    const conversationHistory = project.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const systemContext = `[PROJECT_ID: ${projectId}]
[CURRENT_STAGE: ${project.stage}]

${stagePrompt}

Continue the conversation. Use your tools to get the current state if needed, update insights as you learn things, and advance the stage when appropriate.`;

    const { responseText, usage } = await streamAgentResponse(
      projectId,
      `${systemContext}

Conversation history:
${conversationHistory}

Latest user message:
${userMessage}`,
    );
    const assistantTimestamp = new Date().toISOString();

    await storage.appendMessage(projectId, {
      role: "assistant",
      content: responseText,
      timestamp: assistantTimestamp,
    });
    await addTokenUsage(projectId, usage);
    eventBus.emit("message:agent", {
      projectId,
      content: responseText,
      timestamp: assistantTimestamp,
    });

    const updated = await storage.getProject(projectId);
    return {
      response: responseText,
      stage: updated?.stage ?? project.stage,
      isComplete: updated?.stage === "complete",
    };
  }

  async function triggerResearch(
    projectId: string,
    queries?: string[]
  ): Promise<{ resultCount: number }> {
    const project = await storage.getProject(projectId);
    if (!project) throw new Error(`Project ${projectId} not found`);

    if (!queries || queries.length === 0) {
      const result = await agent.generate(
        `[PROJECT_ID: ${projectId}]

Based on the current project state, generate 3-5 focused search queries to find real-world demand signals, competitor data, or user complaints related to this idea. Then call the trigger_research tool with those queries.

First call get_state to understand the project, then call trigger_research.`,
        { maxSteps: 5 }
      );
      await addTokenUsage(projectId, result.totalUsage);
      const updated = await storage.getProject(projectId);
      return { resultCount: updated?.research.sources.length ?? 0 };
    }

    eventBus.emit("research:started", { projectId, queries });

    if (!deps.searchProvider) {
      logger.warn("No search provider configured");
      return { resultCount: 0 };
    }

    const allResults: Array<{ url: string; title: string; snippet: string }> = [];
    for (const query of queries) {
      try {
        const results = await deps.searchProvider.search(query, 5);
        allResults.push(
          ...results.map((r) => ({ url: r.url, title: r.title, snippet: r.snippet }))
        );
      } catch (err) {
        logger.error({ query, err }, "Search query failed");
      }
    }

    await storage.updateProject(projectId, {
      research: { enabled: true, queries, evidence_summary: null, sources: allResults },
    });
    eventBus.emit("research:completed", { projectId, resultCount: allResults.length });
    return { resultCount: allResults.length };
  }

  return { startProject, resumeChat, triggerResearch };
}
