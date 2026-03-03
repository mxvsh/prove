import { z } from "zod";

export const IdeaInputSchema = z.object({
  idea: z
    .string()
    .min(10, "Idea must be at least 10 characters")
    .max(500, "Idea must be under 500 characters"),
});

export type IdeaInput = z.infer<typeof IdeaInputSchema>;
