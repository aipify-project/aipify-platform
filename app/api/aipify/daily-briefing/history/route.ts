import { NextResponse } from "next/server";
import { parseDailyBriefingHistory } from "@/lib/aipify/companion-daily-briefing/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? 14);
    const { data, error } = await supabase.rpc("get_companion_daily_briefing_history", {
      p_limit: Number.isFinite(limit) ? limit : 14,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseDailyBriefingHistory(data));
  } catch {
    return NextResponse.json({ error: "Failed to load briefing history" }, { status: 500 });
  }
}
