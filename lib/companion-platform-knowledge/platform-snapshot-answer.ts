import type { Translator } from "@/lib/i18n/translate";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { buildActionForRoute } from "./answer-builder";
import { buildPlatformSnapshotCardPayload } from "./platform-snapshot-card";
import type { LivePlatformSnapshotQueryKind } from "./platform-snapshot-intent";
import { filterActionsByPermission, type PermissionContext } from "./permission-gate";
import type { PlatformSnapshotFailureCode, UnonightPlatformSnapshotMetadata } from "./platform-snapshot-tool";
import type { PlatformKnowledgeAction, PlatformKnowledgeAnswer } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.platformSnapshot";
const VARIANTS = `${BASE}.variants`;
const ACTIONS_BASE = "customerApp.companionPlatformKnowledge.actions";
const UNONIGHT_RETEST_HREF = "/app/platform/integrations/connect/unonight";

function interpolate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

function formatLanguageList(locales: string[]): string {
  return locales
    .map((code) => LOCALE_LABELS[code.toLowerCase().split("-")[0] as Locale] ?? code.toUpperCase())
    .join(", ");
}

function formatModuleList(modules: string[]): string {
  return modules.join(", ");
}

function formatTimestamp(value: string, locale: string, unavailable: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildRetestConnectionAction(t: Translator): PlatformKnowledgeAction {
  return {
    labelKey: `${ACTIONS_BASE}.retestUnonightConnection`,
    label: t(`${ACTIONS_BASE}.retestUnonightConnection`),
    href: UNONIGHT_RETEST_HREF,
    routeKey: "connectIntegration",
    variant: "secondary",
  };
}

function buildConnectedIntegrationsAction(t: Translator): PlatformKnowledgeAction | undefined {
  const action = buildActionForRoute("connectedIntegrations", t);
  if (!action) return undefined;
  return { ...action, variant: "primary" };
}

function buildStandardActions(t: Translator, ctx: PermissionContext): PlatformKnowledgeAction[] {
  return filterActionsByPermission(
    [buildConnectedIntegrationsAction(t), buildRetestConnectionAction(t)].filter(
      (action): action is NonNullable<typeof action> => action !== undefined,
    ),
    ctx,
  );
}

function buildVerifiedSourceRef(t: Translator) {
  const sourceLabel = t(`${BASE}.sourceVerifiedIntegration`);
  return {
    sources: [
      {
        id: "verified-unonight-platform-snapshot",
        label: sourceLabel,
        kind: "verified_integration" as const,
        meta: t(`${BASE}.card.sourceMeta`),
      },
    ],
    sourceId: "verified-unonight-platform-snapshot",
    source: "verified_integration" as const,
  };
}

export function buildVerifiedPlatformSnapshotAnswer(
  metadata: UnonightPlatformSnapshotMetadata,
  t: Translator,
  locale: string,
  ctx: PermissionContext,
  queryKind: LivePlatformSnapshotQueryKind = "full_snapshot",
): PlatformKnowledgeAnswer {
  const unavailable = t(`${BASE}.card.timestampUnavailable`);
  const checkedAt = formatTimestamp(metadata.checked_at, locale, unavailable);
  const modules = formatModuleList(metadata.active_modules);
  const languages = formatLanguageList(metadata.supported_locales);
  const { sources, sourceId, source } = buildVerifiedSourceRef(t);
  const platformSnapshotCard = buildPlatformSnapshotCardPayload(metadata, t);

  let directAnswer = t(`${BASE}.card.supporting`);
  switch (queryKind) {
    case "active_modules":
      directAnswer = interpolate(t(`${VARIANTS}.activeModules.intro`), { modules, checkedAt });
      break;
    case "supported_languages":
      directAnswer = interpolate(t(`${VARIANTS}.supportedLanguages.intro`), { languages, checkedAt });
      break;
    case "environment_status":
      directAnswer = interpolate(t(`${VARIANTS}.environmentStatus.intro`), {
        environment: metadata.environment,
        status: metadata.status,
        checkedAt,
      });
      break;
    case "platform_version":
      directAnswer = interpolate(t(`${VARIANTS}.platformVersion.intro`), {
        version: metadata.platform_version,
        checkedAt,
      });
      break;
    case "visibility_summary":
      directAnswer = interpolate(t(`${VARIANTS}.visibilitySummary.intro`), { modules, checkedAt });
      break;
    default:
      directAnswer = interpolate(t(`${VARIANTS}.fullSnapshot.intro`), { modules, checkedAt });
  }

  return {
    title: t(`${BASE}.title`),
    directAnswer,
    platformSnapshotCard,
    steps: [],
    actions: buildStandardActions(t, ctx),
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
): PlatformKnowledgeAnswer {
  return {
    title: t(`${BASE}.failureTitle`),
    directAnswer: t(`${BASE}.failureLead`),
    explanation: t(FAILURE_MESSAGE_KEYS[code] ?? `${BASE}.failures.responseInvalid`),
    steps: [buildFailureRetryStep(code, t)].filter(Boolean),
    actions: filterActionsByPermission(
      [
        buildConnectedIntegrationsAction(t),
        buildRetestConnectionAction(t),
        buildActionForRoute("contactSupport", t),
      ].filter((action): action is NonNullable<typeof action> => action !== undefined),
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
