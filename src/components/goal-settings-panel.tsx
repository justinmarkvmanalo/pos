"use client";

import { useState } from "react";
import { GoalDeadlineForm } from "@/components/goal-deadline-form";
import { GoalDeleteForm } from "@/components/goal-delete-form";

export function GoalSettingsPanel({
  goalId,
  deadline,
}: {
  goalId: string;
  deadline: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Goal settings"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-strong text-ink-soft transition hover:border-accent hover:text-accent-strong"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-20 w-[min(22rem,calc(100vw-4rem))] rounded-[1.5rem] border border-border bg-surface-raised p-4 shadow-[0_18px_40px_rgba(61,35,14,0.14)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Goal settings</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-ink-soft transition hover:text-accent-strong"
            >
              Close
            </button>
          </div>
          <GoalDeadlineForm goalId={goalId} deadline={deadline} className="mt-4 flex flex-col gap-3" />
          <div className="mt-4 border-t border-border pt-4">
            <GoalDeleteForm
              goalId={goalId}
              triggerLabel="Delete goal"
              triggerClassName="inline-flex w-fit rounded-full border border-[#b84c2f] px-4 py-2 text-sm font-semibold text-[#b84c2f] transition hover:bg-[#b84c2f] hover:text-[#fff7ef] disabled:opacity-60"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
