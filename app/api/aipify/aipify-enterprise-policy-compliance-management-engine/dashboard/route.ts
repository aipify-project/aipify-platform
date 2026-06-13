import { NextResponse } from "next/server";
import { parseAipifyEnterprisePolicyComplianceManagementEngineDashboard } from "@/lib/aipify/aipify-enterprise-policy-compliance-management-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_enterprise_policy_compliance_management_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyEnterprisePolicyComplianceManagementEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
