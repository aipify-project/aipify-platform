import type { ResilienceCenter, ResilienceIncident } from "./types";

function parseIncident(raw: Record<string, unknown>): ResilienceIncident {
  return {
    incident_key: String(raw.incident_key ?? ""),
    incident_title: String(raw.incident_title ?? ""),
    incident_type: raw.incident_type ? String(raw.incident_type) : undefined,
    severity: raw.severity ? String(raw.severity) : undefined,
    incident_status: raw.incident_status ? String(raw.incident_status) : undefined,
    owner_name: raw.owner_name ? String(raw.owner_name) : undefined,
    impact_summary: raw.impact_summary ? String(raw.impact_summary) : undefined,
    affected_areas: Array.isArray(raw.affected_areas) ? raw.affected_areas : undefined,
    lessons_learned: raw.lessons_learned ? String(raw.lessons_learned) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseResilienceCenter(raw: Record<string, unknown>): ResilienceCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const continuity = Array.isArray(raw.continuity)
    ? (raw.continuity as Record<string, unknown>[])
    : Array.isArray(raw.business_continuity)
      ? (raw.business_continuity as Record<string, unknown>[])
      : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as ResilienceCenter["organization"],
    overview: raw.overview as ResilienceCenter["overview"],
    incidents: Array.isArray(raw.incidents)
      ? (raw.incidents as Record<string, unknown>[]).map(parseIncident)
      : [],
    continuity,
    business_continuity: continuity,
    recovery: Array.isArray(raw.recovery) ? (raw.recovery as Record<string, unknown>[]) : [],
    crisis_management: raw.crisis_management as Record<string, unknown>,
    dependencies: Array.isArray(raw.dependencies) ? (raw.dependencies as Record<string, unknown>[]) : [],
    preparedness: Array.isArray(raw.preparedness) ? (raw.preparedness as Record<string, unknown>[]) : [],
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    resilience_scores: Array.isArray(raw.resilience_scores)
      ? (raw.resilience_scores as Record<string, unknown>[])
      : [],
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as ResilienceCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
