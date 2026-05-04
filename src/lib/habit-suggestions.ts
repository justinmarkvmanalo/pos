export type HabitSuggestion = {
  category: string;
  name: string;
  targetFrequency: number;
};

export const habitSuggestions: HabitSuggestion[] = [
  { category: "Health", name: "Drink water", targetFrequency: 7 },
  { category: "Health", name: "Exercise", targetFrequency: 5 },
  { category: "Health", name: "Stretch", targetFrequency: 7 },
  { category: "Health", name: "Walk 10 minutes", targetFrequency: 7 },
  { category: "Health", name: "Sleep 8 hours", targetFrequency: 7 },
  { category: "Health", name: "Take vitamins", targetFrequency: 7 },
  { category: "Health", name: "Prepare healthy meals", targetFrequency: 5 },
  { category: "Health", name: "Practice good posture", targetFrequency: 7 },
  { category: "Mind", name: "Meditate", targetFrequency: 7 },
  { category: "Mind", name: "Journal", targetFrequency: 7 },
  { category: "Mind", name: "Read 10 pages", targetFrequency: 7 },
  { category: "Mind", name: "Practice gratitude", targetFrequency: 7 },
  { category: "Mind", name: "Limit social media", targetFrequency: 7 },
  { category: "Mind", name: "No phone before bed", targetFrequency: 7 },
  { category: "Mind", name: "Deep breathing", targetFrequency: 7 },
  { category: "Mind", name: "Review the day", targetFrequency: 7 },
  { category: "Work", name: "Plan the day", targetFrequency: 5 },
  { category: "Work", name: "Clear inbox", targetFrequency: 5 },
  { category: "Work", name: "Do one deep work block", targetFrequency: 5 },
  { category: "Work", name: "Review priorities", targetFrequency: 5 },
  { category: "Work", name: "Track spending", targetFrequency: 3 },
  { category: "Work", name: "Study a skill", targetFrequency: 5 },
  { category: "Work", name: "Write progress notes", targetFrequency: 5 },
  { category: "Work", name: "Practice typing or coding", targetFrequency: 5 },
  { category: "Home", name: "Make the bed", targetFrequency: 7 },
  { category: "Home", name: "Clean for 10 minutes", targetFrequency: 7 },
  { category: "Home", name: "Wash dishes", targetFrequency: 7 },
  { category: "Home", name: "Do laundry", targetFrequency: 2 },
  { category: "Home", name: "Declutter one area", targetFrequency: 3 },
  { category: "Home", name: "Take out trash", targetFrequency: 2 },
  { category: "Home", name: "Meal prep", targetFrequency: 1 },
  { category: "Home", name: "Reset workspace", targetFrequency: 5 },
  { category: "Relationships", name: "Message family", targetFrequency: 3 },
  { category: "Relationships", name: "Call a friend", targetFrequency: 1 },
  { category: "Relationships", name: "Have device-free dinner", targetFrequency: 5 },
  { category: "Relationships", name: "Give a compliment", targetFrequency: 7 },
  { category: "Relationships", name: "Check in with partner", targetFrequency: 7 },
  { category: "Relationships", name: "Do one act of kindness", targetFrequency: 3 },
  { category: "Growth", name: "Practice a hobby", targetFrequency: 3 },
  { category: "Growth", name: "Learn new vocabulary", targetFrequency: 5 },
  { category: "Growth", name: "Review goals", targetFrequency: 1 },
  { category: "Growth", name: "Read scripture or reflection", targetFrequency: 7 },
  { category: "Growth", name: "Practice public speaking", targetFrequency: 2 },
  { category: "Growth", name: "Write ideas", targetFrequency: 5 },
  { category: "Growth", name: "Budget review", targetFrequency: 1 },
  { category: "Growth", name: "Work on a side project", targetFrequency: 3 },
];

export function groupHabitSuggestions() {
  const groups = new Map<string, HabitSuggestion[]>();

  for (const suggestion of habitSuggestions) {
    const current = groups.get(suggestion.category) ?? [];
    current.push(suggestion);
    groups.set(suggestion.category, current);
  }

  return Array.from(groups.entries()).map(([category, suggestions]) => ({
    category,
    suggestions,
  }));
}

export function getHabitCategory(name: string) {
  const normalized = name.trim().toLowerCase();
  const matchedSuggestion = habitSuggestions.find((suggestion) => suggestion.name.toLowerCase() === normalized);

  return matchedSuggestion?.category ?? "Custom";
}
