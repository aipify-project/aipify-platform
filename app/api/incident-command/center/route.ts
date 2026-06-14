import { NextResponse } from "next/server";
import { parseIncidentCommandCenter } from "@/lib/incident-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_incident_command_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseIncidentCommandCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Incident Command Center" }, { status: 500 });
  }
}
