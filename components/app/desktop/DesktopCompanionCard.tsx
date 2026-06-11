"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseDesktopCompanionCard, type DesktopCompanionCard } from "@/lib/aipify/desktop";

type DesktopCompanionCardProps = {
  labels: Record<string, string>;
};

export function DesktopCompanionCard({ labels }: DesktopCompanionCardProps) {
  const [card, setCard] = useState<DesktopCompanionCard | null>(null);
  const [identityGreeting, setIdentityGreeting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [deskRes, greetRes] = await Promise.all([
      fetch("/api/aipify/desktop/card"),
      fetch("/api/aipify/assistant-identity/greeting?context=daily_greeting"),
    ]);
    if (deskRes.ok) setCard(parseDesktopCompanionCard(await deskRes.json()));
    if (greetRes.ok) {
      const g = await greetRes.json();
      if (g.greeting) setIdentityGreeting(String(g.greeting));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return null;
  if (!card?.has_customer || card.enabled === false) return null;

  const notifications = card.notifications ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{labels.title}</p>
          {card.briefing_greeting || identityGreeting ? (
            <h2 className="mt-1 text-lg font-semibold text-gray-900">{identityGreeting ?? card.briefing_greeting}</h2>
          ) : null}
          <p className="mt-2 text-sm text-gray-700">{card.briefing_summary}</p>
          <p className="mt-1 text-xs text-slate-500">
            {labels.mode}: {card.mode_name ?? card.mode_key}
            {card.unread_count ? ` · ${card.unread_count} ${labels.unread}` : ""}
          </p>
        </div>
        <Link href="/app/desktop" className="text-sm font-medium text-indigo-700 hover:underline">
          {labels.open}
        </Link>
      </div>

      {notifications.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-start gap-2 text-sm text-gray-800">
              <span className="mt-0.5 shrink-0" aria-hidden>
                {n.severity === "critical" || n.severity === "high" ? "⚠" : "•"}
              </span>
              <span>
                {n.action_url ? (
                  <Link href={n.action_url} className="hover:text-indigo-700">{n.title}</Link>
                ) : (
                  n.title
                )}
                {n.body ? <span className="block text-xs text-gray-500">{n.body}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {card.upcoming_reminders ? (
        <p className="mt-3 text-xs text-indigo-700">
          {card.upcoming_reminders} {labels.remindersSoon}
        </p>
      ) : null}
    </section>
  );
}
