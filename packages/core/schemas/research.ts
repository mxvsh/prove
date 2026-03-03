import { z } from "zod";

export const SearchResultSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  snippet: z.string(),
  source: z.string().optional(),
});

export const ResearchRequestSchema = z.object({
  projectId: z.string(),
  queries: z.array(z.string()).optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
export type ResearchRequest = z.infer<typeof ResearchRequestSchema>;
