import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUp01Icon,
  ArrowTurnBackwardIcon,
  ArrowDown01Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import type { Decision } from "@prove.ink/core";
import { Card } from "../ui/card";

interface ScoreCardProps {
  decision: Decision;
}

const VERDICT_CONFIG = {
  proceed: {
    label: "High Potential",
    icon: ArrowUp01Icon,
    color: "text-success",
    sub: "Market fit likely",
  },
  pivot: {
    label: "Consider Pivoting",
    icon: ArrowTurnBackwardIcon,
    color: "text-warning",
    sub: "Needs direction change",
  },
  abandon: {
    label: "Low Potential",
    icon: ArrowDown01Icon,
    color: "text-danger",
    sub: "Fundamental concerns",
  },
  needs_more_validation: {
    label: "More Validation Needed",
    icon: HelpCircleIcon,
    color: "text-info",
    sub: "Insufficient data",
  },
};

export function ScoreCard({ decision }: ScoreCardProps) {
  if (!decision) return null;
  const config = VERDICT_CONFIG[decision.verdict];

  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider text-fg-muted font-semibold">
          Confidence Score
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">
            {decision.confidence}
          </span>
          <span className="text-fg-subtle text-sm">/100</span>
        </div>
      </div>
      <div className="h-12 w-px bg-border dark:bg-border-dark mx-2" />
      <div className="flex flex-col justify-center">
        <div className={`flex items-center gap-1 ${config.color} font-medium text-sm`}>
          <HugeiconsIcon icon={config.icon} size={16} />
          <span>{config.label}</span>
        </div>
        <span className="text-xs text-fg-muted">{config.sub}</span>
      </div>
    </Card>
  );
}
