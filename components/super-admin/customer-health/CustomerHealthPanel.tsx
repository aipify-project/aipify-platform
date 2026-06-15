"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildHealthFilterQuery,
  HEALTH_CATEGORY_BADGES,
  TREND_ICONS,
  parseCustomerHealthDashboard,
  type CustomerHealthDashboard,
  type CustomerHealthLabels,
  type HealthFilters,
} from "@/lib/customer-health-early-warning";

type CustomerHealthPanelProps = {
  labels: CustomerHealthLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
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

export function CustomerHealthPanel({ labels, backHref }: CustomerHealthPanelProps) {
  const [dashboard, setDashboard] = useState<CustomerHealthDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<HealthFilters>({});
  const [draftFilters, setDraftFilters] = useState<HealthFilters>({});

  const load = useCallback(async (activeFilters: HealthFilters) => {
    setLoading(true);
    const query = buildHealthFilterQuery(activeFilters);
    const res = await fetch(`/api/customer-health/overview${query}`);
    if (res.ok) setDashboard(parseCustomerHealthDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, string>) => {
      setBusyId(payload.customer_id ?? payload.task_id ?? payload.warning_id ?? "action");
      try {
        const res = await fetch("/api/customer-health/actions", {
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

  if (loading && !dashboard) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!dashboard) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm text-indigo-600 hover:text-indigo-800">
          {labels.back}
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {dashboard.principle}
        </p>
        <p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {dashboard.privacy_note}
        </p>
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {labels.sections.overview}
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <OverviewCard label={labels.overview.healthy} value={dashboard.overview.healthy} />
          <OverviewCard label={labels.overview.stable} value={dashboard.overview.stable} />
          <OverviewCard
            label={labels.overview.attentionNeeded}
            value={dashboard.overview.attention_needed}
          />
          <OverviewCard label={labels.overview.atRisk} value={dashboard.overview.at_risk} />
          <OverviewCard
            label={labels.overview.recoveryOpportunities}
            value={dashboard.overview.recovery_opportunities}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={draftFilters.health_category ?? ""}
            onChange={(e) =>
              setDraftFilters((prev) => ({ ...prev, health_category: e.target.value as HealthFilters["health_category"] }))
            }
          >
            <option value="">{labels.filters.allCategories}</option>
            {Object.entries(labels.healthCategories).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={draftFilters.trend ?? ""}
            onChange={(e) =>
              setDraftFilters((prev) => ({ ...prev, trend: e.target.value as HealthFilters["trend"] }))
            }
          >
            <option value="">{labels.filters.allTrends}</option>
            {Object.entries(labels.trends).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setFilters(draftFilters)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.filters.apply}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.customers}</h2>
        {dashboard.is_empty ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">{labels.table.company}</th>
                  <th className="px-3 py-2">{labels.table.healthScore}</th>
                  <th className="px-3 py-2">{labels.table.trend}</th>
                  <th className="px-3 py-2">{labels.table.lastActivity}</th>
                  <th className="px-3 py-2">{labels.table.subscriptionPlan}</th>
                  <th className="px-3 py-2">{labels.table.supportStatus}</th>
                  <th className="px-3 py-2">{labels.table.assignedOwner}</th>
                  <th className="px-3 py-2">{labels.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.customers.map((customer) => (
                  <tr key={customer.customer_id} className="border-b border-gray-100">
                    <td className="px-3 py-3 font-medium text-gray-900">{customer.company}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{customer.health_score}</span>
                        <StatusPill
                          label={labels.healthCategories[customer.health_category]}
                          className={HEALTH_CATEGORY_BADGES[customer.health_category]}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {TREND_ICONS[customer.trend]} {labels.trends[customer.trend]}
                    </td>
                    <td className="px-3 py-3 text-gray-600">{formatDate(customer.last_activity)}</td>
                    <td className="px-3 py-3">{customer.subscription_plan}</td>
                    <td className="px-3 py-3">{labels.supportStatuses[customer.support_status]}</td>
                    <td className="px-3 py-3">{customer.assigned_success_owner || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busyId === customer.customer_id}
                          onClick={() =>
                            void handleAction({
                              action: "assign_success_owner",
                              customer_id: customer.customer_id,
                              assigned_success_owner: "Aipify Success Team",
                            })
                          }
                          className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 disabled:opacity-50"
                        >
                          {labels.actions.assignOwner}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === customer.customer_id}
                          onClick={() =>
                            void handleAction({
                              action: "start_recovery_outreach",
                              customer_id: customer.customer_id,
                            })
                          }
                          className="rounded bg-indigo-50 px-2 py-1 text-xs text-indigo-800 hover:bg-indigo-100 disabled:opacity-50"
                        >
                          {labels.actions.recoveryOutreach}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.warnings}</h2>
        <ul className="mt-4 space-y-3">
          {dashboard.early_warnings.length === 0 ? (
            <li className="text-sm text-gray-500">—</li>
          ) : (
            dashboard.early_warnings.map((warning) => (
              <li key={warning.id} className="rounded-lg bg-amber-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{warning.company}</p>
                <p className="mt-1 text-gray-700">{warning.message}</p>
                <button
                  type="button"
                  disabled={busyId === warning.id}
                  onClick={() =>
                    void handleAction({
                      action: "resolve_warning",
                      warning_id: warning.id,
                      customer_id: warning.customer_id,
                    })
                  }
                  className="mt-2 text-xs font-medium text-indigo-700 hover:underline disabled:opacity-50"
                >
                  {labels.actions.resolveWarning}
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.recommendations}</h2>
        <ul className="mt-4 space-y-3">
          {dashboard.recommendations.map((rec) => (
            <li key={rec.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{rec.title}</p>
              <p className="text-gray-600">{rec.company}</p>
              <p className="mt-1 text-gray-700">{rec.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.tasks}</h2>
        <ul className="mt-4 space-y-3">
          {dashboard.tasks.map((task) => (
            <li key={task.id} className="flex items-start justify-between gap-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="text-gray-600">{task.company}</p>
              </div>
              <button
                type="button"
                disabled={busyId === task.id}
                onClick={() =>
                  void handleAction({
                    action: "complete_task",
                    task_id: task.id,
                    customer_id: task.customer_id,
                  })
                }
                className="shrink-0 rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
              >
                {labels.actions.completeTask}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.recovery}</h2>
        <ul className="mt-4 space-y-3">
          {dashboard.recovery_workflows.map((workflow) => (
            <li key={workflow.id} className="rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-950">
              <p className="font-medium">{workflow.company}</p>
              <p className="mt-1">{workflow.notes}</p>
              <p className="mt-2 text-xs text-indigo-800">{workflow.owner || "—"}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {dashboard.audit.map((entry) => (
            <li key={entry.id} className="flex justify-between gap-4 border-b border-gray-100 py-2">
              <span>{entry.summary}</span>
              <span className="shrink-0 text-xs text-gray-500">{formatDate(entry.created_at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
