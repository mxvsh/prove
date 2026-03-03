import type { ProjectState } from "@prove.ink/core";

const BASE = "/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Request failed: ${res.status}`
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  createProject(idea: string) {
    return request<ProjectState>("/projects", {
      method: "POST",
      body: JSON.stringify({ idea }),
    });
  },

  listProjects() {
    return request<{ projects: ProjectState[] }>("/projects");
  },

  getProject(id: string) {
    return request<ProjectState>(`/projects/${id}`);
  },

  deleteProject(id: string) {
    return request<{ success: boolean }>(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  sendMessage(projectId: string, message: string) {
    return request<{
      response: string;
      stage: string;
      isComplete: boolean;
    }>(`/projects/${projectId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  appendMessage(
    projectId: string,
    message: { role: "user" | "assistant"; content: string; timestamp: string }
  ) {
    return request<{ success: boolean }>(`/projects/${projectId}/messages`, {
      method: "POST",
      body: JSON.stringify(message),
    });
  },

  triggerResearch(projectId: string, queries?: string[]) {
    return request<{ resultCount: number }>(
      `/projects/${projectId}/research`,
      {
        method: "POST",
        body: JSON.stringify({ queries }),
      }
    );
  },

  getConfig() {
    return request<{
      provider: string;
      model: string;
      searchProvider: string;
      hasApiKey: boolean;
    }>("/config/provider");
  },

  updateConfig(config: {
    provider?: string;
    model?: string;
    searchProvider?: string;
  }) {
    return request<{ success: boolean }>("/config/provider", {
      method: "POST",
      body: JSON.stringify(config),
    });
  },
};
