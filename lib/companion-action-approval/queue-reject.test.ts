import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGovernedRejectPayload,
  canRejectQueuedAction,
} from "./queue-reject";
import type { CompanionActionCenter, CompanionActionQueueItem } from "./types";

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
