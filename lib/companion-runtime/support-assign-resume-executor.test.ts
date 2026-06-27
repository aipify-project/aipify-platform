import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  SUPPORT_ASSIGN_EXECUTE_RPC,
  executeSupportAssignResume,
  type SupportAssignExecuteRpcCaller,
} from "@/lib/companion-runtime/support-assign-resume-executor";
import type { SupportApprovalResumeResult } from "@/lib/companion-runtime/support-approval-resume-resolver";

const VALID_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const OTHER_ID = "f1e2d3c4-b5a6-4789-a012-3456789abcde";
const VALID_RECEIPT_ID = "d1d2e3f4-a5b6-4789-a012-3456789abcde";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

const supabaseStub = {} as SupabaseClient;

function approvedResolution(): SupportApprovalResumeResult {
  return {
    outcome: "approved",
    action_request_id: VALID_ID,
    case_id: "b1b2c3d4-e5f6-4789-a012-3456789abcde",
    assignee_user_id: "c1d2e3f4-a5b6-4789-a012-3456789abcde",
    payload_hash: "abc123def4567890abc123def4567890abc123def4567890abc123def4567890",
    idempotency_key: "support:idem-123456789012345678901234567890123456789012345678901234",
  };
}

function consumedResolution(receiptId: string = VALID_RECEIPT_ID): SupportApprovalResumeResult {
  return {
    outcome: "already_consumed",
    action_request_id: VALID_ID,
    case_id: "b1b2c3d4-e5f6-4789-a012-3456789abcde",
    assignee_user_id: "c1d2e3f4-a5b6-4789-a012-3456789abcde",
    payload_hash: "abc123def4567890abc123def4567890abc123def4567890abc123def4567890",
    idempotency_key: "support:idem-123456789012345678901234567890123456789012345678901234",
    receipt_id: receiptId,
  };
}

function createDeps(input: {
  resolution: SupportApprovalResumeResult;
  executeData?: unknown;
  executeError?: { message: string } | null;
}) {
  let resolveCalls = 0;
  let executeCalls = 0;
  const executeParams: unknown[] = [];

  const resolve_approval_resume = async () => {
    resolveCalls += 1;
    return input.resolution;
  };

  const execute_support_assign_write: SupportAssignExecuteRpcCaller = async (requestId) => {
    executeCalls += 1;
    executeParams.push({ p_action_request_id: requestId });
    return {
      data: input.executeData ?? null,
      error: input.executeError ?? null,
    };
  };

  return {
    deps: { resolve_approval_resume, execute_support_assign_write },
    get resolveCalls() {
      return resolveCalls;
    },
    get executeCalls() {
      return executeCalls;
    },
    executeParams,
  };
}

function successExecuteRow(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    outcome_code: "SUPPORT_CASE_ASSIGNED",
    case_id: "b1b2c3d4-e5f6-4789-a012-3456789abcde",
    assigned_to: "c1d2e3f4-a5b6-4789-a012-3456789abcde",
    receipt_id: VALID_RECEIPT_ID,
    idempotent_replay: false,
    ...overrides,
  };
}

function assertNoRawErrorText(result: unknown, forbidden: string) {
  assert.equal(JSON.stringify(result).includes(forbidden), false);
}

async function runTests() {
  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: successExecuteRow({ action_request_id: OTHER_ID }),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 1);
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: successExecuteRow({ action_request_id: null }),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 1);
  }

  for (const invalidReceiptId of ["not-a-uuid", NIL_UUID]) {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: successExecuteRow({ receipt_id: invalidReceiptId }),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(
      result,
      {
        outcome: "verification_failed",
        action_request_id: VALID_ID,
        receipt_id: null,
        idempotent_replay: false,
      },
      invalidReceiptId,
    );
    assert.equal(harness.executeCalls, 1, invalidReceiptId);
  }

  {
    const harness = createDeps({
      resolution: consumedResolution(NIL_UUID),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 0);
  }

  {
    const harness = createDeps({
      resolution: {
        ...consumedResolution(),
        action_request_id: OTHER_ID,
      },
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 0);
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: successExecuteRow(),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "executed",
      action_request_id: VALID_ID,
      receipt_id: VALID_RECEIPT_ID,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 1);
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: successExecuteRow({ idempotent_replay: true }),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "already_consumed",
      action_request_id: VALID_ID,
      receipt_id: VALID_RECEIPT_ID,
      idempotent_replay: true,
    });
    assert.equal(harness.executeCalls, 1);
  }

  {
    const harness = createDeps({
      resolution: consumedResolution(),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "already_consumed",
      action_request_id: VALID_ID,
      receipt_id: VALID_RECEIPT_ID,
      idempotent_replay: true,
    });
    assert.equal(harness.executeCalls, 0);
  }

  for (const outcome of ["pending", "rejected", "expired", "failed"] as const) {
    const harness = createDeps({
      resolution: {
        outcome,
        action_request_id: VALID_ID,
      },
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome,
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 0, outcome);
  }

  {
    const harness = createDeps({
      resolution: { outcome: "not_found", action_request_id: null },
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "not_found",
      action_request_id: null,
      receipt_id: null,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 0);
  }

  for (const invalidId of ["not-a-uuid", NIL_UUID, ""]) {
    let resolveCalls = 0;
    let executeCalls = 0;
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: invalidId },
      {
        resolve_approval_resume: async () => {
          resolveCalls += 1;
          return approvedResolution();
        },
        execute_support_assign_write: async () => {
          executeCalls += 1;
          return { data: successExecuteRow(), error: null };
        },
      },
    );
    assert.deepEqual(
      result,
      {
        outcome: "verification_failed",
        action_request_id: null,
        receipt_id: null,
        idempotent_replay: false,
      },
      invalidId,
    );
    assert.equal(resolveCalls, 0, invalidId);
    assert.equal(executeCalls, 0, invalidId);
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: successExecuteRow({ receipt_id: null }),
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
    assert.equal(harness.executeCalls, 1);
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: { success: false, outcome_code: "WRITE_FAILED" },
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: { success: false, outcome_code: "APPROVAL_EXPIRED" },
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "expired",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: { success: false, outcome_code: "APPROVAL_INVALID" },
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: null,
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: VALID_ID,
      receipt_id: null,
      idempotent_replay: false,
    });
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeError: { message: "permission denied for execute_companion_support_assign_write" },
    });
    const result = await executeSupportAssignResume(
      supabaseStub,
      { action_request_id: VALID_ID },
      harness.deps,
    );
    assert.deepEqual(result, {
      outcome: "verification_failed",
      action_request_id: null,
      receipt_id: null,
      idempotent_replay: false,
    });
    assertNoRawErrorText(result, "permission denied");
  }

  {
    const harness = createDeps({
      resolution: approvedResolution(),
      executeData: successExecuteRow(),
    });
    await executeSupportAssignResume(supabaseStub, { action_request_id: VALID_ID }, harness.deps);
    assert.deepEqual(harness.executeParams, [{ p_action_request_id: VALID_ID }]);
  }

  assert.equal(SUPPORT_ASSIGN_EXECUTE_RPC, "execute_companion_support_assign_write");
}

runTests()
  .then(() => {
    console.log("support-assign-resume-executor.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
