import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { STAGES, type Stage } from "@prove.ink/core";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";

export function createAdvanceStageTool(
  storage: StorageProvider,
  eventBus: EventBus
) {
  return createTool({
    id: "advance_stage",
    description:
      "Advance the project to the next validation stage. Only call this when the current stage has been sufficiently explored.",
    inputSchema: z.object({
      projectId: z.string(),
    }),
    outputSchema: z.object({
      newStage: z.string(),
      success: z.boolean(),
    }),
    execute: async (inputData) => {
      const project = await storage.getProject(inputData.projectId);
      if (!project) {
        return { newStage: "unknown", success: false };
      }

      const currentIndex = STAGES.indexOf(project.stage);
      if (currentIndex >= STAGES.length - 1) {
        return { newStage: project.stage, success: false };
      }

      const newStage = STAGES[currentIndex + 1] as Stage;
      await storage.updateProject(inputData.projectId, { stage: newStage });

      eventBus.emit("stage:changed", {
        projectId: inputData.projectId,
        from: project.stage,
        to: newStage,
      });

      return { newStage, success: true };
    },
  });
}
