import type {
  CompanionCommandCenter,
  HealthDimension,
  HubAction,
  HubAlert,
  HubRecommendation,
  PackIntel,
} from "./types";

function parseRecommendation(row: Record<string, unknown>): HubRecommendation {
  return {
    id: String(row.id ?? ""),
    recommendation_type: String(row.recommendation_type ?? ""),
    priority: String(row.priority ?? "moderate"),
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    impact_note: row.impact_note ? String(row.impact_note) : undefined,
    effort_hint: row.effort_hint ? String(row.effort_hint) : undefined,
    value_hint: row.value_hint ? String(row.value_hint) : undefined,
    record_href: row.record_href ? String(row.record_href) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    status: row.status ? String(row.status) : undefined,
  };
}

function parseAlert(row: Record<string, unknown>): HubAlert {
  return {
    id: String(row.id ?? ""),
    alert_type: String(row.alert_type ?? ""),
    severity: String(row.severity ?? "information"),
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    impact_note: row.impact_note ? String(row.impact_note) : undefined,
    recommendation: row.recommendation ? String(row.recommendation) : undefined,
    record_href: row.record_href ? String(row.record_href) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

function parseAction(row: Record<string, unknown>): HubAction {
  return {
    id: String(row.id ?? ""),
    action_type: String(row.action_type ?? ""),
    priority: String(row.priority ?? "moderate"),
    status: String(row.status ?? "pending"),
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    due_at: row.due_at ? String(row.due_at) : undefined,
    record_href: row.record_href ? String(row.record_href) : undefined,
  };
}

function parseRecommendations(value: unknown): HubRecommendation[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((r) => parseRecommendation(r as Record<string, unknown>));
}

function parseActions(value: unknown): HubAction[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((r) => parseAction(r as Record<string, unknown>));
}

function parseAlerts(value: unknown): HubAlert[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((r) => parseAlert(r as Record<string, unknown>));
}

function parsePackIntel(value: unknown): PackIntel[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? r.title ?? ""),
      business_pack_key: String(r.business_pack_key ?? ""),
      intel_type: String(r.intel_type ?? ""),
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : undefined,
      record_href: r.record_href ? String(r.record_href) : undefined,
    };
  });
}

export function parseCompanionCommandCenter(row: Record<string, unknown>): CompanionCommandCenter {
  const health = row.organization_health as Record<string, unknown> | undefined;
  const personal = row.personal_workspace as Record<string, unknown> | undefined;

  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    view_mode: row.view_mode ? String(row.view_mode) : undefined,
    user_name: row.user_name ? String(row.user_name) : undefined,
    executive_briefing: row.executive_briefing as Record<string, unknown> | undefined,
    organization_health: health
      ? {
          overall_score: typeof health.overall_score === "number" ? health.overall_score : Number(health.overall_score ?? 0),
          overall_status: health.overall_status ? String(health.overall_status) : undefined,
          dimensions: Array.isArray(health.dimensions)
            ? health.dimensions.map((d) => {
                const item = d as Record<string, unknown>;
                return {
                  key: String(item.key ?? ""),
                  label: String(item.label ?? ""),
                  score: Number(item.score ?? 0),
                  status: String(item.status ?? ""),
                } satisfies HealthDimension;
              })
            : undefined,
          status_levels: Array.isArray(health.status_levels)
            ? health.status_levels.map((s) => {
                const item = s as Record<string, unknown>;
                return {
                  key: String(item.key ?? ""),
                  label: String(item.label ?? ""),
                  icon: item.icon ? String(item.icon) : undefined,
                };
              })
            : undefined,
        }
      : undefined,
    since_last_login: row.since_last_login as Record<string, unknown> | undefined,
    recommended_actions: parseRecommendations(row.recommended_actions),
    pending_approvals: parseActions(row.pending_approvals),
    upcoming_deadlines: parseActions(row.upcoming_deadlines),
    critical_alerts: parseAlerts(row.critical_alerts),
    companion_recommendations: parseRecommendations(row.companion_recommendations),
    business_pack_intelligence: parsePackIntel(row.business_pack_intelligence),
    personal_workspace: personal
      ? {
          my_tasks: parseActions(personal.my_tasks) ?? [],
          my_meetings: parseActions(personal.my_meetings) ?? [],
          my_approvals: parseActions(personal.my_approvals) ?? [],
          my_priorities: parseActions(personal.my_priorities) ?? [],
        }
      : undefined,
    action_center: parseActions(row.action_center),
    decision_support: row.decision_support
      ? {
          ...(row.decision_support as Record<string, unknown>),
          opportunities: parseRecommendations((row.decision_support as Record<string, unknown>).opportunities),
          risks: parseRecommendations((row.decision_support as Record<string, unknown>).risks),
          recommendations: parseRecommendations((row.decision_support as Record<string, unknown>).recommendations),
        }
      : undefined,
    meeting_intelligence: row.meeting_intelligence
      ? {
          ...(row.meeting_intelligence as Record<string, unknown>),
          upcoming_meetings: parseActions((row.meeting_intelligence as Record<string, unknown>).upcoming_meetings),
        }
      : undefined,
    notifications_hub: row.notifications_hub as Record<string, unknown> | undefined,
    companion_memory: Array.isArray(row.companion_memory)
      ? row.companion_memory.map((m) => {
          const item = m as Record<string, unknown>;
          return {
            memory_key: String(item.memory_key ?? ""),
            memory_type: String(item.memory_type ?? ""),
            use_count: item.use_count ? Number(item.use_count) : undefined,
          };
        })
      : undefined,
    companion_conversation: row.companion_conversation as Record<string, unknown> | undefined,
    search_integration: row.search_integration as Record<string, unknown> | undefined,
    view_modes: row.view_modes as Record<string, unknown> | undefined,
    team_activity: row.team_activity as Record<string, number> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
