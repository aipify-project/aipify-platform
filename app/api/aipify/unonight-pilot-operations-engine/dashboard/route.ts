import { NextResponse } from "next/server";
import { parseUnonightPilotOperationsDashboard } from "@/lib/aipify/unonight-pilot-operations-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_unonight_pilot_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseUnonightPilotOperationsDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Unonight pilot dashboard" }, { status: 500 });
  }
}
