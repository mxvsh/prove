export const SUPPORTED_MODEL_PROVIDERS = [
  "openai",
  "gemini",
  "openrouter",
] as const;

export type ModelProvider = (typeof SUPPORTED_MODEL_PROVIDERS)[number];

export const DEFAULT_MODEL_BY_PROVIDER: Record<ModelProvider, string> = {
  openai: "openai/gpt-5.2",
  gemini: "google/gemini-2.5-pro",
  openrouter: "openrouter/minimax/minimax-m2.5",
};
