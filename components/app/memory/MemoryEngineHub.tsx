"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMemoryEngineCard, type MemoryEngineCard } from "@/lib/aipify/memory";

type MemoryEngineHubProps = {
  labels: Record<string, string>;
};

export function MemoryEngineHub({ labels }: MemoryEngineHubProps) {
  const [card, setCard] = useState<MemoryEngineCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/memory-engine/card");
    if (res.ok) setCard(parseMemoryEngineCard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    await fetch("/api/aipify/memory-engine/observations/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_slug: "unonight", generate: true }),
    });
    await load();
    setRefreshing(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!card?.has_customer) return <div className="text-sm text-gray-600">{labels.empty}</div>;

  const recs = card.recommendations ?? [];

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.engineTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.engineSubtitle}</p>
          <p className="mt-2 text-xs text-amber-800">{card.philosophy}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={refreshing}
            onClick={() => void refresh()}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {labels.refresh}
          </button>
          <Link href="/app/memory/preferences" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            {labels.preferences}
          </Link>
          <Link href="/app/memory/patterns" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            {labels.patterns}
          </Link>
          <Link href="/app/memory/recommendations" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            {labels.recommendations}
          </Link>
          <Link href="/app/memory/settings" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm">
            {labels.settingsLink}
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white bg-white p-3 text-sm">
          <span className="font-medium">{labels.profileCount}</span>
          <p className="text-2xl font-semibold">{card.profile_count ?? 0}</p>
        </div>
        <div className="rounded-lg border border-white bg-white p-3 text-sm">
          <span className="font-medium">{labels.patternCount}</span>
          <p className="text-2xl font-semibold">{card.pattern_count ?? 0}</p>
        </div>
      </div>

      {recs.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {recs.map((r) => (
            <li key={r.id} className="rounded border border-amber-100 bg-white px-3 py-2 text-sm">
              <span className="font-medium">{r.title}</span>
              {r.summary ? <p className="text-xs text-gray-500">{r.summary}</p> : null}
              {r.action_url ? (
                <Link href={r.action_url} className="text-xs text-amber-800">{labels.open}</Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-gray-500">{labels.noRecommendations}</p>
      )}

      <p className="mt-4 text-xs text-gray-500">{card.privacy_note ?? labels.privacy}</p>
    </section>
  );
}
