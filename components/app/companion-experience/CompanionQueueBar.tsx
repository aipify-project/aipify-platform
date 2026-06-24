"use client";

import { useEffect, useState } from "react";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import type { CompanionQueueItem, CompanionQueueStatus } from "@/lib/app/companion/chat-queue/types";
import {
  resolveCompanionQueueWaitPhase,
  type CompanionQueueWaitPhase,
} from "@/lib/app/companion/chat-queue/queue-wait-phase";
import { resolveCompanionQueueDisplayError } from "@/lib/app/companion/chat-queue/queue-user-messages";

type CompanionQueueBarProps = {
  queue: CompanionQueueItem[];
  labels: CompanionExperienceLabels;
  onCancel: (queueId: string) => void;
  onRetry: (queueId: string) => void;
  onDismiss: (queueId: string) => void;
  onDismissAllFinished: () => void;
};

function baseStatusLabel(
  status: CompanionQueueStatus,
  labels: CompanionExperienceLabels["queue"],
): string {
  switch (status) {
    case "waiting":
      return labels.statusWaiting;
    case "processing":
      return labels.statusProcessing;
    case "completed":
      return labels.statusCompleted;
    case "failed":
      return labels.statusFailed;
    case "timed_out":
      return labels.statusTimedOut;
    case "cancelled":
      return labels.statusCancelled;
    default:
      return status;
  }
}

function waitPhaseDetail(
  phase: CompanionQueueWaitPhase,
  labels: CompanionExperienceLabels["queue"],
): string | null {
  switch (phase) {
    case "working":
      return labels.statusWorking;
    case "long_wait":
      return labels.statusLongWait;
    case "timeout":
      return labels.statusTimedOut;
    default:
      return null;
  }
}

function statusIcon(status: CompanionQueueStatus): string {
  switch (status) {
    case "waiting":
      return "⏳";
    case "processing":
      return "⚙️";
    case "completed":
      return "✅";
    case "failed":
      return "⚠️";
    case "timed_out":
      return "⏱️";
    case "cancelled":
      return "❌";
    default:
      return "•";
  }
}

export function CompanionQueueBar({
  queue,
  labels,
  onCancel,
  onRetry,
  onDismiss,
  onDismissAllFinished,
}: CompanionQueueBarProps) {
  const [now, setNow] = useState(() => Date.now());
  const active = queue.filter(
    (item) =>
      item.status === "waiting" ||
      item.status === "processing" ||
      item.status === "failed" ||
      item.status === "timed_out",
  );

  const hasActiveWait = active.some(
    (item) => item.status === "waiting" || item.status === "processing",
  );

  useEffect(() => {
    if (!hasActiveWait) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [hasActiveWait]);

  if (active.length === 0) return null;

  const q = labels.queue;
  const dismissableCount = active.filter(
    (item) => item.status === "failed" || item.status === "timed_out",
  ).length;
  const waitingCount = active.filter((item) => item.status === "waiting").length;
  const processingCount = active.filter((item) => item.status === "processing").length;
  const summaryText =
    waitingCount > 0 || processingCount > 0
      ? q.summaryDual
          .replace("{waiting}", String(waitingCount))
          .replace("{processing}", String(processingCount))
      : q.summary.replace("{count}", String(waitingCount));

  return (
    <div
      className="border-t border-aipify-border bg-violet-50/50 px-4 py-3 sm:px-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">
          {q.title}
        </p>
        <div className="flex items-center gap-2">
          {dismissableCount > 1 ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(q.confirmDismissAll)) {
                  onDismissAllFinished();
                }
              }}
              className="text-[11px] font-medium text-violet-800 underline-offset-2 hover:underline"
            >
              {q.dismissAll}
            </button>
          ) : null}
          <span className="text-xs text-violet-800">{summaryText}</span>
        </div>
      </div>
      <ul className="mt-2 space-y-2">
        {active.map((item) => {
          const waitPhase =
            item.status === "waiting" || item.status === "processing"
              ? resolveCompanionQueueWaitPhase({
                  status: item.status,
                  createdAt: item.created_at ?? null,
                  startedAt: item.started_at ?? null,
                  now,
                })
              : "initial";
          const phaseDetail = waitPhaseDetail(waitPhase, q);
          const isFailedLike = item.status === "failed" || item.status === "timed_out";
          const resolvedError = isFailedLike
            ? resolveCompanionQueueDisplayError(item, q.errors)
            : null;
          const displayError =
            isFailedLike && !resolvedError?.primary
              ? {
                  primary: q.errors.turnTimeoutPrimary,
                  secondary: q.errors.turnTimeoutSecondary,
                }
              : resolvedError;

          return (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-violet-100 bg-white px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-xs font-medium text-aipify-text">
                  <span aria-hidden="true">{statusIcon(item.status)}</span>
                  <span>{baseStatusLabel(item.status, q)}</span>
                </p>
                {phaseDetail ? (
                  <p className="mt-1 text-xs text-violet-900">{phaseDetail}</p>
                ) : null}
                <p className="mt-0.5 line-clamp-2 text-xs text-aipify-text-secondary">
                  {item.question_text}
                </p>
                {displayError?.primary ? (
                  <p className="mt-1 text-xs text-amber-900">{displayError.primary}</p>
                ) : null}
                {displayError?.secondary ? (
                  <p className="mt-0.5 text-xs text-aipify-text-muted">{displayError.secondary}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                {item.status === "waiting" || item.status === "processing" ? (
                  <button
                    type="button"
                    onClick={() => onCancel(item.id)}
                    className="rounded-md border border-aipify-border px-2 py-1 text-[11px] font-medium text-aipify-text-muted hover:bg-aipify-surface-muted"
                  >
                    {q.cancel}
                  </button>
                ) : null}
                {isFailedLike ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onRetry(item.id)}
                      className="rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-900 hover:bg-violet-100"
                    >
                      {q.retry}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDismiss(item.id)}
                      className="rounded-md border border-aipify-border px-2 py-1 text-[11px] font-medium text-aipify-text-muted hover:bg-aipify-surface-muted"
                    >
                      {q.dismiss}
                    </button>
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
