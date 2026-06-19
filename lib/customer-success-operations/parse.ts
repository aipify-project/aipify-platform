import type {
  CheckInRecord,
  CustomerSuccessFilters,
  CustomerSuccessOperationsCenter,
  ExpansionRecommendation,
  OnboardingProgress,
  SuccessAuditEntry,
  SuccessCustomerRow,
  SuccessOverview,
  SuccessPlan,
} from "./types";
import type { PlanStatus, RenewalWindow, SuccessStatus } from "./constants";
import { PLAN_STATUSES, RENEWAL_WINDOWS, SUCCESS_STATUSES } from "./constants";

export type { CustomerSuccessFilters, CustomerSuccessOperationsCenter } from "./types";

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

function parseOverview(raw: unknown): SuccessOverview {
  const row = asRecord(raw) ?? {};
  return {
    requiring_attention: asNumber(row.requiring_attention),
    onboarding_customers: asNumber(row.onboarding_customers),
    success_plans_active: asNumber(row.success_plans_active),
    scheduled_check_ins: asNumber(row.scheduled_check_ins),
    renewals_next_30_days: asNumber(row.renewals_next_30_days),
    expansion_opportunities: asNumber(row.expansion_opportunities),
  };
}

function parseCustomer(raw: unknown): SuccessCustomerRow | null {
  const row = asRecord(raw);
  if (!row || !row.customer_id) return null;
  const status = asString(row.success_status, "stable");
  return {
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    success_status: (SUCCESS_STATUSES.includes(status as SuccessStatus)
      ? status
      : "stable") as SuccessStatus,
    assigned_manager: asString(row.assigned_manager),
    health_score: asNumber(row.health_score, 70),
    last_check_in: row.last_check_in ? asString(row.last_check_in) : null,
    next_action: asString(row.next_action),
    renewal_date: row.renewal_date ? asString(row.renewal_date) : null,
    country: asString(row.country, "NO"),
  };
}

function parseOnboarding(raw: unknown): OnboardingProgress | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    account_created: row.account_created ? asString(row.account_created) : null,
    first_login: row.first_login ? asString(row.first_login) : null,
    first_user_invited: row.first_user_invited ? asString(row.first_user_invited) : null,
    first_integration: row.first_integration ? asString(row.first_integration) : null,
    first_action: row.first_action ? asString(row.first_action) : null,
    milestones_completed: asNumber(row.milestones_completed),
  };
}

function parseCheckIn(raw: unknown): CheckInRecord | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    check_in_type: asString(row.check_in_type),
    scheduled_at: asString(row.scheduled_at),
    status: asString(row.status, "scheduled"),
  };
}

function parseExpansion(raw: unknown): ExpansionRecommendation | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    current_plan: asString(row.current_plan),
    recommended_upgrade: asString(row.recommended_upgrade),
    estimated_revenue_increase: asNumber(row.estimated_revenue_increase),
    currency: asString(row.currency, "NOK"),
    reason: asString(row.reason),
  };
}

function parsePlan(raw: unknown): SuccessPlan | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const status = asString(row.status, "active");
  return {
    id: asString(row.id),
    customer_id: asString(row.customer_id),
    customer: asString(row.customer),
    objective: asString(row.objective),
    owner: asString(row.owner),
    start_date: asString(row.start_date),
    target_date: row.target_date ? asString(row.target_date) : null,
    milestones: Array.isArray(row.milestones) ? row.milestones : [],
    status: (PLAN_STATUSES.includes(status as PlanStatus) ? status : "active") as PlanStatus,
  };
}

function parseAudit(raw: unknown): SuccessAuditEntry | null {
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

function parseFilters(raw: unknown): CustomerSuccessFilters {
  const row = asRecord(raw) ?? {};
  const status = asString(row.success_status);
  const renewal = asString(row.renewal_window);
  return {
    success_status: SUCCESS_STATUSES.includes(status as SuccessStatus)
      ? (status as SuccessStatus)
      : undefined,
    assigned_manager: row.assigned_manager ? asString(row.assigned_manager) : undefined,
    country: row.country ? asString(row.country) : undefined,
    renewal_window: RENEWAL_WINDOWS.includes(renewal as RenewalWindow)
      ? (renewal as RenewalWindow)
      : undefined,
    health_score_min: row.health_score_min != null ? asNumber(row.health_score_min) : undefined,
  };
}

function parseCustomerList(raw: unknown): SuccessCustomerRow[] {
  return Array.isArray(raw)
    ? raw.map(parseCustomer).filter(Boolean) as SuccessCustomerRow[]
    : [];
}

export function parseCustomerSuccessOperationsCenter(
  raw: unknown
): CustomerSuccessOperationsCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const renewals = asRecord(row.renewals) ?? {};

  return {
    principle: asString(row.principle),
    all_progressing: Boolean(row.all_progressing),
    filters: parseFilters(row.filters),
    overview: parseOverview(row.overview),
    customers: parseCustomerList(row.customers),
    onboarding: Array.isArray(row.onboarding)
      ? row.onboarding.map(parseOnboarding).filter(Boolean) as OnboardingProgress[]
      : [],
    check_ins: Array.isArray(row.check_ins)
      ? row.check_ins.map(parseCheckIn).filter(Boolean) as CheckInRecord[]
      : [],
    expansion: Array.isArray(row.expansion)
      ? row.expansion.map(parseExpansion).filter(Boolean) as ExpansionRecommendation[]
      : [],
    success_plans: Array.isArray(row.success_plans)
      ? row.success_plans.map(parsePlan).filter(Boolean) as SuccessPlan[]
      : [],
    renewals: {
      within_30_days: parseCustomerList(renewals.within_30_days),
      within_60_days: parseCustomerList(renewals.within_60_days),
      within_90_days: parseCustomerList(renewals.within_90_days),
    },
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter(Boolean) as SuccessAuditEntry[]
      : [],
  };
}

export function buildSuccessOperationsFilterQuery(filters: CustomerSuccessFilters): string {
  const params = new URLSearchParams();
  if (filters.success_status) params.set("success_status", filters.success_status);
  if (filters.assigned_manager) params.set("assigned_manager", filters.assigned_manager);
  if (filters.country) params.set("country", filters.country);
  if (filters.renewal_window) params.set("renewal_window", filters.renewal_window);
  if (filters.health_score_min != null) params.set("health_score_min", String(filters.health_score_min));
  const query = params.toString();
  return query ? `?${query}` : "";
}
