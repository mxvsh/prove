import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-fg dark:text-fg-dark placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
