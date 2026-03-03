import { Hono } from "hono";
import { cors } from "hono/cors";
import { errorHandler } from "./middleware/error-handler.js";
import { createProjectRoutes } from "./routes/projects.js";
import { createConfigRoutes } from "./routes/config.js";
import { healthRoutes } from "./routes/health.js";
import type { Engine } from "@prove.ink/engine";
import type { StorageProvider } from "@prove.ink/storage";
import type { EventBus } from "@prove.ink/events";
import type { Logger } from "@prove.ink/logger";

export interface AppDeps {
  engine: Engine;
  storage: StorageProvider;
  eventBus: EventBus;
  logger: Logger;
}

export function createCustomRoutes(deps: AppDeps) {
  const api = new Hono();

  api.use("*", cors());
  api.onError(errorHandler(deps.logger));

  api.route("/projects", createProjectRoutes(deps));
  api.route("/config", createConfigRoutes());
  api.route("/", healthRoutes);

  return api;
}
