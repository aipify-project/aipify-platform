import { NextResponse } from "next/server";
import { parseProactiveInsightDetail } from "@/lib/aipify/companion-proactive-insights-engine";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_proactive_insight", { p_insight_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseProactiveInsightDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load insight" }, { status: 500 });
  }
}
