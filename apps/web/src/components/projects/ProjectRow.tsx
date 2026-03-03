import { useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { BulbIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import type { ProjectState } from "@prove.ink/core";
import { StatusBadge } from "./StatusBadge";
import { IconButton } from "../ui/icon-button";
import { formatDate } from "../../lib/utils";

interface ProjectRowProps {
  project: ProjectState;
  onDelete: (id: string) => void;
}

export function ProjectRow({ project, onDelete }: ProjectRowProps) {
  const navigate = useNavigate();

  return (
    <tr
      className="group hover:bg-surface-dark-hover transition-colors cursor-pointer"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary-light flex items-center justify-center text-primary">
            <HugeiconsIcon icon={BulbIcon} size={20} />
          </div>
          <div>
            <p className="text-fg-dark font-medium text-sm">{project.name}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="text-fg-muted-dark text-sm line-clamp-2 leading-relaxed">
          {project.idea}
        </p>
      </td>
      <td className="px-6 py-5">
        <StatusBadge stage={project.stage} />
      </td>
      <td className="px-6 py-5">
        <p className="text-fg-muted-dark text-sm">
          {formatDate(project.updated_at)}
        </p>
      </td>
      <td className="px-6 py-5 text-right">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
        >
          <HugeiconsIcon icon={Delete02Icon} size={18} />
        </IconButton>
      </td>
    </tr>
  );
}
