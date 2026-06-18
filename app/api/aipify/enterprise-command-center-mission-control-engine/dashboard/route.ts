import { NextResponse } from "next/server";
import { parseEnterpriseCommandCenterMissionControl } from "@/lib/aipify/enterprise-command-center-mission-control-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_enterprise_command_center_mission_control");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseCommandCenterMissionControl(data));
  } catch {
    return NextResponse.json({ error: "Failed to load mission control center" }, { status: 500 });
  }
}
