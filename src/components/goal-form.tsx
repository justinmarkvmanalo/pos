"use client";

import { useActionState } from "react";
import { createGoalAction, initialActionState } from "@/app/actions/data";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";

export function GoalForm() {
  const [state, formAction] = useActionState(createGoalAction, initialActionState);

  return (
    <RevealForm buttonLabel="Add goal" title="New goal">
      <form action={formAction} className="space-y-3">
        <input
          name="title"
          placeholder="Ship the first paying version"
          required
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <textarea
          name="owner_note"
          rows={3}
          placeholder="What matters about this goal?"
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            name="deadline"
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            defaultValue="0"
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
        <SubmitButton idleLabel="Save goal" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
