import type { EventBus } from "@prove.ink/events";
import type { EventName, EventMap } from "@prove.ink/core";

type SSEWriter = {
  writeSSE(data: { event: string; data: string; id?: string }): Promise<void>;
};

export class SSEManager {
  private connections = new Map<string, Set<SSEWriter>>();
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.setupListeners();
  }

  private setupListeners() {
    const events: EventName[] = [
      "state:updated",
      "stage:changed",
      "message:agent",
      "message:delta",
      "agent:activity",
      "message:user",
      "insights:updated",
      "research:started",
      "research:completed",
      "workflow:error",
    ];

    for (const event of events) {
      this.eventBus.on(event, (payload: EventMap[typeof event]) => {
        const projectId = (payload as { projectId: string }).projectId;
        this.broadcast(projectId, event, payload);
      });
    }
  }

  subscribe(projectId: string, writer: SSEWriter) {
    if (!this.connections.has(projectId)) {
      this.connections.set(projectId, new Set());
    }
    this.connections.get(projectId)!.add(writer);
  }

  unsubscribe(projectId: string, writer: SSEWriter) {
    const connections = this.connections.get(projectId);
    if (connections) {
      connections.delete(writer);
      if (connections.size === 0) {
        this.connections.delete(projectId);
      }
    }
  }

  private broadcast(projectId: string, event: string, data: unknown) {
    const connections = this.connections.get(projectId);
    if (!connections) return;

    for (const writer of connections) {
      writer
        .writeSSE({
          event,
          data: JSON.stringify(data),
          id: Date.now().toString(),
        })
        .catch(() => {
          this.unsubscribe(projectId, writer);
        });
    }
  }
}
