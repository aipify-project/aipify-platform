import { NextResponse } from "next/server";
import { parseDigitalWorkforceGovernanceCenter } from "@/lib/aipify/digital-workforce-governance-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_digital_workforce_governance_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDigitalWorkforceGovernanceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load digital workforce governance center" }, { status: 500 });
  }
}
