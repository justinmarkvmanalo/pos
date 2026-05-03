"use client";

import { deleteMilestoneAction } from "@/app/actions/data";
import { SubmitButton } from "@/components/submit-button";

export function MilestoneDeleteForm({ milestoneId }: { milestoneId: string }) {
  return (
    <form
      action={deleteMilestoneAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this milestone? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="milestone_id" value={milestoneId} />
      <SubmitButton
        idleLabel="Delete"
        pendingLabel="Deleting..."
        className="inline-flex w-fit rounded-full border border-[#b84c2f] px-3 py-1.5 text-xs font-semibold text-[#b84c2f] transition hover:bg-[#b84c2f] hover:text-[#fff7ef] disabled:opacity-60"
      />
    </form>
  );
}
