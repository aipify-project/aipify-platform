"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseGlobalLearningDashboard, type GlobalLearningDashboard } from "@/lib/aipify/global-learning";

type GlobalLearningDashboardPanelProps = {
  labels: Record<string, string>;
};

export function GlobalLearningDashboardPanel({ labels }: GlobalLearningDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<GlobalLearningDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-learning/dashboard");
    if (res.ok) setDashboard(parseGlobalLearningDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const levels = dashboard.intelligence_levels;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link href="/app/global-learning/settings" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-violet-300">
          {labels.settings}
        </Link>
        <Link href="/app/global-learning/contributions" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-violet-300">
          {labels.contributions}
        </Link>
        <Link href="/app/evolution" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-violet-300">
          {labels.evolutionBoard}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-5">
        <h2 className="text-sm font-semibold text-violet-900">{labels.participation}</h2>
        <p className="mt-2 capitalize text-sm text-gray-700">
          {dashboard.settings?.participation_mode?.replace(/_/g, " ") ?? labels.defaultMode}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {dashboard.total_contributions ?? 0} {labels.anonymizedSignals}
          · {dashboard.pending_proposals ?? 0} {labels.pendingProposals}
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.intelligenceLevels}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(["local", "organizational", "global"] as const).map((level) => (
            <div key={level} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium capitalize text-gray-900">{labels[level] ?? level}</p>
              <p className="mt-1 text-gray-600">{levels?.[level]}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{labels.principle}</p>
    </div>
  );
}
