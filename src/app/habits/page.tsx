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
          <HabitForm />
          <CollapsiblePanel
            buttonLabel="Habit idea library"
            title="Habit idea library"
            description="This is a large built-in list of common human habits you can add with one click."
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
          <Heatmap entries={habits.heatmap} />
        </div>

        <div className="grid content-start auto-rows-max gap-6 self-start">
          {habits.summaries.length === 0 ? (
            <article className="panel self-start rounded-[2rem] p-6 text-sm text-ink-soft">
              No habits yet. Add your first one above and choose how many times per week it should happen.
            </article>
          ) : null}
          {habits.summaries.map((habit) => (
            <article key={habit.id} className="panel self-start rounded-[2rem] p-6">
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
