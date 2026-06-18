"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseWatcherFindingDetail, type WatcherFindingDetail } from "@/lib/aipify/aoc";

type WatcherDetailPanelProps = {
  findingId: string;
  labels: Record<string, string>;
};

export function WatcherDetailPanel({ findingId, labels }: WatcherDetailPanelProps) {
  const [detail, setDetail] = useState<WatcherFindingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/aoc/watchers/${findingId}`);
    if (res.ok) setDetail(parseWatcherFindingDetail(await res.json()));
    setLoading(false);
  }, [findingId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  const { finding, recommendation } = detail;

  return (
    <div className="space-y-6">
      <Link href="/app/operations" className="text-sm text-amber-800 hover:underline">
        ← {labels.back}
      </Link>
      <div>
        <p className="text-xs font-medium uppercase capitalize text-amber-700">{finding.watcher_type}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{finding.summary}</h1>
        <p className="mt-2 text-sm capitalize text-gray-500">{finding.severity} · {finding.status}</p>
      </div>

      {finding.recommendation ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm">
          <h2 className="font-semibold text-gray-900">{labels.recommendation}</h2>
          <p className="mt-2 text-gray-700">{finding.recommendation}</p>
        </section>
      ) : null}

      {recommendation ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.linkedRecommendation}</h2>
          <div className="mt-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
            <p className="font-medium">{recommendation.title}</p>
            <p className="mt-1 text-gray-600">{recommendation.explanation}</p>
            {recommendation.expected_benefit ? (
              <p className="mt-2 text-xs text-gray-500">{labels.expectedBenefit}: {recommendation.expected_benefit}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.humanOversight}</p>
    </div>
  );
}
