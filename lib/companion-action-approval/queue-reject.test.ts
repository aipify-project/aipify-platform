import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildCompanionPendingDisplayFields,
  companionDisplayFieldsExcludeSensitivePayload,
  dedupeCompanionPendingById,
  resolveApprovalPostRequest,
  resolveCompanionActionsLoadOutcome,
  resolveTrustApprovalsLoadOutcome,
  runIndependentApprovalLoads,
  shouldShowApprovalsEmptyState,
} from "./parse";
import {
  buildGovernedRejectPayload,
  canRejectQueuedAction,
} from "./queue-reject";
import type { CompanionActionCenter, CompanionActionQueueItem, CompanionActionRequest } from "./types";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const CORE_LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;
const UNIFIED_APPROVAL_KEYS = [
  "trustSection",
  "companionSection",
  "companionEmpty",
  "trustLoadError",
  "retry",
] as const;

const companionSuccessPayload = {
  has_access: true,
  execution_enabled: true,
  emergency_stop_active: false,
  automation_disabled: false,
  limits: {},
  pending_actions: [
    {
      id: "acc41464-0074-47cf-a453-9a22dc62ca53",
      title: "Support case assignment request",
      description: "A governed support case assignment is awaiting approval.",
      reason: "Assignment requires approval",
      risk_level: "medium",
      category: "operations",
      requested_for: "Support team",
      approval_status: "pending",
      lifecycle_status: "awaiting_approval",
      expires_at: "2026-07-04T22:34:13.778+00:00",
      expected_outcome: "Case assigned after approval",
    },
  ],
  execution_queue: [],
  action_history: [],
  policies: [],
  safety_center: {},
  receipts: [],
  audit_logs: [],
  confirmation_examples: [],
};

for (const locale of CORE_LOCALES) {
  test(`${locale} dashboard approvals contains unified approval keys`, () => {
    const dashboard = JSON.parse(
      fs.readFileSync(
        path.join(repoRoot, `locales/${locale}/customer-app/dashboard.json`),
        "utf8",
      ),
    ) as Record<string, unknown>;
    const approvals = dashboard.approvals as Record<string, unknown> | undefined;
    assert.ok(approvals, `missing approvals namespace in ${locale}`);
    for (const key of UNIFIED_APPROVAL_KEYS) {
      const value: unknown = approvals[key];
      assert.equal(typeof value, "string", `${locale} missing approvals.${key}`);
      assert.notEqual(String(value).trim(), "", `${locale} approvals.${key} is empty`);
    }
    if (locale === "pl") {
      assert.match(String(approvals.companionSection), /Companion/i);
      assert.doesNotMatch(String(approvals.companionSection), /^Companion actions$/);
    }
    if (locale === "uk") {
      assert.match(String(approvals.companionSection), /Companion/i);
      assert.doesNotMatch(String(approvals.companionEmpty), /^No Companion actions awaiting approval\.$/);
    }
  });
}

test("trust success + companion failure keeps companion error separate from empty", () => {
  const trust = resolveTrustApprovalsLoadOutcome({
    responseOk: true,
    payload: { has_customer: true },
    fallbackError: "trust-fallback",
  });
  const companion = resolveCompanionActionsLoadOutcome({
    responseOk: false,
    payload: { error: "companion unavailable" },
    fallbackError: "companion-fallback",
  });
  assert.equal(trust.kind, "success");
  assert.equal(companion.kind, "error");
  assert.equal(companion.error, "companion unavailable");
  assert.equal(
    shouldShowApprovalsEmptyState({
      loading: false,
      error: companion.error,
      itemCount: companion.actions.length,
    }),
    false,
  );
});

test("trust failure + companion success keeps trust error separate from empty", () => {
  const trust = resolveTrustApprovalsLoadOutcome({
    responseOk: false,
    payload: { error: "trust unavailable" },
    fallbackError: "trust-fallback",
  });
  const companion = resolveCompanionActionsLoadOutcome({
    responseOk: true,
    payload: companionSuccessPayload,
    fallbackError: "companion-fallback",
  });
  assert.equal(trust.kind, "error");
  assert.equal(companion.kind, "success");
  assert.equal(companion.actions.length, 1);
  assert.equal(
    shouldShowApprovalsEmptyState({
      loading: false,
      error: trust.error,
      itemCount: 0,
    }),
    false,
  );
});

test("both sources success", () => {
  const trust = resolveTrustApprovalsLoadOutcome({
    responseOk: true,
    payload: { has_customer: true, approvals: [] },
    fallbackError: "trust-fallback",
  });
  const companion = resolveCompanionActionsLoadOutcome({
    responseOk: true,
    payload: companionSuccessPayload,
    fallbackError: "companion-fallback",
  });
  assert.equal(trust.kind, "success");
  assert.equal(companion.kind, "success");
  assert.equal(companion.actions[0]?.id, "acc41464-0074-47cf-a453-9a22dc62ca53");
});

test("both sources failure expose separate error states", () => {
  const trust = resolveTrustApprovalsLoadOutcome({
    responseOk: false,
    payload: { error: "trust down" },
    fallbackError: "trust-fallback",
  });
  const companion = resolveCompanionActionsLoadOutcome({
    responseOk: false,
    payload: { error: "companion down" },
    fallbackError: "companion-fallback",
  });
  assert.equal(trust.error, "trust down");
  assert.equal(companion.error, "companion down");
  assert.equal(
    shouldShowApprovalsEmptyState({ loading: false, error: trust.error, itemCount: 0 }),
    false,
  );
  assert.equal(
    shouldShowApprovalsEmptyState({ loading: false, error: companion.error, itemCount: 0 }),
    false,
  );
});

test("runIndependentApprovalLoads settles both loaders even when one rejects", async () => {
  const calls: string[] = [];
  const results = await runIndependentApprovalLoads({
    trust: async () => {
      calls.push("trust");
    },
    companion: async () => {
      calls.push("companion");
      throw new Error("companion failed");
    },
  });
  assert.deepEqual(calls.sort(), ["companion", "trust"]);
  assert.equal(results[0]?.status, "fulfilled");
  assert.equal(results[1]?.status, "rejected");
});

test("resolveApprovalPostRequest never routes companion ids to trust endpoints", () => {
  const companionApprove = resolveApprovalPostRequest(
    "companion",
    "acc41464-0074-47cf-a453-9a22dc62ca53",
    "approve",
  );
  assert.equal(companionApprove.url.includes("/api/actions/"), false);
  assert.equal(companionApprove.url, "/api/companion/actions/action");
});

const approvedQueuedHistory: CompanionActionCenter["action_history"] = [
  {
    id: "request-1",
    title: "Appointment booking request",
    risk_level: "medium",
    category: "scheduling",
    lifecycle_status: "approved",
    execution_status: "queued",
    created_at: "2026-06-25T18:59:03Z",
  },
];

const baseQueueItem: CompanionActionQueueItem = {
  id: "queue-row-1",
  action_request_id: "request-1",
  queue_status: "queued",
  title: "Appointment booking request",
  queued_at: "2026-06-25T18:59:03Z",
};

test("approved + queued + matching history → true", () => {
  assert.equal(canRejectQueuedAction(baseQueueItem, approvedQueuedHistory), true);
});

test("missing history → false", () => {
  assert.equal(canRejectQueuedAction(baseQueueItem, []), false);
});

test("pending / awaiting approval → false", () => {
  assert.equal(
    canRejectQueuedAction(baseQueueItem, [
      {
        ...approvedQueuedHistory[0],
        lifecycle_status: "awaiting_approval",
        execution_status: "none",
      },
    ]),
    false,
  );
});

test("queue_status preparing / executing / retrying → false", () => {
  for (const queue_status of ["preparing", "executing", "retrying"] as const) {
    assert.equal(
      canRejectQueuedAction({ ...baseQueueItem, queue_status }, approvedQueuedHistory),
      false,
    );
  }
});

test("completed / rejected / expired / cancelled / failed → false", () => {
  for (const lifecycle_status of [
    "completed",
    "rejected",
    "expired",
    "cancelled",
    "failed",
  ] as const) {
    assert.equal(
      canRejectQueuedAction(baseQueueItem, [
        {
          ...approvedQueuedHistory[0],
          lifecycle_status,
        },
      ]),
      false,
    );
  }

  assert.equal(
    canRejectQueuedAction(baseQueueItem, [
      {
        ...approvedQueuedHistory[0],
        execution_status: "completed",
      },
    ]),
    false,
  );
});

test("empty or missing action_request_id → false", () => {
  assert.equal(
    canRejectQueuedAction({ ...baseQueueItem, action_request_id: "" }, approvedQueuedHistory),
    false,
  );
  assert.equal(
    canRejectQueuedAction(
      { ...baseQueueItem, action_request_id: "   " },
      approvedQueuedHistory,
    ),
    false,
  );
});

test("payload uses action-request ID, not queue row ID", () => {
  const payload = buildGovernedRejectPayload(baseQueueItem.action_request_id);
  assert.equal(payload.action, "reject");
  assert.equal(payload.action_id, "request-1");
  assert.notEqual(payload.action_id, baseQueueItem.id);
});

test("payload contains only reject / action_id / optional reason", () => {
  assert.deepEqual(buildGovernedRejectPayload("request-1"), {
    action: "reject",
    action_id: "request-1",
  });

  assert.deepEqual(
    buildGovernedRejectPayload("request-1", "Operator closed legacy validation request."),
    {
      action: "reject",
      action_id: "request-1",
      reason: "Operator closed legacy validation request.",
    },
  );

  const payload = buildGovernedRejectPayload("request-1");
  assert.equal("execute" in payload, false);
  assert.equal("consume" in payload, false);
});

test("companion approve routes to companion action endpoint", () => {
  const request = resolveApprovalPostRequest("companion", "acc41464-0074-47cf-a453-9a22dc62ca53", "approve");
  assert.equal(request.url, "/api/companion/actions/action");
  assert.equal(request.init.method, "POST");
  assert.deepEqual(JSON.parse(String(request.init.body)), {
    action: "approve",
    action_id: "acc41464-0074-47cf-a453-9a22dc62ca53",
  });
});

test("companion reject routes to companion action endpoint", () => {
  const request = resolveApprovalPostRequest("companion", "request-1", "reject");
  assert.equal(request.url, "/api/companion/actions/action");
  assert.deepEqual(JSON.parse(String(request.init.body)), {
    action: "reject",
    action_id: "request-1",
  });
});

test("trust approve routes to trust action endpoint", () => {
  const request = resolveApprovalPostRequest("trust", "trust-request-1", "approve");
  assert.equal(request.url, "/api/actions/trust-request-1/approve");
  assert.equal(request.init.method, "POST");
  assert.equal(request.init.body, undefined);
});

test("trust reject routes to trust action endpoint", () => {
  const request = resolveApprovalPostRequest("trust", "trust-request-1", "reject");
  assert.equal(request.url, "/api/actions/trust-request-1/reject");
  assert.deepEqual(JSON.parse(String(request.init.body)), {});
});

test("dedupe companion pending by request id", () => {
  const items = dedupeCompanionPendingById([
    { id: "acc41464-0074-47cf-a453-9a22dc62ca53", title: "Support case assignment request" },
    { id: "acc41464-0074-47cf-a453-9a22dc62ca53", title: "Duplicate" },
    { id: "other-id", title: "Other" },
  ]);
  assert.equal(items.length, 2);
  assert.equal(items[0]?.id, "acc41464-0074-47cf-a453-9a22dc62ca53");
});

test("companion display fields exclude metadata and payload", () => {
  const action: CompanionActionRequest = {
    id: "acc41464-0074-47cf-a453-9a22dc62ca53",
    title: "Support case assignment request",
    description: "A governed support case assignment is awaiting approval.",
    reason: "Assignment requires approval",
    risk_level: "medium",
    category: "operations",
    requested_for: "Support team",
    approval_status: "pending",
    lifecycle_status: "awaiting_approval",
    expires_at: "2026-07-04T22:34:13.778+00:00",
    expected_outcome: "Case assigned after approval",
  };
  const display = buildCompanionPendingDisplayFields(action);
  assert.equal(display.title, "Support case assignment request");
  assert.equal(display.status, "pending");
  assert.equal(companionDisplayFieldsExcludeSensitivePayload(display), true);
  assert.equal(JSON.stringify(display).includes("case_id"), false);
  assert.equal(JSON.stringify(display).includes("assignee_user_id"), false);
});
