"use client";

import { deleteGoalAction } from "@/app/actions/data";
import { ConfirmActionForm } from "@/components/confirm-action-form";

export function GoalDeleteForm({ goalId }: { goalId: string }) {
  return (
    <ConfirmActionForm
      action={deleteGoalAction}
      hiddenFields={[{ name: "goal_id", value: goalId }]}
      triggerLabel="Delete goal"
        pendingLabel="Deleting..."
      confirmTitle="Delete this goal?"
      confirmMessage="This will remove the goal, all connected milestones, and its progress history. This cannot be undone."
      triggerClassName="inline-flex w-fit rounded-full border border-[#b84c2f] px-4 py-2 text-sm font-semibold text-[#b84c2f] transition hover:bg-[#b84c2f] hover:text-[#fff7ef] disabled:opacity-60"
    />
  );
}
