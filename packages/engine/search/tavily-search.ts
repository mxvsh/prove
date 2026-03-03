import type { SearchProvider, SearchResult } from "@prove.ink/core";

export class TavilySearchProvider implements SearchProvider {
  name = "tavily";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, maxResults = 5): Promise<SearchResult[]> {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: this.apiKey,
        query,
        max_results: maxResults,
        search_depth: "basic",
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily search failed: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      results: Array<{ url: string; title: string; content: string }>;
    };

    return data.results.map((r) => ({
      url: r.url,
      title: r.title,
      snippet: r.content.slice(0, 300),
      source: "tavily",
    }));
  }
}
