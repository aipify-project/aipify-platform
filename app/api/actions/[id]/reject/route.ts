import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { reason?: string };
    const { data, error } = await supabase.rpc("reject_action_request", {
      p_request_id: id,
      p_reason: body.reason ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const row = (data ?? {}) as Record<string, unknown>;
    return NextResponse.json({
      ...row,
      confirmed: false,
      denied: true,
      coreApprovalId:
        typeof row.core_approval_id === "string" ? row.core_approval_id : null,
      correlationId: typeof row.correlation_id === "string" ? row.correlation_id : null,
      auditId: typeof row.latest_audit_id === "string" ? row.latest_audit_id : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to reject action" }, { status: 500 });
  }
}
