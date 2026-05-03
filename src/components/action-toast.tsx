"use client";

import type { ActionState } from "@/lib/form-state";

export function ActionToast({ state }: { state: ActionState }) {
  if (state.status !== "success" || !state.message) {
    return null;
  }

  return (
    <div
      key={state.token}
      className="pointer-events-none fixed right-4 top-4 z-50 sm:right-6 sm:top-6"
    >
      <div
        className="success-toast rounded-[1.25rem] border border-[#b8dcc7] bg-[#eff9f2] px-4 py-3 text-sm font-medium text-success shadow-[0_20px_45px_rgba(47,125,84,0.18)]"
      >
        {state.message}
      </div>
    </div>
  );
}
