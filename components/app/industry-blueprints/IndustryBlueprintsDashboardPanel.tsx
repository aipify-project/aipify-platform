"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseBlueprintDashboard,
  type BlueprintDashboard,
  type IndustryBlueprint,
} from "@/lib/aipify/industry-blueprints";

type IndustryBlueprintsDashboardPanelProps = {
  labels: Record<string, string>;
};

const RISK_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

export function IndustryBlueprintsDashboardPanel({ labels }: IndustryBlueprintsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<BlueprintDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/industry-blueprints/dashboard");
    if (res.ok) setDashboard(parseBlueprintDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const completeness = dashboard.completeness;
  const blueprint = completeness?.blueprint;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link href="/app/industry-blueprints/catalog" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
          {labels.catalog}
        </Link>
        <Link href="/app/industry-blueprints/recommendations" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
          {labels.recommendations}
        </Link>
        <Link href="/app/industry-blueprints/applied" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
          {labels.applied}
        </Link>
        <Link href="/app/industry-blueprints/settings" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
          {labels.settings}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-5">
        <h2 className="text-sm font-semibold text-teal-900">{labels.setupCompleteness}</h2>
        {blueprint ? (
          <div className="mt-3">
            <p className="font-medium text-gray-900">{blueprint.title}</p>
            <div className="mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-teal-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-all"
                style={{ width: `${completeness?.score ?? 0}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {completeness?.applied_count ?? 0} / {completeness?.total_recommendations ?? 0} {labels.itemsApplied}
              · {completeness?.pending_count ?? 0} {labels.pending}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600">{labels.selectBlueprint}</p>
        )}
      </section>

      {dashboard.pending_recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.nextRecommendations}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.pending_recommendations.slice(0, 5).map((rec) => (
              <li key={rec.id} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-gray-600">{rec.summary}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs capitalize ${RISK_COLOR[rec.risk_level] ?? "bg-gray-100"}`}>
                    {rec.risk_level}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/app/industry-blueprints/recommendations" className="mt-2 inline-block text-sm text-teal-700 hover:underline">
            {labels.viewAll}
          </Link>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.principle}</p>
    </div>
  );
}
