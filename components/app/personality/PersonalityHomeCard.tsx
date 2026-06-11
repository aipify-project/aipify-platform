"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parsePersonalityCard, type PersonalityCard } from "@/lib/aipify/personality";

type PersonalityHomeCardProps = {
  labels: Record<string, string>;
};

export function PersonalityHomeCard({ labels }: PersonalityHomeCardProps) {
  const [card, setCard] = useState<PersonalityCard | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/personality/card");
    if (res.ok) setCard(parsePersonalityCard(await res.json()));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800">{labels.title}</p>
          <p className="mt-1 text-sm capitalize text-gray-800">
            {labels.mode}: {card.personality_mode?.replace(/_/g, " ")}
          </p>
          <p className="mt-1 text-xs text-amber-700">{card.philosophy}</p>
        </div>
        <Link href="/app/personality" className="text-sm font-medium text-amber-800 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
