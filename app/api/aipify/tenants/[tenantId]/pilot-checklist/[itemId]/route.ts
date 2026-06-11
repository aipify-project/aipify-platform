import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ tenantId: string; itemId: string }> }
) {
  try {
    const { tenantId, itemId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const status = (body as { status?: string }).status;
    if (!status) return NextResponse.json({ error: "status is required" }, { status: 400 });

    const { data, error } = await supabase.rpc("update_pilot_checklist_item", {
      p_tenant_id: tenantId,
      p_item_id: itemId,
      p_status: status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 });
  }
}
