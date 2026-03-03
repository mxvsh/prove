import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary-glow",
  secondary:
    "border border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:bg-surface-hover dark:hover:bg-surface-dark-hover text-fg-muted dark:text-fg-muted-dark",
  ghost:
    "hover:bg-surface-hover dark:hover:bg-surface-dark-hover text-fg-muted dark:text-fg-muted-dark",
} as const;

const sizes = {
  sm: "size-8 rounded-md",
  md: "size-10 rounded-lg",
  lg: "size-12 rounded-xl",
} as const;

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

IconButton.displayName = "IconButton";
