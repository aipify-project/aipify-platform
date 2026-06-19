"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import {
  parseBusinessContinuityCenter,
  type BusinessContinuityCenter,
} from "@/lib/business-continuity-engine/parse";
import type { buildBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";

type Labels = ReturnType<typeof buildBusinessContinuityLabels>;

function statusKeyToKind(statusKey?: string): AipifyStatusKind {
  if (statusKey === "completed") return "completed";
  if (statusKey === "failed") return "not_allowed";
  if (statusKey === "in_progress") return "waiting";
  return "information";
}

export function RecoveryTaskBoardPanel({ labels }: { labels: Labels }) {
  const [center, setCenter] = useState<BusinessContinuityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/business-continuity/center?section=recovery");
    if (res.ok) setCenter(parseBusinessContinuityCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
      </div>
    );
  }

  const tasks = center.recovery_tasks ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.recoveryBoard}</h2>
          <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.recovery_plans?.length ? (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.groups.recoveryPlans}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.recovery_plans.map((plan, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-zinc-900">{String(plan.recovery_title ?? "")}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Priority {String(plan.priority_rank ?? "—")} · {String(plan.recovery_progress_pct ?? 0)}%
                </p>
                {typeof plan.summary === "string" ? (
                  <p className="mt-2 text-sm text-zinc-600">{plan.summary}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="font-semibold text-zinc-900">{labels.groups.recoveryTasks}</h3>
        {tasks.length ? (
          <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white shadow-sm">
            {tasks.map((task, idx) => (
              <div key={idx} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-zinc-900">{String(task.task_title ?? "")}</p>
                  <p className="text-xs text-zinc-500">{String(task.assignee_label ?? "")}</p>
                </div>
                {typeof task.status_label === "string" ? (
                  <AipifyStatusBadge
                    kind={statusKeyToKind(String(task.status_key ?? ""))}
                    label={task.status_label}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600">{labels.noRecords}</p>
        )}
      </section>

      {center.post_crisis_reviews?.length ? (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.groups.postCrisisReviews}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.post_crisis_reviews.map((review, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-zinc-900">{String(review.review_title ?? "")}</p>
                {typeof review.summary === "string" ? (
                  <p className="mt-2 text-sm text-zinc-600">{review.summary}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
