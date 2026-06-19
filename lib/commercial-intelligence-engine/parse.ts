export type CommercialIntelligenceCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  mrr?: number;
  arr?: number;
  nrr_pct?: number;
  health_status?: string;
  health_score?: number;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  revenue_registry?: Record<string, unknown>[];
  recurring_revenue?: Record<string, unknown>;
  attribution?: Record<string, unknown>[];
  health?: Record<string, unknown>;
  churn_signals?: Record<string, unknown>[];
  expansion?: Record<string, unknown>[];
  forecasts?: Record<string, unknown>[];
  funnel?: Record<string, unknown>[];
  customer_value?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  subscriptions?: Record<string, unknown>[];
  customers?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  rows?: Record<string, unknown>[];
};

export function parseCommercialIntelligenceCenter(raw: unknown): CommercialIntelligenceCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    mrr: typeof row.mrr === "number" ? row.mrr : undefined,
    arr: typeof row.arr === "number" ? row.arr : undefined,
    nrr_pct: typeof row.nrr_pct === "number" ? row.nrr_pct : undefined,
    health_status: typeof row.health_status === "string" ? row.health_status : undefined,
    health_score: typeof row.health_score === "number" ? row.health_score : undefined,
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    revenue_registry: Array.isArray(row.revenue_registry) ? (row.revenue_registry as Record<string, unknown>[]) : [],
    recurring_revenue: typeof row.recurring_revenue === "object" && row.recurring_revenue ? (row.recurring_revenue as Record<string, unknown>) : {},
    attribution: Array.isArray(row.attribution) ? (row.attribution as Record<string, unknown>[]) : [],
    health: typeof row.health === "object" && row.health ? (row.health as Record<string, unknown>) : {},
    churn_signals: Array.isArray(row.churn_signals) ? (row.churn_signals as Record<string, unknown>[]) : [],
    expansion: Array.isArray(row.expansion) ? (row.expansion as Record<string, unknown>[]) : [],
    forecasts: Array.isArray(row.forecasts) ? (row.forecasts as Record<string, unknown>[]) : [],
    funnel: Array.isArray(row.funnel) ? (row.funnel as Record<string, unknown>[]) : [],
    customer_value: Array.isArray(row.customer_value) ? (row.customer_value as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    subscriptions: Array.isArray(row.subscriptions) ? (row.subscriptions as Record<string, unknown>[]) : [],
    customers: Array.isArray(row.customers) ? (row.customers as Record<string, unknown>[]) : [],
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, unknown>) : {},
    rows: Array.isArray(row.rows) ? (row.rows as Record<string, unknown>[]) : [],
  };
}
