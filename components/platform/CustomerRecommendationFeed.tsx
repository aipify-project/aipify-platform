"use client";

import { useState } from "react";
import type { WorkspaceRecommendation } from "@/lib/platform/customer-workspace";

const PRIORITY_STYLES: Record<WorkspaceRecommendation["priority"], string> = {
  low: "bg-gray-50 text-gray-600",
  normal: "bg-blue-50 text-blue-700",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-rose-50 text-rose-700",
};

type CustomerRecommendationFeedProps = {
  title: string;
  recommendations: WorkspaceRecommendation[];
  labels: {
    priority: string;
    recommendedAction: string;
    confidence: string;
    dismiss: string;
    empty: string;
  };
  priorityLabels: Record<string, string>;
  onDismiss?: (recommendationId: string) => void;
};

export default function CustomerRecommendationFeed({
  title,
  recommendations,
  labels,
  priorityLabels,
  onDismiss,
}: CustomerRecommendationFeedProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = recommendations.filter((rec) => !dismissed.has(rec.id));

  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((rec) => (
            <li
              key={rec.id}
              className="rounded-xl bg-white/90 px-4 py-4 ring-1 ring-violet-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[rec.priority]}`}
                    >
                      {priorityLabels[rec.priority] ?? rec.priority}
                    </span>
                    <span className="text-xs font-medium text-violet-600">
                      {labels.confidence.replace("{value}", String(rec.confidence))}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">{rec.message}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-semibold">{labels.recommendedAction}:</span>{" "}
                    {rec.recommendedAction}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDismissed((prev) => new Set(prev).add(rec.id));
                    onDismiss?.(rec.id);
                  }}
                  className="shrink-0 text-xs font-semibold text-gray-500 hover:text-gray-700"
                >
                  {labels.dismiss}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
