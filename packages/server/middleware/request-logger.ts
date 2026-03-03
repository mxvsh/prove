import type { MiddlewareHandler } from "hono";
import type { Logger } from "@prove.ink/logger";

export function requestLogger(logger: Logger): MiddlewareHandler {
  return async (c, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    logger.info(
      {
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        ms,
      },
      `${c.req.method} ${c.req.path} ${c.res.status} ${ms}ms`
    );
  };
}
