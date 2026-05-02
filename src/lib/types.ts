export type FocusTask = {
  id: string;
  title: string;
  note: string;
  energy: string;
  done: boolean;
};

export type GoalMilestone = {
  id: string;
  name: string;
  status: "done" | "active" | "up-next";
};

export type Goal = {
  id: string;
  title: string;
  deadline: string | null;
  progress: number;
  ownerNote: string;
  completedMilestones: number;
  totalMilestones: number;
  currentMilestone: string | null;
  milestones: GoalMilestone[];
};

export type HabitSummary = {
  id: string;
  name: string;
  targetFrequency: number;
  currentRun: number;
  completedThisWeek: number;
};

export type HeatmapEntry = {
  date: string;
  value: number;
};

export type ReviewSummary = {
  readiness: string;
  prompt: string;
  highlights: string[];
  latestSummary: string | null;
};

export type CaptureItem = {
  id: string;
  body: string;
  createdAt: string;
};

export type DashboardSnapshot = {
  isConfigured: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  dailyFocus: {
    dateLabel: string;
    completedTasks: number;
    topTasks: FocusTask[];
  };
  goals: Goal[];
  habits: {
    completionRate: number;
    summaries: HabitSummary[];
    heatmap: HeatmapEntry[];
  };
  review: ReviewSummary;
  captures: CaptureItem[];
};
