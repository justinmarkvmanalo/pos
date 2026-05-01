import { getDashboardSnapshot } from "@/lib/mock-data";

export function buildWeeklyReviewText() {
  const snapshot = getDashboardSnapshot();
  const activeGoal = snapshot.goals[0];

  return [
    `Weekly review for ${snapshot.dailyFocus.dateLabel}.`,
    `Completion: ${snapshot.habits.completionRate}% across core habits.`,
    `Primary goal: ${activeGoal.title} is ${activeGoal.progress}% complete.`,
    `Reflection prompt: ${snapshot.review.prompt}`,
  ].join(" ");
}
