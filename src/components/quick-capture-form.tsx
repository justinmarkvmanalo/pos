"use client";

import { useActionState } from "react";
import { createCaptureAction } from "@/app/actions/data";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";
import type { CaptureItem } from "@/lib/types";

export function QuickCaptureForm({ captures }: { captures: CaptureItem[] }) {
  const [state, formAction] = useActionState(createCaptureAction, emptyActionState);

  return (
    <div className="mt-5">
      <RevealForm buttonLabel="Add to inbox" title="New inbox item">
        <form action={formAction} className="flex flex-col gap-3">
          <p className="rounded-[1rem] border border-dashed border-border bg-surface-strong px-4 py-3 text-sm leading-6 text-ink-soft">
            Put anything here that you do not want to forget yet: a task, idea, reminder, link, or
            rough note. This is temporary inbox space, not a finished list.
          </p>
          <textarea
            name="body"
            rows={4}
            placeholder="Example: ask supplier about receipt printer, fix login bug, check this link later..."
            className="min-h-28 rounded-[1.25rem] border border-border bg-surface-strong px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
          />
          <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
          <SubmitButton idleLabel="Save to inbox" pendingLabel="Saving..." />
        </form>
      </RevealForm>

      <div className="mt-5 space-y-2">
        {captures.length === 0 ? (
          <div className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm text-ink-soft">
            Inbox is empty. Add quick notes here first, then organize them later.
          </div>
        ) : null}
        {captures.map((capture) => (
          <div
            key={capture.id}
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3"
          >
            <p className="text-sm leading-6 text-foreground">{capture.body}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-soft">Inbox item</p>
          </div>
        ))}
      </div>
    </div>
  );
}
