import { NextResponse } from "next/server";
import { parseAipifyEnterpriseExternalIntelligenceMarketAwarenessEngineCard } from "@/lib/aipify/aipify-enterprise-external-intelligence-market-awareness-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_enterprise_external_intelligence_market_awareness_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyEnterpriseExternalIntelligenceMarketAwarenessEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
