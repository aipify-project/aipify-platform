import { NextResponse } from "next/server";
import { parseGlobalDeploymentEnterpriseInfrastructureCenter } from "@/lib/aipify/global-deployment-enterprise-infrastructure-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_global_deployment_enterprise_infrastructure_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGlobalDeploymentEnterpriseInfrastructureCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load global deployment center" }, { status: 500 });
  }
}
