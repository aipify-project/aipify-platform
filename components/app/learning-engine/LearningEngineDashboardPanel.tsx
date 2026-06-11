"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseLearningEngineDashboard, type LearningEngineDashboard } from "@/lib/aipify/learning-engine";
import { formatDate } from "@/lib/i18n/format-date";

type LearningEngineDashboardPanelProps = {
  locale: string;
  labels: Record<string, string>;
};

export function LearningEngineDashboardPanel({ locale, labels }: LearningEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<LearningEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/learning-engine/dashboard");
    if (res.ok) setDashboard(parseLearningEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function collect() {
    setCollecting(true);
    await fetch("/api/aipify/learning-engine/collect", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await load();
    setCollecting(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;

  const m = dashboard.metrics;
  const metricCards = [
    { label: labels.totalEvents, value: m.total_events },
    { label: labels.positiveFeedback, value: m.positive_feedback },
    { label: labels.negativeFeedback, value: m.negative_feedback },
    { label: labels.falsePositivesReduced, value: m.false_positives_reduced },
    { label: labels.suggestionsImproved, value: m.suggestions_improved },
    { label: labels.noisyReduced, value: m.noisy_notifications_reduced },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-sm text-teal-800">{labels.principle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/learning/review" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.reviewCenter}</Link>
          <Link href="/app/learning/feedback" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.feedback}</Link>
          <Link href="/app/learning/rules" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.rules}</Link>
          <Link href="/app/learning/settings" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.settings}</Link>
          <Link href="/app/learning/audit" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.audit}</Link>
          <button type="button" disabled={collecting} onClick={() => void collect()} className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50">{labels.collect}</button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold">{labels.topPatterns}</h2>
          {dashboard.top_patterns.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noPatterns}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.top_patterns.map((p) => (
                <li key={p.pattern_key} className="rounded border border-white bg-white px-3 py-2">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{p.pattern_key}</span>
                    <span className="text-teal-700">{Math.round(p.current_score)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{p.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold">{labels.recentEvents}</h2>
          {dashboard.recent_events.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noEvents}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {dashboard.recent_events.map((e) => (
                <li key={e.id} className="rounded border border-white bg-white px-3 py-2">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{e.event_type}</span>
                    <span className="text-xs text-gray-400">{formatDate(e.created_at, locale)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{e.source_module} · {e.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
