"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildFilterPreset,
  buildLifecycleTimeline,
  buildRenewalCommandCenter,
  buildSubscriptionOperationsFilterQuery,
  computeExecutiveSnapshot,
  computeExecutiveTrends,
  computeGrowthOpportunities,
  computeRevenueAtRisk,
  enrichAuditEntries,
  enrichEnterpriseContracts,
  enrichPastDueCases,
  enrichPlanChanges,
  enrichSubscriptionRows,
  enrichTrials,
  EXPANSION_BADGES,
  FILTER_PRESETS,
  generateExecutiveInsights,
  HEALTH_BAND_BADGES,
  parseSubscriptionOperationsCenter,
  RISK_LEVEL_BADGES,
  STATUS_BADGES,
  TREND_STYLES,
  type FilterPreset,
  type MetricTrend,
  type SubscriptionOperationsCenter,
  type SubscriptionOperationsFilters,
  type SubscriptionOperationsLabels,
  type SubscriptionRow,
} from "@/lib/subscription-operations";

type SubscriptionOperationsPanelProps = {
  labels: SubscriptionOperationsLabels;
  backHref: string;
};

const EXECUTIVE_CARD =
  "rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/80 p-6 shadow-sm shadow-zinc-900/5";
const SECTION_CARD = "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function formatMoney(value: number, currency = "NOK"): string {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function TrendBadge({ trend, invertColor = false }: { trend: MetricTrend; invertColor?: boolean }) {
  const positive = invertColor ? trend.direction === "down" : trend.direction === "up";
  const negative = invertColor ? trend.direction === "up" : trend.direction === "down";
  const arrow = trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→";
  const color = positive ? TREND_STYLES.up : negative ? TREND_STYLES.down : TREND_STYLES.flat;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      {arrow} {trend.label}
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

function SubscriptionActions({
  row,
  labels,
  busy,
  onAction,
}: {
  row: SubscriptionRow;
  labels: SubscriptionOperationsLabels;
  busy: string | null;
  onAction: (subscriptionId: string, action: string) => void;
}) {
  const isBusy = busy === row.id;
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/platform/customers" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
        {labels.actions.view}
      </Link>
      {row.status === "trial" && (
        <>
          <button type="button" disabled={isBusy} onClick={() => onAction(row.id, "extend_trial")} className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50">
            {labels.actions.extendTrial}
          </button>
          <button type="button" disabled={isBusy} onClick={() => onAction(row.id, "convert_to_paid")} className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50">
            {labels.actions.convertToPaid}
          </button>
        </>
      )}
      {row.status === "suspended" ? (
        <button type="button" disabled={isBusy} onClick={() => onAction(row.id, "reactivate")} className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50">
          {labels.actions.reactivate}
        </button>
      ) : row.status !== "cancelled" ? (
        <button type="button" disabled={isBusy} onClick={() => onAction(row.id, "suspend_access")} className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50">
          {labels.actions.suspend}
        </button>
      ) : null}
      {row.status !== "cancelled" && (
        <button type="button" disabled={isBusy} onClick={() => onAction(row.id, "cancel_subscription")} className="text-xs font-medium text-red-700 hover:text-red-800 disabled:opacity-50">
          {labels.actions.cancel}
        </button>
      )}
    </div>
  );
}

export function SubscriptionOperationsPanel({ labels, backHref }: SubscriptionOperationsPanelProps) {
  const [center, setCenter] = useState<SubscriptionOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<FilterPreset | null>(null);
  const [filters, setFilters] = useState<SubscriptionOperationsFilters>({});
  const [draftFilters, setDraftFilters] = useState<SubscriptionOperationsFilters>({});
  const [renewalTab, setRenewalTab] = useState<"7d" | "30d" | "90d">("30d");

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

  const derived = useMemo(() => {
    if (!center) return null;
    return {
      executive: computeExecutiveSnapshot(center),
      trends: computeExecutiveTrends(center),
      subscriptions: enrichSubscriptionRows(center.subscriptions),
      trials: enrichTrials(center.trials),
      upgrades: enrichPlanChanges(center, center.upgrades, "upgrade"),
      downgrades: enrichPlanChanges(center, center.downgrades, "downgrade"),
      renewals: buildRenewalCommandCenter(center),
      pastDue: enrichPastDueCases(center.past_due),
      contracts: enrichEnterpriseContracts(center.enterprise_contracts, center.subscriptions),
      timeline: buildLifecycleTimeline(center),
      insights: generateExecutiveInsights(center),
      revenueAtRisk: computeRevenueAtRisk(center),
      growth: computeGrowthOpportunities(center),
      audit: enrichAuditEntries(center, center.audit),
    };
  }, [center]);

  const handleAction = useCallback(
    async (subscriptionId: string, action: string) => {
      setBusyId(subscriptionId);
      try {
        const res = await fetch("/api/subscription-operations/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription_id: subscriptionId, action }),
        });
        if (res.ok) await load(filters);
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

  const applyPreset = (preset: FilterPreset) => {
    const presetFilters = buildFilterPreset(preset);
    setActivePreset(preset);
    setDraftFilters((prev) => ({ ...prev, ...presetFilters }));
    setFilters((prev) => ({ ...prev, ...presetFilters }));
  };

  const filteredRenewals = useMemo(() => {
    if (!derived) return [];
    if (renewalTab === "7d") return derived.renewals.filter((r) => (r.renewal_date ? new Date(r.renewal_date).getTime() - Date.now() <= 7 * 86400000 : false));
    if (renewalTab === "30d") return derived.renewals.filter((r) => (r.renewal_date ? new Date(r.renewal_date).getTime() - Date.now() <= 30 * 86400000 : false));
    return derived.renewals;
  }, [derived, renewalTab]);

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center || !derived) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { executive, trends } = derived;
  const currency = executive.currency;

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
            <span className="text-xs text-gray-500">{labels.filters.plan}</span>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={draftFilters.plan ?? ""} onChange={(e) => setDraftFilters((prev) => ({ ...prev, plan: e.target.value as SubscriptionOperationsFilters["plan"] }))}>
              <option value="">{labels.filters.allPlans}</option>
              {Object.entries(labels.plans).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.status}</span>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={draftFilters.status ?? ""} onChange={(e) => setDraftFilters((prev) => ({ ...prev, status: e.target.value as SubscriptionOperationsFilters["status"] }))}>
              <option value="">{labels.filters.allStatuses}</option>
              {Object.entries(labels.statuses).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.country}</span>
            <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={draftFilters.country ?? ""} onChange={(e) => setDraftFilters((prev) => ({ ...prev, country: e.target.value || undefined }))} placeholder={labels.filters.allCountries} />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.provider}</span>
            <input className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={draftFilters.provider ?? ""} onChange={(e) => setDraftFilters((prev) => ({ ...prev, provider: e.target.value || undefined }))} placeholder={labels.filters.allProviders} />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.renewalPeriod}</span>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={draftFilters.renewal_period ?? ""} onChange={(e) => setDraftFilters((prev) => ({ ...prev, renewal_period: e.target.value as SubscriptionOperationsFilters["renewal_period"] }))}>
              <option value="">{labels.filters.allRenewals}</option>
              <option value="7d">{labels.renewals.within7}</option>
              <option value="30d">{labels.renewals.within30}</option>
              <option value="90d">{labels.renewals.within90}</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.growthPartner}</span>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={draftFilters.growth_partner ?? ""} onChange={(e) => setDraftFilters((prev) => ({ ...prev, growth_partner: e.target.value || undefined }))}>
              <option value="">{labels.filters.allPartners}</option>
              <option value="direct">Direct</option>
              <option value="unonight">Unonight</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.accountManager}</span>
            <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2" value={draftFilters.account_manager ?? ""} onChange={(e) => setDraftFilters((prev) => ({ ...prev, account_manager: e.target.value || undefined }))}>
              <option value="">{labels.filters.allManagers}</option>
              <option value="enterprise_success">Enterprise Success</option>
              <option value="customer_success">Customer Success</option>
            </select>
          </label>
        </div>
        <button type="button" onClick={() => setFilters({ ...draftFilters })} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          {labels.filters.apply}
        </button>
      </section>

      {!center.has_subscriptions && center.subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-600 shadow-sm">
          {labels.emptyState}
        </div>
      ) : (
        <>
          <section className={EXECUTIVE_CARD}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {labels.sections.executiveSnapshot}
            </h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.executive.mrr} value={formatMoney(executive.mrr, currency)} trend={trends.mrr} />
              <OverviewCard label={labels.executive.arr} value={formatMoney(executive.arr, currency)} trend={trends.arr} />
              <OverviewCard label={labels.executive.netGrowth} value={`${executive.net_subscriber_growth_pct}%`} trend={trends.netGrowth} />
              <OverviewCard label={labels.executive.conversionRate} value={`${executive.trial_to_paid_conversion_pct}%`} trend={trends.conversion} />
              <OverviewCard label={labels.executive.renewalRisk} value={formatMoney(executive.revenue_at_renewal_risk, currency)} trend={trends.renewalRisk} invertTrend />
              <OverviewCard label={labels.executive.acv} value={formatMoney(executive.average_contract_value, currency)} trend={trends.acv} />
            </dl>
          </section>

          <section>
            <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.executive.active} value={executive.active_subscriptions} />
              <OverviewCard label={labels.executive.trials} value={executive.trial_accounts} />
              <OverviewCard label={labels.executive.renewals} value={executive.upcoming_renewals} />
              <OverviewCard label={labels.executive.upgrades} value={executive.upgrades_this_month} />
              <OverviewCard label={labels.executive.downgrades} value={executive.downgrades_this_month} />
              <OverviewCard label={labels.executive.cancelled} value={executive.cancelled_subscriptions} />
            </dl>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.healthScoring}</h2>
            <p className="mt-2 text-sm text-gray-600">{labels.healthDescription}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {(["healthy", "stable", "attention", "critical"] as const).map((band) => (
                <StatusPill key={band} label={labels.health[band]} className={HEALTH_BAND_BADGES[band]} />
              ))}
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.subscriptions}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.plan}</th>
                    <th className="px-3 py-2">{labels.table.mrrContribution}</th>
                    <th className="px-3 py-2">{labels.table.healthScore}</th>
                    <th className="px-3 py-2">{labels.table.renewalProbability}</th>
                    <th className="px-3 py-2">{labels.table.contractType}</th>
                    <th className="px-3 py-2">{labels.table.accountOwner}</th>
                    <th className="px-3 py-2">{labels.table.lastInteraction}</th>
                    <th className="px-3 py-2">{labels.table.riskLevel}</th>
                    <th className="px-3 py-2">{labels.table.status}</th>
                    <th className="px-3 py-2">{labels.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.subscriptions.length === 0 ? (
                    <tr><td colSpan={11} className="px-3 py-4 text-gray-500">{labels.emptyState}</td></tr>
                  ) : (
                    derived.subscriptions.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{row.plan}</td>
                        <td className="px-3 py-3">{formatMoney(row.mrr_contribution, row.currency)}</td>
                        <td className="px-3 py-3">
                          <StatusPill label={`${row.health_score}% · ${labels.health[row.health_band]}`} className={HEALTH_BAND_BADGES[row.health_band]} />
                        </td>
                        <td className="px-3 py-3">{row.renewal_probability}%</td>
                        <td className="px-3 py-3">{row.contract_type}</td>
                        <td className="px-3 py-3">{row.account_owner}</td>
                        <td className="px-3 py-3">{formatDate(row.last_interaction)}</td>
                        <td className="px-3 py-3">
                          <StatusPill label={labels.riskLevels[row.risk_level]} className={RISK_LEVEL_BADGES[row.risk_level]} />
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill label={labels.statuses[row.status] ?? row.status} className={STATUS_BADGES[row.status] ?? STATUS_BADGES.active} />
                        </td>
                        <td className="px-3 py-3">
                          <SubscriptionActions row={row} labels={labels} busy={busyId} onAction={handleAction} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.trials}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.daysRemaining}</th>
                    <th className="px-3 py-2">{labels.table.usageScore}</th>
                    <th className="px-3 py-2">{labels.table.conversionProbability}</th>
                    <th className="px-3 py-2">{labels.table.growthPartner}</th>
                    <th className="px-3 py-2">{labels.table.recommendedAction}</th>
                    <th className="px-3 py-2">{labels.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.trials.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-4 text-gray-500">{labels.emptyState}</td></tr>
                  ) : (
                    derived.trials.map((trial) => (
                      <tr key={trial.subscription_id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{trial.customer}</td>
                        <td className="px-3 py-3">{trial.days_remaining}</td>
                        <td className="px-3 py-3">{trial.usage_score}%</td>
                        <td className="px-3 py-3">{trial.conversion_probability}%</td>
                        <td className="px-3 py-3">{trial.growth_partner}</td>
                        <td className="px-3 py-3">{trial.recommended_action}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" disabled={busyId === trial.subscription_id} onClick={() => handleAction(trial.subscription_id, "send_reminder")} className="text-xs font-medium text-gray-700 hover:text-gray-900">{labels.actions.sendReminder}</button>
                            <button type="button" disabled={busyId === trial.subscription_id} onClick={() => handleAction(trial.subscription_id, "extend_trial")} className="text-xs font-medium text-gray-700 hover:text-gray-900">{labels.actions.extendTrial}</button>
                            <button type="button" disabled={busyId === trial.subscription_id} onClick={() => handleAction(trial.subscription_id, "convert_to_paid")} className="text-xs font-medium text-gray-700 hover:text-gray-900">{labels.actions.convertToPaid}</button>
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
            <section className={SECTION_CARD}>
              <h2 className="font-semibold text-gray-900">{labels.sections.upgrades}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {derived.upgrades.length === 0 ? (
                  <li className="text-gray-500">{labels.emptyState}</li>
                ) : (
                  derived.upgrades.map((item) => (
                    <li key={item.id} className="rounded-lg bg-gray-50 px-4 py-3">
                      <p className="font-medium text-gray-900">{item.customer}</p>
                      <p className="mt-1 text-gray-800">{item.previous_plan} → {item.new_plan}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {labels.table.mrrImpact}: {formatMoney(item.mrr_impact, currency)} · {labels.table.growthPartner}: {item.growth_partner} · {formatDate(item.change_date)}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </section>
            <section className={SECTION_CARD}>
              <h2 className="font-semibold text-gray-900">{labels.sections.downgrades}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {derived.downgrades.length === 0 ? (
                  <li className="text-gray-500">{labels.emptyState}</li>
                ) : (
                  derived.downgrades.map((item) => (
                    <li key={item.id} className="rounded-lg bg-gray-50 px-4 py-3">
                      <p className="font-medium text-gray-900">{item.customer}</p>
                      <p className="mt-1 text-gray-800">{item.previous_plan} → {item.new_plan}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {labels.table.mrrImpact}: {formatMoney(item.mrr_impact, currency)} · {labels.table.reason}: {item.reason ?? "—"} · {formatDate(item.change_date)}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>

          <section className={SECTION_CARD}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900">{labels.renewals.commandCenter}</h2>
              <div className="flex gap-2">
                {(["7d", "30d", "90d"] as const).map((tab) => (
                  <button key={tab} type="button" onClick={() => setRenewalTab(tab)} className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${renewalTab === tab ? "bg-indigo-50 text-indigo-800 ring-indigo-200" : "bg-gray-50 text-gray-700 ring-gray-200"}`}>
                    {labels.renewals[`within${tab === "7d" ? "7" : tab === "30d" ? "30" : "90"}` as keyof typeof labels.renewals]}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.renewalDate}</th>
                    <th className="px-3 py-2">{labels.table.contractValue}</th>
                    <th className="px-3 py-2">{labels.table.renewalProbability}</th>
                    <th className="px-3 py-2">{labels.table.healthScore}</th>
                    <th className="px-3 py-2">{labels.table.riskLevel}</th>
                    <th className="px-3 py-2">{labels.table.recommendedAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRenewals.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-4 text-gray-500">{labels.emptyState}</td></tr>
                  ) : (
                    filteredRenewals.map((row) => (
                      <tr key={row.subscription_id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{formatDate(row.renewal_date)}</td>
                        <td className="px-3 py-3">{formatMoney(row.contract_value, row.currency)}</td>
                        <td className="px-3 py-3">{row.renewal_probability}%</td>
                        <td className="px-3 py-3">{row.health_score}%</td>
                        <td className="px-3 py-3">
                          <StatusPill label={labels.riskLevels[row.risk_level]} className={RISK_LEVEL_BADGES[row.risk_level]} />
                        </td>
                        <td className="px-3 py-3">{row.recommended_action}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.pastDue}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.outstandingAmount}</th>
                    <th className="px-3 py-2">{labels.table.daysOverdue}</th>
                    <th className="px-3 py-2">{labels.table.paymentProvider}</th>
                    <th className="px-3 py-2">{labels.table.retryAttempts}</th>
                    <th className="px-3 py-2">{labels.table.accountOwner}</th>
                    <th className="px-3 py-2">{labels.table.riskLevel}</th>
                    <th className="px-3 py-2">{labels.table.nextStep}</th>
                    <th className="px-3 py-2">{labels.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.pastDue.length === 0 ? (
                    <tr><td colSpan={9} className="px-3 py-4 text-gray-500">{labels.emptyState}</td></tr>
                  ) : (
                    derived.pastDue.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{formatMoney(row.outstanding_amount, row.currency)}</td>
                        <td className="px-3 py-3">{row.days_overdue}</td>
                        <td className="px-3 py-3">{row.payment_provider}</td>
                        <td className="px-3 py-3">{row.retry_attempts}</td>
                        <td className="px-3 py-3">{row.account_owner}</td>
                        <td className="px-3 py-3">
                          <StatusPill label={labels.riskLevels[row.risk_classification]} className={RISK_LEVEL_BADGES[row.risk_classification]} />
                        </td>
                        <td className="px-3 py-3">{row.next_step}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="text-gray-600">{labels.actions.retryPayment}</span>
                            <span className="text-gray-600">{labels.actions.contactCustomer}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.enterpriseContracts}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.customer}</th>
                    <th className="px-3 py-2">{labels.table.contractValue}</th>
                    <th className="px-3 py-2">{labels.table.contractStart}</th>
                    <th className="px-3 py-2">{labels.table.contractEnd}</th>
                    <th className="px-3 py-2">{labels.table.renewalDate}</th>
                    <th className="px-3 py-2">{labels.table.paymentTerms}</th>
                    <th className="px-3 py-2">{labels.table.accountManager}</th>
                    <th className="px-3 py-2">{labels.table.expansionOpportunity}</th>
                    <th className="px-3 py-2">{labels.table.contractHealth}</th>
                    <th className="px-3 py-2">{labels.table.upcomingMilestone}</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.contracts.length === 0 ? (
                    <tr><td colSpan={10} className="px-3 py-4 text-gray-500">{labels.emptyState}</td></tr>
                  ) : (
                    derived.contracts.map((row) => (
                      <tr key={row.customer_id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{row.customer}</td>
                        <td className="px-3 py-3">{formatMoney(row.contract_value, row.currency)}</td>
                        <td className="px-3 py-3">{formatDate(row.contract_start)}</td>
                        <td className="px-3 py-3">{formatDate(row.contract_end)}</td>
                        <td className="px-3 py-3">{formatDate(row.renewal_date)}</td>
                        <td className="px-3 py-3">{row.payment_terms}</td>
                        <td className="px-3 py-3">{row.account_manager}</td>
                        <td className="px-3 py-3">
                          <StatusPill label={labels.expansion[row.expansion_opportunity]} className={EXPANSION_BADGES[row.expansion_opportunity]} />
                        </td>
                        <td className="px-3 py-3">
                          <StatusPill label={labels.health[row.contract_health]} className={HEALTH_BAND_BADGES[row.contract_health]} />
                        </td>
                        <td className="px-3 py-3">{row.upcoming_milestone ?? "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.lifecycleTimeline}</h2>
            {derived.timeline.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">{labels.lifecycle.empty}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {derived.timeline.map((event) => (
                  <li key={event.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{event.customer}</p>
                      <p className="mt-1 text-gray-700">{event.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{event.event_type.replace(/_/g, " ")}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(event.occurred_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className={EXECUTIVE_CARD}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{labels.sections.revenueAtRisk}</h2>
              <p className="mt-4 text-3xl font-semibold text-zinc-900">
                {formatMoney(derived.revenueAtRisk.total, derived.revenueAtRisk.currency)}
              </p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">{labels.revenueAtRisk.pastDue}</dt><dd className="font-medium">{formatMoney(derived.revenueAtRisk.past_due, currency)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">{labels.revenueAtRisk.lowHealth}</dt><dd className="font-medium">{formatMoney(derived.revenueAtRisk.low_health, currency)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">{labels.revenueAtRisk.enterpriseRenewals}</dt><dd className="font-medium">{formatMoney(derived.revenueAtRisk.enterprise_renewals, currency)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">{labels.revenueAtRisk.decliningUsage}</dt><dd className="font-medium">{formatMoney(derived.revenueAtRisk.declining_usage, currency)}</dd></div>
              </dl>
            </section>

            <section className={SECTION_CARD}>
              <h2 className="font-semibold text-gray-900">{labels.sections.growthOpportunities}</h2>
              {derived.growth.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">{labels.growth.empty}</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm">
                  {derived.growth.map((item) => (
                    <li key={item.id} className="rounded-lg bg-gray-50 px-4 py-3">
                      <p className="font-medium text-gray-900">{item.customer}</p>
                      <p className="mt-1 text-gray-700">{item.signal}</p>
                      <p className="mt-1 text-xs text-gray-500">{labels.table.recommendation}: {item.recommendation} · {labels.table.priority}: {item.priority}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className={EXECUTIVE_CARD}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{labels.sections.executiveInsights}</h2>
            {derived.insights.length === 0 ? (
              <p className="mt-4 text-sm text-gray-600">{labels.insights.empty}</p>
            ) : (
              <ul className="mt-5 space-y-4">
                {derived.insights.map((insight) => (
                  <li key={insight.id} className="rounded-xl border border-zinc-100 bg-white/80 px-5 py-4">
                    <p className="text-sm font-medium text-zinc-900">{insight.observation}</p>
                    {insight.recommended_action ? (
                      <p className="mt-2 text-sm text-zinc-600">
                        <span className="font-medium">{labels.insights.recommendedAction}:</span> {insight.recommended_action}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={SECTION_CARD}>
            <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2">{labels.table.event}</th>
                    <th className="px-3 py-2">{labels.table.actor}</th>
                    <th className="px-3 py-2">{labels.table.reason}</th>
                    <th className="px-3 py-2">{labels.table.financialImpact}</th>
                    <th className="px-3 py-2">{labels.table.automation}</th>
                    <th className="px-3 py-2">{labels.table.approval}</th>
                    <th className="px-3 py-2">{labels.table.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.audit.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-4 text-gray-500">{labels.emptyState}</td></tr>
                  ) : (
                    derived.audit.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{entry.summary}</td>
                        <td className="px-3 py-3">{entry.actor}</td>
                        <td className="px-3 py-3">{entry.reason}</td>
                        <td className="px-3 py-3">{entry.financial_impact != null ? formatMoney(entry.financial_impact, currency) : "—"}</td>
                        <td className="px-3 py-3">{entry.automation_involved ? "Yes" : "No"}</td>
                        <td className="px-3 py-3">{entry.manual_approval}</td>
                        <td className="px-3 py-3">{formatDate(entry.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6">
        <h2 className="font-semibold text-gray-900">{labels.sections.forecasting}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.forecasting.futureNote}</p>
      </section>
    </div>
  );
}
