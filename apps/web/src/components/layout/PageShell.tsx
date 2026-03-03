import type { ReactNode } from "react";
import { Header } from "./Header";

interface PageShellProps {
  children: ReactNode;
  hideHeader?: boolean;
}

export function PageShell({ children, hideHeader }: PageShellProps) {
  return (
    <div className="flex flex-col h-screen bg-bg dark:bg-bg-dark text-fg dark:text-fg-dark font-[var(--font-display)]">
      {!hideHeader && <Header />}
      {children}
    </div>
  );
}
