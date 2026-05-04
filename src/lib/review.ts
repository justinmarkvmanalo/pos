import { getDashboardSnapshot } from "@/lib/data";

function buildFallbackReviewText(snapshot: Awaited<ReturnType<typeof getDashboardSnapshot>>) {
  const activeGoal = snapshot.goals[0];
  const latestGoalLine = activeGoal
    ? `Primary goal: ${activeGoal.title} is ${activeGoal.progress}% complete.`
    : "Primary goal: no goals have been added yet.";

  return [
    `Weekly review for ${snapshot.dailyFocus.dateLabel}.`,
    `Completion: ${snapshot.habits.completionRate}% across tracked habits.`,
    latestGoalLine,
    `Focus tasks completed today: ${snapshot.dailyFocus.completedTasks}.`,
    `Reflection prompt: ${snapshot.review.prompt}`,
  ].join(" ");
}

export async function buildWeeklyReviewText() {
  const snapshot = await getDashboardSnapshot();
  const fallbackText = buildFallbackReviewText(snapshot);
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return fallbackText;
  }

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const recentGoals = snapshot.goals.slice(0, 3).map((goal) => ({
    title: goal.title,
    progress: goal.progress,
    deadline: goal.deadlineLabel,
    currentMilestone: goal.currentMilestone,
  }));
  const recentHabits = snapshot.habits.summaries.slice(0, 6).map((habit) => ({
    name: habit.name,
    targetFrequency: habit.targetFrequency,
    completedThisWeek: habit.completedThisWeek,
    currentRun: habit.currentRun,
  }));
  const previousReviews = snapshot.review.history.slice(0, 3).map((entry) => ({
    weekOf: entry.weekOf,
    summary: entry.summary,
  }));

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "You are an operating review assistant. Write concise weekly reviews grounded only in the data provided. Keep it to one short paragraph plus 2 to 4 short bullet-style sentences. Mention momentum, friction, and the next adjustment to make.",
          },
          {
            role: "user",
            content: JSON.stringify(
              {
                dateLabel: snapshot.dailyFocus.dateLabel,
                prompt: snapshot.review.prompt,
                completedTasksToday: snapshot.dailyFocus.completedTasks,
                totalTopTasksToday: snapshot.dailyFocus.topTasks.length,
                habitCompletionRate: snapshot.habits.completionRate,
                goals: recentGoals,
                habits: recentHabits,
                capturesInInbox: snapshot.captures.length,
                previousReviews,
              },
              null,
              2,
            ),
          },
        ],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackText;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();

    return content || fallbackText;
  } catch {
    return fallbackText;
  }
}
