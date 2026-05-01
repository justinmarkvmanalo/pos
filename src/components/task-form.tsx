"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/app/actions/data";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";

export function TaskForm() {
  const [state, formAction] = useActionState(createTaskAction, emptyActionState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <RevealForm buttonLabel="Add task" title="New focus task">
      <form action={formAction} className="space-y-3">
        <input
          name="title"
          placeholder="Finish deployment checklist"
          required
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <textarea
          name="note"
          rows={3}
          placeholder="Optional note"
          className="w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            name="energy"
            defaultValue="Medium lift"
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option>High focus</option>
            <option>Medium lift</option>
            <option>Quick win</option>
          </select>
          <select
            name="focus_order"
            defaultValue="1"
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="1">Block 1</option>
            <option value="2">Block 2</option>
            <option value="3">Block 3</option>
          </select>
          <input
            type="date"
            name="task_date"
            defaultValue={today}
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
        <SubmitButton idleLabel="Save task" pendingLabel="Saving..." />
      </form>
    </RevealForm>
  );
}
