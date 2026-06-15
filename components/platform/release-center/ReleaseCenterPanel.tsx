"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildReleaseFilterQuery,
  parseReleaseCenter,
  RISK_BADGES,
  STATUS_BADGES,
  TYPE_BADGES,
  type ReleaseCenter,
  type ReleaseCenterFilters,
  type ReleaseCenterLabels,
} from "@/lib/release-center";
import type { Audience, ReleaseStatus, ReleaseType } from "@/lib/release-center/constants";

type ReleaseCenterPanelProps = {
  labels: ReleaseCenterLabels;
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

const STATUS_FLOW: ReleaseStatus[] = [
  "planned",
  "in_development",
  "internal_testing",
  "customer_validation",
  "approved",
  "released",
];

function nextStatus(current: ReleaseStatus): ReleaseStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

export function ReleaseCenterPanel({ labels, backHref }: ReleaseCenterPanelProps) {
  const [center, setCenter] = useState<ReleaseCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReleaseCenterFilters>({});
  const [draftFilters, setDraftFilters] = useState<ReleaseCenterFilters>({});
  const [newName, setNewName] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const load = useCallback(async (activeFilters: ReleaseCenterFilters) => {
    setLoading(true);
    const query = buildReleaseFilterQuery(activeFilters);
    const res = await fetch(`/api/release-center/overview${query}`);
    if (res.ok) setCenter(parseReleaseCenter(await res.json()));
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
        const res = await fetch("/api/release-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters }),
        });
        if (res.ok) setCenter(parseReleaseCenter(await res.json()));
      } finally {
        setBusyId(null);
      }
    },
    [filters]
  );

  const handleCreate = useCallback(async () => {
    if (!newName.trim() || !newVersion.trim()) return;
    setBusyId("create");
    await handleAction({
      action: "create_release",
      release_name: newName.trim(),
      release_version: newVersion.trim(),
      description: newDescription.trim(),
      release_type: "minor",
      risk_level: "medium",
    });
    setNewName("");
    setNewVersion("");
    setNewDescription("");
  }, [handleAction, newDescription, newName, newVersion]);

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
          <OverviewCard label={labels.overview.upcomingReleases} value={overview.upcoming_releases} />
          <OverviewCard label={labels.overview.releasesInTesting} value={overview.releases_in_testing} />
          <OverviewCard label={labels.overview.productionReleases} value={overview.production_releases} />
          <OverviewCard label={labels.overview.emergencyHotfixes} value={overview.emergency_hotfixes} />
          <OverviewCard label={labels.overview.notificationsPending} value={overview.notifications_pending} />
          <OverviewCard label={labels.overview.recentlyCompleted} value={overview.recently_completed} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.releaseType}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.release_type ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  release_type: e.target.value as ReleaseType | "",
                }))
              }
            >
              <option value="">{labels.filters.allTypes}</option>
              {Object.entries(labels.releaseTypes).map(([key, label]) => (
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
                  status: e.target.value as ReleaseStatus | "",
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
            <span className="text-xs text-gray-500">{labels.filters.audience}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.audience ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  audience: e.target.value as Audience | "",
                }))
              }
            >
              <option value="">{labels.filters.allAudiences}</option>
              {Object.entries(labels.audiences).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
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
        <h2 className="font-semibold text-gray-900">{labels.sections.createRelease}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder={labels.create.placeholderName}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder={labels.create.placeholderVersion}
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
          />
        </div>
        <textarea
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          rows={3}
          placeholder={labels.create.placeholderDescription}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button
          type="button"
          disabled={!newName.trim() || !newVersion.trim() || busyId === "create"}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => void handleCreate()}
        >
          {busyId === "create" ? labels.actions.applying : labels.create.submit}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.releases}</h2>
        {center.releases.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center.releases.map((release) => {
              const advance = nextStatus(release.status);
              return (
                <article key={release.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {release.release_name}{" "}
                        <span className="text-gray-500">({release.release_version})</span>
                      </h3>
                      {release.description ? (
                        <p className="mt-1 text-sm text-gray-600">{release.description}</p>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusPill
                          label={labels.releaseTypes[release.release_type]}
                          className={TYPE_BADGES[release.release_type]}
                        />
                        <StatusPill
                          label={labels.statuses[release.status]}
                          className={STATUS_BADGES[release.status]}
                        />
                        <StatusPill
                          label={labels.riskLevels[release.risk_level]}
                          className={RISK_BADGES[release.risk_level]}
                        />
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                      <p>
                        {labels.table.plannedDate}: {formatDate(release.planned_date)}
                      </p>
                      <p>
                        {labels.table.owner}: {release.owner || "—"}
                      </p>
                      <p>
                        {labels.table.audience}: {labels.audiences[release.audience]}
                      </p>
                    </div>
                  </div>

                  {release.requires_approval && release.approvals.length > 0 ? (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-xs font-medium uppercase text-gray-500">
                        {labels.sections.approvals}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {release.approvals.map((a) => (
                          <li key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                            <span>
                              {labels.approvalRoles[a.approval_role]} — {a.status}
                            </span>
                            {a.status === "pending" ? (
                              <button
                                type="button"
                                disabled={busyId === a.id}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                                onClick={() =>
                                  void handleAction({
                                    action: "grant_approval",
                                    id: release.id,
                                    approval_role: a.approval_role,
                                  })
                                }
                              >
                                {labels.actions.approve}
                              </button>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {release.change_log.length > 0 ? (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-xs font-medium uppercase text-gray-500">
                        {labels.sections.changeLog}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700">
                        {release.change_log.map((entry) => (
                          <li key={entry.id}>
                            {labels.changeLogCategories[entry.category]} — {entry.summary}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {release.rollbacks.length > 0 ? (
                    <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm">
                      <p className="font-medium text-red-900">{labels.sections.rollbacks}</p>
                      {release.rollbacks.map((rb) => (
                        <p key={rb.id} className="mt-1 text-red-800">
                          {rb.rollback_reason}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {advance && release.status !== "rolled_back" ? (
                      <button
                        type="button"
                        disabled={busyId === release.id}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                        onClick={() =>
                          void handleAction({
                            action: "update_status",
                            id: release.id,
                            status: advance,
                          })
                        }
                      >
                        {labels.actions.advanceStatus}: {labels.statuses[advance]}
                      </button>
                    ) : null}
                    {release.status === "approved" || release.status === "customer_validation" ? (
                      <button
                        type="button"
                        disabled={busyId === release.id}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({
                            action: "publish_release",
                            id: release.id,
                            channels: [
                              "customer_portal",
                              "announcement_center",
                              "email",
                              "in_app_notification",
                            ],
                          })
                        }
                      >
                        {labels.actions.publish}
                      </button>
                    ) : null}
                    {release.status === "released" ? (
                      <button
                        type="button"
                        disabled={busyId === release.id}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        onClick={() =>
                          void handleAction({
                            action: "initiate_rollback",
                            id: release.id,
                            rollback_reason: "Rollback initiated from Release Center",
                          })
                        }
                      >
                        {labels.actions.rollback}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.changeLog}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-3 pr-4">{labels.table.version}</th>
                <th className="py-3 pr-4">{labels.table.category}</th>
                <th className="py-3 pr-4">{labels.table.summary}</th>
                <th className="py-3 pr-4">{labels.table.releaseDate}</th>
                <th className="py-3 pr-4">{labels.table.status}</th>
                <th className="py-3">{labels.table.audience}</th>
              </tr>
            </thead>
            <tbody>
              {center.change_log.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium">{entry.version}</td>
                  <td className="py-3 pr-4">{labels.changeLogCategories[entry.category]}</td>
                  <td className="py-3 pr-4 text-gray-600">{entry.summary}</td>
                  <td className="py-3 pr-4">{formatDate(entry.release_date)}</td>
                  <td className="py-3 pr-4">{labels.statuses[entry.status]}</td>
                  <td className="py-3">{labels.audiences[entry.audience]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.calendar}</h2>
        <div className="mt-4 space-y-3">
          {center.calendar.map((event) => (
            <div key={event.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">
                    {labels.calendarEventTypes[event.event_type]}
                  </p>
                  {event.summary ? (
                    <p className="mt-1 text-sm text-gray-600">{event.summary}</p>
                  ) : null}
                </div>
                <time className="text-xs text-gray-500">{formatDate(event.starts_at)}</time>
              </div>
            </div>
          ))}
        </div>
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
