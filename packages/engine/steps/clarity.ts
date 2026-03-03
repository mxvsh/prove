import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const clarityStep = createStep({
  id: "clarity",
  inputSchema: z.object({
    projectId: z.string(),
    idea: z.string(),
  }),
  outputSchema: z.object({
    projectId: z.string(),
    stageComplete: z.boolean(),
  }),
  resumeSchema: z.object({
    userMessage: z.string(),
  }),
  suspendSchema: z.object({
    agentResponse: z.string(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    // This step suspends to collect user input in a conversational loop.
    // The actual agent interaction is handled by the engine's resumeChat method.
    // The workflow step acts as a gate that suspends until the stage is advanced.

    if (!resumeData) {
      // First entry — suspend waiting for user interaction
      return await suspend({
        agentResponse: "Starting clarity stage",
      });
    }

    // If we're here, the user sent a message and the agent decided to advance.
    // The advance_stage tool call signals stage completion externally.
    return {
      projectId: inputData.projectId,
      stageComplete: true,
    };
  },
});
