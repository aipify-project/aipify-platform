import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildBookingApprovalCanonicalPayload,
  computeBookingApprovalPayloadHash,
} from "@/lib/companion-runtime/booking-approval-bridge";
import type { BookingWriteRequest } from "@/lib/integration-intelligence/booking/types";

const PROVIDER_KEY = "appointment_booking";

const REQUESTED_ACTIONS: Record<BookingWriteRequest["capability_key"], string> = {
  "booking.create": "create",
  "booking.update": "update",
  "booking.cancel": "cancel",
};

export type BookingApprovalRequestResolutionOutcome =
  | "approved"
  | "approval_pending"
  | "approval_rejected"
  | "approval_changes_requested"
  | "approval_expired"
  | "already_consumed"
  | "verification_failed"
  | "not_found";

export type BookingApprovalRequestResolution =
  | {
      outcome: "approved";
      action_request_id: string;
      payload_hash: string;
      idempotency_key: string;
    }
  | { outcome: Exclude<BookingApprovalRequestResolutionOutcome, "approved"> };

export type BookingApprovalRequestRpcReader = (
  actionRequestId: string,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export type BookingApprovalRequestResolverDeps = {
  rpcReader?: BookingApprovalRequestRpcReader;
};

type RpcRow = {
  action_request_id: string;
  action_key: string;
  approval_status: string;
  lifecycle_status: string;
  execution_status: string;
  payload_hash: string;
  idempotency_key: string;
  capability_key: string;
  provider_key: string;
  requested_action: string;
  expired: boolean;
  consumed: boolean;
};

const RPC_STRING_FIELDS = [
  "action_request_id",
  "action_key",
  "approval_status",
  "lifecycle_status",
  "execution_status",
  "payload_hash",
  "idempotency_key",
  "capability_key",
  "provider_key",
  "requested_action",
] as const;

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

  return {
    ...(parsed as Pick<RpcRow, (typeof RPC_STRING_FIELDS)[number]>),
    expired: row.expired === true,
    consumed: row.consumed === true,
  };
}

function identityMatches(
  actionRequestId: string,
  request: BookingWriteRequest,
  row: RpcRow,
): boolean {
  if (!request.idempotency_key) {
    return false;
  }

  const expectedHash = computeBookingApprovalPayloadHash(
    buildBookingApprovalCanonicalPayload(request),
  );

  return (
    row.action_request_id === actionRequestId &&
    row.provider_key === PROVIDER_KEY &&
    row.action_key === request.capability_key &&
    row.capability_key === request.capability_key &&
    row.requested_action === REQUESTED_ACTIONS[request.capability_key] &&
    row.payload_hash === expectedHash &&
    row.idempotency_key === request.idempotency_key
  );
}

function mapStatus(row: RpcRow): BookingApprovalRequestResolution {
  if (
    row.consumed ||
    row.lifecycle_status === "completed" ||
    row.execution_status === "completed"
  ) {
    return { outcome: "already_consumed" };
  }

  if (row.expired || row.approval_status === "expired") {
    return { outcome: "approval_expired" };
  }

  if (row.approval_status === "rejected") {
    return { outcome: "approval_rejected" };
  }

  if (row.approval_status === "changes_requested") {
    return { outcome: "approval_changes_requested" };
  }

  if (row.approval_status === "pending") {
    return { outcome: "approval_pending" };
  }

  if (row.approval_status === "approved") {
    return {
      outcome: "approved",
      action_request_id: row.action_request_id,
      payload_hash: row.payload_hash,
      idempotency_key: row.idempotency_key,
    };
  }

  return { outcome: "verification_failed" };
}

export async function resolveBookingApprovalRequest(
  supabase: SupabaseClient,
  input: {
    action_request_id: string;
    request: BookingWriteRequest;
  },
  deps: BookingApprovalRequestResolverDeps = {},
): Promise<BookingApprovalRequestResolution> {
  const rpcReader =
    deps.rpcReader ??
    (async (actionRequestId) => {
      const result = await supabase.rpc("get_companion_booking_action_request", {
        p_action_request_id: actionRequestId,
      });

      return {
        data: result.data,
        error: result.error ? { message: result.error.message } : null,
      };
    });

  const { data, error } = await rpcReader(input.action_request_id);

  if (error) {
    return { outcome: "not_found" };
  }

  const row = readFoundRow(data);

  if (row === "not_found") {
    return { outcome: "not_found" };
  }

  if (row === "invalid") {
    return { outcome: "verification_failed" };
  }

  if (!identityMatches(input.action_request_id, input.request, row)) {
    return { outcome: "verification_failed" };
  }

  return mapStatus(row);
}
