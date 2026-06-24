import { COMPANION_EXPERIENCE_ROUTE } from "@/lib/app/companion";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type {
  PlatformKnowledgeAction,
  PlatformKnowledgeAnswer,
} from "@/lib/companion-platform-knowledge/types";
import type { CommandBriefSignal } from "@/lib/integration-intelligence/command-brief/types";
import { isCommandBriefSourceDisplayable } from "@/lib/integration-intelligence/command-brief/types";
import type { CommunityMemberDirectoryReadBundle } from "@/lib/integration-intelligence/providers/community-member-directory/community-member-directory-read-provider-adapter";
import type { OrganizationMemberCountResult } from "@/lib/integration-intelligence/providers/organization-member-count/types";
import type { SupportCaseSummary } from "@/lib/integration-intelligence/support/types";
import type { OrganizationIntelligenceIntent } from "./organization-intelligence-intent";

const BASE = "customerApp.companionPlatformKnowledge.organizationIntelligence";

function formatTimestamp(value: string | null, locale: CustomerActiveLocale): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(parsed));
}

export function filterCompanionSelfNavigationActions(
  actions: PlatformKnowledgeAction[],
): PlatformKnowledgeAction[] {
  return actions.filter(
    (action) =>
      action.routeKey !== "aipifyCompanion" &&
      action.href !== "/app/companion" &&
      action.href !== COMPANION_EXPERIENCE_ROUTE,
  );
}

function buildSourceMeta(input: {
  source: string;
  checkedAt: string | null;
  freshness: string;
  t: Translator;
  locale: CustomerActiveLocale;
  warnings?: string[];
}): { explanation: string; sourceKind: PlatformKnowledgeAnswer["source"] } {
  const sourceLine = input.t(`${BASE}.sourceLine`)
    .replace("{source}", input.source)
    .replace(
      "{checkedAt}",
      formatTimestamp(input.checkedAt, input.locale) ||
        input.t("customerApp.companionPlatformKnowledge.grounded.timestampUnavailable"),
    )
    .replace("{freshness}", input.freshness);

  const warningLines = input.warnings ?? [];
  return {
    explanation: [sourceLine, ...warningLines].filter(Boolean).join("\n"),
    sourceKind: "verified_integration",
  };
}

function baseAnswer(
  directAnswer: string,
  explanation: string,
  sourceId: string,
  sourceLabel: string,
  confidence: PlatformKnowledgeAnswer["confidence"],
  actions: PlatformKnowledgeAction[] = [],
): PlatformKnowledgeAnswer {
  return {
    directAnswer,
    explanation,
    steps: [],
    actions: filterCompanionSelfNavigationActions(actions),
    sources: [
      {
        id: sourceId,
        label: sourceLabel,
        kind: "verified_integration",
      },
    ],
    sourceId,
    source: "verified_integration",
    confidence,
    liveIntegrationToolUsed: true,
    orgConfirmEligible: true,
    requestedLiveIntegration: true,
  };
}

export type OrganizationIntelligenceGapReason =
  | "adapter_missing"
  | "permission_required"
  | "source_unavailable"
  | "missing_data"
  | "registry_not_connected"
  | "demo_data_not_presentable";

export function buildOrganizationIntelligenceGapAnswer(
  t: Translator,
  reason: OrganizationIntelligenceGapReason,
  input?: {
    sourceReference?: string | null;
    capabilityKey?: string | null;
  },
): PlatformKnowledgeAnswer {
  const key =
    reason === "permission_required"
      ? `${BASE}.permissionRequired`
      : reason === "adapter_missing"
        ? `${BASE}.adapterMissing`
        : reason === "registry_not_connected"
          ? `${BASE}.memberRegistryNotConnected`
          : reason === "demo_data_not_presentable"
            ? `${BASE}.memberRegistryNotConnected`
            : reason === "source_unavailable"
            ? `${BASE}.sourceUnavailable`
            : `${BASE}.uncertaintyMissing`;

  const statusLabel = t(`${BASE}.gapStatus.${reason}`);
  const sourceReference = input?.sourceReference?.trim() || null;
  const explanation = [
    t(`${BASE}.gapStatusLine`).replace("{status}", statusLabel),
    sourceReference
      ? t(`${BASE}.gapSourceReferenceLine`).replace("{source}", sourceReference)
      : null,
    input?.capabilityKey
      ? t(`${BASE}.gapCapabilityLine`).replace("{capability}", input.capabilityKey)
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer: t(key),
    explanation,
    steps: [],
    actions: [],
    sources: [],
    sourceId: "organization-intelligence-gap",
    source: "customer_context",
    confidence: "low",
    showSupportEscalation: false,
    requestedLiveIntegration: true,
  };
}

export function buildMemberCountAnswer(input: {
  intent: OrganizationIntelligenceIntent;
  bundle: CommunityMemberDirectoryReadBundle;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const { bundle, t, locale } = input;
  const warnings: string[] = [];
  if (!bundle.source_exact) {
    warnings.push(t(`${BASE}.uncertaintyPartial`));
  }
  if (bundle.completeness !== "complete") {
    warnings.push(t(`${BASE}.uncertaintyPartial`));
  }

  const directAnswer = t(`${BASE}.memberCountLead`).replace(
    "{count}",
    String(bundle.total_member_count),
  );

  const meta = buildSourceMeta({
    source: bundle.source_reference,
    checkedAt: bundle.freshness === "fresh" ? new Date().toISOString() : null,
    freshness: bundle.freshness,
    t,
    locale,
    warnings,
  });

  return baseAnswer(
    directAnswer,
    meta.explanation,
    bundle.source_reference,
    t(`${BASE}.sourceLabel`),
    bundle.source_exact ? "high" : "moderate",
  );
}

export function buildMemberCountFromProviderResult(input: {
  result: OrganizationMemberCountResult;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const { result, t, locale } = input;
  const count = result.total_count ?? 0;
  const directAnswer = t(`${BASE}.memberCountLead`).replace("{count}", String(count));

  const meta = buildSourceMeta({
    source: result.source_reference,
    checkedAt: result.generated_at,
    freshness: result.freshness === "fresh" ? "fresh" : "stale",
    t,
    locale,
  });

  return baseAnswer(
    directAnswer,
    meta.explanation,
    result.source_reference,
    t(`${BASE}.sourceLabel`),
    result.source_verified && result.data_classification === "live" ? "high" : "moderate",
  );
}

export function buildMemberDetailListAnswer(input: {
  bundle: CommunityMemberDirectoryReadBundle;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const members = input.bundle.members.slice(0, 12);

  const lines =
    members.length > 0
      ? members
          .map((member) =>
            input
              .t(`${BASE}.memberDetailListItem`)
              .replace("{username}", member.username)
              .replace("{memberId}", member.member_id)
              .replace("{status}", member.membership_status),
          )
          .join("\n")
      : input.t(`${BASE}.memberDetailListEmpty`);

  const warnings: string[] = [];
  if (!input.bundle.source_exact) warnings.push(input.t(`${BASE}.uncertaintyPartial`));

  const meta = buildSourceMeta({
    source: input.bundle.source_reference,
    checkedAt: new Date().toISOString(),
    freshness: input.bundle.freshness,
    t: input.t,
    locale: input.locale,
    warnings,
  });

  return baseAnswer(
    `${input.t(`${BASE}.memberDetailListLead`)}\n${lines}`,
    meta.explanation,
    input.bundle.source_reference,
    input.t(`${BASE}.sourceLabel`),
    input.bundle.source_exact && members.length > 0 ? "high" : "moderate",
  );
}

export function buildMemberActiveListAnswer(input: {
  bundle: CommunityMemberDirectoryReadBundle;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const activeMembers = input.bundle.members.filter(
    (member) => String(member.membership_status).toLowerCase() === "active",
  );

  const lines =
    activeMembers.length > 0
      ? activeMembers
          .slice(0, 8)
          .map((member) =>
            input
              .t(`${BASE}.memberActiveListItem`)
              .replace("{name}", member.display_name)
              .replace("{status}", member.membership_status),
          )
          .join("\n")
      : input.t(`${BASE}.memberActiveListEmpty`);

  const warnings: string[] = [];
  if (!input.bundle.source_exact) warnings.push(input.t(`${BASE}.uncertaintyPartial`));

  const meta = buildSourceMeta({
    source: input.bundle.source_reference,
    checkedAt: new Date().toISOString(),
    freshness: input.bundle.freshness,
    t: input.t,
    locale: input.locale,
    warnings,
  });

  return baseAnswer(
    `${input.t(`${BASE}.memberActiveListLead`)}\n${lines}`,
    meta.explanation,
    input.bundle.source_reference,
    input.t(`${BASE}.sourceLabel`),
    input.bundle.source_exact && activeMembers.length > 0 ? "high" : "moderate",
  );
}

export function buildMemberPendingVerificationAnswer(input: {
  bundle: CommunityMemberDirectoryReadBundle;
  pendingReferences: readonly string[];
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const lines =
    input.pendingReferences.length > 0
      ? input.pendingReferences
          .slice(0, 8)
          .map((reference) =>
            input
              .t(`${BASE}.memberPendingVerificationItem`)
              .replace("{reference}", reference)
              .replace("{status}", input.t("customerApp.companionPlatformKnowledge.verification.status.pending")),
          )
          .join("\n")
      : input.t(`${BASE}.memberPendingVerificationEmpty`);

  const warnings: string[] = [];
  if (!input.bundle.source_exact) warnings.push(input.t(`${BASE}.uncertaintyPartial`));

  const meta = buildSourceMeta({
    source: input.bundle.source_reference,
    checkedAt: new Date().toISOString(),
    freshness: input.bundle.freshness,
    t: input.t,
    locale: input.locale,
    warnings,
  });

  return baseAnswer(
    `${input.t(`${BASE}.memberPendingVerificationLead`)}\n${lines}`,
    meta.explanation,
    input.bundle.source_reference,
    input.t(`${BASE}.sourceLabel`),
    input.pendingReferences.length > 0 ? "high" : "moderate",
  );
}

export function buildMemberVerificationStatusAnswer(input: {
  reference: string;
  verificationStatus: string | null;
  sourceReference: string;
  sourceExact: boolean;
  freshness: string;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  if (!input.verificationStatus) {
    return buildOrganizationIntelligenceGapAnswer(input.t, "missing_data");
  }

  const statusLabel =
    input.t(`customerApp.companionPlatformKnowledge.verification.status.${input.verificationStatus}`) !==
    `customerApp.companionPlatformKnowledge.verification.status.${input.verificationStatus}`
      ? input.t(`customerApp.companionPlatformKnowledge.verification.status.${input.verificationStatus}`)
      : input.verificationStatus;

  const directAnswer = input
    .t(`${BASE}.memberVerificationStatusLead`)
    .replace("{reference}", input.reference)
    .replace("{status}", statusLabel);

  const warnings: string[] = [];
  if (!input.sourceExact) warnings.push(input.t(`${BASE}.uncertaintyPartial`));

  const meta = buildSourceMeta({
    source: input.sourceReference,
    checkedAt: new Date().toISOString(),
    freshness: input.freshness,
    t: input.t,
    locale: input.locale,
    warnings,
  });

  return baseAnswer(
    directAnswer,
    meta.explanation,
    input.sourceReference,
    input.t(`${BASE}.sourceLabel`),
    input.sourceExact ? "high" : "moderate",
  );
}

export function buildSupportSlaAnswer(input: {
  cases: readonly SupportCaseSummary[];
  sourceReference: string;
  sourceExact: boolean;
  slaSourceExact: boolean;
  generatedAt: string | null;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const slaCases = input.cases.filter((entry) =>
    ["warning", "at_risk", "breached"].includes(entry.sla_status),
  );

  const lines =
    slaCases.length > 0
      ? slaCases
          .slice(0, 8)
          .map((entry) => {
            const slaLabel = input.t(
              `customerApp.companionPlatformKnowledge.support.sla.${entry.sla_status}`,
            );
            return input
              .t(`${BASE}.supportSlaCaseLine`)
              .replace("{subject}", entry.subject)
              .replace("{slaStatus}", slaLabel);
          })
          .join("\n")
      : input.t(`${BASE}.supportSlaEmpty`);

  const warnings: string[] = [];
  if (!input.sourceExact || !input.slaSourceExact) {
    warnings.push(input.t("customerApp.companionPlatformKnowledge.support.warnings.partialSource"));
  }

  const meta = buildSourceMeta({
    source: input.sourceReference,
    checkedAt: input.generatedAt,
    freshness: input.sourceExact ? "fresh" : "unknown",
    t: input.t,
    locale: input.locale,
    warnings,
  });

  return baseAnswer(
    `${input.t(`${BASE}.supportSlaLead`)}\n${lines}`,
    meta.explanation,
    input.sourceReference,
    input.t("customerApp.companionPlatformKnowledge.support.sourceLabel"),
    slaCases.length > 0 && input.slaSourceExact ? "high" : "moderate",
    [
      {
        labelKey: "customerApp.companionPlatformKnowledge.support.openSupportCenter",
        label: input.t("customerApp.companionPlatformKnowledge.support.openSupportCenter"),
        href: "/app/support",
        routeKey: "supportRequests",
      },
    ],
  );
}

export function buildPrioritizeTodayAnswer(input: {
  signals: readonly CommandBriefSignal[];
  generatedAt: string | null;
  t: Translator;
  locale: CustomerActiveLocale;
}): PlatformKnowledgeAnswer {
  const verifiedSignals = input.signals.filter((signal) =>
    isCommandBriefSourceDisplayable(signal.source_tier),
  );

  const lines =
    verifiedSignals.length > 0
      ? verifiedSignals.slice(0, 6).map((signal, index) => {
          const title = input.t(signal.title_key);
          const resolvedTitle = title !== signal.title_key ? title : signal.category;
          return input
            .t(`${BASE}.prioritizeItemLine`)
            .replace("{rank}", String(index + 1))
            .replace("{title}", resolvedTitle)
            .replace("{module}", signal.source_module)
            .replace("{severity}", signal.severity);
        })
      : [input.t(`${BASE}.prioritizeEmpty`)];

  const sourceModules = [...new Set(verifiedSignals.map((signal) => signal.source_module))];
  const meta = buildSourceMeta({
    source: sourceModules.join(", ") || input.t(`${BASE}.sourceLabel`),
    checkedAt: input.generatedAt,
    freshness: verifiedSignals.some((signal) => signal.freshness === "stale") ? "stale" : "fresh",
    t: input.t,
    locale: input.locale,
    warnings:
      verifiedSignals.length === 0
        ? [input.t(`${BASE}.uncertaintyMissing`)]
        : verifiedSignals.some((signal) => signal.completeness === "partial")
          ? [input.t(`${BASE}.uncertaintyPartial`)]
          : [],
  });

  return baseAnswer(
    `${input.t(`${BASE}.prioritizeLead`)}\n${lines.join("\n")}`,
    meta.explanation,
    "command-brief-prioritized-signals",
    input.t(`${BASE}.sourceLabel`),
    verifiedSignals.length > 0 ? "high" : "moderate",
    [
      {
        labelKey: "customerApp.companionPlatformKnowledge.actions.commandBrief",
        label: input.t("customerApp.companionPlatformKnowledge.actions.commandBrief"),
        href: "/app/command-center",
        routeKey: "commandBrief",
      },
    ],
  );
}
