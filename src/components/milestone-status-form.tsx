"use client";

import { updateMilestoneStatusAction } from "@/app/actions/data";
import type { GoalMilestone } from "@/lib/types";

const statusOptions: Array<{ value: GoalMilestone["status"]; label: string }> = [
  { value: "up-next", label: "Up next" },
  { value: "active", label: "Current" },
  { value: "done", label: "Done" },
];

export function MilestoneStatusForm({
  milestoneId,
  currentStatus,
}: {
  milestoneId: string;
  currentStatus: GoalMilestone["status"];
}) {
  return (
    <form action={updateMilestoneStatusAction} className="mt-3 flex flex-wrap gap-2">
      <input type="hidden" name="milestone_id" value={milestoneId} />
      {statusOptions.map((statusOption) => {
        const isCurrent = currentStatus === statusOption.value;

        return (
          <button
            key={statusOption.value}
            type="submit"
            name="status"
            value={statusOption.value}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              isCurrent
                ? "bg-[#201914] text-[#fff7ef]"
                : "border border-border bg-white/70 text-ink-soft hover:border-accent hover:text-accent-strong"
            }`}
          >
            {statusOption.label}
          </button>
        );
      })}
    </form>
  );
}
