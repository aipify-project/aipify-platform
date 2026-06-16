import { NextResponse } from "next/server";
import { parseExecutiveCompanionOverview } from "@/lib/app-portal/executive-companion";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_executive_companion", {
      p_period_from: searchParams.get("period_from") || null,
      p_priority: searchParams.get("priority") || null,
      p_strategic_area: searchParams.get("strategic_area") || null,
      p_organizational_area: searchParams.get("organizational_area") || null,
      p_focus_category: searchParams.get("focus_category") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutiveCompanionOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load executive companion" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("begin_app_portal_executive_companion_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseExecutiveCompanionOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
