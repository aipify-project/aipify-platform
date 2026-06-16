import { NextResponse } from "next/server";
import { parseMomentumTimeline } from "@/lib/app-portal/momentum";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_momentum_timeline", {
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, timeline: parseMomentumTimeline(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}
