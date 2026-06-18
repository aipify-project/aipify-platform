import { NextResponse } from "next/server";
import { parseEnterpriseStrategicIntelligenceAdvisoryCenter } from "@/lib/aipify/enterprise-strategic-intelligence-advisory-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_enterprise_strategic_intelligence_advisory_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseStrategicIntelligenceAdvisoryCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load strategic intelligence center" }, { status: 500 });
  }
}
