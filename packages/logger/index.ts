import pino from "pino";

export function createLogger(name: string, level?: string) {
  const isDev = process.env.NODE_ENV !== "production";

  return pino({
    name,
    level: level ?? process.env.LOG_LEVEL ?? "info",
    transport: isDev
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  });
}

export type Logger = ReturnType<typeof createLogger>;
