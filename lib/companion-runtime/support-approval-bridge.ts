import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isValidIdempotencyKey } from "@/lib/companion-runtime/companion-action-idempotency";

/** Matches support-source-map provider_key for support_case.assign. */
export const SUPPORT_ASSIGN_ACTION_KEY = "support_case.assign" as const;

export const SUPPORT_ASSIGN_PROVIDER_KEY = "support_ai_engine" as const;

const SUPPORT_APPROVAL_MAX_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const SUPPORT_ASSIGN_CANONICAL_PAYLOAD_KEYS = ["case_id", "assignee_user_id"] as const;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export type SupportAssignApprovalRequest = {
  case_id: string;
  assignee_user_id: string;
  idempotency_key: string;
};

export type SupportAssignApprovalBridgeResult = {
  success: boolean;
  outcome_code: string;
  action_request_id: string | null;
  payload_hash: string | null;
  idempotency_key: string | null;
  expires_at: string | null;
  idempotent_replay: boolean;
};

export type SupportAssignApprovalBridgeRpcParams = {
  action_key: typeof SUPPORT_ASSIGN_ACTION_KEY;
  payload: Record<string, unknown>;
  payload_hash: string;
  idempotency_key: string;
  expires_at: string;
};

export type SupportAssignApprovalBridgeRpcCaller = (
  params: SupportAssignApprovalBridgeRpcParams,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export type SupportAssignApprovalBridgeDeps = {
  rpcCaller?: SupportAssignApprovalBridgeRpcCaller;
  now?: () => Date;
};

function sortObjectKeysRecursively(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sortObjectKeysRecursively(entry));
  }

  const record = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};

  for (const key of Object.keys(record).sort()) {
    sorted[key] = sortObjectKeysRecursively(record[key]);
  }

  return sorted;
}

function normalizeCaseId(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isValidAssigneeUserId(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && UUID_REGEX.test(trimmed);
}

export function buildSupportAssignApprovalCanonicalPayload(input: {
  case_id: string;
  assignee_user_id: string;
}): Record<string, unknown> {
  const caseId = normalizeCaseId(input.case_id);
  const assigneeUserId = input.assignee_user_id.trim();

  const payload: Record<string, unknown> = {};
  for (const key of SUPPORT_ASSIGN_CANONICAL_PAYLOAD_KEYS) {
    if (key === "case_id") {
      payload[key] = caseId ?? "";
    } else {
      payload[key] = assigneeUserId;
    }
  }

  return payload;
}

export function computeSupportApprovalPayloadHash(payload: Record<string, unknown>): string {
  const canonical = sortObjectKeysRecursively(payload);
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

export function resolveSupportApprovalExpiresAt(now: Date): string {
  return new Date(now.getTime() + SUPPORT_APPROVAL_MAX_EXPIRY_MS).toISOString();
}

function failureResult(input: {
  outcome_code: string;
  payload_hash: string | null;
  idempotency_key: string | null;
  expires_at: string | null;
  action_request_id?: string | null;
  idempotent_replay?: boolean;
}): SupportAssignApprovalBridgeResult {
  return {
    success: false,
    outcome_code: input.outcome_code,
    action_request_id: input.action_request_id ?? null,
    payload_hash: input.payload_hash,
    idempotency_key: input.idempotency_key,
    expires_at: input.expires_at,
    idempotent_replay: input.idempotent_replay ?? false,
  };
}

function normalizeActionRequestId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }

  return trimmed;
}

function normalizeRpcResult(
  rpcData: unknown,
  payloadHash: string,
  idempotencyKey: string,
): SupportAssignApprovalBridgeResult {
  if (!rpcData || typeof rpcData !== "object") {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: payloadHash,
      idempotency_key: idempotencyKey,
      expires_at: null,
    });
  }

  const row = rpcData as Record<string, unknown>;
  const outcomeCode =
    typeof row.outcome_code === "string" && row.outcome_code.length > 0
      ? row.outcome_code
      : "REQUEST_FAILED";
  const expiresAt = typeof row.expires_at === "string" ? row.expires_at : null;
  const actionRequestId = normalizeActionRequestId(row.action_request_id);
  const idempotentReplay = row.idempotent_replay === true;
  const rpcSuccess = row.success === true;

  if (rpcSuccess && !actionRequestId) {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: payloadHash,
      idempotency_key: idempotencyKey,
      expires_at: expiresAt,
    });
  }

  if (
    !rpcSuccess &&
    (outcomeCode === "IDEMPOTENCY_CONFLICT" || outcomeCode === "IDEMPOTENT_REPLAY") &&
    !actionRequestId
  ) {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: payloadHash,
      idempotency_key: idempotencyKey,
      expires_at: expiresAt,
      idempotent_replay: idempotentReplay,
    });
  }

  return {
    success: rpcSuccess,
    outcome_code: outcomeCode,
    action_request_id: actionRequestId,
    payload_hash: payloadHash,
    idempotency_key: idempotencyKey,
    expires_at: expiresAt,
    idempotent_replay: idempotentReplay,
  };
}

function createDefaultRpcCaller(supabase: SupabaseClient): SupportAssignApprovalBridgeRpcCaller {
  return async (params) => {
    const result = await supabase.rpc("record_companion_support_action_request", {
      p_action_key: params.action_key,
      p_payload: params.payload,
      p_payload_hash: params.payload_hash,
      p_idempotency_key: params.idempotency_key,
      p_expires_at: params.expires_at,
    });

    return {
      data: result.data,
      error: result.error ? { message: result.error.message } : null,
    };
  };
}

function validateSupportAssignApprovalRequest(
  request: SupportAssignApprovalRequest,
): { ok: true; case_id: string; assignee_user_id: string } | { ok: false } {
  const caseId = normalizeCaseId(request.case_id);
  if (!caseId) {
    return { ok: false };
  }

  if (!isValidAssigneeUserId(request.assignee_user_id)) {
    return { ok: false };
  }

  if (!request.idempotency_key || !isValidIdempotencyKey(request.idempotency_key)) {
    return { ok: false };
  }

  return {
    ok: true,
    case_id: caseId,
    assignee_user_id: request.assignee_user_id.trim(),
  };
}

export async function recordSupportAssignApprovalActionRequest(
  supabase: SupabaseClient,
  request: SupportAssignApprovalRequest,
  deps: SupportAssignApprovalBridgeDeps = {},
): Promise<SupportAssignApprovalBridgeResult> {
  const validated = validateSupportAssignApprovalRequest(request);

  if (!validated.ok) {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: null,
      idempotency_key: request.idempotency_key ?? null,
      expires_at: null,
    });
  }

  const payload = buildSupportAssignApprovalCanonicalPayload({
    case_id: validated.case_id,
    assignee_user_id: validated.assignee_user_id,
  });
  const payloadHash = computeSupportApprovalPayloadHash(payload);
  const expiresAt = resolveSupportApprovalExpiresAt(deps.now?.() ?? new Date());
  const rpcCaller = deps.rpcCaller ?? createDefaultRpcCaller(supabase);

  const { data, error } = await rpcCaller({
    action_key: SUPPORT_ASSIGN_ACTION_KEY,
    payload,
    payload_hash: payloadHash,
    idempotency_key: request.idempotency_key,
    expires_at: expiresAt,
  });

  if (error) {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: payloadHash,
      idempotency_key: request.idempotency_key,
      expires_at: expiresAt,
    });
  }

  return normalizeRpcResult(data, payloadHash, request.idempotency_key);
}
