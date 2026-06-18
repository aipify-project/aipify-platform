import { NextResponse } from "next/server";
import { parseHighPriorityInsights } from "@/lib/aipify/companion-proactive-insights-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? 10);
    const { data, error } = await supabase.rpc("list_companion_high_priority_insights", {
      p_limit: Number.isFinite(limit) ? limit : 10,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseHighPriorityInsights(data));
  } catch {
    return NextResponse.json({ error: "Failed to load high-priority insights" }, { status: 500 });
  }
}
