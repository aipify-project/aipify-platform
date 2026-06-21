import { NextResponse } from "next/server";
import { parseUnonightPilotCommandBrief } from "@/lib/unonight-pilot/parse";
import { createClient } from "@/lib/supabase/server";

/** APP read-only GET — tenant-scoped via RPC. */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_unonight_pilot_command_brief");
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 403 });
    return NextResponse.json(parseUnonightPilotCommandBrief(data));
  } catch {
    return NextResponse.json({ error: "Failed to load pilot brief" }, { status: 500 });
  }
}
