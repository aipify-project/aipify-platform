"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseEnterpriseStrategicIntelligenceAdvisoryCenter,
  type EnterpriseStrategicIntelligenceAdvisoryCenter,
} from "@/lib/aipify/enterprise-strategic-intelligence-advisory-engine";

type Props = { labels: Record<string, string> };

function formatCurrency(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function EnterpriseStrategicIntelligenceAdvisoryDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseStrategicIntelligenceAdvisoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-strategic-intelligence-advisory-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseStrategicIntelligenceAdvisoryCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-strategic-intelligence-advisory-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricObjectives, formatOverviewMetric(overview.strategic_objectives)],
            [labels.metricInitiatives, formatOverviewMetric(overview.key_initiatives)],
            [labels.metricRisks, formatOverviewMetric(overview.business_risks)],
            [labels.metricOpportunities, formatOverviewMetric(overview.growth_opportunities)],
            [labels.metricPriorities, formatOverviewMetric(overview.executive_priorities)],
            [labels.metricForecastConfidence, `${formatOverviewMetric(overview.forecast_confidence)}%`],
            [labels.metricHealth, formatOverviewMetric(overview.strategic_health_score)],
            [labels.metricGrowthOutlook, formatExecutiveMetric(overview.growth_outlook)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold capitalize text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openBriefings, ops.briefings_route],
            [labels.openRisk, ops.risk_route],
            [labels.openOpportunity, ops.opportunity_route],
            [labels.openForecast, ops.forecast_route],
            [labels.openScenario, ops.scenario_route],
            [labels.openDecisionSupport, ops.decision_support_route],
            [labels.openExecutive, ops.executive_route],
            [labels.openScenarioPlanning, ops.scenario_planning_route],
            [labels.openExecutiveForesight, ops.executive_foresight_route],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_briefing", { briefing_type: "weekly" })}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.generateBriefing}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_forecast", { forecast_category: "revenue" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
          >
            {labels.generateForecast}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("create_scenario", { scenario_type: "expected_case" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
          >
            {labels.createScenario}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_decision_report")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
          >
            {labels.generateDecisionReport}
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="briefings" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.briefingsTitle}</h2>
          {center.briefings?.length ? (
            <ul className="mt-4 space-y-3">
              {center.briefings.map((b) => (
                <li key={b.id ?? b.briefing_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{b.briefing_title}</p>
                  <p className="text-xs uppercase text-gray-500">{b.briefing_type}</p>
                  {b.executive_summary ? <p className="mt-1 text-sm text-gray-600">{b.executive_summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noBriefings}</p>
          )}
        </section>

        <section id="intelligence" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.objectivesTitle}</h2>
          {center.objectives?.length ? (
            <ul className="mt-4 space-y-3">
              {center.objectives.map((o) => (
                <li key={o.id ?? o.objective_key} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{o.objective_title}</p>
                    <span className="text-sm text-gray-500">{o.progress_percent}%</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {o.owner_name} · {o.timeline_label}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noObjectives}</p>
          )}
        </section>

        <section id="risks" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.risksTitle}</h2>
          {center.risks?.length ? (
            <ul className="mt-4 space-y-3">
              {center.risks.map((r) => (
                <li key={r.id ?? r.risk_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{r.risk_title}</p>
                  <p className="text-xs uppercase text-gray-500">
                    {r.risk_category} · {r.severity}
                  </p>
                  {r.impact_summary ? <p className="mt-1 text-sm text-gray-600">{r.impact_summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noRisks}</p>
          )}
        </section>

        <section id="opportunities" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.opportunitiesTitle}</h2>
          {center.opportunities?.length ? (
            <ul className="mt-4 space-y-3">
              {center.opportunities.map((o) => (
                <li key={o.id ?? o.opportunity_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{o.opportunity_title}</p>
                  <p className="text-xs uppercase text-gray-500">
                    {o.opportunity_category} · {o.potential_impact}
                  </p>
                  {o.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {o.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noOpportunities}</p>
          )}
        </section>

        <section id="forecasts" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.forecastsTitle}</h2>
          {center.forecasts?.length ? (
            <ul className="mt-4 space-y-3">
              {center.forecasts.map((f) => (
                <li key={f.id ?? f.forecast_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{f.forecast_title}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(Number(f.projected_value ?? 0), "en-US")} · {f.confidence_percent}% · {f.trend_direction}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noForecasts}</p>
          )}
        </section>

        <section id="scenarios" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.scenariosTitle}</h2>
          {center.scenarios?.length ? (
            <ul className="mt-4 space-y-3">
              {center.scenarios.map((s) => (
                <li key={s.id ?? s.scenario_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.scenario_title}</p>
                  <p className="text-xs uppercase text-gray-500">
                    {s.scenario_type} · {s.probability_percent}%
                  </p>
                  {s.outcome_summary ? <p className="mt-1 text-sm text-gray-600">{s.outcome_summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noScenarios}</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.prioritiesTitle}</h2>
        {center.priorities?.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.priorities.map((p) => (
              <li key={p.id ?? p.priority_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{p.priority_title}</p>
                <p className="text-xs text-gray-500">
                  {p.owner_name} · {p.business_impact}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noPriorities}</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        {center.advisor_signals?.length ? (
          <ul className="mt-4 space-y-4">
            {center.advisor_signals.map((s) => (
              <li key={s.id ?? s.observation} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="font-medium text-gray-900">{s.observation}</p>
                {s.impact ? <p className="mt-1 text-sm text-gray-600">{s.impact}</p> : null}
                {s.recommendation ? (
                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {labels.recommendation}: {s.recommendation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAdvisorSignals}</p>
        )}
      </section>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">{center.abos_principle}</p>
        <p className="mt-2 text-sm text-gray-500">{center.privacy_note}</p>
        {center.decision_reports?.length ? (
          <ul className="mt-4 space-y-2">
            {center.decision_reports.map((r) => (
              <li key={r.id ?? r.report_key} className="text-sm text-gray-700">
                <span className="font-medium">{r.report_title}</span>
                {r.recommendation ? ` — ${r.recommendation}` : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
