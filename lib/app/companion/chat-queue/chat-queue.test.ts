import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { parseSupportAssistantSearch } from "@/lib/app-portal/support-assistant";
import { resolvePendingBookingWritePointer, resolvePendingBookingClarificationPointer, buildPendingBookingClarificationState, normalizePendingBookingClarification, serializePendingBookingClarification } from "@/lib/companion-runtime/booking-pending-action-pointer";
import type { CompanionExperienceLabels } from "../types";
import { buildReplyFromSearchJson } from "./build-reply";
import type { ExecuteCompanionTurnDeps, ProduceSupportProposalTurnInput } from "./execute-turn";
import { applySupportWriteApprovalHandoffToAnswer } from "./execute-turn";
import type { ProduceBookingResumeTurnInput } from "@/lib/companion-runtime/booking-resume-turn-producer";
import type { ProduceSupportResumeTurnInput } from "@/lib/companion-runtime/support-resume-turn-producer";
import type { CompanionChatMessage } from "../types";
import {
  mapServerMessagesToChat,
  deserializeAssistantMessage,
  serializeAssistantPayload,
} from "./message-payload";
import { createClientMessageId, createIdempotencyKey } from "./client";
import { resolveCompanionQueueWaitPhase } from "./queue-wait-phase";

const VALID_ACTION_REQUEST_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const VALID_CLARIFICATION_ID = "c1a2b3c4-f5c6-4789-a012-3456789abcde";
const VALID_CONVERSATION_ID = "conv-70dc57a4-287d-4c01-915d-510be2b5f98b";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

type AssistantMessageWithPendingSupport = CompanionChatMessage & {
  pendingSupportWrite?: { actionRequestId: string } | null;
};

type PlatformKnowledgeAnswerWithPendingSupport = PlatformKnowledgeAnswer & {
  pendingSupportWrite?: { actionRequestId: string };
};

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

function testPendingBookingClarificationHandoffContract() {
  const clarificationState = buildPendingBookingClarificationState({
    clarificationId: VALID_CLARIFICATION_ID,
    organizationId: "org-unonight",
    conversationId: VALID_CONVERSATION_ID,
    customerReference: "P112-C3X-R3",
    serviceLabel: null,
    resourceName: null,
    dateHint: "mandag neste uke kl. 10:00",
    missingFields: ["service_missing", "employee_missing"],
    now: new Date("2026-06-27T05:20:00.000Z"),
  });

  const withClarification = assistantMessage({
    id: "c-clarify",
    content: "Aipify trenger mer detaljer før en booking kan forberedes.",
    pendingBookingClarification: clarificationState,
  });
  const serialized = serializeAssistantPayload(withClarification);
  assert.ok(serialized.pending_booking_clarification);
  assert.equal(serialized.pending_booking_clarification?.clarification_id, VALID_CLARIFICATION_ID);
  assert.equal(serialized.pending_booking_clarification?.organization_id, "org-unonight");
  assert.equal(serialized.pending_booking_clarification?.conversation_id, VALID_CONVERSATION_ID);
  assert.deepEqual(
    Object.keys(serialized.pending_booking_clarification ?? {}).sort(),
    [
      "capability_key",
      "clarification_id",
      "conversation_id",
      "customer_reference",
      "date_hint",
      "expires_at",
      "missing_fields",
      "organization_id",
      "resource_name",
      "service_label",
      "slot_start_at",
    ].sort(),
  );

  const roundTripped = deserializeAssistantMessage(
    "s-clarify",
    "c-clarify",
    withClarification.content,
    JSON.parse(JSON.stringify(serialized)),
    6000,
  );
  assert.deepEqual(roundTripped.pendingBookingClarification?.clarificationId, VALID_CLARIFICATION_ID);
  assert.deepEqual(roundTripped.pendingBookingClarification?.customerReference, "P112-C3X-R3");

  const searchJson = {
    found: true,
    query: "Book appointment",
    answer: {
      directAnswer: "Aipify trenger mer detaljer før en booking kan forberedes.",
      steps: [],
      actions: [],
      sources: [],
      sourceId: "booking-proposal",
      source: "customer_context",
      confidence: "high",
      pendingBookingClarification: clarificationState,
    },
  };
  const parsed = parseSupportAssistantSearch(searchJson);
  assert.equal(parsed.answer?.pendingBookingClarification?.conversationId, VALID_CONVERSATION_ID);

  const built = buildReplyFromSearchJson(searchJson, stubLabels, "Book appointment");
  assert.equal(built.message.pendingBookingClarification?.clarificationId, VALID_CLARIFICATION_ID);
  assert.equal(built.payload.pending_booking_clarification?.clarification_id, VALID_CLARIFICATION_ID);

  const resolved = resolvePendingBookingClarificationPointer([
    { id: "u1", role: "user", content: "Book", timestamp: 1 },
    built.message,
  ]);
  assert.equal(resolved?.customerReference, "P112-C3X-R3");

  assert.equal(
    normalizePendingBookingClarification({
      clarification_id: "not-a-uuid",
      capability_key: "booking.create",
      organization_id: "org-unonight",
      conversation_id: VALID_CONVERSATION_ID,
      expires_at: clarificationState.expiresAt,
      missing_fields: ["service_missing"],
    }),
    null,
  );
  assert.equal(
    normalizePendingBookingClarification({
      clarification_id: VALID_CLARIFICATION_ID,
      capability_key: "booking.update",
      organization_id: "org-unonight",
      conversation_id: VALID_CONVERSATION_ID,
      expires_at: clarificationState.expiresAt,
      missing_fields: ["service_missing"],
      extra_field: "ignored",
    }),
    null,
  );

  const camelFromProducer = {
    clarificationId: VALID_CLARIFICATION_ID,
    capabilityKey: "booking.create" as const,
    organizationId: "org-unonight",
    conversationId: VALID_CONVERSATION_ID,
    customerReference: "P112-C3X-R3",
    serviceLabel: null,
    resourceName: null,
    dateHint: "mandag neste uke kl. 10:00",
    slotStartAt: null,
    missingFields: ["service_missing", "employee_missing"] as const,
    expiresAt: clarificationState.expiresAt,
    unknownField: "ignored",
  };
  assert.equal(
    parseSupportAssistantSearch({
      found: true,
      query: "Book",
      answer: {
        directAnswer: "Need details",
        steps: [],
        actions: [],
        sources: [],
        sourceId: "booking-proposal",
        source: "customer_context",
        confidence: "high",
        pendingBookingClarification: camelFromProducer,
      },
    }).answer?.pendingBookingClarification?.clarificationId,
    VALID_CLARIFICATION_ID,
  );
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

const RESUME_CONVERSATION_ID = "conv-a1b2c3d4-e5f6-4789-a012-3456789abcde";
const supabaseStub = {} as SupabaseClient;
const workerProfileStub = {
  user: {
    id: "user-1",
    auth_user_id: "auth-1",
    company_id: "company-1",
    full_name: "Test User",
    role: "owner" as const,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  company: {
    id: "company-1",
    name: "Test Co",
    slug: "test-co",
    is_platform: false,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  customerId: "customer-1",
};

const canonicalLoadedMessages: CompanionChatMessage[] = [
  {
    id: "a1",
    role: "aipify",
    content: "Confirm booking?",
    timestamp: 1,
    pendingBookingWrite: { actionRequestId: VALID_ACTION_REQUEST_ID },
  },
];

const producerAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "Resume producer answer",
  steps: [],
  actions: [],
  sources: [{ id: "booking-resume", label: "Booking", kind: "customer_context" }],
  sourceId: "booking-resume",
  source: "customer_context",
  confidence: "high",
};

const proposalClarificationAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "Aipify needs more detail before preparing a booking action.",
  steps: [],
  actions: [],
  sources: [{ id: "booking-proposal", label: "Services & appointment booking", kind: "customer_context" }],
  sourceId: "booking-proposal",
  source: "customer_context",
  confidence: "high",
};

const proposalApprovalAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "Approval is required before booking can proceed.",
  steps: [],
  actions: [],
  sources: [{ id: "booking-proposal", label: "Services & appointment booking", kind: "customer_context" }],
  sourceId: "booking-proposal",
  source: "customer_context",
  confidence: "high",
  pendingBookingWrite: { actionRequestId: VALID_ACTION_REQUEST_ID },
};

const supportProducerAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "Support resume producer answer",
  steps: [],
  actions: [],
  sources: [{ id: "support-resume", label: "Support", kind: "customer_context" }],
  sourceId: "support-resume",
  source: "customer_context",
  confidence: "high",
};

const supportProposalBaseAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "Approval is required before support assignment can proceed.",
  steps: [],
  actions: [],
  sources: [{ id: "support-proposal", label: "Support operations", kind: "customer_context" }],
  sourceId: "support-proposal",
  source: "customer_context",
  confidence: "high",
};

const canonicalSupportLoadedMessages: CompanionChatMessage[] = [
  {
    id: "s-a1",
    role: "aipify",
    content: "Confirm assignment?",
    timestamp: 1,
    pendingSupportWrite: { actionRequestId: VALID_ACTION_REQUEST_ID },
  } as CompanionChatMessage,
];

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

type ExecuteCompanionTurnFn = typeof import("./execute-turn").executeCompanionTurn;
let executeCompanionTurnRef: ExecuteCompanionTurnFn | null = null;

async function getExecuteCompanionTurn(): Promise<ExecuteCompanionTurnFn> {
  if (!executeCompanionTurnRef) {
    installServerOnlyShim();
    const mod = await import("./execute-turn");
    executeCompanionTurnRef = mod.executeCompanionTurn;
  }
  return executeCompanionTurnRef;
}

async function runExecuteTurnWithResumeDeps(
  input: {
    query: string;
    conversationId?: string;
    turnRoute?: import("@/lib/companion-runtime/companion-turn-route").CompanionTurnRoute;
    abortSignal?: AbortSignal;
    deps?: ExecuteCompanionTurnDeps;
  },
) {
  let detectCalls = 0;
  let supportDetectCalls = 0;
  let loadCalls = 0;
  let produceCalls = 0;
  let supportProduceCalls = 0;
  let proposalCalls = 0;
  let supportProposalCalls = 0;
  let loadClient: SupabaseClient | null = null;
  let loadConversationId: string | null = null;
  let produceInput: {
    supabase?: SupabaseClient;
    query: string;
    messages: readonly CompanionChatMessage[];
    t?: import("@/lib/i18n/translate").Translator;
  } | null = null;
  let supportProduceInput: ProduceSupportResumeTurnInput | null = null;
  let proposalInput: {
    supabase: SupabaseClient;
    query: string;
    locale: import("@/lib/i18n/customer-active-locale-registry").CustomerActiveLocale;
    userRole: string;
    t: import("@/lib/i18n/translate").Translator;
  } | null = null;
  let supportProposalInput: ProduceSupportProposalTurnInput | null = null;

  const deps: ExecuteCompanionTurnDeps = {
    detect_booking_resume_intent: (query) => {
      detectCalls += 1;
      return input.deps?.detect_booking_resume_intent
        ? input.deps.detect_booking_resume_intent(query)
        : query === "ja" || query === "yes confirm" || query === "bekreft";
    },
    detect_support_resume_intent: (query) => {
      supportDetectCalls += 1;
      if (input.deps?.detect_support_resume_intent) {
        return input.deps.detect_support_resume_intent(query);
      }
      if (input.deps?.detect_booking_resume_intent) {
        return input.deps.detect_booking_resume_intent(query);
      }
      return query === "ja" || query === "yes confirm" || query === "bekreft";
    },
    load_companion_conversation_messages: input.deps?.load_companion_conversation_messages
      ? async (client, conversationId) => {
          loadCalls += 1;
          loadClient = client;
          loadConversationId = conversationId;
          return input.deps!.load_companion_conversation_messages!(client, conversationId);
        }
      : async (client, conversationId) => {
          loadCalls += 1;
          loadClient = client;
          loadConversationId = conversationId;
          return { status: "loaded" as const, messages: canonicalLoadedMessages };
        },
    produce_booking_resume_turn: input.deps?.produce_booking_resume_turn
      ? async (turnInput) => {
          produceCalls += 1;
          produceInput = turnInput;
          return input.deps!.produce_booking_resume_turn!(turnInput);
        }
      : async (turnInput) => {
          produceCalls += 1;
          produceInput = turnInput;
          return { handled: false as const };
        },
    produce_booking_proposal_turn: input.deps?.produce_booking_proposal_turn
      ? async (turnInput) => {
          proposalCalls += 1;
          proposalInput = turnInput;
          return input.deps!.produce_booking_proposal_turn!(turnInput);
        }
      : async (turnInput) => {
          proposalCalls += 1;
          proposalInput = turnInput;
          return { handled: false as const };
        },
    produce_support_resume_turn: input.deps?.produce_support_resume_turn
      ? async (turnInput) => {
          supportProduceCalls += 1;
          supportProduceInput = turnInput;
          return input.deps!.produce_support_resume_turn!(turnInput);
        }
      : async (turnInput) => {
          supportProduceCalls += 1;
          supportProduceInput = turnInput;
          return { handled: false as const };
        },
    produce_support_proposal_turn: input.deps?.produce_support_proposal_turn
      ? async (turnInput) => {
          supportProposalCalls += 1;
          supportProposalInput = turnInput;
          return input.deps!.produce_support_proposal_turn!(turnInput);
        }
      : undefined,
  };

  const executeCompanionTurn = await getExecuteCompanionTurn();
  const turn = await executeCompanionTurn(
    supabaseStub,
    {
      query: input.query,
      locale: "en",
      conversationId: input.conversationId ?? RESUME_CONVERSATION_ID,
      workerProfile: workerProfileStub,
      turnRoute: input.turnRoute ?? "lightweight",
      abortSignal: input.abortSignal,
    },
    deps,
  );

  return {
    turn,
    detectCalls,
    supportDetectCalls,
    loadCalls,
    produceCalls,
    supportProduceCalls,
    proposalCalls,
    supportProposalCalls,
    loadClient,
    loadConversationId,
    produceInput,
    supportProduceInput,
    proposalInput,
    supportProposalInput,
  };
}

async function testExecuteTurnResumeWiring() {
  {
    const { turn, detectCalls, loadCalls, produceCalls, proposalCalls } = await runExecuteTurnWithResumeDeps(
      {
        query: "What is my schedule tomorrow?",
        deps: {
          detect_booking_resume_intent: () => false,
        },
      },
    );
    assert.equal(detectCalls, 1);
    assert.equal(loadCalls, 1);
    assert.equal(produceCalls, 0);
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
  }

  {
    const { loadCalls, produceCalls, turn } = await runExecuteTurnWithResumeDeps(
      {
        query: "ja",
        conversationId: "   ",
        deps: {
          detect_booking_resume_intent: () => true,
        },
      },
    );
    assert.equal(loadCalls, 0);
    assert.equal(produceCalls, 0);
    assert.equal(turn.ok, true);
  }

  {
    const { loadCalls, produceCalls, turn } = await runExecuteTurnWithResumeDeps(
      {
        query: "ja",
        deps: {
          detect_booking_resume_intent: () => true,
          load_companion_conversation_messages: async () => ({ status: "failed", messages: [] }),
        },
      },
    );
    assert.equal(loadCalls, 3);
    assert.equal(produceCalls, 0);
    assert.equal(turn.ok, true);
  }

  {
    const { produceCalls, turn } = await runExecuteTurnWithResumeDeps({
      query: "ja",
      deps: {
        detect_booking_resume_intent: () => true,
        produce_booking_resume_turn: async () => ({ handled: false }),
      },
    });
    assert.equal(produceCalls, 1);
    assert.equal(turn.ok, true);
    if (turn.ok) {
      assert.notEqual(turn.searchJson.answer, producerAnswer);
    }
  }

  {
    const capturedProducerInputs: ProduceBookingResumeTurnInput[] = [];
    const { turn, loadClient, loadConversationId, loadCalls, produceCalls, detectCalls } =
      await runExecuteTurnWithResumeDeps({
        query: "yes confirm",
        deps: {
          detect_booking_resume_intent: () => true,
          produce_booking_resume_turn: async (turnInput) => {
            capturedProducerInputs.push(turnInput);
            return {
              handled: true,
              answer: producerAnswer,
            };
          },
        },
      });
    assert.equal(detectCalls, 1);
    assert.equal(loadCalls, 1);
    assert.equal(produceCalls, 1);
    assert.equal(loadClient, supabaseStub);
    assert.equal(loadConversationId, RESUME_CONVERSATION_ID);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    assert.deepEqual(turn.searchJson.answer, producerAnswer);
    assert.equal(capturedProducerInputs.length, 1);
    const capturedProducerInput = capturedProducerInputs[0];
    assert.ok(capturedProducerInput);
    assert.equal(capturedProducerInput.query, "yes confirm");
    assert.deepEqual(capturedProducerInput.messages, canonicalLoadedMessages);
    assert.equal(typeof capturedProducerInput.t, "function");
    assert.equal(capturedProducerInput.supabase, supabaseStub);
  }

  {
    let loadCalls = 0;
    const { turn } = await runExecuteTurnWithResumeDeps({
      query: "ja",
      deps: {
        detect_booking_resume_intent: () => true,
        load_companion_conversation_messages: async () => {
          loadCalls += 1;
          throw new Error("loader exploded");
        },
      },
    });
    assert.equal(loadCalls, 3);
    assert.equal(turn.ok, true);
    assert.equal(JSON.stringify(turn).includes("loader exploded"), false);
  }

  {
    let produceCalls = 0;
    const { turn } = await runExecuteTurnWithResumeDeps({
      query: "ja",
      deps: {
        detect_booking_resume_intent: () => true,
        produce_booking_resume_turn: async () => {
          produceCalls += 1;
          throw new Error("producer exploded");
        },
      },
    });
    assert.equal(produceCalls, 1);
    assert.equal(turn.ok, true);
    assert.equal(JSON.stringify(turn).includes("producer exploded"), false);
  }

  {
    let loadCalls = 0;
    const { loadCalls: firstLoadCalls } = await runExecuteTurnWithResumeDeps({
      query: "What is billing?",
      deps: {
        detect_booking_resume_intent: () => false,
        load_companion_conversation_messages: async () => {
          loadCalls += 1;
          return { status: "loaded", messages: canonicalLoadedMessages };
        },
      },
    });
    assert.equal(firstLoadCalls, 1);
    assert.equal(loadCalls, 1);
  }

  {
    const abortController = new AbortController();
    abortController.abort();
    await assert.rejects(
      () =>
        runExecuteTurnWithResumeDeps({
          query: "ja",
          abortSignal: abortController.signal,
          deps: {
            detect_booking_resume_intent: () => true,
          },
        }),
      (error: unknown) =>
        error instanceof DOMException &&
        error.name === "AbortError" &&
        error.message === "companion_turn_aborted",
    );
  }

  {
    const abortController = new AbortController();
    await assert.rejects(
      () =>
        runExecuteTurnWithResumeDeps({
          query: "ja",
          abortSignal: abortController.signal,
          deps: {
            detect_booking_resume_intent: () => true,
            load_companion_conversation_messages: async () => {
              abortController.abort();
              throw new Error("loader interrupted");
            },
          },
        }),
      (error: unknown) =>
        error instanceof DOMException &&
        error.name === "AbortError" &&
        error.message === "companion_turn_aborted",
    );
  }

  {
    const abortController = new AbortController();
    await assert.rejects(
      () =>
        runExecuteTurnWithResumeDeps({
          query: "ja",
          abortSignal: abortController.signal,
          deps: {
            detect_booking_resume_intent: () => true,
            produce_booking_resume_turn: async () => {
              abortController.abort();
              throw new Error("producer interrupted");
            },
          },
        }),
      (error: unknown) =>
        error instanceof DOMException &&
        error.name === "AbortError" &&
        error.message === "companion_turn_aborted",
    );
  }
}

async function testExecuteTurnRealProducerCallGraph() {
  const { detectBookingResumeContinuationIntent } = await import(
    "@/lib/companion-runtime/booking-resume-intent"
  );
  const { produceBookingResumeTurn } = await import(
    "@/lib/companion-runtime/booking-resume-turn-producer"
  );
  const executeCompanionTurn = await getExecuteCompanionTurn();

  let outerDetectCalls = 0;
  let innerDetectCalls = 0;
  let loadCalls = 0;
  let produceEntryCalls = 0;
  let resumeExecutionCalls = 0;
  let capturedT: import("@/lib/i18n/translate").Translator | null = null;

  const turn = await executeCompanionTurn(
    supabaseStub,
    {
      query: "yes confirm",
      locale: "en",
      conversationId: RESUME_CONVERSATION_ID,
      workerProfile: workerProfileStub,
      turnRoute: "lightweight",
    },
    {
      detect_booking_resume_intent: (query) => {
        outerDetectCalls += 1;
        return detectBookingResumeContinuationIntent(query);
      },
      load_companion_conversation_messages: async (client, conversationId) => {
        loadCalls += 1;
        assert.equal(client, supabaseStub);
        assert.equal(conversationId, RESUME_CONVERSATION_ID);
        return { status: "loaded", messages: canonicalLoadedMessages };
      },
      produce_booking_resume_turn: async (turnInput) => {
        produceEntryCalls += 1;
        capturedT = turnInput.t;
        return produceBookingResumeTurn(turnInput, {
          detect_resume_intent: (query) => {
            innerDetectCalls += 1;
            return detectBookingResumeContinuationIntent(query);
          },
          resume_execution: async (actionRequestId) => {
            resumeExecutionCalls += 1;
            assert.equal(actionRequestId, VALID_ACTION_REQUEST_ID);
            return {
              outcome: "approval_required",
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
              outcome_code: null,
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
        });
      },
    },
  );

  assert.equal(outerDetectCalls, 1);
  assert.equal(innerDetectCalls, 1);
  assert.equal(loadCalls, 1);
  assert.equal(produceEntryCalls, 1);
  assert.equal(resumeExecutionCalls, 1);
  assert.equal(turn.ok, true);
  if (!turn.ok) return;

  const answer = turn.searchJson.answer as PlatformKnowledgeAnswer;
  assert.equal(answer.sourceId, "booking-resume");
  assert.deepEqual(answer.pendingBookingWrite, {
    actionRequestId: VALID_ACTION_REQUEST_ID,
  });
  assert.equal(typeof capturedT, "function");
  assert.equal(typeof turn.searchJson.answer, "object");
  assert.notEqual(answer.directAnswer, producerAnswer.directAnswer);
}

async function testExecuteTurnProposalWiring() {
  const c3xQuery =
    "Bestill en avtale for testkunde P112-C3X-E2E-R2 mandag neste uke kl. 10:00. Dette er en kontrollert production E2E. Opprett kun én booking.";

  {
    const { turn, detectCalls, produceCalls, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: c3xQuery,
      deps: {
        detect_booking_resume_intent: () => false,
        produce_booking_proposal_turn: async () => ({
          handled: true,
          answer: proposalClarificationAnswer,
        }),
      },
    });
    assert.equal(detectCalls, 1);
    assert.equal(produceCalls, 0);
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    const answer = turn.searchJson.answer as PlatformKnowledgeAnswer;
    assert.equal(answer.sourceId, "booking-proposal");
    assert.equal(answer.directAnswer, proposalClarificationAnswer.directAnswer);
    assert.equal(answer.pendingBookingWrite, undefined);
    assert.notEqual(answer.sourceId, "companion-lightweight-conversational");
  }

  {
    const { turn, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: "Hva tenker du om kaffe?",
      deps: {
        detect_booking_resume_intent: () => false,
        produce_booking_proposal_turn: async () => ({ handled: false }),
      },
    });
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    const answer = turn.searchJson.answer as PlatformKnowledgeAnswer;
    assert.equal(answer.sourceId, "companion-lightweight-conversational");
  }

  {
    const { turn, produceCalls, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: "yes confirm",
      deps: {
        detect_booking_resume_intent: () => true,
        produce_booking_resume_turn: async () => ({
          handled: true,
          answer: producerAnswer,
        }),
      },
    });
    assert.equal(produceCalls, 1);
    assert.equal(proposalCalls, 0);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    assert.equal((turn.searchJson.answer as PlatformKnowledgeAnswer).sourceId, "booking-resume");
  }

  {
    const { turn, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: "Bestill en time for testkunde P112 ja bekreft",
      deps: {
        detect_booking_resume_intent: () => false,
        produce_booking_proposal_turn: async () => ({
          handled: true,
          answer: proposalApprovalAnswer,
        }),
      },
    });
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    const answer = turn.searchJson.answer as PlatformKnowledgeAnswer;
    assert.equal(answer.sourceId, "booking-proposal");
    assert.deepEqual(answer.pendingBookingWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });
  }

  {
    const { turn, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: c3xQuery,
      deps: {
        detect_booking_resume_intent: () => false,
        produce_booking_proposal_turn: async () => ({
          handled: true,
          answer: {
            ...proposalClarificationAnswer,
            directAnswer: "The booking could not be prepared.",
            pendingBookingWrite: undefined,
          },
        }),
      },
    });
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    const answer = turn.searchJson.answer as PlatformKnowledgeAnswer;
    assert.equal(answer.pendingBookingWrite, undefined);
    assert.notEqual(answer.sourceId, "companion-lightweight-conversational");
  }
}

function testExecuteTurnSupportApprovalHandoff() {
  {
    const answer = applySupportWriteApprovalHandoffToAnswer(supportProposalBaseAnswer, {
      outcome: "approval_required",
      action_request_id: VALID_ACTION_REQUEST_ID,
    });
    assert.deepEqual(answer.pendingSupportWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });
    const serialized = serializeAssistantPayload({
      id: "c-support",
      role: "aipify",
      content: answer.directAnswer,
      directAnswer: answer.directAnswer,
      timestamp: 1000,
      pendingSupportWrite: answer.pendingSupportWrite,
    } as AssistantMessageWithPendingSupport);
    assert.deepEqual(serialized.pending_support_write, { action_request_id: VALID_ACTION_REQUEST_ID });
  }

  {
    const answer = applySupportWriteApprovalHandoffToAnswer(supportProposalBaseAnswer, {
      outcome: "approval_required",
      action_request_id: null,
    });
    assert.equal(answer.pendingSupportWrite, undefined);
  }

  {
    const answer = applySupportWriteApprovalHandoffToAnswer(supportProposalBaseAnswer, {
      outcome: "approval_required",
      action_request_id: NIL_UUID,
    });
    assert.equal(answer.pendingSupportWrite, undefined);
  }

  for (const outcome of ["confirmation_required", "failed", "executed"] as const) {
    const answer = applySupportWriteApprovalHandoffToAnswer(
      {
        ...supportProposalBaseAnswer,
        pendingSupportWrite: { actionRequestId: VALID_ACTION_REQUEST_ID },
      } as PlatformKnowledgeAnswerWithPendingSupport,
      { outcome, action_request_id: VALID_ACTION_REQUEST_ID },
    );
    assert.equal(answer.pendingSupportWrite, undefined);
  }
}

async function testExecuteTurnSupportResumeWiring() {
  {
    const { turn, supportDetectCalls, supportProduceCalls, proposalCalls } =
      await runExecuteTurnWithResumeDeps({
        query: "What is my schedule tomorrow?",
        deps: {
          detect_booking_resume_intent: () => false,
          detect_support_resume_intent: () => false,
        },
      });
    assert.equal(supportDetectCalls, 1);
    assert.equal(supportProduceCalls, 0);
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
    if (turn.ok) {
      assert.notEqual((turn.searchJson.answer as PlatformKnowledgeAnswer).sourceId, "support-resume");
    }
  }

  {
    const { supportProduceCalls, turn } = await runExecuteTurnWithResumeDeps({
      query: "ja",
      deps: {
        detect_booking_resume_intent: () => true,
        produce_booking_resume_turn: async () => ({ handled: false }),
        detect_support_resume_intent: () => true,
        load_companion_conversation_messages: async () => ({
          status: "loaded",
          messages: canonicalSupportLoadedMessages,
        }),
        produce_support_resume_turn: async () => ({
          handled: true,
          answer: supportProducerAnswer,
        }),
      },
    });
    assert.equal(supportProduceCalls, 1);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    assert.equal((turn.searchJson.answer as PlatformKnowledgeAnswer).sourceId, "support-resume");
  }

  {
    const { turn, produceCalls, supportProduceCalls, proposalCalls } =
      await runExecuteTurnWithResumeDeps({
        query: "yes confirm",
        deps: {
          detect_booking_resume_intent: () => true,
          produce_booking_resume_turn: async () => ({
            handled: true,
            answer: producerAnswer,
          }),
          detect_support_resume_intent: () => true,
        },
      });
    assert.equal(produceCalls, 1);
    assert.equal(supportProduceCalls, 0);
    assert.equal(proposalCalls, 0);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    assert.equal((turn.searchJson.answer as PlatformKnowledgeAnswer).sourceId, "booking-resume");
  }

  {
    const { turn, supportProduceCalls, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: "ja",
      deps: {
        detect_booking_resume_intent: () => true,
        produce_booking_resume_turn: async () => ({ handled: false }),
        detect_support_resume_intent: () => true,
        load_companion_conversation_messages: async () => ({
          status: "loaded",
          messages: canonicalSupportLoadedMessages,
        }),
        produce_support_resume_turn: async () => ({
          handled: true,
          answer: {
            ...supportProducerAnswer,
            directAnswer: "Support approval still pending",
            pendingSupportWrite: { actionRequestId: VALID_ACTION_REQUEST_ID },
          },
        }),
      },
    });
    assert.equal(supportProduceCalls, 1);
    assert.equal(proposalCalls, 0);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    const answer = turn.searchJson.answer as PlatformKnowledgeAnswer & {
      pendingSupportWrite?: { actionRequestId: string };
    };
    assert.deepEqual(answer.pendingSupportWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });
  }

  {
    const { turn, supportProduceCalls } = await runExecuteTurnWithResumeDeps({
      query: "random question about billing",
      deps: {
        detect_booking_resume_intent: () => false,
        detect_support_resume_intent: () => false,
        load_companion_conversation_messages: async () => ({
          status: "loaded",
          messages: canonicalSupportLoadedMessages,
        }),
      },
    });
    assert.equal(supportProduceCalls, 0);
    assert.equal(turn.ok, true);
  }

  {
    const olderPointer = "b2c3d4e5-f6a7-4890-b123-4567890abcde";
    const { turn, supportProduceCalls, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: "ja",
      deps: {
        detect_booking_resume_intent: () => false,
        detect_support_resume_intent: () => true,
        load_companion_conversation_messages: async () => ({
          status: "loaded",
          messages: [
            {
              id: "old",
              role: "aipify",
              content: "Old pointer",
              timestamp: 1,
              pendingSupportWrite: { actionRequestId: olderPointer },
            } as CompanionChatMessage,
            {
              id: "new",
              role: "aipify",
              content: "No pointer on newest",
              timestamp: 2,
            },
          ],
        }),
        produce_support_resume_turn: async () => ({ handled: false }),
      },
    });
    assert.equal(supportProduceCalls, 1);
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
  }

  for (const outcome of ["executed", "rejected", "expired", "failed"] as const) {
    const { turn, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: "ja",
      deps: {
        detect_booking_resume_intent: () => false,
        detect_support_resume_intent: () => true,
        load_companion_conversation_messages: async () => ({
          status: "loaded",
          messages: canonicalSupportLoadedMessages,
        }),
        produce_support_resume_turn: async () => ({
          handled: true,
          answer: {
            ...supportProducerAnswer,
            directAnswer: `Support ${outcome}`,
            pendingSupportWrite: undefined,
          },
        }),
      },
    });
    assert.equal(proposalCalls, 0);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    assert.equal(
      (turn.searchJson.answer as PlatformKnowledgeAnswer & { pendingSupportWrite?: unknown })
        .pendingSupportWrite,
      undefined,
    );
  }
}

async function testExecuteTurnSupportProposalWiring() {
  const assignQuery = "Assign support case P112-C3X to Alex. This is a controlled E2E.";

  {
    const { turn, supportProposalCalls } = await runExecuteTurnWithResumeDeps({
      query: assignQuery,
      deps: {
        detect_booking_resume_intent: () => false,
        detect_support_resume_intent: () => false,
        produce_support_proposal_turn: async () => ({
          handled: true,
          answer: supportProposalBaseAnswer,
          writeResult: {
            outcome: "approval_required",
            action_request_id: VALID_ACTION_REQUEST_ID,
          },
        }),
      },
    });
    assert.equal(supportProposalCalls, 1);
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    const answer = turn.searchJson.answer as PlatformKnowledgeAnswer & {
      pendingSupportWrite?: { actionRequestId: string };
    };
    assert.deepEqual(answer.pendingSupportWrite, { actionRequestId: VALID_ACTION_REQUEST_ID });
    const serialized = serializeAssistantPayload({
      id: "c1",
      role: "aipify",
      content: answer.directAnswer,
      directAnswer: answer.directAnswer,
      timestamp: 1000,
      pendingSupportWrite: answer.pendingSupportWrite,
    } as AssistantMessageWithPendingSupport);
    assert.deepEqual(serialized.pending_support_write, { action_request_id: VALID_ACTION_REQUEST_ID });
  }

  {
    const { turn } = await runExecuteTurnWithResumeDeps({
      query: assignQuery,
      deps: {
        detect_booking_resume_intent: () => false,
        detect_support_resume_intent: () => false,
        produce_support_proposal_turn: async () => ({
          handled: true,
          answer: supportProposalBaseAnswer,
          writeResult: { outcome: "approval_required", action_request_id: null },
        }),
      },
    });
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    assert.equal(
      (turn.searchJson.answer as PlatformKnowledgeAnswer & { pendingSupportWrite?: unknown })
        .pendingSupportWrite,
      undefined,
    );
  }

  {
    const { turn } = await runExecuteTurnWithResumeDeps({
      query: assignQuery,
      deps: {
        detect_booking_resume_intent: () => false,
        detect_support_resume_intent: () => false,
        produce_support_proposal_turn: async () => ({
          handled: true,
          answer: supportProposalBaseAnswer,
          writeResult: { outcome: "confirmation_required", action_request_id: null },
        }),
      },
    });
    assert.equal(turn.ok, true);
    if (!turn.ok) return;
    assert.equal(
      (turn.searchJson.answer as PlatformKnowledgeAnswer & { pendingSupportWrite?: unknown })
        .pendingSupportWrite,
      undefined,
    );
  }

  {
    const { turn, supportProposalCalls, proposalCalls } = await runExecuteTurnWithResumeDeps({
      query: "Hva tenker du om kaffe?",
      deps: {
        detect_booking_resume_intent: () => false,
        detect_support_resume_intent: () => false,
      },
    });
    assert.equal(supportProposalCalls, 0);
    assert.equal(proposalCalls, 1);
    assert.equal(turn.ok, true);
  }
}

async function testExecuteTurnSupportRealProducerCallGraph() {
  const { produceSupportResumeTurn } = await import(
    "@/lib/companion-runtime/support-resume-turn-producer"
  );
  const { detectBookingResumeContinuationIntent } = await import(
    "@/lib/companion-runtime/booking-resume-intent"
  );
  const executeCompanionTurn = await getExecuteCompanionTurn();

  let supportDetectCalls = 0;
  let supportProduceCalls = 0;
  let resumeExecutionCalls = 0;

  const turn = await executeCompanionTurn(
    supabaseStub,
    {
      query: "yes confirm",
      locale: "en",
      conversationId: RESUME_CONVERSATION_ID,
      workerProfile: workerProfileStub,
      turnRoute: "lightweight",
    },
    {
      detect_booking_resume_intent: () => false,
      detect_support_resume_intent: (query) => {
        supportDetectCalls += 1;
        return detectBookingResumeContinuationIntent(query);
      },
      load_companion_conversation_messages: async () => ({
        status: "loaded",
        messages: canonicalSupportLoadedMessages,
      }),
      produce_support_resume_turn: async (turnInput) => {
        supportProduceCalls += 1;
        return produceSupportResumeTurn(turnInput, {
          resume_execution: async (actionRequestId) => {
            resumeExecutionCalls += 1;
            assert.equal(actionRequestId, VALID_ACTION_REQUEST_ID);
            return {
              outcome: "executed",
              action_request_id: actionRequestId,
              receipt_id: "d1d2e3f4-a5b6-4789-a012-3456789abcde",
              idempotent_replay: false,
            };
          },
        });
      },
    },
  );

  assert.equal(supportDetectCalls, 1);
  assert.equal(supportProduceCalls, 1);
  assert.equal(resumeExecutionCalls, 1);
  assert.equal(turn.ok, true);
  if (!turn.ok) return;

  const answer = turn.searchJson.answer as PlatformKnowledgeAnswer & {
    pendingSupportWrite?: { actionRequestId: string };
  };
  assert.equal(answer.sourceId, "support-resume");
  assert.equal(answer.pendingSupportWrite, undefined);
}

testIdempotencyKeyStable();
testDeserializeAssistantRoundTrip();
testMapServerMessagesOrder();
testClientMessageIdUnique();
testQueueWaitPhaseProgression();
testPendingBookingWriteHandoffContract();
testPendingBookingWriteInvalidInputs();
testPendingBookingClarificationHandoffContract();
testPlatformAnswerPendingBookingWriteSearchToChatContract();

void testExecuteTurnResumeWiring()
  .then(() => testExecuteTurnRealProducerCallGraph())
  .then(() => testExecuteTurnProposalWiring())
  .then(() => {
    testExecuteTurnSupportApprovalHandoff();
    return testExecuteTurnSupportResumeWiring();
  })
  .then(() => testExecuteTurnSupportProposalWiring())
  .then(() => testExecuteTurnSupportRealProducerCallGraph())
  .then(() => {
    console.log("chat-queue.test.ts: all assertions passed");
  });
