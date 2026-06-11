"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMarketplaceCard, type MarketplaceCard } from "@/lib/aipify/marketplace";

type MarketplaceCardProps = {
  labels: Record<string, string>;
};

export function MarketplaceCard({ labels }: MarketplaceCardProps) {
  const [card, setCard] = useState<MarketplaceCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/marketplace/card");
    if (res.ok) setCard(parseMarketplaceCard(await res.json()));
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
            {card.catalog_count ?? 0} {labels.catalogItems}
            {(card.installed_count ?? 0) > 0 ? ` · ${card.installed_count} ${labels.installed}` : ""}
          </p>
          <p className="mt-1 text-xs text-violet-600">{card.philosophy}</p>
        </div>
        <Link href="/app/marketplace" className="text-sm font-medium text-violet-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
