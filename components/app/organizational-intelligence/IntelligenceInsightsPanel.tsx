"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseIntelligenceCenter,
  type InsightItem,
  type IntelligenceCenter,
} from "@/lib/aipify/organizational-intelligence";

type IntelligenceInsightsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    refresh: string;
    notEnabledTitle: string;
    notEnabledBody: string;
    enableCta: string;
    healthScore: string;
    strongestArea: string;
    weakestArea: string;
    openRisks: string;
    recommendedActions: string;
    noInsights: string;
    healthBands: Record<string, string>;
    severities: Record<string, string>;
    insightTypes: Record<string, string>;
    actions: {
      acknowledge: string;
      resolve: string;
      dismiss: string;
      snooze: string;
    };
    links: {
      organization: string;
      workflows: string;
      settings: string;
    };
  };
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-rose-100 text-rose-900",
  high: "bg-orange-100 text-orange-900",
  medium: "bg-amber-100 text-amber-900",
  low: "bg-sky-100 text-sky-900",
  info: "bg-gray-100 text-gray-700",
};

const HEALTH_STYLES: Record<string, string> = {
  healthy: "text-emerald-700",
  good: "text-sky-700",
  needs_attention: "text-amber-700",
  risky: "text-orange-700",
  critical: "text-rose-700",
};

export function IntelligenceInsightsPanel({ labels }: IntelligenceInsightsPanelProps) {
  const [center, setCenter] = useState<IntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/intelligence");
    if (res.ok) setCenter(parseIntelligenceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function runDetection() {
    await fetch("/api/aipify/intelligence/generate", { method: "POST" });
    void refresh();
  }

  async function updateInsight(id: string, status: string) {
    await fetch(`/api/aipify/intelligence/insights/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    void refresh();
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (!center?.has_customer) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (center.upgrade_required || !center.has_access) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link
            href="/app/settings/billing"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.upgradeCta}
          </Link>
        </div>
      </div>
    );
  }

  if (center.enabled === false) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="text-sm text-gray-600">{labels.subtitle}</p>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">{labels.notEnabledTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.notEnabledBody}</p>
          <p className="mt-3 text-xs text-gray-500">{center.privacy_note}</p>
          <Link
            href="/app/settings/intelligence"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.enableCta}
          </Link>
        </div>
      </div>
    );
  }

  const insights = center.insights ?? [];
  const healthBand = center.health_band ?? "good";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-indigo-600 hover:underline">
            {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-xs text-gray-500">{center.privacy_note}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void runDetection()}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.refresh}
          </button>
          <Link
            href="/app/settings/intelligence"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.links.settings}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.healthScore}
          </p>
          <p className={`mt-2 text-3xl font-bold ${HEALTH_STYLES[healthBand] ?? ""}`}>
            {center.health_score ?? "—"}%
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthBands[healthBand] ?? healthBand}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.strongestArea}
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {center.strongest_area ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.weakestArea}
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {center.weakest_area ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.openRisks}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{center.open_risks ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/app/organization" className="text-indigo-600 hover:underline">
          {labels.links.organization}
        </Link>
        <Link href="/app/workflows" className="text-indigo-600 hover:underline">
          {labels.links.workflows}
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">{labels.recommendedActions}</h2>
        {insights.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
            {labels.noInsights}
          </p>
        ) : (
          insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              labels={labels}
              onAction={updateInsight}
            />
          ))
        )}
      </section>
    </div>
  );
}

function InsightCard({
  insight,
  labels,
  onAction,
}: {
  insight: InsightItem;
  labels: IntelligenceInsightsPanelProps["labels"];
  onAction: (id: string, status: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[insight.severity] ?? SEVERITY_STYLES.info}`}
        >
          {labels.severities[insight.severity] ?? insight.severity}
        </span>
        <span className="text-xs text-gray-500">
          {labels.insightTypes[insight.insight_type] ?? insight.insight_type}
        </span>
        <span className="text-xs text-gray-400">
          {Math.round(insight.confidence_score * 100)}% confidence
        </span>
      </div>
      <h3 className="mt-2 font-semibold text-gray-900">{insight.title}</h3>
      <p className="mt-1 text-sm text-gray-600">{insight.summary}</p>
      {insight.recommended_action ? (
        <p className="mt-2 text-sm text-indigo-700">{insight.recommended_action}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {insight.status === "open" ? (
          <button
            type="button"
            onClick={() => onAction(insight.id, "acknowledged")}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
          >
            {labels.actions.acknowledge}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onAction(insight.id, "resolved")}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          {labels.actions.resolve}
        </button>
        <button
          type="button"
          onClick={() => onAction(insight.id, "snoozed")}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          {labels.actions.snooze}
        </button>
        <button
          type="button"
          onClick={() => onAction(insight.id, "dismissed")}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        >
          {labels.actions.dismiss}
        </button>
      </div>
    </article>
  );
}
