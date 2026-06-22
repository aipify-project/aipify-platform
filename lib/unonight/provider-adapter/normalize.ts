import type {
  CommunityProviderAdapterRecord,
  CommunityProviderCapabilityReadiness,
  ProviderCapabilityReadinessStatus,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import { buildCommunityCapabilityId } from "@/lib/integration-intelligence/community/types";
import type { UnonightProviderAdapterV1Capability } from "./constants";
import { UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY } from "./constants";
import { getUnonightAdapterSource } from "./source-map";

export type UnonightAdapterSignalCounts = {
  new_members_count: number | null;
  pending_moderation_count: number | null;
  pending_verification_count: number | null;
  reports_attention_count: number | null;
  listing_review_count: number | null;
  activity_count: number | null;
};

function capabilityId(capabilityKey: UnonightProviderAdapterV1Capability): string {
  return buildCommunityCapabilityId(UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY, capabilityKey, "read");
}

function resolveFreshness(fetchedAt: string): CommunityProviderAdapterRecord["freshness"] {
  const parsed = Date.parse(fetchedAt);
  if (!Number.isFinite(parsed)) return "unknown";
  const ageMs = Date.now() - parsed;
  if (ageMs <= 15 * 60 * 1000) return "fresh";
  if (ageMs <= 6 * 60 * 60 * 1000) return "stale";
  return "stale";
}

function resolveCompleteness(count: number | null): CommunityProviderAdapterRecord["completeness"] {
  if (count === null) return "empty";
  if (count === 0) return "complete";
  return "complete";
}

function resolveReadiness(
  count: number | null,
  sourceStatus: "live" | "partial" | "placeholder" | "missing",
  gateActive: boolean,
  hasPermission: boolean,
): ProviderCapabilityReadinessStatus {
  if (!gateActive) return "disabled";
  if (!hasPermission) return "disabled";
  if (sourceStatus === "missing") return "adapter_missing";
  if (count === null) return sourceStatus === "live" ? "connected_but_partial" : "adapter_missing";
  if (sourceStatus === "partial") return "connected_but_partial";
  return "production_ready";
}

function buildRecord(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  recordType: string;
  count: number | null;
  summary: string | null;
  sourceReference: string;
  fetchedAt: string;
  permissionScope: string | null;
  warnings: string[];
  organizationId: string | null;
}): CommunityProviderAdapterRecord {
  return {
    provider: UNONIGHT_COMMUNITY_ADAPTER_PROVIDER_KEY,
    organization_id: input.organizationId,
    capability_id: capabilityId(input.capabilityKey),
    capability_key: input.capabilityKey,
    record_type: input.recordType,
    count: input.count,
    summary: input.summary,
    source_reference: input.sourceReference,
    fetched_at: input.fetchedAt,
    freshness: resolveFreshness(input.fetchedAt),
    completeness: resolveCompleteness(input.count),
    permission_scope: input.permissionScope,
    warnings: input.warnings,
  };
}

export function normalizeUnonightProviderAdapterRecords(input: {
  organizationId: string | null;
  fetchedAt: string;
  counts: UnonightAdapterSignalCounts;
  effectivePermissions: readonly string[];
  gateActive: boolean;
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
    count: number | null;
    summary: string | null;
    sourceReference: string;
    permissionScope: string | null;
    hasPermission: boolean;
    warnings: string[];
  }> = [
    {
      capabilityKey: "member.read",
      recordType: "member_summary",
      count: input.counts.new_members_count,
      summary: null,
      sourceReference: "rpc:get_customer_community_network_center:statistics",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      warnings:
        input.counts.new_members_count !== null
          ? ["customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.memberCountProxy"]
          : [],
    },
    {
      capabilityKey: "activity.read",
      recordType: "activity_summary",
      count: input.counts.activity_count ?? input.counts.new_members_count,
      summary: null,
      sourceReference: "rpc:get_customer_community_network_center:statistics",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      warnings:
        input.counts.activity_count === null
          ? ["customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.activityPartial"]
          : [],
    },
    {
      capabilityKey: "moderation_queue.read",
      recordType: "moderation_queue_summary",
      count: input.counts.pending_moderation_count,
      summary: null,
      sourceReference: "rpc:get_aipify_moderation_dashboard:metrics.pending_review",
      permissionScope: "moderation.view",
      hasPermission: hasModerationView,
      warnings: [],
    },
    {
      capabilityKey: "report.read",
      recordType: "report_summary",
      count: input.counts.reports_attention_count,
      summary: null,
      sourceReference: "rpc:get_aipify_moderation_dashboard:metrics.high_risk_pending",
      permissionScope: "moderation.view",
      hasPermission: hasModerationView,
      warnings: [],
    },
    {
      capabilityKey: "verification_status.read",
      recordType: "verification_summary",
      count: input.counts.pending_verification_count,
      summary: null,
      sourceReference: "rpc:get_customer_community_network_center:best_practices",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      warnings:
        input.counts.pending_verification_count === null
          ? ["customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.verificationPartial"]
          : [],
    },
    {
      capabilityKey: "listing.read",
      recordType: "listing_review_summary",
      count: input.counts.listing_review_count,
      summary: null,
      sourceReference: "rpc:get_customer_community_network_center:marketplace_prep",
      permissionScope: "customer_community.view",
      hasPermission: hasCommunityView,
      warnings: [],
    },
  ];

  for (const entry of entries) {
    const source = getUnonightAdapterSource(entry.capabilityKey);
    const status = resolveReadiness(
      entry.count,
      source?.status ?? "missing",
      input.gateActive,
      entry.hasPermission,
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
              : null,
    });

    if (status === "disabled" || status === "adapter_missing") {
      continue;
    }

    records.push(
      buildRecord({
        capabilityKey: entry.capabilityKey,
        recordType: entry.recordType,
        count: entry.count,
        summary: entry.summary,
        sourceReference: entry.sourceReference,
        fetchedAt: input.fetchedAt,
        permissionScope: entry.permissionScope,
        warnings: entry.warnings,
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

  if (counts.new_members_count !== null && counts.new_members_count > 0) {
    signals.push({ signal_key: "new_members", count: counts.new_members_count });
    signals.push({
      signal_key: "activity_change",
      count: counts.activity_count ?? counts.new_members_count,
    });
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
