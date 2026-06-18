import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePilotIntegrations } from "@/lib/aipify/pilot/parse";

export async function GET(
  _request: Request,
  context: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_tenant_integrations", {
      p_tenant_id: tenantId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePilotIntegrations(data));
  } catch {
    return NextResponse.json({ error: "Failed to load integrations" }, { status: 500 });
  }
}
