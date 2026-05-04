const suggestionSets = [
  {
    keywords: ["graduation", "graduate", "college", "school", "degree", "thesis", "university"],
    suggestions: [
      "List every remaining requirement and deadline",
      "Meet with an adviser or professor to confirm graduation status",
      "Finish the highest-risk subject, thesis, or project first",
      "Build a weekly study and submission plan through graduation day",
      "Prepare final documents, clearances, and graduation paperwork",
    ],
  },
  {
    keywords: ["business", "startup", "company", "store", "shop", "saas", "app", "product"],
    suggestions: [
      "Define the exact customer problem this should solve",
      "Decide the smallest version worth launching",
      "Build the first usable prototype or offer page",
      "Talk to at least five target users for feedback",
      "Set a launch date and the metrics that will define success",
    ],
  },
  {
    keywords: ["job", "career", "work", "hire", "promotion", "resume", "interview"],
    suggestions: [
      "Define the role, company type, or promotion target clearly",
      "Update the resume, portfolio, and LinkedIn profile",
      "Build a short list of target companies or opportunities",
      "Schedule weekly applications, outreach, or interview practice",
      "Track responses and refine the pitch from feedback",
    ],
  },
  {
    keywords: ["job order", "requirements", "clearance", "approval", "submit", "submission"],
    suggestions: [
      "List the exact job order requirements and deadline",
      "Prepare every required document before submission day",
      "Finish the highest-risk requirement first",
      "Submit the complete job order packet and confirm receipt",
      "Follow up on the approval status before the deadline",
    ],
  },
  {
    keywords: ["fitness", "workout", "gym", "health", "weight", "muscle", "run"],
    suggestions: [
      "Set a measurable target and a deadline",
      "Choose the training schedule you can actually sustain",
      "Plan the food, sleep, and recovery support for the goal",
      "Create a weekly progress check using weight, reps, or distance",
      "Remove the biggest consistency blocker from the routine",
    ],
  },
  {
    keywords: ["money", "save", "savings", "debt", "finance", "financial", "budget"],
    suggestions: [
      "Set the exact amount to save or debt to clear",
      "Audit current spending and identify what can be cut",
      "Choose the weekly or monthly transfer target",
      "Automate payments or savings contributions",
      "Review progress every week and adjust the plan",
    ],
  },
  {
    keywords: ["travel", "trip", "vacation", "abroad"],
    suggestions: [
      "Choose the destination, dates, and trip budget",
      "Check passport, visa, and travel document requirements",
      "Book the highest-risk items first like flights or lodging",
      "Plan the daily itinerary around the must-do experiences",
      "Prepare a packing list and money plan before departure",
    ],
  },
];

const fallbackSuggestions = [
  "Define what finished looks like in one sentence",
  "Break the goal into the first three concrete steps",
  "Schedule the first deadline on the calendar",
  "Identify the main blocker and how you will handle it",
  "Set a weekly review to keep the goal moving",
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getGoalSuggestions(title: string, ownerNote: string, existingMilestones: string[]) {
  const haystack = `${title} ${ownerNote}`.toLowerCase();
  const matchedSet =
    suggestionSets.find((set) => set.keywords.some((keyword) => haystack.includes(keyword))) ??
    null;
  const existing = new Set(existingMilestones.map(normalize));
  const suggestions = (matchedSet?.suggestions ?? fallbackSuggestions).filter(
    (suggestion) => !existing.has(normalize(suggestion)),
  );

  return suggestions.slice(0, 4);
}
