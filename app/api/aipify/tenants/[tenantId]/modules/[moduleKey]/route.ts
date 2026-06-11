import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ tenantId: string; moduleKey: string }> }
) {
  try {
    const { tenantId, moduleKey } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_tenant_pilot_module", {
      p_tenant_id: tenantId,
      p_module_key: moduleKey,
      p_patch: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
  }
}
