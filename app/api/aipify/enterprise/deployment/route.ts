import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseTenantDeploymentBundle } from "@/lib/aipify/enterprise";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_tenant_deployment_settings");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseTenantDeploymentBundle(data));
  } catch {
    return NextResponse.json({ error: "Failed to load deployment settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_tenant_deployment_settings", { p_patch: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseTenantDeploymentBundle(data));
  } catch {
    return NextResponse.json({ error: "Failed to update deployment settings" }, { status: 500 });
  }
}
