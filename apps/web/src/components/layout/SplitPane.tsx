import type { ReactNode } from "react";

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitPane({ left, right }: SplitPaneProps) {
  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="w-full md:w-1/2 lg:w-5/12 border-r border-border dark:border-border-dark flex flex-col overflow-y-auto bg-surface dark:bg-bg-dark">
        {left}
      </div>
      <div className="hidden md:flex flex-1 flex-col bg-surface-hover dark:bg-surface-darker relative">
        {right}
      </div>
    </main>
  );
}
