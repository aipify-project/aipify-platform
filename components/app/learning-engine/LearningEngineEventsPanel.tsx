"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseLearningEvents, type LearningEvent } from "@/lib/aipify/learning-engine";
import { formatDate } from "@/lib/i18n/format-date";

type LearningEngineEventsPanelProps = {
  locale: string;
  labels: Record<string, string>;
};

export function LearningEngineEventsPanel({ locale, labels }: LearningEngineEventsPanelProps) {
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/learning-engine/events?limit=50");
    if (res.ok) {
      const data = await res.json();
      setEvents(parseLearningEvents({ events: data.events }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/learning" className="text-sm text-teal-700">{labels.back}</Link>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="font-medium">{e.event_type}</span>
                <span className="text-xs text-gray-500">{formatDate(e.created_at, locale)}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{e.source_module} · {e.explanation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
