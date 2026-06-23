"use client";

import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import type { CompanionQueueItem, CompanionQueueStatus } from "@/lib/app/companion/chat-queue/types";

type CompanionQueueBarProps = {
  queue: CompanionQueueItem[];
  labels: CompanionExperienceLabels;
  onCancel: (queueId: string) => void;
  onRetry: (queueId: string) => void;
};

function statusLabel(
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
    case "cancelled":
      return labels.statusCancelled;
    default:
      return status;
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
    case "cancelled":
      return "❌";
    default:
      return "•";
  }
}

export function CompanionQueueBar({ queue, labels, onCancel, onRetry }: CompanionQueueBarProps) {
  const active = queue.filter(
    (item) => item.status === "waiting" || item.status === "processing" || item.status === "failed",
  );

  if (active.length === 0) return null;

  const q = labels.queue;

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
        <span className="text-xs text-violet-800">
          {q.summary.replace("{count}", String(active.filter((i) => i.status === "waiting").length))}
        </span>
      </div>
      <ul className="mt-2 space-y-2">
        {active.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-violet-100 bg-white px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-medium text-aipify-text">
                <span aria-hidden="true">{statusIcon(item.status)}</span>
                <span>{statusLabel(item.status, q)}</span>
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-aipify-text-secondary">
                {item.question_text}
              </p>
              {item.status === "failed" && item.error_message ? (
                <p className="mt-1 text-xs text-amber-900">{item.error_message}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              {item.status === "waiting" ? (
                <button
                  type="button"
                  onClick={() => onCancel(item.id)}
                  className="rounded-md border border-aipify-border px-2 py-1 text-[11px] font-medium text-aipify-text-muted hover:bg-aipify-surface-muted"
                >
                  {q.cancel}
                </button>
              ) : null}
              {item.status === "failed" ? (
                <button
                  type="button"
                  onClick={() => onRetry(item.id)}
                  className="rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-900 hover:bg-violet-100"
                >
                  {q.retry}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
