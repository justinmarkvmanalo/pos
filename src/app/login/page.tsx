import { redirect } from "next/navigation";
import { AuthForms } from "@/components/auth-forms";
import { getOptionalUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase";

export default async function LoginPage() {
  const user = await getOptionalUser();
  if (user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Life OS</p>
        <h1 className="display mt-2 text-4xl sm:text-5xl">Personal data needs personal accounts.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
          Log in or create an account first. After that, every goal, task, habit, capture, and
          review is stored only under that user.
        </p>
        {!hasSupabaseEnv() ? (
          <div className="mt-5 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-4 text-sm text-ink-soft">
            Supabase is not fully configured yet. Set `NEXT_PUBLIC_SUPABASE_URL` and
            `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
          </div>
        ) : null}
      </section>

      <section className="mt-6">
        <AuthForms />
      </section>
    </main>
  );
}
