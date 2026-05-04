"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export function RevealForm({
  buttonLabel,
  title,
  children,
  className,
  panelClassName,
  open,
  onOpenChange,
  hideTrigger = false,
}: {
  buttonLabel: string;
  title: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalIsOpen;
  const setIsOpen = (next: boolean | ((current: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(isOpen) : next;
    if (!isControlled) {
      setInternalIsOpen(value);
    }
    onOpenChange?.(value);
  };

  return (
    <div className={className ?? "mt-5"}>
      {hideTrigger ? null : (
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
        >
          {isOpen ? "Close" : buttonLabel}
        </button>
      )}

      {isOpen ? (
        <div
          className={
            panelClassName ?? "mt-4 rounded-[1.5rem] border border-border bg-surface-strong p-4"
          }
        >
          <p className="text-sm font-semibold">{title}</p>
          <div className="mt-4">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
