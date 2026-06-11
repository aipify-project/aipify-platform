"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBriefingCard, type BriefingCard, type BriefKeyItem } from "@/lib/aipify/briefing";

type AipifyBriefingCardProps = {
  labels: Record<string, string>;
};

const ICON: Record<string, string> = {
  alert: "⚠",
  warning: "⚠",
  info: "✓",
  check: "✓",
};

function itemIcon(item: BriefKeyItem): string {
  if (item.icon && ICON[item.icon]) return ICON[item.icon];
  if (item.severity === "critical" || item.severity === "high") return "⚠";
  return "✓";
}

export function AipifyBriefingCard({ labels }: AipifyBriefingCardProps) {
  const [card, setCard] = useState<BriefingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/briefing/card");
    if (res.ok) setCard(parseBriefingCard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function markRead() {
    setMarking(true);
    await fetch("/api/aipify/briefing/since-last-login/mark-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary_id: card?.summary_id }),
    });
    await refresh();
    setMarking(false);
  }

  if (loading) return null;
  if (!card?.has_customer || card.enabled === false) return null;

  const items = card.key_items ?? [];

  return (
    <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">{labels.sinceLastLogin}</p>
          {card.greeting ? <h2 className="mt-1 text-lg font-semibold text-gray-900">{card.greeting}</h2> : null}
          <p className="mt-2 text-sm text-gray-700">{card.summary}</p>
        </div>
        <Link href="/app/briefing" className="text-sm font-medium text-indigo-700 hover:underline">
          {labels.viewFull}
        </Link>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id ?? item.title} className="flex items-start gap-2 text-sm text-gray-800">
              <span className="mt-0.5 shrink-0" aria-hidden>{itemIcon(item)}</span>
              <span>
                {item.action_url ? (
                  <Link href={item.action_url} className="hover:text-indigo-700">{item.title}</Link>
                ) : (
                  item.title
                )}
                {item.summary ? <span className="block text-xs text-gray-500">{item.summary}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {card.recommended_next_step ? (
        <p className="mt-4 rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-sm text-indigo-900">
          <span className="font-medium">{labels.recommendedStep}: </span>
          {card.recommended_next_step}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
          {labels.openApprovals}
        </Link>
        <Link href="/app/quality" className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
          {labels.openQuality}
        </Link>
        <button
          type="button"
          disabled={marking}
          onClick={() => void markRead()}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {labels.markRead}
        </button>
      </div>
    </section>
  );
}
