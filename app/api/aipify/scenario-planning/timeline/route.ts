import { NextResponse } from "next/server";
import { parseScenarioTimeline } from "@/lib/app-portal/scenario-planning";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_scenario_planning_timeline", {
      p_scenario_id: searchParams.get("scenario_id") || null,
      p_period_from: searchParams.get("period_from") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ events: parseScenarioTimeline(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load scenario timeline" }, { status: 500 });
  }
}
