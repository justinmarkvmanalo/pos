"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { ActionToast } from "@/components/action-toast";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState, type ActionState } from "@/lib/form-state";

function AuthCard({
  title,
  eyebrow,
  badge,
  description,
  action,
  children,
}: {
  title: string;
  eyebrow: string;
  badge: string;
  description: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState(action, emptyActionState);

  return (
    <div className="panel-raised soft-enter rounded-[2rem] p-6">
      <ActionToast state={state} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent-strong">{eyebrow}</p>
          <h2 className="display mt-2 text-3xl">{title}</h2>
        </div>
        <div className="glow-pulse rounded-full bg-[linear-gradient(135deg,#c85f32_0%,#e6b07d_100%)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#fff7ef]">
          {badge}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{description}</p>
      <form action={formAction} className="mt-6 space-y-4">
        {children}
        <p className={`min-h-5 text-sm ${state.status === "error" ? "text-[#8f2f23]" : "text-ink-soft"}`}>
          {state.status === "error" ? state.message : ""}
        </p>
        <SubmitButton
          idleLabel={title}
          pendingLabel="Working..."
          className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#201914_0%,#3c2e26_100%)] px-5 py-3 text-sm font-semibold text-[#fff7ef] transition hover:brightness-110 disabled:opacity-60"
        />
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        className="mt-2 w-full rounded-[1rem] border border-border bg-[rgba(255,251,245,0.9)] px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent focus:bg-white"
      />
    </label>
  );
}

export function AuthForms() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AuthCard
        title="Log In"
        eyebrow="Welcome back"
        badge="Secure"
        description="Use your email and password to load only your own dashboard data."
        action={loginAction}
      >
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" placeholder="Password" />
      </AuthCard>

      <AuthCard
        title="Sign Up"
        eyebrow="New account"
        badge="Private"
        description="Create a separate account so each person sees only their own tasks, goals, captures, and reviews."
        action={signupAction}
      >
        <Field label="Name" name="name" placeholder="Your name" />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
      </AuthCard>
    </div>
  );
}
