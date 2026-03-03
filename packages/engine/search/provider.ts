import type { SearchProvider } from "@prove.ink/core";
import type { Logger } from "@prove.ink/logger";
import { TavilySearchProvider } from "./tavily-search.js";

export function resolveSearchProvider(
  providerName: string,
  apiKey: string | undefined,
  logger: Logger
): SearchProvider | null {
  switch (providerName) {
    case "tavily":
      if (!apiKey) {
        logger.warn("Tavily API key not provided");
        return null;
      }
      return new TavilySearchProvider(apiKey);
    case "none":
      return null;
    default:
      logger.warn({ providerName }, "Unknown search provider");
      return null;
  }
}
