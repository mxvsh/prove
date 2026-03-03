import type { Stage } from "@prove.ink/core";
import { Badge } from "../ui/badge";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "primary" | "success" | "warning" | "info"; dot?: boolean }
> = {
  idea_capture: { label: "Draft", variant: "default" },
  clarity: { label: "In Progress", variant: "info", dot: true },
  pain_urgency: { label: "In Progress", variant: "info", dot: true },
  differentiation: { label: "In Progress", variant: "info", dot: true },
  mvp_validation: { label: "In Progress", variant: "info", dot: true },
  decision: { label: "In Progress", variant: "info", dot: true },
  complete: { label: "Validated", variant: "success" },
};

export function StatusBadge({ stage }: { stage: Stage }) {
  const config = STATUS_CONFIG[stage] ?? STATUS_CONFIG.idea_capture;

  return (
    <Badge variant={config.variant} dot={config.dot}>
      {config.label}
    </Badge>
  );
}
