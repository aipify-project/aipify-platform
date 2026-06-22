import type { ProviderMetricBinding } from "@/lib/integration-intelligence/community/provider-adapter-types";
import type { UnonightProviderAdapterV1Capability } from "./constants";
import type { UnonightAdapterSignalCounts } from "./normalize";

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
      semantic_match: stats.new_members_since === null ? "incompatible" : "exact",
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

/** Maps Unonight RPC fields to generic ProviderMetricBinding records — no Core logic here. */
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

  if (capabilityKey === "verification_queue.read") {
    return [
      binding({
        source_field: "best_practices[].moderation_status",
        source_metric: "pending_verifications",
        requested_metric: "pending_verifications",
        semantic_match: counts.pending_verification_count === null ? "incompatible" : "compatible",
        period: "current",
        value: counts.pending_verification_count,
        completeness: counts.pending_verification_count === null ? "empty" : "partial",
        confidence: "moderate",
        warnings: [
          "customerApp.companionPlatformKnowledge.verification.warnings.queuePartialSource",
        ],
      }),
      binding({
        source_field: "best_practices[].status_key",
        source_metric: "needs_information",
        requested_metric: "needs_information",
        semantic_match: "compatible",
        period: "current",
        value: counts.verification_needs_information_count ?? null,
        completeness: counts.verification_needs_information_count === null ? "empty" : "partial",
        confidence: "moderate",
      }),
      binding({
        source_field: "best_practices[].status_key",
        source_metric: "high_priority",
        requested_metric: "high_priority",
        semantic_match: "compatible",
        period: "current",
        value: counts.verification_high_priority_count ?? null,
        completeness: counts.verification_high_priority_count === null ? "empty" : "partial",
        confidence: "moderate",
      }),
    ];
  }

  if (capabilityKey === "verification_case.read") {
    return [
      binding({
        source_field: "best_practices[].practice_key",
        source_metric: "verification_case",
        requested_metric: "verification_case",
        semantic_match: "compatible",
        period: "current",
        value: counts.pending_verification_count,
        completeness: "partial",
        confidence: "moderate",
        warnings: [
          "customerApp.companionPlatformKnowledge.verification.warnings.casePartialSource",
        ],
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
