import { NextResponse } from "next/server";
import { parseExecutiveStrategicDecisionCockpit } from "@/lib/executive-strategic-decision-cockpit";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_executive_strategic_decision_cockpit");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseExecutiveStrategicDecisionCockpit(data));
  } catch {
    return NextResponse.json({ error: "Failed to load executive decision cockpit" }, { status: 500 });
  }
}
