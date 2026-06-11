import type { AocCard, AocDashboard, AocReviewResult, WatcherFindingDetail } from "./types";

export function parseAocCard(data: unknown): AocCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    overall_score: d.overall_score as number | undefined,
    health_band: d.health_band as string | undefined,
    open_findings: d.open_findings as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_oversight_required: d.human_oversight_required as boolean | undefined,
  };
}

export function parseAocDashboard(data: unknown): AocDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: d.human_oversight_required as boolean | undefined,
    overall_score: d.overall_score as number | undefined,
    health_band: d.health_band as string | undefined,
    health_components: d.health_components as AocDashboard["health_components"],
    findings: Array.isArray(d.findings) ? (d.findings as AocDashboard["findings"]) : [],
    recommendations: Array.isArray(d.recommendations) ? (d.recommendations as AocDashboard["recommendations"]) : [],
    reviews: Array.isArray(d.reviews) ? (d.reviews as AocDashboard["reviews"]) : [],
    watchers: Array.isArray(d.watchers) ? (d.watchers as AocDashboard["watchers"]) : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseWatcherFindingDetail(data: unknown): WatcherFindingDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.finding) return null;
  return {
    finding: d.finding as WatcherFindingDetail["finding"],
    recommendation: d.recommendation as WatcherFindingDetail["recommendation"],
    human_oversight_required: d.human_oversight_required as boolean | undefined,
  };
}

export function parseAocReviewResult(data: unknown): AocReviewResult | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.review_id) return null;
  return {
    review_id: String(d.review_id),
    review_type: String(d.review_type ?? "daily"),
    summary: String(d.summary ?? ""),
    content: (d.content ?? {}) as Record<string, unknown>,
  };
}
