import type {
  CommunityProviderAdapterRecord,
  CommunityProviderCapabilityReadiness,
  ProviderCapabilityReadinessStatus,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import {
  canPresentMetricBindingAsDirectAnswer,
  selectPresentableMetricBinding,
} from "@/lib/integration-intelligence/community/metric-contract";
import { buildCommunityCapabilityId } from "@/lib/integration-intelligence/community/types";
import type { UnonightProviderAdapterV1Capability } from "./constants";
import {
  UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES,
  UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
  UNONIGHT_PRODUCTION_READY_REQUIRES_E2E,
} from "./constants";
import { getUnonightAdapterSource } from "./source-map";
import {
  buildUnonightMetricBindings,
  resolveUnonightPresentableBinding,
} from "./metric-grounding";

export type UnonightAdapterSignalCounts = {
  group_count: number | null;
  discussion_count: number | null;
  pending_moderation_count: number | null;
  pending_verification_count: number | null;
  reports_attention_count: number | null;
  listing_review_count: number | null;
};

function capabilityId(capabilityKey: UnonightProviderAdapterV1Capability): string {
  return buildCommunityCapabilityId(UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY, capabilityKey, "read");
}

function resolveFreshness(fetchedAt: string): CommunityProviderAdapterRecord["freshness"] {
  const parsed = Date.parse(fetchedAt);
  if (!Number.isFinite(parsed)) return "unknown";
  const ageMs = Date.now() - parsed;
  if (ageMs <= 15 * 60 * 1000) return "fresh";
  return "stale";
}

function finalizeAuthenticatedE2eReadiness(
  capabilityKey: UnonightProviderAdapterV1Capability,
  status: ProviderCapabilityReadinessStatus,
  authenticatedE2eVerifiedCapabilities: readonly string[],
): ProviderCapabilityReadinessStatus {
  if (
    UNONIGHT_PRODUCTION_READY_REQUIRES_E2E &&
    status === "production_ready" &&
    !authenticatedE2eVerifiedCapabilities.includes(capabilityKey)
  ) {
    return "production_ready_candidate";
  }

  if (
    status === "production_ready" &&
    UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES.includes(
      capabilityKey as (typeof UNONIGHT_AUTHENTICATED_E2E_GATED_CAPABILITIES)[number],
    ) &&
    !authenticatedE2eVerifiedCapabilities.includes(capabilityKey)
  ) {
    return "production_ready_candidate";
  }

  return status;
}

function resolveBaseReadiness(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  presentableBinding: ReturnType<typeof resolveUnonightPresentableBinding>;
  gateActive: boolean;
  hasPermission: boolean;
  sourceStatus: "live" | "partial" | "placeholder" | "missing";
}): ProviderCapabilityReadinessStatus {
  if (!input.gateActive || !input.hasPermission) return "disabled";
  if (input.sourceStatus === "missing") return "adapter_missing";

  if (input.capabilityKey === "member.read") {
    return "connected_but_partial";
  }

  if (input.capabilityKey === "listing.read") {
    return "production_ready";
  }

  const binding = input.presentableBinding;
  if (!binding || !canPresentMetricBindingAsDirectAnswer(binding)) {
    return "connected_but_partial";
  }

  if (input.sourceStatus === "partial") return "connected_but_partial";
  return "production_ready";
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
  const presentable = resolveUnonightPresentableBinding({
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
    freshness: resolveFreshness(input.fetchedAt),
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
      sourceReference: "rpc:get_customer_community_network_center:statistics",
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
    const presentableBinding = resolveUnonightPresentableBinding({
      capabilityKey: entry.capabilityKey,
      counts: input.counts,
      requestedMetric: entry.requestedMetric,
    });
    const baseStatus = resolveBaseReadiness({
      capabilityKey: entry.capabilityKey,
      presentableBinding,
      gateActive: input.gateActive,
      hasPermission: entry.hasPermission,
      sourceStatus: source?.status ?? "missing",
    });
    const status = finalizeAuthenticatedE2eReadiness(
      entry.capabilityKey,
      baseStatus,
      input.authenticatedE2eVerifiedCapabilities ?? [],
    );

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
  const signals: Array<{ signal_key: string; count: number | null }> = [];

  if (counts.discussion_count !== null && counts.discussion_count > 0) {
    signals.push({ signal_key: "activity_change", count: counts.discussion_count });
  }
  if (counts.pending_moderation_count !== null && counts.pending_moderation_count > 0) {
    signals.push({ signal_key: "pending_moderation", count: counts.pending_moderation_count });
  }
  if (counts.reports_attention_count !== null && counts.reports_attention_count > 0) {
    signals.push({
      signal_key: "reports_requiring_attention",
      count: counts.reports_attention_count,
    });
  }
  if (counts.pending_verification_count !== null && counts.pending_verification_count > 0) {
    signals.push({ signal_key: "pending_verification", count: counts.pending_verification_count });
  }
  if (counts.listing_review_count !== null && counts.listing_review_count > 0) {
    signals.push({ signal_key: "listing_review", count: counts.listing_review_count });
  }

  return signals;
}
