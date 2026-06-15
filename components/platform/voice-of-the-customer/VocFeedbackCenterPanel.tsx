"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildVocFilterQuery,
  FEEDBACK_TYPES,
  parseVocFeedbackCenter,
  PRIORITY_BADGES,
  STATUS_BADGES,
  WORKFLOW_STATUSES,
  type FeedbackFilters,
  type FeedbackRow,
  type VocFeedbackCenter,
  type VocFeedbackCenterLabels,
} from "@/lib/voice-of-the-customer";

type VocFeedbackCenterPanelProps = {
  labels: VocFeedbackCenterLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

export function VocFeedbackCenterPanel({ labels, backHref }: VocFeedbackCenterPanelProps) {
  const [center, setCenter] = useState<VocFeedbackCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({});
  const [draftFilters, setDraftFilters] = useState<FeedbackFilters>({});
  const [selected, setSelected] = useState<FeedbackRow | null>(null);

  const load = useCallback(async (activeFilters: FeedbackFilters) => {
    setLoading(true);
    const query = buildVocFilterQuery(activeFilters);
    const res = await fetch(`/api/voice-of-the-customer/feedback-center${query}`);
    if (res.ok) setCenter(parseVocFeedbackCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, string>) => {
      setBusyId(payload.feedback_id ?? "busy");
      try {
        const res = await fetch("/api/voice-of-the-customer/feedback-actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) await load(filters);
      } finally {
        setBusyId(null);
      }
    },
    [filters, load]
  );

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {center.principle}
        </p>
      </div>

      {center.is_empty && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
          {labels.emptyState}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={draftFilters.feedback_type ?? ""}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                feedback_type: e.target.value as FeedbackFilters["feedback_type"],
              }))
            }
          >
            <option value="">{labels.filters.allTypes}</option>
            {FEEDBACK_TYPES.map((key) => (
              <option key={key} value={key}>
                {labels.feedbackTypes[key]}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={draftFilters.workflow_status ?? ""}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                workflow_status: e.target.value as FeedbackFilters["workflow_status"],
              }))
            }
          >
            <option value="">{labels.filters.allStatuses}</option>
            {WORKFLOW_STATUSES.map((key) => (
              <option key={key} value={key}>
                {labels.statuses[key]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setFilters({ ...draftFilters })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.filters.apply}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.newFeedback} value={center.overview.new_feedback} />
          <OverviewCard label={labels.overview.bugs} value={center.overview.bugs_reported} />
          <OverviewCard label={labels.overview.features} value={center.overview.feature_requests} />
          <OverviewCard
            label={labels.overview.improvements}
            value={center.overview.improvements_submitted}
          />
          <OverviewCard label={labels.overview.resolved} value={center.overview.resolved_feedback} />
          <OverviewCard
            label={labels.overview.awaitingReview}
            value={center.overview.awaiting_review}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.feedback}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">{labels.table.category}</th>
                <th className="px-3 py-2">{labels.table.title}</th>
                <th className="px-3 py-2">{labels.table.customer}</th>
                <th className="px-3 py-2">{labels.table.priority}</th>
                <th className="px-3 py-2">{labels.table.submitted}</th>
                <th className="px-3 py-2">{labels.table.status}</th>
                <th className="px-3 py-2">{labels.table.assignedTo}</th>
                <th className="px-3 py-2">{labels.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {center.feedback.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-gray-500">
                    {labels.emptyState}
                  </td>
                </tr>
              ) : (
                center.feedback.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50">
                    <td className="px-3 py-3">{labels.feedbackTypes[row.feedback_type]}</td>
                    <td className="px-3 py-3 font-medium text-gray-900">{row.title}</td>
                    <td className="px-3 py-3">{row.customer}</td>
                    <td className="px-3 py-3">
                      <StatusPill
                        label={labels.priorities[row.priority]}
                        className={PRIORITY_BADGES[row.priority]}
                      />
                    </td>
                    <td className="px-3 py-3">{formatDate(row.submitted_at)}</td>
                    <td className="px-3 py-3">
                      <StatusPill
                        label={labels.statuses[row.workflow_status]}
                        className={STATUS_BADGES[row.workflow_status]}
                      />
                    </td>
                    <td className="px-3 py-3">{row.assigned_to || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(row)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          {labels.actions.view}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() =>
                            void handleAction({
                              action: "assign",
                              feedback_id: row.id,
                              assigned_to: "Product Team",
                            })
                          }
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                          {labels.actions.assign}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() =>
                            void handleAction({
                              action: "update_status",
                              feedback_id: row.id,
                              workflow_status: "planned",
                            })
                          }
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                        >
                          {labels.actions.updateStatus}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6">
          <h3 className="font-semibold text-gray-900">{selected.title}</h3>
          <p className="mt-2 text-sm text-gray-700">{selected.description}</p>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.topRequests}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {center.top_improvement_requests.length === 0 ? (
            <li className="text-gray-500">{labels.emptyState}</li>
          ) : (
            center.top_improvement_requests.map((item) => (
              <li
                key={item.title}
                className="flex justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <span>{item.title}</span>
                <span className="text-gray-500">
                  {labels.table.count}: {item.count}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {center.audit.map((entry) => (
            <li key={entry.id} className="rounded-lg bg-gray-50 px-4 py-3 text-gray-700">
              <span className="font-medium text-gray-900">{entry.summary}</span>
              <span className="mt-1 block text-xs text-gray-500">
                {labels.table.event}: {entry.event_type.replace(/_/g, " ")} ·{" "}
                {formatDate(entry.created_at)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
