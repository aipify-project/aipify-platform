"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MODERATION_QUEUE_TABS,
  parseModerationDashboard,
  type ModerationDashboard,
  type ModerationQueueTab,
  type ModerationResultItem,
} from "@/lib/aipify/moderation";

type Props = { labels: Record<string, string> };

function decisionBadgeClass(decision: string): string {
  if (decision === "auto_approve") return "bg-emerald-100 text-emerald-800";
  if (decision === "auto_reject") return "bg-rose-100 text-rose-800";
  return "bg-amber-100 text-amber-800";
}

function ModerationCard({
  item,
  labels,
  acting,
  onReview,
}: {
  item: ModerationResultItem;
  labels: Record<string, string>;
  acting: string | null;
  onReview: (id: string, action: string, overrideAi?: boolean) => void;
}) {
  const busy = acting === item.id;
  const canAct = item.status === "pending" || item.status === "escalated";

  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 lg:h-32 lg:w-32">
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-500">
              {labels.noPreview}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${decisionBadgeClass(item.decision)}`}>
              {labels[`decision_${item.decision}`] ?? item.decision}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              {labels.confidence}: {item.confidence}%
            </span>
            {item.is_high_risk ? (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                {labels.highRisk}
              </span>
            ) : null}
            {item.is_reported ? (
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                {labels.reported}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-gray-800">{item.reason_summary}</p>
          <dl className="grid gap-1 text-xs text-gray-600 sm:grid-cols-2">
            <div>
              <dt className="inline font-medium">{labels.source}: </dt>
              <dd className="inline capitalize">{item.source_type.replace(/_/g, " ")}</dd>
            </div>
            <div>
              <dt className="inline font-medium">{labels.priority}: </dt>
              <dd className="inline capitalize">{item.priority}</dd>
            </div>
            {item.categories.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="font-medium">{labels.categories}: </dt>
                <dd className="mt-0.5">{item.categories.join(", ")}</dd>
              </div>
            ) : null}
            {item.risk_flags.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="font-medium">{labels.riskFlags}: </dt>
                <dd className="mt-0.5 text-rose-700">{item.risk_flags.join(", ")}</dd>
              </div>
            ) : null}
          </dl>
          {canAct ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                disabled={busy}
                onClick={() => onReview(item.id, "approve", item.decision !== "auto_approve")}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {labels.approve}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onReview(item.id, "reject", item.decision !== "auto_reject")}
                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                {labels.reject}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onReview(item.id, "request_new_upload", true)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50 disabled:opacity-50"
              >
                {labels.requestNewUpload}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onReview(item.id, "escalate", true)}
                className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs text-amber-800 hover:bg-amber-50 disabled:opacity-50"
              >
                {labels.escalate}
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              {labels.finalDecision}: {item.final_decision ?? item.status}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export function AipifyModerationDashboardPanel({ labels }: Props) {
  const [tab, setTab] = useState<ModerationQueueTab>("needs_review");
  const [dashboard, setDashboard] = useState<ModerationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const refresh = useCallback(async (nextTab = tab) => {
    setLoading(true);
    const res = await fetch(`/api/moderation/dashboard?tab=${encodeURIComponent(nextTab)}`);
    if (res.ok) {
      setDashboard(parseModerationDashboard(await res.json()));
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    void refresh(tab);
  }, [tab, refresh]);

  async function handleReview(id: string, action: string, overrideAi = false) {
    setActing(id);
    await fetch(`/api/moderation/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ final_decision: action, override_ai: overrideAi }),
    });
    await refresh(tab);
    setActing(null);
  }

  if (loading && !dashboard) {
    return <div className="text-sm text-gray-600">{labels.loading}</div>;
  }

  const metrics = dashboard?.metrics;

  return (
    <div className="space-y-6">
      {dashboard?.settings.suggest_only_mode ? (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm text-indigo-900">
          {labels.suggestOnlyBanner}
        </div>
      ) : null}

      {metrics ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.metricPending} value={metrics.pending_review} />
          <MetricCard label={labels.metricAutoApproved} value={metrics.auto_approved} />
          <MetricCard label={labels.metricManualQueue} value={metrics.pending_review} />
          <MetricCard
            label={labels.metricQueueReduction}
            value={`${metrics.queue_reduction_pct}%`}
          />
        </section>
      ) : null}

      {dashboard?.learning_insights && dashboard.learning_insights.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.learningInsights}</h2>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {dashboard.learning_insights.map((insight) => (
              <li key={insight.pattern}>{insight.message}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {MODERATION_QUEUE_TABS.map((queueTab) => (
          <button
            key={queueTab}
            type="button"
            onClick={() => setTab(queueTab)}
            className={
              tab === queueTab
                ? "rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white"
                : "rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
            }
          >
            {labels[`tab_${queueTab}`] ?? queueTab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-600">{labels.loading}</div>
      ) : dashboard && dashboard.items.length > 0 ? (
        <ul className="space-y-4">
          {dashboard.items.map((item) => (
            <ModerationCard
              key={item.id}
              item={item}
              labels={labels}
              acting={acting}
              onReview={handleReview}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          {labels.emptyQueue}
        </p>
      )}

      {dashboard?.privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
