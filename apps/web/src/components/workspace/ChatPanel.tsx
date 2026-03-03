import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MessageMultiple01Icon } from "@hugeicons/core-free-icons";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Button } from "../ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  messages: Message[];
  streamingMessage: string;
  toolActivity: string[];
  connectionStatus: "connected" | "reconnecting" | "disconnected";
  reconnectAttempts: number;
  error: string | null;
  hasFailedMessage: boolean;
  onRetryMessage: () => Promise<void>;
  onRetryConnection: () => void;
  onSend: (message: string) => void;
  isSending: boolean;
  isBootstrapping: boolean;
}

export function ChatPanel({
  messages,
  streamingMessage,
  toolActivity,
  connectionStatus,
  reconnectAttempts,
  error,
  hasFailedMessage,
  onRetryMessage,
  onRetryConnection,
  onSend,
  isSending,
  isBootstrapping,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevMessageCountRef = useRef(0);
  const latestToolActivity = toolActivity[toolActivity.length - 1] ?? "";
  const isToolUpdating = latestToolActivity.startsWith("Updating ");
  const showTypingIndicator =
    (isSending || isBootstrapping) && !streamingMessage;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 96;
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const messageCountIncreased = messages.length > prevMessageCountRef.current;
    if (messageCountIncreased && lastMessage?.role === "user") {
      shouldAutoScrollRef.current = true;
    }

    if (scrollRef.current && shouldAutoScrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    prevMessageCountRef.current = messages.length;
  }, [messages, streamingMessage, isSending]);

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-10 flex flex-col items-center"
      >
        <div className="w-full max-w-2xl flex flex-col gap-8 pb-32">
          {connectionStatus !== "connected" && (
            <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-fg-dark">
              {connectionStatus === "reconnecting"
                ? `Connection lost. Reconnecting (attempt ${reconnectAttempts})...`
                : "Server appears offline. Streaming updates are paused."}
              <div className="mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onRetryConnection}
                >
                  Retry connection
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-fg-dark">
              {error}
              {hasFailedMessage && (
                <div className="mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void onRetryMessage()}
                  >
                    Retry message
                  </Button>
                </div>
              )}
            </div>
          )}

          {messages.length === 0 && !isSending && !isBootstrapping && (
            <div className="text-center py-20">
              <HugeiconsIcon
                icon={MessageMultiple01Icon}
                size={48}
                className="text-fg-subtle mx-auto mb-4"
              />
              <p className="text-fg-muted-dark">
                Waiting for the AI to start the conversation...
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {showTypingIndicator && <TypingIndicator />}
          {(streamingMessage || (toolActivity.length > 0 && (isSending || isBootstrapping))) && (
            <div className="flex flex-col gap-1.5">
              {streamingMessage && (
                <ChatMessage role="assistant" content={streamingMessage} />
              )}
              {toolActivity.length > 0 && (isSending || isBootstrapping) && (
                <div className="ml-14 text-xs text-fg-subtle">
                  <span className={isToolUpdating ? "status-shine font-medium" : ""}>
                    {latestToolActivity}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ChatInput onSend={onSend} disabled={isSending || isBootstrapping} />
    </>
  );
}
