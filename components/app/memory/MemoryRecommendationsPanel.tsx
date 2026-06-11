"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMemoryRecommendations, type MemoryRecommendation } from "@/lib/aipify/memory";

type MemoryRecommendationsPanelProps = {
  labels: Record<string, string>;
};

export function MemoryRecommendationsPanel({ labels }: MemoryRecommendationsPanelProps) {
  const [recs, setRecs] = useState<MemoryRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/memory-engine/recommendations");
    if (res.ok) setRecs(parseMemoryRecommendations(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function act(id: string, status: string) {
    await fetch(`/api/aipify/memory-engine/recommendations/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/memory" className="text-sm text-amber-800">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {recs.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="space-y-3">
          {recs.map((r) => (
            <li key={r.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="font-medium">{r.title}</span>
                  <p className="mt-1 text-gray-600">{r.summary}</p>
                  <p className="mt-2 text-xs text-amber-800">{r.rationale}</p>
                </div>
                <div className="flex gap-2">
                  {r.action_url ? (
                    <Link href={r.action_url} className="text-amber-800">{labels.open}</Link>
                  ) : null}
                  {r.status === "suggested" ? (
                    <>
                      <button type="button" onClick={() => void act(r.id, "accepted")} className="text-green-700">
                        {labels.accept}
                      </button>
                      <button type="button" onClick={() => void act(r.id, "dismissed")} className="text-gray-500">
                        {labels.dismiss}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
