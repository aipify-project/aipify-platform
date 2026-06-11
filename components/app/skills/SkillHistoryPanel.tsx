"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSkillInstallHistory, type SkillInstallEvent } from "@/lib/aipify/skills";
import { formatDate } from "@/lib/i18n/format-date";

type SkillHistoryPanelProps = {
  locale: string;
  labels: Record<string, string>;
};

export function SkillHistoryPanel({ locale, labels }: SkillHistoryPanelProps) {
  const [events, setEvents] = useState<SkillInstallEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/skills/history?limit=50");
    if (res.ok) setEvents(parseSkillInstallHistory(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/skills" className="text-sm text-violet-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="font-medium">{e.skill_name}</span>
                <span className="text-xs text-gray-500">{formatDate(e.created_at, locale)}</span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">{e.event_type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
