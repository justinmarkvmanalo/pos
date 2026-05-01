import { buildWeeklyReviewText } from "@/lib/review";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = buildWeeklyReviewText();

  return Response.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    summary,
    note: "Wire this route to Supabase inserts or a Groq/OpenAI summary call for production use.",
  });
}
