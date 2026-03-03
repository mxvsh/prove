import { z } from "zod";

export const InsightSectionSchema = z.enum([
  "summary",
  "target_user",
  "problem",
  "problem_description",
  "pain_points",
  "alternatives",
  "differentiation",
  "risks_description",
  "risks",
  "assumptions_description",
  "assumptions",
  "experiments",
]);

export const InsightUpdateSchema = z.object({
  section: InsightSectionSchema,
  content: z.union([z.string(), z.array(z.string())]),
});

export type InsightSection = z.infer<typeof InsightSectionSchema>;
export type InsightUpdate = z.infer<typeof InsightUpdateSchema>;
