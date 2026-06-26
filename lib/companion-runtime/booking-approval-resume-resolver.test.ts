import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  resolveBookingApprovalResume,
  type BookingApprovalResumeRpcReader,
} from "@/lib/companion-runtime/booking-approval-resume-resolver";

const VALID_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const FIXED_NOW = new Date("2026-06-26T12:00:00.000Z");

const supabaseStub = {} as SupabaseClient;

function baseRow(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    outcome_code: "BOOKING_ACTION_REQUEST_FOUND",
    action_request_id: VALID_ID,
    action_key: "booking.create",
    approval_status: "approved",
    lifecycle_status: "approved",
    execution_status: "queued",
    capability_key: "booking.create",
    provider_key: "appointment_booking",
    requested_action: "create",
    payload_hash: "abc123def4567890abc123def4567890abc123def4567890abc123def4567890",
    idempotency_key: "booking:idem-123456789012345678901234567890123456789012345678901234",
    expires_at: "2026-07-01T12:00:00.000Z",
    expired: false,
    consumed: false,
    payload: { service_id: "svc-1", start_at: "2026-06-24T09:00:00.000Z" },
    ...overrides,
  };
}

function createRpcReader(
  data: unknown,
  error: { message: string } | null = null,
): { reader: BookingApprovalResumeRpcReader; calls: string[]; params: unknown[] } {
  const calls: string[] = [];
  const params: unknown[] = [];

  const reader: BookingApprovalResumeRpcReader = async (actionRequestId) => {
    calls.push(actionRequestId);
    params.push({ p_action_request_id: actionRequestId });
    return { data, error };
  };

  return { reader, calls, params };
}

function assertNoSensitiveFields(result: unknown) {
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes("payload_hash"), false);
  assert.equal(serialized.includes("idempotency_key"), false);
  assert.equal(serialized.includes('"payload"'), false);
  assert.equal(serialized.includes("service_id"), false);
  assert.equal(serialized.includes("customer_reference"), false);
}

async function run(
  input: Parameters<typeof resolveBookingApprovalResume>[1],
  reader: BookingApprovalResumeRpcReader,
) {
  return resolveBookingApprovalResume(supabaseStub, input, {
    rpcReader: reader,
    now: () => FIXED_NOW,
  });
}

async function runTests() {
  {
    const { reader } = createRpcReader(baseRow());
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, {
      outcome: "approved",
      action_request_id: VALID_ID,
      capability_key: "booking.create",
      requested_action: "create",
    });
    assertNoSensitiveFields(result);
  }

  {
    const { reader } = createRpcReader(
      baseRow({ approval_status: "pending", lifecycle_status: "requested", execution_status: "queued" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "pending", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({ approval_status: "rejected", lifecycle_status: "rejected", execution_status: "queued" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "rejected", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        approval_status: "changes_requested",
        lifecycle_status: "changes_requested",
        execution_status: "queued",
      }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "changes_requested", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({ expired: true, approval_status: "expired", execution_status: "queued" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "expired", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({ consumed: true, lifecycle_status: "completed", execution_status: "completed" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "already_consumed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader({ success: false, outcome_code: "NOT_FOUND" });
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "not_found", action_request_id: null });
  }

  {
    const { reader } = createRpcReader(baseRow({ provider_key: "other_provider" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({ action_key: "booking.update", capability_key: "booking.create" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(baseRow({ requested_action: "update" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        capability_key: "booking.cancel",
        action_key: "booking.cancel",
        requested_action: "cancel",
      }),
    );
    const result = await run(
      { action_request_id: VALID_ID, allowed_capability_keys: ["booking.create", "booking.update"] },
      reader,
    );
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(baseRow({ execution_status: "running" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  for (const invalidId of ["not-a-uuid", NIL_UUID, ""]) {
    const { reader, calls } = createRpcReader(baseRow());
    const result = await resolveBookingApprovalResume(
      supabaseStub,
      { action_request_id: invalidId },
      { rpcReader: reader, now: () => FIXED_NOW },
    );
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: null }, invalidId);
    assert.equal(calls.length, 0, `RPC should not be called for ${JSON.stringify(invalidId)}`);
  }

  {
    const { reader } = createRpcReader(null, { message: "permission denied for org" });
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: null });
    assert.equal(JSON.stringify(result).includes("permission denied"), false);
  }

  {
    const { reader, params } = createRpcReader(baseRow());
    await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(params, [{ p_action_request_id: VALID_ID }]);
  }

  {
    const { reader } = createRpcReader(baseRow());
    const result = await run({ action_request_id: VALID_ID }, reader);
    assertNoSensitiveFields(result);
    assert.equal("payload_hash" in (result as Record<string, unknown>), false);
    assert.equal("idempotency_key" in (result as Record<string, unknown>), false);
  }
}

runTests()
  .then(() => {
    console.log("booking-approval-resume-resolver.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
