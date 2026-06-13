import type { ApprovalHumanOversightCenter, ApprovalHistoryEntry, ApprovalRequest } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseRequest(raw: unknown): ApprovalRequest {
  const row = asRecord(raw);
  return {
    request_key: String(row.request_key ?? ""),
    action_title: String(row.action_title ?? ""),
    category: String(row.category ?? ""),
    approval_level: Number(row.approval_level ?? 2),
    risk_level: String(row.risk_level ?? "moderate"),
    aipify_recommendation_reason: String(row.aipify_recommendation_reason ?? ""),
    business_impact: row.business_impact ? String(row.business_impact) : null,
    financial_impact: asRecord(row.financial_impact),
    if_approved: row.if_approved ? String(row.if_approved) : null,
    if_rejected: row.if_rejected ? String(row.if_rejected) : null,
    risks_summary: row.risks_summary ? String(row.risks_summary) : null,
    status: String(row.status ?? "pending"),
    priority: String(row.priority ?? "medium"),
    delegated_to: row.delegated_to ? String(row.delegated_to) : null,
    snoozed_until: row.snoozed_until ? String(row.snoozed_until) : null,
    deadline_at: row.deadline_at ? String(row.deadline_at) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseHistory(raw: unknown): ApprovalHistoryEntry {
  const row = asRecord(raw);
  return {
    history_key: String(row.history_key ?? ""),
    action_title: String(row.action_title ?? ""),
    decision: String(row.decision ?? ""),
    approver_label: String(row.approver_label ?? ""),
    reason: row.reason ? String(row.reason) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

export function parseApprovalHumanOversightCenter(raw: unknown): ApprovalHumanOversightCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            pending_count: Number(dash.pending_count ?? 0),
            high_priority_count: Number(dash.high_priority_count ?? 0),
            delegated_count: Number(dash.delegated_count ?? 0),
            completed_7d: Number(dash.completed_7d ?? 0),
            avg_response_hours: Number(dash.avg_response_hours ?? 0),
            compliance_rate: Number(dash.compliance_rate ?? 0),
          }
        : null,
    pending: Array.isArray(row.pending) ? row.pending.map(parseRequest) : [],
    recent_completed: Array.isArray(row.recent_completed)
      ? row.recent_completed.map(parseHistory)
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((r) => {
          const item = asRecord(r);
          return {
            recommendation_key: String(item.recommendation_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    executive_reporting: row.executive_reporting ? asRecord(row.executive_reporting) : null,
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
