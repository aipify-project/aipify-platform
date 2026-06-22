import type {
  CommunityProviderAdapterRecord,
  CommunityProviderCapabilityReadiness,
  ProviderCapabilityReadinessStatus,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import {
  applyAuthenticatedE2eReadinessGate,
  canPresentMetricBindingAsDirectAnswer,
  classifyProviderCapabilityReadiness,
  resolveMetricBindingForRequestWithAliases,
  resolveProviderRecordFreshness,
  selectExactCommandBriefSignals,
  selectPresentableMetricBinding,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import { buildCommunityCapabilityId } from "@/lib/integration-intelligence/community/types";
import type { UnonightProviderAdapterV1Capability } from "./constants";
import {
  UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
  UNONIGHT_PRODUCTION_READY_REQUIRES_E2E,
} from "./constants";
import { getUnonightAdapterSource } from "./source-map";
import { buildUnonightMetricBindings } from "./metric-grounding";
import { UNONIGHT_MEMBER_METRIC_ALIASES } from "./member-metric-aliases";
import type { UnonightAdapterSignalCounts } from "./signal-counts";

export type { UnonightAdapterSignalCounts } from "./signal-counts";

function capabilityId(capabilityKey: UnonightProviderAdapterV1Capability): string {
  return buildCommunityCapabilityId(UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY, capabilityKey, "read");
}

function resolvePresentableBinding(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  counts: UnonightAdapterSignalCounts;
  requestedMetric: string | null;
}) {
  const bindings = buildUnonightMetricBindings({
    capabilityKey: input.capabilityKey,
    counts: input.counts,
  });

  if (input.capabilityKey === "member.read") {
    return resolveMetricBindingForRequestWithAliases({
      bindings,
      requested_metric: input.requestedMetric,
      metric_aliases: UNONIGHT_MEMBER_METRIC_ALIASES,
    });
  }

  return resolveMetricBindingForRequestWithAliases({
    bindings,
    requested_metric: input.requestedMetric,
  });
}

function resolveCapabilityReadiness(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  counts: UnonightAdapterSignalCounts;
  gateActive: boolean;
  hasPermission: boolean;
  sourceStatus: "live" | "partial" | "placeholder" | "missing";
}): ProviderCapabilityReadinessStatus {
  const metricBindings = buildUnonightMetricBindings({
    capabilityKey: input.capabilityKey,
    counts: input.counts,
  });

  return classifyProviderCapabilityReadiness({
    gateActive: input.gateActive,
    hasPermission: input.hasPermission,
    sourceStatus: input.sourceStatus,
    metricBindings,
    readinessOverride: input.capabilityKey === "listing.read" ? "production_ready" : null,
    exactLiveReadiness:
      input.capabilityKey === "member.read" ? "production_ready_candidate" : undefined,
  });
}

function buildRecord(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  recordType: string;
  counts: UnonightAdapterSignalCounts;
  requestedMetric: string | null;
  sourceReference: string;
  fetchedAt: string;
  permissionScope: string | null;
  organizationId: string | null;
}): CommunityProviderAdapterRecord {
  const metric_bindings = buildUnonightMetricBindings({
    capabilityKey: input.capabilityKey,
    counts: input.counts,
  });
  const presentable = resolvePresentableBinding({
    capabilityKey: input.capabilityKey,
    counts: input.counts,
    requestedMetric: input.requestedMetric,
  });
  const bindingForRecord =
    presentable && canPresentMetricBindingAsDirectAnswer(presentable)
      ? presentable
      : selectPresentableMetricBinding(metric_bindings);

  const count =
    bindingForRecord && canPresentMetricBindingAsDirectAnswer(bindingForRecord)
      ? bindingForRecord.value
      : null;

  const completeness =
    bindingForRecord && canPresentMetricBindingAsDirectAnswer(bindingForRecord)
      ? bindingForRecord.completeness
      : metric_bindings.some((entry) => entry.value !== null)
        ? "partial"
        : "empty";

  const warnings = [
    ...new Set(
      metric_bindings.flatMap((entry) => entry.warnings).filter(Boolean),
    ),
  ];

  return {
    provider: UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
    organization_id: input.organizationId,
    capability_id: capabilityId(input.capabilityKey),
    capability_key: input.capabilityKey,
    record_type: input.recordType,
    count,
    summary: null,
    source_reference: input.sourceReference,
    fetched_at: input.fetchedAt,
    freshness: resolveProviderRecordFreshness(input.fetchedAt),
    completeness,
    permission_scope: input.permissionScope,
    warnings,
    metric_bindings,
  };
}

export function normalizeUnonightProviderAdapterRecords(input: {
  organizationId: string | null;
  fetchedAt: string;
  counts: UnonightAdapterSignalCounts;
  effectivePermissions: readonly string[];
  gateActive: boolean;
  authenticatedE2eVerifiedCapabilities?: readonly string[];
}): {
  records: CommunityProviderAdapterRecord[];
  capability_readiness: CommunityProviderCapabilityReadiness[];
} {
  const records: CommunityProviderAdapterRecord[] = [];
  const capability_readiness: CommunityProviderCapabilityReadiness[] = [];

  const hasCommunityView = input.effectivePermissions.includes("customer_community.view");
  const hasModerationView =
    input.effectivePermissions.includes("moderation.view") ||
    input.effectivePermissions.some((permission) => permission.startsWith("moderation."));
  const hasVerificationView =
    input.effectivePermissions.includes("verification.view") ||
    input.effectivePermissions.includes("customer_community.view");

  const entries: Array<{
    capabilityKey: UnonightProviderAdapterV1Capability;
    recordType: string;
    sourceReference: string;
    permissionScope: string | null;
    hasPermission: boolean;
    requestedMetric: string | null;
  }> = [
    {
      capabilityKey: "member.read",
      recordType: "member_summary",
      sourceReference: "rpc:get_unonight_member_statistics",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      requestedMetric: null,
    },
    {
      capabilityKey: "activity.read",
      recordType: "activity_summary",
      sourceReference: "rpc:get_customer_community_network_center:statistics",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      requestedMetric: "recent_activity",
    },
    {
      capabilityKey: "moderation_queue.read",
      recordType: "moderation_queue_summary",
      sourceReference: "rpc:get_aipify_moderation_dashboard:metrics.pending_review",
      permissionScope: "moderation.view",
      hasPermission: hasModerationView,
      requestedMetric: "pending_moderation",
    },
    {
      capabilityKey: "report.read",
      recordType: "report_summary",
      sourceReference: "rpc:get_aipify_moderation_dashboard:metrics.high_risk_pending",
      permissionScope: "moderation.view",
      hasPermission: hasModerationView,
      requestedMetric: "reports_attention",
    },
    {
      capabilityKey: "verification_status.read",
      recordType: "verification_summary",
      sourceReference: "rpc:get_customer_community_network_center:best_practices",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      requestedMetric: "pending_verification",
    },
    {
      capabilityKey: "verification_queue.read",
      recordType: "verification_queue_summary",
      sourceReference: "rpc:get_customer_community_network_center:best_practices",
      permissionScope: "verification.view",
      hasPermission: hasVerificationView,
      requestedMetric: "pending_verifications",
    },
    {
      capabilityKey: "verification_case.read",
      recordType: "verification_case_summary",
      sourceReference: "rpc:get_customer_community_network_center:best_practices",
      permissionScope: "verification.view",
      hasPermission: hasVerificationView,
      requestedMetric: "verification_case",
    },
    {
      capabilityKey: "listing.read",
      recordType: "listing_review_summary",
      sourceReference: "rpc:get_customer_community_network_center:marketplace_prep",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      requestedMetric: "pending_listing_count",
    },
  ];

  for (const entry of entries) {
    const source = getUnonightAdapterSource(entry.capabilityKey);
    const baseStatus = resolveCapabilityReadiness({
      capabilityKey: entry.capabilityKey,
      counts: input.counts,
      gateActive: input.gateActive,
      hasPermission: entry.hasPermission,
      sourceStatus: source?.status ?? "missing",
    });
    const status = applyAuthenticatedE2eReadinessGate({
      status: baseStatus,
      capabilityKey: entry.capabilityKey,
      authenticatedE2eVerifiedCapabilities: input.authenticatedE2eVerifiedCapabilities ?? [],
      e2eGatedCapabilities: UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES,
      productionReadyRequiresE2e: UNONIGHT_PRODUCTION_READY_REQUIRES_E2E,
    });

    capability_readiness.push({
      capability_id: capabilityId(entry.capabilityKey),
      capability_key: entry.capabilityKey,
      status,
      reason_key:
        status === "disabled"
          ? "customerApp.companionPlatformKnowledge.unonightProviderAdapter.readiness.disabled"
          : status === "adapter_missing"
            ? "customerApp.companionPlatformKnowledge.unonightProviderAdapter.readiness.adapterMissing"
            : status === "connected_but_partial"
              ? "customerApp.companionPlatformKnowledge.unonightProviderAdapter.readiness.partial"
              : status === "production_ready_candidate"
                ? "customerApp.companionPlatformKnowledge.unonightProviderAdapter.readiness.productionReadyCandidate"
                : null,
    });

    if (status === "disabled" || status === "adapter_missing") {
      continue;
    }

    records.push(
      buildRecord({
        capabilityKey: entry.capabilityKey,
        recordType: entry.recordType,
        counts: input.counts,
        requestedMetric: entry.requestedMetric,
        sourceReference: entry.sourceReference,
        fetchedAt: input.fetchedAt,
        permissionScope: entry.permissionScope,
        organizationId: input.organizationId,
      }),
    );
  }

  return { records, capability_readiness };
}

export function buildUnonightCommandBriefSignals(
  counts: UnonightAdapterSignalCounts,
): Array<{ signal_key: string; count: number | null }> {
  const stats = counts.member_statistics;
  const memberBindings =
    stats?.found && stats.completeness !== "empty"
      ? buildUnonightMetricBindings({ capabilityKey: "member.read", counts })
      : [];

  const growthBinding = memberBindings.find((entry) => entry.source_metric === "member_growth");
  const todayBinding = memberBindings.find((entry) => entry.source_metric === "new_members_today");

  const exactSignals = selectExactCommandBriefSignals([
    {
      signal_key: "new_members",
      count: stats?.new_members_today ?? null,
      semantic_match: todayBinding?.semantic_match ?? "incompatible",
    },
    {
      signal_key: "member_growth",
      count: growthBinding?.value ?? null,
      semantic_match: growthBinding?.semantic_match ?? "incompatible",
    },
  ]);

  const moderationBindings = buildUnonightMetricBindings({
    capabilityKey: "moderation_queue.read",
    counts,
  });
  const reportBindings = buildUnonightMetricBindings({
    capabilityKey: "report.read",
    counts,
  });
  const verificationBindings = buildUnonightMetricBindings({
    capabilityKey: "verification_status.read",
    counts,
  });
  const verificationQueueBindings = buildUnonightMetricBindings({
    capabilityKey: "verification_queue.read",
    counts,
  });

  return [
    ...exactSignals,
    ...selectExactCommandBriefSignals([
      {
        signal_key: "pending_moderation",
        count: counts.pending_moderation_count,
        semantic_match: moderationBindings[0]?.semantic_match ?? "incompatible",
      },
      {
        signal_key: "reports_requiring_attention",
        count: counts.reports_attention_count,
        semantic_match: reportBindings[0]?.semantic_match ?? "incompatible",
      },
      {
        signal_key: "pending_verification",
        count: counts.pending_verification_count,
        semantic_match: verificationBindings[0]?.semantic_match ?? "incompatible",
      },
      {
        signal_key: "verification_needs_information",
        count: counts.verification_needs_information_count ?? null,
        semantic_match: verificationQueueBindings[1]?.semantic_match ?? "incompatible",
      },
      {
        signal_key: "verification_high_priority",
        count: counts.verification_high_priority_count ?? null,
        semantic_match: verificationQueueBindings[2]?.semantic_match ?? "incompatible",
      },
    ]),
  ];
}
