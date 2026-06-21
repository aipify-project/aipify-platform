import { NextResponse } from "next/server";
import { parseUnonightPilotHealthDashboard } from "@/lib/unonight-pilot/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_platform_unonight_pilot_health");
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 403 });
    return NextResponse.json(parseUnonightPilotHealthDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Unonight pilot health" }, { status: 500 });
  }
}
