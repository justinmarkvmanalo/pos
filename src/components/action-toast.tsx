"use client";

import { useState } from "react";
import type { ActionState } from "@/lib/form-state";

export function ActionToast({ state }: { state: ActionState }) {
  const [dismissedToken, setDismissedToken] = useState<number | null>(null);
  const isOpen =
    state.status === "success" && Boolean(state.message) && state.token !== dismissedToken;

  if (!isOpen || !state.message) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,21,17,0.42)] px-4">
      <div
        key={state.token}
        className="panel success-modal w-full max-w-md rounded-[1.75rem] p-6"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-success">Success</p>
        <h3 className="mt-2 text-2xl font-semibold">Update complete</h3>
        <p className="mt-3 text-sm leading-6 text-ink-soft">{state.message}</p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setDismissedToken(state.token)}
            className="inline-flex w-fit rounded-full bg-[#2f7d54] px-4 py-2 text-sm font-semibold text-[#f3fbf6] transition hover:bg-[#256544]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
