import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadCompanionConversationMessages } from "@/lib/app/companion/chat-queue/load-companion-conversation-messages";
import { mapServerMessagesToChat } from "@/lib/app/companion/chat-queue/message-payload";

const VALID_CONVERSATION_ID = "conv-a1b2c3d4-e5f6-4789-a012-3456789abcde";
const VALID_ACTION_REQUEST_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const supabaseStub = {} as SupabaseClient;

function buildRpcResponse(messages: unknown[], ok = true) {
  return {
    ok,
    conversation: { id: VALID_CONVERSATION_ID },
    messages,
    queue: [],
  };
}

async function testValidIdCallsRpcOnceWithCorrectParameter() {
  let callCount = 0;
  let capturedConversationId: string | null = null;

  const result = await loadCompanionConversationMessages(
    supabaseStub,
    `  ${VALID_CONVERSATION_ID}  `,
    {
      rpc: async (_client, conversationId) => {
        callCount += 1;
        capturedConversationId = conversationId;
        return {
          data: buildRpcResponse([]),
          error: null,
        };
      },
    },
  );

  assert.equal(callCount, 1);
  assert.equal(capturedConversationId, VALID_CONVERSATION_ID);
  assert.deepEqual(result, { status: "loaded", messages: [] });
}

async function testCanonicalMappingPreservesOrder() {
  const rpcPayload = buildRpcResponse([
    {
      id: "client-u1",
      server_id: "server-u1",
      role: "user",
      content: "Book appointment",
      sequence_no: 1,
      timestamp: 1000,
    },
    {
      id: "client-a1",
      server_id: "server-a1",
      role: "assistant",
      content: "Approval required.",
      payload: { kind: "assistant_reply", directAnswer: "Approval required." },
      sequence_no: 2,
      timestamp: 2000,
    },
  ]);

  const result = await loadCompanionConversationMessages(supabaseStub, VALID_CONVERSATION_ID, {
    rpc: async () => ({ data: rpcPayload, error: null }),
  });

  assert.equal(result.status, "loaded");
  if (result.status !== "loaded") return;

  assert.equal(result.messages.length, 2);
  assert.equal(result.messages[0]?.role, "user");
  assert.equal(result.messages[0]?.content, "Book appointment");
  assert.equal(result.messages[1]?.role, "aipify");
  assert.equal(result.messages[1]?.directAnswer, "Approval required.");
}

async function testPersistedBookingPointerMapsCorrectly() {
  const rpcPayload = buildRpcResponse([
    {
      id: "client-a2",
      server_id: "server-a2",
      role: "assistant",
      content: "Confirm booking?",
      payload: {
        kind: "assistant_reply",
        directAnswer: "Confirm booking?",
        pending_booking_write: { action_request_id: VALID_ACTION_REQUEST_ID },
      },
      sequence_no: 1,
      timestamp: 3000,
    },
  ]);

  const result = await loadCompanionConversationMessages(supabaseStub, VALID_CONVERSATION_ID, {
    rpc: async () => ({ data: rpcPayload, error: null }),
  });

  assert.equal(result.status, "loaded");
  if (result.status !== "loaded") return;

  assert.deepEqual(result.messages[0]?.pendingBookingWrite, {
    actionRequestId: VALID_ACTION_REQUEST_ID,
  });
  assert.equal(
    (result.messages[0] as Record<string, unknown>).pending_booking_write,
    undefined,
  );
}

async function testEmptyConversationReturnsLoadedEmptyArray() {
  const result = await loadCompanionConversationMessages(supabaseStub, VALID_CONVERSATION_ID, {
    rpc: async () => ({
      data: buildRpcResponse([]),
      error: null,
    }),
  });

  assert.deepEqual(result, { status: "loaded", messages: [] });
}

async function testInvalidConversationIdFailsWithoutRpc() {
  let callCount = 0;

  for (const conversationId of ["", "   ", "\n\t"]) {
    const result = await loadCompanionConversationMessages(supabaseStub, conversationId, {
      rpc: async () => {
        callCount += 1;
        return { data: buildRpcResponse([]), error: null };
      },
    });

    assert.deepEqual(result, { status: "failed", messages: [] });
  }

  assert.equal(callCount, 0);
}

async function testRpcErrorFailsWithoutLeakingErrorText() {
  const result = await loadCompanionConversationMessages(supabaseStub, VALID_CONVERSATION_ID, {
    rpc: async () => ({
      data: null,
      error: { message: "permission denied for function get_companion_chat_state" },
    }),
  });

  assert.deepEqual(result, { status: "failed", messages: [] });
  assert.equal(JSON.stringify(result).includes("permission denied"), false);
}

async function testInvalidResponseShapeFails() {
  const invalidResponses = [
    null,
    { ok: false, messages: [] },
    { ok: true, messages: "not-an-array" },
    { ok: true, messages: [{ id: "x", role: "assistant" }] },
  ];

  for (const data of invalidResponses) {
    const result = await loadCompanionConversationMessages(supabaseStub, VALID_CONVERSATION_ID, {
      rpc: async () => ({ data, error: null }),
    });

    assert.deepEqual(result, { status: "failed", messages: [] });
  }
}

async function testNoRawPayloadOutsideCanonicalMessage() {
  const result = await loadCompanionConversationMessages(supabaseStub, VALID_CONVERSATION_ID, {
    rpc: async () => ({
      data: buildRpcResponse([
        {
          id: "client-a3",
          server_id: "server-a3",
          role: "assistant",
          content: "Hello",
          payload: {
            kind: "assistant_reply",
            directAnswer: "Hello",
            pending_booking_write: { action_request_id: VALID_ACTION_REQUEST_ID },
            internal_secret: "must-not-leak",
          },
          sequence_no: 1,
          timestamp: 4000,
        },
      ]),
      error: null,
    }),
  });

  assert.equal(result.status, "loaded");
  if (result.status !== "loaded") return;

  const message = result.messages[0] as Record<string, unknown>;
  assert.equal(message.internal_secret, undefined);
  assert.equal(message.payload, undefined);
  assert.equal(typeof message.content, "string");
}

async function testRpcPayloadIsNotMutated() {
  const rpcPayload = buildRpcResponse([
    {
      id: "client-u2",
      server_id: "server-u2",
      role: "user",
      content: "Still waiting",
      sequence_no: 1,
      timestamp: 5000,
    },
  ]);
  const snapshot = JSON.stringify(rpcPayload);

  await loadCompanionConversationMessages(supabaseStub, VALID_CONVERSATION_ID, {
    rpc: async () => ({ data: rpcPayload, error: null }),
    mapMessages: mapServerMessagesToChat,
  });

  assert.equal(JSON.stringify(rpcPayload), snapshot);
}

async function runTests() {
  await testValidIdCallsRpcOnceWithCorrectParameter();
  await testCanonicalMappingPreservesOrder();
  await testPersistedBookingPointerMapsCorrectly();
  await testEmptyConversationReturnsLoadedEmptyArray();
  await testInvalidConversationIdFailsWithoutRpc();
  await testRpcErrorFailsWithoutLeakingErrorText();
  await testInvalidResponseShapeFails();
  await testNoRawPayloadOutsideCanonicalMessage();
  await testRpcPayloadIsNotMutated();
}

void runTests().then(() => {
  console.log("load-companion-conversation-messages.test.ts: all assertions passed");
});
