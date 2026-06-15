"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PaymentProviderLogo } from "@/components/shared/payment-providers/PaymentProviderLogo";
import {
  buildAnalyticsFilterQuery,
  CHART_BAR_CLASS,
  ENTERPRISE_STATUS_BADGES,
  parsePaymentAnalyticsCenter,
  type ChartRange,
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

function formatMoney(value: number, currency = "NOK"): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function RevenueChart({
  data,
  labels,
}: {
  data: RevenuePoint[];
  labels: PaymentAnalyticsLabels;
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
              title={`${formatDate(point.date)}: ${formatMoney(point.revenue)}`}
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

function DistributionChart({
  center,
  labels,
}: {
  center: PaymentAnalyticsCenter;
  labels: PaymentAnalyticsLabels;
}) {
  const colors = ["bg-indigo-500", "bg-sky-500", "bg-violet-500", "bg-teal-500"];

  return (
    <div className="space-y-3">
      {center.provider_distribution.map((item, index) => (
        <div key={item.provider_key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">
              {labels.providers[item.provider_key]}
            </span>
            <span className="text-gray-600">
              {item.percentage}% · {formatMoney(item.revenue)}
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
  );
}

export function PaymentAnalyticsPanel({ labels, backHref }: PaymentAnalyticsPanelProps) {
  const [center, setCenter] = useState<PaymentAnalyticsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState<ChartRange>("7d");
  const [exporting, setExporting] = useState<string | null>(null);
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

  const chartData = useMemo(() => {
    if (!center) return [];
    if (chartRange === "7d") return center.revenue_over_time.last_7_days;
    if (chartRange === "30d") return center.revenue_over_time.last_30_days;
    return center.revenue_over_time.last_12_months;
  }, [center, chartRange]);

  const handleExport = async (format: "csv" | "xlsx" | "pdf") => {
    setExporting(format);
    try {
      const query = buildAnalyticsFilterQuery(filters);
      const res = await fetch(`/api/payment-analytics/export?format=${format}${query ? query.replace("?", "&") : ""}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `payment-analytics.${format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : "csv"}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  };

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview } = center;

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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.dateFrom}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.date_from?.slice(0, 10) ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  date_from: e.target.value ? `${e.target.value}T00:00:00.000Z` : undefined,
                }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.dateTo}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.date_to?.slice(0, 10) ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  date_to: e.target.value ? `${e.target.value}T23:59:59.000Z` : undefined,
                }))
              }
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
          <section>
            <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard
                label={labels.overview.revenueToday}
                value={formatMoney(overview.revenue_today, overview.currency)}
              />
              <OverviewCard
                label={labels.overview.revenueMonth}
                value={formatMoney(overview.revenue_this_month, overview.currency)}
              />
              <OverviewCard
                label={labels.overview.activeSubscriptions}
                value={overview.active_subscriptions}
              />
              <OverviewCard
                label={labels.overview.failedPayments}
                value={overview.failed_payments}
              />
              <OverviewCard
                label={labels.overview.arpc}
                value={formatMoney(overview.average_revenue_per_customer, overview.currency)}
              />
              <OverviewCard
                label={labels.overview.churnedSubscriptions}
                value={overview.churned_subscriptions}
              />
            </dl>
          </section>

          <section>
            <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.providerBreakdown}</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {center.provider_breakdown.map((provider) => (
                <article
                  key={provider.provider_key}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <PaymentProviderLogo
                      provider={provider.provider_key as PaymentProviderKey}
                      alt={labels.providers[provider.provider_key]}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {labels.providers[provider.provider_key]}
                    </h3>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-gray-500">{labels.provider.revenue30d}</dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {formatMoney(provider.revenue_30d)}
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
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold text-gray-900">{labels.sections.revenueOverTime}</h2>
                <div className="flex gap-2">
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
              <div className="mt-6">
                <RevenueChart data={chartData} labels={labels} />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">{labels.sections.providerDistribution}</h2>
              <div className="mt-6">
                <DistributionChart center={center} labels={labels} />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.segments}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 px-4 py-4">
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  {labels.segments.selfService}
                </dt>
                <dd className="mt-2 text-xl font-semibold text-gray-900">
                  {formatMoney(center.segments.self_service, center.segments.currency)}
                </dd>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-4">
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  {labels.segments.enterprise}
                </dt>
                <dd className="mt-2 text-xl font-semibold text-gray-900">
                  {formatMoney(center.segments.enterprise, center.segments.currency)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.topEnterprise}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.revenue}</th>
                    <th className="px-3 py-2">{labels.table.openInvoices}</th>
                    <th className="px-3 py-2">{labels.table.lastPayment}</th>
                    <th className="px-3 py-2">{labels.table.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.top_enterprise_customers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.top_enterprise_customers.map((row) => (
                      <tr key={row.customer} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{formatMoney(row.revenue)}</td>
                        <td className="px-3 py-3">{row.open_invoices}</td>
                        <td className="px-3 py-3">{formatDate(row.last_payment)}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                              ENTERPRISE_STATUS_BADGES[row.status] ??
                              ENTERPRISE_STATUS_BADGES.current
                            }`}
                          >
                            {labels.enterpriseStatuses[row.status] ?? row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.failedInsights}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.provider}</th>
                    <th className="px-3 py-2">{labels.table.failureReason}</th>
                    <th className="px-3 py-2">{labels.table.retryCount}</th>
                    <th className="px-3 py-2">{labels.table.recommendedAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.failed_payment_insights.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.failed_payment_insights.map((row, index) => (
                      <tr key={`${row.customer}-${index}`} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">
                          {labels.providers[row.provider as keyof typeof labels.providers] ??
                            row.provider}
                        </td>
                        <td className="px-3 py-3">{row.failure_reason}</td>
                        <td className="px-3 py-3">{row.retry_count}</td>
                        <td className="px-3 py-3">{row.recommended_action}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.exports}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {(["csv", "xlsx", "pdf"] as const).map((format) => (
            <button
              key={format}
              type="button"
              disabled={exporting !== null}
              onClick={() => void handleExport(format)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:opacity-50"
            >
              {exporting === format
                ? labels.exports.exporting
                : format === "xlsx"
                  ? labels.exports.excel
                  : labels.exports[format]}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
