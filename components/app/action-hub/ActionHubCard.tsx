"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseActionHubCard, type ActionHubCard as Card } from "@/lib/aipify/action-hub";

type ActionHubCardProps = {
  labels: Record<string, string>;
};

export function ActionHubCard({ labels }: ActionHubCardProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/action-hub/card");
    if (res.ok) setCard(parseActionHubCard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return null;
  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-rose-600">{labels.title}</p>
          <p className="mt-2 text-sm text-gray-700">
            {card.my_open_count ?? 0} {labels.open} · {card.critical_count ?? 0} {labels.critical}
          </p>
        </div>
        <Link href="/app/actions" className="text-sm font-medium text-rose-700 hover:underline">
          {labels.openHub}
        </Link>
      </div>
    </section>
  );
}
