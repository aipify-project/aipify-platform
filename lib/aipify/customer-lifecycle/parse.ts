import type { CustomerLifecycleCard, CustomerLifecycleDashboard, RecommendationActionResult } from "./types";

export function parseCustomerLifecycleCard(data: unknown): CustomerLifecycleCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    success_score: d.success_score as number | undefined,
    health_band: d.health_band as string | undefined,
    health_band_label: d.health_band_label as string | undefined,
    lifecycle_stage: d.lifecycle_stage as string | undefined,
    quick_wins_count: d.quick_wins_count as number | undefined,
    philosophy: d.philosophy as string | undefined,
    no_pressure: d.no_pressure as boolean | undefined,
  };
}

export function parseCustomerLifecycleDashboard(data: unknown): CustomerLifecycleDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    no_pressure: d.no_pressure as boolean | undefined,
    expansion_follows_value: d.expansion_follows_value as boolean | undefined,
    orchestration_enabled: d.orchestration_enabled as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    success_score: d.success_score as number | undefined,
    health_band: d.health_band as string | undefined,
    health_band_label: d.health_band_label as string | undefined,
    lifecycle_stage: d.lifecycle_stage as string | undefined,
    lifecycle_stage_label: d.lifecycle_stage_label as string | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    milestones: Array.isArray(d.milestones) ? (d.milestones as CustomerLifecycleDashboard["milestones"]) : [],
    quick_wins: Array.isArray(d.quick_wins) ? (d.quick_wins as CustomerLifecycleDashboard["quick_wins"]) : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as CustomerLifecycleDashboard["recommendations"])
      : [],
    playbooks: Array.isArray(d.playbooks) ? (d.playbooks as CustomerLifecycleDashboard["playbooks"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as CustomerLifecycleDashboard["briefings"]) : [],
    signals: d.signals as CustomerLifecycleDashboard["signals"],
    lifecycle_stages: Array.isArray(d.lifecycle_stages)
      ? (d.lifecycle_stages as CustomerLifecycleDashboard["lifecycle_stages"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseRecommendationActionResult(data: unknown): RecommendationActionResult {
  return (data ?? {}) as RecommendationActionResult;
}
