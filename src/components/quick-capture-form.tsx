"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CaptureItem } from "@/lib/types";

export function QuickCaptureForm({ captures }: { captures: CaptureItem[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-5">
      <form
        className="flex flex-col gap-3"
        onSubmit={async (event) => {
          event.preventDefault();

          const nextValue = value.trim();
          if (!nextValue) {
            return;
          }

          setError(null);

          const response = await fetch("/api/captures", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ body: nextValue }),
          });

          if (!response.ok) {
            setError("Capture could not be saved.");
            return;
          }

          setValue("");
          startTransition(() => {
            router.refresh();
          });
        }}
      >
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={4}
          placeholder="Dump a thought, task, or link..."
          className="min-h-28 rounded-[1.25rem] border border-border bg-surface-strong px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-fit rounded-full bg-[#201914] px-5 py-2.5 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#352820]"
        >
          {isPending ? "Saving..." : "Save capture"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-[#8f2f23]">{error}</p> : null}

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
