import type { SupabaseClient } from "@supabase/supabase-js";

const PROVIDER_KEY = "appointment_booking";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BOOKING_CAPABILITY_KEYS = [
  "booking.create",
  "booking.update",
  "booking.cancel",
] as const;

export type BookingApprovalResumeCapabilityKey = (typeof BOOKING_CAPABILITY_KEYS)[number];

export type BookingApprovalResumeRequestedAction = "create" | "update" | "cancel";

const REQUESTED_ACTION_BY_CAPABILITY: Record<
  BookingApprovalResumeCapabilityKey,
  BookingApprovalResumeRequestedAction
> = {
  "booking.create": "create",
  "booking.update": "update",
  "booking.cancel": "cancel",
};

const DEFAULT_ALLOWED_CAPABILITY_KEYS: readonly BookingApprovalResumeCapabilityKey[] =
  BOOKING_CAPABILITY_KEYS;

export type BookingApprovalResumeInput = {
  action_request_id: string;
  allowed_capability_keys?: readonly BookingApprovalResumeCapabilityKey[];
};

export type BookingApprovalResumeApproved = {
  outcome: "approved";
  action_request_id: string;
  capability_key: BookingApprovalResumeCapabilityKey;
  requested_action: BookingApprovalResumeRequestedAction;
};

export type BookingApprovalResumeRejectedOutcome =
  | "pending"
  | "rejected"
  | "changes_requested"
  | "expired"
  | "already_consumed"
  | "verification_failed"
  | "not_found";

export type BookingApprovalResumeResult =
  | BookingApprovalResumeApproved
  | {
      outcome: BookingApprovalResumeRejectedOutcome;
      action_request_id: string | null;
    };

export type BookingApprovalResumeRpcReader = (
  actionRequestId: string,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export type BookingApprovalResumeResolverDeps = {
  rpcReader?: BookingApprovalResumeRpcReader;
  now?: () => Date;
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
  expired: boolean;
  consumed: boolean;
  expires_at: string | null;
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
] as const;

function normalizeActionRequestId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }

  return trimmed;
}

function verificationFailed(actionRequestId: string | null): BookingApprovalResumeResult {
  return { outcome: "verification_failed", action_request_id: actionRequestId };
}

function notFound(): BookingApprovalResumeResult {
  return { outcome: "not_found", action_request_id: null };
}

function isBookingCapabilityKey(value: string): value is BookingApprovalResumeCapabilityKey {
  return (BOOKING_CAPABILITY_KEYS as readonly string[]).includes(value);
}

function readFoundRow(data: unknown): RpcRow | "not_found" | "invalid" {
  if (!data || typeof data !== "object") {
    return "invalid";
  }

  const row = data as Record<string, unknown>;

  if (row.success === false && row.outcome_code === "NOT_FOUND") {
    return "not_found";
  }

  if (row.success !== true || row.outcome_code !== "BOOKING_ACTION_REQUEST_FOUND") {
    return "invalid";
  }

  const parsed = {} as Record<(typeof RPC_STRING_FIELDS)[number], string>;

  for (const key of RPC_STRING_FIELDS) {
    if (typeof row[key] !== "string") {
      return "invalid";
    }
    parsed[key] = row[key];
  }

  const expiresAt =
    typeof row.expires_at === "string" && row.expires_at.length > 0 ? row.expires_at : null;

  return {
    ...(parsed as Pick<RpcRow, (typeof RPC_STRING_FIELDS)[number]>),
    expired: row.expired === true,
    consumed: row.consumed === true,
    expires_at: expiresAt,
  };
}

function identityMatches(
  actionRequestId: string,
  allowedCapabilityKeys: readonly BookingApprovalResumeCapabilityKey[],
  row: RpcRow,
): row is RpcRow & { capability_key: BookingApprovalResumeCapabilityKey } {
  if (row.action_request_id !== actionRequestId) {
    return false;
  }

  if (row.provider_key !== PROVIDER_KEY) {
    return false;
  }

  if (!isBookingCapabilityKey(row.capability_key)) {
    return false;
  }

  if (!allowedCapabilityKeys.includes(row.capability_key)) {
    return false;
  }

  if (row.action_key !== row.capability_key) {
    return false;
  }

  return row.requested_action === REQUESTED_ACTION_BY_CAPABILITY[row.capability_key];
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

function mapStatus(
  row: RpcRow & { capability_key: BookingApprovalResumeCapabilityKey },
  now: Date,
): BookingApprovalResumeResult {
  if (isConsumed(row)) {
    return { outcome: "already_consumed", action_request_id: row.action_request_id };
  }

  if (isExpired(row, now)) {
    return { outcome: "expired", action_request_id: row.action_request_id };
  }

  if (row.approval_status === "rejected" || row.lifecycle_status === "rejected") {
    return { outcome: "rejected", action_request_id: row.action_request_id };
  }

  if (
    row.approval_status === "changes_requested" ||
    row.lifecycle_status === "changes_requested"
  ) {
    return { outcome: "changes_requested", action_request_id: row.action_request_id };
  }

  if (row.approval_status === "pending" || row.lifecycle_status === "requested") {
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
      action_request_id: row.action_request_id,
      capability_key: row.capability_key,
      requested_action: REQUESTED_ACTION_BY_CAPABILITY[row.capability_key],
    };
  }

  return verificationFailed(row.action_request_id);
}

export async function resolveBookingApprovalResume(
  supabase: SupabaseClient,
  input: BookingApprovalResumeInput,
  deps: BookingApprovalResumeResolverDeps = {},
): Promise<BookingApprovalResumeResult> {
  const actionRequestId = normalizeActionRequestId(input.action_request_id);
  if (!actionRequestId) {
    return verificationFailed(null);
  }

  const allowedCapabilityKeys =
    input.allowed_capability_keys ?? DEFAULT_ALLOWED_CAPABILITY_KEYS;
  const now = deps.now ?? (() => new Date());

  const rpcReader =
    deps.rpcReader ??
    (async (requestId) => {
      const result = await supabase.rpc("get_companion_booking_action_request", {
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

  if (!identityMatches(actionRequestId, allowedCapabilityKeys, row)) {
    return verificationFailed(actionRequestId);
  }

  return mapStatus(row, now());
}
