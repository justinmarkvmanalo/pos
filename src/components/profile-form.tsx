"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateProfileAction } from "@/app/actions/auth";
import { ActionToast } from "@/components/action-toast";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";

export function ProfileForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const [state, formAction] = useActionState(updateProfileAction, emptyActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <>
      <ActionToast state={state} />
      <form ref={formRef} action={formAction} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            name="name"
            defaultValue={defaultName}
            placeholder="Your name"
            className="mt-2 w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            defaultValue={defaultEmail}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
          />
        </label>
        <p className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm leading-6 text-ink-soft">
          Updating your email may require confirmation, depending on your Supabase auth settings.
        </p>
        <p className={`min-h-5 text-sm ${state.status === "error" ? "text-[#8f2f23]" : "text-ink-soft"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton idleLabel="Save profile" pendingLabel="Saving..." />
      </form>
    </>
  );
}
