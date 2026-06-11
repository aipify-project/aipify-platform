"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseEcosystemAppsCard, type EcosystemAppsCard } from "@/lib/aipify/app-ecosystem";

type AppsCardProps = {
  labels: Record<string, string>;
};

export function AppsCard({ labels }: AppsCardProps) {
  const [card, setCard] = useState<EcosystemAppsCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/apps/card");
    if (res.ok) setCard(parseEcosystemAppsCard(await res.json()));
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
            {card.installed_apps ?? 0} {labels.installedApps}
            {(card.updates_available ?? 0) > 0 ? ` · ${card.updates_available} ${labels.updatesAvailable}` : ""}
          </p>
          <p className="mt-1 text-xs text-teal-600">{card.philosophy}</p>
        </div>
        <Link href="/app/apps" className="text-sm font-medium text-teal-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
