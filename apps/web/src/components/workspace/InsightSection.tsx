import { useState } from "react";

interface InsightSectionProps {
  icon: string;
  title: string;
  content: string | string[] | null;
  defaultOpen?: boolean;
}

export function InsightSection({
  icon,
  title,
  content,
  defaultOpen = false,
}: InsightSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const hasContent = Array.isArray(content)
    ? content.length > 0
    : !!content;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1c2633] transition-all duration-300 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4 select-none hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[20px]">
            {icon}
          </span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">
            {title}
          </span>
          {!hasContent && (
            <span className="text-xs text-slate-400 italic">
              Pending...
            </span>
          )}
        </div>
        <span
          className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${
            isOpen ? "-rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-0">
          <div className="pl-8 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-l-2 border-primary/20 ml-2">
            {!hasContent ? (
              <p className="italic text-slate-500">
                Will be filled as the conversation progresses...
              </p>
            ) : Array.isArray(content) ? (
              <ul className="space-y-1">
                {content.map((item, i) => (
                  <li key={i}>- {item}</li>
                ))}
              </ul>
            ) : (
              <p>{content}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
