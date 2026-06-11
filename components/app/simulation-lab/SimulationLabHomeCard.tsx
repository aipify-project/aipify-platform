"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSimulationLabCard, type SimulationLabCard } from "@/lib/aipify/simulation-lab";

type SimulationLabHomeCardProps = {
  labels: Record<string, string>;
};

export function SimulationLabHomeCard({ labels }: SimulationLabHomeCardProps) {
  const [card, setCard] = useState<SimulationLabCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/simulations/card");
    if (res.ok) setCard(parseSimulationLabCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-800">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {card.scenario_count ?? 0} {labels.scenarios}
            {(card.run_count ?? 0) > 0 ? ` · ${card.run_count} ${labels.runs}` : ""}
          </p>
          <p className="mt-1 text-xs text-teal-700">{card.philosophy}</p>
        </div>
        <Link href="/app/simulations" className="text-sm font-medium text-teal-800 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
