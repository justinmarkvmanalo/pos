"use client";

import { useActionState } from "react";
import { createMilestoneAction, initialActionState } from "@/app/actions/data";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";

export function MilestoneForm({ goalId }: { goalId: string }) {
  const [state, formAction] = useActionState(createMilestoneAction, initialActionState);

  return (
    <RevealForm buttonLabel="Add milestone" title="New milestone">
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="goal_id" value={goalId} />
        <input
          name="name"
          placeholder="Finish the billing flow"
          required
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            name="status"
            defaultValue="up-next"
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="up-next">up-next</option>
            <option value="active">active</option>
            <option value="done">done</option>
          </select>
          <input
            type="number"
            name="sort_order"
            min="1"
            defaultValue="1"
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
        <SubmitButton idleLabel="Save milestone" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
