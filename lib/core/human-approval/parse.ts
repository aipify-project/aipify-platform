import type {
  CoreHumanApprovalDecisionResult,
  CoreHumanApprovalExecutionResultPayload,
  CoreHumanApprovalRequest,
} from "./types";
import { SENSITIVE_CORE_APPROVAL_RPC_FIELDS } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function isSafeCoreHumanApprovalRpcPayload(value: unknown): boolean {
  const record = asRecord(value);
  const request = asRecord(record.request ?? record);
  return !SENSITIVE_CORE_APPROVAL_RPC_FIELDS.some((field) => field in request);
}

export function parseCoreHumanApprovalRequest(value: unknown): CoreHumanApprovalRequest | null {
  const row = asRecord(value);
  const request = asRecord(row.request ?? row);
  const id = asString(request.id);
  if (!id) return null;

  return {
    id,
    organization_id: asString(request.organization_id),
    requester_user_id: asNullableString(request.requester_user_id),
    requester_role_snapshot: asNullableString(request.requester_role_snapshot),
    action_category: asString(request.action_category),
    action_key: asString(request.action_key),
    title: asString(request.title),
    summary: asString(request.summary),
    unchanged_summary: asString(request.unchanged_summary),
    scope_summary: asString(request.scope_summary),
    access_mode: request.access_mode === "ongoing" ? "ongoing" : "one_time",
    risk_level: typeof request.risk_level === "number" ? request.risk_level : Number(request.risk_level ?? 1),
    status: asString(request.status) as CoreHumanApprovalRequest["status"],
    consumer_kind: asString(request.consumer_kind),
    consumer_ref_id: asNullableString(request.consumer_ref_id),
    approved_by_user_id: asNullableString(request.approved_by_user_id),
    approved_by_display: asNullableString(request.approved_by_display),
    denied_by_user_id: asNullableString(request.denied_by_user_id),
    approver_role_snapshot: asNullableString(request.approver_role_snapshot),
    target_environment: asString(request.target_environment) || "tenant",
    expires_at: asNullableString(request.expires_at),
    revoked_at: asNullableString(request.revoked_at),
    consumed_at: asNullableString(request.consumed_at),
    execution_started_at: asNullableString(request.execution_started_at),
    execution_completed_at: asNullableString(request.execution_completed_at),
    execution_result:
      request.execution_result === "succeeded" || request.execution_result === "failed"
        ? request.execution_result
        : null,
    execution_error_summary: asNullableString(request.execution_error_summary),
    approved_at: asNullableString(request.approved_at),
    created_at: asString(request.created_at),
    updated_at: asString(request.updated_at),
    correlation_id: asString(request.correlation_id) || id,
    latest_audit_id: asNullableString(request.latest_audit_id),
  };
}

export function parseCoreHumanApprovalDecisionResult(
  value: unknown,
): CoreHumanApprovalDecisionResult | null {
  const row = asRecord(value);
  const coreId = asString(row.core_approval_id) || asString(row.id);
  if (!coreId) return null;
  return {
    ok: row.ok === true,
    status: asString(row.status),
    correlation_id: asString(row.correlation_id) || coreId,
    core_approval_id: coreId,
    latest_audit_id: asNullableString(row.latest_audit_id),
  };
}

export function parseCoreHumanApprovalExecutionResult(
  value: unknown,
): CoreHumanApprovalExecutionResultPayload | null {
  const base = parseCoreHumanApprovalDecisionResult(value);
  if (!base) return null;
  const row = asRecord(value);
  return {
    ...base,
    execution_result:
      row.execution_result === "succeeded" || row.execution_result === "failed"
        ? row.execution_result
        : null,
  };
}

export function parseCoreHumanApprovalRequestList(value: unknown): CoreHumanApprovalRequest[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseCoreHumanApprovalRequest).filter((item): item is CoreHumanApprovalRequest => item !== null);
}
