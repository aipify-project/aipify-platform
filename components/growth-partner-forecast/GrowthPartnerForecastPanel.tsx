"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  parseGrowthPartnerForecastCenter,
  type ForecastScenario,
  type ForecastSurface,
  type GrowthPartnerForecastCenter,
  type GrowthPartnerForecastLabels,
} from "@/lib/growth-partner-forecast";

type GrowthPartnerForecastPanelProps = {
  surface: ForecastSurface;
  labels: GrowthPartnerForecastLabels;
  backHref: string;
};

function formatCurrency(value: number, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value);
}

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function GrowthPartnerForecastPanel({
  surface,
  labels,
  backHref,
}: GrowthPartnerForecastPanelProps) {
  const [center, setCenter] = useState<GrowthPartnerForecastCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [assumptions, setAssumptions] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/growth-partner-forecast/overview?surface=${surface}`);
    if (res.ok) {
      const parsed = parseGrowthPartnerForecastCenter(await res.json());
      setCenter(parsed);
      if (parsed.probability_assumptions) {
        setAssumptions(
          Object.fromEntries(
            Object.entries(parsed.probability_assumptions).map(([k, v]) => [k, String(v)])
          )
        );
      }
    }
    setLoading(false);
  }, [surface]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const id = String(payload.format ?? payload.goal_period ?? action);
      setBusyId(id);
      try {
        const res = await fetch("/api/growth-partner-forecast/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, payload, surface }),
        });
        const data = (await res.json()) as { center?: GrowthPartnerForecastCenter };
        if (data.center) setCenter(data.center);
        else await load();
      } finally {
        setBusyId(null);
      }
    },
    [load, surface]
  );

  const scenariosByPeriod = useMemo(() => {
    if (!center?.scenarios) return new Map<string, ForecastScenario[]>();
    const map = new Map<string, ForecastScenario[]>();
    for (const scenario of center.scenarios) {
      const list = map.get(scenario.forecast_period) ?? [];
      list.push(scenario);
      map.set(scenario.forecast_period, list);
    }
    return map;
  }, [center?.scenarios]);

  if (loading && !center) {
    return <p className="text-sm text-gray-600">{labels.loading}</p>;
  }

  if (!center?.has_access) {
    return <p className="text-sm text-gray-600">{labels.emptyState}</p>;
  }

  const overview = center.overview;
  const pipeline = center.pipeline;
  const isSuper = surface === "super";

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          </div>
          <Link href={backHref} className="text-sm text-indigo-700 hover:text-indigo-900">
            {labels.back}
          </Link>
        </div>
        {center.principle ? (
          <p className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
            {center.principle}
          </p>
        ) : null}
      </header>

      {!isSuper && overview ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.sections.overview}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <OverviewCard
              label={labels.overview.forecastedMonthlyRevenue}
              value={formatCurrency(overview.forecasted_monthly_revenue)}
            />
            <OverviewCard
              label={labels.overview.forecastedAnnualRevenue}
              value={formatCurrency(overview.forecasted_annual_revenue)}
            />
            <OverviewCard
              label={labels.overview.activeOpportunitiesValue}
              value={formatCurrency(overview.active_opportunities_value)}
            />
            <OverviewCard
              label={labels.overview.expectedCommissions}
              value={formatCurrency(overview.expected_commissions)}
            />
            <OverviewCard
              label={labels.overview.renewalOpportunities}
              value={overview.renewal_opportunities}
            />
            <OverviewCard
              label={labels.overview.expansionOpportunities}
              value={overview.expansion_opportunities}
            />
          </dl>
        </section>
      ) : null}

      {isSuper && center.partners && center.partners.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.overview}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-4">{labels.table.company}</th>
                  <th className="py-2 pr-4">{labels.overview.forecastedAnnualRevenue}</th>
                  <th className="py-2">{labels.overview.weightedPipeline}</th>
                </tr>
              </thead>
              <tbody>
                {center.partners.map((partner) => (
                  <tr key={partner.tenant_id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">{partner.tenant_id.slice(0, 8)}…</td>
                    <td className="py-3 pr-4">{formatCurrency(partner.forecasted_annual)}</td>
                    <td className="py-3">{formatCurrency(partner.weighted_pipeline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {!isSuper && pipeline ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.pipeline}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.qualifiedPipeline} value={formatCurrency(pipeline.qualified)} />
            <OverviewCard label={labels.overview.proposalStage} value={formatCurrency(pipeline.proposal_stage)} />
            <OverviewCard label={labels.overview.negotiationStage} value={formatCurrency(pipeline.negotiation_stage)} />
            <OverviewCard label={labels.overview.weightedPipeline} value={formatCurrency(pipeline.weighted_value)} />
          </dl>
          {pipeline.opportunities.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">{labels.table.company}</th>
                    <th className="py-2 pr-4">{labels.table.stage}</th>
                    <th className="py-2 pr-4">{labels.table.value}</th>
                    <th className="py-2 pr-4">{labels.table.weighted}</th>
                    <th className="py-2">{labels.table.closeDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.opportunities.map((opp) => (
                    <tr key={opp.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{opp.company_name}</td>
                      <td className="py-3 pr-4">{labels.pipelineStages[opp.pipeline_stage]}</td>
                      <td className="py-3 pr-4">{formatCurrency(opp.estimated_value)}</td>
                      <td className="py-3 pr-4">{formatCurrency(opp.weighted_value)}</td>
                      <td className="py-3 text-gray-600">{opp.expected_close_date ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}

      {!isSuper && center.renewals && center.renewals.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.renewals}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-4">{labels.table.customer}</th>
                  <th className="py-2 pr-4">{labels.table.renewalDate}</th>
                  <th className="py-2 pr-4">{labels.table.value}</th>
                  <th className="py-2 pr-4">{labels.table.probability}</th>
                </tr>
              </thead>
              <tbody>
                {center.renewals.map((renewal) => (
                  <tr
                    key={renewal.id}
                    className={`border-b border-gray-50 ${renewal.requires_attention ? "bg-amber-50/50" : ""}`}
                  >
                    <td className="py-3 pr-4 font-medium text-gray-900">{renewal.customer_name}</td>
                    <td className="py-3 pr-4">{renewal.renewal_date}</td>
                    <td className="py-3 pr-4">{formatCurrency(renewal.renewal_value)}</td>
                    <td className="py-3 pr-4">{renewal.renewal_probability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {!isSuper && center.expansions && center.expansions.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.expansions}</h2>
          <ul className="mt-4 space-y-3">
            {center.expansions.map((expansion) => (
              <li key={expansion.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{expansion.customer_name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.expansionTypes[expansion.expansion_type]}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-gray-900">{formatCurrency(expansion.estimated_value)}</p>
                    <p className="text-gray-500">
                      {labels.table.probability}: {expansion.probability}%
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!isSuper && center.goals && center.goals.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.goals}</h2>
          <ul className="mt-4 space-y-4">
            {center.goals.map((goal) => (
              <li key={goal.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {labels.goalPeriods[goal.goal_period]} · {goal.period_key}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatCurrency(goal.current_revenue)} / {formatCurrency(goal.target_revenue)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-700">{goal.progress_pct}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar pct={goal.progress_pct} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!isSuper && center.scenarios && center.scenarios.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.scenarios}</h2>
          <div className="mt-4 space-y-6">
            {(center.forecast_periods ?? []).map((period) => {
              const rows = scenariosByPeriod.get(period);
              if (!rows?.length) return null;
              return (
                <div key={period}>
                  <h3 className="text-sm font-semibold text-gray-700">
                    {labels.forecastPeriods[period] ?? period}
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {rows.map((scenario) => (
                      <div
                        key={`${scenario.scenario_key}-${scenario.forecast_period}`}
                        className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                      >
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {labels.scenarios[scenario.scenario_key]}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-gray-900">
                          {formatCurrency(scenario.projected_revenue)}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          {labels.table.commissions}: {formatCurrency(scenario.projected_commissions)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {center.recommendations && center.recommendations.length > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h2 className="text-lg font-semibold text-indigo-950">{labels.sections.recommendations}</h2>
          <ul className="mt-3 space-y-2 text-sm text-indigo-900">
            {center.recommendations.map((rec) => (
              <li key={rec.key} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{labels.recommendations[rec.message_key as keyof typeof labels.recommendations] ?? rec.message_key}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {isSuper && center.probability_assumptions ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.probabilities}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(labels.probabilities).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="font-medium text-gray-700">{label}</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={assumptions[key] ?? ""}
                  onChange={(e) => setAssumptions((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={busyId === "assumptions"}
            onClick={() =>
              handleAction("update_assumptions", {
                discovery: Number(assumptions.discovery),
                demonstration: Number(assumptions.demonstration),
                proposal: Number(assumptions.proposal),
                negotiation: Number(assumptions.negotiation),
                verbal_agreement: Number(assumptions.verbal_agreement),
              })
            }
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {labels.quickActions.regenerate}
          </button>
        </section>
      ) : null}

      {!isSuper ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.reporting}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {(["pdf", "excel", "csv"] as const).map((format) => (
              <button
                key={format}
                type="button"
                disabled={busyId === format}
                onClick={() => handleAction("export_report", { format })}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {format === "pdf"
                  ? labels.quickActions.exportPdf
                  : format === "excel"
                    ? labels.quickActions.exportExcel
                    : labels.quickActions.exportCsv}
              </button>
            ))}
            <button
              type="button"
              disabled={busyId === "generate_forecast"}
              onClick={() => handleAction("generate_forecast")}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {labels.quickActions.regenerate}
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">{labels.youDecide}</p>
        </section>
      ) : null}

      {center.audit && center.audit.length > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.audit.map((entry) => (
              <li key={entry.id} className="border-b border-gray-50 pb-2">
                <span className="font-medium text-gray-800">{entry.summary}</span>
                <span className="ml-2 text-xs text-gray-400">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
