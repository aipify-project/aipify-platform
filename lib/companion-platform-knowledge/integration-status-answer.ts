import type { Translator } from "@/lib/i18n/translate";
import { buildActionForRoute } from "./answer-builder";
import { buildIntegrationStatusCardPayload } from "./integration-status-card";
import { filterActionsByPermission, type PermissionContext } from "./permission-gate";
import type {
  ConnectedIntegrationStatusMetadata,
  IntegrationStatusFailureCode,
} from "./integration-status-tool";
import type { PlatformKnowledgeAction, PlatformKnowledgeAnswer } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.integrationStatus";
const ACTIONS_BASE = "customerApp.companionPlatformKnowledge.actions";
const UNONIGHT_RETEST_HREF = "/app/platform/integrations/connect/unonight";

function buildRetestConnectionAction(t: Translator): PlatformKnowledgeAction {
  return {
    labelKey: `${ACTIONS_BASE}.retestUnonightConnection`,
    label: t(`${ACTIONS_BASE}.retestUnonightConnection`),
    href: UNONIGHT_RETEST_HREF,
    routeKey: "connectIntegration",
    variant: "secondary",
  };
}

function buildConnectedIntegrationsAction(
  t: Translator,
): PlatformKnowledgeAction | undefined {
  const action = buildActionForRoute("connectedIntegrations", t);
  if (!action) return undefined;
  return { ...action, variant: "primary" };
}

export function buildVerifiedIntegrationStatusAnswer(
  metadata: ConnectedIntegrationStatusMetadata,
  t: Translator,
  _locale: string,
  ctx: PermissionContext,
): PlatformKnowledgeAnswer {
  const sourceLabel = t(`${BASE}.sourceVerifiedIntegration`);
  const integrationStatusCard = buildIntegrationStatusCardPayload(metadata, t);

  const actions = filterActionsByPermission(
    [buildConnectedIntegrationsAction(t), buildRetestConnectionAction(t)].filter(
      (action): action is NonNullable<typeof action> => action !== undefined,
    ),
    ctx,
  );

  return {
    title: t(`${BASE}.title`),
    directAnswer: t(`${BASE}.card.supporting`),
    integrationStatusCard,
    steps: [],
    actions,
    sources: [
      {
        id: "verified-unonight-integration",
        label: sourceLabel,
        kind: "verified_integration",
        meta: t(`${BASE}.card.sourceMeta`),
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
