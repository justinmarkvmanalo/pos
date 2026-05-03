"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { createHabitAction } from "@/app/actions/data";
import { ActionToast } from "@/components/action-toast";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";
import { habitFrequencyOptions } from "@/lib/habits";

export function HabitForm() {
  const [state, formAction] = useActionState(createHabitAction, emptyActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <RevealForm buttonLabel="Add habit" title="New habit">
      <ActionToast state={state} />
      <form ref={formRef} action={formAction} className="space-y-3">
        <input
          name="name"
          placeholder="Exercise"
          required
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">How often should this happen?</span>
          <select
          name="target_frequency"
            defaultValue="7"
            className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          >
            {habitFrequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm leading-6 text-ink-soft">
          This sets your weekly target. Example: choose <strong>3 times a week</strong> if the
          habit does not need to happen every day.
        </p>
        <p className={`min-h-5 text-sm ${state.status === "error" ? "text-[#8f2f23]" : "text-ink-soft"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton idleLabel="Save habit" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
