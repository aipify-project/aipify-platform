import assert from "node:assert/strict";
import { parseSupportAssistantSearch } from "@/lib/app-portal/support-assistant";
import { resolvePendingBookingWritePointer } from "@/lib/companion-runtime/booking-pending-action-pointer";
import type { CompanionExperienceLabels } from "../types";
import { buildReplyFromSearchJson } from "./build-reply";
import {
  mapServerMessagesToChat,
  deserializeAssistantMessage,
  serializeAssistantPayload,
} from "./message-payload";
import type { CompanionChatMessage } from "../types";
import { createClientMessageId, createIdempotencyKey } from "./client";
import { resolveCompanionQueueWaitPhase } from "./queue-wait-phase";

const VALID_ACTION_REQUEST_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

const stubLabels = {} as CompanionExperienceLabels;

function platformSearchJson(pendingBookingWrite: unknown) {
  return {
    found: true,
    query: "Book appointment",
    answer: {
      directAnswer: "Approval is required before booking can proceed.",
      steps: [],
      actions: [],
      sources: [],
      sourceId: "booking",
      source: "platform_corpus",
      confidence: "high",
      ...(pendingBookingWrite === undefined ? {} : { pendingBookingWrite }),
    },
  };
}

function assistantMessage(
  overrides: Partial<CompanionChatMessage> & Pick<CompanionChatMessage, "content">,
): CompanionChatMessage {
  return {
    id: "client-1",
    role: "aipify",
    directAnswer: overrides.content,
    timestamp: 1000,
    ...overrides,
  };
}

function testIdempotencyKeyStable() {
  assert.equal(createIdempotencyKey("conv-123", "msg-abc"), "conv-123:msg-abc");
}

function testDeserializeAssistantRoundTrip() {
  const message = deserializeAssistantMessage(
    "server-1",
    "client-1",
    "Answer text",
    {
      kind: "assistant_reply",
      directAnswer: "Answer text",
      confidence: "high",
      question: "What is billing?",
      steps: ["Step one"],
    },
    1000,
  );
  assert.equal(message.role, "aipify");
  assert.equal(message.directAnswer, "Answer text");
  assert.equal(message.steps?.[0], "Step one");
  assert.equal(message.pendingBookingWrite, undefined);
}

function testMapServerMessagesOrder() {
  const mapped = mapServerMessagesToChat([
    { id: "u1", role: "user", content: "First", timestamp: 1 },
    {
      id: "a1",
      role: "assistant",
      content: "Reply",
      payload: { kind: "assistant_reply", directAnswer: "Reply" },
      timestamp: 2,
    },
  ]);
  assert.equal(mapped.length, 2);
  assert.equal(mapped[0].role, "user");
  assert.equal(mapped[1].role, "aipify");
}

function testClientMessageIdUnique() {
  assert.notEqual(createClientMessageId(), createClientMessageId());
}

function testQueueWaitPhaseProgression() {
  const createdAt = new Date("2026-01-01T00:00:00.000Z").toISOString();
  const base = new Date("2026-01-01T00:00:00.000Z").getTime();
  assert.equal(
    resolveCompanionQueueWaitPhase({ status: "processing", createdAt, startedAt: createdAt, now: base + 5_000 }),
    "working",
  );
  assert.equal(
    resolveCompanionQueueWaitPhase({ status: "processing", createdAt, startedAt: createdAt, now: base + 15_000 }),
    "long_wait",
  );
  assert.equal(
    resolveCompanionQueueWaitPhase({ status: "waiting", createdAt, now: base + 35_000 }),
    "long_wait",
  );
}

function testPendingBookingWriteHandoffContract() {
  const withoutHandoff = assistantMessage({ id: "c1", content: "Ready when you are." });
  const serializedWithout = serializeAssistantPayload(withoutHandoff);
  assert.equal(serializedWithout.pending_booking_write, undefined);
  assert.equal(
    deserializeAssistantMessage("s1", "c1", withoutHandoff.content, serializedWithout, 1000)
      .pendingBookingWrite,
    undefined,
  );

  const withHandoff = assistantMessage({
    id: "c2",
    content: "Confirm booking?",
    pendingBookingWrite: { actionRequestId: VALID_ACTION_REQUEST_ID },
  });
  const serialized = serializeAssistantPayload(withHandoff);
  assert.deepEqual(serialized.pending_booking_write, { action_request_id: VALID_ACTION_REQUEST_ID });
  assert.deepEqual(Object.keys(serialized.pending_booking_write ?? {}), ["action_request_id"]);

  const roundTripped = deserializeAssistantMessage(
    "s2",
    "c2",
    withHandoff.content,
    JSON.parse(JSON.stringify(serialized)),
    2000,
  );
  assert.deepEqual(roundTripped.pendingBookingWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });

  const parsedWithExtras = deserializeAssistantMessage(
    "s3",
    "c3",
    "Confirm?",
    {
      kind: "assistant_reply",
      directAnswer: "Confirm?",
      pending_booking_write: {
        action_request_id: VALID_ACTION_REQUEST_ID,
        idempotency_key: "booking:abc",
        capability: "booking.create",
        payload: { service_id: "svc-1" },
      },
    },
    3000,
  );
  assert.deepEqual(parsedWithExtras.pendingBookingWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });
  assert.deepEqual(serializeAssistantPayload(parsedWithExtras).pending_booking_write, {
    action_request_id: VALID_ACTION_REQUEST_ID,
  });
}

function testPendingBookingWriteInvalidInputs() {
  const invalidInputs = [
    null,
    {},
    { action_request_id: "" },
    { action_request_id: "   " },
    { action_request_id: "not-a-uuid" },
    { action_request_id: NIL_UUID },
  ];

  for (const pending_booking_write of invalidInputs) {
    const parsed = deserializeAssistantMessage(
      "s-invalid",
      "c-invalid",
      "Confirm?",
      { kind: "assistant_reply", directAnswer: "Confirm?", pending_booking_write },
      4000,
    );
    assert.equal(parsed.pendingBookingWrite, undefined);
  }
}

function testPlatformAnswerPendingBookingWriteSearchToChatContract() {
  const validSearchJson = platformSearchJson({ actionRequestId: VALID_ACTION_REQUEST_ID });
  const parsed = parseSupportAssistantSearch(validSearchJson);
  assert.deepEqual(parsed.answer?.pendingBookingWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });
  assert.deepEqual(Object.keys(parsed.answer?.pendingBookingWrite ?? {}), ["actionRequestId"]);

  const built = buildReplyFromSearchJson(validSearchJson, stubLabels, "Book appointment");
  assert.deepEqual(built.message.pendingBookingWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });
  assert.deepEqual(built.payload.pending_booking_write, { action_request_id: VALID_ACTION_REQUEST_ID });
  assert.deepEqual(Object.keys(built.payload.pending_booking_write ?? {}), ["action_request_id"]);

  const roundTripped = deserializeAssistantMessage(
    "s-platform",
    "c-platform",
    built.message.content,
    JSON.parse(JSON.stringify(built.payload)),
    5000,
  );
  assert.deepEqual(roundTripped.pendingBookingWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });

  for (const actionRequestId of ["not-a-uuid", "", "   ", NIL_UUID]) {
    const invalidBuilt = buildReplyFromSearchJson(
      platformSearchJson({ actionRequestId }),
      stubLabels,
      "Book appointment",
    );
    assert.equal(invalidBuilt.message.pendingBookingWrite, undefined);
    assert.equal(invalidBuilt.payload.pending_booking_write, undefined);
  }

  const extraFieldsBuilt = buildReplyFromSearchJson(
    platformSearchJson({
      actionRequestId: VALID_ACTION_REQUEST_ID,
      idempotency_key: "booking:abc",
      capability: "booking.create",
      payload: { service_id: "svc-1" },
      organization_id: "org-1",
    }),
    stubLabels,
    "Book appointment",
  );
  assert.deepEqual(extraFieldsBuilt.message.pendingBookingWrite, {
    actionRequestId: VALID_ACTION_REQUEST_ID,
  });
  assert.deepEqual(extraFieldsBuilt.payload.pending_booking_write, {
    action_request_id: VALID_ACTION_REQUEST_ID,
  });
  assert.deepEqual(Object.keys(extraFieldsBuilt.payload.pending_booking_write ?? {}), ["action_request_id"]);

  const withoutPointer = buildReplyFromSearchJson(
    platformSearchJson(undefined),
    stubLabels,
    "General follow-up",
  );
  assert.equal(withoutPointer.message.pendingBookingWrite, undefined);
  assert.equal(withoutPointer.payload.pending_booking_write, undefined);

  const withPointer = buildReplyFromSearchJson(
    platformSearchJson({ actionRequestId: VALID_ACTION_REQUEST_ID }),
    stubLabels,
    "Book appointment",
  );
  const followUpWithoutPointer = buildReplyFromSearchJson(
    platformSearchJson(undefined),
    stubLabels,
    "Thanks",
  );
  assert.equal(
    resolvePendingBookingWritePointer([
      { id: "u1", role: "user", content: "Book", timestamp: 1 },
      { ...withPointer.message, id: "a1", timestamp: 2 },
      { id: "u2", role: "user", content: "ok", timestamp: 3 },
      { ...followUpWithoutPointer.message, id: "a2", timestamp: 4 },
    ]),
    null,
  );
}

testIdempotencyKeyStable();
testDeserializeAssistantRoundTrip();
testMapServerMessagesOrder();
testClientMessageIdUnique();
testQueueWaitPhaseProgression();
testPendingBookingWriteHandoffContract();
testPendingBookingWriteInvalidInputs();
testPlatformAnswerPendingBookingWriteSearchToChatContract();

console.log("chat-queue.test.ts: all assertions passed");
