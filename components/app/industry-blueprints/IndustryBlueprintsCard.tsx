"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBlueprintCard, type BlueprintCard } from "@/lib/aipify/industry-blueprints";

type IndustryBlueprintsCardProps = {
  labels: Record<string, string>;
};

export function IndustryBlueprintsCard({ labels }: IndustryBlueprintsCardProps) {
  const [card, setCard] = useState<BlueprintCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/industry-blueprints/card");
    if (res.ok) setCard(parseBlueprintCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {card.has_blueprint
              ? `${card.blueprint_title} · ${card.completeness_score ?? 0}% ${labels.complete}`
              : labels.noBlueprint}
          </p>
          <p className="mt-1 text-xs text-teal-600">{card.philosophy}</p>
        </div>
        <Link href="/app/industry-blueprints" className="text-sm font-medium text-teal-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
