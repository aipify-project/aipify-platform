"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseOrchestrationCard, type OrchestrationCard } from "@/lib/aipify/orchestration";

type OrchestrationCardProps = {
  labels: Record<string, string>;
};

export function OrchestrationCard({ labels }: OrchestrationCardProps) {
  const [card, setCard] = useState<OrchestrationCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/orchestration/card");
    if (res.ok) setCard(parseOrchestrationCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.title}</p>
          {card.emergency_stop_active ? (
            <p className="mt-1 text-sm font-semibold text-rose-800">{labels.emergencyStop}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-800">
              {card.events_today ?? 0} {labels.eventsToday}
              {(card.active_flows ?? 0) > 0 ? ` · ${card.active_flows} ${labels.activeFlows}` : ""}
            </p>
          )}
          <p className="mt-1 text-xs text-indigo-600">{card.philosophy}</p>
        </div>
        <Link href="/app/orchestration" className="text-sm font-medium text-indigo-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
