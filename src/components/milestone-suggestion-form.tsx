"use client";

import { createSuggestedMilestoneAction } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";

export function MilestoneSuggestionForm({
  goalId,
  suggestion,
}: {
  goalId: string;
  suggestion: string;
}) {
  return (
    <form action={createSuggestedMilestoneAction}>
      <input type="hidden" name="goal_id" value={goalId} />
      <input type="hidden" name="name" value={suggestion} />
      <SubmitButton
        idleLabel={suggestion}
        pendingLabel="Adding..."
        className="w-full rounded-[1rem] border border-border bg-white/75 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-accent hover:text-accent-strong disabled:opacity-60"
      />
    </form>
  );
}
