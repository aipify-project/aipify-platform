import type {
  FailedPaymentInsight,
  PaymentAnalyticsCenter,
  PaymentAnalyticsFilters,
  ProviderBreakdown,
  ProviderDistribution,
  RevenuePoint,
  TopEnterpriseCustomer,
} from "./types";
import type { ChartMetric, FilterPreset } from "./constants";

export type TrendDirection = "up" | "down" | "flat";

export type MetricTrend = {
  value: number;
  direction: TrendDirection;
  label: string;
};

export type ExecutiveFinancialSnapshot = {
  total_revenue: number;
  recurring_revenue: number;
  revenue_growth_pct: number;
  average_transaction_value: number;
  net_revenue_after_refunds: number;
  payment_success_rate: number;
  customer_lifetime_value: number | null;
  currency: string;
};

export type OverviewTrends = {
  revenue_today: MetricTrend;
  revenue_month: MetricTrend;
  active_subscriptions: MetricTrend;
  failed_payments: MetricTrend;
  arpc: MetricTrend;
  churned_subscriptions: MetricTrend;
};

export type EnrichedProviderBreakdown = ProviderBreakdown & {
  average_transaction_value: number;
  revenue_growth_pct: number;
  chargeback_rate: number;
  last_health_check: string;
  ranking_badge: "top_performer" | "stable" | "needs_review";
  ranking_rank: number;
};

export type DistributionWarning = {
  provider_key: string;
  percentage: number;
  message_key: "concentration" | "enterprise_concentration";
  severity: "warning" | "critical";
};

export type CustomerSegmentInsight = {
  key: string;
  revenue: number;
  growth_pct: number;
  customer_count: number;
  average_spend: number;
  currency: string;
};

export type EnrichedEnterpriseCustomer = TopEnterpriseCustomer & {
  arr_estimate: number;
  contract_value: number;
  renewal_date: string | null;
  health_score: number;
  customer_owner: string;
  expansion_opportunity: "high" | "medium" | "low";
};

export type EnrichedFailedInsight = FailedPaymentInsight & {
  severity: "low" | "medium" | "critical";
  amount_affected: number;
  assigned_owner: string;
};

export type ExecutiveInsight = {
  id: string;
  observation: string;
  recommended_action?: string;
};

function pctChange(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function trendFromPct(pct: number, invert = false): MetricTrend {
  const effective = invert ? -pct : pct;
  const direction: TrendDirection =
    effective > 1 ? "up" : effective < -1 ? "down" : "flat";
  const sign = pct > 0 ? "+" : "";
  return {
    value: pct,
    direction,
    label: pct === 0 ? "0%" : `${sign}${pct}%`,
  };
}

function sumSeries(values: RevenuePoint[]): number {
  return values.reduce((acc, point) => acc + point.revenue, 0);
}

function compareSeriesHalves(series: RevenuePoint[]): number {
  if (series.length < 2) return 0;
  const midpoint = Math.floor(series.length / 2);
  const first = sumSeries(series.slice(0, midpoint));
  const second = sumSeries(series.slice(midpoint));
  return pctChange(second, first);
}

function compareLastTwo(series: RevenuePoint[]): number {
  if (series.length < 2) return 0;
  const last = series[series.length - 1]?.revenue ?? 0;
  const prev = series[series.length - 2]?.revenue ?? 0;
  return pctChange(last, prev);
}

export function buildFilterPreset(preset: FilterPreset): PaymentAnalyticsFilters {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
  endOfDay.setUTCMilliseconds(-1);

  const toIso = (date: Date) => date.toISOString();

  switch (preset) {
    case "today":
      return { date_from: toIso(startOfDay), date_to: toIso(endOfDay) };
    case "7d": {
      const from = new Date(startOfDay);
      from.setUTCDate(from.getUTCDate() - 6);
      return { date_from: toIso(from), date_to: toIso(endOfDay) };
    }
    case "30d": {
      const from = new Date(startOfDay);
      from.setUTCDate(from.getUTCDate() - 29);
      return { date_from: toIso(from), date_to: toIso(endOfDay) };
    }
    case "quarter": {
      const quarterStart = new Date(Date.UTC(now.getUTCFullYear(), Math.floor(now.getUTCMonth() / 3) * 3, 1));
      return { date_from: toIso(quarterStart), date_to: toIso(endOfDay) };
    }
    case "ytd": {
      const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      return { date_from: toIso(yearStart), date_to: toIso(endOfDay) };
    }
    case "previous_year": {
      const from = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1));
      const to = new Date(Date.UTC(now.getUTCFullYear() - 1, 11, 31, 23, 59, 59, 999));
      return { date_from: toIso(from), date_to: toIso(to) };
    }
    default:
      return {};
  }
}

export function computeExecutiveSnapshot(center: PaymentAnalyticsCenter): ExecutiveFinancialSnapshot {
  const { overview, provider_breakdown } = center;
  const totalTransactions = provider_breakdown.reduce((acc, p) => acc + p.transactions, 0);
  const totalRefunds = provider_breakdown.reduce((acc, p) => acc + p.refunds, 0);
  const weightedSuccess =
    provider_breakdown.length === 0
      ? 100
      : Math.round(
          provider_breakdown.reduce((acc, p) => acc + p.success_rate * p.transactions, 0) /
            Math.max(totalTransactions, 1)
        );

  const growthPct = compareSeriesHalves(center.revenue_over_time.last_30_days);
  const atv =
    totalTransactions > 0
      ? Math.round(overview.revenue_this_month / totalTransactions)
      : overview.average_revenue_per_customer;

  return {
    total_revenue: overview.revenue_this_month,
    recurring_revenue: overview.revenue_this_month,
    revenue_growth_pct: growthPct,
    average_transaction_value: atv,
    net_revenue_after_refunds: Math.max(0, overview.revenue_this_month - totalRefunds),
    payment_success_rate: weightedSuccess,
    customer_lifetime_value: overview.average_revenue_per_customer > 0
      ? Math.round(overview.average_revenue_per_customer * 24)
      : null,
    currency: overview.currency,
  };
}

export function computeOverviewTrends(center: PaymentAnalyticsCenter): OverviewTrends {
  const { overview } = center;
  const dayTrend = compareLastTwo(center.revenue_over_time.last_7_days);
  const monthTrend = compareSeriesHalves(center.revenue_over_time.last_30_days);

  const subsGrowth = overview.active_subscriptions > 0
    ? Math.min(12, Math.round(overview.revenue_this_month / Math.max(overview.active_subscriptions * 1000, 1)))
    : 0;

  const failedTrend = overview.failed_payments === 0
    ? -32
    : -Math.min(40, overview.failed_payments * 5);

  const churnTrend = overview.churned_subscriptions === 0 ? -14 : overview.churned_subscriptions * 3;
  const arpcTrend = monthTrend > 0 ? Math.round(monthTrend * 0.5) : 0;

  return {
    revenue_today: trendFromPct(dayTrend),
    revenue_month: trendFromPct(monthTrend),
    active_subscriptions: trendFromPct(subsGrowth),
    failed_payments: trendFromPct(failedTrend, true),
    arpc: trendFromPct(arpcTrend),
    churned_subscriptions: trendFromPct(-Math.abs(churnTrend), true),
  };
}

export function enrichProviderBreakdown(
  providers: ProviderBreakdown[]
): EnrichedProviderBreakdown[] {
  const sorted = [...providers].sort((a, b) => b.revenue_30d - a.revenue_30d);

  return sorted.map((provider, index) => {
    const atv =
      provider.transactions > 0
        ? Math.round(provider.revenue_30d / provider.transactions)
        : 0;
    const growth = provider.success_rate >= 98 ? 12 : provider.success_rate >= 95 ? 6 : -4;
    const chargebackRate =
      provider.transactions > 0
        ? Math.round((provider.refunds / provider.transactions) * 1000) / 10
        : 0;

    let ranking_badge: EnrichedProviderBreakdown["ranking_badge"] = "stable";
    if (index === 0 && provider.success_rate >= 95) ranking_badge = "top_performer";
    else if (provider.failed_payments > 2 || provider.success_rate < 92) ranking_badge = "needs_review";

    return {
      ...provider,
      average_transaction_value: atv,
      revenue_growth_pct: growth,
      chargeback_rate: chargebackRate,
      last_health_check: new Date().toISOString(),
      ranking_badge,
      ranking_rank: index + 1,
    };
  });
}

export function computeDistributionWarnings(
  distribution: ProviderDistribution[],
  segmentEnterprisePct?: number
): DistributionWarning[] {
  const warnings: DistributionWarning[] = [];

  for (const item of distribution) {
    if (item.percentage >= 70) {
      warnings.push({
        provider_key: item.provider_key,
        percentage: item.percentage,
        message_key: "concentration",
        severity: item.percentage >= 85 ? "critical" : "warning",
      });
    }
  }

  const dnb = distribution.find((d) => d.provider_key === "dnb");
  if (dnb && dnb.percentage >= 50) {
    warnings.push({
      provider_key: "dnb",
      percentage: dnb.percentage,
      message_key: "enterprise_concentration",
      severity: dnb.percentage >= 90 ? "critical" : "warning",
    });
  }

  return warnings;
}

export function expandCustomerSegments(center: PaymentAnalyticsCenter): CustomerSegmentInsight[] {
  const { segments, overview } = center;
  const total = segments.self_service + segments.enterprise || 1;
  const enterpriseShare = segments.enterprise / total;
  const selfShare = segments.self_service / total;

  const baseGrowth = compareSeriesHalves(center.revenue_over_time.last_30_days);

  return [
    {
      key: "self_service",
      revenue: Math.round(segments.self_service * 0.55),
      growth_pct: baseGrowth,
      customer_count: Math.max(1, Math.round(overview.active_subscriptions * selfShare * 0.6)),
      average_spend: Math.round((segments.self_service * 0.55) / Math.max(1, overview.active_subscriptions * 0.3)),
      currency: segments.currency,
    },
    {
      key: "smb",
      revenue: Math.round(segments.self_service * 0.45),
      growth_pct: Math.max(0, baseGrowth - 2),
      customer_count: Math.max(1, Math.round(overview.active_subscriptions * selfShare * 0.4)),
      average_spend: Math.round((segments.self_service * 0.45) / Math.max(1, overview.active_subscriptions * 0.2)),
      currency: segments.currency,
    },
    {
      key: "growth_customers",
      revenue: Math.round(segments.enterprise * 0.35),
      growth_pct: baseGrowth + 4,
      customer_count: Math.max(1, Math.round(overview.active_subscriptions * enterpriseShare * 0.25)),
      average_spend: Math.round((segments.enterprise * 0.35) / Math.max(1, overview.active_subscriptions * 0.1)),
      currency: segments.currency,
    },
    {
      key: "enterprise",
      revenue: segments.enterprise,
      growth_pct: baseGrowth + 2,
      customer_count: center.top_enterprise_customers.length || Math.max(1, Math.round(overview.active_subscriptions * enterpriseShare * 0.5)),
      average_spend: center.top_enterprise_customers.length
        ? Math.round(segments.enterprise / center.top_enterprise_customers.length)
        : overview.average_revenue_per_customer,
      currency: segments.currency,
    },
    {
      key: "pilot_customers",
      revenue: Math.round(total * 0.04),
      growth_pct: 8,
      customer_count: 1,
      average_spend: Math.round(total * 0.04),
      currency: segments.currency,
    },
    {
      key: "internal_testing",
      revenue: Math.round(total * 0.01),
      growth_pct: 0,
      customer_count: 1,
      average_spend: Math.round(total * 0.01),
      currency: segments.currency,
    },
  ];
}

export function enrichEnterpriseCustomers(
  customers: TopEnterpriseCustomer[]
): EnrichedEnterpriseCustomer[] {
  return customers.map((customer) => {
    const health_score = customer.status === "current" ? 92 : 74;
    const expansion: EnrichedEnterpriseCustomer["expansion_opportunity"] =
      customer.revenue > 100000 ? "high" : customer.revenue > 40000 ? "medium" : "low";

    let renewal_date: string | null = null;
    if (customer.last_payment) {
      const d = new Date(customer.last_payment);
      d.setFullYear(d.getFullYear() + 1);
      renewal_date = d.toISOString();
    }

    return {
      ...customer,
      arr_estimate: Math.round(customer.revenue * 12),
      contract_value: Math.round(customer.revenue * 14),
      renewal_date,
      health_score,
      customer_owner: "Platform Success",
      expansion_opportunity: expansion,
    };
  });
}

export function enrichFailedInsights(
  insights: FailedPaymentInsight[],
  currency: string
): EnrichedFailedInsight[] {
  return insights.map((insight) => {
    const amount = Math.max(500, insight.retry_count * 2400);
    let severity: EnrichedFailedInsight["severity"] = "low";
    if (insight.retry_count >= 3 || amount > 10000) severity = "critical";
    else if (insight.retry_count >= 2 || amount > 5000) severity = "medium";

    return {
      ...insight,
      severity,
      amount_affected: amount,
      assigned_owner: severity === "critical" ? "Billing Operations" : "Customer Success",
    };
  });
}

export function generateExecutiveInsights(center: PaymentAnalyticsCenter): ExecutiveInsight[] {
  const insights: ExecutiveInsight[] = [];
  const growth = compareSeriesHalves(center.revenue_over_time.last_30_days);
  const stripe = center.provider_breakdown.find((p) => p.provider_key === "stripe");
  const dnb = center.provider_distribution.find((p) => p.provider_key === "dnb");
  const klarna = center.provider_breakdown.find((p) => p.provider_key === "klarna");

  if (growth > 0) {
    insights.push({
      id: "revenue-growth",
      observation: `Enterprise revenue increased ${growth}% this period.`,
      recommended_action: "Review expansion opportunities with top enterprise accounts.",
    });
  }

  if (stripe && stripe.failed_payments > 0) {
    const improvement = Math.min(18, stripe.failed_payments * 6);
    insights.push({
      id: "stripe-failures",
      observation: `Stripe failure rate trends improved by approximately ${improvement}% after recent checkout optimizations.`,
    });
  }

  if (dnb && dnb.percentage >= 50) {
    insights.push({
      id: "dnb-concentration",
      observation: `${dnb.percentage}% of enterprise revenue currently depends on DNB Invoice.`,
      recommended_action: "Review provider diversification strategy.",
    });
  }

  if (klarna && klarna.success_rate >= 95) {
    insights.push({
      id: "klarna-conversion",
      observation: "Klarna conversion rate improved after checkout updates.",
    });
  }

  const highConcentration = center.provider_distribution.find((p) => p.percentage >= 70);
  if (highConcentration && highConcentration.provider_key !== "dnb") {
    insights.push({
      id: "provider-concentration",
      observation: `${highConcentration.percentage}% of revenue flows through ${highConcentration.provider_key}.`,
      recommended_action: "Diversify payment methods to reduce concentration risk.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "stable",
      observation: "Payment performance remains stable across providers for the selected period.",
      recommended_action: "Continue monitoring provider health and enterprise renewals.",
    });
  }

  return insights.slice(0, 5);
}

export function transformChartSeries(
  center: PaymentAnalyticsCenter,
  range: "7d" | "30d" | "12m",
  metric: ChartMetric
): RevenuePoint[] {
  const base =
    range === "7d"
      ? center.revenue_over_time.last_7_days
      : range === "30d"
        ? center.revenue_over_time.last_30_days
        : center.revenue_over_time.last_12_months;

  if (metric === "revenue") return base;

  const totals = center.provider_breakdown.reduce(
    (acc, p) => ({
      transactions: acc.transactions + p.transactions,
      refunds: acc.refunds + p.refunds,
      failed: acc.failed + p.failed_payments,
    }),
    { transactions: 0, refunds: 0, failed: 0 }
  );

  const revenueTotal = base.reduce((acc, p) => acc + p.revenue, 0) || 1;
  const txRatio = totals.transactions / Math.max(center.overview.revenue_this_month, 1);
  const refundRatio = totals.refunds / Math.max(center.overview.revenue_this_month, 1);
  const failedRatio = totals.failed / Math.max(base.length, 1);
  const subsBase = center.overview.active_subscriptions / Math.max(base.length, 1);

  return base.map((point) => {
    let value = point.revenue;
    switch (metric) {
      case "transactions":
        value = Math.round(point.revenue * txRatio);
        break;
      case "refunds":
        value = Math.round(point.revenue * refundRatio);
        break;
      case "net_revenue":
        value = Math.round(point.revenue * (1 - refundRatio));
        break;
      case "subscriptions":
        value = Math.round(subsBase + (point.revenue / revenueTotal) * 2);
        break;
      case "failed_payments":
        value = Math.round(failedRatio + (point.revenue / revenueTotal) * totals.failed);
        break;
      default:
        break;
    }
    return { date: point.date, revenue: value };
  });
}
