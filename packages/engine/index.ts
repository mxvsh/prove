import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";
import type { Logger } from "@prove.ink/logger";
import { resolveSearchProvider } from "./search/provider.js";
import { createValidationEngine, type ChatResult } from "./workflow.js";
import { validationWorkflow } from "./workflow.js";
import { createValidatorAgent } from "./agent.js";

export interface EngineConfig {
  storage: StorageProvider;
  eventBus: EventBus;
  logger: Logger;
  model?: string;
  searchProviderName?: string;
  searchApiKey?: string;
}

export interface Engine {
  startProject(projectId: string, idea: string): Promise<ChatResult>;
  resumeChat(projectId: string, userMessage: string): Promise<ChatResult>;
  triggerResearch(
    projectId: string,
    queries?: string[]
  ): Promise<{ resultCount: number }>;
}

export function createEngine(config: EngineConfig): Engine {
  const {
    storage,
    eventBus,
    logger,
    model,
    searchProviderName,
    searchApiKey,
  } = config;

  const searchProvider = searchProviderName
    ? resolveSearchProvider(searchProviderName, searchApiKey, logger)
    : null;

  return createValidationEngine({
    storage,
    eventBus,
    searchProvider,
    logger,
    model,
  });
}

export { validationWorkflow, createValidatorAgent };
export type { ChatResult } from "./workflow.js";
