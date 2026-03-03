import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";
import type { SearchProvider } from "@prove.ink/core";
import type { Logger } from "@prove.ink/logger";

export function createTriggerResearchTool(
  storage: StorageProvider,
  eventBus: EventBus,
  searchProvider: SearchProvider | null,
  logger: Logger
) {
  return createTool({
    id: "trigger_research",
    description:
      "Trigger web research for demand signals. Generates search queries and fetches results. Only use when the user wants external validation or you need real-world data.",
    inputSchema: z.object({
      projectId: z.string(),
      queries: z
        .array(z.string())
        .max(5)
        .describe("Search queries to execute (max 5)"),
    }),
    outputSchema: z.object({
      resultCount: z.number(),
      success: z.boolean(),
    }),
    execute: async (inputData) => {
      if (!searchProvider) {
        logger.warn("Research requested but no search provider configured");
        return { resultCount: 0, success: false };
      }

      eventBus.emit("research:started", {
        projectId: inputData.projectId,
        queries: inputData.queries,
      });

      const allResults: Array<{
        url: string;
        title: string;
        snippet: string;
      }> = [];

      for (const query of inputData.queries) {
        try {
          const results = await searchProvider.search(query, 5);
          allResults.push(
            ...results.map((r) => ({
              url: r.url,
              title: r.title,
              snippet: r.snippet,
            }))
          );
        } catch (err) {
          logger.error({ query, err }, "Search query failed");
        }
      }

      await storage.updateProject(inputData.projectId, {
        research: {
          enabled: true,
          queries: inputData.queries,
          evidence_summary: null,
          sources: allResults,
        },
      });

      eventBus.emit("research:completed", {
        projectId: inputData.projectId,
        resultCount: allResults.length,
      });

      return { resultCount: allResults.length, success: true };
    },
  });
}
