"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  AUTOMATION_CONTROL_CORE_PRINCIPLE,
  groupAutomationsByClassification,
  parseAutomationControlCenter,
  parseAutomationControlDetail,
  type AutomationControlCenter,
  type AutomationControlDetail,
  type AutomationControlEntry,
} from "@/lib/automation-control-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  operationsLink: string;
  adaptiveAutomationLink: string;
  sections: {
    executiveOverview: string;
    aipifyInsights: string;
    businessAutomations: string;
    selfHealingCenter: string;
    activityFeed: string;
    recommendations: string;
    analytics: string;
  };
  metrics: {
    activeAutomations: string;
    needsAttention: string;
    timeSaved: string;
    selfHealingSaved: string;
    avgHealth: string;
    reviewsOverdue: string;
  };
  classifications: Record<string, string>;
  healthBands: Record<string, string>;
  reviewStates: Record<string, string>;
  activityLevels: Record<string, string>;
  detail: {
    overview: string;
    performance: string;
    businessValue: string;
    explanation: string;
    ownership: string;
    timeline: string;
    successRate: string;
    executions: string;
    avgRuntime: string;
    failures: string;
    owner: string;
    department: string;
    escalation: string;
    approvalStatus: string;
    markReviewed: string;
    close: string;
    whatDoesThisDo: string;
  };
  dismiss: string;
  emptyRecommendations: string;
  privacyNote: string;
  timeSavedEstimate: string;
  selfHealingEstimate: string;
};

type Props = { labels: PanelLabels; locale: string };

const HEALTH_STYLES: Record<string, string> = {
  excellent: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  good: "bg-sky-100 text-sky-800 ring-sky-200",
  attention_needed: "bg-amber-100 text-amber-900 ring-amber-200",
  critical: "bg-rose-100 text-rose-900 ring-rose-200",
};

const ACTIVITY_STYLES: Record<string, string> = {
  informational: "border-gray-200 bg-gray-50",
  success: "border-emerald-200 bg-emerald-50/60",
  warning: "border-amber-200 bg-amber-50/60",
  critical: "border-rose-200 bg-rose-50/60",
};

const INSIGHT_STYLES: Record<string, string> = {
  healthy: "border-emerald-200 bg-emerald-50/60",
  needs_attention: "border-amber-200 bg-amber-50/60",
  critical: "border-rose-200 bg-rose-50/60",
  review_due: "border-sky-200 bg-sky-50/60",
};

export function AutomationControlCenterPanel({ labels, locale }: Props) {
  const [center, setCenter] = useState<AutomationControlCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [detail, setDetail] = useState<AutomationControlDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/automation-control/center");
    if (res.ok) setCenter(parseAutomationControlCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(
    () => groupAutomationsByClassification(center?.automations ?? []),
    [center?.automations],
  );

  const openDetail = async (entryKey: string) => {
    setSelectedKey(entryKey);
    setDetailLoading(true);
    const res = await fetch(`/api/automation-control/detail?entry_key=${encodeURIComponent(entryKey)}`);
    if (res.ok) setDetail(parseAutomationControlDetail(await res.json()));
    setDetailLoading(false);
  };

  const markReviewed = async () => {
    if (!selectedKey) return;
    await fetch("/api/automation-control/detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_reviewed", entry_key: selectedKey }),
    });
    await openDetail(selectedKey);
    await load();
  };

  const dismissRecommendation = async (key: string) => {
    await fetch("/api/automation-control/detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "dismiss_recommendation", recommendation_key: key }),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const overview = center?.executive_overview;
  const insight = center?.aipify_insight;
  const analytics = center?.analytics;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.operations_center && (
          <Link href={center.links.operations_center} className="text-indigo-600 hover:underline">
            {labels.operationsLink}
          </Link>
        )}
        {center?.links?.adaptive_automation && (
          <Link href={center.links.adaptive_automation} className="text-indigo-600 hover:underline">
            {labels.adaptiveAutomationLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {labels.corePrinciple}: {AUTOMATION_CONTROL_CORE_PRINCIPLE}
        </p>
      </div>

      {overview && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.executiveOverview}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label={labels.metrics.activeAutomations} value={overview.active_automations} />
            <Metric label={labels.metrics.needsAttention} value={overview.needs_attention} />
            <Metric
              label={labels.metrics.timeSaved}
              value={`${overview.time_saved_hours_month}h`}
            />
            <Metric
              label={labels.metrics.selfHealingSaved}
              value={`${overview.self_healing_hours_saved}h`}
            />
            <Metric label={labels.metrics.avgHealth} value={`${overview.avg_health_score}%`} />
            <Metric label={labels.metrics.reviewsOverdue} value={overview.review_overdue_count} />
          </dl>
        </section>
      )}

      {insight && (
        <section
          className={`rounded-2xl border p-5 ${INSIGHT_STYLES[insight.state] ?? "border-gray-200 bg-white"}`}
        >
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.aipifyInsights}</h2>
          <p className="mt-2 text-sm text-gray-800">{insight.message}</p>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.businessAutomations}</h2>
        <div className="mt-4 space-y-6">
          {(["customer", "operations", "financial", "executive"] as const).map((classification) => {
            const entries = grouped[classification] ?? [];
            if (entries.length === 0) return null;
            return (
              <div key={classification}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {labels.classifications[classification]}
                </h3>
                <div className="mt-2 space-y-2">
                  {entries.map((entry) => (
                    <AutomationRow
                      key={entry.entry_key}
                      entry={entry}
                      labels={labels}
                      onSelect={() => void openDetail(entry.entry_key)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {(center?.self_healing.length ?? 0) > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.selfHealingCenter}</h2>
          <div className="mt-4 space-y-2">
            {center?.self_healing.map((entry) => (
              <AutomationRow
                key={entry.entry_key}
                entry={entry}
                labels={labels}
                onSelect={() => void openDetail(entry.entry_key)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.activityFeed}</h2>
          <ul className="mt-4 space-y-2">
            {center?.activity_feed.map((item) => (
              <li
                key={item.activity_key}
                className={`rounded-xl border p-3 text-sm ${ACTIVITY_STYLES[item.activity_level] ?? ACTIVITY_STYLES.informational}`}
              >
                <p className="text-gray-900">{item.message}</p>
                {item.created_at && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDateTime(item.created_at, locale)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.recommendations}</h2>
          {(center?.recommendations.length ?? 0) === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.emptyRecommendations}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {center?.recommendations.map((rec) => (
                <li key={rec.recommendation_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                  <p className="text-gray-900">{rec.message}</p>
                  {center?.can_manage && (
                    <button
                      type="button"
                      onClick={() => void dismissRecommendation(rec.recommendation_key)}
                      className="mt-2 text-xs text-indigo-600 hover:underline"
                    >
                      {labels.dismiss}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {analytics && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.analytics}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label={labels.timeSavedEstimate}
              value={`${analytics.time_saved_hours_month ?? 0}h`}
            />
            <Metric
              label={labels.selfHealingEstimate}
              value={`${analytics.self_healing_disruption_prevented_hours ?? 0}h`}
            />
            <Metric label={labels.metrics.reviewsOverdue} value={Number(analytics.reviews_overdue ?? 0)} />
            <Metric
              label={labels.sections.recommendations}
              value={Number(analytics.open_recommendations ?? 0)}
            />
          </dl>
        </section>
      )}

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}

      {selectedKey && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            {detailLoading || !detail ? (
              <p className="text-sm text-gray-500">{labels.loading}</p>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{detail.entry.name}</h3>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${HEALTH_STYLES[detail.entry.health_band] ?? HEALTH_STYLES.good}`}
                    >
                      {labels.healthBands[detail.entry.health_band] ?? detail.entry.health_band}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKey(null);
                      setDetail(null);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    {labels.detail.close}
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <DetailBlock title={labels.detail.overview}>
                    <p>{String(detail.overview.purpose ?? "")}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      {labels.detail.owner}: {detail.entry.owner_name} · {labels.detail.department}:{" "}
                      {detail.entry.department_owner}
                    </p>
                    <p className="text-sm text-gray-600">
                      {labels.detail.approvalStatus}: {detail.entry.approval_status}
                    </p>
                  </DetailBlock>

                  <DetailBlock title={labels.detail.whatDoesThisDo}>
                    <p>{detail.aipify_explanation}</p>
                  </DetailBlock>

                  <DetailBlock title={labels.detail.performance}>
                    <p>
                      {labels.detail.successRate}: {detail.entry.success_rate}% · {labels.detail.executions}:{" "}
                      {detail.entry.execution_count} · {labels.detail.avgRuntime}:{" "}
                      {detail.entry.avg_runtime_ms}ms · {labels.detail.failures}: {detail.entry.failure_count}
                    </p>
                  </DetailBlock>

                  <DetailBlock title={labels.detail.businessValue}>
                    <p>{detail.entry.business_value_message}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.timeSavedEstimate}: {detail.entry.time_saved_hours_month}h
                    </p>
                  </DetailBlock>

                  <DetailBlock title={labels.detail.timeline}>
                    <ul className="space-y-1 text-sm">
                      {detail.timeline.map((item) => (
                        <li key={item.label}>
                          {item.label}: {item.at ? formatDateTime(item.at, locale) : "—"}
                        </li>
                      ))}
                    </ul>
                  </DetailBlock>

                  {center?.can_record && (
                    <button
                      type="button"
                      onClick={() => void markReviewed()}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      {labels.detail.markReviewed}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AutomationRow({
  entry,
  labels,
  onSelect,
}: {
  entry: AutomationControlEntry;
  labels: PanelLabels;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-left hover:bg-gray-100/80"
    >
      <div>
        <p className="font-medium text-gray-900">{entry.name}</p>
        <p className="mt-1 text-xs text-gray-500">
          {entry.success_rate}% · {entry.execution_count} runs ·{" "}
          {labels.reviewStates[entry.review_state] ?? entry.review_state}
        </p>
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${HEALTH_STYLES[entry.health_band] ?? HEALTH_STYLES.good}`}
      >
        {labels.healthBands[entry.health_band] ?? entry.health_band}
      </span>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <div className="mt-1 text-sm text-gray-700">{children}</div>
    </div>
  );
}
