import { Link } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function RecentProjects() {
  return (
    <footer className="flex justify-center py-8">
      <Link
        to="/projects"
        className="group flex items-center gap-1.5 text-fg-subtle hover:text-primary text-sm font-medium transition-colors"
      >
        <span>Recent projects</span>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Link>
    </footer>
  );
}
