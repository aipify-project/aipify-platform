import type {
  CustomerHealthDashboard,
  EarlyWarning,
  HealthAuditEntry,
  HealthCustomerRow,
  HealthFilters,
  HealthOverview,
  HealthRecommendation,
  HealthTask,
  RecoveryWorkflow,
} from "./types";
import type { HealthCategory, HealthTrend, RecommendationType, RecoveryWorkflowType, SupportStatus, WarningSignal } from "./constants";
import {
  HEALTH_CATEGORIES,
  HEALTH_TRENDS,
  RECOMMENDATION_TYPES,
  RECOVERY_WORKFLOW_TYPES,
  SUPPORT_STATUSES,
  WARNING_SIGNALS,
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

function parseOverview(raw: unknown): HealthOverview {
  const row = asRecord(raw) ?? {};
  return {
    healthy: asNumber(row.healthy),
    stable: asNumber(row.stable),
    attention_needed: asNumber(row.attention_needed),
    at_risk: asNumber(row.at_risk),
    recovery_opportunities: asNumber(row.recovery_opportunities),
  };
}

function parseCustomer(raw: unknown): HealthCustomerRow | null {
  const row = asRecord(raw);
  if (!row || !row.customer_id) return null;
  const category = asString(row.health_category, "stable");
  const trend = asString(row.trend, "stable");
  const support = asString(row.support_status, "none");
  return {
    customer_id: asString(row.customer_id),
    company: asString(row.company),
    health_score: asNumber(row.health_score, 70),
    health_category: (HEALTH_CATEGORIES.includes(category as HealthCategory)
      ? category
      : "stable") as HealthCategory,
    trend: (HEALTH_TRENDS.includes(trend as HealthTrend) ? trend : "stable") as HealthTrend,
    last_activity: row.last_activity ? asString(row.last_activity) : null,
    subscription_plan: asString(row.subscription_plan),
    support_status: (SUPPORT_STATUSES.includes(support as SupportStatus)
      ? support
      : "none") as SupportStatus,
    assigned_success_owner: asString(row.assigned_success_owner),
  };
}

function parseWarning(raw: unknown): EarlyWarning | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const signal = asString(row.signal_type, "inactive_30_days");
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    company: asString(row.company),
    signal_type: (WARNING_SIGNALS.includes(signal as WarningSignal)
      ? signal
      : "inactive_30_days") as WarningSignal,
    severity: asString(row.severity),
    message: asString(row.message),
    created_at: asString(row.created_at),
  };
}

function parseRecommendation(raw: unknown): HealthRecommendation | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const type = asString(row.recommendation_type, "onboarding_assistance");
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    company: asString(row.company),
    recommendation_type: (RECOMMENDATION_TYPES.includes(type as RecommendationType)
      ? type
      : "onboarding_assistance") as RecommendationType,
    title: asString(row.title),
    summary: asString(row.summary),
    status: asString(row.status),
  };
}

function parseTask(raw: unknown): HealthTask | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    company: asString(row.company),
    task_type: asString(row.task_type),
    title: asString(row.title),
    status: asString(row.status),
    created_at: asString(row.created_at),
  };
}

function parseRecovery(raw: unknown): RecoveryWorkflow | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const type = asString(row.workflow_type, "success_outreach");
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    company: asString(row.company),
    workflow_type: (RECOVERY_WORKFLOW_TYPES.includes(type as RecoveryWorkflowType)
      ? type
      : "success_outreach") as RecoveryWorkflowType,
    status: asString(row.status),
    owner: asString(row.owner),
    notes: asString(row.notes),
    created_at: asString(row.created_at),
  };
}

function parseAudit(raw: unknown): HealthAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    customer_id: row.customer_id ? asString(row.customer_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

export function parseCustomerHealthDashboard(raw: unknown): CustomerHealthDashboard | null {
  const row = asRecord(raw);
  if (!row) return null;

  const filtersRaw = asRecord(row.filters) ?? {};
  const category = asString(filtersRaw.health_category);
  const trend = asString(filtersRaw.trend);

  return {
    principle: asString(row.principle),
    privacy_note: asString(row.privacy_note),
    is_empty: Boolean(row.is_empty),
    filters: {
      health_category: (HEALTH_CATEGORIES.includes(category as HealthCategory)
        ? category
        : "") as HealthFilters["health_category"],
      trend: (HEALTH_TRENDS.includes(trend as HealthTrend) ? trend : "") as HealthFilters["trend"],
    },
    overview: parseOverview(row.overview),
    customers: (Array.isArray(row.customers) ? row.customers : [])
      .map(parseCustomer)
      .filter(Boolean) as HealthCustomerRow[],
    early_warnings: (Array.isArray(row.early_warnings) ? row.early_warnings : [])
      .map(parseWarning)
      .filter(Boolean) as EarlyWarning[],
    recommendations: (Array.isArray(row.recommendations) ? row.recommendations : [])
      .map(parseRecommendation)
      .filter(Boolean) as HealthRecommendation[],
    tasks: (Array.isArray(row.tasks) ? row.tasks : [])
      .map(parseTask)
      .filter(Boolean) as HealthTask[],
    recovery_workflows: (Array.isArray(row.recovery_workflows) ? row.recovery_workflows : [])
      .map(parseRecovery)
      .filter(Boolean) as RecoveryWorkflow[],
    audit: (Array.isArray(row.audit) ? row.audit : [])
      .map(parseAudit)
      .filter(Boolean) as HealthAuditEntry[],
  };
}

export function buildHealthFilterQuery(filters: HealthFilters): string {
  const params = new URLSearchParams();
  if (filters.health_category) params.set("health_category", filters.health_category);
  if (filters.trend) params.set("trend", filters.trend);
  const query = params.toString();
  return query ? `?${query}` : "";
}
