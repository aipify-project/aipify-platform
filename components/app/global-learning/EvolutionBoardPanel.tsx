"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseEvolutionBoard, type EvolutionProposal, type GlobalLearningPattern } from "@/lib/aipify/global-learning";

type EvolutionBoardPanelProps = {
  labels: Record<string, string>;
};

const RISK_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

export function EvolutionBoardPanel({ labels }: EvolutionBoardPanelProps) {
  const [proposals, setProposals] = useState<EvolutionProposal[]>([]);
  const [patterns, setPatterns] = useState<GlobalLearningPattern[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/evolution/board");
    if (res.ok) {
      const board = parseEvolutionBoard(await res.json());
      setProposals(board.proposals);
      setPatterns(board.trend_summaries);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function feedback(id: string, decision: string) {
    await fetch(`/api/aipify/evolution/proposals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="space-y-6">
      <Link href="/app/global-learning" className="text-sm text-violet-600 hover:underline">{labels.back}</Link>

      {patterns.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.trendSummaries}</h2>
          <ul className="mt-3 space-y-2">
            {patterns.slice(0, 5).map((p) => (
              <li key={p.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                <span className="font-medium capitalize">{p.category.replace(/_/g, " ")}</span>
                <span className="text-gray-600"> · {p.frequency} {labels.signals} · {p.trend_direction}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.proposals}</h2>
        {proposals.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noProposals}</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {proposals.map((p) => (
              <li key={p.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{p.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{p.summary}</p>
                    {p.rationale ? <p className="mt-1 text-xs text-gray-500">{p.rationale}</p> : null}
                    {p.expected_value ? (
                      <p className="mt-2 text-xs text-violet-700">{labels.expectedValue}: {p.expected_value}</p>
                    ) : null}
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs capitalize ${RISK_COLOR[p.risk_level] ?? "bg-gray-100"}`}>
                    {p.risk_level}
                  </span>
                </div>
                {p.explainability ? (
                  <div className="mt-3 rounded bg-violet-50 p-3 text-xs text-gray-700">
                    <p><strong>{labels.confidence}:</strong> {String(p.explainability.confidence ?? "—")}</p>
                    <p className="mt-1"><strong>{labels.recommendedAction}:</strong> {String(p.explainability.recommended_action ?? "—")}</p>
                  </div>
                ) : null}
                {p.tenant_feedback?.decision ? (
                  <p className="mt-2 text-xs capitalize text-gray-500">{labels.yourFeedback}: {p.tenant_feedback.decision}</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => void feedback(p.id, "approve")} className="rounded border border-violet-600 px-3 py-1 text-xs text-violet-700">{labels.approve}</button>
                    <button type="button" onClick={() => void feedback(p.id, "reject")} className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600">{labels.reject}</button>
                    <button type="button" onClick={() => void feedback(p.id, "snooze")} className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600">{labels.snooze}</button>
                    <button type="button" onClick={() => void feedback(p.id, "request_info")} className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600">{labels.requestInfo}</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
