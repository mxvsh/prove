import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export function IdeaInput({ onSubmit, isLoading }: IdeaInputProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = () => {
    if (idea.trim().length >= 10 && !isLoading) {
      onSubmit(idea.trim());
    }
  };

  return (
    <div className="flex flex-col w-full items-center max-w-[640px] space-y-8">
      <h1 className="text-fg dark:text-fg-dark tracking-tight text-4xl md:text-5xl font-semibold leading-tight text-center">
        Describe your idea in one sentence.
      </h1>

      <div className="w-full relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-glow to-purple-500/30 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
        <div className="relative w-full">
          <Textarea
            className="min-h-[160px] p-6 text-xl font-normal leading-relaxed shadow-sm"
            placeholder="e.g., An AI-powered tool that helps minimalist designers validate their concepts instantly..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="absolute bottom-4 right-4 text-fg-subtle">
            <HugeiconsIcon icon={SparklesIcon} size={24} />
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full pt-2">
        <Button
          size="xl"
          onClick={handleSubmit}
          disabled={idea.trim().length < 10 || isLoading}
          className="w-full md:w-auto min-w-[200px] transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <span>Start validating</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
