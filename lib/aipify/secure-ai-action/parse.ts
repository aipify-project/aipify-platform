import type { SecureAiActionCard, SecureAiActionDashboard } from "./types";

export function parseSecureAiActionCard(data: unknown): SecureAiActionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    pending_approvals: Number(d.pending_approvals ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseSecureAiActionDashboard(data: unknown): SecureAiActionDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    pending_approvals: Number(d.pending_approvals ?? 0),
    failed_executions: Number(d.failed_executions ?? 0),
    executed_count: Number(d.executed_count ?? 0),
    approval_statistics:
      typeof d.approval_statistics === "object" && d.approval_statistics
        ? (d.approval_statistics as SecureAiActionDashboard["approval_statistics"])
        : undefined,
    risk_distribution: Array.isArray(d.risk_distribution)
      ? (d.risk_distribution as SecureAiActionDashboard["risk_distribution"])
      : [],
    action_catalog: Array.isArray(d.action_catalog)
      ? (d.action_catalog as SecureAiActionDashboard["action_catalog"])
      : [],
    recent_requests: Array.isArray(d.recent_requests)
      ? (d.recent_requests as SecureAiActionDashboard["recent_requests"])
      : [],
    categories: Array.isArray(d.categories) ? (d.categories as string[]) : undefined,
  };
}
