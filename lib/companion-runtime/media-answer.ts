import { getMediaProviderManifest, listMediaProviderManifests } from "@/lib/integration-intelligence/media/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionMediaContext } from "./companion-media-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type MediaProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeMediaQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasMediaProviderIntent(query: string): boolean {
  const normalized = normalizeMediaQuery(query);
  return /\b(playback|playlist|playlists|speaker|speakers|volume|audio|connected devices|device control|play|pause|skip|now playing|device status)\b/i.test(
    normalized,
  );
}

export function matchMediaProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): MediaProviderMatch | null {
  if (!hasMediaProviderIntent(query)) return null;

  const normalized = normalizeMediaQuery(query);

  const mentionedProviders = listMediaProviderManifests().filter((manifest) => {
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

  for (const manifest of listMediaProviderManifests()) {
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

  const searchTermsMatch = listMediaProviderManifests().find((manifest) => {
    const providerSpaced = manifest.provider_key.replace(/_/g, " ");
    if (normalized.includes("device") && providerSpaced.includes("device")) return true;
    if (normalized.includes("playback") && manifest.capabilities.some((c) => c.capability_key.startsWith("playback"))) {
      return true;
    }
    return false;
  });

  if (searchTermsMatch) {
    return {
      provider_key: searchTermsMatch.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  const writeIntent = /\b(start|play|pause|skip|volume|select|create|update)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|connected)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.mediaContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

export function buildMediaProviderDiscoveryAnswer(
  match: MediaProviderMatch,
  mediaContext: CompanionMediaContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getMediaProviderManifest(match.provider_key);
  const providerStatus = mediaContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.media.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.media.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = mediaContext.capabilities
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.media.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.media.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const deviceSummary =
    mediaContext.connected_devices > 0
      ? t("customerApp.companionPlatformKnowledge.media.deviceSummary")
          .replace("{connected}", String(mediaContext.connected_devices))
          .replace("{online}", String(mediaContext.online_devices))
      : "";

  const explanation = [
    t("customerApp.companionPlatformKnowledge.media.discoveryExplanation"),
    deviceSummary,
    capabilityLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.media.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.media.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.media.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  const href = match.provider_key.includes("presence")
    ? mediaContext.cross_link_presence_devices
    : mediaContext.cross_link_device_ecosystem;

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.media.openDeviceCenter",
        label: t("customerApp.companionPlatformKnowledge.media.openDeviceCenter"),
        href,
        routeKey: "mediaDeviceCenter",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.media.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildMediaProviderUnavailableAnswer(
  t: Translator,
  mediaContext: CompanionMediaContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.media.unavailableLead"),
    explanation: mediaContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.media.permissionDenied")
      : mediaContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.media.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.media.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "media-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.media.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "media-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildMediaPlaybackUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.media.playbackUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.media.playbackUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "media-playback-unavailable",
        label: t("customerApp.companionPlatformKnowledge.media.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "media-playback-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}
