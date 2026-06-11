import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseImpactScore } from "@/lib/aipify/value-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_impact_score");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseImpactScore(data));
  } catch {
    return NextResponse.json({ error: "Failed to load impact score" }, { status: 500 });
  }
}
