import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseScenarioComparison } from "@/lib/aipify/simulation-lab";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { scenario_ids?: string[] };
    if (!body.scenario_ids?.length) {
      return NextResponse.json({ error: "scenario_ids required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("compare_simulation_scenarios", {
      p_scenario_ids: body.scenario_ids,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseScenarioComparison(data));
  } catch {
    return NextResponse.json({ error: "Failed to compare scenarios" }, { status: 500 });
  }
}
