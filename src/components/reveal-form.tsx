"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export function RevealForm({
  buttonLabel,
  title,
  children,
}: {
  buttonLabel: string;
  title: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
      >
        {isOpen ? "Close" : buttonLabel}
      </button>

      {isOpen ? (
        <div className="mt-4 rounded-[1.5rem] border border-border bg-surface-strong p-4">
          <p className="text-sm font-semibold">{title}</p>
          <div className="mt-4">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
