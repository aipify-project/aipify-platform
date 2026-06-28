import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import { detectBookingResumeContinuationIntent } from "@/lib/companion-runtime/booking-resume-intent";
import {
  resolvePendingSupportWritePointer,
  SUPPORT_RESUME_SOURCE_ID,
  SUPPORT_RESUME_TERMINAL_CONSUMED_SOURCE_META,
} from "@/lib/companion-runtime/support-pending-action-pointer";
import {
  executeSupportAssignResume,
  type SupportAssignResumeExecutorResult,
} from "@/lib/companion-runtime/support-assign-resume-executor";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.support.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.support.sourceLabel";

export type ProduceSupportResumeTurnInput = {
  supabase: SupabaseClient;
  query: string;
  messages: readonly CompanionChatMessage[];
  t: Translator;
};

export type ProduceSupportResumeTurnDeps = {
  detect_resume_intent?: (query: string) => boolean;
  resolve_pointer?: (
    messages: readonly CompanionChatMessage[],
  ) => { actionRequestId: string } | null;
  resume_execution?: (actionRequestId: string) => Promise<SupportAssignResumeExecutorResult>;
};

export type ProduceSupportResumeTurnResult =
  | { handled: false }
  | { handled: true; answer: PlatformKnowledgeAnswer };

type SupportResumeAnswer = PlatformKnowledgeAnswer & {
  pendingSupportWrite?: { actionRequestId: string };
};

function buildSupportResumeAnswer(input: {
  t: Translator;
  directAnswer: string;
  pendingSupportWrite?: { actionRequestId: string };
  terminalConsumed?: boolean;
}): SupportResumeAnswer {
  return {
    directAnswer: input.directAnswer,
    steps: [],
    actions: [],
    sources: [
      {
        id: SUPPORT_RESUME_SOURCE_ID,
        label: input.t(SOURCE_LABEL_KEY),
        kind: "customer_context",
        ...(input.terminalConsumed
          ? { meta: SUPPORT_RESUME_TERMINAL_CONSUMED_SOURCE_META }
          : {}),
      },
    ],
    sourceId: SUPPORT_RESUME_SOURCE_ID,
    source: "customer_context",
    confidence: "high",
    orgConfirmEligible: false,
    showSupportEscalation: false,
    ...(input.pendingSupportWrite ? { pendingSupportWrite: input.pendingSupportWrite } : {}),
  };
}

function mapSupportResumeExecutorResult(input: {
  result: SupportAssignResumeExecutorResult;
  pointerActionRequestId: string;
  t: Translator;
}): SupportResumeAnswer {
  const { result, pointerActionRequestId, t } = input;

  switch (result.outcome) {
    case "executed":
    case "already_consumed":
      return buildSupportResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.executed`),
        terminalConsumed: true,
      });
    case "pending": {
      const persistedId = result.action_request_id?.trim() || null;
      if (!persistedId || persistedId !== pointerActionRequestId.trim()) {
        return buildSupportResumeAnswer({
          t,
          directAnswer: t(`${OUTCOME_BASE}.failed`),
        });
      }

      return buildSupportResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.approvalRequired`),
        pendingSupportWrite: { actionRequestId: persistedId },
      });
    }
    case "rejected":
      return buildSupportResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.blockedByPolicy`),
      });
    case "expired":
      return buildSupportResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.confirmationRequired`),
      });
    case "failed":
    case "verification_failed":
      return buildSupportResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.failed`),
      });
    case "not_found":
      return buildSupportResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.noMatch`),
      });
    default:
      return buildSupportResumeAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.failed`),
      });
  }
}

export async function produceSupportResumeTurn(
  input: ProduceSupportResumeTurnInput,
  deps: ProduceSupportResumeTurnDeps = {},
): Promise<ProduceSupportResumeTurnResult> {
  const detectIntent = deps.detect_resume_intent ?? detectBookingResumeContinuationIntent;
  if (!detectIntent(input.query)) {
    return { handled: false };
  }

  const resolvePointer =
    deps.resolve_pointer ??
    ((messages) =>
      resolvePendingSupportWritePointer(messages, {
        resumeContinuationQuery: input.query,
      }));
  const pointer = resolvePointer(input.messages);
  if (!pointer) {
    return { handled: false };
  }

  const resumeExecution =
    deps.resume_execution ??
    ((actionRequestId: string) =>
      executeSupportAssignResume(input.supabase, { action_request_id: actionRequestId }));

  const result = await resumeExecution(pointer.actionRequestId);

  return {
    handled: true,
    answer: mapSupportResumeExecutorResult({
      result,
      pointerActionRequestId: pointer.actionRequestId,
      t: input.t,
    }),
  };
}
