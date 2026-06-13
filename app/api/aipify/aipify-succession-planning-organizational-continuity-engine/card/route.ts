import { NextResponse } from "next/server";
import { parseAipifySuccessionPlanningOrganizationalContinuityEngineCard } from "@/lib/aipify/aipify-succession-planning-organizational-continuity-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_succession_planning_organizational_continuity_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifySuccessionPlanningOrganizationalContinuityEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
