"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildSubscriptionOperationsFilterQuery,
  parseSubscriptionOperationsCenter,
  STATUS_BADGES,
  type SubscriptionOperationsCenter,
  type SubscriptionOperationsFilters,
  type SubscriptionOperationsLabels,
  type SubscriptionRow,
} from "@/lib/subscription-operations";

type SubscriptionOperationsPanelProps = {
  labels: SubscriptionOperationsLabels;
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

function SubscriptionActions({
  row,
  labels,
  busy,
  onAction,
}: {
  row: SubscriptionRow;
  labels: SubscriptionOperationsLabels;
  busy: string | null;
  onAction: (subscriptionId: string, action: string, extra?: Record<string, string>) => void;
}) {
  const isBusy = busy === row.id;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/platform/customers`}
        className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
      >
        {labels.actions.view}
      </Link>
      {row.status === "trial" && (
        <>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onAction(row.id, "extend_trial")}
            className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            {labels.actions.extendTrial}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onAction(row.id, "convert_to_paid")}
            className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            {labels.actions.convertToPaid}
          </button>
        </>
      )}
      {row.status === "suspended" ? (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onAction(row.id, "reactivate")}
          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          {labels.actions.reactivate}
        </button>
      ) : row.status !== "cancelled" ? (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onAction(row.id, "suspend_access")}
          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          {labels.actions.suspend}
        </button>
      ) : null}
      {row.status !== "cancelled" && (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onAction(row.id, "cancel_subscription")}
          className="text-xs font-medium text-red-700 hover:text-red-800 disabled:opacity-50"
        >
          {labels.actions.cancel}
        </button>
      )}
    </div>
  );
}

export function SubscriptionOperationsPanel({
  labels,
  backHref,
}: SubscriptionOperationsPanelProps) {
  const [center, setCenter] = useState<SubscriptionOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<SubscriptionOperationsFilters>({});
  const [draftFilters, setDraftFilters] = useState<SubscriptionOperationsFilters>({});
  const [renewalTab, setRenewalTab] = useState<"7d" | "30d" | "90d">("7d");

  const load = useCallback(async (activeFilters: SubscriptionOperationsFilters) => {
    setLoading(true);
    const query = buildSubscriptionOperationsFilterQuery(activeFilters);
    const res = await fetch(`/api/subscription-operations/overview${query}`);
    if (res.ok) setCenter(parseSubscriptionOperationsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (subscriptionId: string, action: string, extra?: Record<string, string>) => {
      setBusyId(subscriptionId);
      try {
        const res = await fetch("/api/subscription-operations/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription_id: subscriptionId, action, ...extra }),
        });
        if (res.ok) await load(filters);
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

  const renewalRows =
    renewalTab === "7d"
      ? center?.renewals.within_7_days ?? []
      : renewalTab === "30d"
        ? center?.renewals.within_30_days ?? []
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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.plan}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.plan ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  plan: e.target.value as SubscriptionOperationsFilters["plan"],
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
            <span className="text-xs text-gray-500">{labels.filters.status}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  status: e.target.value as SubscriptionOperationsFilters["status"],
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
            <span className="text-xs text-gray-500">{labels.filters.provider}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.provider ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, provider: e.target.value || undefined }))
              }
              placeholder={labels.filters.allProviders}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.renewalPeriod}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.renewal_period ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  renewal_period: e.target.value as SubscriptionOperationsFilters["renewal_period"],
                }))
              }
            >
              <option value="">{labels.filters.allRenewals}</option>
              <option value="7d">{labels.renewals.within7}</option>
              <option value="30d">{labels.renewals.within30}</option>
              <option value="90d">{labels.renewals.within90}</option>
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

      {!center.has_subscriptions && center.subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-600 shadow-sm">
          {labels.emptyState}
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.overview.active} value={overview.active_subscriptions} />
              <OverviewCard label={labels.overview.trials} value={overview.trial_accounts} />
              <OverviewCard label={labels.overview.renewals} value={overview.upcoming_renewals} />
              <OverviewCard label={labels.overview.upgrades} value={overview.upgrades_this_month} />
              <OverviewCard label={labels.overview.downgrades} value={overview.downgrades_this_month} />
              <OverviewCard label={labels.overview.cancelled} value={overview.cancelled_subscriptions} />
            </dl>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.subscriptions}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.plan}</th>
                    <th className="px-3 py-2">{labels.table.users}</th>
                    <th className="px-3 py-2">{labels.table.billingProvider}</th>
                    <th className="px-3 py-2">{labels.table.monthlyValue}</th>
                    <th className="px-3 py-2">{labels.table.renewalDate}</th>
                    <th className="px-3 py-2">{labels.table.status}</th>
                    <th className="px-3 py-2">{labels.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.subscriptions.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{row.plan}</td>
                        <td className="px-3 py-3">{row.users}</td>
                        <td className="px-3 py-3">{row.billing_provider}</td>
                        <td className="px-3 py-3">{formatMoney(row.monthly_value, row.currency)}</td>
                        <td className="px-3 py-3">{formatDate(row.renewal_date)}</td>
                        <td className="px-3 py-3">
                          <StatusPill
                            label={labels.statuses[row.status] ?? row.status}
                            className={STATUS_BADGES[row.status] ?? STATUS_BADGES.active}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <SubscriptionActions
                            row={row}
                            labels={labels}
                            busy={busyId}
                            onAction={handleAction}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.trials}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.trialStart}</th>
                    <th className="px-3 py-2">{labels.table.trialEnd}</th>
                    <th className="px-3 py-2">{labels.table.daysRemaining}</th>
                    <th className="px-3 py-2">{labels.table.conversionProbability}</th>
                    <th className="px-3 py-2">{labels.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.trials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.trials.map((trial) => (
                      <tr key={trial.subscription_id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{trial.customer}</td>
                        <td className="px-3 py-3">{formatDate(trial.trial_start)}</td>
                        <td className="px-3 py-3">{formatDate(trial.trial_end)}</td>
                        <td className="px-3 py-3">{trial.days_remaining}</td>
                        <td className="px-3 py-3">{trial.conversion_probability}%</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={busyId === trial.subscription_id}
                              onClick={() => handleAction(trial.subscription_id, "extend_trial")}
                              className="text-xs font-medium text-gray-700 hover:text-gray-900"
                            >
                              {labels.actions.extendTrial}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === trial.subscription_id}
                              onClick={() => handleAction(trial.subscription_id, "convert_to_paid")}
                              className="text-xs font-medium text-gray-700 hover:text-gray-900"
                            >
                              {labels.actions.convertToPaid}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === trial.subscription_id}
                              onClick={() => handleAction(trial.subscription_id, "send_reminder")}
                              className="text-xs font-medium text-gray-700 hover:text-gray-900"
                            >
                              {labels.actions.sendReminder}
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

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">{labels.sections.upgrades}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {center.upgrades.length === 0 ? (
                  <li className="text-gray-500">{labels.emptyState}</li>
                ) : (
                  center.upgrades.map((item) => (
                    <li key={item.id} className="rounded-lg bg-gray-50 px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {item.previous_plan} → {item.new_plan}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {labels.table.effectiveDate}: {formatDate(item.effective_date)} ·{" "}
                        {labels.table.revenueImpact}: {formatMoney(item.revenue_impact ?? 0)}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">{labels.sections.downgrades}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {center.downgrades.length === 0 ? (
                  <li className="text-gray-500">{labels.emptyState}</li>
                ) : (
                  center.downgrades.map((item) => (
                    <li key={item.id} className="rounded-lg bg-gray-50 px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {item.previous_plan} → {item.new_plan}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {labels.table.effectiveDate}: {formatDate(item.effective_date)} ·{" "}
                        {labels.table.reason}: {item.reason}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900">{labels.sections.renewals}</h2>
              <div className="flex gap-2">
                {(["7d", "30d", "90d"] as const).map((tab) => (
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
                    {labels.renewals[`within${tab === "7d" ? "7" : tab === "30d" ? "30" : "90"}` as keyof typeof labels.renewals]}
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
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3"
                  >
                    <span className="font-medium text-gray-900">{row.customer}</span>
                    <span className="text-gray-600">
                      {row.plan} · {formatDate(row.renewal_date)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.pastDue}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.outstandingAmount}</th>
                    <th className="px-3 py-2">{labels.table.daysOverdue}</th>
                    <th className="px-3 py-2">{labels.table.paymentProvider}</th>
                    <th className="px-3 py-2">{labels.table.recommendedAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.past_due.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.past_due.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">
                          {formatMoney(row.outstanding_amount, row.currency)}
                        </td>
                        <td className="px-3 py-3">{row.days_overdue}</td>
                        <td className="px-3 py-3">{row.payment_provider}</td>
                        <td className="px-3 py-3">{row.recommended_action}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{labels.sections.enterpriseContracts}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.contractStart}</th>
                    <th className="px-3 py-2">{labels.table.contractEnd}</th>
                    <th className="px-3 py-2">{labels.table.paymentTerms}</th>
                    <th className="px-3 py-2">{labels.table.accountManager}</th>
                  </tr>
                </thead>
                <tbody>
                  {center.enterprise_contracts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-gray-500">
                        {labels.emptyState}
                      </td>
                    </tr>
                  ) : (
                    center.enterprise_contracts.map((row) => (
                      <tr key={row.customer_id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{formatDate(row.contract_start)}</td>
                        <td className="px-3 py-3">{formatDate(row.contract_end)}</td>
                        <td className="px-3 py-3">{row.payment_terms}</td>
                        <td className="px-3 py-3">{row.account_manager}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
