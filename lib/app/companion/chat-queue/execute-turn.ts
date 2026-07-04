import {
  answerToLegacyArticle,
} from "@/lib/companion-platform-knowledge/answer-builder";
import { resolveAnswerLocale } from "@/lib/companion-platform-knowledge/language";
import {
  buildSupportAssistantCorpus,
  buildSupportAssistantLabels,
} from "@/lib/app-portal/support-assistant";
import { classifyExternalProviderHandoffFromRegistry } from "@/lib/integration-intelligence/external-applications/handoff-bridge";
import { assertCanvaHandoffPermissionForRole } from "@/lib/integration-intelligence/providers/canva/permissions";
import {
  companionDictionarySplitsForTurnRoute,
  companionDirectTurnDictionarySplits,
} from "@/lib/companion-runtime/companion-oaa-dictionary-splits";
import { hasSupportAssignIntent } from "@/lib/companion-runtime/support-proposal-turn-producer";
import { resolveSupportSemanticIntent } from "@/lib/companion-runtime/support-semantic-intent";
import { createTranslator } from "@/lib/i18n/translate";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { UserRole } from "@/lib/tenant/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  resolveCompanionOrganizationState,
  shouldDeferLightweightConversationalAnswer,
} from "@/lib/companion/enrichment/companion-response-enrichment";
import { buildEnrichedReplyFromSearchJson } from "./build-reply-from-search-json";
import type { CompanionChatMessage, CompanionExperienceLabels } from "../types";
import type { WorkerExecutionProfile } from "./load-worker-profile";
import {
  formatBootstrapErrorMessage,
  type WorkerBootstrapFailure,
} from "@/lib/companion-runtime/companion-worker-bootstrap-errors";
import { logCompanionWorkerStepTimings } from "./worker-step-timing";
import {
  classifyCompanionTurnRoute,
  isCapabilityHelpQuery,
} from "@/lib/companion-runtime/companion-turn-route";
import { buildLightweightConversationalAnswer } from "@/lib/companion-runtime/lightweight-conversational-answer";
import { coerceToCustomerActiveLocale, type CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Locale } from "@/lib/i18n/config";
import type { CustomerAppSplitName } from "@/lib/i18n/customer-app-split-config";
import { detectBookingResumeContinuationIntent } from "@/lib/companion-runtime/booking-resume-intent";
import { resolvePendingSupportWritePointer } from "@/lib/companion-runtime/support-pending-action-pointer";
import {
  loadCompanionConversationMessages,
  type LoadCompanionConversationMessagesResult,
} from "./load-companion-conversation-messages";
import {
  produceBookingResumeTurn,
  type ProduceBookingResumeTurnResult,
} from "@/lib/companion-runtime/booking-resume-turn-producer";
import {
  produceBookingProposalTurn,
  type ProduceBookingProposalTurnResult,
} from "@/lib/companion-runtime/booking-proposal-turn-producer";
import {
  produceSupportResumeTurn,
  type ProduceSupportResumeTurnResult,
} from "@/lib/companion-runtime/support-resume-turn-producer";
import type { SupportWriteResult } from "@/lib/companion-runtime/support-write-orchestrator";
import { throwIfCompanionTurnAborted } from "./companion-turn-abort";
import type { Translator } from "@/lib/i18n/translate";

async function loadCustomerAppDictionaryForTurn(
  answerLocale: Locale,
  splits: CustomerAppSplitName[],
) {
  const { getCustomerAppDictionaryForSplits } = await import("@/lib/i18n/get-dictionary");
  return getCustomerAppDictionaryForSplits(answerLocale, splits);
}

function lightweightTurnNeedsPlatformKnowledge(
  query: string,
  locale: CustomerActiveLocale,
): boolean {
  const intent = resolveSupportSemanticIntent({ query, locale });
  return hasSupportAssignIntent(query, intent);
}

async function resolveLightweightDictionarySplits(input: {
  query: string;
  locale: CustomerActiveLocale;
  messagesLoader: TurnConversationMessagesLoader | null;
  abortSignal?: AbortSignal;
}): Promise<CustomerAppSplitName[]> {
  if (lightweightTurnNeedsPlatformKnowledge(input.query, input.locale)) {
    return companionDirectTurnDictionarySplits();
  }

  if (input.messagesLoader && detectBookingResumeContinuationIntent(input.query)) {
    const messages = await loadTurnConversationMessagesForResume(
      input.messagesLoader,
      input.abortSignal,
    );
    if (
      messages &&
      resolvePendingSupportWritePointer(messages, { resumeContinuationQuery: input.query })
    ) {
      return companionDirectTurnDictionarySplits();
    }
  }

  return ["companion"];
}

async function resolveDictionarySplitsForTurn(input: {
  turnRoute: import("@/lib/companion-runtime/companion-turn-route").CompanionTurnRoute;
  query: string;
  locale: CustomerActiveLocale;
  hasAttachments: boolean;
  hasActiveArtifact: boolean;
  messagesLoader: TurnConversationMessagesLoader | null;
  abortSignal?: AbortSignal;
}): Promise<CustomerAppSplitName[]> {
  const isLightweightMinimal =
    input.turnRoute === "lightweight" && !input.hasAttachments && !input.hasActiveArtifact;

  if (!isLightweightMinimal) {
    return companionDictionarySplitsForTurnRoute(input.turnRoute);
  }

  return resolveLightweightDictionarySplits({
    query: input.query,
    locale: input.locale,
    messagesLoader: input.messagesLoader,
    abortSignal: input.abortSignal,
  });
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.replace(/^customerApp\./, "").split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function getSearchTermsArray(dict: Record<string, unknown>, key: string): string[] {
  const raw = getNestedValue(dict, key);
  if (typeof raw === "string") {
    return raw.split("|").map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(raw)) return raw.map(String);
  return [];
}

export type ExecuteCompanionTurnInput = {
  query: string;
  locale: string;
  conversationId: string;
  activeArtifactId?: string | null;
  attachmentIds?: string[];
  platformActiveModules?: string[];
  integrationContext?: string | null;
  externalProvider?: string | null;
  externalConsent?: boolean;
  /** Background worker execution — uses queue tenant/user instead of auth session. */
  workerProfile?: WorkerExecutionProfile;
  /** Queue job ID — used for bootstrap failure diagnostics only. */
  workerQueueId?: string;
  /** Set when worker cancels an overdue turn. */
  abortSignal?: AbortSignal;
  /** Pre-classified route from worker — avoids duplicate classification. */
  turnRoute?: import("@/lib/companion-runtime/companion-turn-route").CompanionTurnRoute;
};

export type ExecuteCompanionTurnResult =
  | {
      ok: true;
      searchJson: Record<string, unknown>;
      labels: CompanionExperienceLabels;
      question: string;
    }
  | { ok: false; error: string; code?: string };

export type ProduceSupportProposalTurnInput = {
  supabase: SupabaseClient;
  query: string;
  locale: CustomerActiveLocale;
  t: Translator;
  userRole: UserRole;
  conversationId?: string;
  messages?: readonly CompanionChatMessage[];
};

export type ProduceSupportProposalTurnResult =
  | { handled: false }
  | {
      handled: true;
      answer: import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer;
      writeResult?: Pick<SupportWriteResult, "outcome" | "action_request_id">;
    };

export type ExecuteCompanionTurnDeps = {
  detect_booking_resume_intent?: (query: string) => boolean;
  detect_support_resume_intent?: (query: string) => boolean;
  load_companion_conversation_messages?: (
    client: SupabaseClient,
    conversationId: string,
  ) => Promise<LoadCompanionConversationMessagesResult>;
  produce_booking_resume_turn?: (
    turnInput: Parameters<typeof produceBookingResumeTurn>[0],
  ) => Promise<ProduceBookingResumeTurnResult>;
  produce_support_resume_turn?: (
    turnInput: Parameters<typeof produceSupportResumeTurn>[0],
  ) => Promise<ProduceSupportResumeTurnResult>;
  produce_booking_proposal_turn?: (
    turnInput: Parameters<typeof produceBookingProposalTurn>[0],
  ) => Promise<ProduceBookingProposalTurnResult>;
  produce_support_proposal_turn?: (
    turnInput: ProduceSupportProposalTurnInput,
  ) => Promise<ProduceSupportProposalTurnResult>;
};

type PlatformKnowledgeAnswerWithPendingSupport = import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer & {
  pendingSupportWrite?: { actionRequestId: string };
};

const SUPPORT_ACTION_REQUEST_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SUPPORT_NIL_ACTION_REQUEST_ID = "00000000-0000-0000-0000-000000000000";

function normalizeSupportActionRequestId(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (
    !trimmed ||
    !SUPPORT_ACTION_REQUEST_ID_REGEX.test(trimmed) ||
    trimmed.toLowerCase() === SUPPORT_NIL_ACTION_REQUEST_ID
  ) {
    return null;
  }
  return trimmed;
}

export function applySupportWriteApprovalHandoffToAnswer(
  answer: import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer,
  writeResult?: Pick<SupportWriteResult, "outcome" | "action_request_id">,
): PlatformKnowledgeAnswerWithPendingSupport {
  if (!writeResult) {
    return answer;
  }

  if (writeResult.outcome === "approval_required") {
    const persistedId = normalizeSupportActionRequestId(writeResult.action_request_id);
    if (!persistedId) {
      const { pendingSupportWrite: _ignored, ...rest } = answer as PlatformKnowledgeAnswerWithPendingSupport;
      return rest;
    }

    return {
      ...answer,
      pendingSupportWrite: { actionRequestId: persistedId },
    };
  }

  if (
    writeResult.outcome === "confirmation_required" ||
    writeResult.outcome === "failed" ||
    writeResult.outcome === "executed"
  ) {
    const { pendingSupportWrite: _ignored, ...rest } = answer as PlatformKnowledgeAnswerWithPendingSupport;
    return rest;
  }

  return answer;
}

let produceSupportProposalTurnDefault:
  | ((input: ProduceSupportProposalTurnInput) => Promise<ProduceSupportProposalTurnResult>)
  | null
  | undefined;

async function resolveProduceSupportProposalTurn(
  deps?: ExecuteCompanionTurnDeps,
): Promise<
  ((input: ProduceSupportProposalTurnInput) => Promise<ProduceSupportProposalTurnResult>) | null
> {
  if (deps?.produce_support_proposal_turn) {
    return deps.produce_support_proposal_turn;
  }

  if (produceSupportProposalTurnDefault === undefined) {
    try {
      const supportProposalTurnProducerModule =
        "@/lib/companion-runtime/support-proposal-turn-producer";
      const mod = (await import(supportProposalTurnProducerModule)) as {
        produceSupportProposalTurn: (
          input: ProduceSupportProposalTurnInput,
        ) => Promise<ProduceSupportProposalTurnResult>;
      };
      produceSupportProposalTurnDefault = mod.produceSupportProposalTurn;
    } catch {
      produceSupportProposalTurnDefault = null;
    }
  }

  return produceSupportProposalTurnDefault;
}

type TurnConversationMessagesLoader = {
  load: () => Promise<LoadCompanionConversationMessagesResult>;
};

function createTurnConversationMessagesLoader(input: {
  supabase: SupabaseClient;
  conversationId: string;
  abortSignal?: AbortSignal;
  deps?: ExecuteCompanionTurnDeps;
}): TurnConversationMessagesLoader {
  let loadPromise: Promise<LoadCompanionConversationMessagesResult> | undefined;

  return {
    load: () => {
      if (!loadPromise) {
        const loadMessages =
          input.deps?.load_companion_conversation_messages ?? loadCompanionConversationMessages;
        loadPromise = loadMessages(input.supabase, input.conversationId).then((loaded) => {
          throwIfCompanionTurnAborted(input.abortSignal);
          return loaded;
        });
      }
      return loadPromise;
    },
  };
}

async function loadTurnConversationMessagesForResume(
  messagesLoader: TurnConversationMessagesLoader | null,
  abortSignal?: AbortSignal,
): Promise<CompanionChatMessage[] | null> {
  if (!messagesLoader) {
    return null;
  }

  try {
    const loaded = await messagesLoader.load();
    throwIfCompanionTurnAborted(abortSignal);
    if (loaded.status !== "loaded") {
      return null;
    }
    return loaded.messages;
  } catch {
    throwIfCompanionTurnAborted(abortSignal);
    return null;
  }
}

async function loadTurnConversationMessagesForProposal(
  messagesLoader: TurnConversationMessagesLoader | null,
  abortSignal?: AbortSignal,
): Promise<CompanionChatMessage[]> {
  if (!messagesLoader) {
    return [];
  }

  try {
    const loaded = await messagesLoader.load();
    throwIfCompanionTurnAborted(abortSignal);
    if (loaded.status === "loaded") {
      return loaded.messages;
    }
    return [];
  } catch {
    throwIfCompanionTurnAborted(abortSignal);
    return [];
  }
}

async function tryLazyBookingResumeTurn(input: {
  supabase: SupabaseClient;
  query: string;
  conversationId: string;
  answerLocale: string;
  abortSignal?: AbortSignal;
  t: Translator;
  labels: ReturnType<typeof buildSupportAssistantLabels>;
  companionLabels: CompanionExperienceLabels;
  messagesLoader: TurnConversationMessagesLoader | null;
  deps?: ExecuteCompanionTurnDeps;
}): Promise<ExecuteCompanionTurnResult | null> {
  const detectResume =
    input.deps?.detect_booking_resume_intent ?? detectBookingResumeContinuationIntent;
  if (!input.query || !detectResume(input.query)) {
    return null;
  }

  const conversationId = input.conversationId.trim();
  if (!conversationId) {
    return null;
  }

  try {
    const messages = await loadTurnConversationMessagesForResume(
      input.messagesLoader,
      input.abortSignal,
    );
    if (!messages) {
      return null;
    }

    const produceResume = input.deps?.produce_booking_resume_turn ?? produceBookingResumeTurn;
    const producerResult = await produceResume({
      supabase: input.supabase,
      query: input.query,
      messages,
      t: input.t,
    });
    throwIfCompanionTurnAborted(input.abortSignal);

    if (!producerResult.handled) {
      return null;
    }

    const answer = producerResult.answer;
    const legacyArticle = answerToLegacyArticle(answer);
    return {
      ok: true,
      searchJson: {
        found: true,
        query: input.query,
        answer,
        articles: [legacyArticle],
        matched_article_id: null,
        principle: input.labels.principle,
        source: answer.source,
        confidence: answer.confidence,
        answer_locale: input.answerLocale,
      },
      labels: input.companionLabels,
      question: input.query,
    };
  } catch {
    throwIfCompanionTurnAborted(input.abortSignal);
    return null;
  }
}

async function tryLazySupportResumeTurn(input: {
  supabase: SupabaseClient;
  query: string;
  conversationId: string;
  answerLocale: string;
  abortSignal?: AbortSignal;
  t: Translator;
  labels: ReturnType<typeof buildSupportAssistantLabels>;
  companionLabels: CompanionExperienceLabels;
  messagesLoader: TurnConversationMessagesLoader | null;
  deps?: ExecuteCompanionTurnDeps;
}): Promise<ExecuteCompanionTurnResult | null> {
  const detectResume =
    input.deps?.detect_support_resume_intent ?? detectBookingResumeContinuationIntent;
  if (!input.query || !detectResume(input.query)) {
    return null;
  }

  const conversationId = input.conversationId.trim();
  if (!conversationId) {
    return null;
  }

  try {
    const messages = await loadTurnConversationMessagesForResume(
      input.messagesLoader,
      input.abortSignal,
    );
    if (!messages) {
      return null;
    }

    const produceResume = input.deps?.produce_support_resume_turn ?? produceSupportResumeTurn;
    const producerResult = await produceResume({
      supabase: input.supabase,
      query: input.query,
      messages,
      t: input.t,
    });
    throwIfCompanionTurnAborted(input.abortSignal);

    if (!producerResult.handled) {
      return null;
    }

    const answer = producerResult.answer;
    const legacyArticle = answerToLegacyArticle(answer);
    return {
      ok: true,
      searchJson: {
        found: true,
        query: input.query,
        answer,
        articles: [legacyArticle],
        matched_article_id: null,
        principle: input.labels.principle,
        source: answer.source,
        confidence: answer.confidence,
        answer_locale: input.answerLocale,
      },
      labels: input.companionLabels,
      question: input.query,
    };
  } catch {
    throwIfCompanionTurnAborted(input.abortSignal);
    return null;
  }
}

async function tryLazySupportProposalTurn(input: {
  supabase: SupabaseClient;
  query: string;
  conversationId: string;
  locale: CustomerActiveLocale;
  userRole: UserRole;
  abortSignal?: AbortSignal;
  t: Translator;
  labels: ReturnType<typeof buildSupportAssistantLabels>;
  companionLabels: CompanionExperienceLabels;
  messagesLoader: TurnConversationMessagesLoader | null;
  deps?: ExecuteCompanionTurnDeps;
}): Promise<ExecuteCompanionTurnResult | null> {
  if (!input.query.trim()) {
    return null;
  }

  const produceProposal = await resolveProduceSupportProposalTurn(input.deps);
  if (!produceProposal) {
    return null;
  }

  try {
    const conversationId = input.conversationId.trim();
    const messages = await loadTurnConversationMessagesForProposal(
      input.messagesLoader,
      input.abortSignal,
    );

    const producerResult = await produceProposal({
      supabase: input.supabase,
      query: input.query,
      locale: input.locale,
      t: input.t,
      userRole: input.userRole,
      conversationId,
      messages,
    });
    throwIfCompanionTurnAborted(input.abortSignal);

    if (!producerResult.handled) {
      return null;
    }

    const answer = applySupportWriteApprovalHandoffToAnswer(
      producerResult.answer,
      producerResult.writeResult,
    );
    const legacyArticle = answerToLegacyArticle(answer);
    return {
      ok: true,
      searchJson: {
        found: true,
        query: input.query,
        answer,
        articles: [legacyArticle],
        matched_article_id: null,
        principle: input.labels.principle,
        source: answer.source,
        confidence: answer.confidence,
        answer_locale: input.locale,
      },
      labels: input.companionLabels,
      question: input.query,
    };
  } catch {
    throwIfCompanionTurnAborted(input.abortSignal);
    return null;
  }
}

async function tryLazyBookingProposalTurn(input: {
  supabase: SupabaseClient;
  query: string;
  conversationId: string;
  locale: CustomerActiveLocale;
  userRole: UserRole;
  abortSignal?: AbortSignal;
  t: Translator;
  labels: ReturnType<typeof buildSupportAssistantLabels>;
  companionLabels: CompanionExperienceLabels;
  messagesLoader: TurnConversationMessagesLoader | null;
  deps?: ExecuteCompanionTurnDeps;
}): Promise<ExecuteCompanionTurnResult | null> {
  if (!input.query.trim()) {
    return null;
  }

  try {
    const conversationId = input.conversationId.trim();
    const messages = await loadTurnConversationMessagesForProposal(
      input.messagesLoader,
      input.abortSignal,
    );

    const produceProposal =
      input.deps?.produce_booking_proposal_turn ?? produceBookingProposalTurn;
    const producerResult = await produceProposal({
      supabase: input.supabase,
      query: input.query,
      locale: input.locale,
      t: input.t,
      userRole: input.userRole,
      conversationId,
      messages,
    });
    throwIfCompanionTurnAborted(input.abortSignal);

    if (!producerResult.handled) {
      return null;
    }

    const answer = producerResult.answer;
    const legacyArticle = answerToLegacyArticle(answer);
    return {
      ok: true,
      searchJson: {
        found: true,
        query: input.query,
        answer,
        articles: [legacyArticle],
        matched_article_id: null,
        principle: input.labels.principle,
        source: answer.source,
        confidence: answer.confidence,
        answer_locale: input.locale,
      },
      labels: input.companionLabels,
      question: input.query,
    };
  } catch {
    throwIfCompanionTurnAborted(input.abortSignal);
    return null;
  }
}

export async function executeCompanionTurn(
  supabase: SupabaseClient,
  input: ExecuteCompanionTurnInput,
  deps: ExecuteCompanionTurnDeps = {},
): Promise<ExecuteCompanionTurnResult> {
  const query = input.query.trim();
  if (!query && !(input.attachmentIds?.length ?? 0)) {
    return { ok: false, error: "empty_query", code: "empty_query" };
  }

  const profile = input.workerProfile
    ? {
        user: input.workerProfile.user,
        company: input.workerProfile.company,
      }
    : await getDashboardProfile(supabase);

  if (!profile) {
    return { ok: false, error: "no_profile", code: input.workerProfile ? "tenant_mismatch" : "unauthorized" };
  }

  const userRole = (profile.user.role ?? "staff") as UserRole;
  const answerLocale = resolveAnswerLocale(input.locale, query || "attachment");
  const answerLocaleActive = coerceToCustomerActiveLocale(answerLocale);
  const hasAttachments = (input.attachmentIds?.length ?? 0) > 0;
  const turnRoute =
    input.turnRoute ??
    classifyCompanionTurnRoute(query, answerLocaleActive, {
      hasAttachments,
      hasActiveArtifact: Boolean(input.activeArtifactId),
    });

  throwIfCompanionTurnAborted(input.abortSignal);

  const trimmedConversationId = input.conversationId.trim();
  const turnMessagesLoader = trimmedConversationId
    ? createTurnConversationMessagesLoader({
        supabase,
        conversationId: trimmedConversationId,
        abortSignal: input.abortSignal,
        deps,
      })
    : null;

  const dictionarySplits = await resolveDictionarySplitsForTurn({
    turnRoute,
    query,
    locale: answerLocaleActive,
    hasAttachments,
    hasActiveArtifact: Boolean(input.activeArtifactId),
    messagesLoader: turnMessagesLoader,
    abortSignal: input.abortSignal,
  });
  const dict = await loadCustomerAppDictionaryForTurn(answerLocale, dictionarySplits);
  throwIfCompanionTurnAborted(input.abortSignal);
  const t = createTranslator(dict);
  const labels = buildSupportAssistantLabels(t);
  const companionLabels = buildCompanionExperienceLabels(t);

  const resumeTurn = await tryLazyBookingResumeTurn({
    supabase,
    query,
    conversationId: input.conversationId,
    answerLocale,
    abortSignal: input.abortSignal,
    t,
    labels,
    companionLabels,
    messagesLoader: turnMessagesLoader,
    deps,
  });
  if (resumeTurn) {
    return resumeTurn;
  }

  const supportResumeTurn = await tryLazySupportResumeTurn({
    supabase,
    query,
    conversationId: input.conversationId,
    answerLocale,
    abortSignal: input.abortSignal,
    t,
    labels,
    companionLabels,
    messagesLoader: turnMessagesLoader,
    deps,
  });
  if (supportResumeTurn) {
    return supportResumeTurn;
  }

  const proposalTurn = await tryLazyBookingProposalTurn({
    supabase,
    query,
    conversationId: input.conversationId,
    locale: answerLocaleActive,
    userRole,
    abortSignal: input.abortSignal,
    t,
    labels,
    companionLabels,
    messagesLoader: turnMessagesLoader,
    deps,
  });
  if (proposalTurn) {
    return proposalTurn;
  }

  const supportProposalTurn = await tryLazySupportProposalTurn({
    supabase,
    query,
    conversationId: input.conversationId,
    locale: answerLocaleActive,
    userRole,
    abortSignal: input.abortSignal,
    t,
    labels,
    companionLabels,
    messagesLoader: turnMessagesLoader,
    deps,
  });
  if (supportProposalTurn) {
    return supportProposalTurn;
  }

  if (
    turnRoute === "lightweight" &&
    !hasAttachments &&
    !input.activeArtifactId &&
    query &&
    !shouldDeferLightweightConversationalAnswer(query)
  ) {
    const lightweightStarted = Date.now();
    const lightweightAnswer = buildLightweightConversationalAnswer({
      query,
      t,
      identity: null,
    });
    const legacyArticle = answerToLegacyArticle(lightweightAnswer);
    const totalMs = Date.now() - lightweightStarted;
    if (input.workerQueueId) {
      logCompanionWorkerStepTimings(input.workerQueueId, input.workerProfile?.customerId, {
        bootstrapMs: 0,
        routingMs: totalMs,
        route: turnRoute,
        totalMs,
      });
    }
    return {
      ok: true,
      searchJson: {
        found: true,
        query,
        answer: lightweightAnswer,
        articles: [legacyArticle],
        matched_article_id: null,
        principle: labels.principle,
        source: lightweightAnswer.source,
        confidence: lightweightAnswer.confidence,
        answer_locale: answerLocale,
      },
      labels: companionLabels,
      question: query,
    };
  }

  const legacyCorpus = buildSupportAssistantCorpus(labels, t);

  const skipHeavyArtifacts =
    !hasAttachments &&
    !input.activeArtifactId &&
    (turnRoute === "lightweight" ||
      turnRoute === "foundation" ||
      isCapabilityHelpQuery(query));

  const turnStarted = Date.now();
  let bootstrapMs = 0;
  let routingMs = 0;

  const { bootstrapCompanionWorkerTenantRuntime } = await import("./load-worker-tenant-context");
  const {
    buildPlatformSearchContextFromTenant,
    loadCompanionTenantContext,
    resolveCompanionIntegrationContext,
  } = await import("@/lib/companion-runtime/tenant-context");
  const { loadCompanionArtifactContext } = await import(
    "@/lib/companion-runtime/artifact-context/server"
  );
  const { loadCanvaHandoffConnectionMaterial } = await import(
    "@/lib/integration-intelligence/external-artifact-handoff/server"
  );
  const { enrichAnswerWithArtifactContext } = await import(
    "@/lib/companion-runtime/artifact-context/enrich-answer"
  );

  const workerBootstrap = input.workerProfile
    ? await bootstrapCompanionWorkerTenantRuntime(supabase, input.workerProfile, answerLocale, {
        queueId: input.workerQueueId,
        query,
      })
    : null;

  throwIfCompanionTurnAborted(input.abortSignal);

  if (input.workerProfile) {
    bootstrapMs = Date.now() - turnStarted;
  }

  if (input.workerProfile && (!workerBootstrap || !workerBootstrap.ok)) {
    const failure =
      workerBootstrap && !workerBootstrap.ok
        ? workerBootstrap.failure
        : ({
            step: "rpc_call",
            message: "worker_bootstrap_failed",
            tenantId: input.workerProfile.customerId,
            userId: input.workerProfile.user.id,
            queueId: input.workerQueueId,
          } satisfies WorkerBootstrapFailure);
    return {
      ok: false,
      error: formatBootstrapErrorMessage(failure),
      code: "worker_bootstrap_failed",
    };
  }

  const workerRuntime = workerBootstrap?.ok ? workerBootstrap.runtime : null;

  const runtimeSupabase = workerRuntime?.scopedSupabase ?? supabase;
  const tenantContext = workerRuntime
    ? workerRuntime.tenantContext
    : await loadCompanionTenantContext(supabase, { locale: answerLocale });

  throwIfCompanionTurnAborted(input.abortSignal);

  const resolvedIntegrationContext = resolveCompanionIntegrationContext(
    input.integrationContext ?? null,
    tenantContext,
  );
  const searchContext = buildPlatformSearchContextFromTenant(tenantContext, userRole);

  const snapshotContext = input.platformActiveModules?.length
    ? { activeModules: input.platformActiveModules }
    : undefined;

  let artifactContextBundle:
    | Awaited<ReturnType<typeof loadCompanionArtifactContext>>
    | null = null;

  if (input.conversationId && query && !skipHeavyArtifacts) {
    const externalProviderKey = input.externalProvider?.trim().toLowerCase() ?? null;
    let externalConnectionConnected = false;
    if (externalProviderKey === "canva") {
      const connection = await loadCanvaHandoffConnectionMaterial(runtimeSupabase);
      externalConnectionConnected = connection.connected;
    }

    const externalPermissionGranted = externalProviderKey
      ? assertCanvaHandoffPermissionForRole(userRole)
      : false;
    const externalHandoff = externalProviderKey
      ? classifyExternalProviderHandoffFromRegistry({
          provider_key: externalProviderKey,
          consent_granted: input.externalConsent === true,
          permission_granted: externalPermissionGranted,
          connection_connected: externalConnectionConnected,
        })
      : undefined;

    artifactContextBundle = await loadCompanionArtifactContext(runtimeSupabase, {
      conversation_id: input.conversationId,
      query,
      active_artifact_id: input.activeArtifactId,
      attachment_ids: input.attachmentIds,
      external_provider: input.externalProvider,
      external_consent: input.externalConsent,
      external_connection_connected: externalConnectionConnected,
      external_permission_granted: externalPermissionGranted,
      external_handoff: externalHandoff
        ? {
            provider_key: externalHandoff.provider_key,
            status: externalHandoff.status,
            requires_explicit_consent: externalHandoff.requires_explicit_consent,
            message_key: externalHandoff.message_key.replace(/^externalApplications\./, "attachments."),
          }
        : undefined,
    });
  }

  let subscriptionRaw: unknown = null;
  if (!workerRuntime) {
    try {
      const { data } = await runtimeSupabase.rpc("get_customer_license_center");
      subscriptionRaw = data;
    } catch {
      subscriptionRaw = null;
    }
  }

  const searchOptions = {
    t,
    locale: answerLocale,
    ctx: searchContext,
    getSearchTermsArray: (key: string) =>
      getSearchTermsArray(dict.customerApp as Record<string, unknown>, key),
    subscriptionRaw,
    supabase: runtimeSupabase,
    integrationContext: resolvedIntegrationContext,
    snapshotContext,
    artifactContext: artifactContextBundle
      ? {
          conversation_id: artifactContextBundle.conversation_id,
          active_artifact: artifactContextBundle.active_artifact,
          attachment_ids: artifactContextBundle.attachment_ids,
          references: artifactContextBundle.references,
        }
      : undefined,
    tenantContext,
    companionSurface: true,
    conversationId: input.conversationId,
  };

  const searchQuery = query || companionLabels.attachments.activeBadge;
  const routingStarted = Date.now();
  const { searchPlatformKnowledge } = await import("@/lib/companion-platform-knowledge/search");
  const result = await searchPlatformKnowledge(searchQuery, searchOptions);
  routingMs = Date.now() - routingStarted;

  if (input.workerQueueId) {
    logCompanionWorkerStepTimings(input.workerQueueId, input.workerProfile?.customerId, {
      bootstrapMs,
      routingMs,
      route: turnRoute,
      totalMs: Date.now() - turnStarted,
    });
  }

  if (result.answer.confidence === "low") {
    const { trackLowConfidenceQuery } = await import(
      "@/lib/companion-platform-knowledge/quality-tracking"
    );
    void trackLowConfidenceQuery(runtimeSupabase, searchQuery, answerLocale, result.answer.confidence);
  }

  let answer = result.answer;

  if (artifactContextBundle) {
    const att = companionLabels.attachments;
    const externalApps = companionLabels.externalApplications;

    answer = enrichAnswerWithArtifactContext(
      answer,
      artifactContextBundle,
      artifactContextBundle.attachments,
      {
        resolvedActive: (filename) => att.context.resolvedActive.replace("{filename}", filename),
        unresolvedReference: att.context.unresolvedReference,
        noBinaryNote: att.context.noBinaryNote,
      },
    );

    if (artifactContextBundle.externalHandoff) {
      const handoff = artifactContextBundle.externalHandoff;
      answer.externalHandoff = handoff;
      const handoffCopy =
        handoff.status === "consent_required"
          ? att.externalHandoff.consentRequired
          : handoff.status === "permission_denied"
            ? att.externalHandoff.permissionDenied
            : handoff.status === "partial"
              ? att.externalHandoff.partial
              : handoff.status === "unsupported"
                ? externalApps.handoff.unsupported
                : handoff.status === "adapter_available"
                  ? att.externalHandoff.ready
                  : att.externalHandoff.adapterMissing;
      answer = {
        ...answer,
        explanation: [answer.explanation, handoffCopy].filter(Boolean).join("\n\n"),
      };
    }
  }

  const legacyArticle = answerToLegacyArticle(answer);
  const searchJson = {
    found: true,
    query: searchQuery,
    answer,
    articles: [legacyArticle],
    matched_article_id: result.matchedArticleId,
    principle: labels.principle,
    source: answer.source,
    confidence: answer.confidence,
    answer_locale: answerLocale,
    organization_state: resolveCompanionOrganizationState(subscriptionRaw),
  };

  return {
    ok: true,
    searchJson,
    labels: companionLabels,
    question: searchQuery,
  };
}

export async function executeCompanionTurnToPayload(
  supabase: SupabaseClient,
  input: ExecuteCompanionTurnInput,
) {
  const turn = await executeCompanionTurn(supabase, input);
  if (!turn.ok) return turn;

  const answerLocale =
    typeof (turn.searchJson as { answer_locale?: unknown }).answer_locale === "string"
      ? (turn.searchJson as { answer_locale: string }).answer_locale
      : input.locale;

  const organizationState =
    (turn.searchJson as { organization_state?: ReturnType<typeof resolveCompanionOrganizationState> })
      .organization_state ?? "unknown";

  const { message, payload } = await buildEnrichedReplyFromSearchJson(
    turn.searchJson,
    turn.labels,
    turn.question,
    {
      locale: answerLocale,
      organizationState,
      logContext: {
        conversationId: input.conversationId,
        queueId: input.workerQueueId,
        correlationId: input.workerQueueId ?? input.conversationId,
      },
    },
  );

  return {
    ok: true as const,
    assistantContent: message.directAnswer ?? message.content,
    assistantPayload: payload,
    message,
  };
}
