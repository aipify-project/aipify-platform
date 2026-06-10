"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { SectionCard } from "@/components/app/shared/SectionCard";
import type { CustomerPresenceEvent } from "@/lib/app/customer-app";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type CustomerPresenceCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    sections: {
      briefing: string;
      timeline: string;
      feed: string;
    };
    noEvents: string;
    commandCenter: string;
    categories: Record<string, string>;
  };
};

export function CustomerPresenceCenterPanel({ locale, labels }: CustomerPresenceCenterPanelProps) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data: bundle, error } = await supabase.rpc("get_customer_presence_center");
    if (!error && bundle?.has_customer) {
      setData(bundle as Record<string, unknown>);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  if (!data?.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const timeline = (data.activity_timeline as CustomerPresenceEvent[]) ?? [];
  const briefing = data.morning_briefing as Record<string, unknown> | undefined;
  const feed = (data.executive_feed as Array<{ id: string; message: string; time_label: string }>) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        </div>
        <Link href="/app/command-center" className="text-sm text-indigo-600 hover:underline">
          {labels.commandCenter}
        </Link>
      </div>

      {briefing && (
        <SectionCard title={labels.sections.briefing}>
          <p className="font-medium text-gray-900">{String(briefing.headline ?? "")}</p>
          <ul className="mt-3 space-y-1">
            {((briefing.bullets as string[]) ?? []).map((bullet) => (
              <li key={bullet} className="text-sm text-gray-700">
                {bullet}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title={labels.sections.timeline}>
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.noEvents}</p>
        ) : (
          <ul className="space-y-3">
            {timeline.map((event) => (
              <li key={event.id} className="flex gap-3 text-sm">
                <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {labels.categories[event.category] ?? event.category}
                </span>
                <span className="text-gray-800">{event.title}</span>
                <span className="ml-auto shrink-0 text-gray-400">
                  {formatDate(event.created_at, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title={labels.sections.feed}>
        <ul className="space-y-2">
          {feed.map((entry) => (
            <li key={entry.id} className="text-sm text-gray-700">
              <span className="font-medium text-gray-500">{entry.time_label}</span> — {entry.message}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
