import { getOptionalAuthContext } from "@/lib/auth";
import { getCurrentWeekIso, getReviewPrompt } from "@/lib/data";
import { buildWeeklyReviewText } from "@/lib/review";
import { getSupabaseUserServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  void request;

  const auth = await getOptionalAuthContext();
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseUserServerClient(auth.accessToken);
  if (!supabase) {
    return Response.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const summary = await buildWeeklyReviewText();
  const weekOf = getCurrentWeekIso();
  const prompt = getReviewPrompt();

  const { error } = await supabase.from("weekly_reviews").upsert(
    {
      owner_id: auth.user.id,
      week_of: weekOf,
      summary,
      prompt,
    },
    {
      onConflict: "owner_id,week_of",
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
