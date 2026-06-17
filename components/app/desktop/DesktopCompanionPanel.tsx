"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDesktopCompanionCard,
  parseDesktopNotifications,
  type DesktopCompanionCard,
  type DesktopNotification,
} from "@/lib/aipify/desktop";
import { DesktopChatPanel } from "./DesktopChatPanel";

export type DesktopCompanionLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  summary: string;
  notifications: string;
  noNotifications: string;
  refresh: string;
  settings: string;
  modes: string;
  memory?: string;
  workspace?: string;
  environment?: string;
  history: string;
  reminders: string;
  mode: string;
  unread: string;
  open: string;
  dismiss: string;
  privacy: string;
  back: string;
  historyTitle: string;
  chat: Record<string, string>;
};

type DesktopCompanionPanelProps = {
  labels: DesktopCompanionLabels;
  mode?: "full" | "history" | "reminders";
};

export function DesktopCompanionPanel({ labels, mode = "full" }: DesktopCompanionPanelProps) {
  const [card, setCard] = useState<DesktopCompanionCard | null>(null);
  const [history, setHistory] = useState<DesktopNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    if (mode === "history") {
      const res = await fetch("/api/aipify/desktop/history?limit=50");
      if (res.ok) setHistory(parseDesktopNotifications(await res.json()));
    } else {
      const res = await fetch("/api/aipify/desktop/card");
      if (res.ok) setCard(parseDesktopCompanionCard(await res.json()));
    }
    setLoading(false);
  }, [mode]);

  useEffect(() => {
    void load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    await fetch("/api/aipify/desktop/notifications/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_slug: "unonight" }),
    });
    await load();
    setRefreshing(false);
  }

  async function dismiss(id: string) {
    await fetch(`/api/aipify/desktop/notifications/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dismiss" }),
    });
    await load();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (mode !== "history" && !card?.has_customer) {
    return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;
  }

  if (mode === "history") {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{labels.historyTitle}</h1>
          <Link href="/app/desktop" className="text-sm text-indigo-700">{labels.back}</Link>
        </div>
        <ul className="space-y-2">
          {history.map((n) => (
            <li key={n.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="font-medium">{n.title}</span>
                <span className="text-xs text-gray-500">{n.severity} · {n.status}</span>
              </div>
              {n.body ? <p className="mt-1 text-gray-600">{n.body}</p> : null}
              {n.explanation ? <p className="mt-2 text-xs text-gray-500">{n.explanation}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const notifications = card?.notifications ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
          {card?.briefing_greeting ? (
            <p className="mt-3 text-lg font-medium text-indigo-900">{card.briefing_greeting}</p>
          ) : null}
          <p className="mt-1 text-xs text-slate-500">
            {labels.mode}: {card?.mode_name} · {card?.unread_count ?? 0} {labels.unread}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={refreshing}
            onClick={() => void refresh()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {labels.refresh}
          </button>
          <Link href="/app/desktop/settings" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
            {labels.settings}
          </Link>
          <Link href="/app/desktop/modes" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
            {labels.modes}
          </Link>
          {labels.memory ? (
            <Link href="/desktop/memory" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
              {labels.memory}
            </Link>
          ) : null}
          <Link href="/desktop/workspace" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
            {labels.workspace ?? "Workspace"}
          </Link>
          <Link href="/desktop/environment" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
            {labels.environment ?? "Environment"}
          </Link>
          <Link href="/app/desktop/history" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
            {labels.history}
          </Link>
          <Link href="/app/desktop/reminders" className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
            {labels.reminders}
          </Link>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.summary}</h2>
        <p className="mt-2 text-sm text-gray-700">{card?.briefing_summary}</p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.notifications}</h2>
        {notifications.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noNotifications}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="flex justify-between gap-3 rounded border border-gray-100 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{n.title}</span>
                  {n.body ? <p className="text-xs text-gray-500">{n.body}</p> : null}
                  {n.recommendation ? (
                    <p className="text-xs text-indigo-700">{n.recommendation}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  {n.action_url ? (
                    <Link href={n.action_url} className="text-indigo-700">{labels.open}</Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void dismiss(n.id)}
                    className="text-gray-500"
                  >
                    {labels.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {card?.mini_chat_enabled ? (
        <DesktopChatPanel labels={labels.chat} enabled />
      ) : (
        <DesktopChatPanel labels={labels.chat} enabled={false} />
      )}

      <p className="text-xs text-gray-500">{card?.privacy_note ?? labels.privacy}</p>
    </div>
  );
}
