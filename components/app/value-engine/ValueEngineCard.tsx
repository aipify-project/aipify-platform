"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseValueEngineCard, type ValueEngineCard } from "@/lib/aipify/value-engine";

type ValueEngineCardProps = {
  labels: Record<string, string>;
};

export function ValueEngineCard({ labels }: ValueEngineCardProps) {
  const [card, setCard] = useState<ValueEngineCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/value/card");
    if (res.ok) setCard(parseValueEngineCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  const trend = card.trend_delta;
  const trendLabel =
    trend == null ? "" : trend >= 0 ? `+${trend}` : String(trend);

  return (
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {labels.impactScore}: {card.impact_score ?? 0}/100
            {trendLabel ? ` · ${trendLabel} ${labels.trend}` : ""}
          </p>
          <p className="mt-1 text-xs text-emerald-600">{card.philosophy}</p>
        </div>
        <Link href="/app/value" className="text-sm font-medium text-emerald-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
