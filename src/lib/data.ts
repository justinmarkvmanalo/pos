import { cache } from "react";
import { requireAuthContext } from "@/lib/auth";
import { getGoalSuggestions } from "@/lib/goal-suggestions";
import { getSupabaseUserServerClient, hasSupabaseEnv } from "@/lib/supabase";
import type {
  CaptureItem,
  DashboardSnapshot,
  FocusTask,
  Goal,
  GoalMilestone,
  GoalTrophy,
  HabitSummary,
  HeatmapEntry,
} from "@/lib/types";

type TaskRow = {
  id: string;
  title: string;
  note: string;
  energy: string;
  done: boolean;
  task_date: string;
};

type GoalRow = {
  id: string;
  title: string;
  owner_note: string;
  deadline: string | null;
  progress: number;
  updated_at: string;
};

type MilestoneRow = {
  id: string;
  goal_id: string;
  name: string;
  status: GoalMilestone["status"];
  sort_order: number;
};

type HabitRow = {
  id: string;
  name: string;
  target_frequency: number;
};

type HabitLogRow = {
  habit_id: string;
  completed_on: string;
  completed: boolean;
};

type CaptureRow = {
  id: string;
  body: string;
  created_at: string;
};

type WeeklyReviewRow = {
  id: string;
  week_of: string;
  summary: string;
  prompt: string;
};

function formatReviewWeekLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const REVIEW_PROMPT =
  "What created momentum this week, what introduced friction, and what should change before next Monday?";

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatDeadline(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatAwardedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function buildHeatmap(logs: HabitLogRow[]) {
  const today = new Date();
  const totals = new Map<string, number>();

  for (const log of logs) {
    if (log.completed) {
      totals.set(log.completed_on, (totals.get(log.completed_on) ?? 0) + 1);
    }
  }

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (34 - index));

    const isoDate = toIsoDate(date);
    const rawValue = totals.get(isoDate) ?? 0;

    return {
      date: isoDate,
      value: Math.min(rawValue, 4),
    } satisfies HeatmapEntry;
  });
}

function calculateCurrentRun(logs: HabitLogRow[]) {
  const completedDays = new Set(logs.filter((log) => log.completed).map((log) => log.completed_on));
  const cursor = new Date();
  let run = 0;

  while (completedDays.has(toIsoDate(cursor))) {
    run += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return run;
}

function buildGoals(goals: GoalRow[], milestones: MilestoneRow[]) {
  const milestoneMap = new Map<string, GoalMilestone[]>();

  for (const milestone of milestones) {
    const current = milestoneMap.get(milestone.goal_id) ?? [];
    current.push({
      id: milestone.id,
      name: milestone.name,
      status: milestone.status,
    });
    milestoneMap.set(milestone.goal_id, current);
  }

  return goals.map((goal) => {
    const milestonesForGoal = milestoneMap.get(goal.id) ?? [];
    const completedMilestones = milestonesForGoal.filter((milestone) => milestone.status === "done").length;
    const totalMilestones = milestonesForGoal.length;
    const activeMilestone =
      milestonesForGoal.find((milestone) => milestone.status === "active") ??
      milestonesForGoal.find((milestone) => milestone.status !== "done") ??
      null;
    const progress =
      totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

    return {
      id: goal.id,
      title: goal.title,
      deadline: goal.deadline,
      deadlineLabel: formatDeadline(goal.deadline),
      updatedAt: goal.updated_at,
      progress,
      ownerNote: goal.owner_note,
      completedMilestones,
      totalMilestones,
      currentMilestone: activeMilestone?.name ?? null,
      milestones: milestonesForGoal,
      suggestions: getGoalSuggestions(
        goal.title,
        goal.owner_note,
        milestonesForGoal.map((milestone) => milestone.name),
      ),
    };
  }) satisfies Goal[];
}

function buildGoalTrophies(goals: Goal[]) {
  return goals
    .filter((goal) => goal.progress === 100 && goal.totalMilestones > 0)
    .map((goal) => ({
      goalId: goal.id,
      title: goal.title,
      awardedLabel: formatAwardedDate(goal.updatedAt),
      summary: goal.deadlineLabel
        ? `Finished all milestones. Target date was ${goal.deadlineLabel}.`
        : "Finished all milestones for this goal.",
    })) satisfies GoalTrophy[];
}

function buildHabitSummaries(habits: HabitRow[], logs: HabitLogRow[]) {
  const weekStart = startOfWeek(new Date());
  const weekStartIso = toIsoDate(weekStart);
  const logsByHabit = new Map<string, HabitLogRow[]>();

  for (const log of logs) {
    const current = logsByHabit.get(log.habit_id) ?? [];
    current.push(log);
    logsByHabit.set(log.habit_id, current);
  }

  return habits.map((habit) => {
    const habitLogs = logsByHabit.get(habit.id) ?? [];
    const completedThisWeek = habitLogs.filter(
      (log) => log.completed && log.completed_on >= weekStartIso,
    ).length;

    return {
      id: habit.id,
      name: habit.name,
      targetFrequency: habit.target_frequency,
      currentRun: calculateCurrentRun(habitLogs),
      completedThisWeek,
    } satisfies HabitSummary;
  });
}

function buildReviewHighlights(
  tasks: FocusTask[],
  goals: Goal[],
  captures: CaptureItem[],
  habits: HabitSummary[],
) {
  const completedTasks = tasks.filter((task) => task.done).length;
  const habitsAboveZero = habits.filter((habit) => habit.completedThisWeek > 0).length;

  return [
    `${completedTasks} of ${tasks.length} focus tasks are complete today.`,
    `${goals.length} goals are active and ${habitsAboveZero} habits have activity this week.`,
    `${captures.length} recent captures are sitting in the inbox.`,
  ];
}

const emptySnapshot: DashboardSnapshot = {
  isConfigured: false,
  user: null,
  dailyFocus: {
    dateLabel: formatDateLabel(new Date()),
    completedTasks: 0,
    topTasks: [],
  },
  goals: [],
  goalTrophies: [],
  habits: {
    completionRate: 0,
    summaries: [],
    heatmap: buildHeatmap([]),
  },
  review: {
    readiness: "Configure Supabase",
    prompt: REVIEW_PROMPT,
    highlights: ["Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."],
    latestSummary: null,
    history: [],
  },
  captures: [],
};

export const getDashboardSnapshot = cache(async (): Promise<DashboardSnapshot> => {
  if (!hasSupabaseEnv()) {
    return emptySnapshot;
  }

  const auth = await requireAuthContext();
  const supabase = getSupabaseUserServerClient(auth.accessToken);
  if (!supabase) {
    return emptySnapshot;
  }

  const today = new Date();
  const todayIso = toIsoDate(today);
  const habitWindowStart = new Date(today);
  habitWindowStart.setDate(habitWindowStart.getDate() - 34);
  const habitWindowStartIso = toIsoDate(habitWindowStart);

  const [
    tasksResult,
    goalsResult,
    milestonesResult,
    habitsResult,
    habitLogsResult,
    capturesResult,
    reviewResult,
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("id,title,note,energy,done,task_date")
      .eq("task_date", todayIso)
      .order("focus_order", { ascending: true })
      .limit(3),
    supabase.from("goals").select("id,title,owner_note,deadline,progress,updated_at").order("created_at", {
      ascending: true,
    }),
    supabase.from("milestones").select("id,goal_id,name,status,sort_order").order("sort_order", {
      ascending: true,
    }),
    supabase.from("habits").select("id,name,target_frequency").order("name", {
      ascending: true,
    }),
    supabase
      .from("habit_logs")
      .select("habit_id,completed_on,completed")
      .gte("completed_on", habitWindowStartIso)
      .order("completed_on", { ascending: true }),
    supabase
      .from("captures")
      .select("id,body,created_at")
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("weekly_reviews")
      .select("id,week_of,summary,prompt")
      .order("week_of", { ascending: false }),
  ]);

  const tasks = (tasksResult.data ?? []) as TaskRow[];
  const goals = buildGoals((goalsResult.data ?? []) as GoalRow[], (milestonesResult.data ?? []) as MilestoneRow[]);
  const goalTrophies = buildGoalTrophies(goals);
  const habits = buildHabitSummaries(
    (habitsResult.data ?? []) as HabitRow[],
    (habitLogsResult.data ?? []) as HabitLogRow[],
  );
  const captures = ((capturesResult.data ?? []) as CaptureRow[]).map((capture) => ({
    id: capture.id,
    body: capture.body,
    createdAt: capture.created_at,
  }));
  const heatmap = buildHeatmap((habitLogsResult.data ?? []) as HabitLogRow[]);
  const completionRate =
    habits.length === 0
      ? 0
      : Math.round(
          (habits.reduce((total, habit) => total + habit.completedThisWeek, 0) /
            habits.reduce((total, habit) => total + habit.targetFrequency, 0)) *
            100,
        );
  const focusTasks = tasks.map(
    (task) =>
      ({
        id: task.id,
        title: task.title,
        note: task.note,
        energy: task.energy,
        done: task.done,
      }) satisfies FocusTask,
  );
  const reviewHistory = (reviewResult.data ?? []) as WeeklyReviewRow[];
  const latestReview = reviewHistory[0] ?? null;

  return {
    isConfigured: true,
    user: {
      id: auth.user.id,
      email: auth.user.email ?? "Account",
    },
    dailyFocus: {
      dateLabel: formatDateLabel(today),
      completedTasks: focusTasks.filter((task) => task.done).length,
      topTasks: focusTasks,
    },
    goals,
    goalTrophies,
    habits: {
      completionRate,
      summaries: habits,
      heatmap,
    },
    review: {
      readiness: latestReview ? "Latest review saved" : "No review saved yet",
      prompt: latestReview?.prompt || REVIEW_PROMPT,
      highlights: buildReviewHighlights(focusTasks, goals, captures, habits),
      latestSummary: latestReview?.summary ?? null,
      history: reviewHistory.map((entry) => ({
        id: entry.id,
        weekOf: formatReviewWeekLabel(entry.week_of),
        prompt: entry.prompt,
        summary: entry.summary,
      })),
    },
    captures,
  };
});

export function getReviewPrompt() {
  return REVIEW_PROMPT;
}

export function getCurrentWeekIso() {
  return toIsoDate(startOfWeek(new Date()));
}
