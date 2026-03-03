import { createLogger } from "@prove.ink/logger";
import { startServer } from "@prove.ink/server";

const port = parseInt(process.env.PORT ?? "8674", 10);
const logger = createLogger("api");

// provider, model, and API key all resolve automatically:
// process.env → ~/.prove/config.json
await startServer({ port, logger });

logger.info({ port }, "API server started");
