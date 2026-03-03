import { Agent } from "@mastra/core/agent";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";
import type { SearchProvider } from "@prove.ink/core";
import { DEFAULT_MODEL_BY_PROVIDER } from "@prove.ink/core";
import type { Logger } from "@prove.ink/logger";
import { SYSTEM_PROMPT } from "./prompts/system.js";
import { createGetStateTool } from "./tools/get-state.js";
import { createUpdateStateTool } from "./tools/update-state.js";
import { createUpdateInsightsTool } from "./tools/update-insights.js";
import { createAdvanceStageTool } from "./tools/advance-stage.js";
import { createTriggerResearchTool } from "./tools/trigger-research.js";
import { createSaveEvidenceTool } from "./tools/save-evidence.js";

export function createValidatorAgent(deps: {
  storage: StorageProvider;
  eventBus: EventBus;
  searchProvider: SearchProvider | null;
  logger: Logger;
  model?: string;
}) {
  const { storage, eventBus, searchProvider, logger, model } = deps;

  return new Agent({
    id: "validator-agent",
    name: "Validator",
    instructions: SYSTEM_PROMPT,
    model: model ?? DEFAULT_MODEL_BY_PROVIDER.openrouter,
    tools: {
      get_state: createGetStateTool(storage),
      update_state: createUpdateStateTool(storage, eventBus),
      update_insights: createUpdateInsightsTool(storage, eventBus),
      advance_stage: createAdvanceStageTool(storage, eventBus),
      trigger_research: createTriggerResearchTool(
        storage,
        eventBus,
        searchProvider,
        logger
      ),
      save_evidence: createSaveEvidenceTool(storage, eventBus),
    },
  });
}
