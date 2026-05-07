import { getReviewInsightSnapshot } from "@/lib/data";

export type WeeklyReviewInsight = {
  summary: string;
  momentum: string;
  friction: string;
  nextChange: string;
  score: number;
  weeklyNote: string;
  trend: "improved" | "steady" | "slipped";
};

const REVIEW_META_MARKER = "[[WINOS_REVIEW_META]]";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getFallbackScore(snapshot: Awaited<ReturnType<typeof getReviewInsightSnapshot>>) {
  const habitScore = snapshot.habits.completionRate;
  const goalScore =
    snapshot.goals.length === 0
      ? 50
      : Math.round(snapshot.goals.reduce((total, goal) => total + goal.progress, 0) / snapshot.goals.length);
  const focusScore =
    snapshot.dailyFocus.topTasks.length === 0
      ? 50
      : Math.round((snapshot.dailyFocus.completedTasks / snapshot.dailyFocus.topTasks.length) * 100);

  return clampScore(Math.round(habitScore * 0.45 + goalScore * 0.35 + focusScore * 0.2));
}

function getTrendFromScore(score: number) {
  if (score >= 70) {
    return "improved" as const;
  }

  if (score >= 45) {
    return "steady" as const;
  }

  return "slipped" as const;
}

function encodeReviewInsight(insight: WeeklyReviewInsight) {
  return `${insight.summary}\n\n${REVIEW_META_MARKER}${JSON.stringify({
    momentum: insight.momentum,
    friction: insight.friction,
    nextChange: insight.nextChange,
    score: insight.score,
    weeklyNote: insight.weeklyNote,
    trend: insight.trend,
  })}`;
}

export function parseStoredReviewSummary(summary: string) {
  const markerIndex = summary.indexOf(REVIEW_META_MARKER);

  if (markerIndex === -1) {
    return {
      cleanSummary: summary.trim(),
      meta: null,
    };
  }

  const cleanSummary = summary.slice(0, markerIndex).trim();
  const rawMeta = summary.slice(markerIndex + REVIEW_META_MARKER.length).trim();

  try {
    const parsed = JSON.parse(rawMeta) as Partial<Omit<WeeklyReviewInsight, "summary">>;
    if (
      typeof parsed.momentum === "string" &&
      typeof parsed.friction === "string" &&
      typeof parsed.nextChange === "string" &&
      typeof parsed.score === "number" &&
      typeof parsed.weeklyNote === "string" &&
      (parsed.trend === "improved" || parsed.trend === "steady" || parsed.trend === "slipped")
    ) {
      return {
        cleanSummary,
        meta: {
          momentum: parsed.momentum.trim(),
          friction: parsed.friction.trim(),
          nextChange: parsed.nextChange.trim(),
          score: clampScore(parsed.score),
          weeklyNote: parsed.weeklyNote.trim(),
          trend: parsed.trend,
        },
      };
    }
  } catch {
    return {
      cleanSummary,
      meta: null,
    };
  }

  return {
    cleanSummary,
    meta: null,
  };
}

function buildFallbackReviewInsight(
  snapshot: Awaited<ReturnType<typeof getReviewInsightSnapshot>>,
): WeeklyReviewInsight {
  const activeGoal = snapshot.goals[0];
  const latestGoalLine = activeGoal
    ? `Primary goal: ${activeGoal.title} is ${activeGoal.progress}% complete.`
    : "Primary goal: no goals have been added yet.";

  const score = getFallbackScore(snapshot);
  const trend = getTrendFromScore(score);

  return {
    summary: [
      `Weekly review for ${snapshot.dailyFocus.dateLabel}.`,
      `Completion: ${snapshot.habits.completionRate}% across tracked habits.`,
      latestGoalLine,
      `Focus tasks completed today: ${snapshot.dailyFocus.completedTasks}.`,
      `Reflection prompt: ${snapshot.review.prompt}`,
    ].join(" "),
    momentum:
      snapshot.habits.completionRate >= 60
        ? "Habit consistency is creating momentum, and at least part of the weekly system is holding."
        : "Momentum is limited right now, with habit consistency still below a reliable weekly pace.",
    friction:
      snapshot.captures.length > 0
        ? `${snapshot.captures.length} capture items are still open, which may be adding mental drag.`
        : "No major inbox backlog is showing, so the main friction is likely execution consistency.",
    nextChange:
      snapshot.goals[0]?.currentMilestone
        ? `Before next Monday, protect time for the current milestone: ${snapshot.goals[0].currentMilestone}.`
        : "Before next Monday, define one concrete milestone so the next week has a clear target.",
    score,
    weeklyNote:
      trend === "improved"
        ? "You improved this week. The system is moving forward and should be protected."
        : trend === "steady"
          ? "This week was steady. Progress is present, but the routine still needs tightening."
          : "This week slipped. Reduce friction and simplify the next week so execution is easier.",
    trend,
  };
}

function parseStructuredInsight(raw: string): WeeklyReviewInsight | null {
  try {
    const parsed = JSON.parse(raw) as Partial<WeeklyReviewInsight>;
    if (
      typeof parsed.summary === "string" &&
      typeof parsed.momentum === "string" &&
      typeof parsed.friction === "string" &&
      typeof parsed.nextChange === "string" &&
      typeof parsed.score === "number" &&
      typeof parsed.weeklyNote === "string" &&
      (parsed.trend === "improved" || parsed.trend === "steady" || parsed.trend === "slipped")
    ) {
      return {
        summary: parsed.summary.trim(),
        momentum: parsed.momentum.trim(),
        friction: parsed.friction.trim(),
        nextChange: parsed.nextChange.trim(),
        score: clampScore(parsed.score),
        weeklyNote: parsed.weeklyNote.trim(),
        trend: parsed.trend,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function buildWeeklyReviewInsight(): Promise<WeeklyReviewInsight> {
  const snapshot = await getReviewInsightSnapshot();
  const fallbackInsight = buildFallbackReviewInsight(snapshot);
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return fallbackInsight;
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
              "You are an operating review assistant. Return only valid JSON with exactly these string keys: summary, momentum, friction, nextChange, score, weeklyNote, trend. Ground everything only in the provided data. Keep each field concise and specific. score must be a number from 0 to 100. trend must be exactly one of: improved, steady, slipped. weeklyNote must say whether the user improved or not this week.",
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
      return fallbackInsight;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    const structuredInsight = content ? parseStructuredInsight(content) : null;

    return structuredInsight || fallbackInsight;
  } catch {
    return fallbackInsight;
  }
}

export async function buildWeeklyReviewText() {
  const insight = await buildWeeklyReviewInsight();
  return encodeReviewInsight(insight);
}
