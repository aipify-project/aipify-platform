"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseLearningEngineCard, type LearningEngineCard as Card } from "@/lib/aipify/learning-engine";

type LearningEngineCardProps = {
  labels: Record<string, string>;
};

export function LearningEngineCard({ labels }: LearningEngineCardProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/learning-engine/card");
    if (res.ok) setCard(parseLearningEngineCard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return null;
  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-600">{labels.title}</p>
          <p className="mt-2 text-sm text-gray-700">
            {card.total_events ?? 0} {labels.events} · {card.positive_feedback ?? 0} {labels.positive}
          </p>
        </div>
        <Link href="/app/learning" className="text-sm font-medium text-teal-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
