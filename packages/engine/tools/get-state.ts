import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { StorageProvider } from "@prove.ink/storage";

export function createGetStateTool(storage: StorageProvider) {
  return createTool({
    id: "get_state",
    description:
      "Get the current project state including all structured insights, stage, and research data.",
    inputSchema: z.object({
      projectId: z.string().describe("The project ID to get state for"),
    }),
    outputSchema: z.object({
      state: z.any(),
    }),
    execute: async (inputData) => {
      const state = await storage.getProject(inputData.projectId);
      return { state };
    },
  });
}
