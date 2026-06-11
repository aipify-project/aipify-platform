"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseGlobalLearningCard, type GlobalLearningCard } from "@/lib/aipify/global-learning";

type GlobalLearningCardProps = {
  labels: Record<string, string>;
};

export function GlobalLearningCard({ labels }: GlobalLearningCardProps) {
  const [card, setCard] = useState<GlobalLearningCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/global-learning/card");
    if (res.ok) setCard(parseGlobalLearningCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-violet-700">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {card.participation_mode === "none"
              ? labels.optedOut
              : `${labels.mode}: ${card.participation_mode?.replace(/_/g, " ")} · ${card.contribution_count ?? 0} ${labels.signals}`}
          </p>
          <p className="mt-1 text-xs text-violet-600">{card.philosophy}</p>
        </div>
        <Link href="/app/global-learning" className="text-sm font-medium text-violet-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
