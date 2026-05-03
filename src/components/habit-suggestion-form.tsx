"use client";

import { createSuggestedHabitAction } from "@/app/actions/data";
import { getHabitFrequencyLabel } from "@/lib/habits";

export function HabitSuggestionForm({
  name,
  targetFrequency,
}: {
  name: string;
  targetFrequency: number;
}) {
  return (
    <form action={createSuggestedHabitAction}>
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="target_frequency" value={targetFrequency} />
      <button
        type="submit"
        className="w-full rounded-[1rem] border border-border bg-white/70 px-4 py-3 text-left text-sm transition hover:border-accent hover:text-accent-strong"
      >
        <span className="block font-medium text-foreground">{name}</span>
        <span className="mt-1 block text-xs text-ink-soft">
          Suggested target: {getHabitFrequencyLabel(targetFrequency)}
        </span>
      </button>
    </form>
  );
}
