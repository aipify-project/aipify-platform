"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseHumanSuccessCard, type HumanSuccessCard } from "@/lib/aipify/human-success";

type HumanSuccessHomeCardProps = {
  labels: Record<string, string>;
};

export function HumanSuccessHomeCard({ labels }: HumanSuccessHomeCardProps) {
  const [card, setCard] = useState<HumanSuccessCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/human-success/card");
    if (res.ok) setCard(parseHumanSuccessCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-sky-800">{labels.title}</p>
          <p className="mt-1 text-sm text-gray-800">
            {labels.successScore}: {card.success_score ?? 0}/100
          </p>
          {card.value_message ? (
            <p className="mt-1 text-xs text-emerald-800">{card.value_message}</p>
          ) : null}
          <p className="mt-1 text-xs text-sky-700">{card.philosophy}</p>
        </div>
        <Link href="/app/human-success" className="text-sm font-medium text-sky-800 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
