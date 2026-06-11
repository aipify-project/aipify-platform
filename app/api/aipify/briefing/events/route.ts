import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBriefingEvents } from "@/lib/aipify/briefing";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const since = url.searchParams.get("since");
    const limit = Number(url.searchParams.get("limit") ?? "50");
    const { data, error } = await supabase.rpc("get_briefing_events", {
      p_since: since ?? undefined,
      p_limit: limit,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBriefingEvents(data));
  } catch {
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}
