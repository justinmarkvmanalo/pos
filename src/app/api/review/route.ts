import { getCurrentWeekIso, getReviewPrompt } from "@/lib/data";
import { buildWeeklyReviewText } from "@/lib/review";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return Response.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const summary = await buildWeeklyReviewText();
  const weekOf = getCurrentWeekIso();
  const prompt = getReviewPrompt();

  const { error } = await supabase.from("weekly_reviews").upsert(
    {
      week_of: weekOf,
      summary,
      prompt,
    },
    {
      onConflict: "week_of",
    },
  );

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    weekOf,
    summary,
  });
}
