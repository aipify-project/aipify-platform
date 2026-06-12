import { NextResponse } from "next/server";
import { parseTrustReputationEngineCard } from "@/lib/aipify/trust-reputation-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_trust_reputation_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseTrustReputationEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
