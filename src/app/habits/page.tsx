import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { CollapsiblePanel } from "@/components/collapsible-panel";
import { HabitForm } from "@/components/habit-form";
import { Heatmap } from "@/components/heatmap";
import { HabitLogButton } from "@/components/habit-log-button";
import { HabitSuggestionForm } from "@/components/habit-suggestion-form";
import { getDashboardSnapshot } from "@/lib/data";
import { groupHabitSuggestions } from "@/lib/habit-suggestions";
import { getHabitFrequencyLabel } from "@/lib/habits";

export default async function HabitsPage() {
  await connection();
  const { habits } = await getDashboardSnapshot();
  const suggestionGroups = groupHabitSuggestions();

  return (
    <AppShell>
      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Habit logger</p>
          <h1 className="display mt-2 text-4xl">See consistency, not isolated days</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
            Each habit has a weekly target, like every day or three times a week. You only need to
            log the days you did it, and the page shows whether you are on pace.
          </p>
          <div className="mt-5 flex flex-wrap items-start gap-3">
            <HabitForm className="mt-0" panelClassName="mt-4 rounded-[1.5rem] border border-border bg-surface-strong p-4" />
            <CollapsiblePanel
              buttonLabel="Habit idea library"
              title="Habit idea library"
              description="This is a large built-in list of common human habits you can add with one click."
              className="mt-0 rounded-[1.5rem] border border-dashed border-border bg-surface-strong p-4"
            >
              <div className="mt-4 grid gap-4">
                {suggestionGroups.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{group.category}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {group.suggestions.map((suggestion) => (
                        <HabitSuggestionForm
                          key={suggestion.name}
                          name={suggestion.name}
                          targetFrequency={suggestion.targetFrequency}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsiblePanel>
          </div>
          <Heatmap entries={habits.heatmap} />
        </div>

        <div className="grid content-start auto-rows-max gap-6 self-start">
          <article className="panel rounded-[2rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">Habit pulse</p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Weekly pace, current streak, and today&apos;s log stay in one compact block.
                </p>
              </div>
              <div className="rounded-full border border-border bg-surface-strong px-3 py-1 text-sm text-ink-soft">
                {habits.completionRate}% hit rate
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {habits.summaries.length === 0 ? (
                <div className="rounded-[1.25rem] bg-surface-strong p-4 text-sm text-ink-soft">
                  No habits yet. Add your first one above and choose how many times per week it should happen.
                </div>
              ) : null}
              {habits.summaries.map((habit) => (
                <div key={habit.id} className="rounded-[1.25rem] bg-surface-strong p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{habit.name}</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        This week: {habit.completedThisWeek} of {habit.targetFrequency}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f2e4d7] px-3 py-1 text-sm font-medium text-[#6d4d31]">
                      {habit.currentRun} day{habit.currentRun === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-ink-soft">
                      Target: {getHabitFrequencyLabel(habit.targetFrequency)}
                    </p>
                    <HabitLogButton
                      habitId={habit.id}
                      formClassName=""
                      buttonClassName="inline-flex w-fit rounded-full border border-border bg-[#fff8ef] px-3 py-1.5 text-sm font-semibold text-foreground transition hover:border-accent disabled:opacity-60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </AppShell>
  );
}
