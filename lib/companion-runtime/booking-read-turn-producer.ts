import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { UserRole } from "@/lib/tenant/types";
import { assertBookingReadAllowed } from "@/lib/integration-intelligence/booking/permissions";
import type { BookingSummary } from "@/lib/integration-intelligence/booking/types";
import { APPOINTMENT_BOOKING_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/providers/appointment-booking/booking-manifest";
import { buildAppointmentBookingReadBundle } from "@/lib/integration-intelligence/providers/appointment-booking/appointment-booking-contract";
import {
  collectBookingDescriptorsFromManifests,
  isClearBookingListReadIntent,
  resolveBookingSemanticIntent,
} from "./booking-semantic-intent";
import {
  executeBookingRead,
  type BookingProviderReader,
} from "./booking-read-orchestrator";
import {
  loadBookingProposalReadContext,
  type BookingProposalReadContext,
} from "./booking-proposal-turn-producer";

const OUTCOME_BASE = "customerApp.companionPlatformKnowledge.booking.outcomes";
const SOURCE_LABEL_KEY = "customerApp.companionPlatformKnowledge.booking.sourceLabel";
const ORG_INTEL_BASE = "customerApp.companionPlatformKnowledge.organizationIntelligence";
const BOOKING_READ_SOURCE_ID = "booking-read";

export type ProduceBookingReadTurnInput = {
  supabase: SupabaseClient;
  query: string;
  locale: CustomerActiveLocale;
  userRole: UserRole;
};

export type ProduceBookingReadTurnResult =
  | { handled: false }
  | { handled: true; answer: PlatformKnowledgeAnswer };

export type ProduceBookingReadTurnDeps = {
  resolve_semantic_intent?: (query: string, locale: CustomerActiveLocale) => ReturnType<
    typeof resolveBookingSemanticIntent
  >;
  load_read_context?: (input: ProduceBookingReadTurnInput) => Promise<BookingProposalReadContext | null>;
  execute_booking_read?: typeof executeBookingRead;
  translate?: Translator;
  now?: () => Date;
};

function formatBookingTimestamp(value: string | null, locale: CustomerActiveLocale): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

function formatBookingStatus(status: string, t: Translator): string {
  const key = `customerApp.companionPlatformKnowledge.booking.status.${status}`;
  const label = t(key);
  return label !== key ? label : status;
}

function formatBookingStep(booking: BookingSummary, t: Translator, locale: CustomerActiveLocale): string {
  const when = formatBookingTimestamp(booking.start_at, locale);
  const status = formatBookingStatus(booking.status, t);
  const parts = [when, status, booking.booking_id].filter(Boolean);
  return parts.join(" · ");
}

function buildBookingReadAnswer(input: {
  t: Translator;
  directAnswer: string;
  steps?: string[];
  explanation?: string;
  confidence?: PlatformKnowledgeAnswer["confidence"];
}): PlatformKnowledgeAnswer {
  return {
    directAnswer: input.directAnswer,
    explanation: input.explanation,
    steps: input.steps ?? [],
    actions: [],
    sources: [
      {
        id: BOOKING_READ_SOURCE_ID,
        label: input.t(SOURCE_LABEL_KEY),
        kind: "customer_context",
      },
    ],
    sourceId: BOOKING_READ_SOURCE_ID,
    source: "customer_context",
    confidence: input.confidence ?? "high",
    orgConfirmEligible: false,
    showSupportEscalation: false,
  };
}

function buildBookingProviderReader(
  readContext: BookingProposalReadContext,
): BookingProviderReader {
  const bundle = readContext.bundle;
  return {
    provider_key: "appointment_booking",
    active: readContext.permission.provider_active,
    read_bundle: async () => ({
      services: bundle.services,
      resources: bundle.resources,
      availability_slots: bundle.availability_slots,
      bookings: bundle.bookings,
      absences: bundle.absences,
      vacation_modes: bundle.vacation_modes,
      limitations: bundle.limitations,
      source_exact: bundle.source_exact,
    }),
    read_booking: async (bookingId) => ({
      booking: bundle.bookings.find((entry) => entry.booking_id === bookingId) ?? null,
      limitations: [],
    }),
  };
}

async function loadBookingReadTranslator(locale: CustomerActiveLocale): Promise<Translator> {
  const { getCustomerAppDictionaryForSplits } = await import("@/lib/i18n/get-dictionary");
  const { createTranslator } = await import("@/lib/i18n/translate");
  const dict = await getCustomerAppDictionaryForSplits(locale, ["companion", "companionPlatformKnowledge"]);
  return createTranslator(dict);
}

export function mapBookingReadResultToAnswer(input: {
  result: Awaited<ReturnType<typeof executeBookingRead>>;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const { result, t, locale } = input;

  if (result.outcome === "permission_denied") {
    return buildBookingReadAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
      confidence: "moderate",
    });
  }

  if (
    result.outcome === "provider_missing" ||
    result.outcome === "source_missing" ||
    result.outcome === "activation_pending"
  ) {
    return buildBookingReadAnswer({
      t,
      directAnswer: t(`${ORG_INTEL_BASE}.sourceUnavailable`),
      confidence: "moderate",
    });
  }

  const bookings = result.bookings;
  if (bookings.length === 0) {
    return buildBookingReadAnswer({
      t,
      directAnswer: t(`${OUTCOME_BASE}.bookingListEmpty`),
      confidence: result.outcome === "exact_match" ? "high" : "moderate",
    });
  }

  const steps = bookings.map((booking) => formatBookingStep(booking, t, locale));
  const directAnswer = t(`${OUTCOME_BASE}.bookingListLead`).replace("{count}", String(bookings.length));

  return buildBookingReadAnswer({
    t,
    directAnswer,
    steps,
    confidence: result.outcome === "exact_match" ? "high" : "moderate",
  });
}

export async function produceBookingReadTurn(
  input: ProduceBookingReadTurnInput,
  deps: ProduceBookingReadTurnDeps = {},
): Promise<ProduceBookingReadTurnResult> {
  const resolveIntent =
    deps.resolve_semantic_intent ??
    ((query: string, locale: CustomerActiveLocale) =>
      resolveBookingSemanticIntent({
        query,
        locale,
        descriptors: collectBookingDescriptorsFromManifests(APPOINTMENT_BOOKING_PROVIDER_MANIFESTS),
      }));

  const semanticIntent = resolveIntent(input.query, input.locale);
  if (!isClearBookingListReadIntent(semanticIntent)) {
    return { handled: false };
  }

  const t = deps.translate ?? (await loadBookingReadTranslator(input.locale));

  const readContext = deps.load_read_context
    ? await deps.load_read_context(input)
    : await loadBookingProposalReadContext({
        supabase: input.supabase,
        query: input.query,
        locale: input.locale,
        userRole: input.userRole,
      });

  if (!readContext) {
    return {
      handled: true,
      answer: buildBookingReadAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
        confidence: "moderate",
      }),
    };
  }

  const readBlock = assertBookingReadAllowed(readContext.permission);
  if (readBlock === "provider_missing" || readBlock === "activation_pending") {
    return {
      handled: true,
      answer: buildBookingReadAnswer({
        t,
        directAnswer: t(`${ORG_INTEL_BASE}.sourceUnavailable`),
        confidence: "moderate",
      }),
    };
  }

  if (readBlock === "permission_denied" || !readContext.permission.can_read_bookings) {
    return {
      handled: true,
      answer: buildBookingReadAnswer({
        t,
        directAnswer: t(`${OUTCOME_BASE}.permissionDenied`),
        confidence: "moderate",
      }),
    };
  }

  const executeRead = deps.execute_booking_read ?? executeBookingRead;
  const readResult = await executeRead({
    organization_id: readContext.organization_id,
    tenant_id: readContext.permission.tenant_id,
    user_role: input.userRole,
    capability_key: "booking.read",
    permission: readContext.permission,
    providers: [buildBookingProviderReader(readContext)],
  });

  return {
    handled: true,
    answer: mapBookingReadResultToAnswer({
      result: readResult,
      t,
      locale: input.locale,
    }),
  };
}
