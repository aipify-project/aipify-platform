import { NextResponse } from "next/server";
import { parseDailyBriefingAction } from "@/lib/aipify/companion-daily-briefing/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { force?: boolean };
    const { data, error } = await supabase.rpc("generate_companion_daily_briefing", {
      p_force: body.force === true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseDailyBriefingAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
