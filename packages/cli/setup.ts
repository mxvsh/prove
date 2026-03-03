import * as p from "@clack/prompts";
import pkg from "./package.json" with { type: "json" };
import { writeConfig } from "./config.js";
import type { ModelProvider, ProveConfig, UserRole } from "./config.js";

const MODELS_BY_PROVIDER: Record<
  ModelProvider,
  { value: string; label: string; hint?: string }[]
> = {
  openai: [
    { value: "openai/gpt-5.2",     label: "GPT-5.2",     hint: "Latest" },
   { value: "openai/gpt-5.2-instant",   label: "GPT-5.2 Instant",   hint: "Fast & cheapest variant of GPT-5.2" },
  { value: "openai/gpt-5.2-thinking",  label: "GPT-5.2 Thinking",  hint: "Balanced reasoning & speed" },
  { value: "openai/gpt-5.2-pro",       label: "GPT-5.2 Pro",       hint: "Highest capability in GPT-5.2 series" },
  { value: "openai/gpt-5-mini",        label: "GPT-5 Mini",        hint: "Smaller, cheaper mini model" },
  ],
  gemini: [
    { value: "google/gemini-3.1-pro",    label: "Gemini 3.1 Pro",    hint: "Top reasoning & multimodal model" },
    { value: "google/gemini-3-flash",    label: "Gemini 3 Flash",    hint: "Balanced speed & capability" },
    { value: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite", hint: "Fast & cost-efficient" },
    { value: "google/gemini-2.5-pro",   label: "Gemini 2.5 Pro",   hint: "Legacy model" },
  ],
  openrouter: [
    { value: "openrouter/minimax/minimax-m2.5",        label: "MiniMax M2.5",      hint: "Default" },
    { value: "openrouter/anthropic/claude-opus-4-5",   label: "Claude Opus 4.5",   hint: "Best quality" },
    { value: "openrouter/anthropic/claude-sonnet-4-5", label: "Claude Sonnet 4.5", hint: "Balanced" },
    { value: "openrouter/google/gemini-2.5-pro",       label: "Gemini 2.5 Pro",    hint: "Via OpenRouter" },
    { value: "openrouter/meta-llama/llama-4-maverick", label: "Llama 4 Maverick",  hint: "Open source" },
    { value: "openrouter/deepseek/deepseek-r2",        label: "DeepSeek R2",       hint: "Reasoning" },
  ],
};

export async function runSetup(): Promise<ProveConfig> {
  console.clear();

  p.intro(`  prove v${pkg.version}  `);

  p.note(
    "Let's get you set up in under a minute.\nYour config is saved to ~/.prove/config.json",
    "Welcome"
  );

  // ── Provider ─────────────────────────────────────────────────────────────
  const provider = await p.select<ModelProvider>({
    message: "Which AI provider do you want to use?",
    options: [
      {
        value: "openai",
        label: "OpenAI",
        hint: "GPT-5.2 and friends — needs OPENAI_API_KEY",
      },
      {
        value: "gemini",
        label: "Google Gemini",
        hint: "Gemini 3 Pro — needs GEMINI_API_KEY",
      },
      {
        value: "openrouter",
        label: "OpenRouter",
        hint: "100+ models via one key — needs OPENROUTER_API_KEY",
      },
    ],
  });

  if (p.isCancel(provider)) {
    p.cancel("Setup cancelled.");
    process.exit(0);
  }

  // ── API key ───────────────────────────────────────────────────────────────
  const keyLabel: Record<ModelProvider, string> = {
    openai: "OpenAI",
    gemini: "Google Gemini",
    openrouter: "OpenRouter",
  };

  const apiKey = await p.password({
    message: `Paste your ${keyLabel[provider]} API key`,
    validate(value) {
      if (!value.trim()) return "API key cannot be empty.";
      if (value.trim().length < 10) return "That doesn't look like a valid API key.";
    },
  });

  if (p.isCancel(apiKey)) {
    p.cancel("Setup cancelled.");
    process.exit(0);
  }

  // ── Model ─────────────────────────────────────────────────────────────────
  const model = await p.select<string>({
    message: "Which model do you want to use?",
    options: MODELS_BY_PROVIDER[provider],
  });

  if (p.isCancel(model)) {
    p.cancel("Setup cancelled.");
    process.exit(0);
  }

  // ── Role ──────────────────────────────────────────────────────────────────
  const role = await p.select<UserRole>({
    message: "What best describes your role?",
    options: [
      { value: "founder", label: "Founder" },
      { value: "product-manager", label: "Product Manager" },
      { value: "developer", label: "Developer" },
      { value: "designer", label: "Designer" },
      { value: "marketer", label: "Marketer" },
      { value: "researcher", label: "Researcher" },
      { value: "student", label: "Student" },
      { value: "other", label: "Other" },
    ],
  });

  if (p.isCancel(role)) {
    p.cancel("Setup cancelled.");
    process.exit(0);
  }

  const config: ProveConfig = {
    provider,
    apiKey: apiKey.trim(),
    model,
    role,
  };

  writeConfig(config);

  p.outro("Config saved! Run validate-idea again to start the server.");

  return config;
}
