"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseBriefingEvents,
  parseBriefingFull,
  parseBriefingSummaries,
  type BriefingEvent,
  type BriefingFull,
  type BriefingSummary,
} from "@/lib/aipify/briefing";

type BriefingPanelProps = {
  labels: Record<string, string>;
  mode?: "full" | "since_last_login" | "daily";
};

export function BriefingPanel({ labels, mode = "full" }: BriefingPanelProps) {
  const [brief, setBrief] = useState<BriefingFull | null>(null);
  const [events, setEvents] = useState<BriefingEvent[]>([]);
  const [summaries, setSummaries] = useState<BriefingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const briefUrl =
      mode === "daily" ? "/api/aipify/briefing/daily" : "/api/aipify/briefing/since-last-login";
    const [briefRes, eventsRes, summariesRes] = await Promise.all([
      fetch(briefUrl),
      fetch("/api/aipify/briefing/events?limit=100"),
      mode === "daily" ? fetch("/api/aipify/briefing/summaries?limit=10") : Promise.resolve(null),
    ]);
    if (briefRes.ok) setBrief(parseBriefingFull(await briefRes.json()));
    if (eventsRes.ok) setEvents(parseBriefingEvents(await eventsRes.json()));
    if (summariesRes?.ok) setSummaries(parseBriefingSummaries(await summariesRes.json()));
    setLoading(false);
  }, [mode]);

  useEffect(() => {
    void load();
  }, [load]);

  async function regenerate() {
    setRefreshing(true);
    await fetch("/api/aipify/briefing/events/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_slug: "unonight" }),
    });
    const url =
      mode === "daily"
        ? "/api/aipify/briefing/daily/generate"
        : "/api/aipify/briefing/since-last-login/generate";
    await fetch(url, { method: "POST" });
    await load();
    setRefreshing(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!brief?.has_customer) return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;

  const modules = ["support", "knowledge", "quality", "governance", "automation", "integrations", "unonight"] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
          {brief.greeting ? <p className="mt-3 text-lg font-medium text-indigo-900">{brief.greeting}</p> : null}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={refreshing}
            onClick={() => void regenerate()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {labels.refresh}
          </button>
          <Link href="/app/settings/briefing" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700">
            {labels.settings}
          </Link>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.summary}</h2>
        <p className="mt-2 text-sm text-gray-700">{brief.summary}</p>
        {brief.recommended_next_step ? (
          <p className="mt-3 text-sm text-indigo-800">
            <span className="font-medium">{labels.recommendedStep}: </span>
            {brief.recommended_next_step}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.priorities}</h2>
        <ul className="mt-3 space-y-2">
          {(brief.key_items ?? []).map((item) => (
            <li key={item.id ?? item.title} className="flex justify-between gap-3 rounded border border-gray-100 px-3 py-2 text-sm">
              <span>{item.title}</span>
              {item.action_url ? (
                <Link href={item.action_url} className="shrink-0 text-indigo-700">{labels.open}</Link>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {mode === "full" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {modules.map((mod) => {
            const modEvents = events.filter((e) => e.source_module === mod);
            if (modEvents.length === 0) return null;
            return (
              <section key={mod} className="rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="text-sm font-semibold capitalize">{mod}</h2>
                <ul className="mt-2 space-y-1">
                  {modEvents.slice(0, 5).map((e) => (
                    <li key={e.id} className="text-sm text-gray-600">{e.title}</li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}

      {summaries.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold">{labels.archive}</h2>
          <ul className="mt-3 space-y-2">
            {summaries.map((s) => (
              <li key={s.id} className="text-sm text-gray-700">
                <span className="font-medium">{s.title}</span> — {s.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{brief.privacy_note ?? labels.privacy}</p>
    </div>
  );
}
