import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";

export function createUpdateInsightsTool(
  storage: StorageProvider,
  eventBus: EventBus
) {
  return createTool({
    id: "update_insights",
    description:
      "Update a specific insight section in the project state. Use this whenever you learn something important during the conversation. Sections: summary, target_user, problem, problem_description, pain_points, alternatives, differentiation, risks_description, risks, assumptions_description, assumptions, experiments.",
    inputSchema: z.object({
      projectId: z.string(),
      section: z.enum([
        "summary",
        "target_user",
        "problem",
        "problem_description",
        "pain_points",
        "alternatives",
        "differentiation",
        "risks_description",
        "risks",
        "assumptions_description",
        "assumptions",
        "experiments",
      ]),
      content: z
        .union([z.string(), z.array(z.string())])
        .describe(
          "The new content for this section. Use string for text fields, array for list fields (pain_points, alternatives, risks, assumptions, experiments)."
        ),
    }),
    outputSchema: z.object({ success: z.boolean() }),
    execute: async (inputData) => {
      await storage.updateProject(inputData.projectId, {
        [inputData.section]: inputData.content,
      });
      eventBus.emit("insights:updated", {
        projectId: inputData.projectId,
        section: inputData.section,
        content: inputData.content,
      });
      return { success: true };
    },
  });
}
