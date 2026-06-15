"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildEvolutionFilterQuery,
  HEALTH_BADGES,
  parseKnowledgeEvolutionCenter,
  WORKFLOW_BADGES,
  type EvolutionFilters,
  type KnowledgeEvolutionCenter,
  type KnowledgeEvolutionCenterLabels,
} from "@/lib/platform-knowledge-evolution";
import type { HealthStatus, KnowledgeSource, KnowledgeLocale, WorkflowStatus } from "@/lib/platform-knowledge-evolution/constants";

type KnowledgeEvolutionCenterPanelProps = {
  labels: KnowledgeEvolutionCenterLabels;
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

export function KnowledgeEvolutionCenterPanel({ labels, backHref }: KnowledgeEvolutionCenterPanelProps) {
  const [center, setCenter] = useState<KnowledgeEvolutionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<EvolutionFilters>({});
  const [draftFilters, setDraftFilters] = useState<EvolutionFilters>({});
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");

  const load = useCallback(async (activeFilters: EvolutionFilters) => {
    setLoading(true);
    const query = buildEvolutionFilterQuery(activeFilters);
    const res = await fetch(`/api/platform-knowledge-evolution/overview${query}`);
    if (res.ok) setCenter(parseKnowledgeEvolutionCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      const id = String(payload.id ?? payload.article_id ?? "action");
      setBusyId(id);
      try {
        const res = await fetch("/api/platform-knowledge-evolution/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters }),
        });
        if (res.ok) setCenter(parseKnowledgeEvolutionCenter(await res.json()));
      } finally {
        setBusyId(null);
      }
    },
    [filters]
  );

  const handleCreate = useCallback(async () => {
    if (!newTitle.trim()) return;
    setBusyId("create");
    await handleAction({
      action: "create_article",
      title: newTitle.trim(),
      summary: newSummary.trim(),
      source: "internal_documentation",
    });
    setNewTitle("");
    setNewSummary("");
  }, [handleAction, newSummary, newTitle]);

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview, analytics } = center;

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

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.knowledgeArticles} value={overview.knowledge_articles} />
          <OverviewCard label={labels.overview.suggestedImprovements} value={overview.suggested_improvements} />
          <OverviewCard label={labels.overview.pendingReviews} value={overview.pending_reviews} />
          <OverviewCard label={labels.overview.recentlyUpdated} value={overview.recently_updated} />
          <OverviewCard label={labels.overview.knowledgeGaps} value={overview.knowledge_gaps} />
          <OverviewCard label={labels.overview.learningOpportunities} value={overview.learning_opportunities} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.healthStatus}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.health_status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  health_status: e.target.value as HealthStatus | "",
                }))
              }
            >
              <option value="">{labels.filters.allHealth}</option>
              {Object.entries(labels.healthStatuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.workflowStatus}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.workflow_status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  workflow_status: e.target.value as WorkflowStatus | "",
                }))
              }
            >
              <option value="">{labels.filters.allStatuses}</option>
              {Object.entries(labels.workflowStatuses).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.source}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.source ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  source: e.target.value as KnowledgeSource | "",
                }))
              }
            >
              <option value="">{labels.filters.allSources}</option>
              {Object.entries(labels.sources).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.locale}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.locale ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  locale: e.target.value as KnowledgeLocale | "",
                }))
              }
            >
              <option value="">{labels.filters.allLocales}</option>
              {Object.entries(labels.locales).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
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
        <h2 className="font-semibold text-gray-900">{labels.sections.createArticle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder={labels.create.placeholderTitle}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <textarea
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          rows={3}
          placeholder={labels.create.placeholderSummary}
          value={newSummary}
          onChange={(e) => setNewSummary(e.target.value)}
        />
        <button
          type="button"
          disabled={!newTitle.trim() || busyId === "create"}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => void handleCreate()}
        >
          {busyId === "create" ? labels.actions.applying : labels.create.submit}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.articles}</h2>
        {center.articles.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center.articles.map((article) => (
              <article key={article.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{article.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{article.summary || "—"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusPill
                        label={labels.healthStatuses[article.health_status]}
                        className={HEALTH_BADGES[article.health_status]}
                      />
                      <StatusPill
                        label={labels.workflowStatuses[article.workflow_status]}
                        className={WORKFLOW_BADGES[article.workflow_status]}
                      />
                      <span className="text-xs text-gray-500">
                        {labels.sources[article.source]} · {labels.table.healthScore}: {article.health_score}
                      </span>
                    </div>
                    {article.localizations.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500">{labels.sections.localizations}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {article.localizations.map((loc) => (
                            <span
                              key={loc.locale}
                              className="rounded-md bg-white px-2 py-1 text-xs text-gray-700 ring-1 ring-gray-200"
                            >
                              {labels.locales[loc.locale]}: {labels.translationStatuses[loc.translation_status]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.workflow_status === "draft" && (
                      <button
                        type="button"
                        disabled={busyId === article.id}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({
                            action: "update_workflow_status",
                            article_id: article.id,
                            workflow_status: "review_required",
                          })
                        }
                      >
                        {labels.actions.submitReview}
                      </button>
                    )}
                    {article.workflow_status === "review_required" && (
                      <button
                        type="button"
                        disabled={busyId === article.id}
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({
                            action: "approve_article",
                            article_id: article.id,
                            approval_role: "knowledge_admin",
                          })
                        }
                      >
                        {labels.actions.approve}
                      </button>
                    )}
                    {article.workflow_status === "approved" && (
                      <button
                        type="button"
                        disabled={busyId === article.id}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({ action: "publish_article", article_id: article.id })
                        }
                      >
                        {labels.actions.publish}
                      </button>
                    )}
                    {article.workflow_status !== "archived" && (
                      <button
                        type="button"
                        disabled={busyId === article.id}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({ action: "archive_article", article_id: article.id })
                        }
                      >
                        {labels.actions.archive}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.gaps}</h2>
        {center.gaps.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {center.gaps.map((gap) => (
              <li key={gap.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-gray-900">{gap.topic}</p>
                  <p className="text-sm text-gray-600">{gap.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.gapTypes[gap.gap_type]} · {labels.table.occurrences}: {gap.occurrence_count}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === gap.id}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => void handleAction({ action: "resolve_gap", id: gap.id })}
                >
                  {labels.actions.resolveGap}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.suggestions}</h2>
        {center.suggestions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {center.suggestions.map((suggestion) => (
              <li key={suggestion.id} className="py-3">
                <p className="font-medium text-gray-900">{suggestion.title}</p>
                <p className="text-sm text-gray-600">{suggestion.summary}</p>
                <p className="mt-1 text-xs text-gray-500">{labels.suggestionTypes[suggestion.suggestion_type]}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.recommendations}</h2>
        {center.recommendations.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {center.recommendations.map((rec) => (
              <li key={rec.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-gray-900">{rec.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.table.priority}: {rec.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === rec.id}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    onClick={() => void handleAction({ action: "accept_recommendation", id: rec.id })}
                  >
                    {labels.actions.accept}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === rec.id}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => void handleAction({ action: "decline_recommendation", id: rec.id })}
                  >
                    {labels.actions.decline}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.analytics}</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700">{labels.analytics.mostViewed}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {analytics.most_viewed.map((entry, i) => (
                <li key={i}>
                  {entry.title} — {entry.views} {labels.table.views.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">{labels.analytics.highestRated}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {analytics.highest_rated.map((entry, i) => (
                <li key={i}>
                  {entry.title} — {entry.rating?.toFixed(1)} {labels.table.rating.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">{labels.analytics.lowestRated}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {analytics.lowest_rated.map((entry, i) => (
                <li key={i}>
                  {entry.title} — {entry.rating?.toFixed(1)} {labels.table.rating.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">{labels.analytics.mostRequested}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {analytics.most_requested_topics.map((entry, i) => (
                <li key={i}>
                  {entry.topic} — {entry.count}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          {labels.analytics.resolutionContribution}: {analytics.resolution_contribution_rate}%
        </p>
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
