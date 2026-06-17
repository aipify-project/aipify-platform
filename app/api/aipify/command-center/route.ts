import { NextResponse } from "next/server";
import { parseAbosCommandCenterOverview } from "@/lib/app-portal/abos-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_command_center", {
      p_organizational_area: searchParams.get("organizational_area") || null,
      p_priority: searchParams.get("priority") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_recommendation_type: searchParams.get("recommendation_type") || null,
      p_focus_category: searchParams.get("focus_category") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseAbosCommandCenterOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load command center" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("begin_app_portal_command_center_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAbosCommandCenterOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
