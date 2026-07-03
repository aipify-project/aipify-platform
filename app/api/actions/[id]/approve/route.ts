import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildHumanApprovalReceiptModel,
  parseCoreHumanApprovalRequest,
} from "@/lib/core/human-approval";
import type { HumanApprovalReceiptLabels } from "@/lib/core/human-approval/types";

const RECEIPT_LABELS: HumanApprovalReceiptLabels = {
  title: "Approval confirmed",
  copy: "Copy",
  copied: "Copied",
  approvedBy: "Approved by",
  approverRole: "Approver role",
  approvedAt: "Approved at",
  action: "Action",
  scope: "Scope",
  target: "Target",
  validity: "Validity",
  oneTime: "One-time approval",
  ongoing: "Ongoing approval",
  expiresAt: "Expires at",
  auditId: "Audit ID",
  correlationId: "Correlation ID",
  status: "Status",
  executionResult: "Execution result",
  unchanged: "What will not change",
  notAvailable: "Not available",
};

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

    const { error: executeError } = await supabase.rpc("execute_action_request", {
      p_request_id: id,
    });

    if (executeError) {
      return NextResponse.json({ error: executeError.message }, { status: 400 });
    }

    let receipt = null;
    if (coreApprovalId) {
      const { data: coreRequest, error: coreError } = await supabase.rpc(
        "get_core_human_approval_request",
        { p_request_id: coreApprovalId },
      );
      if (!coreError) {
        const parsed = parseCoreHumanApprovalRequest(coreRequest);
        if (parsed) {
          receipt = buildHumanApprovalReceiptModel(parsed, RECEIPT_LABELS.title, RECEIPT_LABELS);
        }
      }
    }

    return NextResponse.json({
      ...(approveRow ?? {}),
      confirmed: true,
      coreApprovalId,
      correlationId:
        typeof approveRow.correlation_id === "string" ? approveRow.correlation_id : coreApprovalId,
      auditId: typeof approveRow.latest_audit_id === "string" ? approveRow.latest_audit_id : null,
      receipt,
    });
  } catch {
    return NextResponse.json({ error: "Failed to approve action" }, { status: 500 });
  }
}
