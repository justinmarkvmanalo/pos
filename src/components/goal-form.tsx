"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { createGoalAction } from "@/app/actions/data";
import { ActionToast } from "@/components/action-toast";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";

export function GoalForm({
  className,
  panelClassName,
  open,
  onOpenChange,
  hideTrigger,
}: {
  className?: string;
  panelClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const [state, formAction] = useActionState(createGoalAction, emptyActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <RevealForm
      buttonLabel="Add goal"
      title="New goal"
      className={className}
      panelClassName={panelClassName}
      open={open}
      onOpenChange={onOpenChange}
      hideTrigger={hideTrigger}
    >
      <ActionToast state={state} />
      <form ref={formRef} action={formAction} className="space-y-3">
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
        <p className={`min-h-5 text-sm ${state.status === "error" ? "text-[#8f2f23]" : "text-ink-soft"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton idleLabel="Save goal" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
