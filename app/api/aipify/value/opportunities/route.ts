import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseValueOpportunities } from "@/lib/aipify/value-engine/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("detect_value_opportunities");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ opportunities: parseValueOpportunities(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load opportunities" }, { status: 500 });
  }
}
