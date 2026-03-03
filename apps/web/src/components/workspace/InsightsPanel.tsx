import { HugeiconsIcon } from "@hugeicons/react";
import {
  BulbIcon,
  UserIcon,
  Alert01Icon,
  Alert02Icon,
  ArrowDataTransferHorizontalIcon,
  StarIcon,
  AlertDiamondIcon,
  BrainIcon,
  TestTube01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import type { ProjectState } from "@prove.ink/core";
import { CollapsibleSection } from "../ui/collapsible";
import { Button } from "../ui/button";
import { ProgressBar } from "./ProgressBar";
import { formatDate } from "../../lib/utils";

interface InsightsPanelProps {
  project: ProjectState;
  onTriggerResearch: () => void;
  researchCount?: number;
}

function formatInsightText(content: string) {
  return content
    // Break inline numbered points: "... 1. x 2. y" -> "... \n1. x\n2. y"
    .replace(/\s+(\d+\.\s)/g, "\n$1")
    .trim();
}

export function InsightsPanel({
  project,
  onTriggerResearch,
  researchCount,
}: InsightsPanelProps) {
  const sections = [
    {
      icon: <HugeiconsIcon icon={BulbIcon} size={20} />,
      title: "Idea Summary",
      content: project.summary || project.idea,
      defaultOpen: true,
    },
    {
      icon: <HugeiconsIcon icon={UserIcon} size={20} />,
      title: "Target User",
      content: project.target_user,
    },
    {
      icon: <HugeiconsIcon icon={Alert01Icon} size={20} />,
      title: "Problem Statement",
      description: project.problem_description || project.problem,
      content: project.pain_points,
    },
    {
      icon: <HugeiconsIcon icon={Alert02Icon} size={20} />,
      title: "Pain Points",
      content: project.pain_points,
    },
    {
      icon: <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} size={20} />,
      title: "Alternatives",
      content: project.alternatives,
    },
    {
      icon: <HugeiconsIcon icon={StarIcon} size={20} />,
      title: "Differentiation",
      content: project.differentiation,
    },
    {
      icon: <HugeiconsIcon icon={AlertDiamondIcon} size={20} />,
      title: "Key Risks",
      description: project.risks_description,
      content: project.risks,
    },
    {
      icon: <HugeiconsIcon icon={BrainIcon} size={20} />,
      title: "Assumptions",
      description: project.assumptions_description,
      content: project.assumptions,
    },
    {
      icon: <HugeiconsIcon icon={TestTube01Icon} size={20} />,
      title: "Validation Experiments",
      content: project.experiments,
    },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <ProgressBar stage={project.stage} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fg dark:text-fg-dark mb-2">
          {project.name}
        </h1>
        <p className="text-fg-muted text-sm">
          Created {formatDate(project.created_at)}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section) => {
          const hasContent = Array.isArray(section.content)
            ? section.content.length > 0
            : !!section.content;

          return (
            <CollapsibleSection
              key={section.title}
              icon={section.icon}
              title={section.title}
              defaultOpen={section.defaultOpen}
              empty={!hasContent}
            >
              {!hasContent ? (
                <p className="italic text-fg-subtle">
                  Will be filled as the conversation progresses...
                </p>
              ) : Array.isArray(section.content) ? (
                <div>
                  {section.description && (
                    <p className="mb-2 whitespace-pre-wrap leading-relaxed text-fg-muted">
                      {formatInsightText(section.description)}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {section.content.map((item, i) => (
                      <li key={i}>- {item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {formatInsightText(section.content)}
                </p>
              )}
            </CollapsibleSection>
          );
        })}
      </div>

      {/* Research toggle */}
      <div className="mt-6 p-4 rounded-xl border border-border dark:border-border-dark bg-surface-hover dark:bg-surface-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Search01Icon} size={20} className="text-primary" />
            <div>
              <p className="text-sm font-medium text-fg dark:text-fg-dark">
                Demand Research
              </p>
              <p className="text-xs text-fg-subtle">
                Search for real-world demand signals
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onTriggerResearch}>
            {researchCount ? `${researchCount} results` : "Research"}
          </Button>
        </div>
      </div>
    </div>
  );
}
