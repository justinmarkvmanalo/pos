import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { Heatmap } from "@/components/heatmap";
import { QuickCaptureForm } from "@/components/quick-capture-form";
import { TaskForm } from "@/components/task-form";
import { getHomeSnapshot } from "@/lib/data";

export default async function Home() {
  await connection();
  const snapshot = await getHomeSnapshot();
  const completion = Math.round(
    snapshot.dailyFocus.topTasks.length === 0
      ? 0
      : (snapshot.dailyFocus.completedTasks / snapshot.dailyFocus.topTasks.length) * 100,
  );

  return (
    <AppShell>
      <section className="fade-up grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <div className="panel-raised dashboard-band rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="accent-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
              Daily command center
            </span>
            <span className="rounded-full border border-border/80 bg-white/55 px-3 py-1 text-xs text-ink-soft">
              Built for focus, not feed scrolling
            </span>
          </div>
          <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)] xl:items-end">
            <div className="max-w-2xl">
              <h1 className="display text-4xl leading-tight sm:text-5xl">
                Run the day from one calm control surface.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
                See what needs attention, keep routines alive, and close the week before it slips.
              </p>
            </div>
            <div className="glow-pulse rounded-[1.65rem] bg-[linear-gradient(145deg,#18222d_0%,#2d3d4b_62%,#41515f_100%)] px-5 py-4 text-[#f7f4ef] xl:self-stretch">
              <p className="text-xs uppercase tracking-[0.2em] text-[#cfd8df]">System note</p>
              <p className="mt-2 max-w-52 text-sm leading-6">
                Keep the board light. If it does not guide action, it should not live here.
              </p>
              <div className="mt-5 grid gap-3 text-sm text-[#f5e4d6]">
                <div className="rounded-[1rem] border border-white/10 bg-white/6 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#cfd8df]">Focus</p>
                  <p className="mt-1 font-medium">{snapshot.dailyFocus.topTasks.length} tasks loaded</p>
                </div>
                <div className="rounded-[1rem] border border-white/10 bg-white/6 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#cfd8df]">Review</p>
                  <p className="mt-1 font-medium">{snapshot.review.readiness}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="stat-tile soft-enter rounded-[1.5rem] p-5">
              <p className="text-sm text-ink-soft">Task completion</p>
              <p className="mt-2 text-3xl font-semibold">{completion}%</p>
              <p className="mt-2 text-sm text-ink-soft">
                {snapshot.dailyFocus.completedTasks} of {snapshot.dailyFocus.topTasks.length} focus
                tasks closed today.
              </p>
            </div>
            <div className="stat-tile soft-enter rounded-[1.5rem] p-5">
              <p className="text-sm text-ink-soft">Habit hit rate</p>
              <p className="mt-2 text-3xl font-semibold">{snapshot.habits.completionRate}%</p>
              <p className="mt-2 text-sm text-ink-soft">
                Percentage of weekly habit targets completed so far.
              </p>
            </div>
            <div className="stat-tile soft-enter rounded-[1.5rem] p-5">
              <p className="text-sm text-ink-soft">Capture inbox</p>
              <p className="mt-2 text-3xl font-semibold">{snapshot.captures.length}</p>
              <p className="mt-2 text-sm text-ink-soft">
                Recent unarchived captures available for review.
              </p>
            </div>
          </div>
        </div>

        <div data-tour="review" className="panel-raised fade-up-delay rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Weekly review</p>
              <h2 className="display mt-2 text-3xl">Friday reset</h2>
            </div>
            <div className="accent-chip rounded-full px-3 py-1 text-sm font-medium">
              {snapshot.review.readiness}
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-soft">{snapshot.review.prompt}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="panel-outline rounded-[1.25rem] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Highlights</p>
              <p className="mt-2 text-2xl font-semibold">{snapshot.review.highlights.length}</p>
            </div>
            <div className="panel-outline rounded-[1.25rem] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Inbox</p>
              <p className="mt-2 text-2xl font-semibold">{snapshot.captures.length}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {snapshot.review.highlights.map((highlight) => (
              <div
                key={highlight}
                className="panel-outline rounded-[1.25rem] px-4 py-3 text-sm"
              >
                {highlight}
              </div>
            ))}
            {snapshot.review.highlights.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-surface-strong px-4 py-3 text-sm text-ink-soft">
                No review signals yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
        <div data-tour="daily-focus" className="panel-raised rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Daily focus</p>
              <h2 className="display mt-2 text-3xl">Top 3 for today</h2>
            </div>
            <div className="rounded-full border border-border/80 bg-white/55 px-3 py-1 text-sm text-ink-soft">
              {snapshot.dailyFocus.dateLabel}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <TaskForm />
            {snapshot.dailyFocus.topTasks.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-5 text-sm text-ink-soft">
                No tasks scheduled for today yet.
              </div>
            ) : null}
            {snapshot.dailyFocus.topTasks.map((task, index) => (
              <div
                key={task.id}
                className="panel-outline rounded-[1.5rem] p-5"
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
                        : "bg-[rgba(244,217,195,0.8)] text-accent-strong"
                    }`}
                  >
                    {task.done ? "Done" : task.energy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:content-start">
          <div data-tour="habit-map" className="panel-raised rounded-[2rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Habit logger</p>
                <h2 className="display mt-2 text-3xl">Consistency map</h2>
              </div>
              <p className="rounded-full border border-border/80 bg-white/55 px-3 py-1 text-sm text-ink-soft">
                {snapshot.habits.completionRate}% hit rate
              </p>
            </div>
            <Heatmap entries={snapshot.habits.heatmap} />
          </div>

          <div data-tour="capture" className="panel-raised rounded-[2rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Quick capture</p>
                <h2 className="display mt-2 text-3xl">Dump first, sort later</h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-soft">Store loose tasks, links, and ideas here first.</p>
            <QuickCaptureForm captures={snapshot.captures} />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
