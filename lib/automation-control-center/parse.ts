import type {
  AutomationActivityItem,
  AutomationControlCenter,
  AutomationControlDetail,
  AutomationControlEntry,
  AutomationRecommendation,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseEntry(raw: unknown): AutomationControlEntry {
  const row = asRecord(raw);
  return {
    entry_key: String(row.entry_key ?? ""),
    automation_id: row.automation_id ? String(row.automation_id) : null,
    name: String(row.name ?? ""),
    classification: String(row.classification ?? ""),
    purpose: String(row.purpose ?? ""),
    aipify_explanation: String(row.aipify_explanation ?? ""),
    business_value_message: row.business_value_message ? String(row.business_value_message) : null,
    owner_name: row.owner_name ? String(row.owner_name) : null,
    department_owner: row.department_owner ? String(row.department_owner) : null,
    escalation_contact: row.escalation_contact ? String(row.escalation_contact) : null,
    approval_status: String(row.approval_status ?? ""),
    review_state: String(row.review_state ?? ""),
    review_frequency_days: Number(row.review_frequency_days ?? 90),
    last_reviewed_at: row.last_reviewed_at ? String(row.last_reviewed_at) : null,
    status: String(row.status ?? ""),
    success_rate: Number(row.success_rate ?? 0),
    execution_count: Number(row.execution_count ?? 0),
    avg_runtime_ms: Number(row.avg_runtime_ms ?? 0),
    failure_count: Number(row.failure_count ?? 0),
    health_score: Number(row.health_score ?? 0),
    health_band: String(row.health_band ?? "good"),
    time_saved_hours_month: Number(row.time_saved_hours_month ?? 0),
    last_executed_at: row.last_executed_at ? String(row.last_executed_at) : null,
    next_execution_at: row.next_execution_at ? String(row.next_execution_at) : null,
    created_at: row.created_at ? String(row.created_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : null,
  };
}

function parseActivity(raw: unknown): AutomationActivityItem {
  const row = asRecord(raw);
  return {
    activity_key: String(row.activity_key ?? ""),
    entry_key: row.entry_key ? String(row.entry_key) : null,
    message: String(row.message ?? ""),
    activity_level: String(row.activity_level ?? "informational"),
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

function parseRecommendation(raw: unknown): AutomationRecommendation {
  const row = asRecord(raw);
  return {
    recommendation_key: String(row.recommendation_key ?? ""),
    message: String(row.message ?? ""),
    priority: String(row.priority ?? "medium"),
    status: String(row.status ?? "open"),
    related_entry_key: row.related_entry_key ? String(row.related_entry_key) : null,
    created_at: row.created_at ? String(row.created_at) : null,
  };
}

export function parseAutomationControlCenter(raw: unknown): AutomationControlCenter {
  const row = asRecord(raw);
  const overviewRaw = asRecord(row.executive_overview);

  return {
    executive_overview:
      Object.keys(overviewRaw).length > 0
        ? {
            active_automations: Number(overviewRaw.active_automations ?? 0),
            needs_attention: Number(overviewRaw.needs_attention ?? 0),
            time_saved_hours_month: Number(overviewRaw.time_saved_hours_month ?? 0),
            self_healing_hours_saved: Number(overviewRaw.self_healing_hours_saved ?? 0),
            review_overdue_count: Number(overviewRaw.review_overdue_count ?? 0),
            avg_health_score: Number(overviewRaw.avg_health_score ?? 0),
          }
        : null,
    aipify_insight: row.aipify_insight
      ? {
          state: String(asRecord(row.aipify_insight).state ?? ""),
          message: String(asRecord(row.aipify_insight).message ?? ""),
        }
      : null,
    automations: Array.isArray(row.automations) ? row.automations.map(parseEntry) : [],
    self_healing: Array.isArray(row.self_healing) ? row.self_healing.map(parseEntry) : [],
    activity_feed: Array.isArray(row.activity_feed) ? row.activity_feed.map(parseActivity) : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map(parseRecommendation)
      : [],
    analytics: row.analytics ? asRecord(row.analytics) : null,
    links: row.links
      ? Object.fromEntries(
          Object.entries(asRecord(row.links)).map(([key, value]) => [key, String(value)]),
        )
      : null,
    can_manage: Boolean(row.can_manage),
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}

export function parseAutomationControlDetail(raw: unknown): AutomationControlDetail {
  const row = asRecord(raw);
  return {
    entry: parseEntry(row.entry),
    overview: asRecord(row.overview),
    performance: asRecord(row.performance),
    business_value: asRecord(row.business_value),
    aipify_explanation: String(row.aipify_explanation ?? ""),
    ownership: asRecord(row.ownership),
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((item) => {
          const t = asRecord(item);
          return { label: String(t.label ?? ""), at: t.at ? String(t.at) : null };
        })
      : [],
    recent_activity: Array.isArray(row.recent_activity)
      ? row.recent_activity.map(parseActivity)
      : [],
  };
}

export function groupAutomationsByClassification(
  automations: AutomationControlEntry[],
): Record<string, AutomationControlEntry[]> {
  return automations.reduce<Record<string, AutomationControlEntry[]>>((acc, entry) => {
    const key = entry.classification || "operations";
    acc[key] = acc[key] ?? [];
    acc[key].push(entry);
    return acc;
  }, {});
}
