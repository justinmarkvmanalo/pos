"use client";

import { deleteMilestoneAction } from "@/app/actions/data";
import { ConfirmActionForm } from "@/components/confirm-action-form";

export function MilestoneDeleteForm({ milestoneId }: { milestoneId: string }) {
  return (
    <ConfirmActionForm
      action={deleteMilestoneAction}
      hiddenFields={[{ name: "milestone_id", value: milestoneId }]}
      triggerLabel="Delete"
        pendingLabel="Deleting..."
      confirmTitle="Delete this milestone?"
      confirmMessage="This milestone will be removed from the goal plan and the remaining milestone order will be updated."
      triggerClassName="inline-flex w-fit rounded-full border border-[#b84c2f] px-3 py-1.5 text-xs font-semibold text-[#b84c2f] transition hover:bg-[#b84c2f] hover:text-[#fff7ef] disabled:opacity-60"
    />
  );
}
