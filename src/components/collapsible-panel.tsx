"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export function CollapsiblePanel({
  buttonLabel,
  title,
  description,
  defaultOpen = false,
  children,
  className,
  compactTrigger = false,
}: {
  buttonLabel: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  compactTrigger?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (compactTrigger && !isOpen) {
    return (
      <div className={className ?? "mt-6"}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
        >
          {`Show ${buttonLabel}`}
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        className ?? "mt-6 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-4"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {description ? <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
        >
          {isOpen ? `Hide ${buttonLabel}` : `Show ${buttonLabel}`}
        </button>
      </div>

      {isOpen ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
