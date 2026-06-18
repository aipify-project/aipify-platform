"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseDigitalWorkforceValueCenter,
  type DigitalWorkforceValueCenter,
} from "@/lib/aipify/digital-workforce-value-engine";

type Props = { labels: Record<string, string> };

function formatCurrency(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function DigitalWorkforceValueEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<DigitalWorkforceValueCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/digital-workforce-value-engine/dashboard");
    if (res.ok) {
      setCenter(parseDigitalWorkforceValueCenter(await res.json()));
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
    const res = await fetch("/api/aipify/digital-workforce-value-engine/actions", {
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
  const economics = center.workforce_economics?.[0];

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricWorkforceSize, formatOverviewMetric(overview.workforce_size)],
            [labels.metricEstimatedSavings, formatCurrency(Number(formatOverviewMetric(overview.estimated_savings)), "en-US")],
            [labels.metricProductivityGains, `${formatOverviewMetric(overview.productivity_gains)}%`],
            [labels.metricAutomationValue, formatCurrency(Number(formatOverviewMetric(overview.automation_value)), "en-US")],
            [labels.metricBusinessImpact, formatOverviewMetric(overview.business_impact)],
            [labels.metricRoi, `${formatOverviewMetric(overview.roi_percent)}%`],
            [labels.metricHoursSaved, formatOverviewMetric(overview.hours_saved)],
            [labels.metricHealth, formatOverviewMetric(overview.value_health_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openRoi, ops.roi_route],
            [labels.openProductivity, ops.productivity_route],
            [labels.openCostAllocation, ops.cost_allocation_route],
            [labels.openEconomics, ops.economics_route],
            [labels.openSavings, ops.savings_route],
            [labels.openBusinessImpact, ops.business_impact_route],
            [labels.openGovernance, ops.governance_route],
            [labels.openRecruitment, ops.recruitment_route],
            [labels.openLifecycle, ops.lifecycle_route],
            [labels.openOrchestration, ops.orchestration_route],
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
            onClick={() => void runAction("generate_roi_analysis")}
            className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.generateRoi}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_forecast")}
            className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50"
          >
            {labels.generateForecast}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_benchmark")}
            className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50"
          >
            {labels.generateBenchmark}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("update_value_scorecard")}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            {labels.refreshScorecards}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.departmentsTitle}</h2>
        {(center.department_value ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noDepartments}</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(center.department_value ?? []).map((dept) => (
              <li key={dept.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{dept.department_name}</p>
                <p className="text-gray-600">
                  {labels.roiLabel}: {dept.roi_percent}% · {labels.productivityLabel}: {dept.productivity_gain_percent}%
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.scorecardsTitle}</h2>
        {(center.scorecards ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noScorecards}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.scorecards ?? []).slice(0, 8).map((card) => (
              <li key={card.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{card.employee_name}</span>
                <span className="text-gray-600">
                  {labels.valueScoreLabel}: {card.overall_value_score} · {formatCurrency(card.savings_generated ?? 0, "en-US")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.roiTitle}</h2>
        {(center.roi_analyses ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noRoiAnalyses}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.roi_analyses ?? []).slice(0, 5).map((roi) => (
              <li key={roi.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{roi.analysis_title}</p>
                <p className="text-gray-600">
                  {labels.roiLabel}: {roi.return_on_investment}% · {labels.savingsLabel}:{" "}
                  {formatCurrency(roi.operational_savings ?? 0, "en-US")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {economics ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.economicsTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              [labels.platformCosts, economics.platform_costs],
              [labels.licensingCosts, economics.licensing_costs],
              [labels.operationalCosts, economics.operational_costs],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-lg bg-gray-50 p-3 text-sm">
                <p className="text-gray-500">{label}</p>
                <p className="font-semibold text-gray-900">{formatCurrency(Number(value ?? 0), "en-US")}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{center.abos_principle}</p>
    </div>
  );
}
