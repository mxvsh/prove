import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: TabsPrimitive.TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex bg-surface-dark p-1 rounded-xl border border-border-dark overflow-x-auto",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "flex px-4 py-2 items-center justify-center rounded-lg text-sm font-medium min-w-[80px] whitespace-nowrap transition-colors",
        "text-fg-muted-dark hover:text-fg-dark hover:bg-surface-dark-hover",
        "data-[state=active]:bg-bg-dark data-[state=active]:text-fg-dark data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
