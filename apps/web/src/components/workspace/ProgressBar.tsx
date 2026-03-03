import { STAGES, STAGE_METADATA, type Stage } from "@prove.ink/core";

interface ProgressBarProps {
  stage: Stage;
}

export function ProgressBar({ stage }: ProgressBarProps) {
  const meta = STAGE_METADATA[stage];
  const totalStages = STAGES.length - 1;
  const progress = Math.round((meta.order / totalStages) * 100);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-primary text-sm font-semibold tracking-wide uppercase">
          {meta.label}
        </span>
        <span className="text-fg-subtle text-xs font-medium uppercase tracking-wide">
          Validation
        </span>
        <span className="text-fg-subtle text-xs font-medium uppercase tracking-wide">
          Decision
        </span>
      </div>
      <div className="h-1.5 w-full bg-surface-hover dark:bg-surface-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full shadow-[0_0_10px_var(--color-primary-glow)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between items-center text-xs">
        <span className="text-fg-muted">{progress}% Complete</span>
        <span className="text-fg-subtle">
          {stage === "complete"
            ? "Validation complete"
            : "Next phase locked"}
        </span>
      </div>
    </div>
  );
}
