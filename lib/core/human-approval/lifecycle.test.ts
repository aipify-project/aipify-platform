import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  canApproveTrustActionRisk,
  isSelfGrantBlocked,
  shouldBlockApproverFromSubmittingRequest,
  isElevatedSelfApprovalRole,
} from "./approval-policy";
import { isSafeCoreHumanApprovalRpcPayload } from "./parse";
import {
  AUTHENTICATED_DENIED_CORE_RPCS,
  SENSITIVE_CORE_APPROVAL_RPC_FIELDS,
} from "./types";
import {
  CANONICAL_HASH_TEST_VECTORS,
  computePayloadHash,
  computeScopeFingerprint,
  stableStringify,
} from "./scope-fingerprint";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..");
const migrationPath = path.join(
  repoRoot,
  "supabase/migrations/20261932100000_core_human_approval_foundation.sql",
);
const migrationSql = fs.readFileSync(migrationPath, "utf8");
const approveRoutePath = path.join(repoRoot, "app/api/actions/[id]/approve/route.ts");
const approveRouteSource = fs.readFileSync(approveRoutePath, "utf8");

assert.equal(canApproveTrustActionRisk("owner", "owner"), true);
assert.equal(canApproveTrustActionRisk("staff", "owner"), false);
assert.equal(canApproveTrustActionRisk("admin", "admin"), true);

assert.equal(
  isSelfGrantBlocked({
    requester_user_id: "user-1",
    approver_user_id: "user-1",
    approver_role: "staff",
    can_approve_action: true,
  }),
  true,
  "staff cannot self-approve",
);

assert.equal(
  isSelfGrantBlocked({
    requester_user_id: "user-1",
    approver_user_id: "user-1",
    approver_role: "owner",
    can_approve_action: true,
  }),
  false,
  "owner may self-approve when authority permits",
);

assert.equal(isElevatedSelfApprovalRole("administrator"), true);
assert.equal(shouldBlockApproverFromSubmittingRequest(true), true);
assert.equal(shouldBlockApproverFromSubmittingRequest(false), false);

const scopeA = { action_name: "send_email", resource_type: "message", resource_id: "123" };
const scopeB = { action_name: "send_email", resource_id: "123", resource_type: "message" };
assert.equal(
  computeScopeFingerprint(scopeA),
  computeScopeFingerprint(scopeB),
  "scope fingerprint is key-order stable",
);

const hashA = computePayloadHash({
  action_key: "send_email",
  scope: scopeA,
  organization_id: "22222222-2222-2222-2222-222222222222",
  consumer_ref_id: "11111111-1111-1111-1111-111111111111",
});

assert.notEqual(
  computePayloadHash({
    action_key: "other",
    scope: scopeA,
    organization_id: "22222222-2222-2222-2222-222222222222",
    consumer_ref_id: "11111111-1111-1111-1111-111111111111",
  }),
  hashA,
  "payload hash binds action key",
);

assert.doesNotMatch(stableStringify(scopeA), /timestamp|created_at/);

for (const vector of CANONICAL_HASH_TEST_VECTORS) {
  assert.equal(stableStringify(vector.scope), vector.expectedCanonical, vector.name);
  assert.equal(computeScopeFingerprint(vector.scope).length, 32, `${vector.name} hash length`);
}

assert.equal(
  computePayloadHash({
    action_key: "draft_reply",
    scope: { action_name: "draft_reply", resource_type: null, resource_id: null, skill_key: null },
    organization_id: "22222222-2222-2222-2222-222222222222",
    consumer_ref_id: null,
  }).length,
  32,
  "payload hash supports null consumer_ref_id",
);

for (const rpc of AUTHENTICATED_DENIED_CORE_RPCS) {
  assert.match(
    migrationSql,
    new RegExp(`revoke all on function public\\.${rpc}`, "i"),
    `${rpc} revoke present`,
  );
  assert.doesNotMatch(
    migrationSql,
    new RegExp(`grant execute on function public\\.${rpc}[^;]+to authenticated`, "i"),
    `${rpc} must not grant authenticated`,
  );
  assert.match(
    migrationSql,
    new RegExp(`grant execute on function public\\.${rpc}[^;]+to service_role`, "i"),
    `${rpc} service_role grant present`,
  );
}

assert.match(migrationSql, /execution_not_in_progress/, "complete requires executing status");
assert.match(migrationSql, /revoke_forbidden/, "revoke authority enforced");
assert.match(migrationSql, /complete_core_human_approval_execution\(v_core\.id, 'failed'/);
assert.match(migrationSql, /_cha_request_json_safe/);
assert.match(migrationSql, /_cha_canonical_text/);

assert.doesNotMatch(
  approveRouteSource,
  /RECEIPT_LABELS|Approval confirmed/,
  "approve route must not hardcode English receipt labels",
);
assert.match(approveRouteSource, /receiptSource/, "approve route returns receiptSource model");

const safePayload = {
  id: "33333333-3333-3333-3333-333333333333",
  correlation_id: "33333333-3333-3333-3333-333333333333",
  scope_summary: "draft_reply",
  title: "Support: draft_reply",
  status: "succeeded",
};
assert.equal(isSafeCoreHumanApprovalRpcPayload(safePayload), true);
for (const field of SENSITIVE_CORE_APPROVAL_RPC_FIELDS) {
  assert.equal(
    isSafeCoreHumanApprovalRpcPayload({ ...safePayload, [field]: "secret" }),
    false,
    `${field} must be absent from safe RPC payload`,
  );
}

console.log("human-approval lifecycle tests passed");
