"use client";

import { useState } from "react";
import { useActionState, useEffect, useRef } from "react";
import { updateProfileAction } from "@/app/actions/auth";
import { ActionToast } from "@/components/action-toast";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState } from "@/lib/form-state";

export function ProfileForm({
  defaultName,
  defaultEmail,
  defaultAvatarUrl,
}: {
  defaultName: string;
  defaultEmail: string;
  defaultAvatarUrl: string;
}) {
  const [state, formAction] = useActionState(updateProfileAction, emptyActionState);
  const formRef = useRef<HTMLFormElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatarUrl);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <>
      <ActionToast state={state} />
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="rounded-[1.5rem] border border-border bg-[linear-gradient(135deg,rgba(255,252,247,0.95),rgba(246,238,226,0.9))] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="ai-avatar-ring flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] border border-border bg-[#fff8ef]">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="profile picture preview"
                  className="h-20 w-20 rounded-[1.35rem] object-cover"
                />
              ) : (
                <span className="display text-3xl text-ink-soft">
                  {(defaultName || defaultEmail || "A").slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Profile picture</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Paste an image URL to add your picture to the header and profile panel.
              </p>
            </div>
          </div>
        </div>
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
        <label className="block">
          <span className="text-sm font-medium">Profile picture URL</span>
          <input
            type="url"
            name="avatar_url"
            defaultValue={defaultAvatarUrl}
            placeholder="https://example.com/avatar.jpg"
            onChange={(event) => setAvatarPreview(event.target.value.trim())}
            className="mt-2 w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
          />
        </label>
        <p className="rounded-[1rem] border border-dashed border-border bg-[#fff8ef] px-4 py-3 text-sm leading-6 text-ink-soft">
          Updating your email may require confirmation, depending on your Supabase auth settings.
          The profile picture currently uses a direct image URL.
        </p>
        <p className={`min-h-5 text-sm ${state.status === "error" ? "text-[#8f2f23]" : "text-ink-soft"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton idleLabel="Save profile" pendingLabel="Saving..." />
      </form>
    </>
  );
}
