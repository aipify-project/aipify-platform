import { NextResponse } from "next/server";
import { parseAipifyEthicalEvolutionResponsibleInnovationEngineDashboard } from "@/lib/aipify/aipify-ethical-evolution-responsible-innovation-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_ethical_evolution_responsible_innovation_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyEthicalEvolutionResponsibleInnovationEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
