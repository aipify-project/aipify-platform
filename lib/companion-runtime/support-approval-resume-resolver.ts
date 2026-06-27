import type { SupabaseClient } from "@supabase/supabase-js";
import { isValidIdempotencyKey } from "@/lib/companion-runtime/companion-action-idempotency";

export const SUPPORT_ASSIGN_ACTION_KEY = "support_case.assign" as const;
export const SUPPORT_ASSIGN_PROVIDER_KEY = "support_ai_engine" as const;
export const SUPPORT_ASSIGN_DOMAIN = "support_write" as const;
export const SUPPORT_ASSIGN_SCHEMA_VERSION = "support_write_v1" as const;
export const SUPPORT_ASSIGN_REQUESTED_ACTION = "assign" as const;

/** Read RPC filters domain/schema server-side; they are not returned in the response shape. */
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PAYLOAD_HASH_REGEX = /^[a-f0-9]{64}$/;

const CANONICAL_PAYLOAD_KEYS = ["case_id", "assignee_user_id"] as const;

export type SupportApprovalResumeInput = {
  action_request_id: string;
};

export type SupportApprovalResumeApproved = {
  outcome: "approved";
  action_request_id: string;
  case_id: string;
  assignee_user_id: string;
  payload_hash: string;
  idempotency_key: string;
};

export type SupportApprovalResumeAlreadyConsumed = {
  outcome: "already_consumed";
  action_request_id: string;
  case_id: string;
  assignee_user_id: string;
  payload_hash: string;
  idempotency_key: string;
  receipt_id: string;
};

export type SupportApprovalResumeRejectedOutcome =
  | "pending"
  | "rejected"
  | "expired"
  | "failed"
  | "verification_failed"
  | "not_found";

export type SupportApprovalResumeResult =
  | SupportApprovalResumeApproved
  | SupportApprovalResumeAlreadyConsumed
  | {
      outcome: SupportApprovalResumeRejectedOutcome;
      action_request_id: string | null;
    };

export type SupportApprovalResumeRpcReader = (
  actionRequestId: string,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export type SupportApprovalResumeResolverDeps = {
  rpcReader?: SupportApprovalResumeRpcReader;
  now?: () => Date;
};

type CanonicalPayload = {
  case_id: string;
  assignee_user_id: string;
};

type RpcRow = {
  action_request_id: string;
  action_key: string;
  approval_status: string;
  lifecycle_status: string;
  execution_status: string;
  capability_key: string;
  provider_key: string;
  requested_action: string;
  domain: string | null;
  schema_version: string | null;
  payload_hash: string;
  idempotency_key: string;
  expired: boolean;
  consumed: boolean;
  expires_at: string | null;
  payload: CanonicalPayload;
  receipt_id: string | null;
};

const RPC_STRING_FIELDS = [
  "action_request_id",
  "action_key",
  "approval_status",
  "lifecycle_status",
  "execution_status",
  "capability_key",
  "provider_key",
  "requested_action",
  "payload_hash",
  "idempotency_key",
] as const;

function normalizeActionRequestId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }

  return trimmed;
}

function normalizeUuid(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }

  return trimmed;
}

function verificationFailed(actionRequestId: string | null): SupportApprovalResumeResult {
  return { outcome: "verification_failed", action_request_id: actionRequestId };
}

function notFound(): SupportApprovalResumeResult {
  return { outcome: "not_found", action_request_id: null };
}

function readCanonicalPayload(value: unknown): CanonicalPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  if (keys.length !== CANONICAL_PAYLOAD_KEYS.length) {
    return null;
  }

  for (const key of CANONICAL_PAYLOAD_KEYS) {
    if (!keys.includes(key)) {
      return null;
    }
  }

  const caseId = normalizeUuid(record.case_id);
  const assigneeUserId = normalizeUuid(record.assignee_user_id);

  if (!caseId || !assigneeUserId) {
    return null;
  }

  return {
    case_id: caseId,
    assignee_user_id: assigneeUserId,
  };
}

function readFoundRow(data: unknown): RpcRow | "not_found" | "invalid" {
  if (!data || typeof data !== "object") {
    return "invalid";
  }

  const row = data as Record<string, unknown>;

  if (row.success === false && row.outcome_code === "NOT_FOUND") {
    return "not_found";
  }

  if (row.success !== true || row.outcome_code !== "SUPPORT_ACTION_REQUEST_FOUND") {
    return "invalid";
  }

  const parsed = {} as Record<(typeof RPC_STRING_FIELDS)[number], string>;

  for (const key of RPC_STRING_FIELDS) {
    if (typeof row[key] !== "string") {
      return "invalid";
    }
    parsed[key] = row[key];
  }

  const payload = readCanonicalPayload(row.payload);
  if (!payload) {
    return "invalid";
  }

  if (!PAYLOAD_HASH_REGEX.test(parsed.payload_hash)) {
    return "invalid";
  }

  if (!isValidIdempotencyKey(parsed.idempotency_key)) {
    return "invalid";
  }

  const receiptId =
    typeof row.receipt_id === "string" && row.receipt_id.trim().length > 0
      ? row.receipt_id.trim()
      : null;

  const expiresAt =
    typeof row.expires_at === "string" && row.expires_at.length > 0 ? row.expires_at : null;

  const domain = typeof row.domain === "string" ? row.domain : null;
  const schemaVersion =
    typeof row.schema_version === "string" ? row.schema_version : null;

  return {
    ...(parsed as Pick<RpcRow, (typeof RPC_STRING_FIELDS)[number]>),
    payload,
    domain,
    schema_version: schemaVersion,
    expired: row.expired === true,
    consumed: row.consumed === true,
    expires_at: expiresAt,
    receipt_id: receiptId,
  };
}

function identityMatches(actionRequestId: string, row: RpcRow): boolean {
  // domain/schema_version: enforced by get_companion_support_action_request WHERE clause;
  // when present in a response, require exact match (forward-compatible defense).
  if (row.domain !== null && row.domain !== SUPPORT_ASSIGN_DOMAIN) {
    return false;
  }

  if (row.schema_version !== null && row.schema_version !== SUPPORT_ASSIGN_SCHEMA_VERSION) {
    return false;
  }

  return (
    row.action_request_id === actionRequestId &&
    row.action_key === SUPPORT_ASSIGN_ACTION_KEY &&
    row.capability_key === SUPPORT_ASSIGN_ACTION_KEY &&
    row.provider_key === SUPPORT_ASSIGN_PROVIDER_KEY &&
    row.requested_action === SUPPORT_ASSIGN_REQUESTED_ACTION
  );
}

function isExpired(row: RpcRow, now: Date): boolean {
  if (row.expired || row.approval_status === "expired") {
    return true;
  }

  if (!row.expires_at) {
    return false;
  }

  const expiresAt = Date.parse(row.expires_at);
  return Number.isFinite(expiresAt) && expiresAt <= now.getTime();
}

function isConsumed(row: RpcRow): boolean {
  return (
    row.consumed ||
    row.lifecycle_status === "completed" ||
    row.execution_status === "completed"
  );
}

function approvedFields(row: RpcRow): Omit<SupportApprovalResumeApproved, "outcome"> {
  return {
    action_request_id: row.action_request_id,
    case_id: row.payload.case_id,
    assignee_user_id: row.payload.assignee_user_id,
    payload_hash: row.payload_hash,
    idempotency_key: row.idempotency_key,
  };
}

function mapStatus(row: RpcRow, now: Date): SupportApprovalResumeResult {
  const fields = approvedFields(row);

  if (isConsumed(row)) {
    const receiptId = normalizeUuid(row.receipt_id);
    if (!receiptId) {
      return verificationFailed(row.action_request_id);
    }

    return {
      outcome: "already_consumed",
      ...fields,
      receipt_id: receiptId,
    };
  }

  if (isExpired(row, now)) {
    return { outcome: "expired", action_request_id: row.action_request_id };
  }

  if (row.approval_status === "rejected" || row.lifecycle_status === "rejected") {
    return { outcome: "rejected", action_request_id: row.action_request_id };
  }

  if (
    row.execution_status === "failed" ||
    row.execution_status === "cancelled" ||
    row.lifecycle_status === "cancelled"
  ) {
    return { outcome: "failed", action_request_id: row.action_request_id };
  }

  if (row.approval_status === "pending" || row.lifecycle_status === "awaiting_approval") {
    return { outcome: "pending", action_request_id: row.action_request_id };
  }

  if (
    row.approval_status === "approved" &&
    row.lifecycle_status === "approved" &&
    row.execution_status === "queued" &&
    !isExpired(row, now) &&
    !isConsumed(row)
  ) {
    return {
      outcome: "approved",
      ...fields,
    };
  }

  return verificationFailed(row.action_request_id);
}

export async function resolveSupportApprovalResume(
  supabase: SupabaseClient,
  input: SupportApprovalResumeInput,
  deps: SupportApprovalResumeResolverDeps = {},
): Promise<SupportApprovalResumeResult> {
  const actionRequestId = normalizeActionRequestId(input.action_request_id);
  if (!actionRequestId) {
    return verificationFailed(null);
  }

  const now = deps.now ?? (() => new Date());

  const rpcReader =
    deps.rpcReader ??
    (async (requestId) => {
      const result = await supabase.rpc("get_companion_support_action_request", {
        p_action_request_id: requestId,
      });

      return {
        data: result.data,
        error: result.error ? { message: result.error.message } : null,
      };
    });

  const { data, error } = await rpcReader(actionRequestId);

  if (error) {
    return verificationFailed(null);
  }

  const row = readFoundRow(data);

  if (row === "not_found") {
    return notFound();
  }

  if (row === "invalid") {
    return verificationFailed(null);
  }

  if (!identityMatches(actionRequestId, row)) {
    return verificationFailed(actionRequestId);
  }

  return mapStatus(row, now());
}
