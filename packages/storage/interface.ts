import type { ProjectState } from "@prove.ink/core";

export interface StorageProvider {
  createProject(state: ProjectState): Promise<void>;
  getProject(id: string): Promise<ProjectState | null>;
  updateProject(id: string, partial: Partial<ProjectState>): Promise<ProjectState>;
  deleteProject(id: string): Promise<void>;
  listProjects(): Promise<ProjectState[]>;
  appendMessage(
    id: string,
    message: { role: "user" | "assistant"; content: string; timestamp: string }
  ): Promise<void>;
}
