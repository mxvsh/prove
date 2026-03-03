import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  DEFAULT_MODEL_BY_PROVIDER,
  ProviderConfigSchema,
  type ModelProvider,
} from "@prove.ink/core";

// In-memory config for this process
let currentConfig: {
  provider: ModelProvider;
  model: string;
  searchProvider: string;
} = {
  provider: "openrouter",
  model: DEFAULT_MODEL_BY_PROVIDER.openrouter,
  searchProvider: "none",
};

function hasProviderApiKey(provider: ModelProvider): boolean {
  if (provider === "openai") return !!process.env.OPENAI_API_KEY;
  if (provider === "gemini")
    return !!(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY
    );
  return !!process.env.OPENROUTER_API_KEY;
}

export function createConfigRoutes() {
  const routes = new Hono();

  routes.get("/provider", (c) => {
    return c.json({
      provider: currentConfig.provider,
      model: currentConfig.model,
      searchProvider: currentConfig.searchProvider,
      hasApiKey: hasProviderApiKey(currentConfig.provider),
    });
  });

  routes.post(
    "/provider",
    zValidator(
      "json",
      ProviderConfigSchema.pick({
        provider: true,
        model: true,
        searchProvider: true,
      }).partial()
    ),
    (c) => {
      const body = c.req.valid("json");
      const provider = body.provider ?? currentConfig.provider;
      const model =
        body.model ??
        (body.provider
          ? DEFAULT_MODEL_BY_PROVIDER[provider]
          : currentConfig.model);
      currentConfig = { ...currentConfig, ...body, provider, model };
      return c.json({ success: true, config: currentConfig });
    }
  );

  return routes;
}
