"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildDecisionFilterQuery,
  confidenceLabel,
  confidenceTone,
  IMPACT_BADGES,
  parsePlatformDecisionCenter,
  STATUS_BADGES,
  type DecisionFilters,
  type PlatformDecisionCenter,
  type PlatformDecisionCenterLabels,
} from "@/lib/platform-decision-center";
import type {
  ImpactLevel,
  RecommendationCategory,
  RecommendationStatus,
} from "@/lib/platform-decision-center/constants";

type PlatformDecisionCenterPanelProps = {
  labels: PlatformDecisionCenterLabels;
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

function RecommendationCard({
  rec,
  labels,
  busyId,
  onAction,
}: {
  rec: PlatformDecisionCenter["recommendations"][number];
  labels: PlatformDecisionCenterLabels;
  busyId: string | null;
  onAction: (payload: Record<string, unknown>) => void;
}) {
  const [ownerInput, setOwnerInput] = useState(rec.owner);
  const [noteInput, setNoteInput] = useState(rec.note);
  const [roadmapInput, setRoadmapInput] = useState(rec.roadmap_link);
  const [taskInput, setTaskInput] = useState("");

  return (
    <article className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{rec.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{rec.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusPill label={labels.statuses[rec.status]} className={STATUS_BADGES[rec.status]} />
            <StatusPill label={labels.impactLevels[rec.impact_level]} className={IMPACT_BADGES[rec.impact_level]} />
            <span className={`text-xs font-semibold ${confidenceTone(rec.confidence_score)}`}>
              {confidenceLabel(rec.confidence_score)} {labels.table.confidence}
            </span>
            <span className="text-xs text-gray-500">{labels.categories[rec.category]}</span>
          </div>
          {rec.recommended_actions.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500">{labels.sections.recommendedActions}</p>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                {rec.recommended_actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          )}
          {rec.tasks.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500">{labels.sections.tasks}</p>
              <ul className="mt-1 space-y-1 text-sm text-gray-600">
                {rec.tasks.map((task) => (
                  <li key={task.id}>
                    {task.title} {task.owner ? `· ${task.owner}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {rec.note && <p className="mt-2 text-xs text-gray-500 italic">{rec.note}</p>}
          {rec.roadmap_link && (
            <p className="mt-1 text-xs text-indigo-600">
              <Link href={rec.roadmap_link}>{rec.roadmap_link}</Link>
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          {rec.status === "new" && (
            <button
              type="button"
              disabled={busyId === rec.id}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onAction({ action: "start_review", id: rec.id })}
            >
              {labels.actions.startReview}
            </button>
          )}
          {!["accepted", "implemented", "dismissed"].includes(rec.status) && (
            <>
              <button
                type="button"
                disabled={busyId === rec.id}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                onClick={() => onAction({ action: "accept_recommendation", id: rec.id })}
              >
                {labels.actions.accept}
              </button>
              <button
                type="button"
                disabled={busyId === rec.id}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => onAction({ action: "dismiss_recommendation", id: rec.id })}
              >
                {labels.actions.dismiss}
              </button>
            </>
          )}
          {rec.status === "accepted" && (
            <button
              type="button"
              disabled={busyId === rec.id}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              onClick={() => onAction({ action: "mark_implemented", id: rec.id })}
            >
              {labels.actions.markImplemented}
            </button>
          )}
          <div className="flex gap-1">
            <input
              className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-xs"
              placeholder={labels.prompts.owner}
              value={ownerInput}
              onChange={(e) => setOwnerInput(e.target.value)}
            />
            <button
              type="button"
              disabled={busyId === rec.id}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              onClick={() => onAction({ action: "assign_owner", id: rec.id, owner: ownerInput })}
            >
              {labels.actions.assignOwner}
            </button>
          </div>
          <div className="flex gap-1">
            <input
              className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-xs"
              placeholder={labels.prompts.note}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <button
              type="button"
              disabled={busyId === rec.id}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              onClick={() => onAction({ action: "add_note", id: rec.id, note: noteInput })}
            >
              {labels.actions.addNote}
            </button>
          </div>
          <div className="flex gap-1">
            <input
              className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-xs"
              placeholder={labels.prompts.roadmapLink}
              value={roadmapInput}
              onChange={(e) => setRoadmapInput(e.target.value)}
            />
            <button
              type="button"
              disabled={busyId === rec.id}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              onClick={() =>
                onAction({ action: "link_roadmap", id: rec.id, roadmap_link: roadmapInput })
              }
            >
              {labels.actions.linkRoadmap}
            </button>
          </div>
          <div className="flex gap-1">
            <input
              className="min-w-0 flex-1 rounded border border-gray-200 px-2 py-1 text-xs"
              placeholder={labels.prompts.taskTitle}
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button
              type="button"
              disabled={busyId === rec.id || !taskInput.trim()}
              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
              onClick={() => {
                onAction({
                  action: "create_task",
                  id: rec.id,
                  task_title: taskInput.trim(),
                  owner: ownerInput,
                });
                setTaskInput("");
              }}
            >
              {labels.actions.createTask}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PlatformDecisionCenterPanel({ labels, backHref }: PlatformDecisionCenterPanelProps) {
  const [center, setCenter] = useState<PlatformDecisionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<DecisionFilters>({});
  const [draftFilters, setDraftFilters] = useState<DecisionFilters>({});

  const load = useCallback(async (activeFilters: DecisionFilters) => {
    setLoading(true);
    const query = buildDecisionFilterQuery(activeFilters);
    const res = await fetch(`/api/platform-decision-center/overview${query}`);
    if (res.ok) setCenter(parsePlatformDecisionCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      const id = String(payload.id ?? "action");
      setBusyId(id);
      try {
        const res = await fetch("/api/platform-decision-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters }),
        });
        if (res.ok) setCenter(parsePlatformDecisionCenter(await res.json()));
      } finally {
        setBusyId(null);
      }
    },
    [filters]
  );

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview } = center;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
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

      <section className="rounded-2xl border border-violet-100 bg-violet-50 p-6">
        <h2 className="font-semibold text-violet-900">{labels.executiveSummary}</h2>
        <p className="mt-2 text-sm text-violet-800">{center.executive_summary}</p>
        {center.high_impact.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-violet-900">
            {center.high_impact.map((rec) => (
              <li key={rec.id}>• {rec.title}</li>
            ))}
          </ul>
        )}
        {center.risks.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-violet-900">
            {center.risks.map((rec) => (
              <li key={rec.id}>• {rec.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.recommendationsGenerated} value={overview.recommendations_generated} />
          <OverviewCard label={labels.overview.recommendationsAccepted} value={overview.recommendations_accepted} />
          <OverviewCard label={labels.overview.recommendationsDeclined} value={overview.recommendations_declined} />
          <OverviewCard label={labels.overview.highImpactOpportunities} value={overview.high_impact_opportunities} />
          <OverviewCard label={labels.overview.risksIdentified} value={overview.risks_identified} />
          <OverviewCard label={labels.overview.pendingReviews} value={overview.pending_reviews} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.category}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.category ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  category: e.target.value as RecommendationCategory | "",
                }))
              }
            >
              <option value="">{labels.filters.allCategories}</option>
              {Object.entries(labels.categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.impactLevel}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.impact_level ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  impact_level: e.target.value as ImpactLevel | "",
                }))
              }
            >
              <option value="">{labels.filters.allImpactLevels}</option>
              {Object.entries(labels.impactLevels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.status}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  status: e.target.value as RecommendationStatus | "",
                }))
              }
            >
              <option value="">{labels.filters.allStatuses}</option>
              {Object.entries(labels.statuses).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.owner}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.owner ?? ""}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, owner: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.confidenceMin}</span>
            <input
              type="number"
              min={0}
              max={100}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.confidence_min ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  confidence_min: e.target.value ? Number(e.target.value) : "",
                }))
              }
            />
          </label>
        </div>
        <button
          type="button"
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={() => setFilters(draftFilters)}
        >
          {labels.filters.apply}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.recommendations}</h2>
        {center.recommendations.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center.recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                labels={labels}
                busyId={busyId}
                onAction={(payload) => void handleAction(payload)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        {center.audit.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {center.audit.map((entry) => (
              <li key={entry.id} className="py-3">
                <p className="text-sm text-gray-900">{entry.summary}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {entry.event_type} · {new Date(entry.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
