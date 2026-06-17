import { NextResponse } from "next/server";
import { parseICCBriefing } from "@/lib/app-portal/intelligence-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_intelligence_briefing", {
      p_period: searchParams.get("period") || "this_week",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ briefing: parseICCBriefing(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load briefing" }, { status: 500 });
  }
}
