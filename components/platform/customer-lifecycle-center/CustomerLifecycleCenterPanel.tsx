"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildLifecycleFilterQuery,
  HEALTH_STATUS_BADGES,
  parseCustomerLifecycleCenter,
  STAGE_BADGES,
  type CustomerLifecycleCenter,
  type CustomerLifecycleCenterLabels,
  type CustomerLifecycleFilters,
} from "@/lib/customer-lifecycle-center";

type CustomerLifecycleCenterPanelProps = {
  labels: CustomerLifecycleCenterLabels;
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

function formatMoney(value: number, currency = "NOK"): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
}

export function CustomerLifecycleCenterPanel({
  labels,
  backHref,
}: CustomerLifecycleCenterPanelProps) {
  const [center, setCenter] = useState<CustomerLifecycleCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerLifecycleFilters>({});
  const [draftFilters, setDraftFilters] = useState<CustomerLifecycleFilters>({});

  const load = useCallback(async (activeFilters: CustomerLifecycleFilters) => {
    setLoading(true);
    const query = buildLifecycleFilterQuery(activeFilters);
    const res = await fetch(`/api/customer-lifecycle-center/overview${query}`);
    if (res.ok) setCenter(parseCustomerLifecycleCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (customerId: string, action: string, summary?: string) => {
      setBusyId(customerId);
      try {
        const res = await fetch("/api/customer-lifecycle-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: customerId, action, summary }),
        });
        if (res.ok) await load(filters);
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

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
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.lifecycleStage}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.lifecycle_stage ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  lifecycle_stage: e.target.value as CustomerLifecycleFilters["lifecycle_stage"],
                }))
              }
            >
              <option value="">{labels.filters.allStages}</option>
              {Object.entries(labels.stages).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.healthStatus}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.health_status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  health_status: e.target.value as CustomerLifecycleFilters["health_status"],
                }))
              }
            >
              <option value="">{labels.filters.allHealth}</option>
              {Object.entries(labels.healthStatuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.plan}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.plan ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  plan: e.target.value as CustomerLifecycleFilters["plan"],
                }))
              }
            >
              <option value="">{labels.filters.allPlans}</option>
              {Object.entries(labels.plans).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.country}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.country ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, country: e.target.value || undefined }))
              }
              placeholder={labels.filters.allCountries}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.registrationFrom}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.registration_from?.slice(0, 10) ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  registration_from: e.target.value ? `${e.target.value}T00:00:00.000Z` : undefined,
                }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.registrationTo}</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.registration_to?.slice(0, 10) ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  registration_to: e.target.value ? `${e.target.value}T23:59:59.000Z` : undefined,
                }))
              }
            />
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

      {!center.has_events && center.customers.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-600 shadow-sm">
          {labels.emptyState}
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.overview.newCustomers} value={overview.new_customers_30d} />
              <OverviewCard label={labels.overview.trialCustomers} value={overview.trial_customers} />
              <OverviewCard label={labels.overview.activeCustomers} value={overview.active_customers} />
              <OverviewCard label={labels.overview.atRiskCustomers} value={overview.at_risk_customers} />
              <OverviewCard label={labels.overview.churnedCustomers} value={overview.churned_customers} />
              <OverviewCard
                label={labels.overview.reactivatedCustomers}
                value={overview.reactivated_customers}
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.stages}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {center.lifecycle_stages.map((stage) => (
                <StatusPill
                  key={stage.key}
                  label={labels.stages[stage.key as keyof typeof labels.stages] ?? stage.label}
                  className={STAGE_BADGES[stage.key as keyof typeof STAGE_BADGES] ?? STAGE_BADGES.registered}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
              {labels.healthFactors.loginFrequency} · {labels.healthFactors.featureAdoption} ·{" "}
              {labels.healthFactors.supportInteractions} · {labels.healthFactors.paymentHistory} ·{" "}
              {labels.healthFactors.teamEngagement}
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.customers}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.company}</th>
                    <th className="px-3 py-2">{labels.table.lifecycleStage}</th>
                    <th className="px-3 py-2">{labels.table.currentPlan}</th>
                    <th className="px-3 py-2">{labels.table.users}</th>
                    <th className="px-3 py-2">{labels.table.country}</th>
                    <th className="px-3 py-2">{labels.table.daysAsCustomer}</th>
                    <th className="px-3 py-2">{labels.table.healthScore}</th>
                    <th className="px-3 py-2">{labels.table.lastActivity}</th>
                    <th className="px-3 py-2">{labels.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.customers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.customers.map((row) => (
                      <tr key={row.customer_id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.company}</td>
                        <td className="px-3 py-3">
                          <StatusPill
                            label={labels.stages[row.lifecycle_stage]}
                            className={STAGE_BADGES[row.lifecycle_stage]}
                          />
                        </td>
                        <td className="px-3 py-3">{row.current_plan}</td>
                        <td className="px-3 py-3">{row.users}</td>
                        <td className="px-3 py-3">{row.country}</td>
                        <td className="px-3 py-3">{row.days_as_customer}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{row.health_score}</span>
                            <StatusPill
                              label={labels.healthStatuses[row.health_status]}
                              className={HEALTH_STATUS_BADGES[row.health_status]}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3">{formatDate(row.last_activity)}</td>
                        <td className="px-3 py-3">
                          <Link
                            href={`/platform/customers/${row.customer_id}`}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            {labels.actions.view}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.atRisk}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.riskReason}</th>
                    <th className="px-3 py-2">{labels.table.healthScore}</th>
                    <th className="px-3 py-2">{labels.table.recommendedAction}</th>
                    <th className="px-3 py-2">{labels.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.at_risk.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.at_risk.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{row.risk_reason}</td>
                        <td className="px-3 py-3">{row.health_score}</td>
                        <td className="px-3 py-3">{row.recommended_action}</td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            disabled={busyId === row.customer_id}
                            onClick={() =>
                              void handleAction(row.customer_id, "contact_customer", row.recommended_action)
                            }
                            className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                          >
                            {labels.actions.contact}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.expansion}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.currentPlan}</th>
                    <th className="px-3 py-2">{labels.table.opportunity}</th>
                    <th className="px-3 py-2">{labels.table.revenueImpact}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.expansion_opportunities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.expansion_opportunities.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{row.current_plan}</td>
                        <td className="px-3 py-3">{row.opportunity}</td>
                        <td className="px-3 py-3">
                          {formatMoney(row.estimated_revenue_impact, row.currency)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.timeline}</h2>
            <ul className="mt-4 space-y-3">
              {center.timeline.length === 0 ? (
                <li className="text-sm text-gray-500">{labels.emptyState}</li>
              ) : (
                center.timeline.map((event) => (
                  <li key={event.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-gray-900">{event.title}</span>
                      <span className="text-xs text-gray-400">{formatDate(event.event_at)}</span>
                    </div>
                    <p className="mt-1 text-gray-600">{event.summary}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {event.customer} · {event.event_type.replace(/_/g, " ")}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {center.audit.length === 0 ? (
                <li className="text-gray-500">{labels.emptyState}</li>
              ) : (
                center.audit.map((entry) => (
                  <li key={entry.id} className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700">
                    <span className="font-medium text-gray-900">{entry.summary}</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {labels.table.event}: {entry.event_type.replace(/_/g, " ")} ·{" "}
                      {formatDate(entry.created_at)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
