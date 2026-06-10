"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AipifyEmptyState } from "@/components/branding";
import {
  MetricsBarChart,
  MetricsDonutChart,
  MetricsLineChart,
  MetricsSparkline,
} from "@/components/platform/metrics/MetricsCharts";
import { createClient } from "@/lib/supabase/client";
import {
  buildAlerts,
  buildCustomerGrowthSeries,
  buildMrrTrendSeries,
  buildRecommendations,
  estimateActiveCustomerTrend,
  estimateMrrGrowthPercent,
  formatMetricCurrency,
  formatMetricNumber,
  getSystemHealth,
  getTrialsEndingSoon,
} from "@/lib/platform/metrics-dashboard";
import type { PlatformMetrics } from "@/lib/platform/types";

type PlatformMetricsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    currency: string;
    seconds: string;
    percent: string;
    pulseLabel: string;
    executive: {
      title: string;
      mrr: string;
      mrrSubtitle: string;
      activeCustomers: string;
      activeSubtitle: string;
      trialsEnding: string;
      trialsSubtitle: string;
      systemHealth: string;
      healthHealthy: string;
      healthStable: string;
      healthAttention: string;
      trendUp: string;
      trendFlat: string;
      last30Days: string;
    };
    alerts: {
      title: string;
      trialsEnding: string;
      overdueInvoice: string;
      failedSync: string;
      followUp: string;
      none: string;
    };
    revenueGrowth: {
      title: string;
      mrrChart: string;
      mrrChartHint: string;
      customerGrowth: string;
      customerGrowthHint: string;
      trialConversion: string;
      trialConversionHint: string;
      monthLabels: string[];
    };
    customerInsights: {
      title: string;
      total: string;
      active: string;
      trial: string;
      paused: string;
      cancelled: string;
      overdue: string;
    };
    operations: {
      title: string;
      supportHandled: string;
      automatedTasks: string;
      aiRecommendations: string;
      avgResponseTime: string;
    };
    installations: {
      title: string;
      total: string;
      active: string;
      failed: string;
      average: string;
      mostActive: string;
      mostActiveValue: string;
    };
    recommendations: {
      title: string;
      contactTrials: string;
      churnRisk: string;
      businessPlan: string;
      failedInstall: string;
      retentionStrong: string;
    };
  };
};

function ExecutiveIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 text-violet-600 ring-1 ring-violet-100">
      {children}
    </span>
  );
}

function TrendBadge({
  value,
  labels,
}: {
  value: number;
  labels: { trendUp: string; trendFlat: string; last30Days: string };
}) {
  const isUp = value > 0;
  return (
    <p className={`mt-2 text-sm font-medium ${isUp ? "text-emerald-600" : "text-gray-500"}`}>
      {isUp ? `↑ ${value}${labels.trendUp}` : labels.trendFlat} · {labels.last30Days}
    </p>
  );
}

function SectionHeading({
  id,
  title,
  hint,
}: {
  id?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-lg font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

function AlertTone({
  tone,
  children,
}: {
  tone: "info" | "warning" | "critical";
  children: ReactNode;
}) {
  const toneClass =
    tone === "critical"
      ? "border-rose-100 bg-rose-50/70 text-rose-900"
      : tone === "warning"
        ? "border-amber-100 bg-amber-50/80 text-amber-900"
        : "border-blue-100 bg-blue-50/70 text-blue-900";

  return (
    <li className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${toneClass}`}>
      {children}
    </li>
  );
}

export default function PlatformMetricsPanel({ labels }: PlatformMetricsPanelProps) {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_metrics");

      if (!cancelled) {
        setMetrics(error || !data ? null : (data as PlatformMetrics));
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const dashboard = useMemo(() => {
    if (!metrics) return null;

    const mrrTrend = estimateMrrGrowthPercent(metrics);
    const activeTrend = estimateActiveCustomerTrend(metrics);
    const health = getSystemHealth(metrics);
    const trialsEnding = getTrialsEndingSoon(metrics);

    return {
      mrrTrend,
      activeTrend,
      health,
      trialsEnding,
      mrrSeries: buildMrrTrendSeries(metrics.revenue.mrr),
      growthSeries: buildCustomerGrowthSeries(
        metrics.growth.new_customers_30d,
        metrics.customers.total
      ),
      alerts: buildAlerts(metrics, {
        trialsEnding: (count) => labels.alerts.trialsEnding.replace("{count}", String(count)),
        overdueInvoice: (count) =>
          labels.alerts.overdueInvoice.replace("{count}", String(count)),
        failedSync: (count) => labels.alerts.failedSync.replace("{count}", String(count)),
        followUp: (count) => labels.alerts.followUp.replace("{count}", String(count)),
        none: labels.alerts.none,
      }),
      recommendations: buildRecommendations(metrics, {
        contactTrials: (count) =>
          labels.recommendations.contactTrials.replace("{count}", String(count)),
        churnRisk: (count) =>
          labels.recommendations.churnRisk.replace("{count}", String(count)),
        businessPlan: labels.recommendations.businessPlan,
        failedInstall: (count) =>
          labels.recommendations.failedInstall.replace("{count}", String(count)),
        retentionStrong: (rate) =>
          labels.recommendations.retentionStrong.replace("{rate}", String(rate)),
      }),
    };
  }, [labels, metrics]);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!metrics || !dashboard) {
    return <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />;
  }

  const healthLabel =
    dashboard.health.label === "healthy"
      ? labels.executive.healthHealthy
      : dashboard.health.label === "stable"
        ? labels.executive.healthStable
        : labels.executive.healthAttention;

  const customerStatuses = [
    { key: "total", value: metrics.customers.total, label: labels.customerInsights.total },
    { key: "active", value: metrics.customers.active, label: labels.customerInsights.active },
    { key: "trial", value: metrics.customers.trial, label: labels.customerInsights.trial },
    { key: "paused", value: metrics.customers.paused, label: labels.customerInsights.paused },
    {
      key: "cancelled",
      value: metrics.customers.cancelled,
      label: labels.customerInsights.cancelled,
    },
    { key: "overdue", value: metrics.customers.overdue, label: labels.customerInsights.overdue },
  ];

  const growthBars = labels.revenueGrowth.monthLabels.map((label, index) => ({
    label,
    value: dashboard.growthSeries[index] ?? 0,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 max-w-3xl text-base text-gray-500">{labels.subtitle}</p>
      </header>

      <section aria-labelledby="metrics-executive">
        <SectionHeading id="metrics-executive" title={labels.executive.title} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/40 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <ExecutiveIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </ExecutiveIcon>
              <MetricsSparkline data={dashboard.mrrSeries} ariaLabel={labels.executive.mrr} />
            </div>
            <p className="mt-5 text-sm font-medium text-gray-500">{labels.executive.mrr}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              {formatMetricCurrency(metrics.revenue.mrr, labels.currency)}
            </p>
            <p className="mt-1 text-sm text-gray-500">{labels.executive.mrrSubtitle}</p>
            <TrendBadge value={dashboard.mrrTrend} labels={labels.executive} />
          </article>

          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <ExecutiveIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </ExecutiveIcon>
              <MetricsSparkline
                data={dashboard.growthSeries}
                ariaLabel={labels.executive.activeCustomers}
              />
            </div>
            <p className="mt-5 text-sm font-medium text-gray-500">
              {labels.executive.activeCustomers}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              {formatMetricNumber(metrics.customers.active)}
            </p>
            <p className="mt-1 text-sm text-gray-500">{labels.executive.activeSubtitle}</p>
            <TrendBadge value={dashboard.activeTrend} labels={labels.executive} />
          </article>

          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <ExecutiveIcon>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </ExecutiveIcon>
            <p className="mt-5 text-sm font-medium text-gray-500">{labels.executive.trialsEnding}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              {formatMetricNumber(dashboard.trialsEnding)}
            </p>
            <p className="mt-1 text-sm text-gray-500">{labels.executive.trialsSubtitle}</p>
          </article>

          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <ExecutiveIcon>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </ExecutiveIcon>
            <p className="mt-5 text-sm font-medium text-gray-500">{labels.executive.systemHealth}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{healthLabel}</p>
            <p className="mt-1 text-sm text-gray-500">
              {dashboard.health.score}
              {labels.percent} platform score
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="metrics-alerts">
        <SectionHeading id="metrics-alerts" title={labels.alerts.title} />
        <ul className="grid gap-3 md:grid-cols-2">
          {dashboard.alerts.map((alert) => (
            <AlertTone key={alert.id} tone={alert.tone}>
              {alert.message}
            </AlertTone>
          ))}
        </ul>
      </section>

      <section aria-labelledby="metrics-revenue">
        <SectionHeading id="metrics-revenue" title={labels.revenueGrowth.title} />
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">{labels.revenueGrowth.mrrChart}</h3>
            <p className="mt-1 text-sm text-gray-500">{labels.revenueGrowth.mrrChartHint}</p>
            <div className="mt-6">
              <MetricsLineChart
                data={dashboard.mrrSeries}
                labels={labels.revenueGrowth.monthLabels}
                ariaLabel={labels.revenueGrowth.mrrChart}
              />
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
              {labels.revenueGrowth.customerGrowth}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{labels.revenueGrowth.customerGrowthHint}</p>
            <div className="mt-6">
              <MetricsBarChart data={growthBars} ariaLabel={labels.revenueGrowth.customerGrowth} />
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {labels.revenueGrowth.trialConversion}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {labels.revenueGrowth.trialConversionHint}
                </p>
              </div>
              <MetricsDonutChart
                value={metrics.revenue.trial_to_paid_conversion_rate}
                label={labels.revenueGrowth.trialConversion}
                ariaLabel={labels.revenueGrowth.trialConversion}
              />
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="metrics-customers">
        <SectionHeading id="metrics-customers" title={labels.customerInsights.title} />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {customerStatuses.map((item) => (
              <div
                key={item.key}
                className="rounded-xl bg-gray-50/80 px-4 py-3 text-center ring-1 ring-gray-100"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatMetricNumber(item.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section aria-labelledby="metrics-operations">
          <SectionHeading id="metrics-operations" title={labels.operations.title} />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: labels.operations.supportHandled,
                value: formatMetricNumber(metrics.ai_activity.support_requests_handled),
              },
              {
                label: labels.operations.automatedTasks,
                value: formatMetricNumber(metrics.ai_activity.automated_tasks_completed),
              },
              {
                label: labels.operations.aiRecommendations,
                value: formatMetricNumber(metrics.ai_activity.ai_recommendations_generated),
              },
              {
                label: labels.operations.avgResponseTime,
                value: `${metrics.ai_activity.average_assistant_response_time_seconds} ${labels.seconds}`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-xs font-medium text-gray-500">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="metrics-installations">
          <SectionHeading id="metrics-installations" title={labels.installations.title} />
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { label: labels.installations.total, value: metrics.installations.total },
                { label: labels.installations.active, value: metrics.installations.active },
                { label: labels.installations.failed, value: metrics.installations.failed },
                {
                  label: labels.installations.average,
                  value: metrics.installations.average_per_customer,
                },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900">
                    {typeof item.value === "number" && item.value % 1 !== 0
                      ? item.value.toFixed(1)
                      : formatMetricNumber(Number(item.value))}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 rounded-xl bg-violet-50/70 px-4 py-3 ring-1 ring-violet-100">
              <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
                {labels.installations.mostActive}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {labels.installations.mostActiveValue}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section aria-labelledby="metrics-recommendations">
        <article className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-blue-50/50 p-6 shadow-sm">
          <SectionHeading id="metrics-recommendations" title={labels.recommendations.title} />
          <ul className="space-y-3">
            {dashboard.recommendations.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm leading-relaxed text-gray-700 ring-1 ring-violet-100"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
                {item.message}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
