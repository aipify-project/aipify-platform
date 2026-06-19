"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildSuccessOperationsFilterQuery,
  parseCustomerSuccessOperationsCenter,
  type CustomerSuccessFilters,
  type CustomerSuccessOperationsCenter,
} from "@/lib/customer-success-operations/parse";
import { PLAN_STATUS_BADGES, SUCCESS_STATUS_BADGES } from "@/lib/customer-success-operations/constants";
import type { CustomerSuccessOperationsLabels } from "@/lib/customer-success-operations/types";

type CustomerSuccessOperationsPanelProps = {
  labels: CustomerSuccessOperationsLabels;
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

export function CustomerSuccessOperationsPanel({
  labels,
  backHref,
}: CustomerSuccessOperationsPanelProps) {
  const [center, setCenter] = useState<CustomerSuccessOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerSuccessFilters>({});
  const [draftFilters, setDraftFilters] = useState<CustomerSuccessFilters>({});
  const [renewalTab, setRenewalTab] = useState<"30d" | "60d" | "90d">("30d");

  const load = useCallback(async (activeFilters: CustomerSuccessFilters) => {
    setLoading(true);
    const query = buildSuccessOperationsFilterQuery(activeFilters);
    const res = await fetch(`/api/customer-success-operations/overview${query}`);
    if (res.ok) setCenter(parseCustomerSuccessOperationsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (customerId: string, action: string, extra?: Record<string, string>) => {
      setBusyId(customerId);
      try {
        const res = await fetch("/api/customer-success-operations/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: customerId, action, ...extra }),
        });
        if (res.ok) await load(filters);
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

  const renewalRows =
    renewalTab === "30d"
      ? center?.renewals.within_30_days ?? []
      : renewalTab === "60d"
        ? center?.renewals.within_60_days ?? []
        : center?.renewals.within_90_days ?? [];

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

      {center.all_progressing && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          {labels.emptyState}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.successStatus}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.success_status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  success_status: e.target.value as CustomerSuccessFilters["success_status"],
                }))
              }
            >
              <option value="">{labels.filters.allStatuses}</option>
              {Object.entries(labels.statuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.healthScore}</span>
            <input
              type="number"
              min={0}
              max={100}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.health_score_min ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  health_score_min: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="0"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.assignedManager}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.assigned_manager ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  assigned_manager: e.target.value || undefined,
                }))
              }
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.renewalWindow}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.renewal_window ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  renewal_window: e.target.value as CustomerSuccessFilters["renewal_window"],
                }))
              }
            >
              <option value="">{labels.filters.allRenewals}</option>
              <option value="30d">{labels.renewals.within30}</option>
              <option value="60d">{labels.renewals.within60}</option>
              <option value="90d">{labels.renewals.within90}</option>
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
        </div>
        <button
          type="button"
          onClick={() => setFilters({ ...draftFilters })}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.filters.apply}
        </button>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.requiringAttention} value={overview.requiring_attention} />
          <OverviewCard label={labels.overview.onboarding} value={overview.onboarding_customers} />
          <OverviewCard label={labels.overview.successPlans} value={overview.success_plans_active} />
          <OverviewCard label={labels.overview.checkIns} value={overview.scheduled_check_ins} />
          <OverviewCard label={labels.overview.renewals} value={overview.renewals_next_30_days} />
          <OverviewCard label={labels.overview.expansion} value={overview.expansion_opportunities} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.customers}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">{labels.table.customer}</th>
                <th className="px-3 py-2">{labels.table.successStatus}</th>
                <th className="px-3 py-2">{labels.table.assignedManager}</th>
                <th className="px-3 py-2">{labels.table.healthScore}</th>
                <th className="px-3 py-2">{labels.table.lastCheckIn}</th>
                <th className="px-3 py-2">{labels.table.nextAction}</th>
                <th className="px-3 py-2">{labels.table.renewalDate}</th>
                <th className="px-3 py-2">{labels.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {center.customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-gray-500">
                    {labels.emptyState}
                  </td>
                </tr>
              ) : (
                center.customers.map((row) => (
                  <tr key={row.customer_id} className="border-b border-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                    <td className="px-3 py-3">
                      <StatusPill
                        label={labels.statuses[row.success_status]}
                        className={SUCCESS_STATUS_BADGES[row.success_status]}
                      />
                    </td>
                    <td className="px-3 py-3">{row.assigned_manager || "—"}</td>
                    <td className="px-3 py-3">{row.health_score}</td>
                    <td className="px-3 py-3">{formatDate(row.last_check_in)}</td>
                    <td className="px-3 py-3">{row.next_action || "—"}</td>
                    <td className="px-3 py-3">{formatDate(row.renewal_date)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/platform/customers/${row.customer_id}`}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          {labels.actions.openCustomer}
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === row.customer_id}
                          onClick={() => void handleAction(row.customer_id, "schedule_meeting")}
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                          {labels.actions.scheduleMeeting}
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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.onboarding}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">{labels.table.customer}</th>
                <th className="px-3 py-2">{labels.table.accountCreated}</th>
                <th className="px-3 py-2">{labels.table.firstLogin}</th>
                <th className="px-3 py-2">{labels.table.firstUserInvited}</th>
                <th className="px-3 py-2">{labels.table.firstIntegration}</th>
                <th className="px-3 py-2">{labels.table.firstAction}</th>
                <th className="px-3 py-2">{labels.table.milestonesCompleted}</th>
              </tr>
            </thead>
            <tbody>
              {center.onboarding.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-4 text-gray-500">
                    {labels.emptyState}
                  </td>
                </tr>
              ) : (
                center.onboarding.map((row) => (
                  <tr key={row.customer_id} className="border-b border-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                    <td className="px-3 py-3">{formatDate(row.account_created)}</td>
                    <td className="px-3 py-3">{formatDate(row.first_login)}</td>
                    <td className="px-3 py-3">{formatDate(row.first_user_invited)}</td>
                    <td className="px-3 py-3">{formatDate(row.first_integration)}</td>
                    <td className="px-3 py-3">{formatDate(row.first_action)}</td>
                    <td className="px-3 py-3">{row.milestones_completed}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.checkIns}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {center.check_ins.length === 0 ? (
            <li className="text-gray-500">{labels.emptyState}</li>
          ) : (
            center.check_ins.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="font-medium text-gray-900">{row.customer}</span>
                <span className="text-gray-600">
                  {labels.checkInTypes[row.check_in_type] ?? row.check_in_type} ·{" "}
                  {formatDate(row.scheduled_at)}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.expansion}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">{labels.table.customer}</th>
                <th className="px-3 py-2">{labels.table.currentPlan}</th>
                <th className="px-3 py-2">{labels.table.recommendedUpgrade}</th>
                <th className="px-3 py-2">{labels.table.revenueIncrease}</th>
                <th className="px-3 py-2">{labels.table.reason}</th>
              </tr>
            </thead>
            <tbody>
              {center.expansion.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-gray-500">
                    {labels.emptyState}
                  </td>
                </tr>
              ) : (
                center.expansion.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                    <td className="px-3 py-3">{row.current_plan}</td>
                    <td className="px-3 py-3">{row.recommended_upgrade}</td>
                    <td className="px-3 py-3">
                      {formatMoney(row.estimated_revenue_increase, row.currency)}
                    </td>
                    <td className="px-3 py-3">{row.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.successPlans}</h2>
        <ul className="mt-4 space-y-3">
          {center.success_plans.length === 0 ? (
            <li className="text-sm text-gray-500">{labels.emptyState}</li>
          ) : (
            center.success_plans.map((plan) => (
              <li key={plan.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{plan.objective}</span>
                  <StatusPill
                    label={labels.planStatuses[plan.status]}
                    className={PLAN_STATUS_BADGES[plan.status]}
                  />
                </div>
                <p className="mt-1 text-gray-600">
                  {plan.customer} · {labels.table.owner}: {plan.owner}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(plan.start_date)} → {formatDate(plan.target_date)}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900">{labels.sections.renewals}</h2>
          <div className="flex gap-2">
            {(["30d", "60d", "90d"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRenewalTab(tab)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                  renewalTab === tab
                    ? "bg-indigo-50 text-indigo-800 ring-indigo-200"
                    : "bg-gray-50 text-gray-700 ring-gray-200"
                }`}
              >
                {labels.renewals[`within${tab === "30d" ? "30" : tab === "60d" ? "60" : "90"}` as keyof typeof labels.renewals]}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {renewalRows.length === 0 ? (
            <li className="text-gray-500">{labels.emptyState}</li>
          ) : (
            renewalRows.map((row) => (
              <li
                key={row.customer_id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="font-medium text-gray-900">{row.customer}</span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-600">{formatDate(row.renewal_date)}</span>
                  <button
                    type="button"
                    disabled={busyId === row.customer_id}
                    onClick={() => void handleAction(row.customer_id, "schedule_meeting", { check_in_type: "renewal_review" })}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    {labels.actions.scheduleReview}
                  </button>
                </div>
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
    </div>
  );
}
