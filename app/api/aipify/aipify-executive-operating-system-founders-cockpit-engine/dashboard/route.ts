import { NextResponse } from "next/server";
import { parseAipifyExecutiveOperatingSystemFoundersCockpitEngineDashboard } from "@/lib/aipify/aipify-executive-operating-system-founders-cockpit-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_executive_operating_system_founders_cockpit_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyExecutiveOperatingSystemFoundersCockpitEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
