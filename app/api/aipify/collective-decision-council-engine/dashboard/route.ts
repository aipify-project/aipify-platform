import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCollectiveDecisionCouncilDashboard } from "@/lib/aipify/collective-decision-council-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_collective_decision_council_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCollectiveDecisionCouncilDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load collective decision council dashboard" },
      { status: 500 }
    );
  }
}
