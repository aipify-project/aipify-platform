import { NextResponse } from "next/server";
import { parseAipifyTalentAcquisitionWorkforcePlanningEngineDashboard } from "@/lib/aipify/aipify-talent-acquisition-workforce-planning-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_talent_acquisition_workforce_planning_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyTalentAcquisitionWorkforcePlanningEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
