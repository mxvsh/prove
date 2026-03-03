import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export type ModelProvider = "openai" | "gemini" | "openrouter";

export type UserRole =
  | "developer"
  | "founder"
  | "product-manager"
  | "designer"
  | "marketer"
  | "researcher"
  | "student"
  | "other";

export interface ProveConfig {
  provider: ModelProvider;
  apiKey: string;
  model: string;
  role: UserRole;
}

export function getProveDir(): string {
  return join(homedir(), ".prove");
}

export function getConfigPath(): string {
  return join(getProveDir(), "config.json");
}

export function getErrorLogPath(): string {
  return join(getProveDir(), "error.log");
}

export function ensureProveDir(): void {
  const dir = getProveDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function readConfig(): ProveConfig | null {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) return null;

  try {
    const raw = readFileSync(configPath, "utf-8");
    return JSON.parse(raw) as ProveConfig;
  } catch {
    return null;
  }
}

export function writeConfig(config: ProveConfig): void {
  ensureProveDir();
  writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), "utf-8");
}
