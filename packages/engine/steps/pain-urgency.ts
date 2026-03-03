import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const painUrgencyStep = createStep({
  id: "pain-urgency",
  inputSchema: z.object({
    projectId: z.string(),
    stageComplete: z.boolean(),
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
    if (!resumeData) {
      return await suspend({
        agentResponse: "Starting pain & urgency stage",
      });
    }

    return {
      projectId: inputData.projectId,
      stageComplete: true,
    };
  },
});
