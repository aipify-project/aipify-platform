import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { BookingSemanticIntent } from "@/lib/companion-runtime/booking-semantic-intent";
import type { BookingWriteRequest, BookingWriteResult } from "@/lib/integration-intelligence/booking/types";
import type { Translator } from "@/lib/i18n/translate";
import type { BookingPermissionContext } from "@/lib/integration-intelligence/booking/permissions";
import {
  extractBookingFollowUpFields,
  isClearBookingCreateIntent,
  produceBookingProposalTurn,
  resolveServiceLabelFromCatalogQuery,
  type BookingProposalReadContext,
  type ProduceBookingProposalTurnResult,
} from "@/lib/companion-runtime/booking-proposal-turn-producer";
import { resolveBookingSemanticIntent, collectBookingDescriptorsFromManifests } from "@/lib/companion-runtime/booking-semantic-intent";
import { APPOINTMENT_BOOKING_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/providers/appointment-booking/booking-manifest";
import {
  buildPendingBookingClarificationState,
  coercePendingBookingClarification,
  validatePendingBookingClarification,
} from "@/lib/companion-runtime/booking-pending-action-pointer";
import {
  deserializeAssistantMessage,
  serializeAssistantPayload,
} from "@/lib/app/companion/chat-queue/message-payload";
import { buildAppointmentBookingReadBundle } from "@/lib/integration-intelligence/providers/appointment-booking/appointment-booking-contract";
import type {
  AvailabilitySlot,
  EmployeeResourceSummary,
  ServiceSummary,
} from "@/lib/integration-intelligence/booking/types";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.booking.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.booking.sourceLabel";
const ACTION_REQUEST_ID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
const CLARIFICATION_ID = "c1a2r3i4-f5c6-4789-a012-3456789abcde";
const CONVERSATION_ID = "conv-70dc57a4-287d-4c01-915d-510be2b5f98b";
const FIXED_NOW = new Date("2026-06-27T05:20:00.000Z");
const supabaseStub = {} as SupabaseClient;

const TRANSLATIONS: Record<string, string> = {
  [`${OUTCOME_BASE}.approvalRequired`]: "Approval is required before booking can proceed.",
  [`${OUTCOME_BASE}.confirmationRequired`]: "Explicit confirmation is required before Aipify can prepare this booking.",
  [`${OUTCOME_BASE}.clarificationRequired`]: "Aipify needs more detail before preparing a booking action.",
  [`${OUTCOME_BASE}.permissionDenied`]: "Your role cannot prepare booking actions.",
  [`${OUTCOME_BASE}.failed`]: "The booking could not be prepared.",
  [SOURCE_LABEL_KEY]: "Services & appointment booking",
};

const t: Translator = (key) => TRANSLATIONS[key] ?? key;

const services: ServiceSummary[] = [
  {
    service_id: "svc_cut_color",
    name: "Cut and color",
    duration_minutes: 90,
    buffer_before: 0,
    buffer_after: 15,
    price_summary: null,
    required_resource_type: "employee",
    location: "Salon 1",
    source_reference: "appointment_center",
    freshness: "fresh",
    completeness: "complete",
  },
];

const controlledService: ServiceSummary = {
  service_id: "svc_controlled",
  name: "Kontrollert testavtale",
  duration_minutes: 60,
  buffer_before: 0,
  buffer_after: 0,
  price_summary: null,
  required_resource_type: "employee",
  location: "Salon 1",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const resources: EmployeeResourceSummary[] = [
  {
    resource_id: "emp_kari",
    display_name: "Kari Nordmann",
    resource_type: "employee",
    location: "Salon 1",
    source_reference: "appointment_center",
    freshness: "fresh",
    completeness: "complete",
  },
];

const controlledSlot: AvailabilitySlot = {
  resource_id: "emp_kari",
  start_at: "2026-06-24T09:00:00.000Z",
  end_at: "2026-06-24T10:00:00.000Z",
  timezone: "Europe/Oslo",
  service_id: "svc_controlled",
  location_id: null,
  availability_status: "available",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const providerEmployee: EmployeeResourceSummary = {
  resource_id: "emp_provider_a",
  display_name: "P. A***",
  match_label: "Provider A",
  resource_type: "employee",
  location: "Salon 1",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const consultationService: ServiceSummary = {
  ...controlledService,
  name: "Controlled consultation",
};

const consultationSlot: AvailabilitySlot = {
  resource_id: "emp_provider_a",
  start_at: "2026-06-29T08:00:00.000Z",
  end_at: "2026-06-29T09:00:00.000Z",
  timezone: "Europe/Oslo",
  service_id: "svc_controlled",
  location_id: null,
  availability_status: "available",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const catalogControlledConsultationService: ServiceSummary = {
  service_id: "svc_controlled_consultation",
  name: "Controlled consultation",
  duration_minutes: 60,
  buffer_before: 0,
  buffer_after: 0,
  price_summary: null,
  required_resource_type: "employee",
  location: "Salon 1",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const catalogControlledConsultationSlot: AvailabilitySlot = {
  resource_id: "emp_provider_a",
  start_at: "2026-06-29T08:00:00.000Z",
  end_at: "2026-06-29T09:00:00.000Z",
  timezone: "Europe/Oslo",
  service_id: "svc_controlled_consultation",
  location_id: null,
  availability_status: "available",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

const slotMorning: AvailabilitySlot = {
  resource_id: "emp_kari",
  start_at: "2026-06-24T09:00:00.000Z",
  end_at: "2026-06-24T10:30:00.000Z",
  timezone: "Europe/Oslo",
  service_id: "svc_cut_color",
  location_id: null,
  availability_status: "available",
  source_reference: "appointment_center",
  freshness: "fresh",
  completeness: "complete",
};

function createIntent(overrides: Partial<BookingSemanticIntent> = {}): BookingSemanticIntent {
  return {
    capability_key: "booking.create",
    entity: "booking",
    operation: "create",
    metric: null,
    booking_id: null,
    service_id: "svc_cut_color",
    resource_name: "Kari Nordmann",
    date_hint: null,
    confirmed: false,
    confidence: "moderate",
    ambiguous: true,
    ...overrides,
  };
}

function permissionContext(overrides: Partial<BookingPermissionContext> = {}): BookingPermissionContext {
  return {
    organization_id: "org-unonight",
    tenant_id: "tenant-unonight",
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    can_read_services: true,
    can_read_bookings: true,
    can_read_availability: true,
    can_write_booking: true,
    rate_limit_ok: true,
    ...overrides,
  };
}

function readContext(overrides: {
  services?: ServiceSummary[];
  resources?: EmployeeResourceSummary[];
  slots?: AvailabilitySlot[];
} = {}): BookingProposalReadContext {
  const bundle = buildAppointmentBookingReadBundle({
    organization_id: "org-unonight",
    source_reference: "test:appointment_center",
    fetched_at: new Date().toISOString(),
    settings: {},
    services: (overrides.services ?? services).map((service) => ({
      service_key: service.service_id,
      name: service.name,
      duration_minutes: service.duration_minutes ?? undefined,
      buffer_minutes: service.buffer_after ?? undefined,
    })),
    employees: (overrides.resources ?? resources).map((resource) => ({
      employee_key: resource.resource_id,
      label: resource.display_name ?? undefined,
    })),
    availability_rules: (overrides.slots ?? [slotMorning]).map((slot) => ({
      employee_key: slot.resource_id,
      service_key: slot.service_id ?? undefined,
      start_at: slot.start_at,
      end_at: slot.end_at,
      timezone: slot.timezone,
      availability_status: slot.availability_status,
    })),
  });

  return {
    organization_id: "org-unonight",
    permission: permissionContext(),
    bundle: {
      ...bundle,
      services: overrides.services ?? services,
      resources: overrides.resources ?? resources,
      availability_slots:
        overrides.slots ??
        (bundle.availability_slots.length > 0 ? bundle.availability_slots : [slotMorning]),
    },
  };
}

function writeResult(overrides: Partial<BookingWriteResult> = {}): BookingWriteResult {
  return {
    outcome: "approval_required",
    proposal: null,
    booking: null,
    outcome_key: null,
    audit_id: null,
    limitations: [],
    action_request_id: ACTION_REQUEST_ID,
    payload_hash: "hash",
    idempotency_key: "booking:idem",
    expires_at: "2099-01-01T00:00:00.000Z",
    idempotent_replay: false,
    outcome_code: "BOOKING_ACTION_REQUESTED",
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

function assertProposalAnswer(answer: PlatformKnowledgeAnswer) {
  assert.equal(answer.sourceId, "booking-proposal");
  assert.notEqual(answer.sourceId, "companion-lightweight-conversational");
}

async function runProposal(input: {
  query: string;
  intent?: BookingSemanticIntent;
  read?: BookingProposalReadContext | null;
  writeResult?: BookingWriteResult;
  conversationId?: string;
  messages?: CompanionChatMessage[];
  now?: Date;
}): Promise<{
  result: ProduceBookingProposalTurnResult;
  bridgeCalls: number;
  executionRpcCalled: boolean;
  lastWriteInput: { request: BookingWriteRequest } | null;
}> {
  let bridgeCalls = 0;
  let executionRpcCalled = false;
  let lastWriteInput: { request: BookingWriteRequest } | null = null;

  const result = await produceBookingProposalTurn(
    {
      supabase: supabaseStub,
      query: input.query,
      locale: "no",
      t,
      userRole: "owner",
      conversationId: input.conversationId,
      messages: input.messages,
    },
    {
      translate: t,
      now: () => input.now ?? FIXED_NOW,
      resolve_semantic_intent: () => input.intent ?? createIntent(),
      load_read_context: async () => input.read ?? readContext(),
      execute_booking_write: async (writeInput) => {
        bridgeCalls += 1;
        lastWriteInput = writeInput;
        if (writeInput.execute_booking_write || writeInput.execute_write) {
          executionRpcCalled = true;
        }
        return input.writeResult ?? writeResult();
      },
    },
  );

  return { result, bridgeCalls, executionRpcCalled, lastWriteInput };
}

assert.equal(
  isClearBookingCreateIntent(createIntent()),
  true,
);

function assertHandled(
  result: ProduceBookingProposalTurnResult,
): asserts result is { handled: true; answer: PlatformKnowledgeAnswer } {
  assert.equal(result.handled, true);
}

function naturalBookingCreateIntent(query: string): BookingSemanticIntent {
  return resolveBookingSemanticIntent({
    query,
    locale: "no",
    descriptors: collectBookingDescriptorsFromManifests(APPOINTMENT_BOOKING_PROVIDER_MANIFESTS),
  });
}

function catalogConsultationReadContext(
  serviceOverrides: ServiceSummary[] = [catalogControlledConsultationService],
): BookingProposalReadContext {
  return readContext({
    services: serviceOverrides,
    resources: [providerEmployee],
    slots: [catalogControlledConsultationSlot],
  });
}

function roundTripClarificationThroughProductionPayload(
  clarification: NonNullable<PlatformKnowledgeAnswer["pendingBookingClarification"]>,
) {
  const message = {
    id: "assistant-turn1",
    role: "aipify" as const,
    content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
    directAnswer: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
    pendingBookingClarification: clarification,
    timestamp: FIXED_NOW.getTime(),
  };
  const payload = serializeAssistantPayload(message);
  const wire = payload.pending_booking_clarification;
  assert.ok(wire);
  const coerced = coercePendingBookingClarification(wire);
  assert.ok(coerced);
  const validated = validatePendingBookingClarification({
    state: coerced,
    conversationId: clarification.conversationId,
    organizationId: clarification.organizationId,
    now: FIXED_NOW,
  });
  assert.ok(validated);
  const deserialized = deserializeAssistantMessage(
    "server-turn1",
    "assistant-turn1",
    message.content,
    payload as Record<string, unknown>,
    message.timestamp,
  );
  assert.ok(deserialized.pendingBookingClarification);
  return { wire, coerced, validated, deserialized };
}

async function runAll() {
const expectedDateHint = "mandag neste uke kl. 10:00";

const extractFollowUpWithUnlabelled = (query: string) =>
  extractBookingFollowUpFields(query, { allowUnlabelledResourceCandidate: true });

assert.deepEqual(extractFollowUpWithUnlabelled("Provider A. Kunde: customer-123."), {
  customerReference: "customer-123",
  serviceLabel: null,
  resourceName: "Provider A",
  dateHint: null,
});
assert.equal(
  extractFollowUpWithUnlabelled("Ansatt: Provider A. Kunde: customer-123.").resourceName,
  "Provider A",
);
assert.equal(
  extractFollowUpWithUnlabelled("emp_provider_a. Kunde: customer-123.").resourceName,
  "emp_provider_a",
);
assert.equal(
  extractFollowUpWithUnlabelled("Unknown Person. Kunde: customer-123.").resourceName,
  "Unknown Person",
);
assert.equal(extractFollowUpWithUnlabelled("Ja").resourceName, null);
assert.equal(extractFollowUpWithUnlabelled("Kunde: customer-123.").resourceName, null);
assert.equal(extractFollowUpWithUnlabelled("Provider A. Provider B.").resourceName, null);
assert.equal(
  extractBookingFollowUpFields("Bestill en time for testkunde P112 ja bekreft").resourceName,
  null,
);

assert.equal(
  extractBookingFollowUpFields("Tidspunkt: mandag neste uke kl. 10:00.").dateHint,
  expectedDateHint,
);
assert.equal(
  extractBookingFollowUpFields("Tidspunkt: mandag neste uke kl. 10:00").dateHint,
  expectedDateHint,
);

const c3xR4Turn2Query =
  "Ja, bekreft bookingen. Kunde: P112-C3X-R4. Tjeneste: Kontrollert testavtale. Tidspunkt: mandag neste uke kl. 10:00. Varighet: 60 minutter. Opprett kun én booking.";
const c3xR4FollowUp = extractBookingFollowUpFields(c3xR4Turn2Query);
const c3xR4Intent = resolveBookingSemanticIntent({
  query: c3xR4Turn2Query,
  locale: "no",
  descriptors: collectBookingDescriptorsFromManifests(APPOINTMENT_BOOKING_PROVIDER_MANIFESTS),
});
assert.equal(c3xR4FollowUp.customerReference, "P112-C3X-R4");
assert.equal(c3xR4FollowUp.serviceLabel, "Kontrollert testavtale");
assert.equal(c3xR4FollowUp.dateHint, expectedDateHint);
assert.match(c3xR4Turn2Query, /\bVarighet:\s*60 minutter/i);
assert.equal(c3xR4Intent.confirmed, true);

const emptyCatalogContinuation = await runProposal({
  query: c3xR4Turn2Query,
  intent: createIntent({
    confirmed: true,
    service_id: "Kontrollert testavtale",
    confidence: "high",
    ambiguous: false,
  }),
  read: readContext({ services: [], resources: [], slots: [] }),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "a1",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
      timestamp: 1,
      pendingBookingClarification: buildPendingBookingClarificationState({
        clarificationId: CLARIFICATION_ID,
        organizationId: "org-unonight",
        conversationId: CONVERSATION_ID,
        customerReference: "P112-C3X-R4",
        missingFields: ["service_missing"],
        now: FIXED_NOW,
      }),
    },
  ],
});
assert.equal(emptyCatalogContinuation.result.handled, true);
assertHandled(emptyCatalogContinuation.result);
assert.deepEqual(
  emptyCatalogContinuation.result.answer.pendingBookingClarification?.missingFields,
  ["service_missing"],
);
assert.equal(emptyCatalogContinuation.bridgeCalls, 0);
assert.equal(emptyCatalogContinuation.executionRpcCalled, false);

const matchedServiceContinuation = await runProposal({
  query: c3xR4Turn2Query,
  intent: createIntent({
    confirmed: true,
    service_id: "Kontrollert testavtale",
    confidence: "high",
    ambiguous: false,
  }),
  read: readContext({
    services: [controlledService],
    resources: [],
    slots: [],
  }),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "a1",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
      timestamp: 1,
      pendingBookingClarification: buildPendingBookingClarificationState({
        clarificationId: CLARIFICATION_ID,
        organizationId: "org-unonight",
        conversationId: CONVERSATION_ID,
        customerReference: "P112-C3X-R4",
        missingFields: ["service_missing"],
        now: FIXED_NOW,
      }),
    },
  ],
});
assert.equal(matchedServiceContinuation.result.handled, true);
assertHandled(matchedServiceContinuation.result);
assert.equal(
  matchedServiceContinuation.result.answer.pendingBookingClarification?.dateHint,
  expectedDateHint,
);
assert.equal(matchedServiceContinuation.bridgeCalls, 0);
assert.equal(matchedServiceContinuation.executionRpcCalled, false);

const c3xLike = await runProposal({
  query:
    "Bestill en avtale for testkunde P112-C3X-E2E-R2 mandag neste uke kl. 10:00. Dette er en kontrollert production E2E. Opprett kun én booking.",
  intent: createIntent({ confirmed: false, service_id: null, resource_name: null }),
  conversationId: CONVERSATION_ID,
});
assert.equal(c3xLike.result.handled, true);
assertHandled(c3xLike.result);
assertProposalAnswer(c3xLike.result.answer);
assert.equal(c3xLike.result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`]);
assert.ok(c3xLike.result.answer.pendingBookingClarification);
assert.equal(c3xLike.result.answer.pendingBookingClarification?.conversationId, CONVERSATION_ID);
assert.equal(c3xLike.bridgeCalls, 0);

const c3xR3Turn1 = await runProposal({
  query:
    "Bestill en avtale for testkunde P112-C3X-R3 mandag neste uke kl. 10:00. Dette er en kontrollert production E2E. Opprett kun én booking.",
  intent: createIntent({ confirmed: false, service_id: null, resource_name: null }),
  conversationId: CONVERSATION_ID,
});
assert.ok(c3xR3Turn1.result.handled === true && c3xR3Turn1.result.answer.pendingBookingClarification);
assert.equal(c3xR3Turn1.bridgeCalls, 0);

const clarificationState = buildPendingBookingClarificationState({
  clarificationId: CLARIFICATION_ID,
  organizationId: "org-unonight",
  conversationId: CONVERSATION_ID,
  customerReference: "P112-C3X-R3",
  serviceLabel: null,
  resourceName: null,
  dateHint: "mandag neste uke kl. 10:00",
  slotStartAt: null,
  missingFields: ["service_missing", "employee_missing", "slot_missing"],
  now: FIXED_NOW,
});

const c3xR3Turn2Query =
  "Ja, bekreft bookingen. Kunde: P112-C3X-R3. Tjeneste: Kontrollert testavtale. Tidspunkt: mandag neste uke kl. 10:00. Varighet: 60 minutter. Opprett kun én booking.";

const c3xR3Turn2 = await runProposal({
  query: c3xR3Turn2Query,
  intent: createIntent({
    confirmed: true,
    service_id: "Kontrollert testavtale",
    resource_name: "Kari Nordmann",
    confidence: "high",
    ambiguous: false,
  }),
  read: readContext({
    services: [controlledService, ...services],
    slots: [controlledSlot],
  }),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "u1",
      role: "user",
      content: "Bestill en avtale for testkunde P112-C3X-R3",
      timestamp: 1,
    },
    {
      id: "a1",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
      timestamp: 2,
      pendingBookingClarification: clarificationState,
    },
  ],
});
assert.equal(c3xR3Turn2.result.handled, true);
assertHandled(c3xR3Turn2.result);
assert.equal(c3xR3Turn2.bridgeCalls, 1);
assert.equal(c3xR3Turn2.result.answer.pendingBookingWrite?.actionRequestId, ACTION_REQUEST_ID);
assert.equal(c3xR3Turn2.result.answer.pendingBookingClarification, undefined);
assert.equal(c3xR3Turn2.executionRpcCalled, false);

const unlabelledTurn1Clarification = buildPendingBookingClarificationState({
  clarificationId: CLARIFICATION_ID,
  organizationId: "org-unonight",
  conversationId: CONVERSATION_ID,
  customerReference: null,
  serviceLabel: "Controlled consultation",
  resourceName: null,
  dateHint: "mandag 29. juni kl. 10",
  slotStartAt: consultationSlot.start_at,
  missingFields: ["employee_missing"],
  now: FIXED_NOW,
});

const unlabelledTurn2 = await runProposal({
  query: "Provider A. Kunde: customer-123.",
  intent: createIntent({
    confirmed: false,
    service_id: null,
    resource_name: null,
    confidence: "moderate",
    ambiguous: true,
  }),
  read: readContext({
    services: [consultationService],
    resources: [providerEmployee],
    slots: [consultationSlot],
  }),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "u-turn1",
      role: "user",
      content: "Jeg vil bestille Controlled consultation mandag 29. juni kl. 10.",
      timestamp: 1,
    },
    {
      id: "a-turn1",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
      timestamp: 2,
      pendingBookingClarification: unlabelledTurn1Clarification,
    },
  ],
});
assert.equal(unlabelledTurn2.result.handled, true);
assertHandled(unlabelledTurn2.result);
assert.equal(unlabelledTurn2.result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`]);
assert.equal(unlabelledTurn2.result.answer.pendingBookingWrite, undefined);
assert.equal(unlabelledTurn2.bridgeCalls, 0);
assert.equal(unlabelledTurn2.executionRpcCalled, false);
assert.equal(JSON.stringify(unlabelledTurn2.result.answer).includes("match_label"), false);

const NATURAL_TURN1_QUERY =
  "Jeg vil bestille Controlled consultation mandag 29. juni kl. 10.";
const NATURAL_TURN2_QUERY = "Provider A. Kunde: customer-123.";
const naturalTurn1Intent = naturalBookingCreateIntent(NATURAL_TURN1_QUERY);
assert.equal(naturalTurn1Intent.capability_key, "booking.create");
assert.equal(naturalTurn1Intent.service_id, null);

assert.equal(
  resolveServiceLabelFromCatalogQuery(NATURAL_TURN1_QUERY, [catalogControlledConsultationService]),
  "Controlled consultation",
);
assert.equal(
  resolveServiceLabelFromCatalogQuery("Jeg vil bestille Controlled mandag kl. 10.", [
    catalogControlledConsultationService,
  ]),
  null,
);
assert.equal(
  resolveServiceLabelFromCatalogQuery("Bestill en time mandag kl. 10:00", [
    catalogControlledConsultationService,
  ]),
  null,
);
assert.equal(
  resolveServiceLabelFromCatalogQuery(NATURAL_TURN1_QUERY, [
    catalogControlledConsultationService,
    { ...catalogControlledConsultationService, service_id: "svc_duplicate" },
  ]),
  null,
);

const naturalTurn1 = await runProposal({
  query: NATURAL_TURN1_QUERY,
  intent: naturalTurn1Intent,
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
});
assert.equal(naturalTurn1.result.handled, true);
assertHandled(naturalTurn1.result);
assertProposalAnswer(naturalTurn1.result.answer);
assert.equal(naturalTurn1.result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`]);
assert.ok(naturalTurn1.result.answer.pendingBookingClarification);
assert.equal(naturalTurn1.result.answer.pendingBookingClarification?.serviceLabel, "Controlled consultation");
assert.equal(naturalTurn1.result.answer.pendingBookingClarification?.slotStartAt, catalogControlledConsultationSlot.start_at);
assert.equal(
  naturalTurn1.result.answer.pendingBookingClarification?.missingFields.includes("service_missing"),
  false,
);
assert.equal(naturalTurn1.result.answer.pendingBookingClarification?.missingFields.includes("employee_missing"), true);
assert.equal(naturalTurn1.result.answer.pendingBookingWrite, undefined);
assert.equal(naturalTurn1.bridgeCalls, 0);
assert.equal(JSON.stringify(naturalTurn1.result.answer).includes("match_label"), false);

const naturalRoundTrip = roundTripClarificationThroughProductionPayload(
  naturalTurn1.result.answer.pendingBookingClarification!,
);
assert.equal(naturalRoundTrip.wire?.service_label, "Controlled consultation");
assert.equal(naturalRoundTrip.validated?.serviceLabel, "Controlled consultation");

const naturalTurn2 = await runProposal({
  query: NATURAL_TURN2_QUERY,
  intent: naturalBookingCreateIntent(NATURAL_TURN2_QUERY),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "u-natural-turn1",
      role: "user",
      content: NATURAL_TURN1_QUERY,
      timestamp: 1,
    },
    {
      id: "a-natural-turn1",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
      timestamp: 2,
      pendingBookingClarification: naturalRoundTrip.deserialized.pendingBookingClarification,
    },
  ],
});
assert.equal(naturalTurn2.result.handled, true);
assertHandled(naturalTurn2.result);
assert.equal(naturalTurn2.result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`]);
assert.ok(naturalTurn2.result.answer.pendingBookingClarification);
assert.deepEqual(naturalTurn2.result.answer.pendingBookingClarification?.missingFields, []);
assert.equal(naturalTurn2.result.answer.pendingBookingClarification?.serviceLabel, "Controlled consultation");
assert.equal(naturalTurn2.result.answer.pendingBookingClarification?.resourceName, "Provider A");
assert.equal(naturalTurn2.result.answer.pendingBookingClarification?.customerReference, "customer-123");
assert.equal(
  naturalTurn2.result.answer.pendingBookingClarification?.slotStartAt,
  catalogControlledConsultationSlot.start_at,
);
assert.equal(naturalTurn2.result.answer.pendingBookingWrite, undefined);
assert.equal(naturalTurn2.bridgeCalls, 0);
assert.equal(JSON.stringify(naturalTurn2.result.answer).includes("match_label"), false);

const naturalTurn2RoundTrip = roundTripClarificationThroughProductionPayload(
  naturalTurn2.result.answer.pendingBookingClarification!,
);
assert.deepEqual(naturalTurn2RoundTrip.wire?.missing_fields, []);
assert.equal(naturalTurn2RoundTrip.validated?.serviceLabel, "Controlled consultation");

const naturalTurn3 = await runProposal({
  query: "Ja",
  intent: naturalBookingCreateIntent("Ja"),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "u-natural-turn1",
      role: "user",
      content: NATURAL_TURN1_QUERY,
      timestamp: 1,
    },
    {
      id: "a-natural-turn1",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
      timestamp: 2,
      pendingBookingClarification: naturalRoundTrip.deserialized.pendingBookingClarification,
    },
    {
      id: "u-natural-turn2",
      role: "user",
      content: NATURAL_TURN2_QUERY,
      timestamp: 3,
    },
    {
      id: "a-natural-turn2",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
      timestamp: 4,
      pendingBookingClarification: naturalTurn2RoundTrip.deserialized.pendingBookingClarification,
    },
  ],
});
assert.equal(naturalTurn3.result.handled, true);
assertHandled(naturalTurn3.result);
assert.equal(naturalTurn3.bridgeCalls, 1);
assert.equal(naturalTurn3.result.answer.pendingBookingWrite?.actionRequestId, ACTION_REQUEST_ID);
assert.equal(naturalTurn3.result.answer.pendingBookingClarification, undefined);
assert.ok(naturalTurn3.lastWriteInput);
assert.equal(naturalTurn3.lastWriteInput.request.confirmed, true);
assert.equal(naturalTurn3.lastWriteInput.request.service_id, "svc_controlled_consultation");
assert.equal(naturalTurn3.lastWriteInput.request.resource_id, "emp_provider_a");
assert.equal(naturalTurn3.lastWriteInput.request.customer_reference, "customer-123");
assert.equal(naturalTurn3.lastWriteInput.request.start_at, catalogControlledConsultationSlot.start_at);
assert.equal(naturalTurn3.lastWriteInput.request.end_at, catalogControlledConsultationSlot.end_at);
assert.equal(JSON.stringify(naturalTurn3.result.answer).includes("match_label"), false);

const naturalTurn3Decline = await runProposal({
  query: "Nei",
  intent: naturalBookingCreateIntent("Nei"),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "u-natural-turn1",
      role: "user",
      content: NATURAL_TURN1_QUERY,
      timestamp: 1,
    },
    {
      id: "a-natural-turn1",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
      timestamp: 2,
      pendingBookingClarification: naturalRoundTrip.deserialized.pendingBookingClarification,
    },
    {
      id: "u-natural-turn2",
      role: "user",
      content: NATURAL_TURN2_QUERY,
      timestamp: 3,
    },
    {
      id: "a-natural-turn2",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
      timestamp: 4,
      pendingBookingClarification: naturalTurn2RoundTrip.deserialized.pendingBookingClarification,
    },
  ],
});
assert.equal(naturalTurn3Decline.result.handled, true);
assertHandled(naturalTurn3Decline.result);
assert.equal(naturalTurn3Decline.bridgeCalls, 0);
assert.equal(naturalTurn3Decline.result.answer.pendingBookingWrite, undefined);
assert.equal(
  naturalTurn3Decline.result.answer.directAnswer,
  TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
);

const naturalTurn3Random = await runProposal({
  query: "Hva er været i dag?",
  intent: naturalBookingCreateIntent("Hva er været i dag?"),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "a-natural-turn2",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
      timestamp: 4,
      pendingBookingClarification: naturalTurn2RoundTrip.deserialized.pendingBookingClarification,
    },
  ],
});
assert.equal(naturalTurn3Random.result.handled, true);
assertHandled(naturalTurn3Random.result);
assert.equal(naturalTurn3Random.bridgeCalls, 0);
assert.equal(naturalTurn3Random.result.answer.pendingBookingWrite, undefined);

const expiredConfirmationState = buildPendingBookingClarificationState({
  clarificationId: CLARIFICATION_ID,
  organizationId: "org-unonight",
  conversationId: CONVERSATION_ID,
  customerReference: "customer-123",
  serviceLabel: "Controlled consultation",
  resourceName: "Provider A",
  slotStartAt: catalogControlledConsultationSlot.start_at,
  missingFields: [],
  now: new Date("2026-06-27T04:00:00.000Z"),
});

const naturalTurn3Expired = await runProposal({
  query: "Ja",
  intent: naturalBookingCreateIntent("Ja"),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
  now: new Date("2026-06-27T05:30:00.000Z"),
  messages: [
    {
      id: "a-natural-turn2-expired",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
      timestamp: 4,
      pendingBookingClarification: expiredConfirmationState,
    },
  ],
});
assert.equal(naturalTurn3Expired.result.handled, true);
assertHandled(naturalTurn3Expired.result);
assert.equal(naturalTurn3Expired.bridgeCalls, 0);
assert.equal(naturalTurn3Expired.result.answer.pendingBookingWrite, undefined);
assert.equal(
  naturalTurn3Expired.result.answer.directAnswer,
  TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
);

const naturalTurn3Idempotent = await runProposal({
  query: "Ja",
  intent: naturalBookingCreateIntent("Ja"),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
  writeResult: writeResult({ idempotent_replay: true }),
  messages: [
    {
      id: "a-natural-turn2",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
      timestamp: 4,
      pendingBookingClarification: naturalTurn2RoundTrip.deserialized.pendingBookingClarification,
    },
  ],
});
assert.equal(naturalTurn3Idempotent.bridgeCalls, 1);
assert.equal(
  naturalTurn3Idempotent.result.handled === true &&
    naturalTurn3Idempotent.result.answer.pendingBookingWrite?.actionRequestId,
  ACTION_REQUEST_ID,
);

const incompleteEmptyMissingFields = buildPendingBookingClarificationState({
  clarificationId: CLARIFICATION_ID,
  organizationId: "org-unonight",
  conversationId: CONVERSATION_ID,
  customerReference: null,
  serviceLabel: null,
  resourceName: null,
  slotStartAt: null,
  missingFields: [],
  now: FIXED_NOW,
});

const incompleteConfirmationAttempt = await runProposal({
  query: "Ja",
  intent: naturalBookingCreateIntent("Ja"),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
  messages: [
    {
      id: "a-incomplete",
      role: "aipify",
      content: TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
      timestamp: 1,
      pendingBookingClarification: incompleteEmptyMissingFields,
    },
  ],
});
assert.equal(incompleteConfirmationAttempt.result.handled, true);
assertHandled(incompleteConfirmationAttempt.result);
assert.equal(incompleteConfirmationAttempt.bridgeCalls, 0);
assert.equal(
  incompleteConfirmationAttempt.result.answer.directAnswer,
  TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
);

const explicitServiceLabel = await runProposal({
  query: "Jeg vil bestille mandag kl. 10. Tjeneste: Controlled consultation.",
  intent: naturalBookingCreateIntent("Jeg vil bestille mandag kl. 10. Tjeneste: Controlled consultation."),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
});
assert.equal(explicitServiceLabel.result.handled, true);
assertHandled(explicitServiceLabel.result);
assert.equal(
  explicitServiceLabel.result.answer.pendingBookingClarification?.serviceLabel,
  "Controlled consultation",
);
assert.equal(
  explicitServiceLabel.result.answer.pendingBookingClarification?.missingFields.includes("service_missing"),
  false,
);

const stableServiceKey = await runProposal({
  query: "Bestill en time mandag kl. 10:00",
  intent: createIntent({
    service_id: "svc_controlled_consultation",
    resource_name: null,
    confirmed: false,
    confidence: "moderate",
    ambiguous: true,
  }),
  read: catalogConsultationReadContext(),
  conversationId: CONVERSATION_ID,
});
assert.equal(stableServiceKey.result.handled, true);
assertHandled(stableServiceKey.result);
assert.equal(
  stableServiceKey.result.answer.pendingBookingClarification?.missingFields.includes("service_missing"),
  false,
);

const updateWithCatalogPhrase = await runProposal({
  query: NATURAL_TURN1_QUERY,
  intent: {
    capability_key: "booking.update",
    entity: "booking",
    operation: "update",
    metric: null,
    booking_id: null,
    service_id: null,
    resource_name: null,
    date_hint: null,
    confirmed: false,
    confidence: "moderate",
    ambiguous: true,
  },
  read: catalogConsultationReadContext(),
});
assert.equal(updateWithCatalogPhrase.result.handled, false);

const expiredClarification = buildPendingBookingClarificationState({
  clarificationId: CLARIFICATION_ID,
  organizationId: "org-unonight",
  conversationId: CONVERSATION_ID,
  customerReference: "P112-C3X-R3",
  missingFields: ["service_missing"],
  now: new Date("2026-06-27T04:00:00.000Z"),
});

const expiredFollowUp = await runProposal({
  query: c3xR3Turn2Query,
  intent: createIntent({ confirmed: true, service_id: "svc_controlled" }),
  conversationId: CONVERSATION_ID,
  now: new Date("2026-06-27T05:30:00.000Z"),
  messages: [
    {
      id: "a-expired",
      role: "aipify",
      content: "clarify",
      timestamp: 1,
      pendingBookingClarification: expiredClarification,
    },
  ],
});
assert.equal(expiredFollowUp.result.handled, true);
assertHandled(expiredFollowUp.result);
assert.equal(
  expiredFollowUp.result.answer.directAnswer,
  TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`],
);
assert.equal(expiredFollowUp.result.answer.pendingBookingWrite, undefined);
assert.equal(expiredFollowUp.bridgeCalls, 0);

const missingFields = await runProposal({
  query: "Bestill en time mandag kl. 10:00",
  intent: createIntent({ service_id: null, resource_name: null, confirmed: false }),
  read: readContext({ services: [], resources: [], slots: [] }),
});
assert.equal(missingFields.result.handled, true);
assertHandled(missingFields.result);
assert.equal(missingFields.result.answer.directAnswer, TRANSLATIONS[`${OUTCOME_BASE}.clarificationRequired`]);
assert.equal(missingFields.bridgeCalls, 0);

const confirmedComplete = await runProposal({
  query: "Bestill en time for testkunde P112 ja bekreft",
  intent: createIntent({
    confirmed: true,
    service_id: "svc_cut_color",
    resource_name: "Kari Nordmann",
    confidence: "high",
    ambiguous: false,
  }),
  read: readContext({
    slots: [slotMorning],
  }),
});
assert.equal(confirmedComplete.result.handled, true);
assertHandled(confirmedComplete.result);
assert.equal(confirmedComplete.bridgeCalls, 1);
assert.equal(confirmedComplete.result.answer.pendingBookingWrite?.actionRequestId, ACTION_REQUEST_ID);
assert.equal(confirmedComplete.executionRpcCalled, false);

const idempotentRetry = await runProposal({
  query: "Bestill en time for testkunde P112 ja bekreft",
  intent: createIntent({
    confirmed: true,
    service_id: "svc_cut_color",
    resource_name: "Kari Nordmann",
    confidence: "high",
    ambiguous: false,
  }),
  writeResult: writeResult({ idempotent_replay: true }),
});
assert.equal(idempotentRetry.bridgeCalls, 1);
assert.equal(idempotentRetry.result.handled, true);
if (idempotentRetry.result.handled) {
  assert.equal(idempotentRetry.result.answer.pendingBookingWrite?.actionRequestId, ACTION_REQUEST_ID);
}

const nonBooking = await runProposal({
  query: "Hva tenker du om kaffe?",
  intent: {
    capability_key: "availability.read",
    entity: "availability",
    operation: "list",
    metric: null,
    booking_id: null,
    service_id: null,
    resource_name: null,
    date_hint: null,
    confirmed: false,
    confidence: "low",
    ambiguous: true,
  },
});
assert.equal(nonBooking.result.handled, false);

const unconfirmedCompleteFields = await runProposal({
  query: "Bestill en time for testkunde P112 mandag kl. 10:00",
  intent: createIntent({
    confirmed: false,
    service_id: "svc_cut_color",
    resource_name: "Kari Nordmann",
  }),
  read: readContext({ slots: [slotMorning] }),
});
assert.equal(unconfirmedCompleteFields.result.handled, true);
assertHandled(unconfirmedCompleteFields.result);
assert.equal(
  unconfirmedCompleteFields.result.answer.directAnswer,
  TRANSLATIONS[`${OUTCOME_BASE}.confirmationRequired`],
);
assert.equal(unconfirmedCompleteFields.bridgeCalls, 0);

console.log("booking-proposal-turn-producer.test.ts: all assertions passed");
}

runAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
