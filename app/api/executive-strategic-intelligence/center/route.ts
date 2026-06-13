import { NextResponse } from "next/server";
import { parseExecutiveStrategicIntelligenceCenter } from "@/lib/executive-strategic-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_executive_strategic_intelligence_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseExecutiveStrategicIntelligenceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Strategic Intelligence Center" }, { status: 500 });
  }
}
