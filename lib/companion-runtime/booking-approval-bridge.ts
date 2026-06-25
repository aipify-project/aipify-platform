import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isValidIdempotencyKey } from "@/lib/companion-runtime/companion-action-idempotency";
import type { BookingWriteRequest } from "@/lib/integration-intelligence/booking/types";

const BOOKING_APPROVAL_ACTION_KEYS = [
  "booking.create",
  "booking.update",
  "booking.cancel",
] as const;

type BookingApprovalActionKey = (typeof BOOKING_APPROVAL_ACTION_KEYS)[number];

const BOOKING_APPROVAL_MAX_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const BOOKING_APPROVAL_PAYLOAD_FIELD_KEYS = [
  "service_id",
  "resource_id",
  "customer_reference",
  "booking_id",
  "start_at",
  "end_at",
] as const satisfies readonly (keyof BookingWriteRequest)[];

export type BookingApprovalBridgeResult = {
  success: boolean;
  outcome_code: string;
  action_request_id: string | null;
  payload_hash: string | null;
  idempotency_key: string | null;
  expires_at: string | null;
  idempotent_replay: boolean;
};

export type BookingApprovalBridgeRpcParams = {
  action_key: BookingApprovalActionKey;
  payload: Record<string, unknown>;
  payload_hash: string;
  idempotency_key: string;
  expires_at: string;
};

export type BookingApprovalBridgeRpcCaller = (
  params: BookingApprovalBridgeRpcParams,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export type BookingApprovalBridgeDeps = {
  rpcCaller?: BookingApprovalBridgeRpcCaller;
  now?: () => Date;
};

function isBookingApprovalActionKey(value: string): value is BookingApprovalActionKey {
  return (BOOKING_APPROVAL_ACTION_KEYS as readonly string[]).includes(value);
}

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

export function buildBookingApprovalCanonicalPayload(
  request: BookingWriteRequest,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const key of BOOKING_APPROVAL_PAYLOAD_FIELD_KEYS) {
    payload[key] = request[key];
  }

  return payload;
}

export function computeBookingApprovalPayloadHash(payload: Record<string, unknown>): string {
  const canonical = sortObjectKeysRecursively(payload);
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

export function resolveBookingApprovalExpiresAt(now: Date): string {
  return new Date(now.getTime() + BOOKING_APPROVAL_MAX_EXPIRY_MS).toISOString();
}

function failureResult(input: {
  outcome_code: string;
  payload_hash: string | null;
  idempotency_key: string | null;
  expires_at: string | null;
  action_request_id?: string | null;
  idempotent_replay?: boolean;
}): BookingApprovalBridgeResult {
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

function normalizeRpcResult(
  rpcData: unknown,
  payloadHash: string,
  idempotencyKey: string,
): BookingApprovalBridgeResult {
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

  return {
    success: row.success === true,
    outcome_code: outcomeCode,
    action_request_id: typeof row.action_request_id === "string" ? row.action_request_id : null,
    payload_hash: payloadHash,
    idempotency_key: idempotencyKey,
    expires_at: typeof row.expires_at === "string" ? row.expires_at : null,
    idempotent_replay: row.idempotent_replay === true,
  };
}

function createDefaultRpcCaller(supabase: SupabaseClient): BookingApprovalBridgeRpcCaller {
  return async (params) => {
    const result = await supabase.rpc("record_companion_booking_action_request", {
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

export async function recordBookingApprovalActionRequest(
  supabase: SupabaseClient,
  request: BookingWriteRequest,
  deps: BookingApprovalBridgeDeps = {},
): Promise<BookingApprovalBridgeResult> {
  const actionKey = request.capability_key;

  if (!isBookingApprovalActionKey(actionKey)) {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: null,
      idempotency_key: request.idempotency_key,
      expires_at: null,
    });
  }

  const idempotencyKey = request.idempotency_key;

  if (!idempotencyKey || !isValidIdempotencyKey(idempotencyKey)) {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: null,
      idempotency_key: idempotencyKey,
      expires_at: null,
    });
  }

  const payload = buildBookingApprovalCanonicalPayload(request);
  const payloadHash = computeBookingApprovalPayloadHash(payload);
  const expiresAt = resolveBookingApprovalExpiresAt(deps.now?.() ?? new Date());
  const rpcCaller = deps.rpcCaller ?? createDefaultRpcCaller(supabase);

  const { data, error } = await rpcCaller({
    action_key: actionKey,
    payload,
    payload_hash: payloadHash,
    idempotency_key: idempotencyKey,
    expires_at: expiresAt,
  });

  if (error) {
    return failureResult({
      outcome_code: "REQUEST_FAILED",
      payload_hash: payloadHash,
      idempotency_key: idempotencyKey,
      expires_at: expiresAt,
    });
  }

  return normalizeRpcResult(data, payloadHash, idempotencyKey);
}
