"use client";

import { useState, type ReactNode } from "react";
import { SubmitButton } from "@/components/submit-button";

export function ConfirmActionForm({
  action,
  hiddenFields,
  triggerLabel,
  pendingLabel,
  confirmTitle,
  confirmMessage,
  triggerClassName,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields: Array<{ name: string; value: string }>;
  triggerLabel: ReactNode;
  pendingLabel: ReactNode;
  confirmTitle: string;
  confirmMessage: string;
  triggerClassName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={triggerClassName}>
        {triggerLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,21,17,0.42)] px-4">
          <div className="panel confirm-modal w-full max-w-md rounded-[1.75rem] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#a33a22]">Confirm delete</p>
            <h3 className="mt-2 text-2xl font-semibold">{confirmTitle}</h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{confirmMessage}</p>

            <form action={action} className="mt-6 flex flex-wrap justify-end gap-3">
              {hiddenFields.map((field) => (
                <input key={`${field.name}-${field.value}`} type="hidden" name={field.name} value={field.value} />
              ))}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-accent hover:text-accent-strong"
              >
                Cancel
              </button>
              <SubmitButton
                idleLabel={triggerLabel}
                pendingLabel={pendingLabel}
                className="inline-flex w-fit rounded-full bg-[#a33a22] px-4 py-2 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#862c18] disabled:opacity-60"
              />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
