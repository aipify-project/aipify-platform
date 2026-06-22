import type { Translator } from "@/lib/i18n/translate";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { buildActionForRoute } from "./answer-builder";
import { buildIntegrationStatusCardPayload } from "./integration-status-card";
import type { LiveIntegrationQueryKind } from "./integration-status-intent";
import { filterActionsByPermission, type PermissionContext } from "./permission-gate";
import type {
  ConnectedIntegrationStatusMetadata,
  IntegrationStatusFailureCode,
} from "./integration-status-tool";
import type { PlatformKnowledgeAction, PlatformKnowledgeAnswer } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.integrationStatus";
const VARIANTS = `${BASE}.variants`;
const ACTIONS_BASE = "customerApp.companionPlatformKnowledge.actions";
const UNONIGHT_RETEST_HREF = "/app/platform/integrations/connect/unonight";

function interpolate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

function formatTimestamp(value: string | null | undefined, locale: string, unavailable: string): string {
  if (!value) return unavailable;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatLanguageList(locales: string[]): string {
  return locales
    .map((code) => LOCALE_LABELS[code.toLowerCase().split("-")[0] as Locale] ?? code.toUpperCase())
    .join(", ");
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

function buildStandardIntegrationActions(t: Translator, ctx: PermissionContext): PlatformKnowledgeAction[] {
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
        id: "verified-unonight-integration",
        label: sourceLabel,
        kind: "verified_integration" as const,
        meta: t(`${BASE}.card.sourceMeta`),
      },
    ],
    sourceId: "verified-unonight-integration",
    source: "verified_integration" as const,
    sourceLabel,
  };
}

function buildLiveIntegrationAnswerBase(
  metadata: ConnectedIntegrationStatusMetadata,
  t: Translator,
  locale: string,
  ctx: PermissionContext,
  directAnswer: string,
  steps: string[] = [],
): PlatformKnowledgeAnswer {
  const { sources, sourceId, source } = buildVerifiedSourceRef(t);
  return {
    title: t(`${BASE}.title`),
    directAnswer,
    integrationStatusCard: buildIntegrationStatusCardPayload(metadata, t),
    steps,
    actions: buildStandardIntegrationActions(t, ctx),
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

export function buildVerifiedIntegrationStatusAnswer(
  metadata: ConnectedIntegrationStatusMetadata,
  t: Translator,
  locale: string,
  ctx: PermissionContext,
  queryKind: LiveIntegrationQueryKind = "status",
): PlatformKnowledgeAnswer {
  const unavailable = t(`${BASE}.card.timestampUnavailable`);

  switch (queryKind) {
    case "last_used":
      return buildLiveIntegrationAnswerBase(
        metadata,
        t,
        locale,
        ctx,
        interpolate(t(`${VARIANTS}.lastUsed.intro`), {
          timestamp: formatTimestamp(metadata.last_used_at, locale, unavailable),
        }),
      );
    case "scopes":
      return buildLiveIntegrationAnswerBase(metadata, t, locale, ctx, t(`${VARIANTS}.scopes.intro`), [
        t(`${VARIANTS}.scopes.allowedMetadata`),
        t(`${VARIANTS}.scopes.allowedOrganization`),
        t(`${VARIANTS}.scopes.allowedStatus`),
        t(`${VARIANTS}.scopes.notAllowedPrivateMessages`),
        t(`${VARIANTS}.scopes.notAllowedPayments`),
        t(`${VARIANTS}.scopes.notAllowedWrite`),
      ]);
    case "languages": {
      const languages =
        metadata.supported_locales.length > 0
          ? formatLanguageList(metadata.supported_locales)
          : t(`${BASE}.localesUnavailable`);
      return buildLiveIntegrationAnswerBase(
        metadata,
        t,
        locale,
        ctx,
        interpolate(t(`${VARIANTS}.languages.intro`), { languages }),
      );
    }
    case "source_trust":
      return buildLiveIntegrationAnswerBase(
        metadata,
        t,
        locale,
        ctx,
        interpolate(t(`${VARIANTS}.sourceTrust.intro`), {
          lastVerified: formatTimestamp(metadata.last_verified_at, locale, unavailable),
          lastUsed: formatTimestamp(metadata.last_used_at, locale, unavailable),
          checkedAt: formatTimestamp(metadata.checked_at, locale, unavailable),
        }),
      );
    case "unsupported_data": {
      const { sources, sourceId, source } = buildVerifiedSourceRef(t);
      return {
        title: t(`${VARIANTS}.unsupported.title`),
        directAnswer: t(`${VARIANTS}.unsupported.intro`),
        steps: [
          t(`${VARIANTS}.scopes.allowedMetadata`),
          t(`${VARIANTS}.scopes.allowedOrganization`),
          t(`${VARIANTS}.scopes.allowedStatus`),
          t(`${VARIANTS}.scopes.notAllowedPrivateMessages`),
          t(`${VARIANTS}.scopes.notAllowedPayments`),
        ],
        actions: buildStandardIntegrationActions(t, ctx),
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
    case "status":
    default:
      return buildLiveIntegrationAnswerBase(metadata, t, locale, ctx, t(`${BASE}.card.supporting`));
  }
}

export function buildPrivateDataDeniedAnswer(t: Translator, ctx: PermissionContext): PlatformKnowledgeAnswer {
  const actions = filterActionsByPermission(
    [buildConnectedIntegrationsAction(t), buildActionForRoute("contactSupport", t)].filter(
      (action): action is NonNullable<typeof action> => action !== undefined,
    ),
    ctx,
  );

  return {
    title: t(`${VARIANTS}.privateDenied.title`),
    directAnswer: t(`${VARIANTS}.privateDenied.intro`),
    steps: [
      t(`${VARIANTS}.scopes.notAllowedPrivateMessages`),
      t(`${VARIANTS}.scopes.notAllowedPayments`),
      t(`${VARIANTS}.scopes.notAllowedWrite`),
    ],
    actions,
    sources: [
      {
        id: "verified-unonight-integration-policy",
        label: t(`${BASE}.sourceVerifiedIntegration`),
        kind: "verified_integration",
        meta: t(`${BASE}.accessModeReadOnly`),
      },
    ],
    sourceId: "verified-unonight-integration-policy",
    source: "verified_integration",
    confidence: "high",
    showSupportEscalation: false,
    liveIntegrationToolUsed: false,
    orgConfirmEligible: false,
    requestedLiveIntegration: true,
    orgConfirmBlockedReason: t(`${BASE}.orgConfirmBlockedNoLiveData`),
    integrationToolName: "get_connected_integration_status",
  };
}

export function buildRoleDisambiguationAnswer(t: Translator, ctx: PermissionContext): PlatformKnowledgeAnswer {
  const actions = filterActionsByPermission(
    [
      buildActionForRoute("rolesPermissions", t),
      buildActionForRoute("connectedIntegrations", t),
      buildActionForRoute("contactSupport", t),
    ].filter((action): action is NonNullable<typeof action> => action !== undefined),
    ctx,
  );

  return {
    title: t(`${VARIANTS}.roleDisambiguation.title`),
    directAnswer: t(`${VARIANTS}.roleDisambiguation.intro`),
    explanation: t(`${VARIANTS}.roleDisambiguation.unonightSection`),
    steps: [t(`${VARIANTS}.roleDisambiguation.aipifySection`)],
    actions,
    sources: [],
    sourceId: "unonight-role-disambiguation",
    source: "verified_integration",
    confidence: "high",
    showSupportEscalation: false,
    liveIntegrationToolUsed: false,
    orgConfirmEligible: false,
    requestedLiveIntegration: false,
    integrationToolName: "get_connected_integration_status",
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
      buildConnectedIntegrationsAction(t),
      buildRetestConnectionAction(t),
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
