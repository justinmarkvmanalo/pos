import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { ProfileForm } from "@/components/profile-form";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  await connection();
  const user = await requireUser();
  const defaultName = String(user.user_metadata?.name ?? "").trim();
  const defaultAvatarUrl = String(user.user_metadata?.avatar_url ?? "").trim();

  return (
    <AppShell>
      <section className="profile-circuit panel mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Profile</p>
        <h1 className="display mt-2 text-4xl">Personal details</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
          Update the basic account information shown across your workspace.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="panel-raised ai-panel rounded-[1.75rem] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Identity node</p>
            <div className="mt-4 rounded-[1.5rem] border border-border bg-white/75 p-4">
              <div className="ai-avatar-ring mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] border border-border bg-[#fff8ef]">
                {defaultAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={defaultAvatarUrl}
                    alt="profile picture"
                    className="h-24 w-24 rounded-[1.6rem] object-cover"
                  />
                ) : (
                  <span className="display text-4xl text-ink-soft">
                    {(defaultName || user.email || "A").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="mt-4 text-center text-lg font-semibold">{defaultName || "Account"}</p>
              <p className="mt-1 text-center text-sm text-ink-soft">{user.email ?? ""}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.25rem] border border-border bg-white/70 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Layer</p>
                <p className="mt-2 text-sm font-medium">Personal identity</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/70 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Visual mode</p>
                <p className="mt-2 text-sm font-medium">Warm AI accent</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-white/70 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Profile signal</p>
                <p className="mt-2 text-sm font-medium">Name, email, avatar</p>
              </div>
            </div>
          </aside>
          <div className="panel-raised ai-panel rounded-[1.75rem] p-5">
            <ProfileForm
              defaultName={defaultName}
              defaultEmail={user.email ?? ""}
              defaultAvatarUrl={defaultAvatarUrl}
            />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
