import { AppShell } from "@/components/app-shell";
import { getDashboardSnapshot } from "@/lib/mock-data";
import { buildWeeklyReviewText } from "@/lib/review";

export default function ReviewPage() {
  const { review, goals, habits } = getDashboardSnapshot();
  const summaryText = buildWeeklyReviewText();

  return (
    <AppShell>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Weekly review</p>
          <h1 className="display mt-2 text-4xl">Reflection with actual operating data</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink-soft">{review.prompt}</p>

          <div className="mt-6 rounded-[1.5rem] bg-[#201914] p-5 text-[#fff7ef]">
            <p className="text-xs uppercase tracking-[0.18em] text-[#d7c6b8]">Auto-summary draft</p>
            <p className="mt-3 text-sm leading-7">{summaryText}</p>
          </div>

          <div className="mt-6 space-y-3">
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
              {goals.map((goal) => (
                <div key={goal.title} className="rounded-[1.25rem] bg-surface-strong p-4">
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
              {habits.summaries.map((habit) => (
                <div key={habit.name} className="rounded-[1.25rem] bg-surface-strong p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{habit.name}</p>
                    <span className="text-sm text-ink-soft">{habit.completedThisWeek}/7</span>
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
