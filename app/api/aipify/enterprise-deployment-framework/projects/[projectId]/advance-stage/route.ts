import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEnterpriseDeploymentFrameworkActionResult } from "@/lib/aipify/enterprise-deployment-framework";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("advance_enterprise_deployment_stage", {
      p_project_id: projectId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseDeploymentFrameworkActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to advance deployment stage" }, { status: 500 });
  }
}
