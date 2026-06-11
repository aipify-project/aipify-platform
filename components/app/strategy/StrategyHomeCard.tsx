"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseStrategicCard, type StrategicCard } from "@/lib/aipify/strategy";

type StrategyHomeCardProps = {
  labels: Record<string, string>;
};

export function StrategyHomeCard({ labels }: StrategyHomeCardProps) {
  const [card, setCard] = useState<StrategicCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/strategy/card");
    if (res.ok) setCard(parseStrategicCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-violet-800">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {labels.healthScore}: {card.overall_score ?? 0}/100
            {card.open_opportunities ? ` · ${card.open_opportunities} ${labels.opportunitiesLabel}` : ""}
          </p>
          <p className="mt-1 text-xs text-violet-700">{card.philosophy}</p>
        </div>
        <Link href="/app/strategy" className="text-sm font-medium text-violet-800 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
