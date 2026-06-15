import type {
  AtRiskCase,
  CustomerLifecycleCenter,
  CustomerLifecycleFilters,
  ExpansionOpportunity,
  LifecycleAuditEntry,
  LifecycleCustomerRow,
  LifecycleOverview,
  LifecycleStageMeta,
  TimelineEvent,
} from "./types";
import type { HealthStatus, LifecycleStage, PlanType } from "./constants";
import { HEALTH_STATUSES, LIFECYCLE_STAGES, PLAN_TYPES } from "./constants";

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

function parseOverview(raw: unknown): LifecycleOverview {
  const row = asRecord(raw) ?? {};
  return {
    new_customers_30d: asNumber(row.new_customers_30d),
    trial_customers: asNumber(row.trial_customers),
    active_customers: asNumber(row.active_customers),
    at_risk_customers: asNumber(row.at_risk_customers),
    churned_customers: asNumber(row.churned_customers),
    reactivated_customers: asNumber(row.reactivated_customers),
  };
}

function parseCustomer(raw: unknown): LifecycleCustomerRow | null {
  const row = asRecord(raw);
  if (!row || !row.customer_id) return null;
  const stage = asString(row.lifecycle_stage, "registered");
  const health = asString(row.health_status, "healthy");
  return {
    customer_id: asString(row.customer_id),
    company: asString(row.company),
    lifecycle_stage: (LIFECYCLE_STAGES.includes(stage as LifecycleStage)
      ? stage
      : "registered") as LifecycleStage,
    current_plan: asString(row.current_plan),
    plan_type: asString(row.plan_type),
    users: asNumber(row.users),
    country: asString(row.country, "NO"),
    days_as_customer: asNumber(row.days_as_customer),
    health_score: asNumber(row.health_score, 70),
    health_status: (HEALTH_STATUSES.includes(health as HealthStatus)
      ? health
      : "healthy") as HealthStatus,
    last_activity: row.last_activity ? asString(row.last_activity) : null,
  };
}

function parseAtRisk(raw: unknown): AtRiskCase | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    risk_reason: asString(row.risk_reason),
    health_score: asNumber(row.health_score),
    recommended_action: asString(row.recommended_action),
  };
}

function parseExpansion(raw: unknown): ExpansionOpportunity | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    current_plan: asString(row.current_plan),
    opportunity: asString(row.opportunity),
    estimated_revenue_impact: asNumber(row.estimated_revenue_impact),
    currency: asString(row.currency, "NOK"),
  };
}

function parseTimeline(raw: unknown): TimelineEvent | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    customer_id: row.customer_id ? asString(row.customer_id) : null,
    customer: asString(row.customer),
    event_type: asString(row.event_type),
    title: asString(row.title),
    summary: asString(row.summary),
    event_at: asString(row.event_at),
  };
}

function parseAudit(raw: unknown): LifecycleAuditEntry | null {
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

function parseStageMeta(raw: unknown): LifecycleStageMeta | null {
  const row = asRecord(raw);
  if (!row) return null;
  return { key: asString(row.key), label: asString(row.label) };
}

function parseFilters(raw: unknown): CustomerLifecycleFilters {
  const row = asRecord(raw) ?? {};
  const stage = asString(row.lifecycle_stage);
  const health = asString(row.health_status);
  const plan = asString(row.plan);
  return {
    lifecycle_stage: LIFECYCLE_STAGES.includes(stage as LifecycleStage)
      ? (stage as LifecycleStage)
      : undefined,
    country: row.country ? asString(row.country) : undefined,
    health_status: HEALTH_STATUSES.includes(health as HealthStatus)
      ? (health as HealthStatus)
      : undefined,
    plan: PLAN_TYPES.includes(plan as PlanType) ? (plan as PlanType) : undefined,
    registration_from: row.registration_from ? asString(row.registration_from) : undefined,
    registration_to: row.registration_to ? asString(row.registration_to) : undefined,
  };
}

export function parseCustomerLifecycleCenter(raw: unknown): CustomerLifecycleCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  return {
    principle: asString(row.principle),
    has_events: Boolean(row.has_events),
    filters: parseFilters(row.filters),
    lifecycle_stages: Array.isArray(row.lifecycle_stages)
      ? row.lifecycle_stages.map(parseStageMeta).filter(Boolean) as LifecycleStageMeta[]
      : [],
    overview: parseOverview(row.overview),
    customers: Array.isArray(row.customers)
      ? row.customers.map(parseCustomer).filter(Boolean) as LifecycleCustomerRow[]
      : [],
    at_risk: Array.isArray(row.at_risk)
      ? row.at_risk.map(parseAtRisk).filter(Boolean) as AtRiskCase[]
      : [],
    expansion_opportunities: Array.isArray(row.expansion_opportunities)
      ? row.expansion_opportunities.map(parseExpansion).filter(Boolean) as ExpansionOpportunity[]
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map(parseTimeline).filter(Boolean) as TimelineEvent[]
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter(Boolean) as LifecycleAuditEntry[]
      : [],
  };
}

export function buildLifecycleFilterQuery(filters: CustomerLifecycleFilters): string {
  const params = new URLSearchParams();
  if (filters.lifecycle_stage) params.set("lifecycle_stage", filters.lifecycle_stage);
  if (filters.country) params.set("country", filters.country);
  if (filters.health_status) params.set("health_status", filters.health_status);
  if (filters.plan) params.set("plan", filters.plan);
  if (filters.registration_from) params.set("registration_from", filters.registration_from);
  if (filters.registration_to) params.set("registration_to", filters.registration_to);
  const query = params.toString();
  return query ? `?${query}` : "";
}
