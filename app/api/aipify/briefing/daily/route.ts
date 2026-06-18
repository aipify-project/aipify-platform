import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBriefingFull } from "@/lib/aipify/briefing/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("generate_briefing_daily");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBriefingFull(data));
  } catch {
    return NextResponse.json({ error: "Failed to load daily brief" }, { status: 500 });
  }
}
