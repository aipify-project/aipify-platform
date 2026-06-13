import { NextResponse } from "next/server";
import { parseAipifyEnterpriseOpportunityDiscoveryEngineCard } from "@/lib/aipify/aipify-enterprise-opportunity-discovery-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_enterprise_opportunity_discovery_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyEnterpriseOpportunityDiscoveryEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
