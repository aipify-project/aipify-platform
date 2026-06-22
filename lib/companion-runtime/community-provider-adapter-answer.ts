import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import {
  canPresentMetricBindingAsDirectAnswer,
  resolveMetricBindingForRequest,
  type ProviderMetricBinding,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import type {
  CommunityExternalProviderAdapterOverlay,
  CommunityProviderAdapterRecord,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import type { CompanionCommunityContext } from "./companion-community-context";
import type { CommunityProviderMatch } from "./community-answer";

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
    "verification_queue.read",
    "verification_case.read",
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

function requestedMetricLabelKey(requestedMetric: string): string {
  return `customerApp.companionPlatformKnowledge.unonightProviderAdapter.requestedMetrics.${requestedMetric}`;
}

function resolveBindingForMatch(
  record: CommunityProviderAdapterRecord,
  match: CommunityProviderMatch,
): ProviderMetricBinding | null {
  const bindings = record.metric_bindings ?? [];
  if (bindings.length === 0) {
    return null;
  }

  return resolveMetricBindingForRequest({
    bindings,
    requested_metric: match.requested_metric ?? null,
    period: match.requested_period ?? null,
  });
}

function buildMetricGapAnswer(input: {
  match: CommunityProviderMatch;
  record: CommunityProviderAdapterRecord;
  overlay: CommunityExternalProviderAdapterOverlay;
  communityContext: CompanionCommunityContext;
  t: Translator;
  locale: CustomerActiveLocale;
  binding: ProviderMetricBinding | null;
}): PlatformKnowledgeAnswer {
  const capabilityLabel = input.t(capabilityLabelKey(String(input.record.capability_key)));
  const metricKey = input.match.requested_metric ?? "unknown_metric";
  const metricLabel = input.t(requestedMetricLabelKey(metricKey));

  const directAnswer = input
    .t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.metricGapLead")
    .replace("{capability}", capabilityLabel)
    .replace("{metric}", metricLabel);

  const freshnessLine = input
    .t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLine")
    .replace("{source}", input.record.source_reference)
    .replace("{checkedAt}", formatTimestamp(input.record.fetched_at, input.locale))
    .replace(
      "{freshness}",
      input.t(
        `customerApp.companionPlatformKnowledge.unonightProviderAdapter.freshness.${input.record.freshness}`,
      ),
    )
    .replace(
      "{completeness}",
      input.t(
        `customerApp.companionPlatformKnowledge.unonightProviderAdapter.completeness.${input.record.completeness}`,
      ),
    );

  const readiness = input.overlay.capability_readiness.find(
    (entry) => entry.capability_id === input.record.capability_id,
  );
  const readinessLine = readiness
    ? input
        .t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.readinessLine")
        .replace(
          "{status}",
          input.t(
            `customerApp.companionPlatformKnowledge.unonightProviderAdapter.readinessStatus.${readiness.status}`,
          ),
        )
    : "";

  const proxyWarnings =
    input.binding?.semantic_match === "proxy"
      ? input.binding.warnings.map((warningKey) => input.t(warningKey))
      : [];

  const explanation = [
    input
      .t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.metricGapExplanation")
      .replace("{metric}", metricLabel),
    freshnessLine,
    readinessLine,
    ...proxyWarnings,
    input.t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.privacyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.community.openCommunityCenter",
        label: input.t("customerApp.companionPlatformKnowledge.community.openCommunityCenter"),
        href: input.communityContext.cross_link_community,
        routeKey: "appCommunity",
      },
    ],
    sources: [
      {
        id: input.record.source_reference,
        label: input.t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLabel"),
        kind: "customer_context",
        meta: input.record.freshness,
      },
    ],
    sourceId: input.record.source_reference,
    source: "customer_context",
    confidence: "moderate",
  };
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

  const binding = resolveBindingForMatch(record, match);
  if (binding && canPresentMetricBindingAsDirectAnswer(binding) && binding.value !== null) {
    const presentable = binding;
    const capabilityLabel = t(capabilityLabelKey(String(record.capability_key)));
    const countValue = String(presentable.value);

    const directAnswer = t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.groundedLead")
      .replace("{capability}", capabilityLabel)
      .replace("{count}", countValue);

    const relatedProxyLines =
      record.metric_bindings
        ?.filter(
          (entry) =>
            entry.semantic_match === "proxy" &&
            entry.requested_metric === match.requested_metric &&
            entry.warnings.length > 0,
        )
        .flatMap((entry) => entry.warnings.map((warningKey) => t(warningKey))) ?? [];

    const warningLines = [
      ...new Set([
        ...record.warnings.map((warningKey) => t(warningKey)),
        ...relatedProxyLines,
      ]),
    ].join("\n");

    const freshnessLine = t("customerApp.companionPlatformKnowledge.unonightProviderAdapter.sourceLine")
      .replace("{source}", record.source_reference)
      .replace("{checkedAt}", formatTimestamp(record.fetched_at, locale))
      .replace(
        "{freshness}",
        t(`customerApp.companionPlatformKnowledge.unonightProviderAdapter.freshness.${record.freshness}`),
      )
      .replace(
        "{completeness}",
        t(`customerApp.companionPlatformKnowledge.unonightProviderAdapter.completeness.${record.completeness}`),
      );

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
      confidence: presentable.completeness === "complete" ? "high" : "moderate",
    };
  }

  return buildMetricGapAnswer({
    match,
    record,
    overlay,
    communityContext,
    t,
    locale,
    binding,
  });
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
