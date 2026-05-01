import type { Goal, HabitSummary, ReviewSummary } from "@/lib/types";

const today = new Date("2026-05-01T09:00:00+08:00");

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function buildHeatmap(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));

    return {
      date: date.toISOString().slice(0, 10),
      value: [0, 1, 2, 3, 4][(index * 3 + 2) % 5],
    };
  });
}

const goals: Goal[] = [
  {
    title: "Ship Life OS v1 to Vercel",
    deadline: "May 15",
    progress: 76,
    ownerNote: "Keep the MVP narrow: focus, habits, goals, capture, review.",
    milestones: [
      { name: "Dashboard UI", status: "done" },
      { name: "Supabase schema", status: "active" },
      { name: "Cron review flow", status: "up-next" },
    ],
  },
  {
    title: "Build a stronger writing habit",
    deadline: "June 1",
    progress: 58,
    ownerNote: "Two deliberate sessions per week beats random bursts.",
    milestones: [
      { name: "Define topics list", status: "done" },
      { name: "Publish two drafts", status: "active" },
      { name: "Run retrospective", status: "up-next" },
    ],
  },
  {
    title: "Recover training consistency",
    deadline: "May 31",
    progress: 63,
    ownerNote: "Protect the floor: short sessions still count.",
    milestones: [
      { name: "4 sessions in week 1", status: "done" },
      { name: "5 sessions in week 2", status: "active" },
      { name: "Deload review", status: "up-next" },
    ],
  },
];

const habits: HabitSummary[] = [
  { name: "Exercise", currentRun: 8, completedThisWeek: 4 },
  { name: "Reading", currentRun: 12, completedThisWeek: 5 },
  { name: "Coding", currentRun: 19, completedThisWeek: 5 },
  { name: "Sleep cutoff", currentRun: 4, completedThisWeek: 3 },
];

const review: ReviewSummary = {
  readiness: "Auto-summary ready",
  prompt:
    "What created momentum this week, what quietly drained attention, and what single constraint would make next week cleaner?",
  highlights: [
    "Habits closed at 82% with coding and reading carrying the week.",
    "Main goal advanced from wireframe to deployable interface.",
    "Capture inbox grew by 11 items, so triage should happen before Monday.",
  ],
};

export function getDashboardSnapshot() {
  return {
    dailyFocus: {
      dateLabel: formatDateLabel(today),
      streakDays: 19,
      completedTasks: 2,
      morningMessage: "Protect the first 90 minutes from noise and win the day before lunch.",
      topTasks: [
        {
          title: "Finish Life OS dashboard polish",
          note: "Tighten layout, copy, and mobile responsiveness before deployment.",
          energy: "High focus" as const,
          done: true,
        },
        {
          title: "Write Supabase table plan",
          note: "Define tasks, habits, goals, milestones, and captures with simple ownership.",
          energy: "Medium lift" as const,
          done: true,
        },
        {
          title: "Plan weekly review prompt cadence",
          note: "Decide what the Friday cron should generate and where it lands.",
          energy: "Quick win" as const,
          done: false,
        },
      ],
    },
    goals,
    habits: {
      completionRate: 82,
      summaries: habits,
      heatmap: buildHeatmap(35),
    },
    review,
  };
}
