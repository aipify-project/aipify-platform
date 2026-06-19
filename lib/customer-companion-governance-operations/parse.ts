import type { CompanionGovernanceCenter, GovernanceAction } from "./types";

function parseAction(row: Record<string, unknown>): GovernanceAction {
  return {
    action_key: String(row.action_key ?? ""),
    action_title: String(row.action_title ?? ""),
    action_type: row.action_type ? String(row.action_type) : undefined,
    sensitivity_level: row.sensitivity_level ? String(row.sensitivity_level) : undefined,
    requires_human_approval: row.requires_human_approval === true,
    approval_status: row.approval_status ? String(row.approval_status) : undefined,
    summary: row.summary ? String(row.summary) : undefined,
    recorded_at: row.recorded_at ? String(row.recorded_at) : undefined,
  };
}

export function parseCompanionGovernanceCenter(
  row: Record<string, unknown> | null
): CompanionGovernanceCenter | null {
  if (!row || typeof row !== "object") return null;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    organization: row.organization as { id: string; name: string } | undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : undefined,
    permissions: row.permissions as Record<string, unknown> | undefined,
    actions: Array.isArray(row.actions)
      ? row.actions.map((r) => parseAction(r as Record<string, unknown>))
      : undefined,
    oversight: row.oversight as Record<string, unknown> | undefined,
    approvals: row.approvals as Record<string, unknown> | undefined,
    policies: Array.isArray(row.policies) ? row.policies : undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    trust_score: row.trust_score as Record<string, unknown> | undefined,
    integrations: row.integrations as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            event_type: String(e.event_type ?? ""),
            audit_category: e.audit_category ? String(e.audit_category) : undefined,
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    notifications: row.notifications as Record<string, unknown> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
