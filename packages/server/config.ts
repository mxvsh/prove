import { existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

type ModelProvider = "openai" | "gemini" | "openrouter";

interface ProveConfig {
  provider?: ModelProvider;
  apiKey?: string;
  model?: string;
}

function readProveConfig(): ProveConfig | null {
  const configPath = join(homedir(), ".prove", "config.json");
  if (!existsSync(configPath)) return null;
  try {
    return JSON.parse(readFileSync(configPath, "utf-8")) as ProveConfig;
  } catch {
    return null;
  }
}

/**
 * Resolves the API key for a given provider.
 * Priority: process.env → ~/.prove/config.json
 */
function resolveApiKey(provider: ModelProvider): string | undefined {
  // 1. Check env vars
  if (provider === "openai" && process.env.OPENAI_API_KEY)
    return process.env.OPENAI_API_KEY;
  if (provider === "gemini") {
    const key =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;
    if (key) return key;
  }
  if (provider === "openrouter" && process.env.OPENROUTER_API_KEY)
    return process.env.OPENROUTER_API_KEY;

  // 2. Fall back to ~/.prove/config.json
  const config = readProveConfig();
  if (config?.provider === provider && config.apiKey) return config.apiKey;

  return undefined;
}

/**
 * Injects the resolved API key into the correct environment variable
 * so downstream libraries (Mastra, AI SDK, etc.) pick it up automatically.
 */
export function applyProviderKey(provider: ModelProvider): void {
  const key = resolveApiKey(provider);
  if (!key) return;

  switch (provider) {
    case "openai":
      process.env.OPENAI_API_KEY ??= key;
      break;
    case "gemini":
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ??= key;
      process.env.GEMINI_API_KEY ??= key;
      break;
    case "openrouter":
      process.env.OPENROUTER_API_KEY ??= key;
      break;
  }
}

/**
 * Resolves the model to use.
 * Priority: AI_MODEL env → caller-supplied → ~/.prove/config.json → default
 */
export function resolveModel(
  supplied?: string,
  defaultModel?: string
): string {
  return (
    process.env.AI_MODEL ??
    supplied ??
    readProveConfig()?.model ??
    defaultModel ??
    "openrouter/minimax/minimax-m2.5"
  );
}

/**
 * Resolves the provider.
 * Priority: caller-supplied → ~/.probe/config.json → "openrouter"
 */
export function resolveProvider(supplied?: ModelProvider): ModelProvider {
  return supplied ?? readProveConfig()?.provider ?? "openrouter";
}
