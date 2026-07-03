import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCoreHumanApprovalRequest } from "@/lib/core/human-approval";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: approveData, error: approveError } = await supabase.rpc("approve_action_request", {
      p_request_id: id,
    });

    if (approveError) return NextResponse.json({ error: approveError.message }, { status: 400 });

    const approveRow = (approveData ?? {}) as Record<string, unknown>;
    const coreApprovalId =
      typeof approveRow.core_approval_id === "string" ? approveRow.core_approval_id : null;

    const { data: executeData, error: executeError } = await supabase.rpc("execute_action_request", {
      p_request_id: id,
    });

    if (executeError) {
      return NextResponse.json({ error: executeError.message }, { status: 400 });
    }

    const executeRow = (executeData ?? {}) as Record<string, unknown>;
    if (executeRow.ok === false) {
      return NextResponse.json(
        {
          ...executeRow,
          confirmed: false,
          coreApprovalId,
          correlationId:
            typeof executeRow.correlation_id === "string" ? executeRow.correlation_id : coreApprovalId,
        },
        { status: 400 },
      );
    }

    let receiptSource = null;
    if (coreApprovalId) {
      const { data: coreRequest, error: coreError } = await supabase.rpc(
        "get_core_human_approval_request",
        { p_request_id: coreApprovalId },
      );
      if (!coreError) {
        receiptSource = parseCoreHumanApprovalRequest(coreRequest);
      }
    }

    return NextResponse.json({
      ...(approveRow ?? {}),
      confirmed: true,
      coreApprovalId,
      correlationId:
        typeof approveRow.correlation_id === "string" ? approveRow.correlation_id : coreApprovalId,
      auditId: typeof approveRow.latest_audit_id === "string" ? approveRow.latest_audit_id : null,
      receiptSource,
    });
  } catch {
    return NextResponse.json({ error: "Failed to approve action" }, { status: 500 });
  }
}
