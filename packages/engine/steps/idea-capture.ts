import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

export const ideaCaptureStep = createStep({
  id: "idea-capture",
  inputSchema: z.object({
    projectId: z.string(),
    idea: z.string(),
  }),
  outputSchema: z.object({
    projectId: z.string(),
    idea: z.string(),
  }),
  execute: async ({ inputData }) => {
    // Pass through — idea is already captured at project creation
    return { projectId: inputData.projectId, idea: inputData.idea };
  },
});
