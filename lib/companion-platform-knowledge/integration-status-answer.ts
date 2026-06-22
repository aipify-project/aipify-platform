import type { Translator } from "@/lib/i18n/translate";
import { buildActionForRoute } from "./answer-builder";
import { filterActionsByPermission, type PermissionContext } from "./permission-gate";
import type {
  ConnectedIntegrationStatusMetadata,
  IntegrationStatusFailureCode,
} from "./integration-status-tool";
import type { PlatformKnowledgeAnswer } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.integrationStatus";

function formatTimestamp(value: string | null | undefined, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatScopes(scopes: string[]): string {
  return scopes.length > 0 ? scopes.join(", ") : "—";
}

function formatLocales(locales: string[], t: Translator): string {
  if (locales.length === 0) {
    return t(`${BASE}.localesUnavailable`);
  }
  return locales.join(", ");
}

export function buildVerifiedIntegrationStatusAnswer(
  metadata: ConnectedIntegrationStatusMetadata,
  t: Translator,
  locale: string,
  ctx: PermissionContext,
): PlatformKnowledgeAnswer {
  const sourceLabel = t(`${BASE}.sourceVerifiedIntegration`);
  const directAnswer = [
    t(`${BASE}.successIntro`),
    "",
    `${t(`${BASE}.fieldOrganizationName`)}: ${metadata.organization_name}`,
    `${t(`${BASE}.fieldOrganizationId`)}: ${metadata.organization_id}`,
    `${t(`${BASE}.fieldApiVersion`)}: ${metadata.api_version}`,
    `${t(`${BASE}.fieldAccessMode`)}: ${t(`${BASE}.accessModeReadOnly`)}`,
    `${t(`${BASE}.fieldConnectionStatus`)}: ${t(`${BASE}.statusConnectedVerified`)}`,
    `${t(`${BASE}.fieldScopes`)}: ${formatScopes(metadata.scopes)}`,
    `${t(`${BASE}.fieldSupportedLocales`)}: ${formatLocales(metadata.supported_locales, t)}`,
    `${t(`${BASE}.fieldLastVerified`)}: ${formatTimestamp(metadata.last_verified_at, locale)}`,
    `${t(`${BASE}.fieldLastUsed`)}: ${formatTimestamp(metadata.last_used_at, locale)}`,
    `${t(`${BASE}.fieldBaseUrl`)}: ${metadata.base_url}`,
    "",
    `${t(`${BASE}.sourceLine`)}: ${sourceLabel}`,
  ].join("\n");

  const actions = filterActionsByPermission(
    [
      buildActionForRoute("connectedIntegrations", t),
      buildActionForRoute("integrations", t),
    ].filter((action): action is NonNullable<typeof action> => action !== undefined),
    ctx,
  );

  return {
    title: t(`${BASE}.title`),
    directAnswer,
    explanation: t(`${BASE}.explanation`),
    steps: [],
    actions,
    sources: [
      {
        id: "verified-unonight-integration",
        label: sourceLabel,
        kind: "verified_integration",
        meta: `${t(`${BASE}.accessModeReadOnly`)} · ${formatTimestamp(metadata.checked_at, locale)}`,
      },
    ],
    sourceId: "verified-unonight-integration",
    source: "verified_integration",
    confidence: "high",
    showSupportEscalation: false,
    liveIntegrationToolUsed: true,
    orgConfirmEligible: true,
    requestedLiveIntegration: true,
    integrationToolName: metadata.tool,
  };
}

const FAILURE_MESSAGE_KEYS: Record<IntegrationStatusFailureCode, string> = {
  integration_not_connected: `${BASE}.failures.integrationNotConnected`,
  integration_not_verified: `${BASE}.failures.integrationNotVerified`,
  credential_unavailable: `${BASE}.failures.credentialUnavailable`,
  endpoint_unreachable: `${BASE}.failures.endpointUnreachable`,
  provider_mismatch: `${BASE}.failures.providerMismatch`,
  organization_mismatch: `${BASE}.failures.organizationMismatch`,
  permission_denied: `${BASE}.failures.permissionDenied`,
  response_invalid: `${BASE}.failures.responseInvalid`,
};

export function buildIntegrationStatusFailureAnswer(
  code: IntegrationStatusFailureCode,
  t: Translator,
  ctx: PermissionContext,
): PlatformKnowledgeAnswer {
  const actions = filterActionsByPermission(
    [
      buildActionForRoute("connectedIntegrations", t),
      buildActionForRoute("integrations", t),
      buildActionForRoute("contactSupport", t),
    ].filter((action): action is NonNullable<typeof action> => action !== undefined),
    ctx,
  );

  return {
    title: t(`${BASE}.failureTitle`),
    directAnswer: t(`${BASE}.failureLead`),
    explanation: t(FAILURE_MESSAGE_KEYS[code]),
    steps: [t(`${BASE}.failureRetryStep`)].filter(Boolean),
    actions,
    sources: [],
    sourceId: "integration-status-failure",
    source: "verified_integration",
    confidence: "high",
    showSupportEscalation: true,
    liveIntegrationToolUsed: false,
    orgConfirmEligible: false,
    requestedLiveIntegration: true,
    orgConfirmBlockedReason: t(`${BASE}.orgConfirmBlockedNoLiveData`),
    integrationToolName: "get_connected_integration_status",
  };
}
