import { NextResponse } from "next/server";
import { parseScenarioActionResult } from "@/lib/app-portal/scenario-planning";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      scenario_id?: string;
      scenario_ids?: string[];
      review_notes?: string;
    };

    const { data, error } = await supabase.rpc("review_app_portal_scenario_planning", {
      p_scenario_id: body.scenario_id ?? null,
      p_action: body.action ?? null,
      p_review_notes: body.review_notes ?? null,
      p_scenario_ids: body.scenario_ids ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseScenarioActionResult(data));
  } catch {
    return NextResponse.json({ error: "Scenario action failed" }, { status: 500 });
  }
}
