import { z } from "zod";

export const ProblemStrengthSchema = z.object({
  frequency: z.enum(["unknown", "low", "moderate", "high"]).default("unknown"),
  urgency: z.enum(["unknown", "low", "moderate", "high"]).default("unknown"),
  willingness_to_pay: z
    .enum(["unknown", "low", "moderate", "high"])
    .default("unknown"),
});

export const ResearchDataSchema = z.object({
  enabled: z.boolean().default(false),
  queries: z.array(z.string()).default([]),
  evidence_summary: z.string().nullable().default(null),
  sources: z
    .array(
      z.object({
        url: z.string(),
        title: z.string(),
        snippet: z.string(),
      })
    )
    .default([]),
});

export const DecisionSchema = z
  .object({
    verdict: z.enum(["proceed", "pivot", "abandon", "needs_more_validation"]),
    confidence: z.number().min(0).max(100),
    reasoning: z.string(),
    next_step: z.string(),
    primary_risk: z.string(),
    biggest_unknown: z.string(),
    structural_weaknesses: z.array(z.string()),
  })
  .nullable();

export const TokenUsageSchema = z.object({
  input_tokens: z.number().int().nonnegative().default(0),
  output_tokens: z.number().int().nonnegative().default(0),
  total_tokens: z.number().int().nonnegative().default(0),
});

export const ProjectStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  idea: z.string(),
  stage: z
    .enum([
      "idea_capture",
      "clarity",
      "pain_urgency",
      "differentiation",
      "mvp_validation",
      "decision",
      "complete",
    ])
    .default("idea_capture"),
  summary: z.string().default(""),
  target_user: z.string().default(""),
  problem: z.string().default(""),
  problem_description: z.string().default(""),
  pain_points: z.array(z.string()).default([]),
  alternatives: z.array(z.string()).default([]),
  differentiation: z.string().default(""),
  risks_description: z.string().default(""),
  risks: z.array(z.string()).default([]),
  assumptions_description: z.string().default(""),
  assumptions: z.array(z.string()).default([]),
  experiments: z.array(z.string()).default([]),
  problem_strength: ProblemStrengthSchema.default({}),
  validation_readiness: z
    .enum(["early", "forming", "testable", "mvp_ready", "strong_hypothesis"])
    .default("early"),
  decision: DecisionSchema.default(null),
  token_usage: TokenUsageSchema.default({}),
  research: ResearchDataSchema.default({}),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
        timestamp: z.string(),
      })
    )
    .default([]),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProjectState = z.infer<typeof ProjectStateSchema>;
export type ProblemStrength = z.infer<typeof ProblemStrengthSchema>;
export type ResearchData = z.infer<typeof ResearchDataSchema>;
export type Decision = z.infer<typeof DecisionSchema>;
export type TokenUsage = z.infer<typeof TokenUsageSchema>;
