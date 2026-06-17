"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parsePartnerCommissionsDashboard,
  parsePartnerCommissionsForecast,
  parsePartnerCommissionsMilestones,
  parsePartnerCommissionsSummary,
  type PartnerCommissionRecord,
  type PartnerCommissionsDashboard,
  type PartnerCommissionsForecast,
  type PartnerCommissionsMilestones,
  type PartnerCommissionsSummary,
} from "@/lib/partner-commissions";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function formatMoney(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PartnerCommissionsPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PartnerCommissionsDashboard | null>(null);
  const [summary, setSummary] = useState<PartnerCommissionsSummary | null>(null);
  const [milestones, setMilestones] = useState<PartnerCommissionsMilestones | null>(null);
  const [forecast, setForecast] = useState<PartnerCommissionsForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [customer, setCustomer] = useState("");
  const [pkg, setPkg] = useState("");
  const [status, setStatus] = useState("");
  const [tier, setTier] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [search, setSearch] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (customer.trim()) params.set("customer", customer.trim());
    if (pkg) params.set("package", pkg);
    if (status) params.set("status", status);
    if (tier) params.set("tier", tier);
    if (amountMin) params.set("amount_min", amountMin);
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  }, [amountMin, customer, pkg, search, status, tier]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setDenied(false);
    try {
      const dashRes = await fetch(`/api/partner/commissions${queryString ? `?${queryString}` : ""}`);
      const dashJson = dashRes.ok ? await dashRes.json() : null;
      if (!dashJson?.has_access) {
        setDenied(true);
        setLoading(false);
        return;
      }
      setDashboard(parsePartnerCommissionsDashboard(dashJson));

      const [sumRes, mileRes, foreRes] = await Promise.all([
        fetch("/api/partner/commissions/summary"),
        fetch("/api/partner/commissions/milestones"),
        fetch("/api/partner/commissions/forecast"),
      ]);
      if (sumRes.ok) setSummary(parsePartnerCommissionsSummary(await sumRes.json()));
      if (mileRes.ok) setMilestones(parsePartnerCommissionsMilestones(await mileRes.json()));
      if (foreRes.ok) setForecast(parsePartnerCommissionsForecast(await foreRes.json()));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  const recalculate = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/commissions/recalculate", { method: "POST" });
    if (res.ok) {
      setDashboard(parsePartnerCommissionsDashboard(await res.json()));
      setMessage(labels.recalculated);
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading && !dashboard) {
    return (
      <div className="space-y-3">
        <AipifyLoader centered />
        <p className="text-center text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (denied) {
    return (
      <PlatformEmptyState title={labels.accessDenied} message={labels.subtitle} />
    );
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const showEmpty = dashboard.records.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{labels.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
        </div>
        {Boolean(dashboard.access.can_recalculate) && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void recalculate()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {labels.recalculate}
          </button>
        )}
      </div>

      {showEmpty && (
        <PlatformEmptyState
          title={labels.emptyTitle}
          message={labels.emptyMessage}
          primaryAction={{
            label: labels.viewOpportunities,
            href: "/partner/opportunities",
          }}
        />
      )}

      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-indigo-900">{labels.renewalNote}</p>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label={labels.currentLevel} value={dashboard.current_commission_level} />
        <MetricCard label={labels.currentRate} value={`${dashboard.current_commission_rate_pct}%`} />
        <MetricCard label={labels.thisMonthEarnings} value={formatMoney(dashboard.this_month_earnings)} />
        <MetricCard label={labels.pendingCommissions} value={formatMoney(dashboard.pending_commissions)} />
        <MetricCard label={labels.approvedCommissions} value={formatMoney(dashboard.approved_commissions)} />
        <MetricCard label={labels.paidCommissions} value={formatMoney(dashboard.paid_commissions)} />
      </dl>

      <section className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6">
        <h3 className="font-semibold text-slate-900">{labels.milestoneTitle}</h3>
        <p className="mt-2 text-sm text-slate-700">{dashboard.milestone.milestone_message}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
          <div>
            <dt className="text-slate-500">{labels.nextMilestone}</dt>
            <dd className="font-medium text-slate-900">{dashboard.milestone.next_tier || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{labels.salesRemaining}</dt>
            <dd className="font-medium text-slate-900">{dashboard.milestone.sales_remaining}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{labels.potentialIncrease}</dt>
            <dd className="font-medium text-slate-900">
              +{dashboard.milestone.potential_commission_increase_pct}%
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.motivationTitle}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>{dashboard.motivation.current_performance}</li>
            <li>{dashboard.motivation.next_goal}</li>
            <li>{dashboard.motivation.potential_earnings_note}</li>
            <li>{dashboard.motivation.leaderboard_position}</li>
          </ul>
        </div>
        {forecast && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">{labels.forecastTitle}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">{labels.estimatedEarnings}</dt>
                <dd className="font-medium">{formatMoney(forecast.estimated_earnings)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">{labels.tierProjection}</dt>
                <dd className="font-medium">{forecast.tier_projection}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">{labels.salesNeeded}</dt>
                <dd className="font-medium">{forecast.sales_needed}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-indigo-800">{forecast.forecast_note}</p>
          </div>
        )}
      </section>

      {summary && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.insightsTitle}</h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <dt className="text-slate-500">{labels.bestMonth}</dt>
              <dd className="font-medium">{summary.performance_insights.best_performing_month}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.averageSale}</dt>
              <dd className="font-medium">{formatMoney(summary.performance_insights.average_sale_value)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.conversionRate}</dt>
              <dd className="font-medium">{summary.performance_insights.conversion_rate_pct}%</dd>
            </div>
            <div>
              <dt className="text-slate-500">{labels.tierProgress}</dt>
              <dd className="font-medium">{summary.performance_insights.tier_progress_pct}%</dd>
            </div>
          </dl>
        </section>
      )}

      {milestones && milestones.tiers.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.milestoneTitle}</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Tier</th>
                  <th className="px-3 py-2">Sales</th>
                  <th className="px-3 py-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                {milestones.tiers.map((t) => (
                  <tr key={t.tier_number} className="border-b border-slate-100">
                    <td className="px-3 py-2">{t.tier_label}</td>
                    <td className="px-3 py-2">
                      {t.min_sales}
                      {t.max_sales != null ? `–${t.max_sales}` : "+"}
                    </td>
                    <td className="px-3 py-2">{t.commission_rate_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">{labels.searchFilters}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder={labels.filterCustomer}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={pkg}
            onChange={(e) => setPkg(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterPackage}</option>
            {dashboard.filters.packages.map((p) => (
              <option key={p} value={p}>
                {labelFor(labels, "package", p)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterStatus}</option>
            {dashboard.filters.statuses.map((s) => (
              <option key={s} value={s}>
                {labelFor(labels, "status", s)}
              </option>
            ))}
          </select>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">{labels.filterTier}</option>
            {dashboard.filters.tiers.map((t) => (
              <option key={t} value={String(t)}>
                Tier {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
            placeholder={labels.filterAmountMin}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </section>

      {!showEmpty && (
        <section className="space-y-3">
          <h3 className="font-semibold text-slate-900">{labels.recordsTitle}</h3>
          {dashboard.records.map((record) => (
            <CommissionRecordRow
              key={record.id}
              record={record}
              labels={labels}
              expanded={expandedId === record.id}
              onToggle={() => setExpandedId(expandedId === record.id ? null : record.id)}
            />
          ))}
        </section>
      )}

      {dashboard.timeline.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">{labels.timelineTitle}</h3>
          <ul className="mt-4 space-y-3">
            {dashboard.timeline.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-slate-600">{item.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function CommissionRecordRow({
  record,
  labels,
  expanded,
  onToggle,
}: {
  record: PartnerCommissionRecord;
  labels: Record<string, string>;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{record.customer}</p>
          <p className="text-sm text-slate-600">
            {record.sale_reference} · {record.package} · {record.record_date}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-900">
            {record.commission_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-slate-600">
            {record.commission_rate_pct}% · {labelFor(labels, "status", record.status)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="mt-3 text-sm font-medium text-indigo-700 hover:underline"
      >
        {labels.explanationTitle}
      </button>
      {expanded && (
        <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          <p>{record.explanation.why_earned}</p>
          <p className="mt-2">{record.explanation.calculation}</p>
          <p className="mt-2 text-xs text-slate-500">{record.explanation.renewal_note}</p>
        </div>
      )}
    </article>
  );
}
