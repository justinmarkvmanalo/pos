"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { createMilestoneAction } from "@/app/actions/data";
import { ActionToast } from "@/components/action-toast";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";

export function MilestoneForm({ goalId }: { goalId: string }) {
  const [state, formAction] = useActionState(createMilestoneAction, emptyActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <RevealForm buttonLabel="Add milestone" title="New milestone">
      <ActionToast state={state} />
      <form ref={formRef} action={formAction} className="space-y-3">
        <input type="hidden" name="goal_id" value={goalId} />
        <input
          name="name"
          placeholder="Finish the billing flow"
          required
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <p className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm leading-6 text-ink-soft">
          Add the next concrete step. The first milestone becomes active automatically, later ones
          queue behind it, and goal progress updates from what gets marked done.
        </p>
        <p className={`min-h-5 text-sm ${state.status === "error" ? "text-[#8f2f23]" : "text-ink-soft"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton idleLabel="Save milestone" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
