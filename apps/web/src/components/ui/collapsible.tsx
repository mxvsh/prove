import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { type ReactNode, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "../../lib/utils";

interface CollapsibleSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  empty?: boolean;
}

export function CollapsibleSection({
  icon,
  title,
  children,
  defaultOpen = false,
  empty = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border border-border dark:border-border-dark bg-surface-hover dark:bg-surface-dark transition-all duration-300 overflow-hidden">
        <CollapsiblePrimitive.Trigger className="flex w-full cursor-pointer items-center justify-between px-5 py-4 select-none hover:bg-border/50 dark:hover:bg-surface-dark-hover transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-primary">{icon}</span>
            <span className="text-fg dark:text-fg-dark font-medium">
              {title}
            </span>
            <span
              className={cn(
                "inline-block size-1.5 rounded-full shrink-0 opacity-50",
                empty ? "bg-orange-400" : "bg-green-500"
              )}
            />
          </div>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={18}
            className={cn(
              "text-fg-subtle transition-transform duration-300",
              open && "-rotate-180"
            )}
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Content>
          <div className="px-5 pb-5 pt-0">
            <div className="pl-8 text-fg-muted dark:text-fg-muted-dark text-sm leading-relaxed border-l-2 border-primary/20 ml-2">
              {children}
            </div>
          </div>
        </CollapsiblePrimitive.Content>
      </div>
    </CollapsiblePrimitive.Root>
  );
}
