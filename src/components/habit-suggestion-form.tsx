"use client";

import { useActionState } from "react";
import { createSuggestedHabitAction } from "@/app/actions/data";
import { ActionToast } from "@/components/action-toast";
import { emptyActionState } from "@/lib/form-state";
import { getHabitFrequencyLabel } from "@/lib/habits";

export function HabitSuggestionForm({
  name,
  targetFrequency,
}: {
  name: string;
  targetFrequency: number;
}) {
  const [state, formAction] = useActionState(createSuggestedHabitAction, emptyActionState);

  return (
    <form action={formAction}>
      <ActionToast state={state} />
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
      {state.status === "error" ? (
        <p className="mt-2 text-xs text-[#8f2f23]">{state.message}</p>
      ) : null}
    </form>
  );
}
