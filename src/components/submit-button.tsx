"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: {
  idleLabel: ReactNode;
  pendingLabel: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "inline-flex w-fit rounded-full bg-[#201914] px-5 py-2.5 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#352820] disabled:opacity-60"
      }
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
