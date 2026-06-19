import type { ExecutionOutcomeCenter } from "./types";

export function parseExecutionOutcomeCenter(raw: Record<string, unknown>): ExecutionOutcomeCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as ExecutionOutcomeCenter["organization"],
    overview: raw.overview as ExecutionOutcomeCenter["overview"],
    initiatives: Array.isArray(raw.initiatives) ? (raw.initiatives as Record<string, unknown>[]) : [],
    actions: Array.isArray(raw.actions) ? (raw.actions as Record<string, unknown>[]) : [],
    accountability: Array.isArray(raw.accountability)
      ? (raw.accountability as Record<string, unknown>[])
      : Array.isArray(raw.owners)
        ? (raw.owners as Record<string, unknown>[])
        : [],
    dependencies: Array.isArray(raw.dependencies) ? (raw.dependencies as Record<string, unknown>[]) : [],
    blockers: Array.isArray(raw.blockers) ? (raw.blockers as Record<string, unknown>[]) : [],
    outcomes: Array.isArray(raw.outcomes) ? (raw.outcomes as Record<string, unknown>[]) : [],
    meetings: Array.isArray(raw.meetings)
      ? (raw.meetings as Record<string, unknown>[])
      : Array.isArray(raw.meeting_to_execution)
        ? (raw.meeting_to_execution as Record<string, unknown>[])
        : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    execution_scorecard: raw.execution_scorecard as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    companion: raw.companion as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as ExecutionOutcomeCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
