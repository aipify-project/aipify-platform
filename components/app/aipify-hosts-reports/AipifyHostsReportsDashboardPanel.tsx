"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsReportExportResult,
  parseAipifyHostsReportScheduleResult,
  parseAipifyHostsReportsDashboard,
  type HostsReportsDashboard,
} from "@/lib/aipify/aipify-hosts-reports";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">{value}</dd>
    </div>
  );
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function TrendBars({
  items,
  suffix = "",
  labels,
}: {
  items: Array<{ period: string; value: number }>;
  suffix?: string;
  labels: Record<string, string>;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-6 text-center">
        <p className="text-sm font-medium text-gray-800">{labels.emptyTrendTitle}</p>
        <p className="mt-1 text-sm text-gray-500">{labels.emptyTrendMessage}</p>
      </div>
    );
  }
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex items-end gap-2 sm:gap-3">
      {items.map((item) => (
        <div key={item.period} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-700">
            {item.value}
            {suffix}
          </span>
          <div
            className="w-full rounded-t-md bg-indigo-500/80"
            style={{ height: `${Math.max(12, (item.value / max) * 80)}px` }}
          />
          <span className="text-xs text-gray-500">{item.period}</span>
        </div>
      ))}
    </div>
  );
}

export function AipifyHostsReportsDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsReportsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("last_30_days");
  const [exportCategory, setExportCategory] = useState("occupancy");
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [scheduleCategory, setScheduleCategory] = useState("revenue");
  const [scheduleCadence, setScheduleCadence] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [scheduleDelivery, setScheduleDelivery] = useState<"email" | "dashboard">("dashboard");
  const [scheduleFormat, setScheduleFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async (filter: string) => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/aipify/aipify-hosts/reports/dashboard?filter=${encodeURIComponent(filter)}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsReportsDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(activeFilter);
  }, [activeFilter, load]);

  const handleExport = async () => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/reports/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: exportCategory, format: exportFormat, filter: activeFilter }),
    });
    const result = parseAipifyHostsReportExportResult(await res.json());
    setBusy(false);
    if (result.status === "completed") {
      setActionMessage(result.message ?? labels.exportSuccess);
      await load(activeFilter);
    } else {
      setActionMessage(labels.exportFailed);
    }
  };

  const handleSchedule = async () => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/reports/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: scheduleCategory,
        cadence: scheduleCadence,
        delivery_method: scheduleDelivery,
        export_format: scheduleFormat,
      }),
    });
    const result = parseAipifyHostsReportScheduleResult(await res.json());
    setBusy(false);
    if (result.status === "active") {
      setActionMessage(labels.scheduleSuccess);
      await load(activeFilter);
    } else {
      setActionMessage(labels.scheduleFailed);
    }
  };

  if (loading && !dashboard) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load(activeFilter) }}
      />
    );
  }

  const m = dashboard.executive_metrics;
  const w = dashboard.widgets;
  const hasData = m.occupancy_rate_pct > 0 || dashboard.property_comparison.length > 0;
  const currency = m.currency || "NOK";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-indigo-900">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/app/aipify-hosts"
            className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50"
          >
            {labels.backToHosts}
          </Link>
          <Link
            href="/app/aipify-hosts/knowledge"
            className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50"
          >
            {labels.exploreReportingGuidance}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">{labels.reportFilters}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
                activeFilter === f.key
                  ? "bg-indigo-700 text-white ring-indigo-700"
                  : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.executiveMetrics}</h2>
        {!hasData ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
            <p className="text-sm font-medium text-gray-800">{labels.emptyMetricsTitle}</p>
            <p className="mt-1 text-sm text-gray-500">{labels.emptyMetricsMessage}</p>
          </div>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label={labels.occupancyRate} value={`${m.occupancy_rate_pct}%`} />
            <MetricCard label={labels.revenueThisMonth} value={formatCurrency(m.revenue_this_month, currency)} />
            <MetricCard label={labels.revenueYtd} value={formatCurrency(m.revenue_ytd, currency)} />
            <MetricCard label={labels.averageLengthOfStay} value={`${m.average_length_of_stay} ${labels.nights}`} />
            <MetricCard label={labels.guestSatisfaction} value={m.guest_satisfaction_score.toFixed(1)} />
            <MetricCard label={labels.activeIncidents} value={m.active_incidents} />
            <MetricCard label={labels.openMaintenanceTasks} value={m.open_maintenance_tasks} />
            <MetricCard label={labels.teamCompletionRate} value={`${m.team_completion_rate_pct}%`} />
          </dl>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.executiveSummary}</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-emerald-800">{labels.operationalHighlights}</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {dashboard.executive_summary.operational_highlights.map((item) => (
                <li key={item} className="rounded-lg bg-emerald-50/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800">{labels.areasRequiringAttention}</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {dashboard.executive_summary.areas_requiring_attention.map((item) => (
                <li key={item} className="rounded-lg bg-amber-50/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-800">{labels.improvementOpportunities}</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {dashboard.executive_summary.improvement_opportunities.map((item) => (
                <li key={item} className="rounded-lg bg-indigo-50/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.topPerformingProperties}</h2>
          {w.top_performing_properties.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{labels.emptyWidgetsMessage}</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {w.top_performing_properties.map((p) => (
                <li key={String(p.name)} className="flex justify-between py-2 text-sm">
                  <span className="font-medium text-gray-900">{String(p.name)}</span>
                  <span className="text-gray-600">
                    {formatCurrency(Number(p.revenue ?? 0), currency)} · {Number(p.occupancy_pct ?? 0)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.propertiesRequiringAttention}</h2>
          {w.properties_requiring_attention.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{labels.emptyWidgetsMessage}</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {w.properties_requiring_attention.map((p) => (
                <li key={String(p.name)} className="py-2 text-sm">
                  <span className="font-medium text-gray-900">{String(p.name)}</span>
                  <p className="text-gray-600">{String(p.reason ?? "")}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.revenueTrends}</h2>
          <div className="mt-4">
            <TrendBars items={w.revenue_trends} labels={labels} />
          </div>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.occupancyTrends}</h2>
          <div className="mt-4">
            <TrendBars items={w.occupancy_trends} suffix="%" labels={labels} />
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.teamProductivity}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <MetricCard label={labels.teamCompletionRate} value={`${w.team_productivity.completion_rate_pct}%`} />
          <MetricCard label={labels.tasksCompleted} value={w.team_productivity.tasks_completed} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.propertyComparison}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.propertyComparisonDescription}</p>
        {dashboard.property_comparison.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-6 text-center">
            <p className="text-sm font-medium text-gray-800">{labels.emptyComparisonTitle}</p>
            <p className="mt-1 text-sm text-gray-500">{labels.emptyComparisonMessage}</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-2">{labels.property}</th>
                  <th className="px-3 py-2">{labels.revenue}</th>
                  <th className="px-3 py-2">{labels.occupancy}</th>
                  <th className="px-3 py-2">{labels.incidents}</th>
                  <th className="px-3 py-2">{labels.guestSatisfaction}</th>
                  <th className="px-3 py-2">{labels.maintenanceBurden}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.property_comparison.map((row) => (
                  <tr key={row.property_id} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-medium text-gray-900">{row.property_name}</td>
                    <td className="px-3 py-2 text-gray-700">{formatCurrency(row.revenue, currency)}</td>
                    <td className="px-3 py-2 text-gray-700">{row.occupancy_pct}%</td>
                    <td className="px-3 py-2 text-gray-700">{row.incidents}</td>
                    <td className="px-3 py-2 text-gray-700">{row.guest_satisfaction.toFixed(1)}</td>
                    <td className="px-3 py-2 text-gray-700">{row.maintenance_burden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.reportCategories}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dashboard.report_categories.map((cat) => (
            <div key={cat.key} className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
              <p className="font-medium text-gray-900">{cat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.exportReport}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.exportDescription}</p>
          <div className="mt-4 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">{labels.reportCategory}</span>
              <select
                value={exportCategory}
                onChange={(e) => setExportCategory(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                {dashboard.report_categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">{labels.exportFormat}</span>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as "pdf" | "excel" | "csv")}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                {dashboard.export_formats.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleExport()}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {busy ? labels.exporting : labels.exportAction}
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.scheduleReport}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.scheduleDescription}</p>
          <div className="mt-4 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">{labels.reportCategory}</span>
              <select
                value={scheduleCategory}
                onChange={(e) => setScheduleCategory(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                {dashboard.report_categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">{labels.cadence}</span>
                <select
                  value={scheduleCadence}
                  onChange={(e) => setScheduleCadence(e.target.value as "daily" | "weekly" | "monthly")}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  {dashboard.schedule_cadences.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">{labels.deliveryMethod}</span>
                <select
                  value={scheduleDelivery}
                  onChange={(e) => setScheduleDelivery(e.target.value as "email" | "dashboard")}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  {dashboard.delivery_methods.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSchedule()}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {busy ? labels.scheduling : labels.scheduleAction}
            </button>
          </div>
        </article>
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">{actionMessage}</p>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.scheduledReports}</h2>
        {dashboard.scheduled_reports.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-6 text-center">
            <p className="text-sm font-medium text-gray-800">{labels.emptyScheduledTitle}</p>
            <p className="mt-1 text-sm text-gray-500">{labels.emptyScheduledMessage}</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {dashboard.scheduled_reports.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-gray-900">{s.report_category.replace(/_/g, " ")}</span>
                <span className="text-gray-600">
                  {s.cadence} · {s.delivery_method} · {s.export_format.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
