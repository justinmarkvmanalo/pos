import { getGoalSuggestions } from "@/lib/goal-suggestions";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function sanitizeMilestones(raw: unknown, existingMilestones: string[]) {
  const existing = new Set(existingMilestones.map(normalize));
  const unique = new Set<string>();
  const cleaned: string[] = [];

  if (!Array.isArray(raw)) {
    return cleaned;
  }

  for (const item of raw) {
    if (typeof item !== "string") {
      continue;
    }

    const value = item.trim();
    const key = normalize(value);

    if (!value || existing.has(key) || unique.has(key)) {
      continue;
    }

    unique.add(key);
    cleaned.push(value);
  }

  return cleaned.slice(0, 5);
}

export async function generateMilestoneSuggestions({
  title,
  ownerNote,
  existingMilestones,
}: {
  title: string;
  ownerNote: string;
  existingMilestones: string[];
}) {
  const fallback = getGoalSuggestions(title, ownerNote, existingMilestones);
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return fallback;
  }

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You turn one goal into concrete milestones. Return only valid JSON with a single key named milestones. milestones must be an array of 4 or 5 short strings. Each string must be a concrete, action-oriented milestone the user can add directly. Avoid vague advice, avoid duplicates, and avoid repeating existing milestones.",
          },
          {
            role: "user",
            content: JSON.stringify(
              {
                goalTitle: title,
                goalNote: ownerNote,
                existingMilestones,
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
      return fallback;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return fallback;
    }

    const parsed = JSON.parse(content) as { milestones?: unknown };
    const suggestions = sanitizeMilestones(parsed.milestones, existingMilestones);

    return suggestions.length > 0 ? suggestions : fallback;
  } catch {
    return fallback;
  }
}
