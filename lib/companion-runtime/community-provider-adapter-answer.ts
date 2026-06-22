import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type {
  CommunityExternalProviderAdapterOverlay,
  CommunityProviderAdapterRecord,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import type { CompanionCommunityContext } from "./companion-community-context";

type CommunityProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function formatTimestamp(value: string, locale: CustomerActiveLocale): string {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

function findActiveAdapterOverlay(
  context: CompanionCommunityContext,
  providerKey: string,
): CommunityExternalProviderAdapterOverlay | null {
  const overlays = context.external_provider_adapters ?? [];
  return overlays.find((overlay) => overlay.provider_key === providerKey) ?? overlays[0] ?? null;
}

function selectRecordForMatch(
  overlay: CommunityExternalProviderAdapterOverlay,
  match: CommunityProviderMatch,
): CommunityProviderAdapterRecord | null {
  if (match.capability_key) {
    return (
      overlay.records.find((record) => record.capability_key === match.capability_key) ?? null
    );
  }

  const keywordOrder = [
    "moderation_queue.read",
    "report.read",
    "verification_status.read",
    "listing.read",
    "member.read",
    "activity.read",
  ];

  for (const capabilityKey of keywordOrder) {
    const record = overlay.records.find((record) => record.capability_key === capabilityKey);
    if (record) return record;
  }

  return overlay.records[0] ?? null;
}

function capabilityLabelKey(capabilityKey: string): string {
  return `customerApp.companionPlatformKnowledge.unonightProviderAdapter.capabilities.${capabilityKey.replace(/\./g, "_")}`;
}

export function buildCommunityProviderAdapterGroundedAnswer(
  match: CommunityProviderMatch,
  communityContext: CompanionCommunityContext,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer | null {
  const overlay = findActiveAdapterOverlay(communityContext, match.provider_key);
  if (!overlay) return null;

  if (overlay.activation.status === "disabled") {
    return {
      directAnswer: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.unavailableLead"),
      explanation: overlay.activation.reason_key
        ? t(overlay.activation.reason_key)
        : t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.unavailableExplanation"),
      steps: [],
      actions: [],
      sources: [
        {
          id: overlay.provider_key,
          label: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLabel"),
          kind: "customer_context",
          meta: overlay.activation.status,
        },
      ],
      sourceId: overlay.provider_key,
      source: "customer_context",
      confidence: "low",
    };
  }

  if (overlay.activation.status === "activating") {
    return {
      directAnswer: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.activatingLead"),
      explanation: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.activatingExplanation"),
      steps: [],
      actions: [],
      sources: [
        {
          id: overlay.provider_key,
          label: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLabel"),
          kind: "customer_context",
          meta: "activating",
        },
      ],
      sourceId: overlay.provider_key,
      source: "customer_context",
      confidence: "low",
    };
  }

  const record = selectRecordForMatch(overlay, match);
  if (!record) {
    return {
      directAnswer: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.emptyLead"),
      explanation: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.emptyExplanation"),
      steps: [],
      actions: [],
      sources: [
        {
          id: overlay.provider_key,
          label: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLabel"),
          kind: "customer_context",
        },
      ],
      sourceId: overlay.provider_key,
      source: "customer_context",
      confidence: "moderate",
    };
  }

  const capabilityLabel = t(capabilityLabelKey(String(record.capability_key)));
  const countValue =
    record.count === null
      ? t("customerApp.companionPlatformKnowledge.grounded.valueMissing")
      : String(record.count);

  const directAnswer = t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.groundedLead")
    .replace("{capability}", capabilityLabel)
    .replace("{count}", countValue);

  const warningLines = record.warnings.map((warningKey) => t(warningKey)).join("\n");
  const freshnessLine = t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLine")
    .replace("{source}", record.source_reference)
    .replace("{checkedAt}", formatTimestamp(record.fetched_at, locale))
    .replace("{freshness}", t(`customerApp.companionPlatformKnowledge.unonightProviderAdapter.freshness.${record.freshness}`))
    .replace("{completeness}", t(`customerApp.companionPlatformKnowledge.unonightProviderAdapter.completeness.${record.completeness}`));

  const readiness = overlay.capability_readiness.find(
    (entry) => entry.capability_id === record.capability_id,
  );
  const readinessLine = readiness
    ? t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.readinessLine").replace(
        "{status}",
        t(`customerApp.companionPlatformKnowledge.unonightProviderAdapter.readinessStatus.${readiness.status}`),
      )
    : "";

  return {
    directAnswer,
    explanation: [freshnessLine, readinessLine, warningLines, t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.privacyNote")]
      .filter(Boolean)
      .join("\n"),
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.community.openCommunityCenter",
        label: t("customerApp.companionPlatformKnowledge.community.openCommunityCenter"),
        href: communityContext.cross_link_community,
        routeKey: "appCommunity",
      },
    ],
    sources: [
      {
        id: record.source_reference,
        label: t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLabel"),
        kind: "customer_context",
        meta: record.freshness,
      },
    ],
    sourceId: record.source_reference,
    source: "customer_context",
    confidence: record.completeness === "complete" ? "high" : "moderate",
  };
}

export function resolveCommunityProviderAdapterGroundedAnswer(
  match: CommunityProviderMatch,
  communityContext: CompanionCommunityContext,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer | null {
  if (!communityContext.external_provider_adapters?.length) {
    return null;
  }

  const overlay =
    communityContext.external_provider_adapters.find(
      (entry) => entry.provider_key === match.provider_key,
    ) ?? null;

  if (!overlay) return null;

  return buildCommunityProviderAdapterGroundedAnswer(
    { ...match, provider_key: overlay.provider_key },
    communityContext,
    t,
    locale,
  );
}
