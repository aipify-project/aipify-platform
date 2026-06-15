"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildPlaybookFilterQuery,
  formatDuration,
  OUTCOME_BADGES,
  parsePlatformPlaybookCenter,
  STATUS_BADGES,
  type PlatformPlaybookCenter,
  type PlatformPlaybookCenterLabels,
  type PlaybookFilters,
} from "@/lib/platform-playbook-center";
import type {
  ExecutionOutcome,
  PlaybookCategory,
  PlaybookStatus,
  TriggerType,
} from "@/lib/platform-playbook-center/constants";

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
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlaybookFilters>({});
  const [draftFilters, setDraftFilters] = useState<PlaybookFilters>({});
  const [newName, setNewName] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const load = useCallback(async (activeFilters: PlaybookFilters) => {
    setLoading(true);
    const query = buildPlaybookFilterQuery(activeFilters);
    const res = await fetch(`/api/platform-playbook-center/overview${query}`);
    if (res.ok) setCenter(parsePlatformPlaybookCenter(await res.json()));
    setLoading(false);
  }, []);

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
  }, [handleAction, newDescription, newName, newOwner]);

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
          <OverviewCard label={labels.overview.activePlaybooks} value={overview.active_playbooks} />
          <OverviewCard label={labels.overview.automationsRunning} value={overview.automations_running} />
          <OverviewCard label={labels.overview.failedExecutions} value={overview.failed_executions} />
          <OverviewCard label={labels.overview.manualInterventions} value={overview.manual_interventions} />
          <OverviewCard label={labels.overview.scheduledWorkflows} value={overview.scheduled_workflows} />
          <OverviewCard label={labels.overview.mostUsedPlaybooks} value={overview.most_used_playbooks} />
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
                  category: e.target.value as PlaybookCategory | "",
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
            <span className="text-xs text-gray-500">{labels.filters.status}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.status ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  status: e.target.value as PlaybookStatus | "",
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
            <span className="text-xs text-gray-500">{labels.filters.triggerType}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.trigger_type ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  trigger_type: e.target.value as TriggerType | "",
                }))
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
          <label className="text-sm">
            <span className="text-xs text-gray-500">{labels.filters.outcome}</span>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              value={draftFilters.outcome ?? ""}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  outcome: e.target.value as ExecutionOutcome | "",
                }))
              }
            >
              <option value="">{labels.filters.allOutcomes}</option>
              {Object.entries(labels.outcomes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
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
        <button
          type="button"
          disabled={!newName.trim() || busyId === "create"}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => void handleCreate()}
        >
          {busyId === "create" ? labels.actions.applying : labels.create.submit}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.templates}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {center.templates.map((template) => (
            <article key={template.id} className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{template.description}</p>
              <p className="mt-2 text-xs text-gray-500">{labels.categories[template.category]}</p>
              <button
                type="button"
                disabled={busyId === template.id}
                className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                onClick={() =>
                  void handleAction({ action: "create_from_template", template_id: template.id })
                }
              >
                {labels.actions.useTemplate}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.playbooks}</h2>
        {center.playbooks.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center.playbooks.map((playbook) => (
              <article key={playbook.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900">{playbook.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{playbook.description || "—"}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusPill label={labels.statuses[playbook.status]} className={STATUS_BADGES[playbook.status]} />
                      <span className="text-xs text-gray-500">
                        {labels.categories[playbook.category]} · {labels.triggerTypes[playbook.trigger_type]}
                      </span>
                      {playbook.requires_approval && (
                        <span className="text-xs text-amber-700">{labels.table.requiresApproval}</span>
                      )}
                    </div>
                    {playbook.condition_summary && (
                      <p className="mt-2 text-xs text-gray-500">
                        {labels.sections.conditions}: {playbook.condition_summary}
                      </p>
                    )}
                    {playbook.steps.length > 0 && (
                      <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-gray-600">
                        {playbook.steps.map((step) => (
                          <li key={step.id}>
                            {labels.stepActions[step.action_type]} — {step.label}
                          </li>
                        ))}
                      </ol>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {labels.table.lastExecuted}: {formatDate(playbook.last_executed_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {playbook.status === "draft" && (
                      <button
                        type="button"
                        disabled={busyId === playbook.id}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                        onClick={() =>
                          void handleAction({ action: "update_status", playbook_id: playbook.id, status: "active" })
                        }
                      >
                        {labels.actions.activate}
                      </button>
                    )}
                    {playbook.status === "active" && (
                      <>
                        <button
                          type="button"
                          disabled={busyId === playbook.id}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                          onClick={() =>
                            void handleAction({
                              action: "execute_playbook",
                              playbook_id: playbook.id,
                              owner: playbook.owner,
                            })
                          }
                        >
                          {labels.actions.execute}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === playbook.id}
                          className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50"
                          onClick={() =>
                            void handleAction({ action: "update_status", playbook_id: playbook.id, status: "paused" })
                          }
                        >
                          {labels.actions.pause}
                        </button>
                      </>
                    )}
                    {playbook.status === "paused" && (
                      <button
                        type="button"
                        disabled={busyId === playbook.id}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                        onClick={() =>
                          void handleAction({ action: "update_status", playbook_id: playbook.id, status: "active" })
                        }
                      >
                        {labels.actions.activate}
                      </button>
                    )}
                    {playbook.status !== "archived" && (
                      <>
                        <button
                          type="button"
                          disabled={busyId === playbook.id}
                          className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50"
                          onClick={() =>
                            void handleAction({ action: "disable_automation", playbook_id: playbook.id })
                          }
                        >
                          {labels.actions.disable}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === playbook.id}
                          className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50"
                          onClick={() =>
                            void handleAction({ action: "update_status", playbook_id: playbook.id, status: "archived" })
                          }
                        >
                          {labels.actions.archive}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
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
                        <button
                          type="button"
                          disabled={busyId === exec.id}
                          className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                          onClick={() => void handleAction({ action: "escalate_execution", id: exec.id })}
                        >
                          {labels.actions.escalate}
                        </button>
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
