import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEnterpriseDeploymentFrameworkCard } from "@/lib/aipify/enterprise-deployment-framework";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_enterprise_deployment_framework_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseDeploymentFrameworkCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load enterprise deployment framework card" }, { status: 500 });
  }
}
