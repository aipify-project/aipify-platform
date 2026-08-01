"use client";

import { useEffect, useState } from "react";
import {
  formatControlPlaneMetric,
  parsePlatformControlPlaneOverview,
  type PlatformControlPlaneLabels,
  type PlatformControlPlaneOverview,
} from "@/lib/platform-control-plane";
import { AipifyLoader } from "@/components/ui/aipify-loader";

type Props = {
  labels: PlatformControlPlaneLabels;
};

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "danger" | "purple";
}) {
  const styles = {
    neutral: "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50",
    success: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-800/70 dark:bg-emerald-950/35",
    warning: "border-amber-200 bg-amber-50/70 dark:border-amber-800/70 dark:bg-amber-950/35",
    danger: "border-rose-200 bg-rose-50/70 dark:border-rose-800/70 dark:bg-rose-950/35",
    purple: "border-violet-200 bg-violet-50/70 dark:border-violet-800/70 dark:bg-violet-950/35",
  }[tone];

  return (
    <div className={`rounded-xl border px-3.5 py-3 shadow-sm ${styles}`}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1.5 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}

function toneForCount(value: number | null, elevated: "warning" | "danger" = "warning") {
  if (value === null) return "neutral" as const;
  if (value === 0) return "success" as const;
  return elevated;
}

export function PlatformControlPlaneMetricsStrip({ labels }: Props) {
  const [overview, setOverview] = useState<PlatformControlPlaneOverview | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/platform-control-plane/overview", { cache: "no-store" });
        if (!res.ok) throw new Error("overview_failed");
        const json = await res.json();
        if (!cancelled) {
          setOverview(parsePlatformControlPlaneOverview(json?.data ?? json));
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700">
        <AipifyLoader centered />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div
        className="rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
        role="alert"
      >
        {labels.metrics.updateFailed}
      </div>
    );
  }

  const metricLabels = { noData: labels.metrics.noData, error: labels.metrics.updateFailed };
  const healthLabel =
    overview.operations.systemHealth === null
      ? labels.health.noSource
      : labels.health[overview.operations.systemHealth];

  return (
    <section className="space-y-3" aria-label={labels.metrics.freshness}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {labels.metrics.freshness}:{" "}
          <time dateTime={overview.generatedAt}>
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(overview.generatedAt))}
          </time>
        </p>
        {overview.freshness.partial ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
            {labels.metrics.partial}
          </span>
        ) : null}
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        <MetricTile
          label={labels.metrics.organizationsTotal}
          value={formatControlPlaneMetric(overview.customers.organizationsTotal, metricLabels)}
          tone="purple"
        />
        <MetricTile
          label={labels.metrics.activeSubscriptions}
          value={formatControlPlaneMetric(overview.customers.activeSubscriptions, metricLabels)}
          tone="success"
        />
        <MetricTile
          label={labels.metrics.requiringAttention}
          value={formatControlPlaneMetric(overview.customers.requiringAttention, metricLabels)}
          tone={toneForCount(overview.customers.requiringAttention)}
        />
        <MetricTile
          label={labels.metrics.openSupport}
          value={formatControlPlaneMetric(overview.customers.openSupport, metricLabels)}
          tone={toneForCount(overview.customers.openSupport)}
        />
        <MetricTile
          label={labels.metrics.paymentPastDue}
          value={formatControlPlaneMetric(overview.finance.paymentPastDue, metricLabels)}
          tone={toneForCount(overview.finance.paymentPastDue, "danger")}
        />
        <MetricTile
          label={labels.metrics.outstandingInvoices}
          value={formatControlPlaneMetric(overview.finance.outstandingInvoices, metricLabels)}
          tone="neutral"
        />
        <MetricTile
          label={labels.metrics.failedPayments}
          value={formatControlPlaneMetric(overview.finance.failedPayments, metricLabels)}
          tone="neutral"
        />
        <MetricTile
          label={labels.metrics.mrr}
          value={formatControlPlaneMetric(overview.finance.monthlyRecurringRevenue, metricLabels)}
          tone="neutral"
        />
        <MetricTile
          label={labels.metrics.activePartners}
          value={formatControlPlaneMetric(overview.partners.activePartners, metricLabels)}
          tone="purple"
        />
        <MetricTile
          label={labels.metrics.pendingPartnerInvoices}
          value={formatControlPlaneMetric(overview.partners.pendingPartnerInvoices, metricLabels)}
          tone={toneForCount(overview.partners.pendingPartnerInvoices)}
        />
        <MetricTile label={labels.metrics.systemHealth} value={healthLabel} tone="neutral" />
        <MetricTile
          label={labels.metrics.openIncidents}
          value={formatControlPlaneMetric(overview.operations.openIncidents, metricLabels)}
          tone="neutral"
        />
        <MetricTile
          label={labels.metrics.pendingApprovals}
          value={formatControlPlaneMetric(overview.operations.pendingApprovals, metricLabels)}
          tone="neutral"
        />
      </dl>
    </section>
  );
}
