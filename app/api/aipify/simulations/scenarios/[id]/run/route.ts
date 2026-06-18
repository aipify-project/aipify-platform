import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSimulationRunResult } from "@/lib/aipify/simulation-lab/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("run_simulation", { p_scenario_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const result = parseSimulationRunResult(data);
    if (!result) return NextResponse.json({ error: "Simulation failed" }, { status: 400 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to run simulation" }, { status: 500 });
  }
}
