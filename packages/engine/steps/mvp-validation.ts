import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const mvpValidationStep = createStep({
  id: "mvp-validation",
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
        agentResponse: "Starting MVP validation stage",
      });
    }

    return {
      projectId: inputData.projectId,
      stageComplete: true,
    };
  },
});
