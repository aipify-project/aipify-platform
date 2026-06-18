"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseBlueprintRecommendations,
  type BlueprintRecommendation,
} from "@/lib/aipify/industry-blueprints";

type IndustryBlueprintsRecommendationsPanelProps = {
  labels: Record<string, string>;
};

const RISK_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

export function IndustryBlueprintsRecommendationsPanel({ labels }: IndustryBlueprintsRecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<BlueprintRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/industry-blueprints/recommendations");
    if (res.ok) {
      const data = await res.json();
      setRecommendations(parseBlueprintRecommendations(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/aipify/industry-blueprints/recommendations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const pending = recommendations.filter((r) => r.status === "pending" || r.status === "accepted");

  return (
    <div className="space-y-4">
      <Link href="/app/industry-blueprints" className="text-sm text-teal-600 hover:underline">{labels.back}</Link>
      {pending.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noRecommendations}</p>
      ) : (
        <ul className="space-y-3">
          {pending.map((rec) => (
            <li key={rec.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{rec.title}</p>
                  <p className="text-sm text-gray-600">{rec.summary}</p>
                  {rec.reason ? <p className="mt-1 text-xs text-gray-500">{rec.reason}</p> : null}
                  <p className="mt-1 text-xs capitalize text-gray-400">{rec.recommendation_type.replace(/_/g, " ")}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs capitalize ${RISK_COLOR[rec.risk_level] ?? "bg-gray-100"}`}>
                  {rec.risk_level}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void updateStatus(rec.id, "accepted")}
                  className="rounded border border-teal-600 px-3 py-1 text-xs font-medium text-teal-700"
                >
                  {labels.accept}
                </button>
                <button
                  type="button"
                  onClick={() => void updateStatus(rec.id, "rejected")}
                  className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600"
                >
                  {labels.reject}
                </button>
                <button
                  type="button"
                  onClick={() => void updateStatus(rec.id, "dismissed")}
                  className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600"
                >
                  {labels.dismiss}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
