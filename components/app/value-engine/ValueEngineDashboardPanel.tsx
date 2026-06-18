"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseValueEngineDashboard, type ValueEngineDashboard } from "@/lib/aipify/value-engine";

type ValueEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

export function ValueEngineDashboardPanel({ labels }: ValueEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ValueEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/value/dashboard");
    if (res.ok) setDashboard(parseValueEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const score = dashboard.impact_score;
  const categories = dashboard.category_scores ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link href="/app/value-engine/reports" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-emerald-300">
          {labels.reports}
        </Link>
        <Link href="/app/value-engine/opportunities" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-emerald-300">
          {labels.opportunities}
        </Link>
        <Link href="/app/value-engine/settings" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-emerald-300">
          {labels.settings}
        </Link>
      </div>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.impactScore}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">{score?.overall_score ?? 0}<span className="text-lg font-normal text-gray-500">/100</span></p>
        {score?.trend_delta != null ? (
          <p className="mt-1 text-sm text-gray-600">
            {score.trend_delta >= 0 ? "+" : ""}{score.trend_delta} {labels.comparedToLast}
          </p>
        ) : null}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <p className="text-sm text-gray-700">{Math.round((dashboard.minutes_saved_30d ?? 0) / 60 * 10) / 10} {labels.hoursSaved}</p>
          {dashboard.roi_enabled && dashboard.estimated_value_30d != null ? (
            <p className="text-sm text-gray-700">
              {dashboard.currency} {dashboard.estimated_value_30d.toLocaleString()} {labels.estimatedValue}
            </p>
          ) : (
            <p className="text-sm text-gray-500">{labels.roiDisabled}</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.categoryScores}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categories).map(([key, val]) => (
            <div key={key} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
              <p className="capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 font-semibold text-gray-900">{val}</p>
            </div>
          ))}
        </div>
      </section>

      {dashboard.timeline.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.timeline}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.timeline.map((point) => (
              <li key={point.month} className="flex justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm">
                <span>{point.month}</span>
                <span className="text-gray-600">{Math.round(point.minutes_saved / 60 * 10) / 10} {labels.hours} · {point.event_count} {labels.events}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.marketplace_impact.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.marketplaceImpact}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {dashboard.marketplace_impact.map((m) => (
              <li key={m.item_key}>{m.pack} · {m.status}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.blueprint_impact?.blueprint_title ? (
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <h2 className="font-semibold">{labels.blueprintImpact}</h2>
          <p className="mt-1">{dashboard.blueprint_impact.blueprint_title} · {dashboard.blueprint_impact.applied_components} {labels.componentsApplied}</p>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.disclaimer}</p>
    </div>
  );
}
