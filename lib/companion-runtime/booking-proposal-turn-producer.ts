import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionChatMessage } from "@/lib/app/companion/types";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { BookingPermissionContext } from "@/lib/integration-intelligence/booking/permissions";
import { canProposeBookingWrite } from "@/lib/integration-intelligence/booking/permissions";
import type { BookingWriteResult } from "@/lib/integration-intelligence/booking/types";
import {
  APPOINTMENT_BOOKING_PROVIDER_MANIFESTS,
} from "@/lib/integration-intelligence/providers/appointment-booking/booking-manifest";
import {
  buildAppointmentBookingReadBundle,
  type AppointmentCenterProxyPayload,
  type AppointmentCenterProxyRow,
} from "@/lib/integration-intelligence/providers/appointment-booking/appointment-booking-contract";
import { isBookingWriteSourceConnected } from "@/lib/integration-intelligence/providers/appointment-booking/booking-source-map";
import { parseIdentityPermissionsDashboard } from "@/lib/aipify/identity-permissions/parse";
import { resolveAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  buildPendingBookingClarificationState,
  isExpiredPendingBookingClarification,
  resolvePendingBookingClarificationPointer,
  validatePendingBookingClarification,
  type PendingBookingClarificationState,
} from "./booking-pending-action-pointer";
import {
  collectBookingDescriptorsFromManifests,
  resolveBookingSemanticIntent,
  type BookingSemanticIntent,
} from "./booking-semantic-intent";
import {
  assembleBookingWriteRequest,
  type BookingWriteClarificationReason,
} from "./booking-write-request-assembler";
import { executeBookingWrite } from "./booking-write-orchestrator";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.booking.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.booking.sourceLabel";
const BOOKING_PROPOSAL_SOURCE_ID = "booking-proposal";

export type ProduceBookingProposalTurnInput = {
  supabase: SupabaseClient;
  query: string;
  locale: CustomerActiveLocale;
  t: Translator;
  userRole: string;
  conversationId?: string;
  messages?: readonly CompanionChatMessage[];
};

export type BookingProposalReadContext = {
  permission: BookingPermissionContext;
  organization_id: string;
  bundle: ReturnType<typeof buildAppointmentBookingReadBundle>;
};

export type ProduceBookingProposalTurnDeps = {
  resolve_semantic_intent?: (query: string, locale: CustomerActiveLocale) => BookingSemanticIntent;
  translate?: Translator;
  load_read_context?: (
    input: ProduceBookingProposalTurnInput,
  ) => Promise<BookingProposalReadContext | null>;
  execute_booking_write?: (
    input: Parameters<typeof executeBookingWrite>[0],
  ) => Promise<BookingWriteResult>;
  now?: () => Date;
};

export type ProduceBookingProposalTurnResult =
  | { handled: false }
  | { handled: true; answer: PlatformKnowledgeAnswer };

export function isClearBookingCreateIntent(intent: BookingSemanticIntent): boolean {
  return (
    intent.capability_key === "booking.create" &&
    intent.operation === "create" &&
    intent.confidence !== "low"
  );
}

function isAppSuspended(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function asRowArray(value: unknown): AppointmentCenterProxyRow[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is AppointmentCenterProxyRow => Boolean(entry && typeof entry === "object"));
}

export function normalizeAppointmentCenterRpcPayload(
  organizationId: string,
  data: Record<string, unknown>,
): AppointmentCenterProxyPayload | null {
  if (data.found === false) return null;

  const fetchedAt = new Date().toISOString();
  const sourceReference = "rpc:get_organization_appointment_center:services";

  const services = asRowArray(data.services).map((row) => {
    const record = row as Record<string, unknown>;
    return {
      service_key: row.service_key,
      name:
        typeof row.name === "string"
          ? row.name
          : typeof row.label === "string"
            ? row.label
            : typeof record.service_title === "string"
              ? record.service_title
              : undefined,
      duration_minutes: row.duration_minutes,
      prep_minutes: row.prep_minutes,
      cleanup_minutes: row.cleanup_minutes,
      buffer_minutes: row.buffer_minutes,
      price_label:
        typeof row.price_label === "string"
          ? row.price_label
          : record.price_amount != null
            ? String(record.price_amount)
            : undefined,
      resource_type: row.resource_type,
      location_label: row.location_label,
    };
  });

  const employees = asRowArray(data.employees).map((row) => {
    const record = row as Record<string, unknown>;
    return {
      employee_key: row.employee_key,
      label:
        typeof row.label === "string"
          ? row.label
          : typeof record.employee_label === "string"
            ? record.employee_label
            : undefined,
      location_label: row.location_label,
    };
  });

  const resources = asRowArray(data.resources).map((row) => {
    const record = row as Record<string, unknown>;
    return {
      resource_key: row.resource_key,
      label:
        typeof row.label === "string"
          ? row.label
          : typeof record.resource_title === "string"
            ? record.resource_title
            : undefined,
    };
  });

  const appointments = asRowArray(data.appointments).map((row) => {
    const record = row as Record<string, unknown>;
    return {
      appointment_key: row.appointment_key,
      service_key: row.service_key,
      employee_key: row.employee_key,
      customer_label: row.customer_label,
      start_at:
        typeof row.start_at === "string"
          ? row.start_at
          : typeof record.starts_at === "string"
            ? record.starts_at
            : undefined,
      end_at:
        typeof row.end_at === "string"
          ? row.end_at
          : typeof record.ends_at === "string"
            ? record.ends_at
            : undefined,
      status_key: row.status_key,
      location_label: row.location_label,
    };
  });

  return {
    organization_id: organizationId,
    source_reference: sourceReference,
    fetched_at: fetchedAt,
    settings:
      data.settings && typeof data.settings === "object"
        ? (data.settings as Record<string, unknown>)
        : {},
    services,
    employees,
    resources,
    appointments,
    availability_rules: asRowArray(data.availability_rules),
    absences: asRowArray(data.absences),
    vacation_integration: asRowArray(data.vacation_integration),
  };
}

export function extractBookingCustomerReference(query: string): string | null {
  const explicit = query.match(
    /\b(?:for|til)\s+(?:testkunde|kunde|customer)\s+([A-Za-z0-9][A-Za-z0-9._-]{2,})/i,
  );
  if (explicit?.[1]) return explicit[1].trim();

  const bare = query.match(/\b(P112-[A-Z0-9-]+)\b/i);
  return bare?.[1]?.trim() ?? null;
}

function resolveProposalSlotStartAt(slots: readonly { start_at: string }[]): string | null {
  if (slots.length === 1) {
    return slots[0]?.start_at?.trim() || null;
  }
  return null;
}

function stripFollowUpLabelledFields(query: string): string {
  const labelPattern =
    "kunde|customer|tjeneste|service|ressurs|ansatt|employee|behandler|tidspunkt|time|slot|varighet|duration";
  const valuePattern = "(?:[^.;]|\\bkl\\.)+?";
  const nextLabel =
    "varighet|duration|kunde|customer|tjeneste|service|ressurs|ansatt|employee|behandler|tidspunkt|time|slot|opprett|bekreft|confirm";
  const pattern = new RegExp(
    `\\b(?:${labelPattern})\\s*:\\s*${valuePattern}(?=\\.(?:\\s+(?:${nextLabel})\\b|$)|\\s*$)`,
    "gi",
  );

  return query
    .replace(pattern, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[\s.,;]+|[\s.,;]+$/g, "");
}

function normalizeFollowUpToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function looksLikeCustomerReferenceToken(token: string): boolean {
  const trimmed = token.trim();
  if (!trimmed) return true;

  if (/^customer[-_][a-z0-9-]+$/i.test(trimmed)) return true;

  const extracted = extractBookingCustomerReference(trimmed);
  return extracted === trimmed;
}

function looksLikeDateOrTimeToken(token: string): boolean {
  const normalized = normalizeFollowUpToken(token);
  if (!normalized) return true;

  if (/\bkl\.?\s*\d/.test(normalized)) return true;
  if (/\d{1,2}[:.]\d{2}/.test(normalized)) return true;
  if (/\b\d{1,2}\.\s*(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\b/.test(normalized)) {
    return true;
  }

  return /\b(mandag|tirsdag|onsdag|torsdag|fredag|lordag|søndag|sondag|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(
    normalized,
  );
}

const UNLABELLED_RESOURCE_CANDIDATE_MAX_WORDS = 5;
const UNLABELLED_RESOURCE_CANDIDATE_MAX_LENGTH = 48;

function isRejectedUnlabelledResourceCandidate(token: string): boolean {
  const trimmed = token.trim();
  if (!trimmed) return true;

  const normalized = normalizeFollowUpToken(trimmed);
  if (normalized.length < 2) return true;
  if (trimmed.length > UNLABELLED_RESOURCE_CANDIDATE_MAX_LENGTH) return true;
  if (trimmed.split(/\s+/).length > UNLABELLED_RESOURCE_CANDIDATE_MAX_WORDS) return true;
  if (/^(ja|yes|nei|no|bekreft|confirm|ok)$/.test(normalized)) return true;
  if (looksLikeCustomerReferenceToken(trimmed)) return true;
  if (looksLikeDateOrTimeToken(trimmed)) return true;
  if (
    /\b(bestill|bekreft|confirm|booking|opprett|avtale|testkunde|time for)\b/i.test(normalized)
  ) {
    return true;
  }

  return false;
}

function extractUnlabelledResourceCandidate(query: string): string | null {
  const stripped = stripFollowUpLabelledFields(query);
  if (!stripped) return null;

  const segments = stripped
    .split(/[.;]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  const candidates = segments.filter((segment) => !isRejectedUnlabelledResourceCandidate(segment));

  if (candidates.length !== 1) {
    return null;
  }

  return candidates[0] ?? null;
}

function extractFollowUpLabelValue(
  query: string,
  labels: readonly string[],
  options?: { allowKlAbbreviation?: boolean },
): string | null {
  const labelPattern = labels.join("|");
  const valuePattern = options?.allowKlAbbreviation ? "(?:[^.;]|\\bkl\\.)+?" : "[^.;]+";
  const nextLabel =
    "varighet|duration|kunde|customer|tjeneste|service|ressurs|ansatt|employee|behandler|tidspunkt|time|slot|opprett|bekreft|confirm";
  const match = query.match(
    new RegExp(
      `\\b(?:${labelPattern})\\s*:\\s*(${valuePattern})(?=\\.(?:\\s+(?:${nextLabel})\\b|$)|\\s*$)`,
      "i",
    ),
  );
  return match?.[1]?.trim() ?? null;
}

export type ExtractBookingFollowUpFieldsOptions = {
  /** When true, remaining short unlabelled text may resolve employee/resource in clarification follow-ups. */
  allowUnlabelledResourceCandidate?: boolean;
};

export function extractBookingFollowUpFields(
  query: string,
  options?: ExtractBookingFollowUpFieldsOptions,
): {
  customerReference: string | null;
  serviceLabel: string | null;
  resourceName: string | null;
  dateHint: string | null;
} {
  const customerFromLabel = extractFollowUpLabelValue(query, ["kunde", "customer"]);
  const serviceLabel = extractFollowUpLabelValue(query, ["tjeneste", "service"]);
  const dateHint = extractFollowUpLabelValue(query, ["tidspunkt", "time", "slot"], {
    allowKlAbbreviation: true,
  });
  const resourceNameFromLabel = extractFollowUpLabelValue(query, [
    "ressurs",
    "ansatt",
    "employee",
    "behandler",
  ]);
  const resourceName =
    resourceNameFromLabel ??
    (options?.allowUnlabelledResourceCandidate
      ? extractUnlabelledResourceCandidate(query)
      : null);

  return {
    customerReference: customerFromLabel ?? extractBookingCustomerReference(query),
    serviceLabel,
    resourceName,
    dateHint,
  };
}

export function isBookingClarificationFollowUpAttempt(query: string): boolean {
  return /\b(bekreft|confirm|ja|yes|kunde|tjeneste|tidspunkt|booking|bestill|avtale|opprett)\b/i.test(
    query,
  );
}

function buildMergedCreateIntent(input: {
  semanticIntent: BookingSemanticIntent;
  clarification: PendingBookingClarificationState;
  followUp: ReturnType<typeof extractBookingFollowUpFields>;
}): BookingSemanticIntent {
  const { semanticIntent, clarification, followUp } = input;
  return {
    capability_key: "booking.create",
    entity: "booking",
    operation: "create",
    metric: null,
    booking_id: null,
    service_id:
      followUp.serviceLabel ?? clarification.serviceLabel ?? semanticIntent.service_id,
    resource_name:
      followUp.resourceName ?? clarification.resourceName ?? semanticIntent.resource_name,
    date_hint: followUp.dateHint ?? clarification.dateHint ?? semanticIntent.date_hint,
    confirmed: semanticIntent.confirmed,
    confidence: semanticIntent.confirmed ? "high" : "moderate",
    ambiguous: !semanticIntent.confirmed,
  };
}

function buildClarificationState(input: {
  organizationId: string;
  conversationId: string;
  customerReference: string | null;
  serviceLabel: string | null;
  resourceName: string | null;
  dateHint: string | null;
  slotStartAt: string | null;
  missingFields: readonly BookingWriteClarificationReason[];
  now: Date;
}): PendingBookingClarificationState {
  return buildPendingBookingClarificationState({
    organizationId: input.organizationId,
    conversationId: input.conversationId,
    customerReference: input.customerReference,
    serviceLabel: input.serviceLabel,
    resourceName: input.resourceName,
    dateHint: input.dateHint,
    slotStartAt: input.slotStartAt,
    missingFields: input.missingFields,
    now: input.now,
  });
}

function buildBookingProposalAnswer(input: {
  t: Translator;
  directAnswer: string;
  pendingBookingWrite?: { actionRequestId: string };
  pendingBookingClarification?: PendingBookingClarificationState;
}): PlatformKnowledgeAnswer {
  return {
    directAnswer: input.directAnswer,
    steps: [],
    actions: [],
    sources: [
      {
        id: BOOKING_PROPOSAL_SOURCE_ID,
        label: input.t(SOURCE_LABEL_KEY),
        kind: "customer_context",
      },
    ],
    sourceId: BOOKING_PROPOSAL_SOURCE_ID,
    source: "customer_context",
    confidence: "high",
    orgConfirmEligible: false,
    showSupportEscalation: false,
    ...(input.pendingBookingWrite ? { pendingBookingWrite: input.pendingBookingWrite } : {}),
    ...(input.pendingBookingClarification
      ? { pendingBookingClarification: input.pendingBookingClarification }
      : {}),
  };
}

async function loadBookingProposalTranslator(locale: CustomerActiveLocale): Promise<Translator> {
  const { getCustomerAppDictionaryForSplits } = await import("@/lib/i18n/get-dictionary");
  const { createTranslator } = await import("@/lib/i18n/translate");
  const dict = await getCustomerAppDictionaryForSplits(locale, ["companion", "companionPlatformKnowledge"]);
  return createTranslator(dict);
}

function mapBookingProposalWriteResult(input: {
  result: BookingWriteResult;
  t: Translator;
}): PlatformKnowledgeAnswer {
  const { result, t } = input;

  if (result.outcome === "approval_required") {
    const persistedId = result.action_request_id?.trim() || null;
    if (!persistedId) {
      return buildBookingProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.failed`),
      });
    }

    return buildBookingProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.approvalRequired`),
      pendingBookingWrite: { actionRequestId: persistedId },
    });
  }

  if (result.outcome === "confirmation_required") {
    return buildBookingProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.confirmationRequired`),
    });
  }

  if (result.outcome === "permission_denied") {
    return buildBookingProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
    });
  }

  if (result.outcome === "provider_missing" || result.outcome === "activation_pending") {
    return buildBookingProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.providerMissing`),
    });
  }

  if (result.outcome === "execution_source_missing") {
    return buildBookingProposalAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.executionSourceMissing`),
    });
  }

  return buildBookingProposalAnswer({
    t,
    directAnswer: t(`${OUTCOME_BASE}.failed`),
  });
}

export async function loadBookingProposalReadContext(
  input: ProduceBookingProposalTurnInput,
): Promise<BookingProposalReadContext | null> {
  const [orgContext, permissionsResult, overviewResult, catalogResult] = await Promise.all([
    resolveAppOrganizationContext(input.supabase),
    input.supabase.rpc("get_identity_permissions_dashboard"),
    input.supabase.rpc("get_organization_appointment_center", { p_section: "overview" }),
    input.supabase.rpc("get_organization_appointment_center", { p_section: "services" }),
  ]);

  const organizationId = orgContext.organization_id?.trim() || null;
  const tenantId = orgContext.company_id?.trim() || organizationId;
  if (!organizationId || !tenantId || orgContext.state !== "ready") {
    return null;
  }

  const effectivePermissions = permissionsResult.error
    ? []
    : (parseIdentityPermissionsDashboard(permissionsResult.data)?.user_permissions ?? []);

  const overview =
    overviewResult.data && typeof overviewResult.data === "object"
      ? (overviewResult.data as Record<string, unknown>)
      : null;
  const settings =
    overview?.settings && typeof overview.settings === "object"
      ? (overview.settings as Record<string, unknown>)
      : {};
  const appointmentEnabled =
    overview?.found !== false && settings.companion_booking_enabled !== false;

  const permission: BookingPermissionContext = {
    organization_id: organizationId,
    tenant_id: tenantId,
    user_role: input.userRole,
    app_suspended: isAppSuspended(orgContext.license_status),
    provider_active: appointmentEnabled,
    can_read_services: effectivePermissions.includes("appointments.view"),
    can_read_bookings: effectivePermissions.includes("appointments.view"),
    can_read_availability: effectivePermissions.includes("appointments.view"),
    can_write_booking: effectivePermissions.includes("appointments.manage"),
    rate_limit_ok: true,
  };

  const catalogData =
    catalogResult.data && typeof catalogResult.data === "object"
      ? (catalogResult.data as Record<string, unknown>)
      : null;
  const payload = catalogData ? normalizeAppointmentCenterRpcPayload(organizationId, catalogData) : null;
  if (!payload) {
    return { permission, organization_id: organizationId, bundle: buildAppointmentBookingReadBundle({
      organization_id: organizationId,
      source_reference: "rpc:get_organization_appointment_center:empty",
      fetched_at: new Date().toISOString(),
      settings: {},
    }) };
  }

  return {
    permission,
    organization_id: organizationId,
    bundle: buildAppointmentBookingReadBundle(payload, { retainInternalMatchLabels: true }),
  };
}

export async function produceBookingProposalTurn(
  input: ProduceBookingProposalTurnInput,
  deps: ProduceBookingProposalTurnDeps = {},
): Promise<ProduceBookingProposalTurnResult> {
  const now = deps.now?.() ?? new Date();
  const conversationId = input.conversationId?.trim() ?? "";
  const messages = input.messages ?? [];
  const clarificationCandidate = conversationId
    ? resolvePendingBookingClarificationPointer(messages)
    : null;
  const expiredClarification =
    clarificationCandidate &&
    isExpiredPendingBookingClarification(clarificationCandidate, now)
      ? clarificationCandidate
      : null;

  const resolveIntent =
    deps.resolve_semantic_intent ??
    ((query: string, locale: CustomerActiveLocale) =>
      resolveBookingSemanticIntent({
        query,
        locale,
        descriptors: collectBookingDescriptorsFromManifests(APPOINTMENT_BOOKING_PROVIDER_MANIFESTS),
      }));

  const semanticIntent = resolveIntent(input.query, input.locale);
  const clearCreate = isClearBookingCreateIntent(semanticIntent);
  const mightHandle = clearCreate || clarificationCandidate != null;

  if (!mightHandle) {
    return { handled: false };
  }

  const t = deps.translate ?? (await loadBookingProposalTranslator(input.locale));

  const readContext = deps.load_read_context
    ? await deps.load_read_context(input)
    : await loadBookingProposalReadContext(input);

  if (!readContext) {
    return {
      handled: true,
      answer: buildBookingProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
      }),
    };
  }

  if (!canProposeBookingWrite(readContext.permission)) {
    return {
      handled: true,
      answer: buildBookingProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
      }),
    };
  }

  const validatedClarification =
    clarificationCandidate && conversationId
      ? validatePendingBookingClarification({
          state: clarificationCandidate,
          conversationId,
          organizationId: readContext.organization_id,
          now,
        })
      : null;

  if (
    expiredClarification &&
    !validatedClarification &&
    isBookingClarificationFollowUpAttempt(input.query)
  ) {
    return {
      handled: true,
      answer: buildBookingProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.clarificationRequired`),
      }),
    };
  }

  if (!validatedClarification && !clearCreate) {
    return { handled: false };
  }

  const clarificationNeedsEmployee =
    validatedClarification?.missingFields.includes("employee_missing") ?? false;
  const followUp = extractBookingFollowUpFields(input.query, {
    allowUnlabelledResourceCandidate: clarificationNeedsEmployee,
  });
  const intent = validatedClarification
    ? buildMergedCreateIntent({
        semanticIntent,
        clarification: validatedClarification,
        followUp,
      })
    : semanticIntent;

  const customerReference =
    followUp.customerReference ??
    validatedClarification?.customerReference ??
    extractBookingCustomerReference(input.query);
  const serviceLabel =
    followUp.serviceLabel ?? validatedClarification?.serviceLabel ?? intent.service_id;
  const resourceName =
    followUp.resourceName ?? validatedClarification?.resourceName ?? intent.resource_name;
  const dateHint = followUp.dateHint ?? validatedClarification?.dateHint ?? intent.date_hint;
  const slotStartAt =
    validatedClarification?.slotStartAt ??
    resolveProposalSlotStartAt(readContext.bundle.availability_slots);

  const assemblyIntent: BookingSemanticIntent = {
    ...intent,
    capability_key: "booking.create",
    entity: "booking",
    operation: "create",
    booking_id: null,
    service_id: serviceLabel,
    resource_name: resourceName,
    date_hint: dateHint,
  };

  const assembly = assembleBookingWriteRequest({
    intent: assemblyIntent,
    confirmed: semanticIntent.confirmed,
    services: readContext.bundle.services,
    resources: readContext.bundle.resources,
    availability_slots: readContext.bundle.availability_slots,
    customer_reference: customerReference,
    slot_start_at: slotStartAt,
  });

  if (assembly.status === "needs_clarification") {
    const pendingBookingClarification =
      conversationId.length > 0
        ? buildClarificationState({
            organizationId: readContext.organization_id,
            conversationId,
            customerReference,
            serviceLabel,
            resourceName,
            dateHint,
            slotStartAt,
            missingFields: assembly.reasons,
            now,
          })
        : undefined;

    return {
      handled: true,
      answer: buildBookingProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.clarificationRequired`),
        ...(pendingBookingClarification ? { pendingBookingClarification } : {}),
      }),
    };
  }

  if (assembly.status !== "assembled") {
    return {
      handled: true,
      answer: buildBookingProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.failed`),
      }),
    };
  }

  if (!assembly.request.confirmed) {
    return {
      handled: true,
      answer: buildBookingProposalAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.confirmationRequired`),
      }),
    };
  }

  const executeWrite = deps.execute_booking_write ?? executeBookingWrite;
  const writeResult = await executeWrite({
    organization_id: readContext.organization_id,
    tenant_id: readContext.permission.tenant_id,
    user_role: readContext.permission.user_role,
    permission: readContext.permission,
    provider_key: "appointment_booking",
    provider_write: {
      write_source_available: isBookingWriteSourceConnected("booking.create"),
      requires_approval_before_execution: true,
    },
    supabase: input.supabase,
    request: assembly.request,
  });

  return {
    handled: true,
    answer: mapBookingProposalWriteResult({ result: writeResult, t }),
  };
}
