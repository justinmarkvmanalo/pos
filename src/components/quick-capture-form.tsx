"use client";

import { useState } from "react";

const seedCaptures = [
  "Podcast idea: private dashboard walkthrough",
  "Renew Vercel project env vars before Friday",
  "Link: article on deliberate practice and streak psychology",
];

export function QuickCaptureForm() {
  const [value, setValue] = useState("");
  const [captures, setCaptures] = useState(seedCaptures);

  return (
    <div className="mt-5">
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();

          const nextValue = value.trim();
          if (!nextValue) {
            return;
          }

          setCaptures((current) => [nextValue, ...current].slice(0, 5));
          setValue("");
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
          className="inline-flex w-fit rounded-full bg-[#201914] px-5 py-2.5 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#352820]"
        >
          Save capture
        </button>
      </form>

      <div className="mt-5 space-y-2">
        {captures.map((capture) => (
          <div
            key={capture}
            className="rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm text-foreground"
          >
            {capture}
          </div>
        ))}
      </div>
    </div>
  );
}
