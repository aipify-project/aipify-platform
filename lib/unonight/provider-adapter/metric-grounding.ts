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
  | "member_growth";

export function mapSemanticMetricToRequested(input: {
  entity: string | null;
  metric: string | null;
  timeScope: string | null;
}): string | null {
  if (!input.entity || input.entity !== "member") return null;
  if (input.metric === "new" || input.timeScope === "since_last") return "new_members";
  if (input.metric === "growth") return "member_growth";
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

/** Documented Unonight V1 source schema — no proxy metrics presented as requested metrics. */
export function buildUnonightMetricBindings(input: {
  capabilityKey: UnonightProviderAdapterV1Capability;
  counts: UnonightAdapterSignalCounts;
}): ProviderMetricBinding[] {
  const { counts, capabilityKey } = input;

  if (capabilityKey === "member.read") {
    return [
      binding({
        source_field: "statistics.group_count",
        source_metric: "group_count",
        requested_metric: "total_members",
        semantic_match: "incompatible",
        period: "current",
        value: counts.group_count,
        completeness: counts.group_count === null ? "empty" : "partial",
        confidence: "low",
        warnings: [
          "customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.groupCountNotTotalMembers",
        ],
      }),
      binding({
        source_field: "statistics.discussion_count",
        source_metric: "discussion_count",
        requested_metric: "new_members",
        semantic_match: "incompatible",
        period: "current",
        value: counts.discussion_count,
        completeness: counts.discussion_count === null ? "empty" : "partial",
        confidence: "low",
        warnings: [
          "customerApp.companionPlatformKnowledge.unonightProviderAdapter.warnings.discussionCountNotNewMembers",
        ],
      }),
    ];
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
    const match =
      bindings.find(
        (entry) =>
          entry.requested_metric === input.requestedMetric &&
          (entry.semantic_match === "exact" || entry.semantic_match === "compatible"),
      ) ?? bindings.find((entry) => entry.requested_metric === input.requestedMetric);
    return match ?? null;
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
}): "connected_but_partial" | "adapter_missing" | "disabled" {
  if (!input.gateActive || !input.hasPermission) return "disabled";
  if (input.sourceStatus === "missing") return "adapter_missing";

  if (input.capabilityKey === "member.read") {
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
