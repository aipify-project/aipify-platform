import type { CoreHumanApprovalRequest } from "./types";

/** Client-safe trust row parsing — no node:crypto imports. */

export function parseTrustApprovalFromCenterRow(row: Record<string, unknown>) {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? "action"),
    status: String(row.status ?? "pending"),
    risk_level: String(row.risk_level ?? "1"),
    created_at: String(row.created_at ?? ""),
    action_name: typeof row.action_name === "string" ? row.action_name : undefined,
    skill_name: typeof row.skill_name === "string" ? row.skill_name : undefined,
    confidence_score: typeof row.confidence_score === "number" ? row.confidence_score : undefined,
    approver_role_required:
      typeof row.approver_role_required === "string" ? row.approver_role_required : undefined,
    undo_available: typeof row.undo_available === "boolean" ? row.undo_available : undefined,
    core_approval_id: typeof row.core_approval_id === "string" ? row.core_approval_id : null,
    correlation_id: typeof row.correlation_id === "string" ? row.correlation_id : null,
    latest_audit_id: typeof row.latest_audit_id === "string" ? row.latest_audit_id : null,
    approved_at: typeof row.approved_at === "string" ? row.approved_at : null,
    approved_by_display:
      typeof row.approved_by_display === "string" ? row.approved_by_display : null,
    approver_role_snapshot:
      typeof row.approver_role_snapshot === "string" ? row.approver_role_snapshot : null,
    scope_summary: typeof row.scope_summary === "string" ? row.scope_summary : null,
    access_mode: typeof row.access_mode === "string" ? row.access_mode : null,
    target_environment: typeof row.target_environment === "string" ? row.target_environment : null,
    expires_at: typeof row.expires_at === "string" ? row.expires_at : null,
    execution_result: typeof row.execution_result === "string" ? row.execution_result : null,
    unchanged_summary: typeof row.unchanged_summary === "string" ? row.unchanged_summary : null,
  };
}

export function buildCoreHumanApprovalRequestFromTrustRow(
  row: ReturnType<typeof parseTrustApprovalFromCenterRow>,
): CoreHumanApprovalRequest | null {
  if (!row.core_approval_id) return null;

  return {
    id: row.core_approval_id,
    organization_id: row.target_environment?.replace(/^tenant:/, "") ?? "",
    requester_user_id: null,
    requester_role_snapshot: null,
    action_category: "trust_action",
    action_key: row.action_name ?? row.title,
    title: row.title,
    summary: row.description,
    unchanged_summary: row.unchanged_summary ?? "",
    scope_summary: row.scope_summary ?? row.action_name ?? row.title,
    access_mode: row.access_mode === "ongoing" ? "ongoing" : "one_time",
    risk_level: Number(row.risk_level) || 1,
    status:
      row.status === "completed"
        ? "succeeded"
        : row.status === "rejected"
          ? "denied"
          : (row.status as CoreHumanApprovalRequest["status"]),
    consumer_kind: "trust_action",
    consumer_ref_id: row.id,
    approved_by_user_id: null,
    approved_by_display: row.approved_by_display,
    denied_by_user_id: null,
    approver_role_snapshot: row.approver_role_snapshot,
    target_environment: row.target_environment ?? "tenant",
    expires_at: row.expires_at,
    revoked_at: null,
    consumed_at: null,
    execution_started_at: null,
    execution_completed_at: null,
    execution_result:
      row.execution_result === "succeeded" || row.execution_result === "failed"
        ? row.execution_result
        : row.status === "completed"
          ? "succeeded"
          : null,
    execution_error_summary: null,
    approved_at: row.approved_at,
    created_at: row.created_at,
    updated_at: row.approved_at ?? row.created_at,
    correlation_id: row.correlation_id ?? row.core_approval_id,
    latest_audit_id: row.latest_audit_id,
  };
}
