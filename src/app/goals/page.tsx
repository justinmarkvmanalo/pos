import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { CollapsiblePanel } from "@/components/collapsible-panel";
import { GoalDeadlineForm } from "@/components/goal-deadline-form";
import { GoalExampleForm } from "@/components/goal-example-form";
import { GoalForm } from "@/components/goal-form";
import { GoalDeleteForm } from "@/components/goal-delete-form";
import { MilestoneDeleteForm } from "@/components/milestone-delete-form";
import { MilestoneForm } from "@/components/milestone-form";
import { MilestoneSuggestionForm } from "@/components/milestone-suggestion-form";
import { MilestoneStatusForm } from "@/components/milestone-status-form";
import { getDashboardSnapshot } from "@/lib/data";
import { groupGoalExamples } from "@/lib/goal-examples";

export default async function GoalsPage() {
  await connection();
  const { goals, goalTrophies } = await getDashboardSnapshot();
  const goalExampleGroups = groupGoalExamples();
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <AppShell>
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Goal tracker</p>
        <h1 className="display mt-2 text-4xl">Milestones with deadline pressure</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">
          Goals stay concrete here: write the outcome once, break it into milestones, and let the
          app calculate progress from what is actually finished.
        </p>
        <GoalForm />
        <CollapsiblePanel
          buttonLabel="Goal idea library"
          title="Goal idea library"
          description="This keeps manual goal creation, but also gives you many example goals you can add with one click and customize later with milestones and notes."
        >
          <div className="mt-4 grid gap-4">
            {goalExampleGroups.map((group) => (
              <div key={group.category}>
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{group.category}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {group.examples.map((example) => (
                    <GoalExampleForm
                      key={example.title}
                      title={example.title}
                      ownerNote={example.ownerNote}
                      starterMilestones={example.starterMilestones}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsiblePanel>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6 xl:grid-cols-2">
        {goals.length === 0 ? (
          <article className="panel rounded-[2rem] p-6 text-sm text-ink-soft xl:col-span-2">
            No goals yet. Add your first goal above, then break it into milestones here.
          </article>
        ) : null}
        {goals.map((goal) => (
          <article key={goal.id} className="panel rounded-[2rem] p-6">
            {(() => {
              const isFailed = Boolean(goal.deadline && goal.progress < 100 && goal.deadline < todayIso);

              return (
                <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">
                  {goal.deadlineLabel ? `Due ${goal.deadlineLabel}` : "No deadline set"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{goal.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">
                  {goal.totalMilestones === 0
                    ? "Add milestones to turn this into an actionable plan."
                    : `${goal.completedMilestones} of ${goal.totalMilestones} milestones done${
                        goal.currentMilestone ? ` | Current: ${goal.currentMilestone}` : ""
                      }`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-strong">
                  {goal.progress}%
                </span>
                {isFailed ? (
                  <span className="rounded-full bg-[#f4d3cc] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#a33a22]">
                    Failed
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-4">
              <GoalDeleteForm goalId={goal.id} />
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#eadbc9]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#c85f32_0%,#e09e73_100%)]"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-ink-soft">{goal.ownerNote}</p>
            <GoalDeadlineForm goalId={goal.id} deadline={goal.deadline} />
            <CollapsiblePanel
              buttonLabel="Milestones"
              title="Milestones"
              description="Open this section to review milestone progress, add suggested steps, or create your own next action for this goal."
            >
              <div className="space-y-3">
                {goal.milestones.length === 0 ? (
                  <div className="rounded-[1.25rem] border border-dashed border-border bg-surface-strong px-4 py-3 text-sm text-ink-soft">
                    No milestones yet.
                  </div>
                ) : null}
                {goal.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="rounded-[1.25rem] border border-border bg-white/70 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                        {milestone.status}
                      </p>
                      <MilestoneDeleteForm milestoneId={milestone.id} />
                    </div>
                    <p className="mt-1 text-sm font-medium">{milestone.name}</p>
                    <MilestoneStatusForm
                      milestoneId={milestone.id}
                      currentStatus={milestone.status}
                    />
                  </div>
                ))}
              </div>
              {goal.suggestions.length > 0 ? (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                    Need ideas? Start here
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    Tap a suggestion to turn it into a milestone for this goal.
                  </p>
                  <div className="mt-4 grid gap-2">
                    {goal.suggestions.map((suggestion) => (
                      <MilestoneSuggestionForm
                        key={`${goal.id}-${suggestion}`}
                        goalId={goal.id}
                        suggestion={suggestion}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              <MilestoneForm goalId={goal.id} />
            </CollapsiblePanel>
                </>
              );
            })()}
          </article>
        ))}
        </div>
        <aside className="panel self-start rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Trophy case</p>
          <h2 className="mt-2 text-2xl font-semibold">Finished goals</h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            Every goal that reaches full completion earns a trophy here.
          </p>
          <div className="mt-5 space-y-3">
            {goalTrophies.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-surface-strong px-4 py-4 text-sm text-ink-soft">
                No trophies yet. Finish a goal to unlock your first one.
              </div>
            ) : null}
            {goalTrophies.map((trophy) => (
              <div
                key={trophy.goalId}
                className="rounded-[1.5rem] border border-[#e6d39a] bg-[linear-gradient(145deg,#fff7dc_0%,#f6e6a8_100%)] px-4 py-4 shadow-[0_16px_30px_rgba(145,112,23,0.12)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c9961d] text-sm font-bold text-[#fff8e8]">
                    TOP
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8b6414]">
                      Awarded {trophy.awardedLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#4f3610]">{trophy.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#6d5321]">{trophy.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
