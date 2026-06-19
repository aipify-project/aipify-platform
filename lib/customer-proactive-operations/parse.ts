import type { ProactiveCenter, ProactiveObservation, ProactiveRecommendation } from "./types";

function parseObservation(raw: Record<string, unknown>): ProactiveObservation {
  return {
    observation_key: String(raw.observation_key ?? ""),
    observation_title: String(raw.observation_title ?? ""),
    observation_category: raw.observation_category ? String(raw.observation_category) : undefined,
    observation_status: raw.observation_status ? String(raw.observation_status) : undefined,
    source_area: raw.source_area ? String(raw.source_area) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

function parseRecommendation(raw: Record<string, unknown>): ProactiveRecommendation {
  return {
    recommendation_key: String(raw.recommendation_key ?? ""),
    recommendation_title: String(raw.recommendation_title ?? ""),
    recommendation_type: raw.recommendation_type ? String(raw.recommendation_type) : undefined,
    recommendation_status: raw.recommendation_status ? String(raw.recommendation_status) : undefined,
    priority: raw.priority ? String(raw.priority) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseProactiveCenter(raw: Record<string, unknown>): ProactiveCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as ProactiveCenter["organization"],
    overview: raw.overview as ProactiveCenter["overview"],
    observations: Array.isArray(raw.observations)
      ? (raw.observations as Record<string, unknown>[]).map(parseObservation)
      : [],
    opportunities: Array.isArray(raw.opportunities) ? (raw.opportunities as Record<string, unknown>[]) : [],
    prepared_actions: Array.isArray(raw.prepared_actions)
      ? (raw.prepared_actions as Record<string, unknown>[])
      : [],
    recommendations: Array.isArray(raw.recommendations)
      ? (raw.recommendations as Record<string, unknown>[]).map(parseRecommendation)
      : [],
    watchlists: Array.isArray(raw.watchlists) ? (raw.watchlists as Record<string, unknown>[]) : [],
    insights: raw.insights as Record<string, unknown>,
    observation_feed: raw.observation_feed as Record<string, unknown>,
    approvals: Array.isArray(raw.approvals)
      ? (raw.approvals as Record<string, unknown>[]).map(parseRecommendation)
      : [],
    operational_health: Array.isArray(raw.operational_health)
      ? (raw.operational_health as Record<string, unknown>[])
      : [],
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as ProactiveCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
