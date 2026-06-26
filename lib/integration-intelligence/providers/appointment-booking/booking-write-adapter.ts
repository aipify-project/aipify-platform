import type { SupabaseClient } from "@supabase/supabase-js";

export const BOOKING_WRITE_RPC = "execute_apt610_companion_booking_write" as const;

export type BookingWriteAdapterResult = {
  executed: boolean;
  outcome_code: string;
  appointment_id: string | null;
  appointment_key: string | null;
  previous_status: string | null;
  current_status: string | null;
  starts_at: string | null;
  ends_at: string | null;
  audit_id: string | null;
  idempotent_replay: boolean;
  channel_key: string | null;
};

export type BookingWriteAdapterRpcParams = {
  p_action_request_id: string;
};

export type BookingWriteAdapterRpcCaller = (
  params: BookingWriteAdapterRpcParams,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export type BookingWriteAdapterDeps = {
  rpcCaller?: BookingWriteAdapterRpcCaller;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function writeFailureResult(outcomeCode: string): BookingWriteAdapterResult {
  return {
    executed: false,
    outcome_code: outcomeCode,
    appointment_id: null,
    appointment_key: null,
    previous_status: null,
    current_status: null,
    starts_at: null,
    ends_at: null,
    audit_id: null,
    idempotent_replay: false,
    channel_key: null,
  };
}

function normalizeRpcResult(rpcData: unknown): BookingWriteAdapterResult {
  const row = asRecord(rpcData);
  if (!row) {
    return writeFailureResult("WRITE_FAILED");
  }

  const outcomeCode =
    typeof row.outcome_code === "string" && row.outcome_code.length > 0
      ? row.outcome_code
      : "WRITE_FAILED";
  const executed = row.success === true;

  return {
    executed,
    outcome_code: outcomeCode,
    appointment_id: asNullableString(row.appointment_id),
    appointment_key: asNullableString(row.appointment_key),
    previous_status: asNullableString(row.previous_status),
    current_status: asNullableString(row.current_status),
    starts_at: asNullableString(row.starts_at),
    ends_at: asNullableString(row.ends_at),
    audit_id: asNullableString(row.audit_id),
    idempotent_replay: row.idempotent_replay === true,
    channel_key: asNullableString(row.channel_key),
  };
}

function createDefaultRpcCaller(supabase: SupabaseClient): BookingWriteAdapterRpcCaller {
  return async (params) => {
    const result = await supabase.rpc(BOOKING_WRITE_RPC, {
      p_action_request_id: params.p_action_request_id,
    });

    return {
      data: result.data,
      error: result.error ? { message: result.error.message } : null,
    };
  };
}

export async function executeCompanionBookingWrite(
  supabase: SupabaseClient,
  actionRequestId: string,
  deps: BookingWriteAdapterDeps = {},
): Promise<BookingWriteAdapterResult> {
  const rpcCaller = deps.rpcCaller ?? createDefaultRpcCaller(supabase);

  const { data, error } = await rpcCaller({
    p_action_request_id: actionRequestId,
  });

  if (error) {
    return writeFailureResult("WRITE_FAILED");
  }

  return normalizeRpcResult(data);
}
