import type {
  CalendarEvent,
  ExecutiveAction,
  ExecutiveAlert,
  ExecutiveAuditEntry,
  ExecutiveOperationsCenter,
  ExecutiveOperationsFilters,
  ExecutiveOverview,
  GrowthOverview,
  OrganizationalHealth,
  SystemOverview,
} from "./types";
import type {
  ActionCategory,
  ActionPriority,
  AlertType,
  CalendarEventType,
  ExecutivePeriod,
  HealthStatus,
} from "./constants";
import {
  ACTION_CATEGORIES,
  ACTION_PRIORITIES,
  ALERT_TYPES,
  CALENDAR_EVENT_TYPES,
  EXECUTIVE_PERIODS,
  HEALTH_STATUSES,
} from "./constants";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseOverview(raw: unknown): ExecutiveOverview {
  const row = asRecord(raw) ?? {};
  return {
    active_customers: asNumber(row.active_customers),
    monthly_recurring_revenue: asNumber(row.monthly_recurring_revenue),
    customer_growth: asNumber(row.customer_growth),
    system_health: asNumber(row.system_health, 98),
    open_critical_issues: asNumber(row.open_critical_issues),
    executive_actions_required: asNumber(row.executive_actions_required),
  };
}

function parseAction(raw: unknown): ExecutiveAction | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const category = asString(row.category, "enterprise_contract");
  const priority = asString(row.priority, "medium");
  return {
    id: asString(row.id),
    action: asString(row.action),
    category: (ACTION_CATEGORIES.includes(category as ActionCategory)
      ? category
      : "enterprise_contract") as ActionCategory,
    priority: (ACTION_PRIORITIES.includes(priority as ActionPriority)
      ? priority
      : "medium") as ActionPriority,
    due_date: row.due_date ? asString(row.due_date) : null,
    owner: asString(row.owner),
    status: asString(row.status, "pending"),
    customer_id: row.customer_id ? asString(row.customer_id) : null,
  };
}

function parseHealthStatus(value: unknown): HealthStatus {
  const status = asString(value, "healthy");
  return (HEALTH_STATUSES.includes(status as HealthStatus)
    ? status
    : "healthy") as HealthStatus;
}

function parseOrganizationalHealth(raw: unknown): OrganizationalHealth {
  const row = asRecord(raw) ?? {};
  return {
    customer_health_score: asNumber(row.customer_health_score, 82),
    customer_health_status: parseHealthStatus(row.customer_health_status),
    revenue_health_score: asNumber(row.revenue_health_score, 88),
    revenue_health_status: parseHealthStatus(row.revenue_health_status),
    platform_stability_score: asNumber(row.platform_stability_score, 96),
    platform_stability_status: parseHealthStatus(row.platform_stability_status),
    support_performance_score: asNumber(row.support_performance_score, 85),
    support_performance_status: parseHealthStatus(row.support_performance_status),
  };
}

function parseGrowth(raw: unknown): GrowthOverview {
  const row = asRecord(raw) ?? {};
  return {
    new_customers_30d: asNumber(row.new_customers_30d),
    upgrades_30d: asNumber(row.upgrades_30d),
    expansion_revenue: asNumber(row.expansion_revenue),
    churn_rate: asNumber(row.churn_rate),
    trial_conversion_rate: asNumber(row.trial_conversion_rate),
  };
}

function parseSystem(raw: unknown): SystemOverview {
  const row = asRecord(raw) ?? {};
  return {
    infrastructure_status: asString(row.infrastructure_status, "operational"),
    payment_provider_status: asString(row.payment_provider_status, "operational"),
    integration_health: asString(row.integration_health, "healthy"),
    ai_engine_status: asString(row.ai_engine_status, "operational"),
    notification_status: asString(row.notification_status, "operational"),
    platform_uptime: asNumber(row.platform_uptime, 99.2),
  };
}

function parseAlert(raw: unknown): ExecutiveAlert | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const alertType = asString(row.alert_type, "revenue_decline");
  const severity = asString(row.severity, "medium");
  return {
    id: asString(row.id),
    alert_type: (ALERT_TYPES.includes(alertType as AlertType)
      ? alertType
      : "revenue_decline") as AlertType,
    title: asString(row.title),
    summary: asString(row.summary),
    severity: (ACTION_PRIORITIES.includes(severity as ActionPriority)
      ? severity
      : "medium") as ActionPriority,
    created_at: asString(row.created_at),
  };
}

function parseCalendarEvent(raw: unknown): CalendarEvent | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const eventType = asString(row.event_type, "strategic_meeting");
  return {
    id: asString(row.id),
    event_type: (CALENDAR_EVENT_TYPES.includes(eventType as CalendarEventType)
      ? eventType
      : "strategic_meeting") as CalendarEventType,
    title: asString(row.title),
    scheduled_at: asString(row.scheduled_at),
    owner: asString(row.owner),
    customer_id: row.customer_id ? asString(row.customer_id) : null,
  };
}

function parseAudit(raw: unknown): ExecutiveAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

export function parseExecutiveOperationsCenter(raw: unknown): ExecutiveOperationsCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const period = asString(row.period, "30d");
  const filtersRaw = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "Executives should understand the state of the organization within 60 seconds of logging in."
    ),
    no_actions_required: Boolean(row.no_actions_required),
    period: (EXECUTIVE_PERIODS.includes(period as ExecutivePeriod)
      ? period
      : "30d") as ExecutivePeriod,
    since_last_login: row.since_last_login ? asString(row.since_last_login) : null,
    filters: {
      period: (EXECUTIVE_PERIODS.includes(asString(filtersRaw.period, period) as ExecutivePeriod)
        ? asString(filtersRaw.period, period)
        : period) as ExecutivePeriod,
    },
    overview: parseOverview(row.overview),
    executive_summary: Array.isArray(row.executive_summary)
      ? row.executive_summary.map((item) => asString(item)).filter(Boolean)
      : [],
    actions: Array.isArray(row.actions)
      ? row.actions.map(parseAction).filter((item): item is ExecutiveAction => item !== null)
      : [],
    organizational_health: parseOrganizationalHealth(row.organizational_health),
    growth: parseGrowth(row.growth),
    system: parseSystem(row.system),
    alerts: Array.isArray(row.alerts)
      ? row.alerts.map(parseAlert).filter((item): item is ExecutiveAlert => item !== null)
      : [],
    calendar: Array.isArray(row.calendar)
      ? row.calendar
          .map(parseCalendarEvent)
          .filter((item): item is CalendarEvent => item !== null)
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((item): item is ExecutiveAuditEntry => item !== null)
      : [],
  };
}

export function buildExecutiveOperationsFilterQuery(
  filters: ExecutiveOperationsFilters
): string {
  const params = new URLSearchParams();
  if (filters.period) params.set("period", filters.period);
  const query = params.toString();
  return query ? `?${query}` : "";
}
