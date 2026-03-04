import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Mastra } from "@mastra/core";
import { MastraServer } from "@mastra/hono";
import type { HonoBindings, HonoVariables } from "@mastra/hono";
import { LocalStorageProvider } from "@prove.ink/storage";
import { EventBus } from "@prove.ink/events";
import {
  createEngine,
  validationWorkflow,
  createValidatorAgent,
} from "@prove.ink/engine";
import { createCustomRoutes } from "./app.js";
import { applyProviderKey, resolveModel, resolveProvider } from "./config.js";
import type { Logger } from "@prove.ink/logger";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(__dirname, "web");

export interface ServerOptions {
  port?: number;
  /** Override model — falls back to AI_MODEL env → ~/.prove/config.json */
  model?: string;
  /** Override provider — falls back to ~/.prove/config.json → "openrouter" */
  provider?: "openai" | "gemini" | "openrouter";
  logger: Logger;
}

export async function startServer({
  port = 8674,
  model: modelOverride,
  provider: providerOverride,
  logger,
}: ServerOptions): Promise<number> {
  const provider = resolveProvider(providerOverride);
  applyProviderKey(provider);
  const model = resolveModel(modelOverride);
  const eventBus = new EventBus();
  const storage = new LocalStorageProvider(logger);

  const engine = createEngine({
    storage,
    eventBus,
    logger,
    model,
    searchProviderName: process.env.SEARCH_PROVIDER ?? "none",
    searchApiKey: process.env.TAVILY_API_KEY,
  });

  const agent = createValidatorAgent({
    storage,
    eventBus,
    searchProvider: null,
    logger,
    model,
  });

  const mastra = new Mastra({
    agents: { "validator-agent": agent },
    workflows: { "validation-workflow": validationWorkflow },
    logger: false,
  });

  const app = new Hono<{ Bindings: HonoBindings; Variables: HonoVariables }>();
  app.use("*", cors());

  const customRoutes = createCustomRoutes({ engine, storage, eventBus, logger });
  app.route("/api", customRoutes);

  const server = new MastraServer({ app, mastra, prefix: "/mastra" });
  await server.init();

  // Serve static assets from web dir relative to this file
  app.use("/assets/*", serveStatic({ root: WEB_ROOT }));
  app.use("/favicon*", serveStatic({ root: WEB_ROOT }));
  app.use("/prove.png", serveStatic({ root: WEB_ROOT }));

  // SPA fallback — all non-API routes return index.html
  app.use("*", async (c, next) => {
    const path = c.req.path;
    if (path.startsWith("/api") || path.startsWith("/mastra")) {
      return next();
    }
    return serveStatic({ root: WEB_ROOT, path: "/index.html" })(c, next);
  });

  serve({ fetch: app.fetch, port });

  return port;
}

export type { AppDeps } from "./app.js";
export { createCustomRoutes } from "./app.js";
