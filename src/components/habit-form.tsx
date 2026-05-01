"use client";

import { useActionState } from "react";
import { createHabitAction, initialActionState } from "@/app/actions/data";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";

export function HabitForm() {
  const [state, formAction] = useActionState(createHabitAction, initialActionState);

  return (
    <RevealForm buttonLabel="Add habit" title="New habit">
      <form action={formAction} className="space-y-3">
        <input
          name="name"
          placeholder="Exercise"
          required
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <input
          type="number"
          name="target_frequency"
          min="1"
          max="7"
          defaultValue="7"
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
        <SubmitButton idleLabel="Save habit" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
