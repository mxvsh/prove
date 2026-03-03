type SSEHandler = (event: string, data: unknown) => void;

export class SSEClient {
  private eventSource: EventSource | null = null;
  private projectId: string;
  private handlers: SSEHandler[] = [];
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private manualDisconnect = false;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  connect() {
    if (this.eventSource) this.disconnect();
    this.manualDisconnect = false;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ??
      (import.meta.env.DEV ? "http://localhost:8674" : "");

    this.eventSource = new EventSource(
      `${baseUrl}/api/projects/${this.projectId}/stream`
    );

    const events = [
      "connected",
      "state:updated",
      "stage:changed",
      "message:delta",
      "message:agent",
      "agent:activity",
      "message:user",
      "insights:updated",
      "research:started",
      "research:completed",
      "workflow:error",
      "heartbeat",
    ];

    for (const event of events) {
      this.eventSource.addEventListener(event, (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data);
          for (const handler of this.handlers) {
            handler(event, data);
          }
        } catch {
          // ignore parse errors
        }
      });
    }

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0;
      this.emitLocal("connection:open", { attempts: 0 });
    };

    this.eventSource.onerror = () => {
      if (this.manualDisconnect) return;

      this.reconnectAttempts += 1;
      this.emitLocal("connection:reconnecting", {
        attempts: this.reconnectAttempts,
      });
      this.eventSource?.close();
      this.eventSource = null;

      if (this.reconnectAttempts >= 4) {
        this.emitLocal("connection:down", {
          attempts: this.reconnectAttempts,
        });
      }

      const delayMs = Math.min(this.reconnectAttempts * 1000, 5000);
      this.reconnectTimeout = setTimeout(() => this.connect(), delayMs);
    };
  }

  private emitLocal(event: string, data: unknown) {
    for (const handler of this.handlers) {
      handler(event, data);
    }
  }

  onEvent(handler: SSEHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  disconnect() {
    this.manualDisconnect = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.eventSource?.close();
    this.eventSource = null;
    this.handlers = [];
  }
}
