import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  HelpCircleIcon,
  AlertDiamondIcon,
} from "@hugeicons/core-free-icons";
import type { Decision } from "@prove.ink/core";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface RiskListProps {
  decision: Decision;
  risks: string[];
  description?: string;
}

export function RiskList({ decision, risks, description }: RiskListProps) {
  if (!decision) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-fg dark:text-fg-dark">
            Identified Risks
          </h3>
          <p className="text-fg-muted text-sm">
            {description || "Areas that could block progress or reduce confidence."}
          </p>
        </div>
        <Badge variant="warning">Needs Attention</Badge>
      </div>
      <div className="space-y-3">
        {decision.primary_risk && (
          <div className="rounded-xl border border-border dark:border-border-dark bg-surface-hover dark:bg-surface-dark p-4">
            <div className="flex items-start gap-3 mb-1">
              <HugeiconsIcon
                icon={Alert02Icon}
                size={20}
                className="text-warning mt-0.5"
              />
              <p className="text-sm font-medium text-fg dark:text-fg-dark leading-snug">
                Primary Risk
              </p>
            </div>
            <p className="text-sm text-fg-muted dark:text-fg-dark/80 pl-8 leading-relaxed whitespace-pre-wrap break-words">
              {decision.primary_risk}
            </p>
          </div>
        )}

        {decision.biggest_unknown && (
          <div className="rounded-xl border border-border dark:border-border-dark bg-surface-hover dark:bg-surface-dark p-4">
            <div className="flex items-start gap-3 mb-1">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                size={20}
                className="text-warning mt-0.5"
              />
              <p className="text-sm font-medium text-fg dark:text-fg-dark leading-snug">
                Biggest Unknown
              </p>
            </div>
            <p className="text-sm text-fg-muted dark:text-fg-dark/80 pl-8 leading-relaxed whitespace-pre-wrap break-words">
              {decision.biggest_unknown}
            </p>
          </div>
        )}

        {risks.length > 0 && (
          <>
            {risks.slice(0, 3).map((risk, i) => {
              const colonIdx = risk.indexOf(": ");
              const heading = colonIdx > 0 ? risk.slice(0, colonIdx) : `Risk ${i + 1}`;
              const body = colonIdx > 0 ? risk.slice(colonIdx + 2) : risk;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border dark:border-border-dark bg-surface-hover dark:bg-surface-dark p-4"
                >
                  <div className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={AlertDiamondIcon}
                      size={18}
                      className="text-warning shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-semibold text-fg dark:text-fg-dark leading-snug mb-0.5">
                        {heading}
                      </p>
                      <p className="text-sm text-fg-muted dark:text-fg-dark/80 leading-relaxed whitespace-pre-wrap break-words">
                        {body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </Card>
  );
}
