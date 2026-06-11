"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMarketplaceInstalls, type MarketplaceInstall } from "@/lib/aipify/marketplace";

type MarketplaceInstalledPanelProps = {
  labels: Record<string, string>;
};

export function MarketplaceInstalledPanel({ labels }: MarketplaceInstalledPanelProps) {
  const [installs, setInstalls] = useState<MarketplaceInstall[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/marketplace/installed");
    if (res.ok) {
      const data = await res.json();
      setInstalls(parseMarketplaceInstalls({ installs: data.installs }));
    }
    setLoading(false);
  }, []);

  async function disable(id: string) {
    await fetch(`/api/aipify/marketplace/installed/${id}/disable`, { method: "POST" });
    await load();
  }

  async function uninstall(id: string) {
    await fetch(`/api/aipify/marketplace/installed/${id}/uninstall`, { method: "POST" });
    await load();
  }

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="space-y-4">
      <Link href="/app/marketplace" className="text-sm text-violet-600 hover:underline">{labels.back}</Link>
      {installs.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noInstalled}</p>
      ) : (
        <ul className="space-y-3">
          {installs.map((inst) => (
            <li key={inst.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{inst.item.title}</p>
                  <p className="text-sm capitalize text-gray-500">{inst.status}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  {inst.status === "active" ? (
                    <button type="button" onClick={() => void disable(inst.id)} className="text-amber-600 hover:underline">
                      {labels.disable}
                    </button>
                  ) : null}
                  <button type="button" onClick={() => void uninstall(inst.id)} className="text-gray-500 hover:underline">
                    {labels.uninstall}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
