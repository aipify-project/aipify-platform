import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { BookingCapabilityKey } from "@/lib/integration-intelligence/booking/types";
import type { Translator } from "@/lib/i18n/translate";
import { loadCompanionConversationMessages } from "@/lib/app/companion/chat-queue/load-companion-conversation-messages";
import { produceBookingResumeTurn } from "@/lib/companion-runtime/booking-resume-turn-producer";
import { resolvePendingBookingWritePointer } from "@/lib/companion-runtime/booking-pending-action-pointer";
import { detectBookingResumeContinuationIntent } from "@/lib/companion-runtime/booking-resume-intent";
import { isBookingWriteSourceConnected } from "@/lib/integration-intelligence/providers/appointment-booking/booking-source-map";

const VALID_CONVERSATION_ID = "conv-a1b2c3d4-e5f6-4789-a012-3456789abcde";
const VALID_ACTION_REQUEST_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const RESUME_QUERY = "yes confirm";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.booking.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.booking.sourceLabel";

const TRANSLATIONS: Record<string, string> = {
  [`${OUTCOME_BASE}.approvalRequired`]: "Approval still pending",
  [`${OUTCOME_BASE}.executionSourceMissing`]: "Approved but source missing",
  [`${OUTCOME_BASE}.executed`]: "Booking completed",
  [`${OUTCOME_BASE}.failed`]: "Could not complete booking",
  [SOURCE_LABEL_KEY]: "Services & appointment booking",
};

const t: Translator = (key) => TRANSLATIONS[key] ?? key;

const FORBIDDEN_ANSWER_FRAGMENTS = [
  "payload_hash",
  "idempotency_key",
  "capability_key",
  "organization_id",
  "tenant_id",
  "action_request_id",
  '"payload"',
  "service_id",
  "permission denied",
  "get_companion_",
  "execute_apt610",
  "Supabase",
  "abc123def4567890abc123def4567890abc123def4567890abc123def4567890",
  "booking:idem-",
] as const;

const EXECUTION_RPC = "execute_apt610_companion_booking_write";

type RpcCall = {
  name: string;
  params: Record<string, unknown>;
};

type ApprovedCapabilityCase = {
  capability: BookingCapabilityKey;
  requestedAction: "create" | "update" | "cancel";
};

function buildChatStateRpcResponse(actionRequestId: string) {
  return {
    ok: true,
    conversation: { id: VALID_CONVERSATION_ID },
    messages: [
      {
        id: "client-a1",
        server_id: "server-a1",
        role: "assistant",
        content: "Confirm booking?",
        payload: {
          kind: "assistant_reply",
          directAnswer: "Confirm booking?",
          pending_booking_write: { action_request_id: actionRequestId },
        },
        sequence_no: 1,
        timestamp: 3000,
      },
    ],
    queue: [],
  };
}

function baseApprovalRow(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    outcome_code: "BOOKING_ACTION_REQUEST_FOUND",
    action_request_id: VALID_ACTION_REQUEST_ID,
    action_key: "booking.create",
    approval_status: "approved",
    lifecycle_status: "approved",
    execution_status: "queued",
    capability_key: "booking.create",
    provider_key: "appointment_booking",
    requested_action: "create",
    payload_hash: "abc123def4567890abc123def4567890abc123def4567890abc123def4567890",
    idempotency_key: "booking:idem-123456789012345678901234567890123456789012345678901234",
    expires_at: "2026-07-01T12:00:00.000Z",
    expired: false,
    consumed: false,
    payload: { service_id: "svc-1", start_at: "2026-06-24T09:00:00.000Z" },
    ...overrides,
  };
}

function approvedRowForCapability(input: ApprovedCapabilityCase) {
  return baseApprovalRow({
    action_key: input.capability,
    capability_key: input.capability,
    requested_action: input.requestedAction,
  });
}

function createAuthenticatedSupabaseStub(input: {
  approvalRow: unknown;
  approvalError?: { message: string } | null;
}) {
  const rpcCalls: RpcCall[] = [];

  const supabase = {
    rpc(name: string, params?: Record<string, unknown>) {
      const callParams = params ?? {};
      rpcCalls.push({ name, params: callParams });

      if (name === "get_companion_chat_state") {
        assert.equal(callParams.p_conversation_id, VALID_CONVERSATION_ID);
        return Promise.resolve({
          data: buildChatStateRpcResponse(VALID_ACTION_REQUEST_ID),
          error: null,
        });
      }

      if (name === "get_companion_booking_action_request") {
        assert.deepEqual(callParams, { p_action_request_id: VALID_ACTION_REQUEST_ID });
        return Promise.resolve({
          data: input.approvalRow,
          error: input.approvalError ?? null,
        });
      }

      throw new Error(`unexpected RPC: ${name}`);
    },
  } as unknown as SupabaseClient;

  return { supabase, rpcCalls };
}

function assertNoSensitiveAnswerFields(answer: PlatformKnowledgeAnswer) {
  const serialized = JSON.stringify(answer);
  for (const forbidden of FORBIDDEN_ANSWER_FRAGMENTS) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
}

function assertNoExecutionOrAdapterRpc(rpcCalls: readonly RpcCall[]) {
  assert.equal(
    rpcCalls.some((call) => call.name === EXECUTION_RPC),
    false,
  );
}

function assertRpcOrder(rpcCalls: readonly RpcCall[]) {
  assert.deepEqual(
    rpcCalls.map((call) => call.name),
    ["get_companion_chat_state", "get_companion_booking_action_request"],
  );
}

async function runCertifiedResumeChain(input: {
  approvalRow: unknown;
  approvalError?: { message: string } | null;
  query?: string;
}) {
  const { supabase, rpcCalls } = createAuthenticatedSupabaseStub({
    approvalRow: input.approvalRow,
    approvalError: input.approvalError,
  });
  const query = input.query ?? RESUME_QUERY;

  assert.equal(detectBookingResumeContinuationIntent(query), true);

  const loaded = await loadCompanionConversationMessages(supabase, VALID_CONVERSATION_ID);
  assert.deepEqual(loaded.status, "loaded");
  if (loaded.status !== "loaded") {
    throw new Error("expected loaded history");
  }

  const pointer = resolvePendingBookingWritePointer(loaded.messages);
  assert.deepEqual(pointer, { actionRequestId: VALID_ACTION_REQUEST_ID });

  const producerResult = await produceBookingResumeTurn({
    supabase,
    query,
    messages: loaded.messages,
    t,
  });

  return { loaded, producerResult, rpcCalls };
}

async function runTests() {
  for (const capabilityCase of [
    { capability: "booking.create", requestedAction: "create" },
    { capability: "booking.update", requestedAction: "update" },
    { capability: "booking.cancel", requestedAction: "cancel" },
  ] as const satisfies readonly ApprovedCapabilityCase[]) {
    assert.equal(isBookingWriteSourceConnected(capabilityCase.capability), false, capabilityCase.capability);

    const { producerResult, rpcCalls } = await runCertifiedResumeChain({
      approvalRow: approvedRowForCapability(capabilityCase),
    });

    assert.equal(producerResult.handled, true, capabilityCase.capability);
    if (!producerResult.handled) continue;

    assert.equal(
      producerResult.answer.directAnswer,
      TRANSLATIONS[`${OUTCOME_BASE}.executionSourceMissing`],
      capabilityCase.capability,
    );
    assert.equal(producerResult.answer.pendingBookingWrite, undefined, capabilityCase.capability);
    assert.equal(rpcCalls.length, 2, capabilityCase.capability);
    assertRpcOrder(rpcCalls);
    assertNoExecutionOrAdapterRpc(rpcCalls);
    assertNoSensitiveAnswerFields(producerResult.answer);
  }

  {
    const { producerResult, rpcCalls } = await runCertifiedResumeChain({
      approvalRow: baseApprovalRow({
        approval_status: "pending",
        lifecycle_status: "requested",
        execution_status: "queued",
      }),
    });

    assert.equal(producerResult.handled, true);
    if (!producerResult.handled) return;

    assert.equal(producerResult.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.approvalRequired`]);
    assert.deepEqual(producerResult.answer.pendingBookingWrite, {
      actionRequestId: VALID_ACTION_REQUEST_ID,
    });
    assert.equal(rpcCalls.length, 2);
    assertRpcOrder(rpcCalls);
    assertNoExecutionOrAdapterRpc(rpcCalls);
    assertNoSensitiveAnswerFields(producerResult.answer);
  }

  {
    const { producerResult, rpcCalls } = await runCertifiedResumeChain({
      approvalRow: baseApprovalRow({
        action_key: "booking.update",
        capability_key: "booking.create",
        requested_action: "update",
      }),
    });

    assert.equal(producerResult.handled, true);
    if (!producerResult.handled) return;

    assert.equal(producerResult.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.failed`]);
    assert.equal(producerResult.answer.pendingBookingWrite, undefined);
    assert.equal(rpcCalls.length, 2);
    assertRpcOrder(rpcCalls);
    assertNoExecutionOrAdapterRpc(rpcCalls);
    assert.equal(JSON.stringify(producerResult.answer).includes("verification"), false);
    assertNoSensitiveAnswerFields(producerResult.answer);
  }

  {
    const { supabase, rpcCalls } = createAuthenticatedSupabaseStub({
      approvalRow: approvedRowForCapability({ capability: "booking.create", requestedAction: "create" }),
    });

    let unexpectedRpc = false;
    try {
      await supabase.rpc(EXECUTION_RPC, { p_action_request_id: VALID_ACTION_REQUEST_ID });
    } catch {
      unexpectedRpc = true;
    }
    assert.equal(unexpectedRpc, true);
    assert.equal(rpcCalls.length, 1);
    assert.equal(rpcCalls[0]?.name, EXECUTION_RPC);
  }
}

void runTests()
  .then(() => {
    console.log("booking-resume-runtime-chain.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
