import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const decisionStep = createStep({
  id: "decision",
  inputSchema: z.object({
    projectId: z.string(),
    stageComplete: z.boolean(),
  }),
  outputSchema: z.object({
    projectId: z.string(),
    complete: z.boolean(),
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
        agentResponse: "Starting decision stage",
      });
    }

    return {
      projectId: inputData.projectId,
      complete: true,
    };
  },
});
