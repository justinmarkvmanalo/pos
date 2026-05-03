export type GoalExample = {
  category: string;
  title: string;
  ownerNote: string;
};

export const goalExamples: GoalExample[] = [
  {
    category: "Career",
    title: "Get promoted at work",
    ownerNote: "Build the skills, proof, and visibility needed for the next level.",
  },
  {
    category: "Career",
    title: "Land a new job",
    ownerNote: "Strengthen resume, portfolio, interview performance, and applications.",
  },
  {
    category: "Career",
    title: "Start a freelance service",
    ownerNote: "Turn an existing skill into paying client work.",
  },
  {
    category: "Career",
    title: "Build a professional portfolio",
    ownerNote: "Collect strong work samples that make opportunities easier to win.",
  },
  {
    category: "Career",
    title: "Learn public speaking",
    ownerNote: "Become more confident and clear when presenting in front of people.",
  },
  {
    category: "Business",
    title: "Launch a small business",
    ownerNote: "Validate an offer, find customers, and build a repeatable way to sell.",
  },
  {
    category: "Business",
    title: "Get the first 10 paying customers",
    ownerNote: "Focus on a simple offer and direct outreach until revenue starts.",
  },
  {
    category: "Business",
    title: "Create a personal brand online",
    ownerNote: "Publish consistently so more people know what I do.",
  },
  {
    category: "Business",
    title: "Build an online store",
    ownerNote: "Set up products, payments, and a simple marketing funnel.",
  },
  {
    category: "Business",
    title: "Increase monthly income",
    ownerNote: "Raise earnings through higher-value work, better pricing, or extra channels.",
  },
  {
    category: "Health",
    title: "Lose weight in a healthy way",
    ownerNote: "Improve food choices, consistency, and activity instead of chasing extremes.",
  },
  {
    category: "Health",
    title: "Build muscle",
    ownerNote: "Follow a training and nutrition plan consistently for visible progress.",
  },
  {
    category: "Health",
    title: "Run a 5K",
    ownerNote: "Build endurance and complete a concrete fitness milestone.",
  },
  {
    category: "Health",
    title: "Improve sleep quality",
    ownerNote: "Create evening routines and habits that support deeper rest.",
  },
  {
    category: "Health",
    title: "Lower stress",
    ownerNote: "Use routines and boundaries that reduce mental overload.",
  },
  {
    category: "Learning",
    title: "Learn English fluently",
    ownerNote: "Improve speaking, listening, reading, and writing through regular practice.",
  },
  {
    category: "Learning",
    title: "Learn to code",
    ownerNote: "Build practical projects and understand programming fundamentals.",
  },
  {
    category: "Learning",
    title: "Pass an important exam",
    ownerNote: "Study with structure, repetition, and timed practice.",
  },
  {
    category: "Learning",
    title: "Read 12 books this year",
    ownerNote: "Make reading a steady part of life and finish one book each month.",
  },
  {
    category: "Learning",
    title: "Master a new software tool",
    ownerNote: "Become productive enough to use it for real work.",
  },
  {
    category: "Money",
    title: "Save an emergency fund",
    ownerNote: "Build financial safety for unexpected expenses.",
  },
  {
    category: "Money",
    title: "Pay off debt",
    ownerNote: "Reduce pressure and create more room in the monthly budget.",
  },
  {
    category: "Money",
    title: "Buy a laptop",
    ownerNote: "Set aside money steadily for an important purchase.",
  },
  {
    category: "Money",
    title: "Start investing",
    ownerNote: "Learn the basics and begin with a simple long-term plan.",
  },
  {
    category: "Money",
    title: "Track every expense for 3 months",
    ownerNote: "Understand where money goes before making bigger financial changes.",
  },
  {
    category: "Relationships",
    title: "Improve family relationships",
    ownerNote: "Be more intentional with communication, time, and consistency.",
  },
  {
    category: "Relationships",
    title: "Build new friendships",
    ownerNote: "Create more connection by showing up, inviting, and following through.",
  },
  {
    category: "Relationships",
    title: "Strengthen my relationship",
    ownerNote: "Give more quality time, clearer communication, and shared attention.",
  },
  {
    category: "Relationships",
    title: "Be more socially confident",
    ownerNote: "Practice speaking, initiating, and staying present around people.",
  },
  {
    category: "Home",
    title: "Organize my room",
    ownerNote: "Create a cleaner space that supports focus and rest.",
  },
  {
    category: "Home",
    title: "Declutter the house",
    ownerNote: "Reduce excess and make daily life easier to manage.",
  },
  {
    category: "Home",
    title: "Set up a productive workspace",
    ownerNote: "Build an environment that makes focused work easier.",
  },
  {
    category: "Creative",
    title: "Start a YouTube channel",
    ownerNote: "Publish content consistently instead of waiting for perfect conditions.",
  },
  {
    category: "Creative",
    title: "Write a short book",
    ownerNote: "Turn ideas into a finished written project.",
  },
  {
    category: "Creative",
    title: "Record my first song",
    ownerNote: "Learn the process from concept to final output.",
  },
  {
    category: "Creative",
    title: "Build a game",
    ownerNote: "Ship a small playable version instead of only planning it.",
  },
  {
    category: "Life",
    title: "Wake up early consistently",
    ownerNote: "Create a daily rhythm that gives me more control of the morning.",
  },
  {
    category: "Life",
    title: "Build better discipline",
    ownerNote: "Follow through more often on what I say matters.",
  },
  {
    category: "Life",
    title: "Prepare for college",
    ownerNote: "Handle applications, requirements, and readiness step by step.",
  },
  {
    category: "Life",
    title: "Move to a new place",
    ownerNote: "Plan the financial, practical, and emotional transition carefully.",
  },
  {
    category: "Life",
    title: "Travel to another country",
    ownerNote: "Prepare budget, documents, and plans for a meaningful trip.",
  },
];

export function groupGoalExamples() {
  const groups = new Map<string, GoalExample[]>();

  for (const example of goalExamples) {
    const current = groups.get(example.category) ?? [];
    current.push(example);
    groups.set(example.category, current);
  }

  return Array.from(groups.entries()).map(([category, examples]) => ({
    category,
    examples,
  }));
}
