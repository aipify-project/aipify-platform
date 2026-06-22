import type { Translator } from "@/lib/i18n/translate";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { isCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  buildGenericPlatformAnswer,
  buildNormalizedCardLocales,
  buildNormalizedCardModules,
  resolveNormalizedVersionDisplay,
  shouldIncludePlatformCard,
} from "@/lib/integration-intelligence/answer-builder";
import { normalizeUnonightPlatformSnapshot } from "@/lib/integration-intelligence/adapters/unonight-normalizer";
import { resolveEnvironmentLabel } from "@/lib/live-platform-snapshot/presentation-registry";
import { buildActionForRoute } from "./answer-builder";
import { getPlatformSnapshotAvailabilityLabel } from "./platform-snapshot-card";
import type {
  LivePlatformSnapshotIntent,
} from "./platform-snapshot-intent";
import { mapLiveIntentToGeneric } from "./platform-snapshot-intent";
import { filterActionsByPermission, type PermissionContext } from "./permission-gate";
import type { PlatformSnapshotFailureCode, UnonightPlatformSnapshotMetadata } from "./platform-snapshot-tool";
import type { PlatformKnowledgeAction, PlatformKnowledgeAnswer, PlatformSnapshotCardLabels } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.platformSnapshot";
const INTELLIGENCE_BASE = "customerApp.companionPlatformKnowledge.integrationIntelligence";
const ACTIONS_BASE = "customerApp.companionPlatformKnowledge.actions";

function buildRetestConnectionAction(t: Translator, providerKey: string): PlatformKnowledgeAction {
  const providerSlug = providerKey.replace(/_/g, "-");
  return {
    labelKey: `${ACTIONS_BASE}.retestUnonightConnection`,
    label: t(`${ACTIONS_BASE}.retestUnonightConnection`),
    href: `/app/platform/integrations/connect/${providerSlug}`,
    routeKey: "connectIntegration",
    variant: "secondary",
  };
}

function buildConnectedIntegrationsAction(t: Translator): PlatformKnowledgeAction | undefined {
  const action = buildActionForRoute("connectedIntegrations", t);
  if (!action) return undefined;
  return { ...action, variant: "primary" };
}

function buildStandardActions(
  t: Translator,
  ctx: PermissionContext,
  providerKey: string,
): PlatformKnowledgeAction[] {
  return filterActionsByPermission(
    [buildConnectedIntegrationsAction(t), buildRetestConnectionAction(t, providerKey)].filter(
      (action): action is NonNullable<typeof action> => action !== undefined,
    ),
    ctx,
  );
}

function buildVerifiedSourceRef(t: Translator, providerKey: string) {
  const sourceLabel = t(`${BASE}.sourceVerifiedIntegration`);
  return {
    sources: [
      {
        id: `verified-${providerKey}-platform-snapshot`,
        label: sourceLabel,
        kind: "verified_integration" as const,
        meta: t(`${INTELLIGENCE_BASE}.directAnswers.sourceFooterVerified`),
      },
    ],
    sourceId: `verified-${providerKey}-platform-snapshot`,
    source: "verified_integration" as const,
  };
}

function buildCardLabels(
  metadata: UnonightPlatformSnapshotMetadata,
  providerKey: string,
  locale: CustomerActiveLocale,
  t: Translator,
): PlatformSnapshotCardLabels {
  const normalized = normalizeUnonightPlatformSnapshot(metadata);
  const moduleLabels = buildNormalizedCardModules(normalized, providerKey, locale, t);
  const languageLabels = buildNormalizedCardLocales(normalized, t);

  return {
    cardTitle: t(`${BASE}.card.title`),
    cardSupporting: t(`${BASE}.card.supporting`),
    fieldEnvironment: t(`${BASE}.card.fieldEnvironment`),
    fieldPlatformVersion: t(`${BASE}.card.fieldPlatformVersion`),
    fieldAvailability: t(`${BASE}.card.fieldAvailability`),
    fieldActiveModules: t(`${BASE}.card.fieldActiveModules`),
    fieldSupportedLanguages: t(`${BASE}.card.fieldSupportedLanguages`),
    fieldCheckedAt: t(`${BASE}.card.fieldCheckedAt`),
    timestampUnavailable: t(`${BASE}.card.timestampUnavailable`),
    availabilityAvailable: t(`${BASE}.card.availabilityAvailable`),
    availabilityDegraded: t(`${BASE}.card.availabilityDegraded`),
    availabilityMaintenance: t(`${BASE}.card.availabilityMaintenance`),
    sourceTitle: t(`${BASE}.card.sourceTitle`),
    sourceLabel: t(`${BASE}.sourceVerifiedIntegration`),
    sourceMeta: t(`${BASE}.card.sourceMeta`),
    languagesUnavailable: t(`${BASE}.card.languagesUnavailable`),
    languageLabels,
    moduleLabels,
    ariaCard: t(`${BASE}.card.ariaCard`),
    environmentDisplay: resolveEnvironmentLabel(metadata.environment, t),
    platformVersionDisplay: resolveNormalizedVersionDisplay(normalized.version, t),
  };
}

export function buildVerifiedPlatformSnapshotAnswer(
  metadata: UnonightPlatformSnapshotMetadata,
  t: Translator,
  locale: string,
  ctx: PermissionContext,
  intent: Pick<
    LivePlatformSnapshotIntent,
    "queryKind" | "presentationMode" | "targetModules"
  > = {
    queryKind: "full_snapshot",
    presentationMode: "full_snapshot",
  },
): PlatformKnowledgeAnswer {
  const providerKey = metadata.provider;
  const activeLocale: CustomerActiveLocale = isCustomerActiveLocale(locale) ? locale : "en";
  const normalized = normalizeUnonightPlatformSnapshot(metadata);
  const genericIntent = mapLiveIntentToGeneric(intent);
  const { directAnswer, explanation } = buildGenericPlatformAnswer(
    normalized,
    providerKey,
    activeLocale,
    locale,
    t,
    genericIntent,
  );
  const labels = buildCardLabels(metadata, providerKey, activeLocale, t);
  const { sources, sourceId, source } = buildVerifiedSourceRef(t, providerKey);

  const activeModuleKeys = normalized.activeModules
    .filter((entry) => entry.active)
    .map((entry) => entry.key);

  const platformSnapshotCard = shouldIncludePlatformCard(intent.presentationMode)
    ? {
        provider: metadata.provider,
        environment: metadata.environment,
        platformVersion: metadata.platform_version,
        availabilityStatus: metadata.status,
        activeModules: activeModuleKeys,
        supportedLocales: metadata.supported_locales,
        checkedAt: metadata.checked_at,
        labels,
      }
    : undefined;

  return {
    title: t(`${BASE}.title`),
    directAnswer,
    explanation,
    platformSnapshotCard,
    steps: [],
    actions: buildStandardActions(t, ctx, providerKey),
    sources,
    sourceId,
    source,
    confidence: "high",
    showSupportEscalation: false,
    liveIntegrationToolUsed: true,
    orgConfirmEligible: true,
    requestedLiveIntegration: true,
    integrationToolName: metadata.tool,
  };
}

export { getPlatformSnapshotAvailabilityLabel };

const FAILURE_MESSAGE_KEYS: Partial<Record<PlatformSnapshotFailureCode, string>> = {
  integration_not_connected: `${BASE}.failures.integrationNotConnected`,
  integration_not_verified: `${BASE}.failures.integrationNotVerified`,
  credential_unavailable: `${BASE}.failures.credentialUnavailable`,
  credential_mismatch: `${BASE}.failures.credentialMismatch`,
  endpoint_unreachable: `${BASE}.failures.endpointUnreachable`,
  provider_mismatch: `${BASE}.failures.providerMismatch`,
  organization_mismatch: `${BASE}.failures.organizationMismatch`,
  permission_denied: `${BASE}.failures.permissionDenied`,
  response_invalid: `${BASE}.failures.responseInvalid`,
  live_scope_missing: `${BASE}.failures.liveScopeMissing`,
  platform_snapshot_forbidden: `${BASE}.failures.platformSnapshotForbidden`,
  malformed_modules: `${BASE}.failures.malformedModules`,
  malformed_locales: `${BASE}.failures.malformedLocales`,
  malformed_environment: `${BASE}.failures.malformedEnvironment`,
  malformed_organization: `${BASE}.failures.malformedOrganization`,
  availability_status_missing: `${BASE}.failures.statusUnavailable`,
  availability_status_unknown: `${BASE}.failures.statusUnavailable`,
  availability_status_invalid_type: `${BASE}.failures.statusUnavailable`,
  status_unavailable: `${BASE}.failures.statusUnavailable`,
  unsupported_contract_version: `${BASE}.failures.unsupportedContractVersion`,
  unsafe_payload: `${BASE}.failures.unsafePayload`,
};

const CONTRACT_FAILURE_CODES = new Set<PlatformSnapshotFailureCode>([
  "availability_status_missing",
  "availability_status_unknown",
  "availability_status_invalid_type",
  "status_unavailable",
  "malformed_modules",
  "malformed_locales",
  "malformed_environment",
  "malformed_organization",
  "unsupported_contract_version",
  "response_not_json",
  "malformed_platform",
  "invalid_checked_at",
  "unsafe_payload",
]);

function buildFailureRetryStep(code: PlatformSnapshotFailureCode, t: Translator): string {
  if (code === "live_scope_missing") {
    return t(`${BASE}.failureRetryStepScopeMissing`);
  }
  if (CONTRACT_FAILURE_CODES.has(code)) {
    return t(`${BASE}.failureRetryStepStatusContract`);
  }
  return t(`${BASE}.failureRetryStepGeneric`);
}

export function buildPlatformSnapshotFailureAnswer(
  code: PlatformSnapshotFailureCode,
  t: Translator,
  ctx: PermissionContext,
  providerKey = "unonight",
): PlatformKnowledgeAnswer {
  return {
    title: t(`${BASE}.failureTitle`),
    directAnswer: t(`${BASE}.failureLead`),
    explanation: t(FAILURE_MESSAGE_KEYS[code] ?? `${BASE}.failures.responseInvalid`),
    steps: [buildFailureRetryStep(code, t)].filter(Boolean),
    actions: filterActionsByPermission(
      [
        buildConnectedIntegrationsAction(t),
        buildRetestConnectionAction(t, providerKey),
        buildActionForRoute("contactSupport", t),
      ].filter((action): action is NonNullable<typeof action> => action !== undefined,
      ),
      ctx,
    ),
    sources: [],
    sourceId: "platform-snapshot-failure",
    source: "verified_integration",
    confidence: "high",
    showSupportEscalation: true,
    liveIntegrationToolUsed: false,
    orgConfirmEligible: false,
    requestedLiveIntegration: true,
    orgConfirmBlockedReason: t(`${BASE}.orgConfirmBlockedNoLiveData`),
    integrationToolName: "get_unonight_platform_snapshot",
  };
}

export function buildUnsupportedLiveMetricAnswer(
  t: Translator,
  ctx: PermissionContext,
  providerKey: string,
): PlatformKnowledgeAnswer {
  return {
    title: t(`${INTELLIGENCE_BASE}.unsupportedMetric.title`),
    directAnswer: t(`${INTELLIGENCE_BASE}.unsupportedMetric.directAnswer`),
    explanation: t(`${INTELLIGENCE_BASE}.unsupportedMetric.explanation`),
    steps: [],
    actions: buildStandardActions(t, ctx, providerKey),
    sources: [],
    sourceId: "unsupported-live-metric",
    source: "verified_integration",
    confidence: "high",
    showSupportEscalation: false,
    liveIntegrationToolUsed: false,
    orgConfirmEligible: false,
    requestedLiveIntegration: true,
  };
}
