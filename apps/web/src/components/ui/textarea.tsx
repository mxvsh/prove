import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full resize-none rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-fg dark:text-fg-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-fg-subtle transition-all duration-300",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
