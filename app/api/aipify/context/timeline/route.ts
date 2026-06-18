import { NextResponse } from "next/server";
import { parseCompanionContextTimeline } from "@/lib/aipify/companion-context-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_context_timeline", {
      p_date_from: searchParams.get("date_from") || null,
      p_source:    searchParams.get("source")    || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCompanionContextTimeline(data));
  } catch {
    return NextResponse.json({ error: "Failed to load context timeline" }, { status: 500 });
  }
}
