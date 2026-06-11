"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAocCard, type AocCard } from "@/lib/aipify/aoc";

type AocHomeCardProps = {
  labels: Record<string, string>;
};

export function AocHomeCard({ labels }: AocHomeCardProps) {
  const [card, setCard] = useState<AocCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/aoc/card");
    if (res.ok) setCard(parseAocCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {labels.healthScore}: {card.overall_score ?? 0}/100
            {card.health_band ? ` · ${card.health_band}` : ""}
            {(card.open_findings ?? 0) > 0 ? ` · ${card.open_findings} ${labels.findings}` : ""}
          </p>
          <p className="mt-1 text-xs text-amber-700">{card.philosophy}</p>
        </div>
        <Link href="/app/operations" className="text-sm font-medium text-amber-800 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
