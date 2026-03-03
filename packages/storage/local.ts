import { mkdir, readFile, writeFile, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import {
  ProjectStateSchema,
  StorageError,
  BASE_DIR,
  type ProjectState,
} from "@prove.ink/core";
import type { Logger } from "@prove.ink/logger";
import type { StorageProvider } from "./interface.js";

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private logger: Logger;

  constructor(logger: Logger, baseDir?: string) {
    this.baseDir = baseDir ?? join(process.env.HOME ?? ".", BASE_DIR);
    this.logger = logger;
  }

  private projectDir(id: string): string {
    return join(this.baseDir, id);
  }

  private stateFile(id: string): string {
    return join(this.projectDir(id), "state.json");
  }

  async createProject(state: ProjectState): Promise<void> {
    const dir = this.projectDir(state.id);
    try {
      await mkdir(dir, { recursive: true });
      await writeFile(this.stateFile(state.id), JSON.stringify(state, null, 2));
      this.logger.info({ projectId: state.id }, "Project created");
    } catch (err) {
      throw new StorageError(
        `Failed to create project ${state.id}: ${(err as Error).message}`
      );
    }
  }

  async getProject(id: string): Promise<ProjectState | null> {
    const file = this.stateFile(id);
    if (!existsSync(file)) return null;
    try {
      const raw = await readFile(file, "utf-8");
      return ProjectStateSchema.parse(JSON.parse(raw));
    } catch (err) {
      throw new StorageError(
        `Failed to read project ${id}: ${(err as Error).message}`
      );
    }
  }

  async updateProject(
    id: string,
    partial: Partial<ProjectState>
  ): Promise<ProjectState> {
    const existing = await this.getProject(id);
    if (!existing) {
      throw new StorageError(`Project ${id} not found`);
    }
    const updated = {
      ...existing,
      ...partial,
      updated_at: new Date().toISOString(),
    };
    const validated = ProjectStateSchema.parse(updated);
    await writeFile(this.stateFile(id), JSON.stringify(validated, null, 2));
    this.logger.debug({ projectId: id }, "Project updated");
    return validated;
  }

  async deleteProject(id: string): Promise<void> {
    const dir = this.projectDir(id);
    if (!existsSync(dir)) {
      throw new StorageError(`Project ${id} not found`);
    }
    try {
      await rm(dir, { recursive: true });
      this.logger.info({ projectId: id }, "Project deleted");
    } catch (err) {
      throw new StorageError(
        `Failed to delete project ${id}: ${(err as Error).message}`
      );
    }
  }

  async listProjects(): Promise<ProjectState[]> {
    if (!existsSync(this.baseDir)) {
      await mkdir(this.baseDir, { recursive: true });
      return [];
    }
    try {
      const entries = await readdir(this.baseDir, { withFileTypes: true });
      const projects: ProjectState[] = [];
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const project = await this.getProject(entry.name);
          if (project) projects.push(project);
        }
      }
      return projects.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } catch (err) {
      throw new StorageError(
        `Failed to list projects: ${(err as Error).message}`
      );
    }
  }

  async appendMessage(
    id: string,
    message: { role: "user" | "assistant"; content: string; timestamp: string }
  ): Promise<void> {
    const existing = await this.getProject(id);
    if (!existing) {
      throw new StorageError(`Project ${id} not found`);
    }
    existing.messages.push(message);
    await this.updateProject(id, { messages: existing.messages });
  }
}
