"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildExecutiveOperationsFilterQuery,
  HEALTH_STATUS_BADGES,
  parseExecutiveOperationsCenter,
  PRIORITY_BADGES,
  SYSTEM_STATUS_BADGES,
  type ExecutiveOperationsCenter,
  type ExecutiveOperationsFilters,
  type ExecutiveOperationsLabels,
} from "@/lib/executive-operations-center";

type ExecutiveOperationsCenterPanelProps = {
  labels: ExecutiveOperationsLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function formatMoney(value: number, currency = "NOK"): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
}

function systemStatusLabel(
  status: string,
  labels: ExecutiveOperationsLabels
): string {
  return labels.systemStatuses[status] ?? status;
}

export function ExecutiveOperationsCenterPanel({
  labels,
  backHref,
}: ExecutiveOperationsCenterPanelProps) {
  const [center, setCenter] = useState<ExecutiveOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExecutiveOperationsFilters>({ period: "30d" });
  const [draftPeriod, setDraftPeriod] = useState<ExecutiveOperationsFilters["period"]>("30d");

  const load = useCallback(async (activeFilters: ExecutiveOperationsFilters) => {
    setLoading(true);
    const query = buildExecutiveOperationsFilterQuery(activeFilters);
    const res = await fetch(`/api/executive-operations-center/overview${query}`);
    if (res.ok) setCenter(parseExecutiveOperationsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, string>) => {
      setBusyId(payload.action_id ?? payload.alert_id ?? "busy");
      try {
        const res = await fetch("/api/executive-operations-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) await load(filters);
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

  if (loading && !center) {
    return <p className="p-6 text-sm text-zinc-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview, organizational_health: orgHealth, growth, system } = center;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
      </div>

      {center.no_actions_required && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          {labels.emptyState}
        </div>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.filters}</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-sm">
            <span className="text-xs text-zinc-500">{labels.filters.period}</span>
            <select
              className="mt-1 block rounded-lg border border-zinc-200 px-3 py-2"
              value={draftPeriod ?? "30d"}
              onChange={(e) =>
                setDraftPeriod(e.target.value as ExecutiveOperationsFilters["period"])
              }
            >
              {Object.entries(labels.periods).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setFilters({ period: draftPeriod || "30d" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.filters.apply}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-zinc-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.activeCustomers} value={overview.active_customers} />
          <OverviewCard
            label={labels.overview.mrr}
            value={formatMoney(overview.monthly_recurring_revenue)}
          />
          <OverviewCard label={labels.overview.customerGrowth} value={overview.customer_growth} />
          <OverviewCard
            label={labels.overview.systemHealth}
            value={`${overview.system_health}%`}
          />
          <OverviewCard
            label={labels.overview.criticalIssues}
            value={overview.open_critical_issues}
          />
          <OverviewCard
            label={labels.overview.actionsRequired}
            value={overview.executive_actions_required}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sinceLastLogin}</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-700">
          {center.executive_summary.length === 0 ? (
            <li className="text-zinc-500">{labels.emptyState}</li>
          ) : (
            center.executive_summary.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                {line}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.actions}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-3 py-2">{labels.table.action}</th>
                <th className="px-3 py-2">{labels.table.category}</th>
                <th className="px-3 py-2">{labels.table.priority}</th>
                <th className="px-3 py-2">{labels.table.dueDate}</th>
                <th className="px-3 py-2">{labels.table.owner}</th>
                <th className="px-3 py-2">{labels.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {center.actions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-zinc-500">
                    {labels.emptyState}
                  </td>
                </tr>
              ) : (
                center.actions.map((row) => (
                  <tr key={row.id} className="border-b border-zinc-50">
                    <td className="px-3 py-3 font-medium text-zinc-900">{row.action}</td>
                    <td className="px-3 py-3">{labels.categories[row.category]}</td>
                    <td className="px-3 py-3">
                      <StatusPill
                        label={labels.priorities[row.priority]}
                        className={PRIORITY_BADGES[row.priority]}
                      />
                    </td>
                    <td className="px-3 py-3">{formatDate(row.due_date)}</td>
                    <td className="px-3 py-3">{row.owner || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() =>
                            void handleAction({ action: "approve", action_id: row.id })
                          }
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                        >
                          {labels.actions.approve}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() =>
                            void handleAction({ action: "escalate", action_id: row.id })
                          }
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                          {labels.actions.escalate}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() =>
                            void handleAction({ action: "complete_action", action_id: row.id })
                          }
                          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
                        >
                          {labels.actions.complete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.organizationalHealth}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              label: labels.healthMetrics.customer,
              score: orgHealth.customer_health_score,
              status: orgHealth.customer_health_status,
            },
            {
              label: labels.healthMetrics.revenue,
              score: orgHealth.revenue_health_score,
              status: orgHealth.revenue_health_status,
            },
            {
              label: labels.healthMetrics.platform,
              score: orgHealth.platform_stability_score,
              status: orgHealth.platform_stability_status,
            },
            {
              label: labels.healthMetrics.support,
              score: orgHealth.support_performance_score,
              status: orgHealth.support_performance_status,
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-zinc-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {item.label}
              </dt>
              <dd className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xl font-semibold text-zinc-900">{item.score}</span>
                <StatusPill
                  label={labels.healthStatuses[item.status]}
                  className={HEALTH_STATUS_BADGES[item.status]}
                />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.growth}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.growth.newCustomers} value={growth.new_customers_30d} />
          <OverviewCard label={labels.growth.upgrades} value={growth.upgrades_30d} />
          <OverviewCard
            label={labels.growth.expansionRevenue}
            value={formatMoney(growth.expansion_revenue)}
          />
          <OverviewCard label={labels.growth.churnRate} value={`${growth.churn_rate}%`} />
          <OverviewCard
            label={labels.growth.trialConversion}
            value={`${growth.trial_conversion_rate}%`}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.system}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            { label: labels.system.infrastructure, status: system.infrastructure_status },
            { label: labels.system.paymentProvider, status: system.payment_provider_status },
            { label: labels.system.integration, status: system.integration_health },
            { label: labels.system.aiEngine, status: system.ai_engine_status },
            { label: labels.system.notification, status: system.notification_status },
          ].map((item) => (
            <li
              key={item.label}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-zinc-50 px-4 py-3"
            >
              <span className="font-medium text-zinc-900">{item.label}</span>
              <StatusPill
                label={systemStatusLabel(item.status, labels)}
                className={SYSTEM_STATUS_BADGES[item.status] ?? SYSTEM_STATUS_BADGES.operational}
              />
            </li>
          ))}
          <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-zinc-50 px-4 py-3">
            <span className="font-medium text-zinc-900">{labels.system.uptime}</span>
            <span className="text-zinc-700">{system.platform_uptime}%</span>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.alerts}</h2>
        <ul className="mt-4 space-y-3">
          {center.alerts.length === 0 ? (
            <li className="text-sm text-zinc-500">{labels.emptyState}</li>
          ) : (
            center.alerts.map((alert) => (
              <li key={alert.id} className="rounded-lg bg-zinc-50 px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-zinc-900">{alert.title}</span>
                  <StatusPill
                    label={labels.priorities[alert.severity]}
                    className={PRIORITY_BADGES[alert.severity]}
                  />
                </div>
                <p className="mt-1 text-zinc-600">{alert.summary}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {labels.alertTypes[alert.alert_type]} · {formatDate(alert.created_at)}
                </p>
                <button
                  type="button"
                  disabled={busyId === alert.id}
                  onClick={() =>
                    void handleAction({ action: "acknowledge_alert", alert_id: alert.id })
                  }
                  className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  {labels.actions.acknowledge}
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.calendar}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {center.calendar.length === 0 ? (
            <li className="text-zinc-500">{labels.emptyState}</li>
          ) : (
            center.calendar.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-zinc-50 px-4 py-3"
              >
                <div>
                  <span className="font-medium text-zinc-900">{event.title}</span>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {labels.calendarTypes[event.event_type]} · {event.owner}
                  </p>
                </div>
                <span className="text-zinc-600">{formatDate(event.scheduled_at)}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {center.audit.length === 0 ? (
            <li className="text-zinc-500">{labels.emptyState}</li>
          ) : (
            center.audit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-zinc-50 px-4 py-3 text-zinc-700">
                <span className="font-medium text-zinc-900">{entry.summary}</span>
                <span className="mt-1 block text-xs text-zinc-500">
                  {labels.table.event}: {entry.event_type.replace(/_/g, " ")} ·{" "}
                  {formatDate(entry.created_at)}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
