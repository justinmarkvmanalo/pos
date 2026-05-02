"use client";

import { useActionState } from "react";
import { createGoalAction } from "@/app/actions/data";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";

export function GoalForm() {
  const [state, formAction] = useActionState(createGoalAction, emptyActionState);

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
          <div className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm text-ink-soft">
            Progress is automatic from milestone completion.
          </div>
        </div>
        <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
        <SubmitButton idleLabel="Save goal" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
