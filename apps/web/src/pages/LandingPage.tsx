import { useRef } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../components/layout/PageShell";
import { IdeaInput } from "../components/landing/IdeaInput";
import { RecentProjects } from "../components/landing/RecentProjects";
import { useProjectStore } from "../stores/project-store";

export function LandingPage() {
  const navigate = useNavigate();
  const { createProject, isLoading } = useProjectStore();
  const submittingRef = useRef(false);

  const handleSubmit = async (idea: string) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      const project = await createProject(idea);
      navigate(`/project/${project.id}`);
    } catch {
      submittingRef.current = false;
      // Error is handled in the store
    }
  };

  return (
    <PageShell hideHeader>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="flex items-center justify-center py-8 px-10">
          <div className="flex items-center gap-2 text-primary">
            <img src="/prove.png" alt="Prove Logo" className="w-10 h-10 rounded-lg" />
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 w-full max-w-4xl mx-auto">
          <IdeaInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <RecentProjects />
      </div>
    </PageShell>
  );
}
