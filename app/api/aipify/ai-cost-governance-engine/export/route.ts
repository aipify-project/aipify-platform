import { NextResponse } from "next/server";
import { parseAiCostGovernanceExport } from "@/lib/aipify/ai-cost-governance-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("export_ai_cost_governance_manifest", {
      p_format: "json",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAiCostGovernanceExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export manifest" }, { status: 500 });
  }
}
