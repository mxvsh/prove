import { useCallback, useEffect, useRef } from "react";
import { SSEClient } from "../lib/sse-client";
import { useProjectStore } from "../stores/project-store";
import type { Stage } from "@prove.ink/core";

export function useSSE(projectId: string | undefined) {
  const clientRef = useRef<SSEClient | null>(null);
  const {
    addAgentMessage,
    setStreamingAgentMessage,
    addToolActivity,
    clearToolActivity,
    setConnectionState,
    updateStage,
    updateState,
    setError,
  } = useProjectStore();

  const retryConnection = useCallback(() => {
    clientRef.current?.connect();
  }, []);

  useEffect(() => {
    if (!projectId) return;

    const client = new SSEClient(projectId);
    clientRef.current = client;

    client.onEvent((event, data) => {
      switch (event) {
        case "connected": {
          break;
        }
        case "message:delta": {
          const { content } = data as { content: string };
          setStreamingAgentMessage(content);
          break;
        }
        case "agent:activity": {
          const { message, phase } = data as {
            message: string;
            phase?: "thinking" | "tool_call" | "tool_result";
          };
          if (phase === "tool_result") {
            clearToolActivity();
          } else if (phase === "tool_call") {
            addToolActivity(message);
          }
          break;
        }
        case "message:agent": {
          const { content, timestamp } = data as {
            content: string;
            timestamp: string;
          };
          addAgentMessage(content, timestamp);
          break;
        }
        case "connection:open": {
          setConnectionState("connected", 0);
          break;
        }
        case "connection:reconnecting": {
          const { attempts } = data as { attempts: number };
          setConnectionState("reconnecting", attempts);
          break;
        }
        case "connection:down": {
          const { attempts } = data as { attempts: number };
          setConnectionState("disconnected", attempts);
          break;
        }
        case "stage:changed": {
          const { to } = data as { to: Stage };
          updateStage(to);
          break;
        }
        case "state:updated": {
          const { state } = data as { state: Record<string, unknown> };
          updateState(state as never);
          break;
        }
        case "insights:updated": {
          const { section, content } = data as {
            section: string;
            content: string | string[];
          };
          updateState({ [section]: content } as never);
          break;
        }
        case "workflow:error": {
          const { error } = data as { error: string };
          setError(error);
          break;
        }
        case "research:completed": {
          break;
        }
      }
    });

    client.connect();

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, [
    projectId,
    addAgentMessage,
    setStreamingAgentMessage,
    addToolActivity,
    clearToolActivity,
    setConnectionState,
    updateStage,
    updateState,
    setError,
  ]);

  return { retryConnection };
}
