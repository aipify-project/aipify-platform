import type {
  EnterpriseContract,
  PastDueCase,
  PlanChangeRecord,
  SubscriptionAuditEntry,
  SubscriptionOperationsCenter,
  SubscriptionOperationsFilters,
  SubscriptionOperationsOverview,
  SubscriptionRow,
  TrialRecord,
} from "./types";
import type { PlanType, RenewalPeriod, SubscriptionDisplayStatus } from "./constants";
import { PLAN_TYPES, RENEWAL_PERIODS, SUBSCRIPTION_STATUSES } from "./constants";

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

function parseOverview(raw: unknown): SubscriptionOperationsOverview {
  const row = asRecord(raw) ?? {};
  return {
    active_subscriptions: asNumber(row.active_subscriptions),
    trial_accounts: asNumber(row.trial_accounts),
    upcoming_renewals: asNumber(row.upcoming_renewals),
    upgrades_this_month: asNumber(row.upgrades_this_month),
    downgrades_this_month: asNumber(row.downgrades_this_month),
    cancelled_subscriptions: asNumber(row.cancelled_subscriptions),
  };
}

function parseSubscription(raw: unknown): SubscriptionRow | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const status = asString(row.status, "active");
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    customer_number: asString(row.customer_number),
    plan: asString(row.plan),
    plan_type: asString(row.plan_type),
    users: asNumber(row.users),
    billing_provider: asString(row.billing_provider, "invoice"),
    monthly_value: asNumber(row.monthly_value),
    currency: asString(row.currency, "NOK"),
    renewal_date: row.renewal_date ? asString(row.renewal_date) : null,
    status: (SUBSCRIPTION_STATUSES.includes(status as SubscriptionDisplayStatus)
      ? status
      : "active") as SubscriptionDisplayStatus,
    country: asString(row.country, "NO"),
  };
}

function parseTrial(raw: unknown): TrialRecord | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    subscription_id: asString(row.subscription_id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    trial_start: row.trial_start ? asString(row.trial_start) : null,
    trial_end: row.trial_end ? asString(row.trial_end) : null,
    days_remaining: asNumber(row.days_remaining),
    conversion_probability: asNumber(row.conversion_probability, 50),
  };
}

function parsePlanChange(raw: unknown): PlanChangeRecord | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    previous_plan: asString(row.previous_plan),
    new_plan: asString(row.new_plan),
    effective_date: asString(row.effective_date),
    revenue_impact: row.revenue_impact != null ? asNumber(row.revenue_impact) : undefined,
    reason: row.reason ? asString(row.reason) : undefined,
  };
}

function parsePastDue(raw: unknown): PastDueCase | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    outstanding_amount: asNumber(row.outstanding_amount),
    currency: asString(row.currency, "NOK"),
    days_overdue: asNumber(row.days_overdue),
    payment_provider: asString(row.payment_provider),
    recommended_action: asString(row.recommended_action),
  };
}

function parseContract(raw: unknown): EnterpriseContract | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    contract_start: asString(row.contract_start),
    contract_end: row.contract_end ? asString(row.contract_end) : null,
    payment_terms: asString(row.payment_terms),
    account_manager: asString(row.account_manager),
  };
}

function parseAudit(raw: unknown): SubscriptionAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    customer_id: row.customer_id ? asString(row.customer_id) : null,
    subscription_id: row.subscription_id ? asString(row.subscription_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseFilters(raw: unknown): SubscriptionOperationsFilters {
  const row = asRecord(raw) ?? {};
  const plan = asString(row.plan);
  const status = asString(row.status);
  const renewal = asString(row.renewal_period);
  return {
    plan: PLAN_TYPES.includes(plan as PlanType) ? (plan as PlanType) : undefined,
    status: SUBSCRIPTION_STATUSES.includes(status as SubscriptionDisplayStatus)
      ? (status as SubscriptionDisplayStatus)
      : undefined,
    country: row.country ? asString(row.country) : undefined,
    provider: row.provider ? asString(row.provider) : undefined,
    renewal_period: RENEWAL_PERIODS.includes(renewal as RenewalPeriod)
      ? (renewal as RenewalPeriod)
      : undefined,
  };
}

function parseSubscriptionList(raw: unknown): SubscriptionRow[] {
  return Array.isArray(raw)
    ? raw.map(parseSubscription).filter(Boolean) as SubscriptionRow[]
    : [];
}

export function parseSubscriptionOperationsCenter(raw: unknown): SubscriptionOperationsCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const renewals = asRecord(row.renewals) ?? {};

  return {
    principle: asString(row.principle),
    has_subscriptions: Boolean(row.has_subscriptions),
    filters: parseFilters(row.filters),
    overview: parseOverview(row.overview),
    subscriptions: parseSubscriptionList(row.subscriptions),
    trials: Array.isArray(row.trials)
      ? row.trials.map(parseTrial).filter(Boolean) as TrialRecord[]
      : [],
    upgrades: Array.isArray(row.upgrades)
      ? row.upgrades.map(parsePlanChange).filter(Boolean) as PlanChangeRecord[]
      : [],
    downgrades: Array.isArray(row.downgrades)
      ? row.downgrades.map(parsePlanChange).filter(Boolean) as PlanChangeRecord[]
      : [],
    renewals: {
      within_7_days: parseSubscriptionList(renewals.within_7_days),
      within_30_days: parseSubscriptionList(renewals.within_30_days),
      within_90_days: parseSubscriptionList(renewals.within_90_days),
    },
    past_due: Array.isArray(row.past_due)
      ? row.past_due.map(parsePastDue).filter(Boolean) as PastDueCase[]
      : [],
    enterprise_contracts: Array.isArray(row.enterprise_contracts)
      ? row.enterprise_contracts.map(parseContract).filter(Boolean) as EnterpriseContract[]
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter(Boolean) as SubscriptionAuditEntry[]
      : [],
  };
}

export function buildSubscriptionOperationsFilterQuery(
  filters: SubscriptionOperationsFilters
): string {
  const params = new URLSearchParams();
  if (filters.plan) params.set("plan", filters.plan);
  if (filters.status) params.set("status", filters.status);
  if (filters.country) params.set("country", filters.country);
  if (filters.provider) params.set("provider", filters.provider);
  if (filters.renewal_period) params.set("renewal_period", filters.renewal_period);
  const query = params.toString();
  return query ? `?${query}` : "";
}
