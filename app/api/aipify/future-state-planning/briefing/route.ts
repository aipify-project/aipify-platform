import { NextResponse } from "next/server";
import { parseFutureStateBriefing } from "@/lib/app-portal/future-state-planning";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_future_state_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFutureStateBriefing(data));
  } catch {
    return NextResponse.json({ error: "Failed to load executive briefing" }, { status: 500 });
  }
}
