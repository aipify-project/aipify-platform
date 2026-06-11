import { NextResponse } from "next/server";
import { parseDeploymentEnvironmentManagementEngineDashboard } from "@/lib/aipify/deployment-environment-management-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_deployment_environment_management_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDeploymentEnvironmentManagementEngineDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load deployment environment dashboard" },
      { status: 500 }
    );
  }
}
