export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  source?: string;
}

export interface SearchProvider {
  name: string;
  search(query: string, maxResults?: number): Promise<SearchResult[]>;
}
