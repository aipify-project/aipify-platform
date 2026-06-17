import { NextResponse } from "next/server";
import { parseDailyBriefingFocus } from "@/lib/aipify/companion-daily-briefing";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_daily_briefing_focus");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseDailyBriefingFocus(data));
  } catch {
    return NextResponse.json({ error: "Failed to load briefing focus" }, { status: 500 });
  }
}
