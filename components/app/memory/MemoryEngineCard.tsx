"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMemoryEngineCard, type MemoryEngineCard as Card } from "@/lib/aipify/memory";

type MemoryEngineCardProps = {
  labels: Record<string, string>;
};

export function MemoryEngineCard({ labels }: MemoryEngineCardProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/memory-engine/card");
    if (res.ok) setCard(parseMemoryEngineCard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return null;
  if (!card?.has_customer || card.enabled === false) return null;

  const recs = card.recommendations ?? [];

  return (
    <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">{labels.title}</p>
          <p className="mt-2 text-sm text-gray-700">
            {card.profile_count ?? 0} {labels.profiles} · {card.pattern_count ?? 0} {labels.patterns}
          </p>
        </div>
        <Link href="/app/memory" className="text-sm font-medium text-amber-800 hover:underline">
          {labels.open}
        </Link>
      </div>
      {recs.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {recs.slice(0, 3).map((r) => (
            <li key={r.id} className="text-sm text-gray-800">
              {r.action_url ? (
                <Link href={r.action_url} className="hover:text-amber-800">{r.title}</Link>
              ) : (
                r.title
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
