"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseGovernanceTrustScore, type GovernanceTrustScore } from "@/lib/aipify/governance";

type GovernanceTrustPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    empty: string;
    success: string;
    failure: string;
    approvals: string;
  };
};

export function GovernanceTrustPanel({ labels }: GovernanceTrustPanelProps) {
  const [scores, setScores] = useState<GovernanceTrustScore[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/governance/trust");
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.scores) ? data.scores : [];
      setScores(list.map(parseGovernanceTrustScore));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/app/governance" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>
      {scores.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {scores.map((score) => (
            <div key={score.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="font-medium">{score.action_key}</p>
              <p className="mt-2 text-3xl font-semibold text-indigo-700">{score.trust_score}%</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                <span>{labels.success}: {score.success_count}</span>
                <span>{labels.failure}: {score.failure_count}</span>
                <span>{labels.approvals}: {score.approval_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
