"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseEnterpriseDigitalTwinCenter,
  type EnterpriseDigitalTwinCenter,
} from "@/lib/aipify/enterprise-digital-twin-future-modeling-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "completed":
    case "validated":
    case "open":
      return "bg-emerald-100 text-emerald-800";
    case "running":
    case "draft":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "failed":
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function EnterpriseDigitalTwinDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseDigitalTwinCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-digital-twin-future-modeling-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseDigitalTwinCenter(await res.json()));
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
    const res = await fetch("/api/aipify/enterprise-digital-twin-future-modeling-engine/actions", {
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
  const exec = center.executive_dashboard ?? {};
  const governance = center.governance ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricCoverage, metricValue(overview.twin_coverage_percent)],
            [labels.metricAccuracy, metricValue(overview.simulation_accuracy_percent)],
            [labels.metricModels, metricValue(overview.available_models)],
            [labels.metricActiveSimulations, metricValue(overview.active_simulations)],
            [labels.metricScenarios, metricValue(overview.future_scenarios)],
            [labels.metricRiskModels, metricValue(overview.risk_models)],
            [labels.metricHealth, metricValue(overview.twin_health_score)],
            [labels.metricForecastAccuracy, metricValue(overview.forecast_accuracy_percent)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.simulation_lab_route ? (
            <Link href={center.simulation_lab_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openSimulationLab}
            </Link>
          ) : null}
          {center.decisions_route ? (
            <Link href={center.decisions_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openDecisions}
            </Link>
          ) : null}
          {center.legacy_twin_route ? (
            <Link href={center.legacy_twin_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openProcessTwin}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="organization" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.organizationTitle}</h2>
        {center.organization_models?.length ? (
          <ul className="mt-4 space-y-3">
            {center.organization_models.map((m) => (
              <li key={m.id ?? m.model_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{m.model_title}</p>
                <p className="text-xs text-gray-500">
                  {m.model_type} · {m.entity_count} {labels.entitiesLabel} · {m.coverage_percent}% {labels.coverageLabel}
                </p>
                {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noOrganization}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="operational" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.operationalTitle}</h2>
          {center.operational_models?.length ? (
            <ul className="mt-4 space-y-3">
              {center.operational_models.map((m) => (
                <li key={m.id ?? m.model_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{m.model_title}</p>
                  <p className="text-xs text-gray-500">
                    {m.model_type} · {labels.maturityLabel} {m.maturity_score}%
                  </p>
                  {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noOperational}</p>
          )}
        </section>

        <section id="financial" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.financialTitle}</h2>
          {center.financial_models?.length ? (
            <ul className="mt-4 space-y-3">
              {center.financial_models.map((m) => (
                <li key={m.id ?? m.model_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{m.model_title}</p>
                  <p className="text-xs text-gray-500">
                    {m.model_type} · {labels.confidenceLabel} {m.confidence}
                  </p>
                  {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noFinancial}</p>
          )}
        </section>
      </div>

      <section id="workforce" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.workforceTitle}</h2>
        {center.workforce_models?.length ? (
          <ul className="mt-4 space-y-3">
            {center.workforce_models.map((m) => (
              <li key={m.id ?? m.model_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{m.model_title}</p>
                <p className="text-xs text-gray-500">
                  {m.model_type} · {m.utilization_percent}% {labels.utilizationLabel} · {m.headcount} {labels.headcountLabel}
                </p>
                {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noWorkforce}</p>
        )}
      </section>

      <section id="simulation-lab" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.simulationLabTitle}</h2>
        {center.simulations?.length ? (
          <ul className="mt-4 space-y-3">
            {center.simulations.map((s) => (
              <li key={s.id ?? s.simulation_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{s.simulation_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(s.status)}`}>{s.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {s.simulation_type} · {s.scenario_type} · {s.forecast_horizon}
                </p>
                {s.outcome_summary ? <p className="mt-1 text-sm text-gray-600">{s.outcome_summary}</p> : null}
                {s.status === "draft" ? (
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => void runAction("run_simulation", { simulation_key: s.simulation_key })}
                    className="mt-2 rounded bg-slate-800 px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    {labels.runSimulation}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noSimulations}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("create_simulation", {
                simulation_title: "Growth capacity simulation",
                simulation_type: "growth",
                scenario_type: "expected_case",
                forecast_horizon: "90_days",
              })
            }
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.createSimulation}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("create_scenario", {
                scenario_title: "Regional expansion decision model",
                decision_type: "expansion",
                scenario_type: "expected_case",
              })
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.createScenario}
          </button>
        </div>
      </section>

      <section id="future-modeling" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.futureModelingTitle}</h2>
        {center.forecasts?.length ? (
          <ul className="mt-4 space-y-3">
            {center.forecasts.map((f) => (
              <li key={f.id ?? f.forecast_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{f.forecast_title}</p>
                <p className="text-xs text-gray-500">
                  {f.forecast_type} · {f.horizon} · {labels.confidenceLabel} {f.confidence}
                </p>
                {f.assumptions ? <p className="mt-1 text-sm text-gray-600">{f.assumptions}</p> : null}
                {f.disclaimer ? <p className="mt-1 text-xs italic text-gray-500">{f.disclaimer}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noForecasts}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("generate_forecast", {
                forecast_title: "12-month revenue outlook",
                forecast_type: "revenue",
                horizon: "12_months",
              })
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.generateForecast}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("run_stress_test", {
                stress_title: "Revenue decline stress test",
                stress_type: "revenue_decline",
                severity: "high",
              })
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.runStressTest}
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.scenariosTitle}</h2>
          {center.scenarios?.length ? (
            <ul className="mt-4 space-y-3">
              {center.scenarios.map((s) => (
                <li key={s.id ?? s.scenario_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.scenario_title}</p>
                  <p className="text-xs text-gray-500">
                    {s.decision_type} · {s.scenario_type}
                  </p>
                  {s.impact_summary ? <p className="mt-1 text-sm text-gray-600">{s.impact_summary}</p> : null}
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noScenarios}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.stressTestsTitle}</h2>
          {center.stress_tests?.length ? (
            <ul className="mt-4 space-y-3">
              {center.stress_tests.map((s) => (
                <li key={s.id ?? s.stress_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.stress_title}</p>
                  <p className="text-xs text-gray-500">
                    {s.stress_type} · {labels.resilienceLabel} {s.resilience_score}
                  </p>
                  {s.outcome_summary ? <p className="mt-1 text-sm text-gray-600">{s.outcome_summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noStressTests}</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.riskModelsTitle}</h2>
        {center.risk_models?.length ? (
          <ul className="mt-4 space-y-3">
            {center.risk_models.map((r) => (
              <li key={r.id ?? r.risk_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{r.risk_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(r.exposure_level)}`}>
                    {r.exposure_level}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{r.risk_type}</p>
                {r.mitigation_summary ? <p className="mt-1 text-sm text-gray-600">{r.mitigation_summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noRiskModels}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.impact ? <p className="mt-1 text-sm text-gray-600">{s.impact}</p> : null}
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
          {center.advisor_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.governanceForecastsNotGuarantees}</li>
          <li>{labels.governanceSimulationsIdentified}</li>
          <li>{labels.governanceHumanOwnership}</li>
          <li>{labels.governanceAssumptionsTransparent}</li>
          <li>{labels.governanceHumanOverride}</li>
        </ul>
        {governance.forecasts_not_guarantees ? (
          <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
        ) : null}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("validate_twin")}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.validateTwin}
        </button>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("refresh_analytics")}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {String(exec.future_outlook ?? "—")} · {labels.growthLabel}{" "}
          {String(exec.growth_forecast ?? "—")} · {labels.riskLabel} {String(exec.risk_forecast ?? "—")} ·{" "}
          {labels.revenueLabel} {String(exec.revenue_outlook ?? "—")}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
