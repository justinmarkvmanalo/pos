"use client";

import { useActionState } from "react";
import { createCaptureAction, initialActionState } from "@/app/actions/data";
import { RevealForm } from "@/components/reveal-form";
import { SubmitButton } from "@/components/submit-button";
import type { CaptureItem } from "@/lib/types";

export function QuickCaptureForm({ captures }: { captures: CaptureItem[] }) {
  const [state, formAction] = useActionState(createCaptureAction, initialActionState);

  return (
    <div className="mt-5">
      <RevealForm buttonLabel="Add capture" title="New capture">
        <form action={formAction} className="flex flex-col gap-3">
          <textarea
            name="body"
            rows={4}
            placeholder="Dump a thought, task, or link..."
            className="min-h-28 rounded-[1.25rem] border border-border bg-surface-strong px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
          />
          <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
          <SubmitButton idleLabel="Save capture" pendingLabel="Saving..." />
        </form>
      </RevealForm>

      <div className="mt-5 space-y-2">
        {captures.length === 0 ? (
          <div className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm text-ink-soft">
            No captures yet.
          </div>
        ) : null}
        {captures.map((capture) => (
          <div
            key={capture.id}
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm text-foreground"
          >
            {capture.body}
          </div>
        ))}
      </div>
    </div>
  );
}
