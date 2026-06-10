"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import {
  getApprovalStatusStyle,
  parseLearningQueue,
  type IntelligencePattern,
  type LearningQueue,
} from "@/lib/platform/intelligence-engine";
import { getEnvironmentStyle } from "@/lib/platform/self-learning";

type PlatformLearningQueuePanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    category: string;
    environment: string;
    detections: string;
    confidence: string;
    impact: string;
    suggestedAction: string;
    status: string;
    firstDetected: string;
    lastDetected: string;
    approve: string;
    reject: string;
    requestMoreData: string;
    reviewing: string;
    totals: {
      pending: string;
      moreData: string;
      approved: string;
    };
  };
};

const EMPTY: LearningQueue = { patterns: [], archived: [], totals: { pending: 0, more_data: 0, approved: 0 } };

export default function PlatformLearningQueuePanel({
  locale,
  labels,
}: PlatformLearningQueuePanelProps) {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<LearningQueue>(EMPTY);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_intelligence_learning_queue");
    setQueue(error || !data ? EMPTY : parseLearningQueue(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function reviewPattern(
    patternId: string,
    action: "approve" | "reject" | "request_more_data"
  ) {
    setReviewingId(patternId);
    try {
      const response = await fetch(`/api/platform/intelligence/patterns/${patternId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (response.ok) await load();
    } finally {
      setReviewingId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label={labels.totals.pending} value={String(queue.totals.pending)} />
        <Stat label={labels.totals.moreData} value={String(queue.totals.more_data)} />
        <Stat label={labels.totals.approved} value={String(queue.totals.approved)} />
      </dl>

      {queue.patterns.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="space-y-4">
          {queue.patterns.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              locale={locale}
              labels={labels}
              reviewing={reviewingId === pattern.id}
              onReview={reviewPattern}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PatternCard({
  pattern,
  locale,
  labels,
  reviewing,
  onReview,
}: {
  pattern: IntelligencePattern;
  locale: string;
  labels: PlatformLearningQueuePanelProps["labels"];
  reviewing: boolean;
  onReview: (id: string, action: "approve" | "reject" | "request_more_data") => void;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{pattern.pattern_title}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
              {labels.category}: {pattern.category}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getEnvironmentStyle(
                pattern.environment_type === "global" ? "internal" : pattern.environment_type
              )}`}
            >
              {labels.environment}: {pattern.environment_type}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getApprovalStatusStyle(pattern.approval_status)}`}
            >
              {labels.status}: {pattern.approval_status}
            </span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>
            {labels.confidence}: <strong>{pattern.confidence_score}%</strong>
          </p>
          <p>
            {labels.detections}: <strong>{pattern.detection_count}</strong>
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        <span className="font-semibold">{labels.suggestedAction}:</span> {pattern.suggested_action}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        {labels.impact}: {pattern.potential_impact} · {labels.firstDetected}:{" "}
        {formatDateTime(pattern.first_detected, locale)} · {labels.lastDetected}:{" "}
        {formatDateTime(pattern.last_detected, locale)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={reviewing}
          onClick={() => onReview(pattern.id, "approve")}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {reviewing ? labels.reviewing : labels.approve}
        </button>
        <button
          type="button"
          disabled={reviewing}
          onClick={() => onReview(pattern.id, "reject")}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {labels.reject}
        </button>
        <button
          type="button"
          disabled={reviewing}
          onClick={() => onReview(pattern.id, "request_more_data")}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {labels.requestMoreData}
        </button>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}
