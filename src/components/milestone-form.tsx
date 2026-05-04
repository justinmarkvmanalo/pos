"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { createMilestoneAction } from "@/app/actions/data";
import { ActionToast } from "@/components/action-toast";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";

export function MilestoneForm({
  goalId,
  goalTitle,
  ownerNote,
  existingMilestones,
  suggestions,
}: {
  goalId: string;
  goalTitle: string;
  ownerNote: string;
  existingMilestones: string[];
  suggestions: string[];
}) {
  const [state, formAction] = useActionState(createMilestoneAction, emptyActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<string[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const aiSuggestions = generatedSuggestions ?? suggestions;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  async function handleGenerateSuggestions() {
    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/milestone-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: goalTitle,
          ownerNote,
          existingMilestones,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        suggestions?: string[];
      };

      if (!response.ok) {
        setGenerationError(data.error ?? "Could not generate milestone ideas.");
        return;
      }

      setGeneratedSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch {
      setGenerationError("Could not generate milestone ideas.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <RevealForm buttonLabel="Add milestone" title="New milestone">
      <ActionToast state={state} />
      <form ref={formRef} action={formAction} className="space-y-3">
        <input type="hidden" name="goal_id" value={goalId} />
        <div className="rounded-[1.25rem] border border-dashed border-border bg-white/75 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">AI-generated ideas</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Based on your goal: <span className="font-semibold text-foreground">{goalTitle}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateSuggestions}
              disabled={isGenerating}
              className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          {generationError ? <p className="mt-3 text-sm text-[#8f2f23]">{generationError}</p> : null}
          {aiSuggestions.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {aiSuggestions.map((suggestion) => (
                <button
                  key={`${goalId}-${suggestion}`}
                  type="button"
                  onClick={() => {
                    if (nameInputRef.current) {
                      nameInputRef.current.value = suggestion;
                    }
                  }}
                  className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-accent hover:text-accent-strong"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-ink-soft">
              Generate milestone ideas from this goal, then tap one to fill the milestone field.
            </p>
          )}
        </div>
        <input
          ref={nameInputRef}
          name="name"
          placeholder="Finish the billing flow"
          required
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <p className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm leading-6 text-ink-soft">
          Pick an AI-generated example to fill the field, or write your own next concrete step. The
          first milestone becomes active automatically, later ones queue behind it, and goal
          progress updates from what gets marked done.
        </p>
        <p className={`min-h-5 text-sm ${state.status === "error" ? "text-[#8f2f23]" : "text-ink-soft"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton idleLabel="Save milestone" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
