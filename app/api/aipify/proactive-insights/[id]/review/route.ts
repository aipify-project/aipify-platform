import { NextResponse } from "next/server";
import { parseProactiveInsightAction } from "@/lib/aipify/companion-proactive-insights-engine";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string };
    const { data, error } = await supabase.rpc("review_companion_proactive_insight", {
      p_insight_id: id,
      p_action: body.action ?? "review",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseProactiveInsightAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to review insight" }, { status: 500 });
  }
}
