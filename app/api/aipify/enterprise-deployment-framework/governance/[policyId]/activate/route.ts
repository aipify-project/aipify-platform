import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEnterpriseDeploymentFrameworkActionResult } from "@/lib/aipify/enterprise-deployment-framework";

type RouteContext = { params: Promise<{ policyId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { policyId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("activate_enterprise_governance_policy", {
      p_policy_id: policyId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseDeploymentFrameworkActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to activate governance policy" }, { status: 500 });
  }
}
