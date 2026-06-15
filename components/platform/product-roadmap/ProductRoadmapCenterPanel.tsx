"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildRoadmapFilterQuery,
  CATEGORY_BADGES,
  parseProductRoadmapCenter,
  PRIORITY_BADGES,
  STATUS_BADGES,
  type ProductRoadmapCenter,
  type ProductRoadmapCenterLabels,
  type RoadmapFilters,
} from "@/lib/product-roadmap";
import type {
  IdeaSource,
  InitiativeStatus,
  PriorityLevel,
  RoadmapCategory,
  RoadmapView,
} from "@/lib/product-roadmap/constants";

type ProductRoadmapCenterPanelProps = {
  labels: ProductRoadmapCenterLabels;
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

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function ProductRoadmapCenterPanel({
  labels,
  backHref,
}: ProductRoadmapCenterPanelProps) {
  const [center, setCenter] = useState<ProductRoadmapCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<RoadmapFilters>({});
  const [draftFilters, setDraftFilters] = useState<RoadmapFilters>({});
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const load = useCallback(async (activeFilters: RoadmapFilters) => {
    setLoading(true);
    const query = buildRoadmapFilterQuery(activeFilters);
    const res = await fetch(`/api/product-roadmap/overview${query}`);
    if (res.ok) setCenter(parseProductRoadmapCenter(await res.json()));
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
        const res = await fetch("/api/product-roadmap/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters }),
        });
        if (res.ok) setCenter(parseProductRoadmapCenter(await res.json()));
      } finally {
        setBusyId(null);
      }
    },
    [filters]
  );

  const handleCreate = useCallback(async () => {
    if (!newTitle.trim()) return;
    await handleAction({
      action: "create_idea",
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: "improvement",
      source: "platform_admin",
      priority: "medium",
    });
    setNewTitle("");
    setNewDescription("");
  }, [handleAction, newDescription, newTitle]);

  if (loading && !center) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { overview } = center;

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
          <OverviewCard label={labels.overview.plannedInitiatives} value={overview.planned_initiatives} />
          <OverviewCard label={labels.overview.inDevelopment} value={overview.in_development} />
          <OverviewCard label={labels.overview.readyForRelease} value={overview.ready_for_release} />
          <OverviewCard label={labels.overview.customerRequested} value={overview.customer_requested_features} />
          <OverviewCard label={labels.overview.recentlyCompleted} value={overview.recently_completed} />
          <OverviewCard label={labels.overview.deferredItems} value={overview.deferred_items} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.views}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {center.roadmap_views.map((view) => (
            <button
              key={view.key}
              type="button"
              className={`rounded-xl border px-4 py-3 text-left text-sm ${
                filters.roadmap_view === view.key
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  roadmap_view: view.key as RoadmapView,
                }))
              }
            >
              <span className="font-medium text-gray-900">
                {labels.views[view.key as RoadmapView] ?? view.key}
              </span>
              <span className="ml-2 text-gray-500">{view.count}</span>
            </button>
          ))}
        </div>
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
                  category: e.target.value as RoadmapCategory | "",
                }))
              }
            >
              <option value="">{labels.filters.allCategories}</option>
              {Object.entries(labels.categories).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.priority}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.priority ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  priority: e.target.value as PriorityLevel | "",
                }))
              }
            >
              <option value="">{labels.filters.allPriorities}</option>
              {Object.entries(labels.priorities).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
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
                  status: e.target.value as InitiativeStatus | "",
                }))
              }
            >
              <option value="">{labels.filters.allStatuses}</option>
              {Object.entries(labels.statuses).map(([key, label]) => (
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
                  source: e.target.value as IdeaSource | "",
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
            <span className="text-xs text-gray-500">{labels.filters.releaseWindow}</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder={labels.filters.allWindows}
              value={draftFilters.release_window ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, release_window: e.target.value }))
              }
            />
          </label>
        </div>
        <button
          type="button"
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={() => setFilters({ ...draftFilters, roadmap_view: filters.roadmap_view })}
        >
          {labels.filters.apply}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.createIdea}</h2>
        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder={labels.create.placeholderTitle}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            rows={3}
            placeholder={labels.create.placeholderDescription}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button
            type="button"
            disabled={!newTitle.trim() || busyId === "create"}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={() => void handleCreate()}
          >
            {busyId === "create" ? labels.actions.applying : labels.create.submit}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.table}</h2>
        {center.items.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center.items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusPill
                        label={labels.categories[item.category]}
                        className={CATEGORY_BADGES[item.category]}
                      />
                      <StatusPill
                        label={labels.priorities[item.priority]}
                        className={PRIORITY_BADGES[item.priority]}
                      />
                      <StatusPill
                        label={labels.statuses[item.status]}
                        className={STATUS_BADGES[item.status]}
                      />
                      <StatusPill
                        label={labels.views[item.roadmap_view]}
                        className="bg-white text-gray-700 ring-gray-200"
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {labels.table.score}: {item.scores.composite}
                    </p>
                    <p>
                      {labels.table.supportingRequests}: {item.supporting_requests}
                    </p>
                  </div>
                </div>

                <dl className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-gray-500">{labels.table.owner}</dt>
                    <dd>{item.owner || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">{labels.table.targetRelease}</dt>
                    <dd>{item.target_release || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">{labels.table.source}</dt>
                    <dd>{labels.sources[item.source]}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">{labels.table.relatedPhases}</dt>
                    <dd>{item.related_phases.length ? item.related_phases.join(", ") : "—"}</dd>
                  </div>
                </dl>

                {item.request_links.length > 0 ? (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-xs font-medium uppercase text-gray-500">
                      {labels.sections.requests}
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      {item.request_links.map((link) => (
                        <li key={link.id}>
                          {labels.requestSources[link.request_source]} — {link.request_label}
                          {link.company_name ? ` (${link.company_name})` : ""}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-gray-500">
                      {labels.table.enterpriseRequests}: {item.enterprise_requests} ·{" "}
                      {labels.table.partnerRequests}: {item.growth_partner_requests}
                    </p>
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.status === "new" || item.status === "under_review" ? (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                      onClick={() =>
                        void handleAction({ action: "update_status", id: item.id, status: "approved" })
                      }
                    >
                      {labels.actions.approve}
                    </button>
                  ) : null}
                  {item.status === "approved" ? (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                      onClick={() =>
                        void handleAction({ action: "update_status", id: item.id, status: "planned" })
                      }
                    >
                      {labels.actions.plan}
                    </button>
                  ) : null}
                  {item.status === "planned" ? (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                      onClick={() =>
                        void handleAction({
                          action: "update_status",
                          id: item.id,
                          status: "in_development",
                        })
                      }
                    >
                      {labels.actions.startDevelopment}
                    </button>
                  ) : null}
                  {item.status === "in_development" ? (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                      onClick={() =>
                        void handleAction({ action: "update_status", id: item.id, status: "testing" })
                      }
                    >
                      {labels.actions.moveToTesting}
                    </button>
                  ) : null}
                  {item.status === "testing" ? (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                      onClick={() =>
                        void handleAction({
                          action: "publish_release",
                          id: item.id,
                          channels: [
                            "release_notes",
                            "customer_announcement",
                            "in_app_notification",
                          ],
                        })
                      }
                    >
                      {labels.actions.publishRelease}
                    </button>
                  ) : null}
                  {item.roadmap_view !== "now" && item.status !== "released" ? (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                      onClick={() =>
                        void handleAction({
                          action: "update_roadmap_view",
                          id: item.id,
                          roadmap_view: "now",
                        })
                      }
                    >
                      {labels.actions.moveToNow}
                    </button>
                  ) : null}
                  {item.status !== "declined" && item.status !== "released" ? (
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                      onClick={() => void handleAction({ action: "decline", id: item.id })}
                    >
                      {labels.actions.decline}
                    </button>
                  ) : null}
                  {item.released_at ? (
                    <span className="self-center text-xs text-gray-500">
                      {formatDate(item.released_at)}
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-4 space-y-2">
          {center.audit.map((entry) => (
            <li key={entry.id} className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="text-gray-800">{entry.summary}</span>
              <time className="text-xs text-gray-500">{formatDate(entry.created_at)}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
