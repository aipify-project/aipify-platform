"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseEnterpriseValueRealizationRoiCenter,
  type EnterpriseValueRealizationRoiCenter,
} from "@/lib/aipify/enterprise-value-realization-roi-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function formatCurrency(value: unknown): string {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function EnterpriseValueRealizationRoiDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseValueRealizationRoiCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-value-realization-roi-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseValueRealizationRoiCenter(await res.json()));
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
    const res = await fetch("/api/aipify/enterprise-value-realization-roi-engine/actions", {
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

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/40 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricEstimatedValue, formatCurrency(overview.estimated_value_generated)],
            [labels.metricHoursSaved, metricValue(overview.hours_saved)],
            [labels.metricCostsReduced, formatCurrency(overview.costs_reduced)],
            [labels.metricRevenueInfluenced, formatCurrency(overview.revenue_influenced)],
            [labels.metricWorkflowsAutomated, metricValue(overview.workflows_automated)],
            [labels.metricCustomerImpact, metricValue(overview.customer_impact_score)],
            [labels.metricHealth, metricValue(overview.value_health_score)],
            [labels.metricNetRoi, `${metricValue(overview.net_roi_percent)}%`],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        {center.value_engine_route ? (
          <div className="mt-4">
            <Link href={center.value_engine_route} className="inline-flex rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openValueEngine}
            </Link>
          </div>
        ) : null}
      </section>

      <section id="roi" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.roiTitle}</h2>
        {center.roi_metrics?.length ? (
          <ul className="mt-4 space-y-3">
            {center.roi_metrics.map((m) => (
              <li key={m.id ?? m.metric_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{m.metric_title}</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">{m.net_roi_percent}% ROI</span>
                </div>
                <p className="text-xs text-gray-500">
                  {m.period_type} · {labels.savingsLabel} {formatCurrency(m.operational_savings)} · {labels.revenueLabel}{" "}
                  {formatCurrency(m.revenue_impact)}
                </p>
                {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noRoi}</p>
        )}
        <button type="button" disabled={acting} onClick={() => void runAction("calculate_roi")} className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {labels.calculateRoi}
        </button>
      </section>

      <section id="time-savings" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.timeSavingsTitle}</h2>
        {center.time_savings?.length ? (
          <ul className="mt-4 space-y-3">
            {center.time_savings.map((t) => (
              <li key={t.id ?? t.savings_key} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{t.savings_title}</p>
                <p className="text-xs text-gray-500">
                  {t.hours_saved} {labels.hoursLabel} · {t.tasks_automated} {labels.tasksLabel} · {t.category}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noTimeSavings}</p>
        )}
      </section>

      <section id="cost-savings" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.costSavingsTitle}</h2>
        {center.cost_savings?.length ? (
          <ul className="mt-4 space-y-3">
            {center.cost_savings.map((c) => (
              <li key={c.id ?? c.savings_key} className="flex flex-wrap justify-between gap-2 rounded-lg border border-gray-100 p-3 text-sm">
                <span className="font-medium text-gray-900">{c.savings_title}</span>
                <span className="text-gray-600">{formatCurrency(c.amount)} · {c.savings_type}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noCostSavings}</p>
        )}
        <button type="button" disabled={acting} onClick={() => void runAction("record_savings", { savings_title: "Operational savings", amount: 2500 })} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
          {labels.recordSavings}
        </button>
      </section>

      <section id="revenue" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.revenueImpactTitle}</h2>
        {center.revenue_impact?.length ? (
          <ul className="mt-4 space-y-3">
            {center.revenue_impact.map((r) => (
              <li key={r.id ?? r.impact_key} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{r.impact_title}</p>
                <p className="text-xs text-gray-500">{r.impact_type} · {formatCurrency(r.amount)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noRevenueImpact}</p>
        )}
        <button type="button" disabled={acting} onClick={() => void runAction("update_revenue_impact", { impact_title: "Revenue influenced", amount: 10000 })} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
          {labels.updateRevenueImpact}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="workforce" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.workforceImpactTitle}</h2>
          {center.workforce_impact?.length ? (
            <ul className="mt-4 space-y-2">
              {center.workforce_impact.map((w) => (
                <li key={w.id ?? w.impact_key} className="flex justify-between text-sm text-gray-700">
                  <span>{w.impact_title}</span>
                  <span className="text-gray-500">{w.score}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noWorkforceImpact}</p>
          )}
        </section>

        <section id="strategic" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.strategicImpactTitle}</h2>
          {center.strategic_impact?.length ? (
            <ul className="mt-4 space-y-2">
              {center.strategic_impact.map((s) => (
                <li key={s.id ?? s.impact_key} className="flex justify-between text-sm text-gray-700">
                  <span>{s.impact_title}</span>
                  <span className="text-gray-500">{s.score}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noStrategicImpact}</p>
          )}
        </section>
      </div>

      {center.value_timeline?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.timelineTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {center.value_timeline.map((tl) => (
              <li key={tl.id ?? tl.timeline_key} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{tl.period_label?.replace(/_/g, " ")}</p>
                <p className="text-xs text-gray-500">{formatCurrency(tl.estimated_value)} · {tl.roi_percent}% ROI</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.benchmarks?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.benchmarksTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center.benchmarks.map((b) => (
              <li key={b.id ?? b.benchmark_key} className="text-sm text-gray-700">
                <span className="font-medium">{b.benchmark_title}</span>
                <span className="text-xs text-gray-500"> · +{b.variance_percent}%</span>
              </li>
            ))}
          </ul>
          <button type="button" disabled={acting} onClick={() => void runAction("update_benchmark", { benchmark_title: "Custom benchmark" })} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {labels.updateBenchmark}
          </button>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? <p className="mt-1 text-sm text-gray-600">{labels.recommendation}: {s.recommendation}</p> : null}
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
                  {s.recommendation ? <p className="mt-1 text-sm text-gray-600">{labels.recommendation}: {s.recommendation}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.analyticsTitle}</h2>
        {center.value_reports?.length ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-800">{labels.reportsTitle}</h3>
            <ul className="mt-3 space-y-2">
              {center.value_reports.map((r) => (
                <li key={r.id ?? r.report_key} className="text-sm text-gray-700">{r.report_title} · {r.report_type}</li>
              ))}
            </ul>
          </div>
        ) : null}
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
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={acting} onClick={() => void runAction("generate_value_report", { report_type: "executive_roi", report_title: "Executive ROI report" })} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.generateReport}
          </button>
          <button type="button" disabled={acting} onClick={() => void runAction("refresh_analytics")} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {labels.refreshAnalytics}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: ROI {String(exec.roi ?? "—")}% · {labels.impactLabel} {formatCurrency(exec.business_impact)} ·{" "}
          {labels.revenueLabel} {formatCurrency(exec.revenue_impact)} · {labels.savingsLabel} {formatCurrency(exec.cost_savings)}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
