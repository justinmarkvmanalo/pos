import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return Response.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const payload = (await request.json()) as { body?: string };
  const body = payload.body?.trim();

  if (!body) {
    return Response.json({ error: "Body is required." }, { status: 400 });
  }

  const { error } = await supabase.from("captures").insert({
    body,
    source: "manual",
    archived: false,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
