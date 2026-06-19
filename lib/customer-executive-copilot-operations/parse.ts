import type { ExecutiveApproval, ExecutiveCopilotCenter } from "./types";

function parseApproval(raw: Record<string, unknown>): ExecutiveApproval {
  return {
    approval_key: String(raw.approval_key ?? ""),
    approval_title: String(raw.approval_title ?? ""),
    approval_status: raw.approval_status ? String(raw.approval_status) : undefined,
    priority: raw.priority ? String(raw.priority) : undefined,
    financial_impact: raw.financial_impact ? String(raw.financial_impact) : undefined,
    risk_impact: raw.risk_impact ? String(raw.risk_impact) : undefined,
    decision_key: raw.decision_key ? String(raw.decision_key) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseExecutiveCopilotCenter(raw: Record<string, unknown>): ExecutiveCopilotCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  const briefings = Array.isArray(raw.briefings)
    ? (raw.briefings as Record<string, unknown>[])
    : Array.isArray(raw.executive_briefings)
      ? (raw.executive_briefings as Record<string, unknown>[])
      : [];

  const monitoring = Array.isArray(raw.monitoring)
    ? (raw.monitoring as Record<string, unknown>[])
    : Array.isArray(raw.executive_monitoring)
      ? (raw.executive_monitoring as Record<string, unknown>[])
      : [];

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as ExecutiveCopilotCenter["organization"],
    overview: raw.overview as ExecutiveCopilotCenter["overview"],
    briefings,
    executive_briefings: briefings,
    decisions: Array.isArray(raw.decisions) ? (raw.decisions as Record<string, unknown>[]) : [],
    approvals: Array.isArray(raw.approvals)
      ? (raw.approvals as Record<string, unknown>[]).map(parseApproval)
      : [],
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    execution: Array.isArray(raw.execution) ? (raw.execution as Record<string, unknown>[]) : [],
    board_reports: Array.isArray(raw.board_reports) ? (raw.board_reports as Record<string, unknown>[]) : [],
    reports: raw.reports as Record<string, unknown>,
    strategy: raw.strategy as Record<string, unknown>,
    scenarios: Array.isArray(raw.scenarios) ? (raw.scenarios as Record<string, unknown>[]) : [],
    monitoring,
    executive_monitoring: monitoring,
    natural_language_commands: Array.isArray(raw.natural_language_commands)
      ? (raw.natural_language_commands as Record<string, unknown>[])
      : [],
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as ExecutiveCopilotCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
