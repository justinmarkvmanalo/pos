import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { HabitForm } from "@/components/habit-form";
import { Heatmap } from "@/components/heatmap";
import { HabitLogButton } from "@/components/habit-log-button";
import { getDashboardSnapshot } from "@/lib/data";
import { getHabitFrequencyLabel } from "@/lib/habits";

export default async function HabitsPage() {
  await connection();
  const { habits } = await getDashboardSnapshot();

  return (
    <AppShell>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Habit logger</p>
          <h1 className="display mt-2 text-4xl">See consistency, not isolated days</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            Each habit has a weekly target, like every day or three times a week. You only need to
            log the days you did it, and the page shows whether you are on pace.
          </p>
          <HabitForm />
          <Heatmap entries={habits.heatmap} />
        </div>

        <div className="grid gap-6">
          {habits.summaries.length === 0 ? (
            <article className="panel rounded-[2rem] p-6 text-sm text-ink-soft">
              No habits yet. Add your first one above and choose how many times per week it should happen.
            </article>
          ) : null}
          {habits.summaries.map((habit) => (
            <article key={habit.id} className="panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">{habit.name}</p>
              <p className="mt-3 text-4xl font-semibold">{habit.currentRun} days</p>
              <p className="mt-2 text-sm text-ink-soft">
                Target: {getHabitFrequencyLabel(habit.targetFrequency)}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                This week: {habit.completedThisWeek} of {habit.targetFrequency} done.
              </p>
              <HabitLogButton habitId={habit.id} />
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
