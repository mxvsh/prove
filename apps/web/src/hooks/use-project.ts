import { useEffect } from "react";
import { useProjectStore } from "../stores/project-store";

export function useProject(id: string | undefined) {
  const {
    currentProject,
    messages,
    isLoading,
    error,
    fetchProject,
  } = useProjectStore();

  useEffect(() => {
    if (id) fetchProject(id);
  }, [id, fetchProject]);

  return { project: currentProject, messages, isLoading, error };
}
