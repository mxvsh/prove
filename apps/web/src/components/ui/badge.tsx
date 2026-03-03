import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "bg-fg-subtle/10 text-fg-subtle border-fg-subtle/20",
  primary: "bg-primary-light text-primary border-primary/20",
  success: "bg-success-light text-success border-success/20",
  warning: "bg-warning-light text-warning border-warning/20",
  danger: "bg-danger-light text-danger border-danger/20",
  info: "bg-info-light text-info border-info/20",
} as const;

interface BadgeProps {
  variant?: keyof typeof variants;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({
  variant = "default",
  children,
  className,
  dot,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            variant === "primary" && "bg-primary animate-pulse",
            variant === "info" && "bg-info animate-pulse",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "danger" && "bg-danger"
          )}
        />
      )}
      {children}
    </span>
  );
}
