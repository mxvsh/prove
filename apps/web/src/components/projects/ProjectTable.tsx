import { HugeiconsIcon } from "@hugeicons/react";
import { FolderOpenIcon } from "@hugeicons/core-free-icons";
import type { ProjectState } from "@prove.ink/core";
import { ProjectRow } from "./ProjectRow";

interface ProjectTableProps {
  projects: ProjectState[];
  onDelete: (id: string) => void;
}

export function ProjectTable({ projects, onDelete }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <HugeiconsIcon
          icon={FolderOpenIcon}
          size={48}
          className="text-fg-subtle mx-auto mb-4"
        />
        <p className="text-fg-muted-dark text-lg">No projects yet</p>
        <p className="text-fg-subtle text-sm mt-1">
          Start by validating your first idea
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-dark rounded-2xl border border-border-dark overflow-hidden shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-dark bg-bg-dark/50">
              <th className="px-6 py-4 text-xs font-semibold text-fg-muted-dark uppercase tracking-wider w-[25%]">
                Project Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-fg-muted-dark uppercase tracking-wider w-[35%]">
                Idea Preview
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-fg-muted-dark uppercase tracking-wider w-[15%]">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-fg-muted-dark uppercase tracking-wider w-[15%]">
                Last Updated
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-fg-muted-dark uppercase tracking-wider w-[10%] text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
