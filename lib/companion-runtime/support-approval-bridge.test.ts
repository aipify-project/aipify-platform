import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  SUPPORT_ASSIGN_ACTION_KEY,
  buildSupportAssignApprovalCanonicalPayload,
  computeSupportApprovalPayloadHash,
  recordSupportAssignApprovalActionRequest,
  resolveSupportApprovalExpiresAt,
} from "@/lib/companion-runtime/support-approval-bridge";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const migrationSql = fs.readFileSync(
  path.join(
    repoRoot,
    "supabase/migrations/20261930900000_governed_support_assign_action_requests_p1_13c.sql",
  ),
  "utf8",
);

assert.match(
  migrationSql,
  /revoke all on function public\.record_companion_support_action_request\(\s*text, jsonb, text, text, timestamptz\s*\) from public;/,
  "RPC must be revoked from PUBLIC",
);
assert.match(
  migrationSql,
  /revoke all on function public\.record_companion_support_action_request\(\s*text, jsonb, text, text, timestamptz\s*\) from anon;/,
  "RPC must be revoked from anon",
);
assert.match(
  migrationSql,
  /grant execute on function public\.record_companion_support_action_request\(\s*text, jsonb, text, text, timestamptz\s*\) to authenticated;/,
  "RPC must grant execute to authenticated",
);
assert.equal(
  /grant execute on function public\.record_companion_support_action_request[\s\S]* to service_role;/.test(
    migrationSql,
  ),
  false,
  "RPC must not grant service_role without documented need",
);
assert.match(
  migrationSql,
  /if public\._mta_membership_active\(v_org_id, v_assignee_user_id::uuid\) is null then\s+raise exception 'Invalid assignee';/,
  "RPC must validate assignee via active organization membership",
);
assert.match(
  migrationSql,
  /security definer[\s\S]*set search_path = public/,
  "RPC must remain SECURITY DEFINER with search_path public",
);
assert.equal(
  migrationSql.indexOf("_mta_membership_active(v_org_id, v_assignee_user_id::uuid)"),
  migrationSql.lastIndexOf("_mta_membership_active(v_org_id, v_assignee_user_id::uuid)"),
  "Assignee membership predicate must be singular and canonical",
);
assert.ok(
  migrationSql.indexOf("_mta_membership_active(v_org_id, v_assignee_user_id::uuid)") <
    migrationSql.indexOf("insert into public.companion_action_requests"),
  "Assignee validation must occur before action request insert",
);
assert.equal(
  /_caae346_log_audit/.test(
    migrationSql.slice(0, migrationSql.indexOf("_mta_membership_active(v_org_id, v_assignee_user_id::uuid)")),
  ),
  false,
  "Invalid assignee path must not write audit before membership validation",
);

const VALID_CASE_ID = "case-abc-123";
const VALID_ASSIGNEE = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const VALID_ACTION_REQUEST_ID = "c1d2e3f4-a5b6-4789-a012-3456789abcde";
const VALID_IDEMPOTENCY = "idem-support-assign-01";

const fixedNow = new Date("2026-06-26T12:00:00.000Z");
const expectedExpiresAt = resolveSupportApprovalExpiresAt(fixedNow);

const baseRequest = {
  case_id: VALID_CASE_ID,
  assignee_user_id: VALID_ASSIGNEE,
  idempotency_key: VALID_IDEMPOTENCY,
};

const expectedPayload = buildSupportAssignApprovalCanonicalPayload(baseRequest);
const expectedPayloadHash = computeSupportApprovalPayloadHash(expectedPayload);

assert.deepEqual(Object.keys(expectedPayload).sort(), ["assignee_user_id", "case_id"]);
assert.equal(expectedPayload.case_id, VALID_CASE_ID);
assert.equal(expectedPayload.assignee_user_id, VALID_ASSIGNEE);
assert.equal(
  Object.keys(expectedPayload).some(
    (key) =>
      /email|phone|customer|raw_message|attachment/i.test(key),
  ),
  false,
  "canonical payload must not include raw customer data fields",
);

const reversedInputPayload = buildSupportAssignApprovalCanonicalPayload({
  assignee_user_id: VALID_ASSIGNEE,
  case_id: VALID_CASE_ID,
});
assert.equal(
  computeSupportApprovalPayloadHash(reversedInputPayload),
  expectedPayloadHash,
  "hash must be deterministic regardless of input property order",
);

const trimmedPayload = buildSupportAssignApprovalCanonicalPayload({
  case_id: `  ${VALID_CASE_ID}  `,
  assignee_user_id: `  ${VALID_ASSIGNEE}  `,
});
assert.deepEqual(trimmedPayload, expectedPayload);

async function runSupportApprovalBridgeTests(): Promise<void> {
const invalidCaseResult = await recordSupportAssignApprovalActionRequest(
  {} as SupabaseClient,
  { ...baseRequest, case_id: "   " },
);
assert.equal(invalidCaseResult.success, false);
assert.equal(invalidCaseResult.outcome_code, "REQUEST_FAILED");
assert.equal(invalidCaseResult.action_request_id, null);

const invalidAssigneeResult = await recordSupportAssignApprovalActionRequest(
  {} as SupabaseClient,
  { ...baseRequest, assignee_user_id: "not-a-uuid" },
);
assert.equal(invalidAssigneeResult.success, false);
assert.equal(invalidAssigneeResult.outcome_code, "REQUEST_FAILED");

const invalidIdempotencyResult = await recordSupportAssignApprovalActionRequest(
  {} as SupabaseClient,
  { ...baseRequest, idempotency_key: "short" },
);
assert.equal(invalidIdempotencyResult.success, false);
assert.equal(invalidIdempotencyResult.outcome_code, "REQUEST_FAILED");

let rpcCallCount = 0;
const mockSupabase = {} as SupabaseClient;

const createResult = await recordSupportAssignApprovalActionRequest(mockSupabase, baseRequest, {
  now: () => fixedNow,
  rpcCaller: async (params) => {
    rpcCallCount += 1;
    assert.equal(params.action_key, SUPPORT_ASSIGN_ACTION_KEY);
    assert.deepEqual(params.payload, expectedPayload);
    assert.equal(params.payload_hash, expectedPayloadHash);
    assert.equal(params.idempotency_key, VALID_IDEMPOTENCY);
    assert.equal(params.expires_at, expectedExpiresAt);
    assert.equal(
      Object.keys(params.payload).some((key) =>
        /email|phone|customer|raw_message|attachment/i.test(key),
      ),
      false,
      "RPC payload must not include raw customer data fields",
    );
    return {
      data: {
        success: true,
        outcome_code: "SUPPORT_ACTION_REQUESTED",
        action_request_id: VALID_ACTION_REQUEST_ID,
        expires_at: params.expires_at,
        idempotent_replay: false,
      },
      error: null,
    };
  },
});

assert.equal(createResult.success, true);
assert.equal(createResult.outcome_code, "SUPPORT_ACTION_REQUESTED");
assert.equal(createResult.action_request_id, VALID_ACTION_REQUEST_ID);
assert.equal(createResult.payload_hash, expectedPayloadHash);
assert.equal(createResult.idempotency_key, VALID_IDEMPOTENCY);
assert.equal(createResult.expires_at, expectedExpiresAt);
assert.equal(createResult.idempotent_replay, false);

const replayResult = await recordSupportAssignApprovalActionRequest(mockSupabase, baseRequest, {
  now: () => fixedNow,
  rpcCaller: async () => ({
    data: {
      success: true,
      outcome_code: "IDEMPOTENT_REPLAY",
      action_request_id: VALID_ACTION_REQUEST_ID,
      expires_at: expectedExpiresAt,
      idempotent_replay: true,
    },
    error: null,
  }),
});

assert.equal(replayResult.success, true);
assert.equal(replayResult.outcome_code, "IDEMPOTENT_REPLAY");
assert.equal(replayResult.action_request_id, VALID_ACTION_REQUEST_ID);
assert.equal(replayResult.idempotent_replay, true);

const alternateAssignee = "b2c3d4e5-f6a7-4890-b123-456789abcdef";

const changedPayload = buildSupportAssignApprovalCanonicalPayload({
  ...baseRequest,
  assignee_user_id: alternateAssignee,
});

const conflictResult = await recordSupportAssignApprovalActionRequest(
  mockSupabase,
  {
    ...baseRequest,
    assignee_user_id: alternateAssignee,
  },
  {
    now: () => fixedNow,
    rpcCaller: async () => ({
      data: {
        success: false,
        outcome_code: "IDEMPOTENCY_CONFLICT",
        action_request_id: VALID_ACTION_REQUEST_ID,
        expires_at: expectedExpiresAt,
        idempotent_replay: false,
      },
      error: null,
    }),
  },
);

assert.equal(conflictResult.success, false);
assert.equal(conflictResult.outcome_code, "IDEMPOTENCY_CONFLICT");
assert.equal(conflictResult.action_request_id, VALID_ACTION_REQUEST_ID);
assert.equal(conflictResult.idempotent_replay, false);
assert.equal(conflictResult.payload_hash, computeSupportApprovalPayloadHash(changedPayload));

const rpcFailureResult = await recordSupportAssignApprovalActionRequest(
  mockSupabase,
  baseRequest,
  {
    now: () => fixedNow,
    rpcCaller: async () => ({
      data: null,
      error: { message: "permission denied for function record_companion_support_action_request" },
    }),
  },
);

assert.equal(rpcFailureResult.success, false);
assert.equal(rpcFailureResult.outcome_code, "REQUEST_FAILED");
assert.equal(rpcFailureResult.action_request_id, null);
assert.equal(rpcFailureResult.outcome_code.includes("permission"), false);

const successWithoutId = await recordSupportAssignApprovalActionRequest(
  mockSupabase,
  baseRequest,
  {
    now: () => fixedNow,
    rpcCaller: async () => ({
      data: {
        success: true,
        outcome_code: "SUPPORT_ACTION_REQUESTED",
        action_request_id: null,
        expires_at: expectedExpiresAt,
        idempotent_replay: false,
      },
      error: null,
    }),
  },
);
assert.equal(successWithoutId.success, false);
assert.equal(successWithoutId.outcome_code, "REQUEST_FAILED");
assert.equal(successWithoutId.action_request_id, null);

const replayWithoutId = await recordSupportAssignApprovalActionRequest(
  mockSupabase,
  baseRequest,
  {
    now: () => fixedNow,
    rpcCaller: async () => ({
      data: {
        success: true,
        outcome_code: "IDEMPOTENT_REPLAY",
        action_request_id: "",
        expires_at: expectedExpiresAt,
        idempotent_replay: true,
      },
      error: null,
    }),
  },
);
assert.equal(replayWithoutId.success, false);
assert.equal(replayWithoutId.outcome_code, "REQUEST_FAILED");
assert.equal(replayWithoutId.action_request_id, null);

const invalidAssigneeRpcResult = await recordSupportAssignApprovalActionRequest(
  mockSupabase,
  baseRequest,
  {
    now: () => fixedNow,
    rpcCaller: async () => ({
      data: null,
      error: { message: "Invalid assignee" },
    }),
  },
);
assert.equal(invalidAssigneeRpcResult.success, false);
assert.equal(invalidAssigneeRpcResult.outcome_code, "REQUEST_FAILED");
assert.equal(invalidAssigneeRpcResult.action_request_id, null);
assert.equal(invalidAssigneeRpcResult.outcome_code.includes("organization"), false);
assert.equal(invalidAssigneeRpcResult.outcome_code.includes("Invalid assignee"), false);

assert.equal(rpcCallCount, 1);
}

runSupportApprovalBridgeTests()
  .then(() => {
    console.log("support-approval-bridge.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
