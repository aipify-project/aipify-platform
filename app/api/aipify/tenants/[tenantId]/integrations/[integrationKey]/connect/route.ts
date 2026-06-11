import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ tenantId: string; integrationKey: string }> }
) {
  try {
    const { tenantId, integrationKey } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const { data, error } = await supabase.rpc("connect_tenant_integration", {
      p_tenant_id: tenantId,
      p_integration_key: integrationKey,
      p_patch: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to connect integration" }, { status: 500 });
  }
}
