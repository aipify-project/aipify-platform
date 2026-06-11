"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseContinuityCard, type ContinuityCard } from "@/lib/aipify/continuity";

type ContinuityHomeCardProps = {
  labels: Record<string, string>;
};

export function ContinuityHomeCard({ labels }: ContinuityHomeCardProps) {
  const [card, setCard] = useState<ContinuityCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/continuity/card");
    if (res.ok) setCard(parseContinuityCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rose-800">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {labels.readinessScore}: {card.overall_score ?? 0}/100
            {card.incident_mode_active ? ` · ${labels.incidentModeActive}` : ""}
          </p>
          <p className="mt-1 text-xs text-rose-700">{card.philosophy}</p>
        </div>
        <Link href="/app/continuity" className="text-sm font-medium text-rose-800 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
