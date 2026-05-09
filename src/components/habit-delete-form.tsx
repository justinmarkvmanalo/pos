"use client";

import { deleteHabitAction } from "@/app/actions/data";
import { ConfirmActionForm } from "@/components/confirm-action-form";

export function HabitDeleteForm({ habitId }: { habitId: string }) {
  return (
    <ConfirmActionForm
      action={deleteHabitAction}
      hiddenFields={[{ name: "habit_id", value: habitId }]}
      triggerLabel="Delete"
      pendingLabel="Deleting..."
      confirmTitle="Delete this habit?"
      confirmMessage="This removes the habit and all of its logged history. This cannot be undone."
      triggerClassName="inline-flex w-fit rounded-full border border-[#b84c2f] bg-[#fff8ef] px-3 py-2 text-sm font-semibold text-[#b84c2f] transition hover:bg-[#b84c2f] hover:text-[#fff7ef] disabled:opacity-60"
    />
  );
}
