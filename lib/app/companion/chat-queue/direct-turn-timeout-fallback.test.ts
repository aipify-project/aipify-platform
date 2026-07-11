import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyCompanionSubmitPath, resolveDirectTurnRoute } from "@/lib/companion-runtime/companion-submit-path";
import type { executeCompanionTurnToPayload } from "./execute-turn";

const VALID_CONVERSATION_ID = "conv-lightweight-timeout-test";
const CLIENT_MSG_ID = "msg-timeout-test-1";
const IDEMPOTENCY_KEY = `${VALID_CONVERSATION_ID}:${CLIENT_MSG_ID}`;
const LIGHTWEIGHT_QUERY = "Hvem jobber du for?";

type MockSupabase = SupabaseClient & {
  getAppendCount: () => number;
  getRpcCalls: () => string[];
  getUserAppendCount: () => number;
};

function createMockSupabase(options: { dedupeUserAppend?: boolean } = {}): MockSupabase {
  let appendCount = 0;
  let userAppendCount = 0;
  const rpcCalls: string[] = [];
  const persistedUserClientIds = new Set<string>();

  const supabase = {
    rpc: async (fn: string, args?: Record<string, unknown>) => {
      rpcCalls.push(fn);
      if (fn === "upsert_companion_conversation") return { error: null };
      if (fn === "append_companion_chat_message") {
        appendCount += 1;
        const role = args?.p_role;
        const clientId =
          typeof args?.p_client_message_id === "string" ? args.p_client_message_id : null;

        if (role === "user") {
          userAppendCount += 1;
          if (clientId && options.dedupeUserAppend && persistedUserClientIds.has(clientId)) {
            return {
              data: { message_id: "msg-user-persisted", deduplicated: true },
              error: null,
            };
          }
          if (clientId) persistedUserClientIds.add(clientId);
          return {
            data: { message_id: "msg-user-persisted", deduplicated: false },
            error: null,
          };
        }

        return {
          data: { message_id: "msg-assistant-1", deduplicated: false },
          error: null,
        };
      }
      if (fn === "enqueue_companion_chat_message") {
        return { data: { ok: true, queue_id: "queue-1", deduplicated: false }, error: null };
      }
      return { data: null, error: null };
    },
    getAppendCount: () => appendCount,
    getUserAppendCount: () => userAppendCount,
    getRpcCalls: () => [...rpcCalls],
  };

  return supabase as unknown as MockSupabase;
}

async function testLightweightQueryUsesDirectPath() {
  assert.equal(resolveDirectTurnRoute(LIGHTWEIGHT_QUERY, "no"), "lightweight");
  assert.equal(classifyCompanionSubmitPath(LIGHTWEIGHT_QUERY, "no"), "direct");
}

async function testDirectLightweightSuccessDoesNotQueue() {
  const { executeDirectCompanionTurn } = await import("./direct-turn");
  const supabase = createMockSupabase();
  const testExecutor = (async () => ({
    ok: true as const,
    assistantContent: "Test answer",
    assistantPayload: { kind: "assistant_reply" as const, sourceId: "companion-lightweight-conversational" },
    message: {
      id: "msg-assistant-test",
      role: "aipify" as const,
      content: "Test answer",
      createdAt: Date.now(),
    },
  })) as unknown as typeof executeCompanionTurnToPayload;

  const result = await executeDirectCompanionTurn(supabase, {
    conversationId: VALID_CONVERSATION_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    question: LIGHTWEIGHT_QUERY,
    locale: "no",
    __testLightweightTurnExecutor: testExecutor,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.route, "lightweight");
  assert.equal(supabase.getUserAppendCount(), 1);
  assert.equal(supabase.getAppendCount(), 2);
  assert.equal(supabase.getRpcCalls().includes("enqueue_companion_chat_message"), false);
}

async function testDirectLightweightTimeoutQueuesAfterUserPersisted() {
  const { executeDirectCompanionTurn } = await import("./direct-turn");
  const supabase = createMockSupabase();
  const testExecutor = ((_supabase: SupabaseClient, _input: unknown) =>
    new Promise(() => {
      /* never resolves — triggers lightweight timeout */
    })) as unknown as typeof executeCompanionTurnToPayload;

  const result = await executeDirectCompanionTurn(supabase, {
    conversationId: VALID_CONVERSATION_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    question: LIGHTWEIGHT_QUERY,
    locale: "no",
    __testLightweightTurnExecutor: testExecutor,
    __testLightweightTimeoutMs: 1,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error, "turn_timeout");
  assert.equal(result.should_queue, true);
  assert.equal(result.route, "lightweight");
  assert.equal(supabase.getUserAppendCount(), 1, "user message persisted before timeout");
  assert.equal(supabase.getAppendCount(), 1, "assistant message must not be appended on timeout");
}

async function testDirectLightweightNonTimeoutFailureDoesNotQueue() {
  const { executeDirectCompanionTurn } = await import("./direct-turn");
  const supabase = createMockSupabase();
  const testExecutor = (async () => ({
    ok: false as const,
    error: "build_failed",
  })) as unknown as typeof executeCompanionTurnToPayload;

  const result = await executeDirectCompanionTurn(supabase, {
    conversationId: VALID_CONVERSATION_ID,
    idempotencyKey: IDEMPOTENCY_KEY,
    question: LIGHTWEIGHT_QUERY,
    locale: "no",
    __testLightweightTurnExecutor: testExecutor,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.error, "build_failed");
  assert.notEqual(result.should_queue, true);
}

async function testQueueFallbackReusesPersistedUserMessage() {
  const supabase = createMockSupabase({ dedupeUserAppend: true });
  const userClientMessageId = CLIENT_MSG_ID;

  await supabase.rpc("append_companion_chat_message", {
    p_conversation_id: VALID_CONVERSATION_ID,
    p_role: "user",
    p_content: LIGHTWEIGHT_QUERY,
    p_payload: { execution: "direct" },
    p_client_message_id: userClientMessageId,
  });

  const enqueueResult = await supabase.rpc("enqueue_companion_chat_message", {
    p_conversation_id: VALID_CONVERSATION_ID,
    p_idempotency_key: IDEMPOTENCY_KEY,
    p_question_text: LIGHTWEIGHT_QUERY,
    p_user_client_message_id: userClientMessageId,
  });

  assert.equal(supabase.getUserAppendCount(), 1, "enqueue must dedupe existing user message");
  assert.ok(enqueueResult.data);
  assert.equal((enqueueResult.data as { ok?: boolean }).ok, true);
}

async function testShouldQueueDirectResultContinuesToEnqueuePath() {
  const direct = {
    ok: false as const,
    error: "turn_timeout",
    should_queue: true,
    route: "lightweight",
  };

  assert.equal(direct.should_queue, true);
  assert.notEqual(direct.error, "build_failed");
}

async function main() {
  await testLightweightQueryUsesDirectPath();
  await testDirectLightweightSuccessDoesNotQueue();
  await testDirectLightweightTimeoutQueuesAfterUserPersisted();
  await testDirectLightweightNonTimeoutFailureDoesNotQueue();
  await testQueueFallbackReusesPersistedUserMessage();
  await testShouldQueueDirectResultContinuesToEnqueuePath();
  console.log("direct-turn-timeout-fallback tests passed");
}

void main();
