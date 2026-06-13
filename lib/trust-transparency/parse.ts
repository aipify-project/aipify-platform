import type {
  AuditTimelineEntry,
  SelfHealingEvent,
  TransparencyItem,
  TrustTransparencyCenter,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseItem(raw: unknown): TransparencyItem {
  const row = asRecord(raw);
  return {
    item_key: String(row.item_key ?? ""),
    section: String(row.section ?? ""),
    action_title: String(row.action_title ?? ""),
    why_summary: String(row.why_summary ?? ""),
    permissions_used: row.permissions_used ? String(row.permissions_used) : null,
    risk_level: String(row.risk_level ?? "low"),
    user_control_hint: row.user_control_hint ? String(row.user_control_hint) : null,
    info_considered: row.info_considered ? String(row.info_considered) : null,
    alternatives: row.alternatives ? String(row.alternatives) : null,
    if_nothing_done: row.if_nothing_done ? String(row.if_nothing_done) : null,
    companion_label: row.companion_label ? String(row.companion_label) : null,
    approval_required: Boolean(row.approval_required),
    outcome: row.outcome ? String(row.outcome) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseSelfHealing(raw: unknown): SelfHealingEvent {
  const row = asRecord(raw);
  return {
    healing_key: String(row.healing_key ?? ""),
    what_failed: String(row.what_failed ?? ""),
    aipify_attempt: String(row.aipify_attempt ?? ""),
    recovery_succeeded: Boolean(row.recovery_succeeded),
    downtime_prevented_minutes: Number(row.downtime_prevented_minutes ?? 0),
    manual_intervention_required: Boolean(row.manual_intervention_required),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseAudit(raw: unknown): AuditTimelineEntry {
  const row = asRecord(raw);
  return {
    audit_key: String(row.audit_key ?? ""),
    event_type: String(row.event_type ?? ""),
    summary: String(row.summary ?? ""),
    actor_label: row.actor_label ? String(row.actor_label) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

export function parseTrustTransparencyCenter(raw: unknown): TrustTransparencyCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);
  const indicators = asRecord(row.trust_indicators);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            actions_this_month: Number(dash.actions_this_month ?? 0),
            recommendations_generated: Number(dash.recommendations_generated ?? 0),
            actions_approved: Number(dash.actions_approved ?? 0),
            actions_rejected: Number(dash.actions_rejected ?? 0),
            self_healing_interventions: Number(dash.self_healing_interventions ?? 0),
            governance_compliance_rate: Number(dash.governance_compliance_rate ?? 0),
          }
        : null,
    trust_indicators:
      Object.keys(indicators).length > 0
        ? {
            governance_score: Number(indicators.governance_score ?? 0),
            permission_hygiene_score: Number(indicators.permission_hygiene_score ?? 0),
            approval_responsiveness: Number(indicators.approval_responsiveness ?? 0),
            transparency_completeness: Number(indicators.transparency_completeness ?? 0),
            self_healing_effectiveness: Number(indicators.self_healing_effectiveness ?? 0),
          }
        : null,
    activity_overview: Array.isArray(row.activity_overview)
      ? row.activity_overview.map(parseItem)
      : [],
    decision_explanations: Array.isArray(row.decision_explanations)
      ? row.decision_explanations.map(parseItem)
      : [],
    permissions_used: Array.isArray(row.permissions_used)
      ? row.permissions_used.map(parseItem)
      : [],
    approval_history: Array.isArray(row.approval_history)
      ? row.approval_history.map(parseItem)
      : [],
    self_healing: Array.isArray(row.self_healing) ? row.self_healing.map(parseSelfHealing) : [],
    recommendations_generated: Array.isArray(row.recommendations_generated)
      ? row.recommendations_generated.map(parseItem)
      : [],
    audit_timeline: Array.isArray(row.audit_timeline) ? row.audit_timeline.map(parseAudit) : [],
    governance_recommendations: Array.isArray(row.governance_recommendations)
      ? row.governance_recommendations.map((r) => {
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
