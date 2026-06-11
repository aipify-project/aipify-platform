import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePilotInstallStatus } from "@/lib/aipify/pilot";
import { UNONIGHT_PILOT_SLUG } from "@/lib/aipify/integrations/unonight";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_pilot_install_status", {
      p_slug: UNONIGHT_PILOT_SLUG,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePilotInstallStatus(data));
  } catch {
    return NextResponse.json({ error: "Failed to load pilot status" }, { status: 500 });
  }
}
