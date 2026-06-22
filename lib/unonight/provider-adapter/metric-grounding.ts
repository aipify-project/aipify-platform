import type { ProviderMetricBinding } from "@/lib/integration-intelligence/community/provider-adapter-types";
import type { UnonightProviderAdapterV1Capability } from "./constants";
import type { UnonightAdapterSignalCounts } from "./normalize";

export type UnonightRequestedMemberMetric =
  | "total_members"
  | "new_members"
  | "members_today"
  | "members_last_7_days"
  | "members_last_30_days"
  | "members_since_last"
  | "member_growth"
  | "active_members";

export function mapSemanticMetricToRequested(input: {
  entity: string | null;
  metric: string | null;
  timeScope: string | null;
}): string | null {
  if (!input.entity || input.entity !== "member") return null;
  if (input.metric === "new" || input.timeScope === "since_last") return "new_members";
  if (input.metric === "growth") return "member_growth";
  if (input.metric === "active") return "active_members";
  if (input.metric === "total" || input.metric === "count") return "total_members";
  if (input.timeScope === "period") {
    return "members_last_30_days";
  }
  return "total_members";
}

function binding(
  partial: Omit<ProviderMetricBinding, "warnings"> & { warnings?: string[] },
): ProviderMetricBinding {
  return {
    warnings: [],
    ...partial,
  };
}

function memberReadBindings(counts: UnonightAdapterSignalCounts): ProviderMetricBinding[] {
  const stats = counts.member_statistics;

  if (!stats?.found || stats.completeness === "empty") {
    return [];
  }

  const completeness = stats.completeness;
  const confidence = completeness === "complete" ? "high" : "moderate";

  const bindings: ProviderMetricBinding[] = [
    binding({
      source_field: "member_statistics.total_members",
      source_metric: "total_members",
      requested_metric: "total_members",
      semantic_match: stats.total_members === null ? "incompatible" : "exact",
      period: "current",
      value: stats.total_members,
      completeness: stats.total_members === null ? "empty" : completeness,
      confidence: stats.total_members === null ? "low" : confidence,
    }),
    binding({
      source_field: "member_statistics.active_members",
      source_metric: "active_members",
      requested_metric: "active_members",
      semantic_match: stats.active_members === null ? "incompatible" : "exact",
      period: "current",
      value: stats.active_members,
      completeness: stats.active_members === null ? "empty" : completeness,
      confidence: stats.active_members === null ? "low" : confidence,
    }),
    binding({
      source_field: "member_statistics.new_members_today",
      source_metric: "new_members_today",
      requested_metric: "members_today",
      semantic_match: stats.new_members_today === null ? "incompatible" : "exact",
      period: "today",
      value: stats.new_members_today,
      completeness: stats.new_members_today === null ? "empty" : completeness,
      confidence: stats.new_members_today === null ? "low" : confidence,
    }),
    binding({
      source_field: "member_statistics.new_members_7d",
      source_metric: "new_members_7d",
      requested_metric: "members_last_7_days",
      semantic_match: stats.new_members_7d === null ? "incompatible" : "exact",
      period: "7d",
      value: stats.new_members_7d,
      completeness: stats.new_members_7d === null ? "empty" : completeness,
      confidence: stats.new_members_7d === null ? "low" : confidence,
    }),
    binding({
      source_field: "member_statistics.new_members_30d",
      source_metric: "new_members_30d",
      requested_metric: "members_last_30_days",
      semantic_match: stats.new_members_30d === null ? "incompatible" : "exact",
      period: "30d",
      value: stats.new_members_30d,
      completeness: stats.new_members_30d === null ? "empty" : completeness,
      confidence: stats.new_members_30d === null ? "low" : confidence,
    }),
    binding({
      source_field: "member_statistics.new_members_since",
      source_metric: "new_members_since",
      requested_metric: "new_members",
      semantic_match:
        stats.new_members_since === null
          ? stats.period.kind === "since_last" && stats.since_boundary_source === "none"
            ? "incompatible"
            : "incompatible"
          : "exact",
      period: stats.period.kind === "since_last" ? "since_last" : "explicit",
      value: stats.new_members_since,
      completeness:
        stats.new_members_since === null
          ? stats.since_boundary_source === "none"
            ? "empty"
            : "partial"
          : completeness,
      confidence: stats.new_members_since === null ? "low" : confidence,
      warnings:
        stats.new_members_since === null && stats.since_boundary_source === "none"
          ? [
              "customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.sinceLastRequiresLogin",
            ]
          : [],
    }),
  ];

  const growthTotal =
    stats.member_growth.length > 0
      ? stats.member_growth.reduce((sum, entry) => sum + entry.net_growth, 0)
      : null;

  bindings.push(
    binding({
      source_field: "member_statistics.member_growth",
      source_metric: "member_growth",
      requested_metric: "member_growth",
      semantic_match: growthTotal === null ? "incompatible" : "exact",
      period: "current",
      value: growthTotal,
      completeness: growthTotal === null ? "empty" : completeness,
      confidence: growthTotal === null ? "low" : confidence,
    }),
  );

  return bindings;
}

/** Documented Unonight member statistics source — exact metrics only, no proxy counts. */
export function buildUnonightMetricBindings(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  counts: UnonightAdapterSignalCounts;
}): ProviderMetricBinding[] {
  const { counts, capabilityKey } = input;

  if (capabilityKey === "member.read") {
    return memberReadBindings(counts);
  }

  if (capabilityKey === "activity.read") {
    return [
      binding({
        source_field: "statistics.discussion_count",
        source_metric: "discussion_count",
        requested_metric: "recent_activity",
        semantic_match: counts.discussion_count === null ? "incompatible" : "compatible",
        period: "current",
        value: counts.discussion_count,
        completeness: counts.discussion_count === null ? "empty" : "partial",
        confidence: counts.discussion_count === null ? "low" : "moderate",
        warnings:
          counts.discussion_count === null
            ? ["customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.activityPartial"]
            : [],
      }),
      binding({
        source_field: "statistics.discussion_count",
        source_metric: "discussion_count",
        requested_metric: "members_since_last_login",
        semantic_match: "incompatible",
        period: "since_last",
        value: counts.discussion_count,
        completeness: "partial",
        confidence: "low",
        warnings: [
          "customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.activityNotMembersSinceLast",
        ],
      }),
    ];
  }

  if (capabilityKey === "moderation_queue.read") {
    return [
      binding({
        source_field: "metrics.pending_review",
        source_metric: "pending_review",
        requested_metric: "pending_moderation",
        semantic_match: "exact",
        period: "current",
        value: counts.pending_moderation_count,
        completeness: counts.pending_moderation_count === null ? "empty" : "complete",
        confidence: "high",
      }),
    ];
  }

  if (capabilityKey === "report.read") {
    return [
      binding({
        source_field: "metrics.high_risk_pending",
        source_metric: "high_risk_pending",
        requested_metric: "reports_attention",
        semantic_match: "exact",
        period: "current",
        value: counts.reports_attention_count,
        completeness: counts.reports_attention_count === null ? "empty" : "complete",
        confidence: "high",
      }),
    ];
  }

  if (capabilityKey === "verification_status.read") {
    return [
      binding({
        source_field: "best_practices[].moderation_status",
        source_metric: "pending_verification",
        requested_metric: "pending_verification",
        semantic_match: counts.pending_verification_count === null ? "incompatible" : "compatible",
        period: "current",
        value: counts.pending_verification_count,
        completeness: counts.pending_verification_count === null ? "empty" : "partial",
        confidence: "moderate",
        warnings:
          counts.pending_verification_count === null
            ? ["customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.verificationPartial"]
            : [],
      }),
    ];
  }

  if (capabilityKey === "listing.read") {
    return [
      binding({
        source_field: "marketplace_prep[].moderation_status",
        source_metric: "marketplace_prep",
        requested_metric: "pending_listing_count",
        semantic_match: "proxy",
        period: "current",
        value: counts.listing_review_count,
        completeness: counts.listing_review_count === null ? "empty" : "partial",
        confidence: "low",
        warnings: [
          "customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.listingPrepNotPendingFilter",
        ],
      }),
    ];
  }

  return [];
}

export function resolveUnonightPresentableBinding(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  counts: UnonightAdapterSignalCounts;
  requestedMetric: string | null;
  period?: string | null;
}): ProviderMetricBinding | null {
  const bindings = buildUnonightMetricBindings({
    capabilityKey: input.capabilityKey,
    counts: input.counts,
  });

  if (input.requestedMetric) {
    const metricAliases: Record<string, string[]> = {
      new_members: ["new_members", "members_since_last", "members_today", "members_last_7_days", "members_last_30_days"],
      members_today: ["members_today", "new_members"],
      members_last_7_days: ["members_last_7_days", "new_members"],
      members_last_30_days: ["members_last_30_days", "new_members"],
    };
    const aliases = metricAliases[input.requestedMetric] ?? [input.requestedMetric];

    for (const alias of aliases) {
      const match =
        bindings.find(
          (entry) =>
            entry.requested_metric === alias &&
            (entry.semantic_match === "exact" || entry.semantic_match === "compatible"),
        ) ?? bindings.find((entry) => entry.requested_metric === alias);
      if (match) return match;
    }
    return null;
  }

  return bindings.find((entry) => entry.semantic_match === "exact" || entry.semantic_match === "compatible") ?? null;
}

export function resolveUnonightMemberReadinessStatus(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  counts: UnonightAdapterSignalCounts;
  requestedMetric: string | null;
  gateActive: boolean;
  hasPermission: boolean;
  sourceStatus: "live" | "partial" | "placeholder" | "missing";
}): "connected_but_partial" | "production_ready_candidate" | "adapter_missing" | "disabled" {
  if (!input.gateActive || !input.hasPermission) return "disabled";
  if (input.sourceStatus === "missing") return "adapter_missing";

  if (input.capabilityKey === "member.read") {
    const bindings = buildUnonightMetricBindings({
      capabilityKey: "member.read",
      counts: input.counts,
    });
    const hasExact = bindings.some(
      (entry) => entry.semantic_match === "exact" && entry.value !== null,
    );
    if (hasExact && input.sourceStatus === "live") {
      return "production_ready_candidate";
    }
    return "connected_but_partial";
  }

  const binding = resolveUnonightPresentableBinding({
    capabilityKey: input.capabilityKey,
    counts: input.counts,
    requestedMetric: input.requestedMetric,
  });

  if (!binding) return "connected_but_partial";
  if (binding.semantic_match === "exact" || binding.semantic_match === "compatible") {
    return binding.value === null ? "connected_but_partial" : "connected_but_partial";
  }
  return "connected_but_partial";
}

export function hasUnonightExactMemberSource(counts: UnonightAdapterSignalCounts): boolean {
  const stats = counts.member_statistics;
  return Boolean(
    stats?.found &&
      stats.completeness !== "empty" &&
      stats.total_members !== null,
  );
}
