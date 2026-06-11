"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSkillStoreCard, type SkillStoreCard as Card } from "@/lib/aipify/skills";

type SkillStoreCardProps = {
  labels: Record<string, string>;
};

export function SkillStoreCard({ labels }: SkillStoreCardProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/skills/card");
    if (res.ok) setCard(parseSkillStoreCard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return null;
  if (!card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-violet-600">{labels.title}</p>
          <p className="mt-2 text-sm text-gray-700">
            {card.installed_count ?? 0} {labels.installed} · {card.available_count ?? 0} {labels.available}
          </p>
        </div>
        <Link href="/app/skills" className="text-sm font-medium text-violet-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
