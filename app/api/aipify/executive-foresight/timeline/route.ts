import { NextResponse } from "next/server";
import { parseExecutiveForesightTimeline } from "@/lib/app-portal/executive-foresight";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_executive_foresight_timeline", {
      p_observation_id: searchParams.get("observation_id") || null,
      p_period_from: searchParams.get("period_from") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ events: parseExecutiveForesightTimeline(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load foresight timeline" }, { status: 500 });
  }
}
