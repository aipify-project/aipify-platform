import { NextResponse } from "next/server";
import { parsePersonalProductivityBriefing } from "@/lib/aipify/personal-productivity-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const briefingDate = searchParams.get("date");

    const { data, error } = await supabase.rpc("get_daily_productivity_briefing", {
      p_briefing_date: briefingDate ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePersonalProductivityBriefing(data));
  } catch {
    return NextResponse.json({ error: "Failed to load briefing" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { capture_memory?: boolean };
    const { data, error } = await supabase.rpc("generate_daily_briefing", {
      p_capture_memory: body.capture_memory ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePersonalProductivityBriefing(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
