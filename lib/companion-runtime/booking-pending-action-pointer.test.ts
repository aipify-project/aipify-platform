import assert from "node:assert/strict";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import {
  resolvePendingBookingWritePointer,
  resolvePendingBookingClarificationPointer,
  validatePendingBookingClarification,
  buildPendingBookingClarificationState,
  normalizePendingBookingClarification,
} from "@/lib/companion-runtime/booking-pending-action-pointer";

const VALID_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const OLDER_ID = "b2c3d4e5-f6a7-4890-b123-456789abcdef0";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

function assistant(
  id: string,
  content: string,
  pendingBookingWrite?: CompanionChatMessage["pendingBookingWrite"],
): CompanionChatMessage {
  return {
    id,
    role: "aipify",
    content,
    timestamp: Date.now(),
    ...(pendingBookingWrite !== undefined ? { pendingBookingWrite } : {}),
  };
}

function user(id: string, content: string): CompanionChatMessage {
  return { id, role: "user", content, timestamp: Date.now() };
}

function snapshotMessages(messages: CompanionChatMessage[]): string {
  return JSON.stringify(messages);
}

const newestAssistantHasValidPointer = resolvePendingBookingWritePointer([
  user("u1", "Book appointment"),
  assistant("a1", "Confirm booking?", { actionRequestId: VALID_ID }),
]);
assert.deepEqual(newestAssistantHasValidPointer, { actionRequestId: VALID_ID });

const userAfterAssistantKeepsPointer = resolvePendingBookingWritePointer([
  assistant("a1", "Confirm booking?", { actionRequestId: VALID_ID }),
  user("u2", "ja"),
]);
assert.deepEqual(userAfterAssistantKeepsPointer, { actionRequestId: VALID_ID });

const staleOlderPointerIgnored = resolvePendingBookingWritePointer([
  assistant("a1", "Earlier", { actionRequestId: OLDER_ID }),
  assistant("a2", "Follow-up without pointer"),
  user("u3", "ok"),
]);
assert.equal(staleOlderPointerIgnored, null);

const explicitNullPointer = resolvePendingBookingWritePointer([
  assistant("a1", "Cancelled handoff", { actionRequestId: VALID_ID }),
  assistant("a2", "No pending action", null),
]);
assert.equal(explicitNullPointer, null);

const invalidUuidCases = ["not-a-uuid", "", "   ", NIL_UUID];
for (const actionRequestId of invalidUuidCases) {
  assert.equal(
    resolvePendingBookingWritePointer([
      assistant("a-invalid", "Confirm?", { actionRequestId }),
    ]),
    null,
    `expected null for ${JSON.stringify(actionRequestId)}`,
  );
}

const textUuidIgnored = resolvePendingBookingWritePointer([
  assistant("a-text", `Please confirm ${VALID_ID}`, undefined),
]);
assert.equal(textUuidIgnored, null);

const noAssistantMessages = resolvePendingBookingWritePointer([
  user("u1", "Hello"),
  user("u2", "Still waiting"),
]);
assert.equal(noAssistantMessages, null);

const immutableInput = [
  assistant("a1", "Confirm?", { actionRequestId: VALID_ID }),
  user("u1", "ja"),
];
const before = snapshotMessages(immutableInput);
assert.deepEqual(resolvePendingBookingWritePointer(immutableInput), { actionRequestId: VALID_ID });
assert.equal(snapshotMessages(immutableInput), before);

const clarification = buildPendingBookingClarificationState({
  organizationId: "org-1",
  conversationId: "conv-1",
  customerReference: "P112",
  missingFields: ["service_missing"],
  now: new Date("2026-06-27T05:00:00.000Z"),
});

assert.deepEqual(
  resolvePendingBookingClarificationPointer([
    user("u1", "Book"),
    assistant("a1", "Need details"),
  ]),
  null,
);

const withClarification = resolvePendingBookingClarificationPointer([
  user("u1", "Book"),
  {
    ...assistant("a1", "Need details"),
    pendingBookingClarification: clarification,
  },
  user("u2", "follow up"),
]);
assert.deepEqual(withClarification?.customerReference, "P112");

const turn1Clarification = buildPendingBookingClarificationState({
  organizationId: "org-1",
  conversationId: "conv-1",
  serviceLabel: "Consultation",
  missingFields: ["employee_missing"],
  now: new Date("2026-06-27T05:00:00.000Z"),
});

const turn2ConfirmationState = buildPendingBookingClarificationState({
  organizationId: "org-1",
  conversationId: "conv-1",
  serviceLabel: "Consultation",
  resourceName: "Provider A",
  customerReference: "customer-123",
  slotStartAt: "2026-06-29T08:00:00.000Z",
  missingFields: [],
  now: new Date("2026-06-27T05:00:00.000Z"),
});

assert.deepEqual(
  resolvePendingBookingClarificationPointer([
    user("u1", "Turn 1"),
    { ...assistant("a1", "clarify"), pendingBookingClarification: turn1Clarification },
    user("u2", "Turn 2"),
    { ...assistant("a2", "confirm"), pendingBookingClarification: turn2ConfirmationState },
  ])?.missingFields,
  [],
);

assert.deepEqual(
  resolvePendingBookingClarificationPointer([
    user("u1", "Turn 1"),
    { ...assistant("a1", "clarify"), pendingBookingClarification: turn1Clarification },
    user("u2", "Turn 2"),
    assistant("a2", "confirm"),
  ]),
  null,
);

const emptyMissingFieldsClarification = buildPendingBookingClarificationState({
  organizationId: "org-1",
  conversationId: "conv-1",
  serviceLabel: "Consultation",
  resourceName: "Provider A",
  customerReference: "customer-123",
  slotStartAt: "2026-06-29T08:00:00.000Z",
  missingFields: [],
  now: new Date("2026-06-27T05:00:00.000Z"),
});

assert.deepEqual(
  normalizePendingBookingClarification({
    clarification_id: emptyMissingFieldsClarification.clarificationId,
    capability_key: "booking.create",
    organization_id: "org-1",
    conversation_id: "conv-1",
    service_label: "Consultation",
    resource_name: "Provider A",
    customer_reference: "customer-123",
    slot_start_at: "2026-06-29T08:00:00.000Z",
    missing_fields: [],
    expires_at: emptyMissingFieldsClarification.expiresAt,
  })?.missingFields,
  [],
);

assert.ok(
  validatePendingBookingClarification({
    state: emptyMissingFieldsClarification,
    conversationId: "conv-1",
    organizationId: "org-1",
    now: new Date("2026-06-27T05:00:00.000Z"),
  }),
);

assert.equal(
  validatePendingBookingClarification({
    state: clarification,
    conversationId: "conv-other",
    organizationId: "org-1",
  }),
  null,
);

assert.equal(
  validatePendingBookingClarification({
    state: clarification,
    conversationId: "conv-1",
    organizationId: "org-other",
  }),
  null,
);

assert.equal(
  validatePendingBookingClarification({
    state: clarification,
    conversationId: "conv-1",
    organizationId: "org-1",
    now: new Date("2026-06-27T06:00:00.000Z"),
  }),
  null,
);

assert.equal(
  normalizePendingBookingClarification({
    clarification_id: NIL_UUID,
    capability_key: "booking.create",
    organization_id: "org-1",
    conversation_id: "conv-1",
    expires_at: clarification.expiresAt,
    missing_fields: ["service_missing"],
  }),
  null,
);

console.log("booking-pending-action-pointer.test.ts: all assertions passed");
