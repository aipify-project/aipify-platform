export const CORE_HUMAN_APPROVAL_STATUSES = [
  "pending",
  "approved",
  "denied",
  "expired",
  "revoked",
  "executing",
  "succeeded",
  "failed",
] as const;

export type CoreHumanApprovalStatus = (typeof CORE_HUMAN_APPROVAL_STATUSES)[number];

export const CORE_HUMAN_APPROVAL_ACCESS_MODES = ["one_time", "ongoing"] as const;

export type CoreHumanApprovalAccessMode = (typeof CORE_HUMAN_APPROVAL_ACCESS_MODES)[number];

export const CORE_HUMAN_APPROVAL_EVENT_TYPES = [
  "request_created",
  "request_approved",
  "request_denied",
  "request_expired",
  "request_revoked",
  "execution_started",
  "execution_succeeded",
  "execution_failed",
  "duplicate_request_returned",
  "scope_mismatch_rejected",
] as const;

export type CoreHumanApprovalEventType = (typeof CORE_HUMAN_APPROVAL_EVENT_TYPES)[number];

export const CORE_HUMAN_APPROVAL_ACTION_CATEGORIES = [
  "trust_action",
  "deploy",
  "migration",
  "secret",
  "permission",
  "deletion",
  "financial",
  "external",
  "integration",
] as const;

export type CoreHumanApprovalActionCategory = (typeof CORE_HUMAN_APPROVAL_ACTION_CATEGORIES)[number];

export const CORE_HUMAN_APPROVAL_EXECUTION_RESULTS = ["succeeded", "failed"] as const;

export type CoreHumanApprovalExecutionResult = (typeof CORE_HUMAN_APPROVAL_EXECUTION_RESULTS)[number];

export type CoreHumanApprovalRequest = {
  id: string;
  organization_id: string;
  requester_user_id: string | null;
  requester_role_snapshot: string | null;
  action_category: string;
  action_key: string;
  title: string;
  summary: string;
  unchanged_summary: string;
  scope_summary: string;
  access_mode: CoreHumanApprovalAccessMode;
  risk_level: number;
  status: CoreHumanApprovalStatus;
  consumer_kind: string;
  consumer_ref_id: string | null;
  approved_by_user_id: string | null;
  approved_by_display: string | null;
  denied_by_user_id: string | null;
  approver_role_snapshot: string | null;
  target_environment: string;
  expires_at: string | null;
  revoked_at: string | null;
  consumed_at: string | null;
  execution_started_at: string | null;
  execution_completed_at: string | null;
  execution_result: CoreHumanApprovalExecutionResult | null;
  execution_error_summary: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  correlation_id: string;
  latest_audit_id: string | null;
};

export type CoreHumanApprovalEvent = {
  id: string;
  organization_id: string;
  request_id: string;
  actor_user_id: string | null;
  event_type: CoreHumanApprovalEventType | string;
  actor_role_snapshot: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type CoreHumanApprovalDecisionResult = {
  ok: boolean;
  status: CoreHumanApprovalStatus | string;
  correlation_id: string;
  core_approval_id: string;
  latest_audit_id: string | null;
};

export type CoreHumanApprovalExecutionResultPayload = {
  ok: boolean;
  status: CoreHumanApprovalStatus | string;
  correlation_id: string;
  core_approval_id: string;
  latest_audit_id: string | null;
  execution_result: CoreHumanApprovalExecutionResult | null;
};

export type HumanApprovalReceiptModel = {
  confirmationHeading: string;
  approvedBy: string;
  approverRole: string;
  approvedAt: string;
  action: string;
  scope: string;
  target: string;
  validity: string;
  expiresAt: string | null;
  auditId: string;
  correlationId: string;
  status: string;
  executionResult: string | null;
  unchanged: string | null;
};

export type HumanApprovalReceiptLabels = {
  title: string;
  copy: string;
  copied: string;
  approvedBy: string;
  approverRole: string;
  approvedAt: string;
  action: string;
  scope: string;
  target: string;
  validity: string;
  oneTime: string;
  ongoing: string;
  expiresAt: string;
  auditId: string;
  correlationId: string;
  status: string;
  executionResult: string;
  unchanged: string;
  notAvailable: string;
};

/** Safe receipt source returned by APIs — no localized labels. */
export type HumanApprovalReceiptSource = CoreHumanApprovalRequest;

export const SENSITIVE_CORE_APPROVAL_RPC_FIELDS = [
  "scope_json",
  "scope_fingerprint",
  "payload_hash",
  "idempotency_key",
  "approver_authority_snapshot",
] as const;

export const AUTHENTICATED_DENIED_CORE_RPCS = [
  "expire_stale_core_human_approval_requests",
  "assert_core_human_approval_for_execution",
  "begin_core_human_approval_execution",
  "complete_core_human_approval_execution",
] as const;

export type SensitiveCoreApprovalRpcField = (typeof SENSITIVE_CORE_APPROVAL_RPC_FIELDS)[number];
export type AuthenticatedDeniedCoreRpc = (typeof AUTHENTICATED_DENIED_CORE_RPCS)[number];
