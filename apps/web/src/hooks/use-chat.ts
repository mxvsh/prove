import { useCallback } from "react";
import { MastraClient } from "@mastra/client-js";
import { api } from "../lib/api-client";
import { useProjectStore } from "../stores/project-store";

function getMastraClientConfig() {
  const rawUrl = import.meta.env.VITE_MASTRA_BASE_URL ?? "http://localhost:8674";
  const envPrefix = import.meta.env.VITE_MASTRA_API_PREFIX ?? "/mastra";

  let baseUrl = rawUrl.replace(/\/$/, "");

  // Allow VITE_MASTRA_BASE_URL to include a path suffix.
  if (baseUrl.endsWith("/mastra")) {
    baseUrl = baseUrl.slice(0, -"/mastra".length) || "http://localhost:8674";
  } else if (baseUrl.endsWith("/api")) {
    baseUrl = baseUrl.slice(0, -"/api".length) || "http://localhost:8674";
  }

  return { baseUrl, apiPrefix: envPrefix };
}

const { baseUrl: mastraBaseUrl, apiPrefix: mastraApiPrefix } = getMastraClientConfig();
const mastraClient = new MastraClient({
  baseUrl: mastraBaseUrl,
  apiPrefix: mastraApiPrefix,
});
const validatorAgent = mastraClient.getAgent("validator-agent");

function formatToolName(toolName: string) {
  return toolName
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildToolStatus(toolName: string) {
  const raw = toolName.replace(/[_-]+/g, " ").trim();
  const pretty = formatToolName(raw);

  if (/^update\b/i.test(raw)) {
    const target = pretty.replace(/^Update\s+/i, "") || pretty;
    return `Updating ${target}...`;
  }

  if (/^save\b/i.test(raw)) {
    return `Saving ${pretty.replace(/^Save\s+/i, "") || pretty}...`;
  }

  if (/^(get|fetch)\b/i.test(raw)) {
    return `Fetching ${pretty}...`;
  }

  if (/^trigger\b/i.test(raw)) {
    return `Triggering ${pretty.replace(/^Trigger\s+/i, "") || pretty}...`;
  }

  return `Updating ${pretty}...`;
}

export function useChat() {
  const { isSending, error, lastFailedMessage } = useProjectStore();

  const send = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed) return;

      const state = useProjectStore.getState();
      const project = state.currentProject;
      if (!project) return;

      const userTimestamp = new Date().toISOString();
      const history = [...state.messages, { role: "user" as const, content: trimmed, timestamp: userTimestamp }];

      useProjectStore.setState((s) => ({
        messages: [...s.messages, { role: "user", content: trimmed, timestamp: userTimestamp }],
        streamingAgentMessage: "",
        toolActivity: [],
        isSending: true,
        isBootstrapping: false,
        lastFailedMessage: null,
        error: null,
      }));

      try {
        await api.appendMessage(project.id, {
          role: "user",
          content: trimmed,
          timestamp: userTimestamp,
        });

        const stageContext = `[PROJECT_ID: ${project.id}]
[CURRENT_STAGE: ${project.stage}]`;

        const historyText = history
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n\n");

        const stream = await validatorAgent.stream(
          `${stageContext}

Conversation history:
${historyText}

Latest user message:
${trimmed}

Important:
- Use tools when needed.
- After tool calls, ALWAYS send a clear final assistant message to the user.`
          ,
          {
            maxSteps: 8,
          }
        );

        let assistantText = "";
        let replaceOnNextText = false;
        await stream.processDataStream({
          onChunk: async (chunk: unknown) => {
            const typed = chunk as {
              type?: string;
              payload?: Record<string, unknown>;
              textDelta?: string;
              delta?: string;
              text?: string;
              toolName?: string;
            };
            const type = typed.type;
            const payload = typed.payload ?? {};

            if (type === "text-delta") {
              const delta = (payload.text as string | undefined)
                ?? typed.textDelta
                ?? typed.delta
                ?? typed.text
                ?? "";
              if (!delta) return;
              if (replaceOnNextText) {
                assistantText = delta;
                replaceOnNextText = false;
              } else {
                assistantText += delta;
              }
              useProjectStore.getState().setStreamingAgentMessage(assistantText);
              return;
            }

            if (type === "tripwire") {
              const tripwireText = payload.reason as string | undefined;
              if (!tripwireText) return;
              if (replaceOnNextText) {
                assistantText = tripwireText;
                replaceOnNextText = false;
              } else {
                assistantText += tripwireText;
              }
              useProjectStore.getState().setStreamingAgentMessage(assistantText);
              return;
            }

            if (
              type === "tool-call" ||
              type === "tool-call-streaming-start" ||
              type === "tool-call-input-streaming-start"
            ) {
              const toolName =
                (payload.toolName as string | undefined) ?? typed.toolName ?? "tool";
              useProjectStore
                .getState()
                .addToolActivity(buildToolStatus(toolName));
              replaceOnNextText = true;
              return;
            }

            if (type === "tool-result") {
              useProjectStore.getState().clearToolActivity();
            }
          },
        });

        const currentState = useProjectStore.getState();
        const finalText = assistantText.trim() || currentState.streamingAgentMessage.trim();
        if (finalText) {
          const assistantTimestamp = new Date().toISOString();
          useProjectStore.getState().addAgentMessage(finalText, assistantTimestamp);
          await api.appendMessage(project.id, {
            role: "assistant",
            content: finalText,
            timestamp: assistantTimestamp,
          });
        } else {
          useProjectStore.setState({
            error: "Agent completed without a text response.",
          });
        }

        useProjectStore.setState({ isSending: false, isBootstrapping: false });
      } catch (err) {
        useProjectStore.setState({
          error: (err as Error).message,
          isSending: false,
          streamingAgentMessage: "",
          lastFailedMessage: trimmed,
        });
      }
    },
    []
  );

  const retryFailed = useCallback(async () => {
    if (!lastFailedMessage) return;
    await send(lastFailedMessage);
  }, [lastFailedMessage, send]);

  return { send, retryFailed, isSending, error };
}
