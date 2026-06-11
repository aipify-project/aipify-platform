"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMarketplaceDashboard, type MarketplaceDashboard, type MarketplaceItem } from "@/lib/aipify/marketplace";

type MarketplaceDashboardPanelProps = {
  labels: Record<string, string>;
};

const RISK_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

function ItemCard({ item, labels }: { item: MarketplaceItem; labels: Record<string, string> }) {
  return (
    <Link
      href={`/app/marketplace/item/${item.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-violet-300"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{item.title}</h3>
        <span className={`rounded px-2 py-0.5 text-xs capitalize ${RISK_COLOR[item.risk_level] ?? "bg-gray-100"}`}>
          {item.risk_level}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">{item.short_description}</p>
      <p className="mt-2 text-xs text-gray-500">
        {item.item_type.replace(/_/g, " ")} · {item.pricing_model === "free" ? labels.free : item.pricing_model}
      </p>
    </Link>
  );
}

export function MarketplaceDashboardPanel({ labels }: MarketplaceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<MarketplaceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/marketplace/dashboard");
    if (res.ok) setDashboard(parseMarketplaceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/marketplace/catalog" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.catalog}</Link>
        <Link href="/app/marketplace/installed" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.installed}</Link>
        <Link href="/app/skills" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.skillStore}</Link>
      </div>

      {dashboard.recommended.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">{labels.recommended}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.recommended.map((item) => (
              <ItemCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.featured.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">{labels.featured}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.featured.map((item) => (
              <ItemCard key={item.id} item={item} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.principle}</p>
    </div>
  );
}
