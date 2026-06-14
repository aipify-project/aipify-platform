"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { SectionCard } from "@/components/app/shared/SectionCard";
import type { CustomerPresenceEvent } from "@/lib/app/customer-app";
import {
  formatWelcomeMessage,
  getBrowserTimezone,
  type GreetingLabels,
} from "@/lib/core/greeting";
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
    statusTitle: string;
    statusActive: string;
    statusDescription: string;
    lastUpdated: string;
    lastUpdatedValue: string;
    metrics: {
      healthScore: string;
      recommendations: string;
      pendingActions: string;
      companionStatus: string;
    };
    companionActive: string;
    sections: {
      briefing: string;
      timeline: string;
      feed: string;
    };
    noEvents: string;
    executiveCenter: string;
    desktopCompanion: string;
    categories: Record<string, string>;
    greetings: GreetingLabels;
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

  if (loading) {
    return <div className="px-6 py-16 text-base text-gray-600">{labels.loading}</div>;
  }

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
  const healthScore = Number(data.health_score ?? 84);
  const pendingActions = Number(data.pending_actions ?? 2);
  const activeRecommendations = Number(data.active_recommendations ?? 1);
  const briefingTimezone = String(briefing?.timezone ?? getBrowserTimezone());
  const localizedBriefing = briefing
    ? formatWelcomeMessage(labels.greetings, { timezone: briefingTimezone })
    : null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/app/command-center/connect" className="text-violet-700 hover:text-violet-900">
            {labels.desktopCompanion}
          </Link>
          <Link href="/app/command-center" className="text-violet-700 hover:text-violet-900">
            {labels.executiveCenter}
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{labels.statusTitle}</h2>
        <p className="mt-2 text-base font-medium text-emerald-700">{labels.statusActive}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">
          {labels.statusDescription}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          {labels.lastUpdated}: {labels.lastUpdatedValue}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: labels.metrics.healthScore, value: `${healthScore}%` },
            { label: labels.metrics.recommendations, value: String(activeRecommendations) },
            { label: labels.metrics.pendingActions, value: String(pendingActions) },
            { label: labels.metrics.companionStatus, value: labels.companionActive },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      {briefing ? (
        <SectionCard title={labels.sections.briefing}>
          <p className="text-lg font-medium text-gray-900">
            {localizedBriefing?.message ?? String(briefing.greeting ?? "")}
          </p>
          <p className="mt-3 text-base text-gray-600">{String(briefing.headline ?? "")}</p>
          <ul className="mt-4 space-y-2">
            {((briefing.bullets as string[]) ?? []).map((bullet) => (
              <li key={bullet} className="text-base text-gray-700">
                {bullet}
              </li>
            ))}
          </ul>
        </SectionCard>
      ) : null}

      <SectionCard title={labels.sections.feed}>
        {feed.length === 0 ? (
          <p className="text-base text-gray-600">{labels.noEvents}</p>
        ) : (
          <ul className="space-y-3">
            {feed.map((entry) => (
              <li key={entry.id} className="text-base text-gray-700">
                <span className="font-medium text-gray-500">{entry.time_label}</span>
                {" — "}
                {entry.message}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title={labels.sections.timeline}>
        {timeline.length === 0 ? (
          <p className="text-base text-gray-600">{labels.noEvents}</p>
        ) : (
          <ul className="space-y-3">
            {timeline.map((event) => (
              <li key={event.id} className="flex gap-3 text-base">
                <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {labels.categories[event.category] ?? event.category}
                </span>
                <span className="text-gray-800">{event.title}</span>
                <span className="ml-auto shrink-0 text-sm text-gray-400">
                  {formatDate(event.created_at, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
