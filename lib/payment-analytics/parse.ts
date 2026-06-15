import type {
  FailedPaymentInsight,
  PaymentAnalyticsCenter,
  PaymentAnalyticsFilters,
  PaymentAnalyticsOverview,
  ProviderBreakdown,
  ProviderDistribution,
  RevenuePoint,
  TopEnterpriseCustomer,
} from "./types";
import type { AnalyticsProviderKey, CustomerType } from "./constants";
import { ANALYTICS_PROVIDERS, CUSTOMER_TYPES } from "./constants";

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

function parseOverview(raw: unknown): PaymentAnalyticsOverview {
  const row = asRecord(raw) ?? {};
  return {
    revenue_today: asNumber(row.revenue_today),
    revenue_this_month: asNumber(row.revenue_this_month),
    active_subscriptions: asNumber(row.active_subscriptions),
    failed_payments: asNumber(row.failed_payments),
    average_revenue_per_customer: asNumber(row.average_revenue_per_customer),
    churned_subscriptions: asNumber(row.churned_subscriptions),
    currency: asString(row.currency, "NOK"),
  };
}

function parseProviderBreakdown(raw: unknown): ProviderBreakdown | null {
  const row = asRecord(raw);
  if (!row) return null;
  const key = asString(row.provider_key);
  if (!ANALYTICS_PROVIDERS.includes(key as AnalyticsProviderKey)) return null;
  return {
    provider_key: key as AnalyticsProviderKey,
    revenue_30d: asNumber(row.revenue_30d),
    transactions: asNumber(row.transactions),
    success_rate: asNumber(row.success_rate, 100),
    refunds: asNumber(row.refunds),
    failed_payments: asNumber(row.failed_payments),
  };
}

function parseRevenuePoint(raw: unknown): RevenuePoint | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    date: asString(row.date),
    revenue: asNumber(row.revenue),
  };
}

function parseDistribution(raw: unknown): ProviderDistribution | null {
  const row = asRecord(raw);
  if (!row) return null;
  const key = asString(row.provider_key);
  if (!ANALYTICS_PROVIDERS.includes(key as AnalyticsProviderKey)) return null;
  return {
    provider_key: key as AnalyticsProviderKey,
    revenue: asNumber(row.revenue),
    percentage: asNumber(row.percentage),
  };
}

function parseTopEnterprise(raw: unknown): TopEnterpriseCustomer | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    customer: asString(row.customer),
    revenue: asNumber(row.revenue),
    open_invoices: asNumber(row.open_invoices),
    last_payment: row.last_payment ? asString(row.last_payment) : null,
    status: asString(row.status, "current"),
  };
}

function parseFailedInsight(raw: unknown): FailedPaymentInsight | null {
  const row = asRecord(raw);
  if (!row) return null;
  return {
    customer: asString(row.customer),
    provider: asString(row.provider),
    failure_reason: asString(row.failure_reason),
    retry_count: asNumber(row.retry_count),
    recommended_action: asString(row.recommended_action),
    transaction_at: asString(row.transaction_at),
  };
}

function parseFilters(raw: unknown): PaymentAnalyticsFilters {
  const row = asRecord(raw) ?? {};
  return {
    date_from: row.date_from ? asString(row.date_from) : undefined,
    date_to: row.date_to ? asString(row.date_to) : undefined,
    provider: row.provider ? (asString(row.provider) as AnalyticsProviderKey) : undefined,
    customer_type:
      row.customer_type && CUSTOMER_TYPES.includes(row.customer_type as CustomerType)
        ? (asString(row.customer_type) as CustomerType)
        : undefined,
    country: row.country ? asString(row.country) : undefined,
  };
}

function parseRevenueSeries(raw: unknown): RevenuePoint[] {
  return Array.isArray(raw)
    ? raw.map(parseRevenuePoint).filter(Boolean) as RevenuePoint[]
    : [];
}

export function parsePaymentAnalyticsCenter(raw: unknown): PaymentAnalyticsCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const revenue = asRecord(row.revenue_over_time) ?? {};
  const segments = asRecord(row.segments) ?? {};

  return {
    principle: asString(row.principle),
    has_activity: Boolean(row.has_activity),
    filters: parseFilters(row.filters),
    available_countries: Array.isArray(row.available_countries)
      ? row.available_countries.map(String)
      : [],
    overview: parseOverview(row.overview),
    provider_breakdown: Array.isArray(row.provider_breakdown)
      ? row.provider_breakdown.map(parseProviderBreakdown).filter(Boolean) as ProviderBreakdown[]
      : [],
    revenue_over_time: {
      last_7_days: parseRevenueSeries(revenue.last_7_days),
      last_30_days: parseRevenueSeries(revenue.last_30_days),
      last_12_months: parseRevenueSeries(revenue.last_12_months),
    },
    provider_distribution: Array.isArray(row.provider_distribution)
      ? row.provider_distribution.map(parseDistribution).filter(Boolean) as ProviderDistribution[]
      : [],
    segments: {
      self_service: asNumber(segments.self_service),
      enterprise: asNumber(segments.enterprise),
      currency: asString(segments.currency, "NOK"),
    },
    top_enterprise_customers: Array.isArray(row.top_enterprise_customers)
      ? row.top_enterprise_customers.map(parseTopEnterprise).filter(Boolean) as TopEnterpriseCustomer[]
      : [],
    failed_payment_insights: Array.isArray(row.failed_payment_insights)
      ? row.failed_payment_insights.map(parseFailedInsight).filter(Boolean) as FailedPaymentInsight[]
      : [],
  };
}

export function buildAnalyticsFilterQuery(filters: PaymentAnalyticsFilters): string {
  const params = new URLSearchParams();
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  if (filters.provider) params.set("provider", filters.provider);
  if (filters.customer_type) params.set("customer_type", filters.customer_type);
  if (filters.country) params.set("country", filters.country);
  if (filters.currency) params.set("currency", filters.currency);
  if (filters.subscription_plan) params.set("subscription_plan", filters.subscription_plan);
  if (filters.growth_partner) params.set("growth_partner", filters.growth_partner);
  if (filters.customer_segment) params.set("customer_segment", filters.customer_segment);
  const query = params.toString();
  return query ? `?${query}` : "";
}
