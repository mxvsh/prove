import type { Stage } from "./stages.js";

export interface EventMap {
  "state:updated": { projectId: string; state: Record<string, unknown> };
  "stage:changed": { projectId: string; from: Stage; to: Stage };
  "message:agent": {
    projectId: string;
    content: string;
    timestamp: string;
  };
  "message:delta": {
    projectId: string;
    delta: string;
    content: string;
  };
  "agent:activity": {
    projectId: string;
    phase: "thinking" | "tool_call" | "tool_result";
    message: string;
    toolName?: string;
  };
  "message:user": {
    projectId: string;
    content: string;
    timestamp: string;
  };
  "insights:updated": {
    projectId: string;
    section: string;
    content: string | string[];
  };
  "research:started": { projectId: string; queries: string[] };
  "research:completed": { projectId: string; resultCount: number };
  "workflow:error": { projectId: string; error: string };
}

export type EventName = keyof EventMap;
