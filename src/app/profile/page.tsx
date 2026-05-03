import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { ProfileForm } from "@/components/profile-form";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  await connection();
  const user = await requireUser();
  const defaultName = String(user.user_metadata?.name ?? "").trim();

  return (
    <AppShell>
      <section className="panel mx-auto w-full max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Profile</p>
        <h1 className="display mt-2 text-4xl">Personal details</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
          Update the basic account information shown across your workspace.
        </p>
        <div className="mt-6 rounded-[1.5rem] border border-border bg-surface-strong p-5">
          <ProfileForm defaultName={defaultName} defaultEmail={user.email ?? ""} />
        </div>
      </section>
    </AppShell>
  );
}
