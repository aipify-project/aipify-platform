import { NextResponse } from "next/server";
import { getCustomerApprovalsCenter } from "@/lib/approvals-center";
import {
  isCoreHumanApprovalUiEnabled,
  isHumanApprovalPilotRole,
} from "@/lib/app/human-approval-nav";
import {
  buildCoreHumanApprovalRequestFromTrustRow,
  parseTrustApprovalFromCenterRow,
} from "@/lib/core/human-approval/trust-action-adapter";
import { isSafeCoreHumanApprovalRpcPayload } from "@/lib/core/human-approval/parse";
import { mapTrustStatusToCoreStatus, normalizeRiskLevel } from "@/lib/core/human-approval/status-labels";
import {
  appPortalAccessDeniedResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export type HumanApprovalListItem = {
  id: string;
  core_approval_id: string;
  title: string;
  summary: string;
  status: string;
  risk_level: number;
  access_mode: string;
  action_category: string;
  action_key: string;
  scope_summary: string;
  target_environment: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  correlation_id: string | null;
  latest_audit_id: string | null;
};

function mapCenterRowToListItem(row: Record<string, unknown>): HumanApprovalListItem | null {
  const parsed = parseTrustApprovalFromCenterRow(row);
  const core = buildCoreHumanApprovalRequestFromTrustRow(parsed);
  if (!core?.id) return null;

  const payload = {
    id: core.id,
    core_approval_id: core.id,
    title: core.title || parsed.title,
    summary: core.summary || parsed.description,
    status: mapTrustStatusToCoreStatus(parsed.status),
    risk_level: normalizeRiskLevel(core.risk_level),
    access_mode: core.access_mode,
    action_category: core.action_category,
    action_key: core.action_key,
    scope_summary: core.scope_summary,
    target_environment: core.target_environment,
    created_at: core.created_at,
    updated_at: core.updated_at,
    expires_at: core.expires_at,
    correlation_id: core.correlation_id,
    latest_audit_id: core.latest_audit_id,
  };

  if (!isSafeCoreHumanApprovalRpcPayload(payload)) return null;
  return payload;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", enabled: false }, { status: 401 });
    }

    if (!isCoreHumanApprovalUiEnabled()) {
      return NextResponse.json(
        { enabled: false, error: "feature_disabled", items: [] },
        { status: 404 },
      );
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    if (!isHumanApprovalPilotRole(access.context.organization_role)) {
      return appPortalAccessDeniedResponse("permission_missing", "human_approval_owner_admin_required");
    }

    const data = await getCustomerApprovalsCenter(supabase);
    const approvals = Array.isArray(data.approvals) ? data.approvals : [];

    const items = approvals
      .map((row) => mapCenterRowToListItem(row as Record<string, unknown>))
      .filter((item): item is HumanApprovalListItem => item !== null)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    return NextResponse.json({
      enabled: true,
      has_customer: data.has_customer === true,
      items,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load human approval requests";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[app/human-approval]", message);
    return NextResponse.json(
      { error: message, access_state, enabled: false, items: [] },
      { status: rpcErrorStatus(message, access_state) },
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
