import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary-glow",
  secondary:
    "border border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:bg-surface-hover dark:hover:bg-surface-dark-hover text-fg dark:text-fg-dark",
  ghost:
    "hover:bg-surface-hover dark:hover:bg-surface-dark-hover text-fg-muted dark:text-fg-muted-dark",
  danger:
    "bg-danger hover:bg-red-600 text-white shadow-lg shadow-danger-light",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2",
  xl: "h-14 px-8 text-lg rounded-full gap-2",
  icon: "size-10 rounded-lg",
  "icon-sm": "size-8 rounded-md",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      asChild = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 dark:focus:ring-offset-bg-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
