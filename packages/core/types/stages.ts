export const STAGES = [
  "idea_capture",
  "clarity",
  "pain_urgency",
  "differentiation",
  "mvp_validation",
  "decision",
  "complete",
] as const;

export type Stage = (typeof STAGES)[number];

export interface StageMetadata {
  id: Stage;
  label: string;
  description: string;
  order: number;
}

export const STAGE_METADATA: Record<Stage, StageMetadata> = {
  idea_capture: {
    id: "idea_capture",
    label: "Idea Capture",
    description: "Initial idea submission",
    order: 0,
  },
  clarity: {
    id: "clarity",
    label: "Clarity",
    description: "Refine the idea into a clear, specific concept",
    order: 1,
  },
  pain_urgency: {
    id: "pain_urgency",
    label: "Pain & Urgency",
    description: "Evaluate problem strength and urgency",
    order: 2,
  },
  differentiation: {
    id: "differentiation",
    label: "Differentiation",
    description: "Identify alternatives and unique value",
    order: 3,
  },
  mvp_validation: {
    id: "mvp_validation",
    label: "MVP & Validation",
    description: "Define validation experiments and MVP scope",
    order: 4,
  },
  decision: {
    id: "decision",
    label: "Decision",
    description: "Final validation verdict and recommendations",
    order: 5,
  },
  complete: {
    id: "complete",
    label: "Complete",
    description: "Validation process finished",
    order: 6,
  },
};
