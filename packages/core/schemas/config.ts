import { z } from "zod";
import {
  DEFAULT_MODEL_BY_PROVIDER,
  SUPPORTED_MODEL_PROVIDERS,
} from "../constants/models.js";

export const ProviderConfigSchema = z.object({
  provider: z.enum(SUPPORTED_MODEL_PROVIDERS).default("openrouter"),
  model: z.string().default(DEFAULT_MODEL_BY_PROVIDER.openrouter),
  apiKey: z.string().min(1, "API key is required"),
  searchProvider: z
    .enum(["tavily", "searxng", "none"])
    .default("none"),
  searchApiKey: z.string().optional(),
});

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;
