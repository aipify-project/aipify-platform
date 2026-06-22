import { getCreativeProviderManifest, listCreativeProviderManifests } from "@/lib/integration-intelligence/creative/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionCreativeContext } from "./companion-creative-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CreativeProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeCreativeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasCreativeProviderIntent(query: string): boolean {
  const normalized = normalizeCreativeQuery(query);
  return /\b(design|template|brand kit|brandkit|image|video|creative|export|generate|media|presentation)\b/i.test(
    normalized,
  );
}

export function matchCreativeProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): CreativeProviderMatch | null {
  if (!hasCreativeProviderIntent(query)) return null;

  const normalized = normalizeCreativeQuery(query);
  const manifests = listCreativeProviderManifests();

  const mentionedProviders = manifests.filter((manifest) => {
    const provider = manifest.provider_key.toLowerCase();
    const providerSpaced = provider.replace(/_/g, " ");
    return normalized.includes(providerSpaced) || normalized.includes(provider);
  });

  if (mentionedProviders.length > 0) {
    for (const manifest of mentionedProviders) {
      for (const capability of manifest.capabilities) {
        const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
        if (normalized.includes(capabilityPhrase)) {
          return {
            provider_key: manifest.provider_key,
            capability_key: capability.capability_key,
            operation: capability.operation,
          };
        }
      }
    }

    return {
      provider_key: mentionedProviders[0]!.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
      if (normalized.includes(capabilityPhrase)) {
        return {
          provider_key: manifest.provider_key,
          capability_key: capability.capability_key,
          operation: capability.operation,
        };
      }
    }
  }

  const writeIntent = /\b(create|generate|edit|export|publish|write)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.creativeContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

export function buildCreativeProviderDiscoveryAnswer(
  match: CreativeProviderMatch,
  creativeContext: CompanionCreativeContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getCreativeProviderManifest(match.provider_key);
  const providerStatus = creativeContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.creative.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.creative.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = creativeContext.capabilities
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.creative.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.creative.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.creative.discoveryExplanation"),
    capabilityLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.creative.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.creative.disconnectedProvider"),
  ]
    .filter(Boolean)
    .join("\n");

  const href = creativeContext.studio_enabled
    ? creativeContext.cross_link_studio
    : creativeContext.cross_link_bridge;

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.creative.openStudio",
        label: t("customerApp.companionPlatformKnowledge.creative.openStudio"),
        href,
        routeKey: "creativeStudio",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.creative.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildCreativeProviderUnavailableAnswer(
  t: Translator,
  creativeContext: CompanionCreativeContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.creative.unavailableLead"),
    explanation: creativeContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.creative.permissionDenied")
      : creativeContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.creative.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.creative.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "creative-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.creative.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "creative-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
