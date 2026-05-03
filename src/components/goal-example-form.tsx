"use client";

import { createSuggestedGoalAction } from "@/app/actions/data";

export function GoalExampleForm({
  title,
  ownerNote,
}: {
  title: string;
  ownerNote: string;
}) {
  return (
    <form action={createSuggestedGoalAction}>
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="owner_note" value={ownerNote} />
      <input type="hidden" name="deadline" value="" />
      <button
        type="submit"
        className="w-full rounded-[1rem] border border-border bg-white/70 px-4 py-3 text-left text-sm transition hover:border-accent hover:text-accent-strong"
      >
        <span className="block font-medium text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-ink-soft">{ownerNote}</span>
      </button>
    </form>
  );
}
