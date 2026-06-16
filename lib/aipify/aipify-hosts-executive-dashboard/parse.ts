import type {
  HostsExecutiveAttentionItem,
  HostsExecutiveDashboard,
  HostsExecutiveDashboardActionResult,
  HostsExecutiveFinancialSnapshot,
  HostsExecutiveNotification,
  HostsExecutivePropertyHealth,
  HostsExecutiveQuickAction,
  HostsExecutiveSummary,
  HostsExecutiveTodaysOperations,
  HostsExecutiveUpcomingEvent,
  HostsExecutiveWidgetPreferences,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseSummary(data: unknown): HostsExecutiveSummary {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    active_properties: Number(d.active_properties ?? 0),
    occupancy_rate: Number(d.occupancy_rate ?? 0),
    revenue_this_month: Number(d.revenue_this_month ?? 0),
    open_incidents: Number(d.open_incidents ?? 0),
    guest_satisfaction_score: Number(d.guest_satisfaction_score ?? 0),
    open_approvals: Number(d.open_approvals ?? 0),
  };
}

function parseAttention(data: unknown): HostsExecutiveAttentionItem[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.type) return null;
      return {
        type: String(d.type),
        label: typeof d.label === "string" ? d.label : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        severity: typeof d.severity === "string" ? d.severity : "medium",
        link: typeof d.link === "string" ? d.link : "",
      };
    })
    .filter((r): r is HostsExecutiveAttentionItem => r !== null);
}

function parseTodaysOps(data: unknown): HostsExecutiveTodaysOperations {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    arrivals_today: Number(d.arrivals_today ?? 0),
    departures_today: Number(d.departures_today ?? 0),
    cleaning_tasks_today: Number(d.cleaning_tasks_today ?? 0),
    maintenance_tasks_today: Number(d.maintenance_tasks_today ?? 0),
    pending_guest_requests: Number(d.pending_guest_requests ?? 0),
  };
}

function parsePropertyHealth(data: unknown): HostsExecutivePropertyHealth {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    excellent: Number(d.excellent ?? 0),
    good: Number(d.good ?? 0),
    attention_required: Number(d.attention_required ?? 0),
    critical: Number(d.critical ?? 0),
    properties: asArray<unknown>(d.properties)
      .map((row) => {
        const p = row as Record<string, unknown>;
        if (!p.property_id) return null;
        return {
          property_id: String(p.property_id),
          property: typeof p.property === "string" ? p.property : "—",
          overall_score: Number(p.overall_score ?? 0),
          score_level: typeof p.score_level === "string" ? p.score_level : "",
        };
      })
      .filter((r): r is HostsExecutivePropertyHealth["properties"][number] => r !== null),
  };
}

function parseFinancial(data: unknown): HostsExecutiveFinancialSnapshot {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    revenue_this_month: Number(d.revenue_this_month ?? 0),
    upcoming_payouts: Number(d.upcoming_payouts ?? 0),
    outstanding_expenses: Number(d.outstanding_expenses ?? 0),
    estimated_net_position: Number(d.estimated_net_position ?? 0),
  };
}

function parseEvents(data: unknown): HostsExecutiveUpcomingEvent[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        event_key: typeof d.event_key === "string" ? d.event_key : "",
        event_type: typeof d.event_type === "string" ? d.event_type : "",
        title: typeof d.title === "string" ? d.title : "",
        event_date: typeof d.event_date === "string" ? d.event_date : "",
        property_id: d.property_id != null ? String(d.property_id) : null,
        property: typeof d.property === "string" ? d.property : "—",
        summary: typeof d.summary === "string" ? d.summary : "",
      };
    })
    .filter((r): r is HostsExecutiveUpcomingEvent => r !== null);
}

function parseNotifications(data: unknown): HostsExecutiveNotification[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.type) return null;
      return {
        type: String(d.type),
        title: typeof d.title === "string" ? d.title : "",
        message: typeof d.message === "string" ? d.message : "",
        priority: typeof d.priority === "string" ? d.priority : "informational",
      };
    })
    .filter((r): r is HostsExecutiveNotification => r !== null);
}

function parseQuickActions(data: unknown): HostsExecutiveQuickAction[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.key) return null;
      return {
        key: String(d.key),
        route: typeof d.route === "string" ? d.route : "",
      };
    })
    .filter((r): r is HostsExecutiveQuickAction => r !== null);
}

function parsePreferences(data: unknown): HostsExecutiveWidgetPreferences {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    widget_order: asArray<string>(d.widget_order),
    collapsed: (d.collapsed as Record<string, boolean>) ?? {},
  };
}

export function parseAipifyHostsExecutiveDashboard(data: unknown): HostsExecutiveDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    widget_preferences: parsePreferences(d.widget_preferences),
    default_widgets: asArray<string>(d.default_widgets),
    executive_summary: parseSummary(d.executive_summary),
    requires_attention: parseAttention(d.requires_attention),
    requires_attention_count: Number(d.requires_attention_count ?? 0),
    todays_operations: parseTodaysOps(d.todays_operations),
    property_health: parsePropertyHealth(d.property_health),
    financial_snapshot: parseFinancial(d.financial_snapshot),
    upcoming_events: parseEvents(d.upcoming_events),
    notifications: parseNotifications(d.notifications),
    quick_actions: parseQuickActions(d.quick_actions),
  };
}

export function parseAipifyHostsExecutiveDashboardActionResult(
  data: unknown,
): HostsExecutiveDashboardActionResult {
  if (!data || typeof data !== "object") return { success: false };
  const d = data as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}
