export function TypingIndicator() {
  return (
    <div className="flex items-start gap-4">
      <div className="size-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-glow">
        <img src="/prove.png" alt="Sage" className="size-6 rounded-full" />
      </div>
      <div className="flex flex-col gap-2 max-w-[85%]">
        <span className="text-xs font-medium text-fg-muted ml-1">
          Prove
        </span>
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
          <div
            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "75ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
        </div>
      </div>
    </div>
  );
}
