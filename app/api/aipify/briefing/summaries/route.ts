import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBriefingSummaries } from "@/lib/aipify/briefing/parse";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? "20");
    const { data, error } = await supabase.rpc("get_briefing_summaries", { p_limit: limit });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBriefingSummaries(data));
  } catch {
    return NextResponse.json({ error: "Failed to load summaries" }, { status: 500 });
  }
}
