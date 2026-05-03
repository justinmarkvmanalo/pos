"use client";

import { createSuggestedGoalAction } from "@/app/actions/data";

export function GoalExampleForm({
  title,
  ownerNote,
  starterMilestones,
}: {
  title: string;
  ownerNote: string;
  starterMilestones: string[];
}) {
  return (
    <form action={createSuggestedGoalAction}>
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="owner_note" value={ownerNote} />
      <input type="hidden" name="deadline" value="" />
      {starterMilestones.map((milestone) => (
        <input key={milestone} type="hidden" name="starter_milestones" value={milestone} />
      ))}
      <button
        type="submit"
        className="w-full rounded-[1rem] border border-border bg-white/70 px-4 py-3 text-left text-sm transition hover:border-accent hover:text-accent-strong"
      >
        <span className="block font-medium text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-ink-soft">{ownerNote}</span>
        <span className="mt-2 block text-[11px] uppercase tracking-[0.16em] text-accent-strong">
          Includes starter milestones
        </span>
      </button>
    </form>
  );
}
