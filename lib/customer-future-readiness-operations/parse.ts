import type { FutureReadinessCenter, StrategicInitiative } from "./types";

function parseInitiative(raw: Record<string, unknown>): StrategicInitiative {
  return {
    initiative_key: String(raw.initiative_key ?? ""),
    initiative_name: String(raw.initiative_name ?? ""),
    owner_name: raw.owner_name ? String(raw.owner_name) : undefined,
    initiative_status: raw.initiative_status ? String(raw.initiative_status) : undefined,
    priority: raw.priority ? String(raw.priority) : undefined,
    budget_estimate: raw.budget_estimate != null ? Number(raw.budget_estimate) : undefined,
    expected_outcome: raw.expected_outcome ? String(raw.expected_outcome) : undefined,
    dependencies: Array.isArray(raw.dependencies) ? raw.dependencies : undefined,
    strategic_horizon: raw.strategic_horizon ? String(raw.strategic_horizon) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseFutureReadinessCenter(raw: Record<string, unknown>): FutureReadinessCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const planning = Array.isArray(raw.planning)
    ? (raw.planning as Record<string, unknown>[])
    : Array.isArray(raw.strategic_planning)
      ? (raw.strategic_planning as Record<string, unknown>[])
      : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as FutureReadinessCenter["organization"],
    overview: raw.overview as FutureReadinessCenter["overview"],
    planning,
    strategic_planning: planning,
    initiatives: Array.isArray(raw.initiatives)
      ? (raw.initiatives as Record<string, unknown>[]).map(parseInitiative)
      : [],
    scenarios: Array.isArray(raw.scenarios) ? (raw.scenarios as Record<string, unknown>[]) : [],
    roadmaps: Array.isArray(raw.roadmaps) ? (raw.roadmaps as Record<string, unknown>[]) : [],
    opportunities: Array.isArray(raw.opportunities) ? (raw.opportunities as Record<string, unknown>[]) : [],
    threats: Array.isArray(raw.threats) ? (raw.threats as Record<string, unknown>[]) : [],
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    readiness_scores: Array.isArray(raw.readiness_scores)
      ? (raw.readiness_scores as Record<string, unknown>[])
      : [],
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as FutureReadinessCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
