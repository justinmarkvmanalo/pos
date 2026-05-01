import { AppShell } from "@/components/app-shell";
import { Heatmap } from "@/components/heatmap";
import { getDashboardSnapshot } from "@/lib/data";

export default async function HabitsPage() {
  const { habits } = await getDashboardSnapshot();

  return (
    <AppShell>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Habit logger</p>
          <h1 className="display mt-2 text-4xl">See consistency, not isolated days</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            The heatmap makes the trend obvious. The weekly count keeps the standard honest. The
            streak is there for motivation, but the real point is reducing decision friction.
          </p>
          <Heatmap entries={habits.heatmap} />
        </div>

        <div className="grid gap-6">
          {habits.summaries.length === 0 ? (
            <article className="panel rounded-[2rem] p-6 text-sm text-ink-soft">
              No habits yet. Add rows to `habits` and `habit_logs` to populate this page.
            </article>
          ) : null}
          {habits.summaries.map((habit) => (
            <article key={habit.id} className="panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">{habit.name}</p>
              <p className="mt-3 text-4xl font-semibold">{habit.currentRun} days</p>
              <p className="mt-2 text-sm text-ink-soft">
                {habit.completedThisWeek} completions logged this week.
              </p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
