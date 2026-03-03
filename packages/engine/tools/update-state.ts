import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";

export function createUpdateStateTool(
  storage: StorageProvider,
  eventBus: EventBus
) {
  return createTool({
    id: "update_state",
    description:
      "Update the project state with new structured data. Use this to save decision verdicts and other top-level state changes.",
    inputSchema: z.object({
      projectId: z.string(),
      updates: z
        .record(z.any())
        .describe(
          "Key-value pairs to merge into the project state. Can include: summary, target_user, problem, problem_description, pain_points, alternatives, differentiation, risks_description, risks, assumptions_description, assumptions, experiments, problem_strength, validation_readiness, decision"
        ),
    }),
    outputSchema: z.object({ success: z.boolean() }),
    execute: async (inputData) => {
      const updated = await storage.updateProject(
        inputData.projectId,
        inputData.updates
      );
      eventBus.emit("state:updated", {
        projectId: inputData.projectId,
        state: updated as unknown as Record<string, unknown>,
      });
      return { success: true };
    },
  });
}
