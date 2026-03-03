import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons/core-free-icons";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "assistant") {
    return (
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-glow">
          <img src="/prove.png" alt="Sage" className="size-6 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 max-w-[85%]">
          <span className="text-xs font-medium text-fg-muted ml-1">
            Prove
          </span>
          <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-5 rounded-2xl rounded-tl-none shadow-sm text-fg dark:text-fg-dark text-base leading-relaxed">
            <div className="[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_code]:rounded [&_code]:bg-border/60 [&_code]:px-1 [&_code]:py-0.5 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-border/60 [&_pre]:p-3">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 flex-row-reverse">
      <div className="size-10 rounded-full bg-border dark:bg-border-dark flex items-center justify-center shrink-0">
        <HugeiconsIcon icon={UserIcon} size={20} className="text-fg-muted" />
      </div>
      <div className="flex flex-col gap-2 items-end max-w-[85%]">
        <span className="text-xs font-medium text-fg-muted mr-1">
          You
        </span>
        <div className="bg-primary p-5 rounded-2xl rounded-tr-none shadow-md shadow-primary-glow text-white text-base leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
