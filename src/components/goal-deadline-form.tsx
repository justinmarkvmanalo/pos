"use client";

import { updateGoalDeadlineAction } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";

export function GoalDeadlineForm({
  goalId,
  deadline,
  className,
}: {
  goalId: string;
  deadline: string | null;
  className?: string;
}) {
  return (
    <form action={updateGoalDeadlineAction} className={className ?? "mt-4 flex flex-wrap items-end gap-3"}>
      <input type="hidden" name="goal_id" value={goalId} />
      <label className="flex min-w-[180px] flex-col gap-1 text-xs uppercase tracking-[0.14em] text-ink-soft">
        Deadline
        <input
          type="date"
          name="deadline"
          defaultValue={deadline ?? ""}
          className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-2.5 text-sm normal-case tracking-normal text-foreground outline-none focus:border-accent"
        />
      </label>
      <SubmitButton
        idleLabel="Save deadline"
        pendingLabel="Saving..."
        className="inline-flex w-fit rounded-full bg-[#201914] px-4 py-2 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#352820] disabled:opacity-60"
      />
    </form>
  );
}
