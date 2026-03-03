import type { Engine, ChatResult } from "@prove.ink/engine";
import type { EventBus } from "@prove.ink/events";
import type { Logger } from "@prove.ink/logger";

export class ChatService {
  constructor(
    private engine: Engine,
    private eventBus: EventBus,
    private logger: Logger
  ) {}

  async startProject(projectId: string, idea: string): Promise<ChatResult> {
    try {
      return await this.engine.startProject(projectId, idea);
    } catch (err) {
      this.logger.error({ projectId, err }, "Failed to start project workflow");
      this.eventBus.emit("workflow:error", {
        projectId,
        error: (err as Error).message,
      });
      throw err;
    }
  }

  async resumeChat(projectId: string, message: string): Promise<ChatResult> {
    try {
      return await this.engine.resumeChat(projectId, message);
    } catch (err) {
      this.logger.error({ projectId, err }, "Failed to resume chat");
      this.eventBus.emit("workflow:error", {
        projectId,
        error: (err as Error).message,
      });
      throw err;
    }
  }

  async triggerResearch(
    projectId: string,
    queries?: string[]
  ): Promise<{ resultCount: number }> {
    try {
      return await this.engine.triggerResearch(projectId, queries);
    } catch (err) {
      this.logger.error({ projectId, err }, "Failed to trigger research");
      this.eventBus.emit("workflow:error", {
        projectId,
        error: (err as Error).message,
      });
      throw err;
    }
  }
}
