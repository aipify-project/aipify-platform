import assert from "node:assert/strict";
import { mapServerMessagesToChat, deserializeAssistantMessage } from "./message-payload";
import { createClientMessageId, createIdempotencyKey } from "./client";
import { resolveCompanionQueueWaitPhase } from "./queue-wait-phase";

function testIdempotencyKeyStable() {
  const conversationId = "conv-123";
  const clientId = "msg-abc";
  assert.equal(createIdempotencyKey(conversationId, clientId), "conv-123:msg-abc");
}

function testDeserializeAssistantRoundTrip() {
  const payload = {
    kind: "assistant_reply" as const,
    content: "Answer text",
    directAnswer: "Answer text",
    confidence: "high" as const,
    question: "What is billing?",
    steps: ["Step one"],
  };
  const message = deserializeAssistantMessage(
    "server-1",
    "client-1",
    "Answer text",
    payload,
    1000,
  );
  assert.equal(message.role, "aipify");
  assert.equal(message.directAnswer, "Answer text");
  assert.equal(message.steps?.[0], "Step one");
}

function testMapServerMessagesOrder() {
  const mapped = mapServerMessagesToChat([
    {
      id: "u1",
      role: "user",
      content: "First",
      timestamp: 1,
    },
    {
      id: "a1",
      role: "assistant",
      content: "Reply",
      payload: { kind: "assistant_reply", directAnswer: "Reply", content: "Reply" },
      timestamp: 2,
    },
  ]);
  assert.equal(mapped.length, 2);
  assert.equal(mapped[0].role, "user");
  assert.equal(mapped[1].role, "aipify");
}

function testClientMessageIdUnique() {
  const a = createClientMessageId();
  const b = createClientMessageId();
  assert.notEqual(a, b);
}

function testQueueWaitPhaseProgression() {
  const createdAt = new Date("2026-01-01T00:00:00.000Z").toISOString();
  const base = new Date("2026-01-01T00:00:00.000Z").getTime();
  assert.equal(
    resolveCompanionQueueWaitPhase({
      status: "processing",
      createdAt,
      startedAt: createdAt,
      now: base + 5_000,
    }),
    "initial",
  );
  assert.equal(
    resolveCompanionQueueWaitPhase({
      status: "processing",
      createdAt,
      startedAt: createdAt,
      now: base + 15_000,
    }),
    "working",
  );
  assert.equal(
    resolveCompanionQueueWaitPhase({
      status: "waiting",
      createdAt,
      now: base + 35_000,
    }),
    "long_wait",
  );
}

testIdempotencyKeyStable();
testDeserializeAssistantRoundTrip();
testMapServerMessagesOrder();
testClientMessageIdUnique();
testQueueWaitPhaseProgression();

console.log("chat-queue.test.ts: all assertions passed");
