import assert from "node:assert/strict";
import {
  buildTrustCoreApprovalLinkInput,
  mapCoreStatusToTrustStatus,
  mergeTrustActionWithCoreReadModel,
  parseTrustApprovalFromCenterRow,
} from "./trust-action-adapter";
import { computePayloadHash, buildTrustActionScope } from "./scope-fingerprint";
import type { ActionRequest } from "@/lib/trust-action/types";
import type { CoreHumanApprovalRequest } from "./types";

assert.equal(mapCoreStatusToTrustStatus("denied"), "rejected");
assert.equal(mapCoreStatusToTrustStatus("succeeded"), "completed");
assert.equal(mapCoreStatusToTrustStatus("approved"), "approved");

const link = buildTrustCoreApprovalLinkInput({
  id: "11111111-1111-1111-1111-111111111111",
  action_name: "draft_reply",
  resource_type: "support_case",
  resource_id: "case-42",
  skill_key: "support_ai",
  skill_name: "Support",
  description: "Draft a reply",
  risk_level: 2,
  organization_id: "22222222-2222-2222-2222-222222222222",
});

assert.equal(link.consumer_kind, "trust_action");
assert.equal(link.action_category, "trust_action");
assert.ok(link.scope_fingerprint.length === 32);
assert.ok(link.payload_hash.length === 32);
assert.match(link.unchanged_summary, /will not be changed/i);

const action: ActionRequest = {
  id: "11111111-1111-1111-1111-111111111111",
  skill_id: null,
  skill_name: "Support",
  skill_key: "support_ai",
  action_name: "draft_reply",
  description: "Draft a reply",
  risk_level: 2,
  resource_type: "support_case",
  resource_id: "case-42",
  status: "pending",
  requested_by: "user@example.com",
  approved_by: null,
  approved_at: null,
  executed_at: null,
  created_at: "2026-07-03T12:00:00.000Z",
};

const core: CoreHumanApprovalRequest = {
  id: "33333333-3333-3333-3333-333333333333",
  organization_id: "22222222-2222-2222-2222-222222222222",
  requester_user_id: "user-1",
  requester_role_snapshot: "staff",
  action_category: "trust_action",
  action_key: "draft_reply",
  title: "Support: draft_reply",
  summary: "Draft a reply",
  unchanged_summary: "Unrelated systems will not be changed.",
  scope_summary: "draft_reply · support_case · case-42",
  access_mode: "one_time",
  risk_level: 2,
  status: "approved",
  consumer_kind: "trust_action",
  consumer_ref_id: action.id,
  approved_by_user_id: "approver-1",
  approved_by_display: "Approver One",
  denied_by_user_id: null,
  approver_role_snapshot: "admin",
  target_environment: "tenant:22222222-2222-2222-2222-222222222222",
  expires_at: null,
  revoked_at: null,
  consumed_at: null,
  execution_started_at: null,
  execution_completed_at: null,
  execution_result: null,
  execution_error_summary: null,
  approved_at: "2026-07-03T12:05:00.000Z",
  created_at: "2026-07-03T12:00:00.000Z",
  updated_at: "2026-07-03T12:05:00.000Z",
  correlation_id: "33333333-3333-3333-3333-333333333333",
  latest_audit_id: "44444444-4444-4444-4444-444444444444",
};

const merged = mergeTrustActionWithCoreReadModel(action, core);
assert.equal(merged.status, "approved");
assert.equal(merged.core_approval_id, core.id);
assert.equal(merged.correlation_id, core.correlation_id);
assert.equal(merged.latest_audit_id, core.latest_audit_id);

const row = parseTrustApprovalFromCenterRow({
  id: action.id,
  title: "Support: draft_reply",
  description: "Draft a reply",
  category: "action",
  status: "approved",
  risk_level: "2",
  created_at: action.created_at,
  core_approval_id: core.id,
  correlation_id: core.correlation_id,
  latest_audit_id: core.latest_audit_id,
  scope_summary: core.scope_summary,
});
assert.equal(row.core_approval_id, core.id);

const canonicalScope = buildTrustActionScope({
  action_name: action.action_name,
  resource_id: action.resource_id,
  resource_type: action.resource_type,
  skill_key: action.skill_key,
});
assert.equal(
  link.payload_hash,
  computePayloadHash({
    action_key: action.action_name,
    scope: canonicalScope,
    organization_id: "22222222-2222-2222-2222-222222222222",
    consumer_ref_id: action.id,
  }),
  "trust adapter payload hash uses canonical contract",
);

console.log("human-approval trust-action-adapter tests passed");
