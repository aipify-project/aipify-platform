import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { BookingWriteResult } from "@/lib/integration-intelligence/booking/types";
import type { Translator } from "@/lib/i18n/translate";
import { detectBookingResumeContinuationIntent } from "./booking-resume-intent";
import { resolvePendingBookingWritePointer } from "./booking-pending-action-pointer";
import { resumeBookingWriteExecution } from "./booking-write-orchestrator";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.booking.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.booking.sourceLabel";

export type ProduceBookingResumeTurnInput = {
  supabase?: SupabaseClient;
  query: string;
  messages: readonly CompanionChatMessage[];
  t: Translator;
};

export type ProduceBookingResumeTurnDeps = {
  detect_resume_intent?: (query: string) => boolean;
  resolve_pointer?: (
    messages: readonly CompanionChatMessage[],
  ) => { actionRequestId: string } | null;
  resume_execution?: (actionRequestId: string) => Promise<BookingWriteResult>;
};

export type ProduceBookingResumeTurnResult =
  | { handled: false }
  | { handled: true; answer: PlatformKnowledgeAnswer };

function buildBookingResumeAnswer(input: {
  t: Translator;
  directAnswer: string;
  pendingBookingWrite?: { actionRequestId: string };
}): PlatformKnowledgeAnswer {
  return {
    directAnswer: input.directAnswer,
    steps: [],
    actions: [],
    sources: [
      {
        id: "booking-resume",
        label: input.t(SOURCE_LABEL_KEY),
        kind: "customer_context",
      },
    ],
    sourceId: "booking-resume",
    source: "customer_context",
    confidence: "high",
    orgConfirmEligible: false,
    showSupportEscalation: false,
    ...(input.pendingBookingWrite ? { pendingBookingWrite: input.pendingBookingWrite } : {}),
  };
}

function mapBookingResumeWriteResult(input: {
  result: BookingWriteResult;
  pointerActionRequestId: string;
  t: Translator;
}): PlatformKnowledgeAnswer {
  const { result, pointerActionRequestId, t } = input;

  if (result.outcome === "approval_required") {
    const persistedId = result.action_request_id?.trim() || null;
    if (!persistedId || persistedId !== pointerActionRequestId.trim()) {
      return buildBookingResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.failed`),
      });
    }

    return buildBookingResumeAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.approvalRequired`),
      pendingBookingWrite: { actionRequestId: persistedId },
    });
  }

  if (result.outcome === "execution_source_missing") {
    return buildBookingResumeAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.executionSourceMissing`),
    });
  }

  if (result.outcome === "executed") {
    return buildBookingResumeAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.executed`),
    });
  }

  return buildBookingResumeAnswer({
    t,
    directAnswer: t(`${OUTCOME_BASE}.failed`),
  });
}

export async function produceBookingResumeTurn(
  input: ProduceBookingResumeTurnInput,
  deps: ProduceBookingResumeTurnDeps = {},
): Promise<ProduceBookingResumeTurnResult> {
  const detectIntent = deps.detect_resume_intent ?? detectBookingResumeContinuationIntent;
  if (!detectIntent(input.query)) {
    return { handled: false };
  }

  const resolvePointer = deps.resolve_pointer ?? resolvePendingBookingWritePointer;
  const pointer = resolvePointer(input.messages);
  if (!pointer) {
    return { handled: false };
  }

  const resumeExecution =
    deps.resume_execution ??
    (input.supabase
      ? (actionRequestId: string) =>
          resumeBookingWriteExecution({
            supabase: input.supabase!,
            action_request_id: actionRequestId,
          })
      : null);

  if (!resumeExecution) {
    return { handled: false };
  }

  const result = await resumeExecution(pointer.actionRequestId);

  return {
    handled: true,
    answer: mapBookingResumeWriteResult({
      result,
      pointerActionRequestId: pointer.actionRequestId,
      t: input.t,
    }),
  };
}
