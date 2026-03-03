import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { PageShell } from "../components/layout/PageShell";
import { SplitPane } from "../components/layout/SplitPane";
import { InsightsPanel } from "../components/workspace/InsightsPanel";
import { ChatPanel } from "../components/workspace/ChatPanel";
import { Spinner } from "../components/ui/spinner";
import { useProject } from "../hooks/use-project";
import { useChat } from "../hooks/use-chat";
import { useSSE } from "../hooks/use-sse";
import { useProjectStore } from "../stores/project-store";

export function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, messages, isLoading } = useProject(id);
  const { send, retryFailed, isSending } = useChat();
  const {
    triggerResearch,
    isBootstrapping,
    streamingAgentMessage,
    toolActivity,
    connectionStatus,
    reconnectAttempts,
    error,
    lastFailedMessage,
  } = useProjectStore();

  const { retryConnection } = useSSE(id);

  useEffect(() => {
    if (!project || !id) return;
    if (project.stage === "complete") {
      navigate(`/project/${id}/verdict`, { replace: true });
    }
  }, [project, id, navigate]);

  if (isLoading || !project) {
    return (
      <PageShell>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  if (project.stage === "complete") return null;

  return (
    <PageShell>
      <SplitPane
        left={
          <InsightsPanel
            project={project}
            onTriggerResearch={() => triggerResearch()}
            researchCount={project.research.sources.length || undefined}
          />
        }
        right={
          <ChatPanel
            messages={messages}
            streamingMessage={streamingAgentMessage}
            toolActivity={toolActivity}
            connectionStatus={connectionStatus}
            reconnectAttempts={reconnectAttempts}
            error={error}
            hasFailedMessage={!!lastFailedMessage}
            onRetryMessage={retryFailed}
            onRetryConnection={retryConnection}
            onSend={send}
            isSending={isSending}
            isBootstrapping={isBootstrapping}
          />
        }
      />
    </PageShell>
  );
}
