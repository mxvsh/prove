import { create } from "zustand";
import type { ProjectState, Stage } from "@prove.ink/core";
import { api } from "../lib/api-client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ProjectStore {
  projects: ProjectState[];
  currentProject: ProjectState | null;
  messages: Message[];
  streamingAgentMessage: string;
  toolActivity: string[];
  connectionStatus: "connected" | "reconnecting" | "disconnected";
  reconnectAttempts: number;
  lastFailedMessage: string | null;
  isLoading: boolean;
  isSending: boolean;
  isBootstrapping: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProject: (id: string, options?: { silent?: boolean }) => Promise<void>;
  createProject: (idea: string) => Promise<ProjectState>;
  deleteProject: (id: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  triggerResearch: (queries?: string[]) => Promise<void>;
  retryLastMessage: () => Promise<void>;

  // SSE handlers
  setStreamingAgentMessage: (content: string) => void;
  addToolActivity: (activity: string) => void;
  clearToolActivity: () => void;
  setConnectionState: (
    status: "connected" | "reconnecting" | "disconnected",
    attempts?: number
  ) => void;
  addAgentMessage: (content: string, timestamp: string) => void;
  updateStage: (stage: Stage) => void;
  updateState: (state: Partial<ProjectState>) => void;
  setError: (error: string | null) => void;
}

function mergeMessages(
  current: Message[],
  incoming: Message[] | undefined
): Message[] {
  const merged = [...current];
  for (const msg of incoming ?? []) {
    const exists = merged.some(
      (m) =>
        m.role === msg.role &&
        m.content === msg.content &&
        m.timestamp === msg.timestamp
    );
    if (!exists) merged.push(msg);
  }

  return merged.sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  messages: [],
  streamingAgentMessage: "",
  toolActivity: [],
  connectionStatus: "connected",
  reconnectAttempts: 0,
  lastFailedMessage: null,
  isLoading: false,
  isSending: false,
  isBootstrapping: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { projects } = await api.listProjects();
      set({ projects, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchProject: async (id: string, options) => {
    if (!options?.silent) {
      set({ isLoading: true, error: null });
    } else {
      set({ error: null });
    }
    try {
      const project = await api.getProject(id);
      set((state) => {
        const messages = mergeMessages(state.messages, project.messages);
        return {
          currentProject: { ...project, messages },
          messages,
          streamingAgentMessage: "",
          toolActivity: [],
          isBootstrapping: messages.every((m) => m.role !== "assistant"),
          isLoading: options?.silent ? state.isLoading : false,
        };
      });
    } catch (err) {
      set({
        error: (err as Error).message,
        isLoading: options?.silent ? get().isLoading : false,
      });
    }
  },

  createProject: async (idea: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await api.createProject(idea);
      set((state) => ({
        projects: [project, ...state.projects],
        currentProject: project,
        messages: project.messages ?? [],
        streamingAgentMessage: "",
        toolActivity: [],
        lastFailedMessage: null,
        isBootstrapping: true,
        isLoading: false,
      }));
      return project;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  deleteProject: async (id: string) => {
    try {
      await api.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject:
          state.currentProject?.id === id ? null : state.currentProject,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  sendMessage: async (message: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const userMsg: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

      set((state) => ({
        messages: [...state.messages, userMsg],
        streamingAgentMessage: "",
        toolActivity: [],
        isSending: true,
        isBootstrapping: false,
        lastFailedMessage: null,
        error: null,
      }));

    try {
      await api.sendMessage(currentProject.id, message);

      set(() => ({
        isSending: false,
        isBootstrapping: false,
      }));
    } catch (err) {
      set({
        error: (err as Error).message,
        isSending: false,
        lastFailedMessage: message,
      });
    }
  },

  triggerResearch: async (queries?: string[]) => {
    const { currentProject } = get();
    if (!currentProject) return;
    try {
      await api.triggerResearch(currentProject.id, queries);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  retryLastMessage: async () => {
    const failed = get().lastFailedMessage;
    if (!failed) return;
    await get().sendMessage(failed);
  },

  setStreamingAgentMessage: (content: string) => {
    set({ streamingAgentMessage: content, isBootstrapping: false, error: null });
  },

  addToolActivity: (activity: string) => {
    const normalized = activity
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!normalized) return;
    set({
      toolActivity: [normalized[0].toUpperCase() + normalized.slice(1)],
    });
  },

  clearToolActivity: () => {
    set({ toolActivity: [] });
  },

  setConnectionState: (status, attempts = 0) => {
    set({ connectionStatus: status, reconnectAttempts: attempts });
  },

  addAgentMessage: (content: string, timestamp: string) => {
    set((state) => {
      const alreadyExists = state.messages.some(
        (m) =>
          m.role === "assistant" &&
          m.content === content &&
          m.timestamp === timestamp
      );
      if (alreadyExists) return state;

      const nextMessages = [
        ...state.messages,
        { role: "assistant" as const, content, timestamp },
      ];

      return {
        messages: nextMessages,
        streamingAgentMessage: "",
        toolActivity: [],
        lastFailedMessage: null,
        isBootstrapping: false,
        currentProject: state.currentProject
          ? { ...state.currentProject, messages: nextMessages }
          : null,
      };
    });
  },

  updateStage: (stage: Stage) => {
    set((state) => ({
      currentProject: state.currentProject
        ? { ...state.currentProject, stage }
        : null,
    }));
  },

  updateState: (partial: Partial<ProjectState>) => {
    set((state) => ({
      currentProject: state.currentProject
        ? { ...state.currentProject, ...partial }
        : null,
    }));
  },

  setError: (error: string | null) =>
    set({ error, isBootstrapping: false, streamingAgentMessage: "" }),
}));
