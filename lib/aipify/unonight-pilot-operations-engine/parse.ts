import type { UnonightPilotEngineCard, UnonightPilotOperationsDashboard } from "./types";

export function parseUnonightPilotEngineCard(data: unknown): UnonightPilotEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    is_pilot: Boolean(d.is_pilot),
    health_status: typeof d.health_status === "string" ? (d.health_status as UnonightPilotEngineCard["health_status"]) : undefined,
    health_score: Number(d.health_score ?? 0),
    milestones_completed: Number(d.milestones_completed ?? 0),
    milestones_total: Number(d.milestones_total ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseUnonightPilotOperationsDashboard(data: unknown): UnonightPilotOperationsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    is_unonight_pilot: Boolean(d.is_unonight_pilot),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    organization:
      typeof d.organization === "object" && d.organization
        ? (d.organization as UnonightPilotOperationsDashboard["organization"])
        : undefined,
    config:
      typeof d.config === "object" && d.config
        ? (d.config as UnonightPilotOperationsDashboard["config"])
        : undefined,
    pilot_health:
      typeof d.pilot_health === "object" && d.pilot_health
        ? (d.pilot_health as UnonightPilotOperationsDashboard["pilot_health"])
        : undefined,
    support_improvements:
      typeof d.support_improvements === "object" && d.support_improvements
        ? (d.support_improvements as Record<string, unknown>)
        : undefined,
    recommendation_outcomes:
      typeof d.recommendation_outcomes === "object" && d.recommendation_outcomes
        ? (d.recommendation_outcomes as Record<string, unknown>)
        : undefined,
    unresolved_issues: Array.isArray(d.unresolved_issues)
      ? (d.unresolved_issues as UnonightPilotOperationsDashboard["unresolved_issues"])
      : [],
    milestones: Array.isArray(d.milestones)
      ? (d.milestones as UnonightPilotOperationsDashboard["milestones"])
      : [],
    recent_metrics: Array.isArray(d.recent_metrics)
      ? (d.recent_metrics as UnonightPilotOperationsDashboard["recent_metrics"])
      : [],
    recent_feedback: Array.isArray(d.recent_feedback)
      ? (d.recent_feedback as UnonightPilotOperationsDashboard["recent_feedback"])
      : [],
    administrator_satisfaction:
      typeof d.administrator_satisfaction === "object" && d.administrator_satisfaction
        ? (d.administrator_satisfaction as UnonightPilotOperationsDashboard["administrator_satisfaction"])
        : undefined,
    unonight_integration:
      typeof d.unonight_integration === "object" && d.unonight_integration
        ? (d.unonight_integration as UnonightPilotOperationsDashboard["unonight_integration"])
        : undefined,
    module_snapshots:
      typeof d.module_snapshots === "object" && d.module_snapshots
        ? (d.module_snapshots as Record<string, unknown>)
        : undefined,
  };
}
