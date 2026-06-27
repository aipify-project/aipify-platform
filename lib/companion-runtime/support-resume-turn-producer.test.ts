import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import { produceBookingResumeTurn } from "@/lib/companion-runtime/booking-resume-turn-producer";
import { resolvePendingSupportWritePointer } from "@/lib/companion-runtime/support-pending-action-pointer";
import type { SupportAssignResumeExecutorResult } from "@/lib/companion-runtime/support-assign-resume-executor";
import { produceSupportResumeTurn } from "@/lib/companion-runtime/support-resume-turn-producer";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.support.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.support.sourceLabel";
const BOOKING_OUTCOME_BASE = "customerApp.companionPlatformKnowledge.booking.outcomes";
const BOOKING_SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.booking.sourceLabel";

const POINTER_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const OTHER_ID = "b2c3d4e5-f6a7-4890-b123-4567890abcde";
const RECEIPT_ID = "d1d2e3f4-a5b6-4789-a012-3456789abcde";
const supabaseStub = {} as SupabaseClient;

const TRANSLATIONS: Record<string, string> = {
  [`${OUTCOME_BASE}.executed`]: "Support assignment completed",
  [`${OUTCOME_BASE}.approvalRequired`]: "Support approval still pending",
  [`${OUTCOME_BASE}.blockedByPolicy`]: "Support action was rejected",
  [`${OUTCOME_BASE}.confirmationRequired`]: "Support approval expired",
  [`${OUTCOME_BASE}.failed`]: "Could not complete support action",
  [`${OUTCOME_BASE}.noMatch`]: "Support action is no longer available",
  [SOURCE_LABEL_KEY]: "Support operations",
  [`${BOOKING_OUTCOME_BASE}.executed`]: "Booking completed",
  [`${BOOKING_OUTCOME_BASE}.approvalRequired`]: "Approval still pending",
  [BOOKING_SOURCE_LABEL_KEY]: "Services & appointment booking",
};

const t: Translator = (key) => TRANSLATIONS[key] ?? key;

const messagesWithPointer: readonly CompanionChatMessage[] = [
  {
    id: "a1",
    role: "aipify",
    content: "Confirm assignment?",
    timestamp: 1,
    pendingSupportWrite: { actionRequestId: POINTER_ID },
  },
  { id: "u1", role: "user", content: "ja", timestamp: 2 },
];

const messagesWithoutPointer: readonly CompanionChatMessage[] = [
  { id: "u1", role: "user", content: "Assign this case", timestamp: 1 },
];

function executorResult(
  outcome: SupportAssignResumeExecutorResult["outcome"],
  overrides: Partial<SupportAssignResumeExecutorResult> = {},
): SupportAssignResumeExecutorResult {
  return {
    outcome,
    action_request_id: POINTER_ID,
    receipt_id: outcome === "executed" || outcome === "already_consumed" ? RECEIPT_ID : null,
    idempotent_replay: outcome === "already_consumed",
    ...overrides,
  };
}

function assertLegacyAnswer(answer: PlatformKnowledgeAnswer) {
  assert.equal(typeof answer.directAnswer, "string");
  assert.ok(Array.isArray(answer.steps));
  assert.ok(Array.isArray(answer.actions));
  assert.ok(Array.isArray(answer.sources));
  assert.equal(answer.sourceId, "support-resume");
  assert.equal(answer.source, "customer_context");
  assert.equal(answer.confidence, "high");
}

function assertNoSensitiveFields(answer: PlatformKnowledgeAnswer) {
  const serialized = JSON.stringify(answer);
  for (const forbidden of [
    "receipt_id",
    "case_id",
    "assignee_user_id",
    "payload_hash",
    "idempotency_key",
    "action_request_id",
    "WRITE_FAILED",
    "APPROVAL_INVALID",
    "permission denied",
    RECEIPT_ID,
    "customer@example.com",
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
}

function getPendingSupportWrite(answer: PlatformKnowledgeAnswer) {
  return (answer as PlatformKnowledgeAnswer & {
    pendingSupportWrite?: { actionRequestId: string };
  }).pendingSupportWrite;
}

async function runCase(input: {
  query: string;
  messages?: readonly CompanionChatMessage[];
  resumeResult?: SupportAssignResumeExecutorResult;
  detectIntent?: (query: string) => boolean;
  resolvePointer?: (messages: readonly CompanionChatMessage[]) => { actionRequestId: string } | null;
}) {
  let resumeCalls = 0;
  let resumeLastId: string | null = null;
  let pointerCalls = 0;

  const result = await produceSupportResumeTurn(
    {
      supabase: supabaseStub,
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
            return resolvePendingSupportWritePointer(messages);
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
      query: "What is the queue status?",
      detectIntent: () => false,
      resumeResult: executorResult("executed"),
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(resumeCalls, 0);
    assert.equal(pointerCalls, 0);
  }

  {
    const { result, resumeCalls } = await runCase({
      query: "ja",
      messages: messagesWithoutPointer,
      resumeResult: executorResult("executed"),
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(resumeCalls, 0);
  }

  {
    const { result, resumeCalls } = await runCase({
      query: "nei",
      resumeResult: executorResult("executed"),
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(resumeCalls, 0);
  }

  {
    const { result, resumeCalls, resumeLastId } = await runCase({
      query: "fortsett",
      resumeResult: executorResult("executed"),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.executed`]);
    assert.equal(getPendingSupportWrite(result.answer), undefined);
    assert.equal(resumeCalls, 1);
    assert.equal(resumeLastId, POINTER_ID);
    assertLegacyAnswer(result.answer);
    assertNoSensitiveFields(result.answer);
  }

  for (const query of ["ja", "utfør", "continue", "yes"]) {
    const { result, resumeCalls } = await runCase({
      query,
      resumeResult: executorResult("already_consumed"),
    });
    assert.equal(result.handled, true, query);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.executed`], query);
    assert.equal(getPendingSupportWrite(result.answer), undefined, query);
    assert.equal(resumeCalls, 1, query);
  }

  {
    const { result } = await runCase({
      query: "ja",
      resumeResult: executorResult("pending"),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.approvalRequired`]);
    assert.deepEqual(getPendingSupportWrite(result.answer), { actionRequestId: POINTER_ID });
  }

  {
    const { result } = await runCase({
      query: "confirm",
      resumeResult: executorResult("pending", { action_request_id: OTHER_ID }),
    });
    assert.equal(result.handled, true);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.failed`]);
    assert.equal(getPendingSupportWrite(result.answer), undefined);
  }

  for (const [outcome, expectedAnswer] of [
    ["rejected", `${OUTCOME_BASE}.blockedByPolicy`],
    ["expired", `${OUTCOME_BASE}.confirmationRequired`],
    ["failed", `${OUTCOME_BASE}.failed`],
    ["not_found", `${OUTCOME_BASE}.noMatch`],
    ["verification_failed", `${OUTCOME_BASE}.failed`],
  ] as const) {
    const { result } = await runCase({
      query: "proceed",
      resumeResult: executorResult(outcome, {
        action_request_id: outcome === "not_found" ? null : POINTER_ID,
      }),
    });
    assert.equal(result.handled, true, outcome);
    if (!result.handled) return;
    assert.equal(result.answer.directAnswer, TRANSLATIONS[expectedAnswer], outcome);
    assert.equal(getPendingSupportWrite(result.answer), undefined, outcome);
    assertNoSensitiveFields(result.answer);
  }

  {
    const messages: readonly CompanionChatMessage[] = [
      {
        id: "a-old",
        role: "aipify",
        content: "Earlier assignment",
        timestamp: 1,
        pendingSupportWrite: { actionRequestId: OTHER_ID },
      },
      {
        id: "a-new",
        role: "aipify",
        content: "Follow-up without pointer",
        timestamp: 2,
      },
      { id: "u1", role: "user", content: "ja", timestamp: 3 },
    ];
    const { result, resumeCalls } = await runCase({
      query: "ja",
      messages,
      resumeResult: executorResult("executed"),
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(resumeCalls, 0);
  }

  {
    const snapshot = JSON.stringify(messagesWithPointer);
    await runCase({
      query: "ja",
      resumeResult: executorResult("pending"),
    });
    assert.equal(JSON.stringify(messagesWithPointer), snapshot);
  }

  {
    const { result, pointerCalls } = await runCase({
      query: "random question",
      detectIntent: () => false,
      resolvePointer: () => {
        throw new Error("pointer must not run");
      },
    });
    assert.deepEqual(result, { handled: false });
    assert.equal(pointerCalls, 0);
  }

  {
    const bookingMessages: readonly CompanionChatMessage[] = [
      {
        id: "a-booking",
        role: "aipify",
        content: "Confirm booking?",
        timestamp: 1,
        pendingBookingWrite: { actionRequestId: OTHER_ID },
      },
      { id: "u1", role: "user", content: "bekreft", timestamp: 2 },
    ];
    let bookingResumeCalls = 0;
    let bookingLastId: string | null = null;
    const bookingResult = await produceBookingResumeTurn(
      { supabase: supabaseStub, query: "bekreft", messages: bookingMessages, t },
      {
        resume_execution: async (actionRequestId) => {
          bookingResumeCalls += 1;
          bookingLastId = actionRequestId;
          return {
            outcome: "executed",
            proposal: null,
            booking: null,
            outcome_key: null,
            audit_id: null,
            limitations: [],
            action_request_id: actionRequestId,
            payload_hash: null,
            idempotency_key: null,
            expires_at: null,
            idempotent_replay: false,
            outcome_code: "BOOKING_CREATED",
            appointment_id: null,
            appointment_key: null,
            previous_status: null,
            current_status: null,
            execution_starts_at: null,
            execution_ends_at: null,
            write_audit_id: null,
            channel_key: null,
          };
        },
      },
    );
    assert.equal(bookingResult.handled, true);
    assert.equal(bookingResumeCalls, 1);
    assert.equal(bookingLastId, OTHER_ID);
  }
}

runTests()
  .then(() => {
    console.log("support-resume-turn-producer.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
