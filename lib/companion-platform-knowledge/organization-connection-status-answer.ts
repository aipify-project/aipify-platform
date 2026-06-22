import { getIntegrationProviderManifest } from "@/lib/integration-intelligence/manifest-registry";
import type { Translator } from "@/lib/i18n/translate";
import { buildActionForRoute } from "./answer-builder";
import { filterActionsByPermission, type PermissionContext } from "./permission-gate";
import type { PlatformKnowledgeAnswer } from "./types";

const BASE = "customerApp.companionPlatformKnowledge.organizationConnectionStatus";

function resolveProviderLabel(providerKey: string, t: Translator): string {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest) return providerKey;
  return manifest.displayNameKey ? t(manifest.displayNameKey) : manifest.displayName;
}

export function buildOrganizationConnectionStatusPermissionDeniedAnswer(
  t: Translator,
): PlatformKnowledgeAnswer {
  return {
    title: t(`${BASE}.title`),
    directAnswer: t(`${BASE}.permissionDenied`),
    explanation: t(`${BASE}.permissionDeniedExplanation`),
    steps: [],
    actions: [],
    sources: [
      {
        id: "organization-connection-status-policy",
        label: t(`${BASE}.summarySource`),
        kind: "customer_context",
      },
    ],
    sourceId: "organization-connection-status-policy",
    source: "customer_context",
    confidence: "high",
    showSupportEscalation: false,
  };
}

export function buildOrganizationConnectionStatusSummaryAnswer(input: {
  connectedProviders: readonly string[];
  primaryVerifiedProvider: string | null;
  t: Translator;
  permissionCtx: PermissionContext;
}): PlatformKnowledgeAnswer {
  const { connectedProviders, primaryVerifiedProvider, t, permissionCtx } = input;
  const actions = filterActionsByPermission(
    [buildActionForRoute("connectedIntegrations", t)].filter(
      (action): action is NonNullable<typeof action> => action !== undefined,
    ),
    permissionCtx,
  );

  if (connectedProviders.length === 0) {
    return {
      title: t(`${BASE}.title`),
      directAnswer: t(`${BASE}.notConnectedLead`),
      explanation: t(`${BASE}.notConnectedExplanation`),
      steps: [],
      actions,
      sources: [
        {
          id: "organization-integration-hub",
          label: t(`${BASE}.summarySource`),
          kind: "customer_context",
        },
      ],
      sourceId: "organization-integration-hub",
      source: "customer_context",
      confidence: "high",
      showSupportEscalation: false,
    };
  }

  const providerKey = primaryVerifiedProvider ?? connectedProviders[0] ?? null;
  const providerLabel = providerKey ? resolveProviderLabel(providerKey, t) : t(`${BASE}.unknownProvider`);
  const providerLines = connectedProviders.map((key) =>
    t(`${BASE}.providerLine`).replace("{provider}", resolveProviderLabel(key, t)),
  );

  return {
    title: t(`${BASE}.title`),
    directAnswer: t(`${BASE}.connectedLead`).replace("{provider}", providerLabel),
    explanation: [
      t(`${BASE}.connectedVerified`),
      t(`${BASE}.providerCount`).replace("{count}", String(connectedProviders.length)),
      ...providerLines,
    ].join("\n"),
    steps: [],
    actions,
    sources: [
      {
        id: "organization-integration-hub",
        label: t(`${BASE}.summarySource`),
        kind: "customer_context",
      },
    ],
    sourceId: "organization-integration-hub",
    source: "customer_context",
    confidence: "high",
    showSupportEscalation: false,
    liveIntegrationToolUsed: false,
    requestedLiveIntegration: true,
  };
}
