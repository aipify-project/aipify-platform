import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  resolveSupportApprovalResume,
  type SupportApprovalResumeRpcReader,
} from "@/lib/companion-runtime/support-approval-resume-resolver";

const VALID_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const VALID_CASE_ID = "b1b2c3d4-e5f6-4789-a012-3456789abcde";
const VALID_ASSIGNEE = "c1d2e3f4-a5b6-4789-a012-3456789abcde";
const VALID_RECEIPT_ID = "d1d2e3f4-a5b6-4789-a012-3456789abcde";
const VALID_HASH = "abc123def4567890abc123def4567890abc123def4567890abc123def4567890";
const VALID_IDEM = "support:idem-123456789012345678901234567890123456789012345678901234";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const FIXED_NOW = new Date("2026-06-26T12:00:00.000Z");

const supabaseStub = {} as SupabaseClient;

function baseRow(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    outcome_code: "SUPPORT_ACTION_REQUEST_FOUND",
    action_request_id: VALID_ID,
    action_key: "support_case.assign",
    approval_status: "approved",
    lifecycle_status: "approved",
    execution_status: "queued",
    capability_key: "support_case.assign",
    provider_key: "support_ai_engine",
    requested_action: "assign",
    payload_hash: VALID_HASH,
    idempotency_key: VALID_IDEM,
    expires_at: "2026-07-01T12:00:00.000Z",
    expired: false,
    consumed: false,
    payload: {
      case_id: VALID_CASE_ID,
      assignee_user_id: VALID_ASSIGNEE,
    },
    ...overrides,
  };
}

function createRpcReader(
  data: unknown,
  error: { message: string } | null = null,
): { reader: SupportApprovalResumeRpcReader; calls: string[]; params: unknown[] } {
  const calls: string[] = [];
  const params: unknown[] = [];

  const reader: SupportApprovalResumeRpcReader = async (actionRequestId) => {
    calls.push(actionRequestId);
    params.push({ p_action_request_id: actionRequestId });
    return { data, error };
  };

  return { reader, calls, params };
}

function assertNoCustomerText(result: unknown) {
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes("subject"), false);
  assert.equal(serialized.includes("customer"), false);
  assert.equal(serialized.includes("description"), false);
  assert.equal(serialized.includes("title"), false);
  assert.equal(serialized.includes("metadata"), false);
}

async function run(
  input: Parameters<typeof resolveSupportApprovalResume>[1],
  reader: SupportApprovalResumeRpcReader,
) {
  return resolveSupportApprovalResume(supabaseStub, input, {
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
      case_id: VALID_CASE_ID,
      assignee_user_id: VALID_ASSIGNEE,
      payload_hash: VALID_HASH,
      idempotency_key: VALID_IDEM,
    });
    assertNoCustomerText(result);
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        approval_status: "pending",
        lifecycle_status: "awaiting_approval",
        execution_status: "none",
      }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "pending", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({ approval_status: "rejected", lifecycle_status: "rejected", execution_status: "cancelled" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "rejected", action_request_id: VALID_ID });
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
      baseRow({ execution_status: "failed", lifecycle_status: "approved", approval_status: "approved" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({ execution_status: "cancelled", lifecycle_status: "cancelled", approval_status: "approved" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        consumed: true,
        lifecycle_status: "completed",
        execution_status: "completed",
        receipt_id: VALID_RECEIPT_ID,
      }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, {
      outcome: "already_consumed",
      action_request_id: VALID_ID,
      case_id: VALID_CASE_ID,
      assignee_user_id: VALID_ASSIGNEE,
      payload_hash: VALID_HASH,
      idempotency_key: VALID_IDEM,
      receipt_id: VALID_RECEIPT_ID,
    });
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        consumed: true,
        lifecycle_status: "completed",
        execution_status: "completed",
      }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader({ success: false, outcome_code: "NOT_FOUND" });
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "not_found", action_request_id: null });
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        approval_status: "approved",
        lifecycle_status: "approved",
        execution_status: "queued",
        expired: true,
      }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "expired", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(baseRow({ provider_key: "other_provider" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(baseRow({ domain: "booking_write" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(baseRow({ schema_version: "booking_write_v1" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(baseRow({ action_key: "support_case.escalate" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({ action_key: "support_case.assign", capability_key: "support_case.escalate" }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(baseRow({ requested_action: "escalate" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        payload: {
          case_id: VALID_CASE_ID,
          assignee_user_id: VALID_ASSIGNEE,
          escalation_reason: "urgent",
        },
      }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: null });
  }

  {
    const { reader } = createRpcReader(
      baseRow({
        payload: {
          case_id: "not-a-uuid",
          assignee_user_id: VALID_ASSIGNEE,
        },
      }),
    );
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: null });
  }

  {
    const { reader } = createRpcReader(baseRow({ payload_hash: "not-a-valid-hash" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: null });
  }

  {
    const { reader } = createRpcReader(baseRow({ idempotency_key: "short" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: null });
  }

  {
    const { reader } = createRpcReader(baseRow({ execution_status: "executing" }));
    const result = await run({ action_request_id: VALID_ID }, reader);
    assert.deepEqual(result, { outcome: "verification_failed", action_request_id: VALID_ID });
  }

  for (const invalidId of ["not-a-uuid", NIL_UUID, ""]) {
    const { reader, calls } = createRpcReader(baseRow());
    const result = await resolveSupportApprovalResume(
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
}

runTests()
  .then(() => {
    console.log("support-approval-resume-resolver.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
