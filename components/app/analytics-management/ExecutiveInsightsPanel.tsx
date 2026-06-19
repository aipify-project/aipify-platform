"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseExecutiveInsightsCenter,
  type AnalyticsInsight,
  type AnalyticsManagementLabels,
  type ExecutiveInsightsCenter,
} from "@/lib/analytics-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

const SEVERITY_STYLE: Record<string, string> = {
  critical: "bg-rose-50 text-rose-900 ring-rose-200",
  important: "bg-amber-50 text-amber-900 ring-amber-200",
  attention: "bg-sky-50 text-sky-900 ring-sky-200",
  information: "bg-gray-50 text-gray-700 ring-gray-200",
};

function InsightCard({
  insight,
  labels,
  onAcknowledge,
  onDismiss,
  busy,
}: {
  insight: AnalyticsInsight;
  labels: AnalyticsManagementLabels;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${SEVERITY_STYLE[insight.severity] ?? SEVERITY_STYLE.information}`}>
          {insight.severity}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{insight.summary}</p>
      {insight.recommendation ? <p className="mt-2 text-sm font-medium text-indigo-900">{insight.recommendation}</p> : null}
      {insight.metric_delta != null ? <p className="mt-1 text-xs text-gray-500">Δ {insight.metric_delta}%</p> : null}
      {insight.status === "active" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onAcknowledge(insight.id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium">{labels.acknowledge}</button>
          <button type="button" disabled={busy} onClick={() => onDismiss(insight.id)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600">{labels.dismiss}</button>
        </div>
      ) : null}
    </div>
  );
}

type Props = { labels: AnalyticsManagementLabels };

export function ExecutiveInsightsPanel({ labels }: Props) {
  const [center, setCenter] = useState<ExecutiveInsightsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/analytics/insights");
    if (res.ok) setCenter(parseExecutiveInsightsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/analytics/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  }
  if (!center?.found) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <Link href="/app/analytics" className="text-sm text-indigo-600 hover:underline">{labels.backToAnalytics}</Link>
        <AipifyModuleAccessDenied message={labels.accessDenied} />
      </div>
    );
  }

  const briefings = center.briefings ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <Link href="/app/analytics" className="text-sm text-indigo-600 hover:underline">{labels.backToAnalytics}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.insightsTitle}</h1>
        <p className="mt-2 text-gray-600">{labels.insightsSubtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.coaching_note ? <p className="mt-1 text-sm text-gray-500">{center.coaching_note}</p> : null}
      </div>

      {center.organization_health != null ? (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.organizationHealth}</p>
          <p className="mt-1 text-3xl font-bold text-indigo-950">{center.organization_health}/100</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => void runAction("generate_insight")} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {labels.generateInsights}
        </button>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Executive briefings</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {[
            ["daily", labels.dailyBrief],
            ["weekly", labels.weeklyBrief],
            ["monthly", labels.monthlyBrief],
            ["quarterly", labels.quarterlyBrief],
          ].map(([key, label]) => {
            const b = briefings[key as string];
            return (
              <div key={key} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
                <h3 className="font-semibold text-gray-900">{String(b?.title ?? label)}</h3>
                <p className="mt-2 text-gray-600">{String(b?.summary ?? "")}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
        {(center.insights ?? []).length === 0 ? (
          <div className="mt-3">
            <PlatformEmptyState title={labels.noInsights} message={labels.noDataHint} primaryAction={{ label: labels.generateInsights, href: "#" }} />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {(center.insights ?? []).map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                labels={labels}
                busy={busy}
                onAcknowledge={(id) => void runAction("acknowledge_insight", { insight_id: id })}
                onDismiss={(id) => void runAction("dismiss_insight", { insight_id: id })}
              />
            ))}
          </div>
        )}
      </section>

      {(center.companion_examples ?? []).length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.companion}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {(center.companion_examples ?? []).map((ex) => <li key={ex}>{ex}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
