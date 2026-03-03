import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { PageShell } from "../components/layout/PageShell";
import { ProjectTable } from "../components/projects/ProjectTable";
import { FilterTabs } from "../components/projects/FilterTabs";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { useProjectStore } from "../stores/project-store";

export function ProjectListPage() {
  const navigate = useNavigate();
  const { projects, fetchProjects, deleteProject, isLoading } =
    useProjectStore();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((p) => {
    if (filter === "All") return true;
    if (filter === "In Progress") return p.stage !== "complete";
    if (filter === "Validated") return p.stage === "complete";
    return true;
  });

  return (
    <PageShell>
      <main className="flex-1 px-4 sm:px-10 py-8 max-w-[1200px] mx-auto w-full overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-fg dark:text-fg-dark text-3xl md:text-4xl font-bold tracking-tight">
              Your Projects
            </h1>
            <p className="text-fg-muted text-base font-normal max-w-xl">
              Review past validations, manage current experiments, and
              iterate on your startup ideas.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <FilterTabs active={filter} onChange={setFilter} />
            <Button size="md" onClick={() => navigate("/")}>
              <HugeiconsIcon icon={Add01Icon} size={18} />
              <span>New Project</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <ProjectTable
            projects={filteredProjects}
            onDelete={deleteProject}
          />
        )}
      </main>
    </PageShell>
  );
}
