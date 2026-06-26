import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { BookingWriteOutcome, BookingWriteResult } from "@/lib/integration-intelligence/booking/types";
import type { Translator } from "@/lib/i18n/translate";
import { produceBookingResumeTurn } from "@/lib/companion-runtime/booking-resume-turn-producer";
import { resolvePendingBookingWritePointer } from "@/lib/companion-runtime/booking-pending-action-pointer";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.booking.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.booking.sourceLabel";
const POINTER_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const OTHER_ID = "b2c3d4e5-f6a7-4890-b123-456789abcdef0";
const supabaseStub = {} as SupabaseClient;

const TRANSLATIONS: Record<string, string> = {
  [`${OUTCOME_BASE}.approvalRequired`]: "Approval still pending",
  [`${OUTCOME_BASE}.executionSourceMissing`]: "Approved but source missing",
  [`${OUTCOME_BASE}.executed`]: "Booking completed",
  [`${OUTCOME_BASE}.failed`]: "Could not complete booking",
  [SOURCE_LABEL_KEY]: "Services & appointment booking",
};

const t: Translator = (key) => TRANSLATIONS[key] ?? key;

const messagesWithPointer: readonly CompanionChatMessage[] = [
  {
    id: "a1",
    role: "aipify",
    content: "Confirm booking?",
    timestamp: 1,
    pendingBookingWrite: { actionRequestId: POINTER_ID },
  },
  { id: "u1", role: "user", content: "ja", timestamp: 2 },
];

const messagesWithoutPointer: readonly CompanionChatMessage[] = [
  { id: "u1", role: "user", content: "Book appointment", timestamp: 1 },
];

function writeResult(
  outcome: BookingWriteOutcome,
  overrides: Partial<BookingWriteResult> = {},
): BookingWriteResult {
  return {
    outcome,
    proposal: null,
    booking: null,
    outcome_key: null,
    audit_id: null,
    limitations: [],
    action_request_id: null,
    payload_hash: "secret-hash",
    idempotency_key: "secret-idem",
    expires_at: "2099-01-01T00:00:00.000Z",
    idempotent_replay: false,
    outcome_code: "INTERNAL_ERROR",
    appointment_id: null,
    appointment_key: null,
    previous_status: null,
    current_status: null,
    execution_starts_at: null,
    execution_ends_at: null,
    write_audit_id: null,
    channel_key: null,
    ...overrides,
  };
}

function assertLegacyAnswer(answer: PlatformKnowledgeAnswer) {
  assert.equal(typeof answer.directAnswer, "string");
  assert.ok(Array.isArray(answer.steps));
  assert.ok(Array.isArray(answer.actions));
  assert.ok(Array.isArray(answer.sources));
  assert.equal(answer.sourceId, "booking-resume");
  assert.equal(answer.source, "customer_context");
  assert.equal(answer.confidence, "high");
}

function assertNoSensitiveFields(answer: PlatformKnowledgeAnswer) {
  const serialized = JSON.stringify(answer);
  for (const forbidden of [
    "payload_hash",
    "idempotency_key",
    "expires_at",
    "capability_key",
    "organization_id",
    "tenant_id",
    "action_request_id",
    "INTERNAL_ERROR",
    "secret-hash",
    "secret-idem",
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
}

async function runCase(input: {
  query: string;
  messages?: readonly CompanionChatMessage[];
  supabase?: SupabaseClient;
  resumeResult?: BookingWriteResult;
  detectIntent?: (query: string) => boolean;
  resolvePointer?: (messages: readonly CompanionChatMessage[]) => { actionRequestId: string } | null;
}) {
  let resumeCalls = 0;
  let resumeLastId: string | null = null;
  let pointerCalls = 0;

  const result = await produceBookingResumeTurn(
    {
      supabase: input.supabase,
      query: input.query,
      messages: input.messages ?? messagesWithPointer,
      t,
    },
    {
      detect_resume_intent: input.detectIntent,
      resolve_pointer: input.resolvePointer
        ? input.resolvePointer
        : (messages) => {
            pointerCalls += 1;
            return resolvePendingBookingWritePointer(messages);
          },
      resume_execution: input.resumeResult
        ? async (actionRequestId) => {
            resumeCalls += 1;
            resumeLastId = actionRequestId;
            return input.resumeResult!;
          }
        : undefined,
    },
  );

  return { result, resumeCalls, resumeLastId, pointerCalls };
}

async function runTests() {
  {
    const { result, resumeCalls, pointerCalls } = await runCase({
      query: "What is my schedule tomorrow?",
      detectIntent: () => false,
      resumeResult: writeResult("executed"),
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(resumeCalls, 0);
    assert.equal(pointerCalls, 0);
  }

  {
    const { result, resumeCalls } = await runCase({
      query: "ja",
      messages: messagesWithoutPointer,
      resumeResult: writeResult("executed"),
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(resumeCalls, 0);
  }

  {
    const { result, resumeCalls } = await runCase({
      query: "ja",
      resumeResult: writeResult("approval_required", { action_request_id: POINTER_ID }),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.approvalRequired`]);
    assert.deepEqual(result.answer.pendingBookingWrite, { actionRequestId: POINTER_ID });
    assert.equal(resumeCalls, 1);
    assertLegacyAnswer(result.answer);
    assertNoSensitiveFields(result.answer);
  }

  {
    const { result } = await runCase({
      query: "confirm",
      resumeResult: writeResult("approval_required", { action_request_id: OTHER_ID }),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.answer.pendingBookingWrite, undefined);
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.failed`]);
  }

  {
    const { result } = await runCase({
      query: "yes",
      resumeResult: writeResult("execution_source_missing", { action_request_id: POINTER_ID }),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.executionSourceMissing`]);
    assert.equal(result.answer.pendingBookingWrite, undefined);
  }

  for (const outcome of [
    "failed",
    "confirmation_required",
    "blocked_by_policy",
    "permission_denied",
  ] as const) {
    const { result } = await runCase({
      query: "continue",
      resumeResult: writeResult(outcome, {
        action_request_id: POINTER_ID,
        outcome_code: "OVERLAP_CONFLICT",
      }),
    });
    assert.equal(result.handled, true, outcome);
    if (!result.handled) return;
    assert.equal(result.answer.pendingBookingWrite, undefined, outcome);
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.failed`], outcome);
    assert.equal(result.answer.directAnswer.includes("OVERLAP"), false, outcome);
  }

  {
    const { result } = await runCase({
      query: "proceed",
      resumeResult: writeResult("executed", {
        action_request_id: POINTER_ID,
        outcome_code: "BOOKING_CREATED",
      }),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.executed`]);
    assert.equal(result.answer.pendingBookingWrite, undefined);
    assert.equal(JSON.stringify(result.answer).includes("BOOKING_CREATED"), false);
  }

  {
    const tracker = { resumeCalls: 0, lastId: null as string | null };
    await produceBookingResumeTurn(
      { supabase: supabaseStub, query: "bekreft", messages: messagesWithPointer, t },
      {
        resume_execution: async (actionRequestId) => {
          tracker.resumeCalls += 1;
          tracker.lastId = actionRequestId;
          return writeResult("executed", { action_request_id: actionRequestId });
        },
      },
    );
    assert.equal(tracker.resumeCalls, 1);
    assert.equal(tracker.lastId, POINTER_ID);
  }

  {
    const snapshot = JSON.stringify(messagesWithPointer);
    await runCase({
      query: "ja",
      resumeResult: writeResult("approval_required", { action_request_id: POINTER_ID }),
    });
    assert.equal(JSON.stringify(messagesWithPointer), snapshot);
  }

  {
    const result = await produceBookingResumeTurn({
      query: "yes",
      messages: messagesWithPointer,
      t,
    });
    assert.deepEqual(result, { handled: false });
  }

  {
    const { result, pointerCalls } = await runCase({
      query: "schedule question",
      detectIntent: () => false,
      resolvePointer: () => {
        throw new Error("pointer must not run");
      },
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(pointerCalls, 0);
  }
}

void runTests().then(() => {
  console.log("booking-resume-turn-producer.test.ts: all assertions passed");
});
