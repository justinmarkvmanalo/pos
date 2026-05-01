import { AppShell } from "@/components/app-shell";
import { Heatmap } from "@/components/heatmap";
import { QuickCaptureForm } from "@/components/quick-capture-form";
import { getDashboardSnapshot } from "@/lib/mock-data";

export default function Home() {
  const snapshot = getDashboardSnapshot();
  const completion = Math.round(
    (snapshot.dailyFocus.completedTasks / snapshot.dailyFocus.topTasks.length) * 100,
  );

  return (
    <AppShell>
      <section className="fade-up grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-ink-soft">
            Personal command center
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="display text-4xl leading-tight sm:text-5xl">
                Start with the work that compounds.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
                Your day is pre-trimmed to the three tasks that matter, the habits that
                keep momentum alive, and the review loop that stops weeks from drifting.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#201914] px-5 py-4 text-[#fff7ef]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d7c6b8]">Morning cue</p>
              <p className="mt-2 max-w-52 text-sm leading-6">
                {snapshot.dailyFocus.morningMessage}
              </p>
            </div>
          </div>

          <div className="metric-grid mt-8">
            <div className="rounded-[1.5rem] bg-surface-strong p-5">
              <p className="text-sm text-ink-soft">Task completion</p>
              <p className="mt-2 text-3xl font-semibold">{completion}%</p>
              <p className="mt-2 text-sm text-ink-soft">
                {snapshot.dailyFocus.completedTasks} of {snapshot.dailyFocus.topTasks.length} deep
                work blocks closed.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-surface-strong p-5">
              <p className="text-sm text-ink-soft">Current streak</p>
              <p className="mt-2 text-3xl font-semibold">{snapshot.dailyFocus.streakDays} days</p>
              <p className="mt-2 text-sm text-ink-soft">
                A visible run rate for the habits you actually care about.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-surface-strong p-5">
              <p className="text-sm text-ink-soft">Active goals</p>
              <p className="mt-2 text-3xl font-semibold">{snapshot.goals.length}</p>
              <p className="mt-2 text-sm text-ink-soft">
                Each one broken into milestones with deadline pressure.
              </p>
            </div>
          </div>
        </div>

        <div className="panel fade-up-delay rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Weekly review</p>
              <h2 className="display mt-2 text-3xl">Friday reset</h2>
            </div>
            <div className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent-strong">
              {snapshot.review.readiness}
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-soft">{snapshot.review.prompt}</p>
          <div className="mt-6 space-y-3">
            {snapshot.review.highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-[1.25rem] border border-border bg-surface-strong px-4 py-3 text-sm"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Daily focus</p>
              <h2 className="display mt-2 text-3xl">Top 3 for today</h2>
            </div>
            <div className="rounded-full border border-border px-3 py-1 text-sm text-ink-soft">
              {snapshot.dailyFocus.dateLabel}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {snapshot.dailyFocus.topTasks.map((task, index) => (
              <div
                key={task.title}
                className="rounded-[1.5rem] border border-border bg-surface-strong p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                      Focus block {index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{task.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{task.note}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                      task.done
                        ? "bg-[#d7eadf] text-success"
                        : "bg-accent-soft text-accent-strong"
                    }`}
                  >
                    {task.done ? "Done" : task.energy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel rounded-[2rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Habit logger</p>
                <h2 className="display mt-2 text-3xl">Consistency map</h2>
              </div>
              <p className="text-sm text-ink-soft">{snapshot.habits.completionRate}% hit rate</p>
            </div>
            <Heatmap entries={snapshot.habits.heatmap} />
          </div>

          <div className="panel rounded-[2rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Quick capture</p>
                <h2 className="display mt-2 text-3xl">Dump first, sort later</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Fast capture for links, half-formed tasks, and thoughts you do not want to hold in
              working memory.
            </p>
            <QuickCaptureForm />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
