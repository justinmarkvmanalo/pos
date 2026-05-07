import Image from "next/image";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { HabitCreateControls } from "@/components/habit-create-controls";
import { Heatmap } from "@/components/heatmap";
import { HabitLogButton } from "@/components/habit-log-button";
import { getHabitsSnapshot } from "@/lib/data";
import { getHabitCategory, groupHabitSuggestions } from "@/lib/habit-suggestions";
import { getHabitFrequencyLabel } from "@/lib/habits";

export default async function HabitsPage() {
  await connection();
  const { habits } = await getHabitsSnapshot();
  const suggestionGroups = groupHabitSuggestions();
  const activeStreaks = habits.summaries.filter((habit) => habit.currentRun > 0).length;
  const groupedHabits = Array.from(
    habits.summaries.reduce((groups, habit) => {
      const category = getHabitCategory(habit.name);
      const current = groups.get(category) ?? [];
      current.push(habit);
      groups.set(category, current);
      return groups;
    }, new Map<string, typeof habits.summaries>()),
  ).sort(([left], [right]) => {
    if (left === "Custom") {
      return 1;
    }

    if (right === "Custom") {
      return -1;
    }

    return left.localeCompare(right);
  });

  return (
    <AppShell>
      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3 md:hidden">
            <Image
              src="/winos-logo.png"
              alt="winos logo"
              className="h-12 w-12 rounded-2xl border border-border bg-white/80 object-cover shadow-[0_12px_28px_rgba(61,35,14,0.12)]"
              width={48}
              height={48}
              priority
            />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.26em] text-ink-soft">winos</p>
              <p className="display mt-1 text-xl">Habit rhythm</p>
            </div>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Habit logger</p>
          <h1 className="display mt-2 text-4xl">See consistency, not isolated days</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            Each habit has a weekly target, like every day or three times a week. You only need to
            log the days you did it, and the page shows whether you are on pace.
          </p>
          <HabitCreateControls suggestionGroups={suggestionGroups} />
          <Heatmap entries={habits.heatmap} />
        </div>

        <div className="grid content-start auto-rows-max gap-6 self-start">
          <article className="panel rounded-[2rem] p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">Habit pulse</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Weekly pace, streak, and today&apos;s log are compressed into a tighter list so
                large habit sets stay readable.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-border bg-surface-strong px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Tracked</p>
                <p className="mt-2 text-2xl font-semibold">{habits.summaries.length}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-surface-strong px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">Active streaks</p>
                <p className="mt-2 text-2xl font-semibold">{activeStreaks}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-surface-strong px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">On pace</p>
                <p className="mt-2 text-2xl font-semibold">{habits.completionRate}%</p>
              </div>
            </div>

            <div className="no-scrollbar mt-5 space-y-3 overflow-y-auto pr-1 sm:max-h-[38rem]">
              {habits.summaries.length === 0 ? (
                <div className="rounded-[1.25rem] bg-surface-strong p-4 text-sm text-ink-soft">
                  No habits yet. Add your first one above and choose how many times per week it should happen.
                </div>
              ) : null}
              <div className="space-y-4">
                {groupedHabits.map(([category, categoryHabits]) => (
                  <details
                    key={category}
                    className="group rounded-[1.35rem] border border-border bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(250,243,232,0.92))] px-4 py-3"
                    open
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{category}</p>
                        <p className="mt-1 text-sm text-ink-soft">
                          {categoryHabits.length} habit{categoryHabits.length === 1 ? "" : "s"} in this section
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-border bg-white/80 px-2.5 py-1 text-xs text-ink-soft">
                          {categoryHabits.filter((habit) => habit.currentRun > 0).length} active streaks
                        </span>
                        <span className="rounded-full border border-border bg-white/80 px-2.5 py-1 text-xs font-medium text-foreground transition group-open:rotate-0">
                          Toggle
                        </span>
                      </div>
                    </summary>
                    <div className="mt-3 grid gap-3">
                      {categoryHabits.map((habit) => {
                        const pace = Math.min(100, Math.round((habit.completedThisWeek / habit.targetFrequency) * 100));

                        return (
                          <div
                            key={habit.id}
                            className="rounded-[1.15rem] border border-border bg-white/70 p-4"
                          >
                            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold">{habit.name}</p>
                                  <span className="rounded-full bg-[#f2e4d7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6d4d31]">
                                    {getHabitFrequencyLabel(habit.targetFrequency)}
                                  </span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                  <span className="rounded-full border border-border bg-white/80 px-2.5 py-1 text-ink-soft">
                                    {habit.completedThisWeek} of {habit.targetFrequency} this week
                                  </span>
                                  <span className="rounded-full border border-border bg-white/80 px-2.5 py-1 text-ink-soft">
                                    {habit.currentRun} day{habit.currentRun === 1 ? "" : "s"} streak
                                  </span>
                                  <span className="rounded-full border border-border bg-white/80 px-2.5 py-1 text-ink-soft">
                                    {pace}% pace
                                  </span>
                                </div>
                              </div>
                              <HabitLogButton
                                habitId={habit.id}
                                formClassName=""
                                buttonClassName="inline-flex w-fit rounded-full border border-border bg-[#fff8ef] px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent disabled:opacity-60"
                              />
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadbc9]">
                              <div
                                className="h-full rounded-full bg-[linear-gradient(90deg,#2f7d54_0%,#7db58e_100%)]"
                                style={{ width: `${pace}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    </AppShell>
  );
}
