"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAgentsCard, type AgentsCard } from "@/lib/aipify/agents";

type AgentsCardProps = {
  labels: Record<string, string>;
};

export function AgentsCard({ labels }: AgentsCardProps) {
  const [card, setCard] = useState<AgentsCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/agents/card");
    if (res.ok) setCard(parseAgentsCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sky-700">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {card.active_agents ?? 0} {labels.activeAgents}
            {(card.events_today ?? 0) > 0 ? ` · ${card.events_today} ${labels.eventsToday}` : ""}
          </p>
          <p className="mt-1 text-xs text-sky-600">{card.philosophy}</p>
        </div>
        <Link href="/app/agents" className="text-sm font-medium text-sky-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
