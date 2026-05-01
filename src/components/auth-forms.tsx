"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { emptyActionState, type ActionState } from "@/lib/form-state";

function AuthCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState(action, emptyActionState);

  return (
    <div className="panel rounded-[2rem] p-6">
      <h2 className="display text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{description}</p>
      <form action={formAction} className="mt-6 space-y-4">
        {children}
        <p className="min-h-5 text-sm text-[#8f2f23]">{state.message}</p>
        <SubmitButton idleLabel={title} pendingLabel="Working..." />
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
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        className="mt-2 w-full rounded-[1rem] border border-border bg-[#fff8ef] px-4 py-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent"
      />
    </label>
  );
}

export function AuthForms() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AuthCard
        title="Log In"
        description="Use your email and password to load only your own dashboard data."
        action={loginAction}
      >
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" placeholder="Password" />
      </AuthCard>

      <AuthCard
        title="Sign Up"
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
