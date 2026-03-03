import type { ErrorHandler } from "hono";
import { AppError } from "@prove.ink/core";
import type { Logger } from "@prove.ink/logger";

export function errorHandler(logger: Logger): ErrorHandler {
  return (err, c) => {
    if (err instanceof AppError) {
      logger.error(
        { code: err.code, status: err.statusCode },
        err.message
      );
      return c.json(
        { error: err.message, code: err.code },
        err.statusCode as 400 | 404 | 500 | 502
      );
    }

    logger.error({ err }, "Unhandled error");
    return c.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      500
    );
  };
}
