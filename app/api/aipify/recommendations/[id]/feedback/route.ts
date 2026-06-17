import { NextResponse } from "next/server";
import { parseCompanionRecommendationAction } from "@/lib/aipify/companion-recommendation-engine";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { feedback_type?: string };
    const { data, error } = await supabase.rpc("feedback_companion_recommendation", {
      p_rec_id: id,
      p_feedback_type: body.feedback_type ?? "helpful",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseCompanionRecommendationAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}
