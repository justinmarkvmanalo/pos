import { getOptionalAuthContext } from "@/lib/auth";
import { generateMilestoneSuggestions } from "@/lib/milestone-ai";

export async function POST(request: Request) {
  const auth = await getOptionalAuthContext();
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      title?: unknown;
      ownerNote?: unknown;
      existingMilestones?: unknown;
    };

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const ownerNote = typeof body.ownerNote === "string" ? body.ownerNote.trim() : "";
    const existingMilestones = Array.isArray(body.existingMilestones)
      ? body.existingMilestones
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
      : [];

    if (!title) {
      return Response.json({ error: "Goal title is required." }, { status: 400 });
    }

    const suggestions = await generateMilestoneSuggestions({
      title,
      ownerNote,
      existingMilestones,
    });

    return Response.json({ suggestions });
  } catch {
    return Response.json({ error: "Could not generate milestone suggestions." }, { status: 500 });
  }
}
