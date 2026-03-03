import { randomBytes } from "node:crypto";
import {
  ProjectStateSchema,
  IdeaInputSchema,
  NotFoundError,
  type ProjectState,
} from "@prove.ink/core";
import type { StorageProvider } from "@prove.ink/storage";
import type { Logger } from "@prove.ink/logger";

function generateProjectId(): string {
  const adjectives = [
    "iron", "swift", "bold", "calm", "dark",
    "keen", "wild", "pure", "warm", "cool",
  ];
  const nouns = [
    "mango", "eagle", "river", "flame", "cloud",
    "cedar", "pearl", "steel", "frost", "coral",
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = randomBytes(2).readUInt16BE(0) % 10000;
  return `${adj}-${noun}-${num.toString().padStart(4, "0")}`;
}

function generateProjectName(idea: string): string {
  const words = idea.split(/\s+/).slice(0, 4);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export class ProjectService {
  constructor(
    private storage: StorageProvider,
    private logger: Logger
  ) {}

  async create(idea: string): Promise<ProjectState> {
    IdeaInputSchema.parse({ idea });

    const id = generateProjectId();
    const now = new Date().toISOString();

    const state = ProjectStateSchema.parse({
      id,
      name: generateProjectName(idea),
      idea,
      stage: "idea_capture",
      messages: [{ role: "user", content: idea, timestamp: now }],
      created_at: now,
      updated_at: now,
    });

    await this.storage.createProject(state);
    this.logger.info({ projectId: id }, "Project created");
    return state;
  }

  async get(id: string): Promise<ProjectState> {
    const project = await this.storage.getProject(id);
    if (!project) throw new NotFoundError(`Project ${id} not found`);
    return project;
  }

  async list(): Promise<ProjectState[]> {
    return this.storage.listProjects();
  }

  async delete(id: string): Promise<void> {
    await this.storage.deleteProject(id);
  }

  async appendMessage(
    id: string,
    message: { role: "user" | "assistant"; content: string; timestamp: string }
  ): Promise<void> {
    const project = await this.storage.getProject(id);
    if (!project) throw new NotFoundError(`Project ${id} not found`);
    await this.storage.appendMessage(id, message);
  }
}
