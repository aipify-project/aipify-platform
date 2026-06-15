"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildPlaybookFilterQuery,
  formatDuration,
  OUTCOME_BADGES,
  parsePlatformPlaybookCenter,
  STATUS_BADGES,
  type PlatformPlaybookCenter,
  type PlatformPlaybookCenterLabels,
  type PlaybookFilters,
  type PlaybookStatus,
} from "@/lib/platform-playbook-center";
import type {
  PlaybookCategory,
  TriggerType,
} from "@/lib/platform-playbook-center/constants";
import { PLAYBOOK_STATUSES } from "@/lib/platform-playbook-center/constants";

type PlatformPlaybookCenterPanelProps = {
  labels: PlatformPlaybookCenterLabels;
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
  return new Date(value).toLocaleString();
}

export function PlatformPlaybookCenterPanel({ labels, backHref }: PlatformPlaybookCenterPanelProps) {
  const [center, setCenter] = useState<PlatformPlaybookCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlaybookFilters>({});
  const [draftFilters, setDraftFilters] = useState<PlaybookFilters>({});
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const createRef = useRef<HTMLElement>(null);

  const load = useCallback(async (activeFilters: PlaybookFilters) => {
    setLoading(true);
    setError(null);
    const query = buildPlaybookFilterQuery(activeFilters);
    const res = await fetch(`/api/platform-playbook-center/overview${query}`);
    if (res.ok) {
      const parsed = parsePlatformPlaybookCenter(await res.json());
      if (parsed) setCenter(parsed);
      else setError(labels.emptyState);
    } else {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? labels.emptyState);
    }
    setLoading(false);
  }, [labels.emptyState]);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      const id = String(payload.id ?? payload.playbook_id ?? payload.template_id ?? "action");
      setBusyId(id);
      try {
        const res = await fetch("/api/platform-playbook-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters }),
        });
        if (res.ok) setCenter(parsePlatformPlaybookCenter(await res.json()));
      } finally {
        setBusyId(null);
      }
    },
    [filters]
  );

  const handleCreate = useCallback(async () => {
    if (!newName.trim()) return;
    setBusyId("create");
    await handleAction({
      action: "create_playbook",
      name: newName.trim(),
      owner: newOwner.trim(),
      description: newDescription.trim(),
      category: "support_operations",
      trigger_type: "manual",
    });
    setNewName("");
    setNewOwner("");
    setNewDescription("");
    setShowCreate(false);
  }, [handleAction, newDescription, newName, newOwner]);

  const openCreate = () => {
    setShowCreate(true);
    requestAnimationFrame(() => createRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const setStatusFilter = (status: PlaybookStatus | "") => {
    setFilters((prev) => ({ ...prev, status: status || undefined }));
    setDraftFilters((prev) => ({ ...prev, status: status || undefined }));
  };

  if (loading && !center) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded-lg bg-gray-100" />
          <div className="h-4 w-full max-w-2xl rounded bg-gray-100" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <p className="text-sm text-red-600">{error ?? labels.emptyState}</p>
        <Link href={backHref} className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
      </div>
    );
  }

  const { overview } = center;
  const hasPlaybooks = center.playbooks.length > 0;
  const hasActiveFilters = Boolean(filters.status || filters.category || filters.trigger_type || filters.owner);

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
          <OverviewCard label={labels.overview.activePlaybooks} value={overview.active_playbooks} />
          <OverviewCard label={labels.overview.scheduledAutomations} value={overview.scheduled_automations} />
          <OverviewCard label={labels.overview.runningAutomations} value={overview.running_automations} />
          <OverviewCard label={labels.overview.failedExecutions} value={overview.failed_executions} />
          <OverviewCard label={labels.overview.pendingApprovals} value={overview.pending_approvals} />
          <OverviewCard label={labels.overview.recentlyCompleted} value={overview.recently_completed} />
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900">{labels.sections.playbooks}</h2>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.actions.createPlaybook}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("")}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
              !filters.status ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-gray-700 ring-gray-200"
            }`}
          >
            {labels.filters.allStatuses}
          </button>
          {PLAYBOOK_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                filters.status === status
                  ? "bg-indigo-600 text-white ring-indigo-600"
                  : "bg-white text-gray-700 ring-gray-200"
              }`}
            >
              {labels.statuses[status]}
            </button>
          ))}
        </div>

        {!hasPlaybooks && !hasActiveFilters ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-8 py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">{labels.emptyOnboardingTitle}</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-gray-600">{labels.emptyOnboardingBody}</p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {labels.actions.createPlaybook}
            </button>
          </div>
        ) : !hasPlaybooks ? (
          <p className="mt-6 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-4">{labels.table.name}</th>
                  <th className="py-2 pr-4">{labels.table.category}</th>
                  <th className="py-2 pr-4">{labels.table.triggerType}</th>
                  <th className="py-2 pr-4">{labels.table.status}</th>
                  <th className="py-2 pr-4">{labels.table.lastExecuted}</th>
                  <th className="py-2 pr-4">{labels.table.owner}</th>
                  <th className="py-2">{labels.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {center.playbooks.map((playbook) => (
                  <tr key={playbook.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/platform/operations/playbooks/${playbook.id}`}
                        className="font-medium text-indigo-700 hover:text-indigo-900"
                      >
                        {playbook.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{labels.categories[playbook.category]}</td>
                    <td className="py-3 pr-4 text-gray-600">{labels.triggerTypes[playbook.trigger_type]}</td>
                    <td className="py-3 pr-4">
                      <StatusPill
                        label={labels.statuses[playbook.status]}
                        className={STATUS_BADGES[playbook.status]}
                      />
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{formatDate(playbook.last_executed_at)}</td>
                    <td className="py-3 pr-4 text-gray-600">{playbook.owner || "—"}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        <Link
                          href={`/platform/operations/playbooks/${playbook.id}/designer`}
                          className="rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50"
                        >
                          {labels.actions.openDesigner}
                        </Link>
                        <Link
                          href={`/platform/operations/playbooks/${playbook.id}`}
                          className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          {labels.actions.viewDetails}
                        </Link>
                        {playbook.status === "draft" && (
                          <button
                            type="button"
                            disabled={busyId === playbook.id}
                            className="rounded bg-green-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                            onClick={() =>
                              void handleAction({ action: "update_status", playbook_id: playbook.id, status: "active" })
                            }
                          >
                            {labels.actions.activate}
                          </button>
                        )}
                        {playbook.status === "active" && (
                          <button
                            type="button"
                            disabled={busyId === playbook.id}
                            className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                            onClick={() =>
                              void handleAction({ action: "update_status", playbook_id: playbook.id, status: "paused" })
                            }
                          >
                            {labels.actions.pause}
                          </button>
                        )}
                        {playbook.status === "paused" && (
                          <button
                            type="button"
                            disabled={busyId === playbook.id}
                            className="rounded bg-green-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                            onClick={() =>
                              void handleAction({ action: "update_status", playbook_id: playbook.id, status: "active" })
                            }
                          >
                            {labels.actions.activate}
                          </button>
                        )}
                        {playbook.status !== "archived" && (
                          <button
                            type="button"
                            disabled={busyId === playbook.id}
                            className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                            onClick={() =>
                              void handleAction({ action: "duplicate_playbook", playbook_id: playbook.id })
                            }
                          >
                            {labels.actions.duplicate}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {(showCreate || !hasPlaybooks) && (
        <section ref={createRef} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.createPlaybook}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder={labels.create.placeholderName}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder={labels.create.placeholderOwner}
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            />
          </div>
          <textarea
            className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            rows={3}
            placeholder={labels.create.placeholderDescription}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={!newName.trim() || busyId === "create"}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              onClick={() => void handleCreate()}
            >
              {busyId === "create" ? labels.actions.applying : labels.create.submit}
            </button>
            {hasPlaybooks && showCreate ? (
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowCreate(false)}
              >
                {labels.actions.cancel}
              </button>
            ) : null}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.filters}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.category}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.category ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, category: e.target.value as PlaybookCategory | "" }))
              }
            >
              <option value="">{labels.filters.allCategories}</option>
              {Object.entries(labels.categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.triggerType}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.trigger_type ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, trigger_type: e.target.value as TriggerType | "" }))
              }
            >
              <option value="">{labels.filters.allTriggerTypes}</option>
              {Object.entries(labels.triggerTypes).map(([key, label]) => (
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
        <h2 className="font-semibold text-gray-900">{labels.sections.templates}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {center.templates.map((template) => (
            <article key={template.id} className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{template.description}</p>
              <p className="mt-2 text-xs text-gray-500">{labels.categories[template.category]}</p>
              <button
                type="button"
                disabled={busyId === template.id}
                className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                onClick={() => void handleAction({ action: "create_from_template", template_id: template.id })}
              >
                {labels.actions.useTemplate}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.executions}</h2>
        {center.executions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="py-2 pr-4">{labels.table.playbookName}</th>
                  <th className="py-2 pr-4">{labels.table.triggerEvent}</th>
                  <th className="py-2 pr-4">{labels.table.executionDate}</th>
                  <th className="py-2 pr-4">{labels.table.outcome}</th>
                  <th className="py-2 pr-4">{labels.table.duration}</th>
                  <th className="py-2">{labels.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {center.executions.map((exec) => (
                  <tr key={exec.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium">{exec.playbook_name}</td>
                    <td className="py-3 pr-4">{exec.trigger_event}</td>
                    <td className="py-3 pr-4">{formatDate(exec.executed_at)}</td>
                    <td className="py-3 pr-4">
                      <StatusPill label={labels.outcomes[exec.outcome]} className={OUTCOME_BADGES[exec.outcome]} />
                    </td>
                    <td className="py-3 pr-4">{formatDuration(exec.duration_seconds)}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {exec.outcome === "failed" && (
                          <button
                            type="button"
                            disabled={busyId === exec.id}
                            className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                            onClick={() => void handleAction({ action: "retry_execution", id: exec.id })}
                          >
                            {labels.actions.retry}
                          </button>
                        )}
                        {exec.approval_status === "pending" && (
                          <>
                            <button
                              type="button"
                              disabled={busyId === exec.id}
                              className="rounded bg-green-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                              onClick={() => void handleAction({ action: "grant_approval", id: exec.id })}
                            >
                              {labels.actions.grantApproval}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === exec.id}
                              className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                              onClick={() => void handleAction({ action: "reject_approval", id: exec.id })}
                            >
                              {labels.actions.rejectApproval}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
