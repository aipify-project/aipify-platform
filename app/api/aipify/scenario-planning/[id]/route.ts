import { NextResponse } from "next/server";
import { parseScenarioDetail } from "@/lib/app-portal/scenario-planning";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_scenario_planning_scenario", {
      p_scenario_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseScenarioDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load scenario" }, { status: 500 });
  }
}
