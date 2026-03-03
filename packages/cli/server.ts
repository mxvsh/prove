import pino from "pino";
import pretty from "pino-pretty";
import { startServer as startProveServer } from "@prove.ink/server";
import { ensureProveDir, getErrorLogPath } from "./config.js";
import type { ProveConfig } from "./config.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);
const IS_PROD = process.env.NODE_ENV === "production";

function createCliLogger(name: string) {
  if (!IS_PROD) {
    // Direct stream — avoids worker thread resolution issues in bundled output
    const stream = pretty({
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    });
    return pino({ name, level: process.env.LOG_LEVEL ?? "info" }, stream);
  }

  // Production: silence stdout, write errors only to ~/.prove/error.log
  ensureProveDir();
  return pino(
    { name, level: "error" },
    pino.destination({ dest: getErrorLogPath(), append: true, sync: false })
  );
}

export async function startServer(config: ProveConfig): Promise<number> {
  process.env.NODE_ENV ??= "production";
  const logger = createCliLogger("api");
  // model + provider + apiKey all resolve via @prove.ink/server → ~/.prove/config.json fallback
  return startProveServer({
    port: PORT,
    provider: config.provider,
    model: config.model,
    logger,
  });
}
