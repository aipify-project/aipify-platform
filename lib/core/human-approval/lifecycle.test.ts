import assert from "node:assert/strict";
import {
  canApproveTrustActionRisk,
  isSelfGrantBlocked,
  shouldBlockApproverFromSubmittingRequest,
  isElevatedSelfApprovalRole,
} from "./approval-policy";
import {
  computePayloadHash,
  computeScopeFingerprint,
  stableStringify,
} from "./scope-fingerprint";

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
  organization_id: "org-1",
  consumer_ref_id: "req-1",
});
const hashB = computePayloadHash({
  action_key: "send_email",
  scope: { ...scopeA, extra: "ignored" in scopeA ? undefined : "x" },
  organization_id: "org-1",
  consumer_ref_id: "req-1",
});
assert.notEqual(
  computePayloadHash({
    action_key: "other",
    scope: scopeA,
    organization_id: "org-1",
    consumer_ref_id: "req-1",
  }),
  hashA,
  "payload hash binds action key",
);

assert.doesNotMatch(stableStringify(scopeA), /timestamp|created_at/);

console.log("human-approval lifecycle tests passed");
