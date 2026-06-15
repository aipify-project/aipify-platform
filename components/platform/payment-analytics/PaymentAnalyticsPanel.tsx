"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PaymentProviderLogo } from "@/components/shared/payment-providers/PaymentProviderLogo";
import {
  buildAnalyticsFilterQuery,
  buildFilterPreset,
  CHART_BAR_CLASS,
  computeDistributionWarnings,
  computeExecutiveSnapshot,
  computeOverviewTrends,
  enrichEnterpriseCustomers,
  enrichFailedInsights,
  enrichProviderBreakdown,
  expandCustomerSegments,
  EXPORT_FORMATS,
  ENTERPRISE_STATUS_BADGES,
  EXPANSION_BADGES,
  FAILURE_SEVERITY_BADGES,
  FILTER_PRESETS,
  generateExecutiveInsights,
  parsePaymentAnalyticsCenter,
  PROVIDER_RANK_BADGES,
  TREND_STYLES,
  transformChartSeries,
  type ChartMetric,
  type ChartRange,
  type ExportFormat,
  type FilterPreset,
  type MetricTrend,
  type PaymentAnalyticsCenter,
  type PaymentAnalyticsFilters,
  type PaymentAnalyticsLabels,
  type RevenuePoint,
} from "@/lib/payment-analytics";
import type { PaymentProviderKey } from "@/lib/payment-providers";

type PaymentAnalyticsPanelProps = {
  labels: PaymentAnalyticsLabels;
  backHref: string;
};

const EXECUTIVE_CARD =
  "rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/80 p-6 shadow-sm shadow-zinc-900/5";
const SECTION_CARD = "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";

const CURRENCY_OPTIONS = ["NOK", "EUR", "USD", "SEK", "DKK"] as const;
const PLAN_OPTIONS = ["starter", "growth", "business", "enterprise"] as const;
const SEGMENT_FILTER_OPTIONS = [
  "self_service",
  "smb",
  "growth_customers",
  "enterprise",
  "pilot_customers",
  "internal_testing",
] as const;

function formatMoney(value: number, currency = "NOK"): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

function TrendBadge({ trend, invertColor = false }: { trend: MetricTrend; invertColor?: boolean }) {
  const positive = invertColor ? trend.direction === "down" : trend.direction === "up";
  const negative = invertColor ? trend.direction === "up" : trend.direction === "down";
  const arrow = trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→";
  const color = positive
    ? TREND_STYLES.up
    : negative
      ? TREND_STYLES.down
      : TREND_STYLES.flat;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      {arrow} {trend.label}
    </span>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function OverviewCard({
  label,
  value,
  trend,
  invertTrend,
}: {
  label: string;
  value: string | number;
  trend?: MetricTrend;
  invertTrend?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
      {trend ? (
        <div className="mt-2">
          <TrendBadge trend={trend} invertColor={invertTrend} />
        </div>
      ) : null}
    </div>
  );
}

function RevenueChart({
  data,
  labels,
  currency,
}: {
  data: RevenuePoint[];
  labels: PaymentAnalyticsLabels;
  currency: string;
}) {
  const max = useMemo(() => Math.max(...data.map((d) => d.revenue), 1), [data]);

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">{labels.emptyState}</p>;
  }

  return (
    <div className="flex h-48 items-end gap-1 sm:gap-2">
      {data.map((point) => {
        const height = Math.max(4, Math.round((point.revenue / max) * 100));
        return (
          <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className={`w-full ${CHART_BAR_CLASS}`}
              style={{ height: `${height}%` }}
              title={`${formatDate(point.date)}: ${formatMoney(point.revenue, currency)}`}
            />
            <span className="truncate text-[10px] text-gray-400">
              {new Date(point.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ExecutiveSnapshotSection({
  center,
  labels,
}: {
  center: PaymentAnalyticsCenter;
  labels: PaymentAnalyticsLabels;
}) {
  const executive = computeExecutiveSnapshot(center);

  const cards = [
    {
      label: labels.executive.totalRevenue,
      value: formatMoney(executive.total_revenue, executive.currency),
      trend: executive.revenue_growth_pct,
    },
    {
      label: labels.executive.recurringRevenue,
      value: formatMoney(executive.recurring_revenue, executive.currency),
      trend: executive.revenue_growth_pct,
    },
    {
      label: labels.executive.revenueGrowth,
      value: formatPct(executive.revenue_growth_pct),
      trend: executive.revenue_growth_pct,
    },
    {
      label: labels.executive.averageTransactionValue,
      value: formatMoney(executive.average_transaction_value, executive.currency),
      trend: null,
    },
    {
      label: labels.executive.netRevenue,
      value: formatMoney(executive.net_revenue_after_refunds, executive.currency),
      trend: null,
    },
    {
      label: labels.executive.paymentSuccessRate,
      value: `${executive.payment_success_rate}%`,
      trend: executive.payment_success_rate >= 95 ? 2 : -3,
    },
  ];

  return (
    <section className={EXECUTIVE_CARD}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {labels.sections.executiveSnapshot}
      </h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const trendColor =
            card.trend === null
              ? TREND_STYLES.flat
              : card.trend > 0
                ? TREND_STYLES.up
                : card.trend < 0
                  ? TREND_STYLES.down
                  : TREND_STYLES.flat;
          return (
            <div key={card.label} className="rounded-xl border border-zinc-100 bg-white/80 px-4 py-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{card.label}</dt>
              <dd className="mt-2 text-lg font-semibold tracking-tight text-zinc-900">{card.value}</dd>
              {card.trend !== null ? (
                <p className={`mt-2 text-xs font-medium ${trendColor}`}>
                  {card.trend > 0 ? "↑" : card.trend < 0 ? "↓" : "→"} {formatPct(card.trend)}
                </p>
              ) : null}
            </div>
          );
        })}
      </dl>
      <p className="mt-4 text-xs text-zinc-500">
        {labels.executive.customerLifetimeValue}: {labels.executive.clvFuture}
      </p>
    </section>
  );
}

function DistributionChart({
  center,
  labels,
}: {
  center: PaymentAnalyticsCenter;
  labels: PaymentAnalyticsLabels;
}) {
  const warnings = computeDistributionWarnings(center.provider_distribution);
  const colors = ["bg-indigo-500", "bg-sky-500", "bg-violet-500", "bg-teal-500"];

  return (
    <div className="space-y-4">
      {warnings.length > 0 ? (
        <div className="space-y-2">
          {warnings.map((warning) => {
            const providerLabel =
              labels.providers[warning.provider_key as keyof typeof labels.providers] ??
              warning.provider_key;
            const message =
              warning.message_key === "enterprise_concentration"
                ? labels.distribution.enterpriseConcentrationWarning
                    .replace("{percentage}", String(warning.percentage))
                    .replace("{provider}", providerLabel)
                : labels.distribution.concentrationWarning
                    .replace("{percentage}", String(warning.percentage))
                    .replace("{provider}", providerLabel);
            return (
              <div
                key={`${warning.provider_key}-${warning.message_key}`}
                className={`rounded-xl border px-4 py-3 text-sm ${
                  warning.severity === "critical"
                    ? "border-red-200 bg-red-50 text-red-950"
                    : "border-amber-200 bg-amber-50 text-amber-950"
                }`}
              >
                <p className="font-medium">{message}</p>
                <p className="mt-1 text-xs opacity-80">{labels.distribution.diversifyRecommendation}</p>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="space-y-3">
        {center.provider_distribution.map((item, index) => (
          <div key={item.provider_key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900">
                {labels.providers[item.provider_key]}
              </span>
              <span className="text-gray-600">
                {item.percentage}% · {formatMoney(item.revenue, center.overview.currency)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${colors[index % colors.length]}`}
                style={{ width: `${Math.max(item.percentage, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const EXPORT_LABEL_KEYS: Record<ExportFormat, keyof PaymentAnalyticsLabels["exports"]> = {
  csv: "csv",
  xlsx: "excel",
  pdf: "pdf",
  board_report: "boardReport",
  executive_summary: "executiveSummary",
  finance_fiken: "financeFiken",
  auditor_package: "auditorPackage",
  quarterly_revenue: "quarterlyRevenue",
};

export function PaymentAnalyticsPanel({ labels, backHref }: PaymentAnalyticsPanelProps) {
  const [center, setCenter] = useState<PaymentAnalyticsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<ChartRange>("7d");
  const [chartMetric, setChartMetric] = useState<ChartMetric>("revenue");
  const [exporting, setExporting] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<FilterPreset | null>(null);
  const [filters, setFilters] = useState<PaymentAnalyticsFilters>({});
  const [draftFilters, setDraftFilters] = useState<PaymentAnalyticsFilters>({});

  const load = useCallback(async (activeFilters: PaymentAnalyticsFilters) => {
    setLoading(true);
    const query = buildAnalyticsFilterQuery(activeFilters);
    const res = await fetch(`/api/payment-analytics/overview${query}`);
    if (res.ok) setCenter(parsePaymentAnalyticsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const derived = useMemo(() => {
    if (!center) return null;
    return {
      executive: computeExecutiveSnapshot(center),
      trends: computeOverviewTrends(center),
      providers: enrichProviderBreakdown(center.provider_breakdown),
      segments: expandCustomerSegments(center),
      enterprise: enrichEnterpriseCustomers(center.top_enterprise_customers),
      failed: enrichFailedInsights(center.failed_payment_insights, center.overview.currency),
      insights: generateExecutiveInsights(center),
      chartData: transformChartSeries(center, chartRange, chartMetric),
    };
  }, [center, chartRange, chartMetric]);

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    try {
      const query = buildAnalyticsFilterQuery(filters);
      const res = await fetch(
        `/api/payment-analytics/export?format=${format}${query ? query.replace("?", "&") : ""}`
      );
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const ext = format === "csv" ? "csv" : format === "xlsx" ? "xlsx" : "pdf";
      anchor.download = `payment-analytics-${format}.${ext}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  };

  const applyPreset = (preset: FilterPreset) => {
    const presetFilters = buildFilterPreset(preset);
    setActivePreset(preset);
    setDraftFilters((prev) => ({ ...prev, ...presetFilters }));
    setFilters((prev) => ({ ...prev, ...presetFilters }));
  };

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center || !derived) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview } = center;
  const rankingLabels = {
    top_performer: labels.provider.rankingTopPerformer,
    stable: labels.provider.rankingStable,
    needs_review: labels.provider.rankingNeedsReview,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {center.principle}
        </p>
      </div>

      <section className={SECTION_CARD}>
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                activePreset === preset
                  ? "bg-indigo-50 text-indigo-800 ring-indigo-200"
                  : "bg-gray-50 text-gray-700 ring-gray-200 hover:bg-gray-100"
              }`}
            >
              {labels.filters.presets[preset]}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.dateFrom}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.date_from?.slice(0, 10) ?? ""}
              onChange={(e) => {
                setActivePreset(null);
                setDraftFilters((prev) => ({
                  ...prev,
                  date_from: e.target.value ? `${e.target.value}T00:00:00.000Z` : undefined,
                }));
              }}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.dateTo}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.date_to?.slice(0, 10) ?? ""}
              onChange={(e) => {
                setActivePreset(null);
                setDraftFilters((prev) => ({
                  ...prev,
                  date_to: e.target.value ? `${e.target.value}T23:59:59.000Z` : undefined,
                }));
              }}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.provider}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.provider ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  provider: e.target.value as PaymentAnalyticsFilters["provider"],
                }))
              }
            >
              <option value="">{labels.filters.allProviders}</option>
              {Object.entries(labels.providers).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.customerType}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.customer_type ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  customer_type: e.target.value as PaymentAnalyticsFilters["customer_type"],
                }))
              }
            >
              <option value="">{labels.filters.allTypes}</option>
              {Object.entries(labels.customerTypes).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.country}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.country ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, country: e.target.value || undefined }))
              }
            >
              <option value="">{labels.filters.allCountries}</option>
              {center.available_countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.currency}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.currency ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, currency: e.target.value || undefined }))
              }
            >
              <option value="">{labels.filters.allCurrencies}</option>
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.subscriptionPlan}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.subscription_plan ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  subscription_plan: e.target.value || undefined,
                }))
              }
            >
              <option value="">{labels.filters.allPlans}</option>
              {PLAN_OPTIONS.map((plan) => (
                <option key={plan} value={plan}>
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.growthPartner}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.growth_partner ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  growth_partner: e.target.value || undefined,
                }))
              }
            >
              <option value="">{labels.filters.allPartners}</option>
              <option value="unonight">Unonight</option>
              <option value="direct">Direct</option>
            </select>
          </label>
          <label className="text-sm">
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.customer_segment ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  customer_segment: e.target.value || undefined,
                }))
              }
            >
              <option value="">{labels.filters.allSegments}</option>
              {SEGMENT_FILTER_OPTIONS.map((segment) => (
                <option key={segment} value={segment}>
                  {labels.segments[segment] ?? segment}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={() => setFilters({ ...draftFilters })}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.filters.apply}
        </button>
      </section>

      {!center.has_activity ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-600 shadow-sm">
          {labels.emptyState}
        </div>
      ) : (
        <>
          <ExecutiveSnapshotSection center={center} labels={labels} />

          <section>
            <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard
                label={labels.overview.revenueToday}
                value={formatMoney(overview.revenue_today, overview.currency)}
                trend={derived.trends.revenue_today}
              />
              <OverviewCard
                label={labels.overview.revenueMonth}
                value={formatMoney(overview.revenue_this_month, overview.currency)}
                trend={derived.trends.revenue_month}
              />
              <OverviewCard
                label={labels.overview.activeSubscriptions}
                value={overview.active_subscriptions}
                trend={derived.trends.active_subscriptions}
              />
              <OverviewCard
                label={labels.overview.failedPayments}
                value={overview.failed_payments}
                trend={derived.trends.failed_payments}
                invertTrend
              />
              <OverviewCard
                label={labels.overview.arpc}
                value={formatMoney(overview.average_revenue_per_customer, overview.currency)}
                trend={derived.trends.arpc}
              />
              <OverviewCard
                label={labels.overview.churnedSubscriptions}
                value={overview.churned_subscriptions}
                trend={derived.trends.churned_subscriptions}
                invertTrend
              />
            </dl>
          </section>

          <section>
            <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.providerBreakdown}</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {derived.providers.map((provider) => (
                <article key={provider.provider_key} className={SECTION_CARD}>
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-4">
                      <PaymentProviderLogo
                        provider={provider.provider_key as PaymentProviderKey}
                        alt={labels.providers[provider.provider_key]}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {labels.providers[provider.provider_key]}
                        </h3>
                        <p className="text-xs text-gray-500">
                          #{provider.ranking_rank} · {rankingLabels[provider.ranking_badge]}
                        </p>
                      </div>
                    </div>
                    <StatusPill
                      label={rankingLabels[provider.ranking_badge]}
                      className={PROVIDER_RANK_BADGES[provider.ranking_badge]}
                    />
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.revenue30d}</dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {formatMoney(provider.revenue_30d, overview.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.transactions}</dt>
                      <dd className="mt-1 font-medium text-gray-900">{provider.transactions}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.successRate}</dt>
                      <dd className="mt-1 font-medium text-gray-900">{provider.success_rate}%</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.refunds}</dt>
                      <dd className="mt-1 font-medium text-gray-900">{provider.refunds}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.failedPayments}</dt>
                      <dd className="mt-1 font-medium text-gray-900">{provider.failed_payments}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.averageTransactionValue}</dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {formatMoney(provider.average_transaction_value, overview.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.revenueGrowth}</dt>
                      <dd className="mt-1 font-medium text-emerald-700">
                        {formatPct(provider.revenue_growth_pct)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.chargebackRate}</dt>
                      <dd className="mt-1 font-medium text-gray-900">{provider.chargeback_rate}%</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-gray-500">{labels.provider.lastHealthCheck}</dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {formatDate(provider.last_health_check)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className={SECTION_CARD}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-gray-900">{labels.sections.revenueOverTime}</h2>
                <div className="flex flex-wrap gap-2">
                  {(["7d", "30d", "12m"] as const).map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setChartRange(range)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                        chartRange === range
                          ? "bg-indigo-50 text-indigo-800 ring-indigo-200"
                          : "bg-gray-50 text-gray-700 ring-gray-200"
                      }`}
                    >
                      {labels.chartRanges[range]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    "revenue",
                    "transactions",
                    "refunds",
                    "net_revenue",
                    "subscriptions",
                    "failed_payments",
                  ] as const
                ).map((metric) => (
                  <button
                    key={metric}
                    type="button"
                    onClick={() => setChartMetric(metric)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                      chartMetric === metric
                        ? "bg-violet-50 text-violet-800 ring-violet-200"
                        : "bg-gray-50 text-gray-700 ring-gray-200"
                    }`}
                  >
                    {labels.chartMetrics[metric]}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <RevenueChart
                  data={derived.chartData}
                  labels={labels}
                  currency={overview.currency}
                />
              </div>
            </section>

            <section className={SECTION_CARD}>
              <h2 className="font-semibold text-gray-900">{labels.sections.providerDistribution}</h2>
              <div className="mt-6">
                <DistributionChart center={center} labels={labels} />
              </div>
            </section>
          </div>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.segments}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {derived.segments.map((segment) => (
                <article key={segment.key} className="rounded-xl bg-gray-50 px-4 py-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.segments[segment.key] ?? segment.key}
                  </h3>
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">{labels.segmentMetrics.revenue}</dt>
                      <dd className="font-medium text-gray-900">
                        {formatMoney(segment.revenue, segment.currency)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">{labels.segmentMetrics.growth}</dt>
                      <dd className="font-medium text-emerald-700">{formatPct(segment.growth_pct)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">{labels.segmentMetrics.customers}</dt>
                      <dd className="font-medium text-gray-900">{segment.customer_count}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">{labels.segmentMetrics.averageSpend}</dt>
                      <dd className="font-medium text-gray-900">
                        {formatMoney(segment.average_spend, segment.currency)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.topEnterprise}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.revenue}</th>
                    <th className="px-3 py-2">{labels.table.arrEstimate}</th>
                    <th className="px-3 py-2">{labels.table.contractValue}</th>
                    <th className="px-3 py-2">{labels.table.renewalDate}</th>
                    <th className="px-3 py-2">{labels.table.healthScore}</th>
                    <th className="px-3 py-2">{labels.table.customerOwner}</th>
                    <th className="px-3 py-2">{labels.table.expansionOpportunity}</th>
                    <th className="px-3 py-2">{labels.table.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.enterprise.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    derived.enterprise.map((row) => (
                      <tr key={row.customer} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{formatMoney(row.revenue, overview.currency)}</td>
                        <td className="px-3 py-3">{formatMoney(row.arr_estimate, overview.currency)}</td>
                        <td className="px-3 py-3">{formatMoney(row.contract_value, overview.currency)}</td>
                        <td className="px-3 py-3">{formatDate(row.renewal_date)}</td>
                        <td className="px-3 py-3">{row.health_score}%</td>
                        <td className="px-3 py-3">{row.customer_owner}</td>
                        <td className="px-3 py-3">
                          <StatusPill
                            label={labels.expansion[row.expansion_opportunity]}
                            className={EXPANSION_BADGES[row.expansion_opportunity]}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill
                            label={labels.enterpriseStatuses[row.status] ?? row.status}
                            className={
                              ENTERPRISE_STATUS_BADGES[row.status] ?? ENTERPRISE_STATUS_BADGES.current
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.failedInsights}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.severity}</th>
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.provider}</th>
                    <th className="px-3 py-2">{labels.table.failureReason}</th>
                    <th className="px-3 py-2">{labels.table.retryCount}</th>
                    <th className="px-3 py-2">{labels.table.amountAffected}</th>
                    <th className="px-3 py-2">{labels.table.recommendedAction}</th>
                    <th className="px-3 py-2">{labels.table.assignedOwner}</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.failed.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    derived.failed.map((row, index) => (
                      <tr key={`${row.customer}-${index}`} className="border-b border-gray-50">
                        <td className="px-3 py-3">
                          <StatusPill
                            label={labels.severities[row.severity]}
                            className={FAILURE_SEVERITY_BADGES[row.severity]}
                          />
                        </td>
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">
                          {labels.providers[row.provider as keyof typeof labels.providers] ??
                            row.provider}
                        </td>
                        <td className="px-3 py-3">{row.failure_reason}</td>
                        <td className="px-3 py-3">{row.retry_count}</td>
                        <td className="px-3 py-3">
                          {formatMoney(row.amount_affected, overview.currency)}
                        </td>
                        <td className="px-3 py-3">{row.recommended_action}</td>
                        <td className="px-3 py-3">{row.assigned_owner}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <section className={SECTION_CARD}>
        <h2 className="font-semibold text-gray-900">{labels.sections.exports}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format}
              type="button"
              disabled={exporting !== null}
              onClick={() => void handleExport(format)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:opacity-50"
            >
              {exporting === format
                ? labels.exports.exporting
                : labels.exports[EXPORT_LABEL_KEYS[format]]}
            </button>
          ))}
        </div>
      </section>

      {center.has_activity ? (
        <section className={EXECUTIVE_CARD}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {labels.sections.executiveInsights}
          </h2>
          {derived.insights.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">{labels.insights.empty}</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {derived.insights.map((insight) => (
                <li
                  key={insight.id}
                  className="rounded-xl border border-zinc-100 bg-white/80 px-5 py-4"
                >
                  <p className="text-sm font-medium text-zinc-900">{insight.observation}</p>
                  {insight.recommended_action ? (
                    <p className="mt-2 text-sm text-zinc-600">
                      <span className="font-medium">{labels.insights.recommendedAction}:</span>{" "}
                      {insight.recommended_action}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6">
        <h2 className="font-semibold text-gray-900">{labels.sections.forecasting}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.forecasting.futureNote}</p>
      </section>
    </div>
  );
}
