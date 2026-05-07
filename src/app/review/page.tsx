import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { ReviewGenerateButton } from "@/components/review-generate-button";
import { getReviewSnapshot } from "@/lib/data";
import { buildWeeklyReviewInsight } from "@/lib/review";

export default async function ReviewPage() {
  await connection();
  const { review, goals, habits } = await getReviewSnapshot();
  const reviewInsight = await buildWeeklyReviewInsight();
  const latestInsight = review.latestInsight ?? reviewInsight;
  const previousReviews = review.history.slice(1);

  return (
    <AppShell>
      <section className="grid items-start gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Weekly review</p>
          <h1 className="display mt-2 text-4xl">Reflection with actual operating data</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">Use the week&apos;s real activity to decide what changes next.</p>
          <ReviewGenerateButton />

          <div className="mt-6 rounded-[1.5rem] bg-[#201914] p-5 text-[#fff7ef]">
            <p className="text-xs uppercase tracking-[0.18em] text-[#d7c6b8]">Latest review summary</p>
            <p className="mt-3 text-sm leading-7">{review.latestSummary ?? reviewInsight.summary}</p>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-border bg-surface-strong p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">AI suggestions</p>
              <span className="rounded-full bg-[#f2e4d7] px-3 py-1 text-sm font-medium text-[#6d4d31]">
                Score {latestInsight.score}/100
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Momentum</p>
                <p className="mt-2 text-sm leading-7">{latestInsight.momentum}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Friction</p>
                <p className="mt-2 text-sm leading-7">{latestInsight.friction}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Change before next Monday</p>
                <p className="mt-2 text-sm leading-7">{latestInsight.nextChange}</p>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">Weekly note</p>
                <p className="mt-2 text-sm leading-7">{latestInsight.weeklyNote}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-border bg-surface-strong p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">Weekly improvement</p>
              <span className="text-sm text-ink-soft">{review.histogram.length} weeks</span>
            </div>
            {review.histogram.length === 0 ? (
              <div className="mt-4 rounded-[1.25rem] border border-dashed border-border bg-white/70 p-4 text-sm text-ink-soft">
                Generate at least one new review to start building the weekly histogram.
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex h-52 items-end gap-3 overflow-x-auto pb-2">
                  {review.histogram.map((entry) => (
                    <div key={entry.weekOf} className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-2">
                      <div className="text-xs font-medium text-ink-soft">{entry.score}</div>
                      <div className="flex h-40 w-full items-end">
                        <div
                          className={`w-full rounded-t-[1rem] ${
                            entry.trend === "improved"
                              ? "bg-[linear-gradient(180deg,#6ec28f_0%,#2f7d54_100%)]"
                              : entry.trend === "steady"
                                ? "bg-[linear-gradient(180deg,#e4c27a_0%,#b88932_100%)]"
                                : "bg-[linear-gradient(180deg,#e59b86_0%,#b84c2f_100%)]"
                          }`}
                          style={{ height: `${Math.max(16, entry.score)}%` }}
                          title={`${entry.weekOf}: ${entry.score} - ${entry.weeklyNote}`}
                        />
                      </div>
                      <div className="text-center text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                        {entry.weekOf}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3">
                  {review.histogram.map((entry) => (
                    <div key={`${entry.weekOf}-note`} className="rounded-[1.25rem] bg-white/70 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium">{entry.weekOf}</p>
                        <span className="text-sm text-ink-soft">{entry.score}/100</span>
                      </div>
                      <p className="mt-2 text-sm leading-7">{entry.weeklyNote}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">Past reviews</p>
              <span className="text-sm text-ink-soft">{previousReviews.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {previousReviews.length === 0 ? (
                <div className="rounded-[1.25rem] border border-dashed border-border bg-surface-strong p-4 text-sm text-ink-soft">
                  No past reviews yet.
                </div>
              ) : null}
              {previousReviews.map((entry) => (
                <article key={entry.id} className="rounded-[1.25rem] border border-border bg-surface-strong p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">Week of {entry.weekOf}</p>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{entry.prompt}</p>
                  <p className="mt-3 text-sm leading-7">{entry.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {review.highlights.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-surface-strong p-4 text-sm text-ink-soft">
                No review highlights yet.
              </div>
            ) : null}
            {review.highlights.map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-border bg-surface-strong p-4">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <article className="panel rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">Goal pulse</p>
            <div className="mt-4 space-y-3">
              {goals.length === 0 ? (
                <div className="rounded-[1.25rem] bg-surface-strong p-4 text-sm text-ink-soft">
                  No goals yet.
                </div>
              ) : null}
              {goals.map((goal) => (
                <div key={goal.id} className="rounded-[1.25rem] bg-surface-strong p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{goal.title}</p>
                    <span className="text-sm text-ink-soft">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-ink-soft">Habit pulse</p>
            <div className="mt-4 space-y-3">
              {habits.summaries.length === 0 ? (
                <div className="rounded-[1.25rem] bg-surface-strong p-4 text-sm text-ink-soft">
                  No habit activity yet.
                </div>
              ) : null}
              {habits.summaries.map((habit) => (
                <div key={habit.id} className="rounded-[1.25rem] bg-surface-strong p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{habit.name}</p>
                    <span className="text-sm text-ink-soft">
                      {habit.completedThisWeek}/{habit.targetFrequency}
                    </span>
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
