import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { QuickCaptureForm } from "@/components/quick-capture-form";
import { getCaptureSnapshot } from "@/lib/data";

export default async function CapturePage() {
  await connection();
  const { captures } = await getCaptureSnapshot();

  return (
    <AppShell>
      <section className="grid items-start gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Inbox capture</p>
          <h1 className="display mt-2 text-4xl">Save it now, organize it later</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            This page is only for catching loose things fast. If something pops into your head and
            you do not want to lose it, drop it here first. Later, you can turn it into a real
            task, goal step, or note.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-border bg-surface-strong p-5 text-sm leading-6 text-ink-soft">
            <p>Use this for:</p>
            <p>Tasks you need to do later</p>
            <p>Ideas you are not ready to organize yet</p>
            <p>Links, reminders, and random notes</p>
          </div>
        </div>

        <div className="panel rounded-[2rem] p-6">
          <h2 className="display text-3xl">Your inbox</h2>
          <QuickCaptureForm captures={captures} />
        </div>
      </section>
    </AppShell>
  );
}
