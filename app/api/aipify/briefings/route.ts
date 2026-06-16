import { NextResponse } from "next/server";
import { parseBriefingList } from "@/lib/app-portal/intelligence-briefings";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_briefings", {
      p_briefing_type: searchParams.get("briefing_type") || null,
      p_priority_level: searchParams.get("priority_level") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_period_to: searchParams.get("period_to") || null,
      p_audience: searchParams.get("audience") || null,
      p_org_status: searchParams.get("org_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseBriefingList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load briefings" }, { status: 500 });
  }
}
