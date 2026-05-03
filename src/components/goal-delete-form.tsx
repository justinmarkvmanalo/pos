"use client";

import { deleteGoalAction } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";

export function GoalDeleteForm({ goalId }: { goalId: string }) {
  return (
    <form
      action={deleteGoalAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this goal and all of its milestones? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="goal_id" value={goalId} />
      <SubmitButton
        idleLabel="Delete goal"
        pendingLabel="Deleting..."
        className="inline-flex w-fit rounded-full border border-[#b84c2f] px-4 py-2 text-sm font-semibold text-[#b84c2f] transition hover:bg-[#b84c2f] hover:text-[#fff7ef] disabled:opacity-60"
      />
    </form>
  );
}
