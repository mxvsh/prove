import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";

export function createSaveEvidenceTool(
  storage: StorageProvider,
  eventBus: EventBus
) {
  return createTool({
    id: "save_evidence",
    description:
      "Save a research evidence summary after analyzing research results. Call this after trigger_research to summarize findings.",
    inputSchema: z.object({
      projectId: z.string(),
      summary: z
        .string()
        .describe("Structured summary of research findings"),
    }),
    outputSchema: z.object({ success: z.boolean() }),
    execute: async (inputData) => {
      const project = await storage.getProject(inputData.projectId);
      if (!project) return { success: false };

      await storage.updateProject(inputData.projectId, {
        research: {
          ...project.research,
          evidence_summary: inputData.summary,
        },
      });

      eventBus.emit("state:updated", {
        projectId: inputData.projectId,
        state: { research_summary: inputData.summary } as Record<
          string,
          unknown
        >,
      });

      return { success: true };
    },
  });
}
