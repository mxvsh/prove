import { useLayoutEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "../ui/icon-button";
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;

    el.style.height = "auto";
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight) || 24;
    const maxHeight = lineHeight * 4;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    setIsExpanded(el.scrollHeight > lineHeight * 1.5);
  };

  useLayoutEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      setIsExpanded(false);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface via-surface to-transparent dark:from-surface-darker dark:via-surface-darker dark:to-transparent">
      <div className="max-w-2xl mx-auto relative">
        <div
          className={`relative flex items-end gap-3 p-2 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-xl dark:shadow-black/20 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all ${
            isExpanded ? "rounded-2xl" : "rounded-full"
          }`}
        >
          <Textarea
            ref={textareaRef}
            rows={1}
            className={`flex-1 bg-transparent border-none focus:ring-0 focus:outline-none py-3 px-4 text-base min-h-[46px] ${
              isExpanded ? "rounded-xl" : "rounded-3xl"
            }`}
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => {
              resizeTextarea(e.currentTarget);
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={disabled}
          />
          <IconButton
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="rounded-full"
          >
            <HugeiconsIcon icon={ArrowUp01Icon} size={18} />
          </IconButton>
        </div>
        <p className="text-center mt-3 text-xs text-fg-subtle">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
