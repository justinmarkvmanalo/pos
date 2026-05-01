import { getDashboardSnapshot } from "@/lib/data";

export async function buildWeeklyReviewText() {
  const snapshot = await getDashboardSnapshot();
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
