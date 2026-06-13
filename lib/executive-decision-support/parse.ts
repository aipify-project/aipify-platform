import type {
  AuditEntry,
  DecisionInsight,
  DecisionWorkspace,
  ExecutiveDecisionSupportCenter,
  StakeholderInput,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseDecision(raw: unknown): DecisionWorkspace {
  const row = asRecord(raw);
  return {
    decision_key: String(row.decision_key ?? ""),
    title: String(row.title ?? ""),
    category: String(row.category ?? ""),
    owner_label: String(row.owner_label ?? ""),
    time_sensitivity: String(row.time_sensitivity ?? "medium"),
    stakeholders: String(row.stakeholders ?? ""),
    status: String(row.status ?? "gathering_info"),
    framework_type: String(row.framework_type ?? "weighted_criteria"),
    framework_data: asRecord(row.framework_data),
    objectives: row.objectives ? String(row.objectives) : null,
    assumptions: row.assumptions ? String(row.assumptions) : null,
    alternatives: row.alternatives ? String(row.alternatives) : null,
    risk_indicators: Array.isArray(row.risk_indicators) ? row.risk_indicators : [],
    deadline_at: row.deadline_at ? String(row.deadline_at) : null,
    decided_at: row.decided_at ? String(row.decided_at) : null,
    outcome_summary: row.outcome_summary ? String(row.outcome_summary) : null,
    created_at: row.created_at ? String(row.created_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : null,
  };
}

export function parseExecutiveDecisionSupportCenter(raw: unknown): ExecutiveDecisionSupportCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            active_count: Number(dash.active_count ?? 0),
            pending_evaluations: Number(dash.pending_evaluations ?? 0),
            awaiting_approval: Number(dash.awaiting_approval ?? 0),
            stakeholder_inputs: Number(dash.stakeholder_inputs ?? 0),
            high_sensitivity: Number(dash.high_sensitivity ?? 0),
            decided_count: Number(dash.decided_count ?? 0),
            framework_adoption_rate: Number(dash.framework_adoption_rate ?? 0),
            decision_confidence_avg: Number(dash.decision_confidence_avg ?? 0),
          }
        : null,
    active_decisions: Array.isArray(row.active_decisions)
      ? row.active_decisions.map(parseDecision)
      : [],
    pending_evaluations: Array.isArray(row.pending_evaluations)
      ? row.pending_evaluations.map(parseDecision)
      : [],
    decided_decisions: Array.isArray(row.decided_decisions)
      ? row.decided_decisions.map(parseDecision)
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            decision_key: item.decision_key ? String(item.decision_key) : null,
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          };
        })
      : [],
    stakeholder_input: Array.isArray(row.stakeholder_input)
      ? row.stakeholder_input.map((s) => {
          const item = asRecord(s);
          return {
            input_key: String(item.input_key ?? ""),
            decision_key: String(item.decision_key ?? ""),
            contributor_label: String(item.contributor_label ?? ""),
            input_type: String(item.input_type ?? "comment"),
            content: String(item.content ?? ""),
            rating: item.rating != null ? Number(item.rating) : null,
            created_at: item.created_at ? String(item.created_at) : null,
          };
        })
      : [],
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map((a) => {
          const item = asRecord(a);
          return {
            event_type: String(item.event_type ?? ""),
            summary: item.summary ? String(item.summary) : null,
            created_at: item.created_at ? String(item.created_at) : null,
          };
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
