import { useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderOpenIcon, Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";

export function ActionFooter() {
  const navigate = useNavigate();

  return (
    <div className="mt-12 pt-8 border-t border-border dark:border-border-dark flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col gap-1 text-center md:text-left">
        <h4 className="font-semibold text-fg dark:text-fg-dark">
          Ready for the next step?
        </h4>
        <p className="text-sm text-fg-muted">
          Start a new validation or review your projects.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Button variant="secondary" size="lg" onClick={() => navigate("/projects")}>
          <HugeiconsIcon icon={FolderOpenIcon} size={18} />
          All Projects
        </Button>
        <Button size="lg" onClick={() => navigate("/")}>
          <HugeiconsIcon icon={Add01Icon} size={18} />
          New Idea
        </Button>
      </div>
    </div>
  );
}
