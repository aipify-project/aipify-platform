"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseDigitalTwinCard, type DigitalTwinCard } from "@/lib/aipify/digital-twin";

type DigitalTwinCardProps = {
  labels: Record<string, string>;
};

export function DigitalTwinHomeCard({ labels }: DigitalTwinCardProps) {
  const [card, setCard] = useState<DigitalTwinCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/digital-twin/card");
    if (res.ok) setCard(parseDigitalTwinCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-700">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {labels.healthScore}: {card.twin_health_score ?? 0}/100
            {(card.open_insights ?? 0) > 0 ? ` · ${card.open_insights} ${labels.insights}` : ""}
          </p>
          <p className="mt-1 text-xs text-slate-600">{card.philosophy}</p>
        </div>
        <Link href="/app/digital-twin" className="text-sm font-medium text-slate-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
