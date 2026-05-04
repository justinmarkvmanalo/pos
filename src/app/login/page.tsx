import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AuthForms } from "@/components/auth-forms";
import { getOptionalUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase";

export default async function LoginPage() {
  await connection();
  const user = await getOptionalUser();
  if (user) {
    redirect("/");
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="hero-orb float-slow left-[-5rem] top-[5rem] h-40 w-40 bg-[radial-gradient(circle,#f0c7a0_0%,rgba(240,199,160,0)_72%)]" />
      <div className="hero-orb float-slow right-[-4rem] top-[10rem] h-52 w-52 bg-[radial-gradient(circle,#cddfcf_0%,rgba(205,223,207,0)_72%)]" />
      <div className="hero-orb float-slow bottom-[6rem] left-[18%] h-36 w-36 bg-[radial-gradient(circle,#efd8ca_0%,rgba(239,216,202,0)_72%)]" />

      <section className="panel-raised soft-enter relative overflow-hidden rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)]" />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-accent-strong">winos</p>
            <h1 className="display mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Personal data deserves a private command center.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
              Sign in to keep goals, habits, capture, and review data separated per person with a
              cleaner workflow and a calmer daily operating space.
            </p>
            {!hasSupabaseEnv() ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-4 text-sm text-ink-soft">
                Supabase is not fully configured yet. Set `NEXT_PUBLIC_SUPABASE_URL` and
                `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
              </div>
            ) : null}
          </div>

          <div className="soft-enter-delay grid gap-4">
            <div className="rounded-[1.6rem] bg-[linear-gradient(145deg,#201914_0%,#413028_100%)] p-5 text-[#fff7ef] shadow-[0_22px_44px_rgba(49,30,17,0.18)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#dccabc]">Private by design</p>
              <p className="mt-3 text-sm leading-6 text-[#f7eadf]">
                Your dashboard stays tied to your own account so nobody else sees your tasks,
                goals, captures, or weekly review.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-surface-strong p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Focus</p>
                <p className="mt-2 text-2xl font-semibold">Top 3</p>
              </div>
              <div className="rounded-[1.4rem] bg-surface-strong p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Momentum</p>
                <p className="mt-2 text-2xl font-semibold">Habits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 soft-enter-delay">
        <AuthForms />
      </section>
    </main>
  );
}
