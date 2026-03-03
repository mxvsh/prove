import { useParams } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  BulbIcon,
  Target01Icon,
  AnalyticsUpIcon,
  ChartLineData01Icon,
  ArrowDataTransferHorizontalIcon,
  BrainIcon,
  TestTube01Icon,
  AlertDiamondIcon,
} from "@hugeicons/core-free-icons";
import { PageShell } from "../components/layout/PageShell";
import { ScoreCard } from "../components/verdict/ScoreCard";
import { RiskList } from "../components/verdict/RiskList";
import { ActionFooter } from "../components/verdict/ActionFooter";
import { Card } from "../components/ui/card";
import { Spinner } from "../components/ui/spinner";
import { useProject } from "../hooks/use-project";

function StateListSection({
  title,
  items,
  icon,
  iconClassName,
  description,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  iconClassName: string;
  description?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Card className="p-8">
      <div className="flex items-start gap-3 mb-4">
        <div className={`p-2.5 rounded-lg ${iconClassName}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-fg dark:text-fg-dark">
            {title}
          </h3>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={`${title}-${i}`}
            className="rounded-xl border border-border dark:border-border-dark bg-surface-hover dark:bg-surface-dark p-4"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed whitespace-pre-wrap break-words text-fg-muted dark:text-fg-dark/80">
                {item}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function VerdictPage() {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading } = useProject(id);

  if (isLoading || !project) {
    return (
      <PageShell>
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageShell>
    );
  }

  const decision = project.decision;

  return (
    <PageShell>
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10 md:py-14 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
              <span>Analysis Complete</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-fg dark:text-fg-dark">
              Validation Verdict
            </h2>
            <p className="text-fg-muted max-w-2xl text-lg">
              {project.name} — structured analysis of your idea's viability.
            </p>
          </div>
          {decision && <ScoreCard decision={decision} />}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Refined Idea */}
            <Card className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2.5 bg-primary-light rounded-lg text-primary">
                  <HugeiconsIcon icon={BulbIcon} size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-fg dark:text-fg-dark mb-1">
                    Refined Idea
                  </h3>
                  <p className="text-fg-muted text-sm">
                    Optimized for clarity and value proposition.
                  </p>
                </div>
              </div>
              <p className="text-lg leading-relaxed whitespace-pre-wrap break-words text-fg-muted dark:text-fg-dark/80">
                {project.summary || project.idea}
              </p>
            </Card>

            {/* Core Problem */}
            {(project.problem_description || project.problem || project.pain_points.length > 0) && (
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2.5 bg-danger-light rounded-lg text-danger">
                    <HugeiconsIcon icon={Target01Icon} size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-fg dark:text-fg-dark mb-1">
                      The Core Problem
                    </h3>
                    <p className="text-fg-muted text-sm">
                      Why this needs to exist right now.
                    </p>
                  </div>
                </div>
                {(project.problem_description || project.problem) && (
                  <p className="mb-4 text-fg-muted dark:text-fg-dark/80 leading-relaxed whitespace-pre-wrap break-words">
                    {project.problem_description || project.problem}
                  </p>
                )}
                {project.pain_points.length > 0 && (
                  <ul className="space-y-2">
                    {project.pain_points.slice(0, 2).map((point, i) => (
                      <li
                        key={`pain-${i}`}
                        className="rounded-xl border border-border dark:border-border-dark bg-surface-hover dark:bg-surface-dark p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-danger-light text-[11px] font-semibold text-danger">
                            {i + 1}
                          </span>
                          <span className="text-sm leading-relaxed whitespace-pre-wrap break-words text-fg-muted dark:text-fg-dark/80">
                            {point}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            )}

            {/* Decision Reasoning */}
            {decision && (
              <Card className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2.5 bg-info-light rounded-lg text-info">
                    <HugeiconsIcon icon={AnalyticsUpIcon} size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-fg dark:text-fg-dark mb-1">
                      Reasoning
                    </h3>
                  </div>
                </div>
                <p className="text-fg-muted dark:text-fg-muted-dark leading-relaxed whitespace-pre-wrap break-words">
                  {decision.reasoning}
                </p>
                {decision.next_step && (
                  <div className="mt-6 p-4 rounded-lg bg-primary-light border border-primary/10">
                    <p className="text-sm font-medium text-primary mb-1">
                      Recommended Next Step
                    </p>
                    <p className="text-sm text-fg-muted dark:text-fg-muted-dark whitespace-pre-wrap break-words">
                      {decision.next_step}
                    </p>
                  </div>
                )}
              </Card>
            )}

            <StateListSection
              title="Assumptions"
              items={project.assumptions}
              icon={<HugeiconsIcon icon={BrainIcon} size={20} />}
              iconClassName="bg-info-light text-info"
              description={project.assumptions_description || "Core assumptions that must hold true."}
            />
            <StateListSection
              title="Validation Experiments"
              items={project.experiments}
              icon={<HugeiconsIcon icon={TestTube01Icon} size={20} />}
              iconClassName="bg-success-light text-success"
              description="Experiments planned to validate demand and feasibility."
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Validation Readiness */}
            <div className="bg-gradient-to-br from-primary to-primary-hover rounded-xl p-6 text-fg-dark shadow-lg">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HugeiconsIcon icon={ChartLineData01Icon} size={20} />
                Validation Readiness
              </h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold capitalize">
                  {project.validation_readiness.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-fg-muted-dark leading-snug mt-2">
                Based on idea clarity, identified risks, defined user
                segment, and validation plan.
              </p>
            </div>

            <StateListSection
              title="Alternatives"
              items={project.alternatives}
              icon={
                <HugeiconsIcon
                  icon={ArrowDataTransferHorizontalIcon}
                  size={20}
                />
              }
              iconClassName="bg-primary-light text-primary"
              description="Existing options users may choose instead."
            />

            {decision && (
              <RiskList
                decision={decision}
                risks={project.risks}
                description={project.risks_description}
              />
            )}
            {!decision && (
              <StateListSection
                title="Identified Risks"
                items={project.risks}
                icon={<HugeiconsIcon icon={AlertDiamondIcon} size={20} />}
                iconClassName="bg-danger-light text-danger"
                description={project.risks_description || "Key risks to monitor during execution."}
              />
            )}

            {/* Problem Strength */}
            <Card className="p-6">
              <h3 className="font-bold text-fg dark:text-fg-dark mb-4">
                Problem Strength
              </h3>
              <div className="space-y-3">
                {(
                  ["frequency", "urgency", "willingness_to_pay"] as const
                ).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-fg-muted capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm font-medium text-fg dark:text-fg-dark capitalize">
                      {project.problem_strength[key]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <ActionFooter />
      </main>
    </PageShell>
  );
}
