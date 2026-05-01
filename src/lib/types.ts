export type FocusTask = {
  title: string;
  note: string;
  energy: "High focus" | "Medium lift" | "Quick win";
  done: boolean;
};

export type Goal = {
  title: string;
  deadline: string;
  progress: number;
  ownerNote: string;
  milestones: { name: string; status: "done" | "active" | "up-next" }[];
};

export type HabitSummary = {
  name: string;
  currentRun: number;
  completedThisWeek: number;
};

export type ReviewSummary = {
  readiness: string;
  prompt: string;
  highlights: string[];
};
