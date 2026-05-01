import { AppShell } from "@/components/app-shell";
import { QuickCaptureForm } from "@/components/quick-capture-form";
import { getDashboardSnapshot } from "@/lib/data";

export default async function CapturePage() {
  const { captures } = await getDashboardSnapshot();

  return (
    <AppShell>
      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Quick capture</p>
          <h1 className="display mt-2 text-4xl">Collect loose inputs before they leak energy</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            This is the low-friction inbox. Toss in fragments, links, tasks, and half-baked
            thoughts. Organizing happens later, after the work block is protected.
          </p>
        </div>

        <div className="panel rounded-[2rem] p-6">
          <h2 className="display text-3xl">Inbox</h2>
          <QuickCaptureForm captures={captures} />
        </div>
      </section>
    </AppShell>
  );
}
