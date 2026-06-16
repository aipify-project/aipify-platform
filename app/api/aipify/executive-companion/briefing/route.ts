import { NextResponse } from "next/server";
import { parseExecutiveCompanionBriefing } from "@/lib/app-portal/executive-companion";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_executive_companion_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, briefing: parseExecutiveCompanionBriefing(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load briefing" }, { status: 500 });
  }
}
