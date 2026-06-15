"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildJourneyFilterQuery,
  parseCustomerJourneyAnalytics,
  STAGE_BADGES,
  TREND_ICONS,
  type CustomerJourneyAnalytics,
  type CustomerJourneyAnalyticsLabels,
  type JourneyAnalyticsFilters,
} from "@/lib/customer-journey-analytics";
import type { CompanySize, CustomerSegment, Industry, PlanType } from "@/lib/customer-journey-analytics/constants";

type CustomerJourneyAnalyticsPanelProps = {
  labels: CustomerJourneyAnalyticsLabels;
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

export function CustomerJourneyAnalyticsPanel({
  labels,
  backHref,
}: CustomerJourneyAnalyticsPanelProps) {
  const [center, setCenter] = useState<CustomerJourneyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<JourneyAnalyticsFilters>({});
  const [draftFilters, setDraftFilters] = useState<JourneyAnalyticsFilters>({});

  const load = useCallback(async (activeFilters: JourneyAnalyticsFilters) => {
    setLoading(true);
    const query = buildJourneyFilterQuery(activeFilters);
    const res = await fetch(`/api/customer-journey-analytics/overview${query}`);
    if (res.ok) setCenter(parseCustomerJourneyAnalytics(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      const id = String(payload.id ?? payload.customer_id ?? "action");
      setBusyId(id);
      try {
        const res = await fetch("/api/customer-journey-analytics/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters }),
        });
        if (res.ok) setCenter(parseCustomerJourneyAnalytics(await res.json()));
      } finally {
        setBusyId(null);
      }
    },
    [filters]
  );

  const handleExport = useCallback(
    async (format: "csv" | "xlsx" | "pdf") => {
      setExporting(true);
      try {
        const query = buildJourneyFilterQuery(filters);
        const sep = query ? "&" : "?";
        const res = await fetch(
          `/api/customer-journey-analytics/export${query}${sep}format=${format}`
        );
        if (!res.ok) return;
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `customer-journey-analytics.${format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : "csv"}`;
        a.click();
        URL.revokeObjectURL(url);
      } finally {
        setExporting(false);
      }
    },
    [filters]
  );

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview } = center;
  const selectedCustomerId = filters.customer_id;
  const selectedCustomer = center.journeys.find((j) => j.customer_id === selectedCustomerId);

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
        <p className="mt-2 text-xs text-gray-500">{center.privacy_note}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.country}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder={labels.filters.allCountries}
              value={draftFilters.country ?? ""}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, country: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.industry}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.industry ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  industry: e.target.value as Industry | "",
                }))
              }
            >
              <option value="">{labels.filters.allIndustries}</option>
              {Object.entries(labels.industries).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.companySize}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.company_size ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  company_size: e.target.value as CompanySize | "",
                }))
              }
            >
              <option value="">{labels.filters.allSizes}</option>
              {Object.entries(labels.companySizes).map(([key, label]) => (
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
                  plan: e.target.value as PlanType | "",
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
            <span className="text-xs text-gray-500">{labels.filters.customerSegment}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.customer_segment ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  customer_segment: e.target.value as CustomerSegment | "",
                }))
              }
            >
              <option value="">{labels.filters.allSegments}</option>
              {Object.entries(labels.segments).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            onClick={() => setFilters({ ...draftFilters, customer_id: filters.customer_id })}
          >
            {labels.filters.apply}
          </button>
          {selectedCustomerId ? (
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setFilters((prev) => {
                  const next = { ...prev };
                  delete next.customer_id;
                  return next;
                });
                setDraftFilters((prev) => {
                  const next = { ...prev };
                  delete next.customer_id;
                  return next;
                });
              }}
            >
              {labels.filters.clearTimeline}
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={busyId === "recalculate"}
            onClick={() => void handleAction({ action: "recalculate_funnel" })}
          >
            {busyId === "recalculate" ? labels.actions.applying : labels.actions.recalculate}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.newRegistrations} value={overview.new_registrations} />
          <OverviewCard
            label={labels.overview.onboardingCompletionRate}
            value={`${overview.onboarding_completion_rate}%`}
          />
          <OverviewCard
            label={labels.overview.trialConversionRate}
            value={`${overview.trial_conversion_rate}%`}
          />
          <OverviewCard
            label={labels.overview.timeToFirstValue}
            value={`${overview.time_to_first_value_days} ${labels.overview.days}`}
          />
          <OverviewCard
            label={labels.overview.expansionRate}
            value={`${overview.expansion_rate}%`}
          />
          <OverviewCard label={labels.overview.dropOffRate} value={`${overview.drop_off_rate}%`} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900">{labels.sections.funnel}</h2>
          <div className="flex flex-wrap gap-2">
            {(["csv", "xlsx", "pdf"] as const).map((format) => (
              <button
                key={format}
                type="button"
                disabled={exporting}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => void handleExport(format)}
              >
                {exporting ? labels.exports.exporting : labels.exports[format === "xlsx" ? "excel" : format]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-3 pr-4">{labels.funnel.from}</th>
                <th className="py-3 pr-4">{labels.funnel.to}</th>
                <th className="py-3 pr-4">{labels.funnel.entered}</th>
                <th className="py-3 pr-4">{labels.funnel.converted}</th>
                <th className="py-3">{labels.funnel.conversionRate}</th>
              </tr>
            </thead>
            <tbody>
              {center.funnel.map((step) => (
                <tr key={`${step.from_stage}-${step.to_stage}`} className="border-b border-gray-50">
                  <td className="py-3 pr-4">{labels.stages[step.from_stage]}</td>
                  <td className="py-3 pr-4">{labels.stages[step.to_stage]}</td>
                  <td className="py-3 pr-4">{step.entered}</td>
                  <td className="py-3 pr-4">{step.converted}</td>
                  <td className="py-3 font-medium text-gray-900">{step.conversion_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.dropOffs}</h2>
        {center.drop_offs.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-3 pr-4">{labels.table.customer}</th>
                  <th className="py-3 pr-4">{labels.table.dropOffType}</th>
                  <th className="py-3 pr-4">{labels.table.stage}</th>
                  <th className="py-3 pr-4">{labels.table.message}</th>
                  <th className="py-3">{labels.actions.resolve}</th>
                </tr>
              </thead>
              <tbody>
                {center.drop_offs.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4">{row.customer}</td>
                    <td className="py-3 pr-4">{labels.dropOffTypes[row.drop_off_type]}</td>
                    <td className="py-3 pr-4">{labels.stages[row.stage as keyof typeof labels.stages] ?? row.stage}</td>
                    <td className="py-3 pr-4 text-gray-600">{row.message}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({
                            action: "resolve_drop_off",
                            id: row.id,
                            customer_id: row.customer_id,
                          })
                        }
                      >
                        {busyId === row.id ? labels.actions.applying : labels.actions.resolve}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.journeys}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-3 pr-4">{labels.table.company}</th>
                <th className="py-3 pr-4">{labels.table.currentStage}</th>
                <th className="py-3 pr-4">{labels.table.trend}</th>
                <th className="py-3 pr-4">{labels.table.lastActivity}</th>
                <th className="py-3 pr-4">{labels.table.subscriptionPlan}</th>
                <th className="py-3 pr-4">{labels.table.milestones}</th>
                <th className="py-3">{labels.actions.viewJourney}</th>
              </tr>
            </thead>
            <tbody>
              {center.journeys.map((row) => (
                <tr key={row.customer_id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-900">{row.company}</td>
                  <td className="py-3 pr-4">
                    <StatusPill
                      label={labels.stages[row.current_stage]}
                      className={STAGE_BADGES[row.current_stage]}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    {TREND_ICONS[row.trend]} {labels.trends[row.trend]}
                  </td>
                  <td className="py-3 pr-4">{formatDate(row.last_activity)}</td>
                  <td className="py-3 pr-4">{row.subscription_plan}</td>
                  <td className="py-3 pr-4">{row.milestones_completed}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, customer_id: row.customer_id }))
                      }
                    >
                      {labels.actions.viewJourney}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          {labels.sections.timeline}
          {selectedCustomer ? ` — ${selectedCustomer.company}` : ""}
        </h2>
        {center.timeline.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {center.timeline.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{labels.stages[event.stage]}</p>
                  {event.customer ? (
                    <p className="text-xs text-gray-500">{event.customer}</p>
                  ) : null}
                  {event.delay_days > 0 ? (
                    <p className="text-xs text-amber-700">
                      {labels.table.delayDays}: {event.delay_days}
                    </p>
                  ) : null}
                  {event.support_interaction ? (
                    <p className="text-xs text-gray-500">{labels.table.supportInteraction}</p>
                  ) : null}
                </div>
                <time className="text-xs text-gray-500">{formatDate(event.completed_at)}</time>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.commonPaths}</h2>
        <div className="mt-4 space-y-3">
          {center.common_paths.map((path) => (
            <div
              key={path.id}
              className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-gray-900">{path.path_label}</p>
                <span className="text-sm font-semibold text-indigo-700">
                  {path.conversion_rate}% · {path.customer_count} {labels.table.customers.toLowerCase()}
                </span>
              </div>
              {path.abandonment_point ? (
                <p className="mt-1 text-xs text-amber-700">
                  {labels.table.abandonmentPoint}:{" "}
                  {labels.stages[path.abandonment_point as keyof typeof labels.stages] ??
                    path.abandonment_point}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.recommendations}</h2>
        <div className="mt-4 space-y-3">
          {center.recommendations.map((rec) => (
            <div key={rec.id} className="rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{rec.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{rec.summary}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.recommendationTypes[rec.recommendation_type]} · {labels.table.impactScore}:{" "}
                    {rec.impact_score}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === rec.id}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                    onClick={() =>
                      void handleAction({ action: "accept_recommendation", id: rec.id })
                    }
                  >
                    {busyId === rec.id ? labels.actions.applying : labels.actions.accept}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === rec.id}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    onClick={() =>
                      void handleAction({ action: "dismiss_recommendation", id: rec.id })
                    }
                  >
                    {labels.actions.dismiss}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-4 space-y-2">
          {center.audit.map((entry) => (
            <li key={entry.id} className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="text-gray-800">{entry.summary}</span>
              <time className="text-xs text-gray-500">{formatDate(entry.created_at)}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
