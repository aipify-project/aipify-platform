import type { ContinuityCard, ContinuityDashboard, IncidentDetail, IncidentModeResult } from "./types";

export function parseContinuityCard(data: unknown): ContinuityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    overall_score: d.overall_score as number | undefined,
    readiness_band: d.readiness_band as string | undefined,
    incident_mode_active: d.incident_mode_active as boolean | undefined,
    open_incidents: d.open_incidents as number | undefined,
    philosophy: d.philosophy as string | undefined,
    human_leadership_required: d.human_leadership_required as boolean | undefined,
  };
}

export function parseContinuityDashboard(data: unknown): ContinuityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_leadership_required: d.human_leadership_required as boolean | undefined,
    overall_score: d.overall_score as number | undefined,
    readiness_band: d.readiness_band as string | undefined,
    readiness_components: d.readiness_components as ContinuityDashboard["readiness_components"],
    incident_mode: d.incident_mode as ContinuityDashboard["incident_mode"],
    plans: Array.isArray(d.plans) ? (d.plans as ContinuityDashboard["plans"]) : [],
    critical_processes: Array.isArray(d.critical_processes) ? (d.critical_processes as ContinuityDashboard["critical_processes"]) : [],
    incidents: Array.isArray(d.incidents) ? (d.incidents as ContinuityDashboard["incidents"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as ContinuityDashboard["briefings"]) : [],
    incident_levels: d.incident_levels as ContinuityDashboard["incident_levels"],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseIncidentDetail(data: unknown): IncidentDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (d.error || !d.incident) return null;
  return {
    incident: d.incident as IncidentDetail["incident"],
    recovery_actions: Array.isArray(d.recovery_actions) ? (d.recovery_actions as IncidentDetail["recovery_actions"]) : [],
    human_leadership_required: d.human_leadership_required as boolean | undefined,
  };
}

export function parseIncidentModeResult(data: unknown): IncidentModeResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    incident_id: d.incident_id as string | undefined,
    incident_mode_active: d.incident_mode_active as boolean | undefined,
    incident_level: d.incident_level as number | undefined,
    level_label: d.level_label as string | undefined,
    human_leadership_required: d.human_leadership_required as boolean | undefined,
    note: d.note as string | undefined,
  };
}
