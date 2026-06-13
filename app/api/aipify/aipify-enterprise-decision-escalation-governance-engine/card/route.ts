import { NextResponse } from "next/server";
import { parseAipifyEnterpriseDecisionEscalationGovernanceEngineCard } from "@/lib/aipify/aipify-enterprise-decision-escalation-governance-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_enterprise_decision_escalation_governance_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyEnterpriseDecisionEscalationGovernanceEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
