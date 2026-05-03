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
  const { goals } = await getDashboardSnapshot();
  const goalExampleGroups = groupGoalExamples();

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

      <section className="grid gap-6 xl:grid-cols-3">
        {goals.length === 0 ? (
          <article className="panel rounded-[2rem] p-6 text-sm text-ink-soft xl:col-span-3">
            No goals yet. Add your first goal above, then break it into milestones here.
          </article>
        ) : null}
        {goals.map((goal) => (
          <article key={goal.id} className="panel rounded-[2rem] p-6">
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
              <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-strong">
                {goal.progress}%
              </span>
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
          </article>
        ))}
      </section>
    </AppShell>
  );
}
