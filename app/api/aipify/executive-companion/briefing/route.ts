import { NextResponse } from "next/server";
import { parseExecutiveCompanionBriefing as parsePortalBriefing } from "@/lib/app-portal/executive-companion";
import { parseExecutiveCompanionBriefing } from "@/lib/aipify/companion-executive-layer/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const period = new URL(request.url).searchParams.get("period") ?? "today";
    if (new URL(request.url).searchParams.get("layer") === "companion") {
      const { data, error } = await supabase.rpc("get_companion_executive_layer_briefing", {
        p_period: period,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(parseExecutiveCompanionBriefing(data));
    }

    const { data, error } = await supabase.rpc("get_app_portal_executive_companion_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, briefing: parsePortalBriefing(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load briefing" }, { status: 500 });
  }
}
