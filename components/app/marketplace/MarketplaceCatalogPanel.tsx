"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMarketplaceItems, type MarketplaceItem } from "@/lib/aipify/marketplace";

type MarketplaceCatalogPanelProps = {
  labels: Record<string, string>;
};

export function MarketplaceCatalogPanel({ labels }: MarketplaceCatalogPanelProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter) params.set("item_type", typeFilter);
    const res = await fetch(`/api/aipify/marketplace/items?${params}`);
    if (res.ok) {
      const data = await res.json();
      setItems(parseMarketplaceItems({ items: data.items }));
    }
    setLoading(false);
  }, [typeFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="space-y-4">
      <select
        className="rounded border border-gray-200 px-3 py-1.5 text-sm"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="">{labels.allTypes}</option>
        <option value="business_pack">business pack</option>
        <option value="knowledge_pack">knowledge pack</option>
        <option value="skill">skill</option>
      </select>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noItems}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/app/marketplace/item/${item.slug}`} className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-violet-300">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-gray-600">{item.short_description}</p>
                <p className="mt-2 text-xs text-gray-500 capitalize">{item.item_type.replace(/_/g, " ")} · {item.risk_level}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
