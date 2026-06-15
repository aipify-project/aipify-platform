"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildPlaybookFilterQuery,
  formatDuration,
  OUTCOME_BADGES,
  parsePlatformPlaybookCenter,
  STATUS_BADGES,
  type PlatformPlaybookCenterLabels,
  type Playbook,
  type PlaybookExecution,
} from "@/lib/platform-playbook-center";

type PlatformPlaybookDetailPanelProps = {
  playbookId: string;
  labels: PlatformPlaybookCenterLabels;
  backHref: string;
};

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

export function PlatformPlaybookDetailPanel({
  playbookId,
  labels,
  backHref,
}: PlatformPlaybookDetailPanelProps) {
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", owner: "", description: "" });
  const [executions, setExecutions] = useState<PlaybookExecution[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const query = buildPlaybookFilterQuery({ playbook_id: playbookId });
    const res = await fetch(`/api/platform-playbook-center/overview${query}`);
    if (res.ok) {
      const center = parsePlatformPlaybookCenter(await res.json());
      const pb = center?.playbooks[0] ?? null;
      setPlaybook(pb);
      setExecutions(center?.executions ?? []);
      if (pb) setForm({ name: pb.name, owner: pb.owner, description: pb.description });
    }
    setLoading(false);
  }, [playbookId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = useCallback(
    async (payload: Record<string, unknown>) => {
      setBusyId(String(payload.action ?? "action"));
      try {
        const res = await fetch("/api/platform-playbook-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, filters: { playbook_id: playbookId } }),
        });
        if (res.ok) {
          const center = parsePlatformPlaybookCenter(await res.json());
          const pb = center?.playbooks.find((p) => p.id === playbookId) ?? center?.playbooks[0] ?? null;
          setPlaybook(pb);
          setExecutions(center?.executions ?? []);
          if (pb) setForm({ name: pb.name, owner: pb.owner, description: pb.description });
          setEditing(false);
        }
      } finally {
        setBusyId(null);
      }
    },
    [playbookId]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-gray-100" />
          <div className="h-32 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!playbook) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-sm text-gray-600">{labels.emptyState}</p>
        <Link href={backHref} className="mt-4 inline-block text-sm text-indigo-600">
          ← {labels.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{playbook.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusPill label={labels.statuses[playbook.status]} className={STATUS_BADGES[playbook.status]} />
              <span className="text-sm text-gray-500">
                {labels.categories[playbook.category]} · {labels.triggerTypes[playbook.trigger_type]}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/platform/operations/playbooks/${playbookId}/designer`}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
            >
              {labels.actions.openDesigner}
            </Link>
            {!editing && (
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() => setEditing(true)}
              >
                {labels.actions.edit}
              </button>
            )}
            <button
              type="button"
              disabled={busyId === "duplicate"}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => void handleAction({ action: "duplicate_playbook", playbook_id: playbook.id })}
            >
              {labels.actions.duplicate}
            </button>
            {playbook.status === "draft" && (
              <button
                type="button"
                disabled={busyId === "activate"}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                onClick={() => void handleAction({ action: "update_status", playbook_id: playbook.id, status: "active" })}
              >
                {labels.actions.activate}
              </button>
            )}
            {playbook.status === "active" && (
              <button
                type="button"
                disabled={busyId === "pause"}
                className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                onClick={() => void handleAction({ action: "update_status", playbook_id: playbook.id, status: "paused" })}
              >
                {labels.actions.pause}
              </button>
            )}
            {playbook.status === "paused" && (
              <button
                type="button"
                disabled={busyId === "activate"}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                onClick={() => void handleAction({ action: "update_status", playbook_id: playbook.id, status: "active" })}
              >
                {labels.actions.activate}
              </button>
            )}
            {playbook.status !== "archived" && (
              <button
                type="button"
                disabled={busyId === "archive"}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 disabled:opacity-50"
                onClick={() => void handleAction({ action: "update_status", playbook_id: playbook.id, status: "archived" })}
              >
                {labels.actions.archive}
              </button>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.actions.edit}</h2>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder={labels.create.placeholderOwner}
              value={form.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
            />
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={busyId === "save"}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              onClick={() =>
                void handleAction({
                  action: "update_playbook",
                  playbook_id: playbook.id,
                  name: form.name,
                  owner: form.owner,
                  description: form.description,
                })
              }
            >
              {labels.actions.save}
            </button>
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm"
              onClick={() => setEditing(false)}
            >
              {labels.actions.cancel}
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.table.description}</h2>
          <p className="mt-3 text-sm text-gray-700">{playbook.description || "—"}</p>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.triggers}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-medium text-gray-700">{labels.table.triggerType}:</dt>
            <dd className="text-gray-600">{labels.triggerTypes[playbook.trigger_type]}</dd>
          </div>
          {playbook.condition_summary ? (
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700">{labels.sections.conditions}:</dt>
              <dd className="text-gray-600">{playbook.condition_summary}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.approvalRequirements}</h2>
        <p className="mt-3 text-sm text-gray-700">
          {playbook.requires_approval ? labels.table.requiresApproval : "—"}
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.assignedOwners}</h2>
        <p className="mt-3 text-sm text-gray-700">{playbook.owner || "—"}</p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.steps}</h2>
        {playbook.steps.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
            {playbook.steps.map((step) => (
              <li key={step.id}>
                <span className="font-medium">{labels.stepActions[step.action_type]}</span>
                {step.label ? ` — ${step.label}` : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.executionHistory}</h2>
        {executions.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="py-2 pr-4">{labels.table.triggerEvent}</th>
                  <th className="py-2 pr-4">{labels.table.executionDate}</th>
                  <th className="py-2 pr-4">{labels.table.outcome}</th>
                  <th className="py-2">{labels.table.duration}</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((exec) => (
                  <tr key={exec.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4">{exec.trigger_event}</td>
                    <td className="py-3 pr-4">{formatDate(exec.executed_at)}</td>
                    <td className="py-3 pr-4">
                      <StatusPill label={labels.outcomes[exec.outcome]} className={OUTCOME_BADGES[exec.outcome]} />
                    </td>
                    <td className="py-3">{formatDuration(exec.duration_seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-gray-500">
          {labels.table.lastExecuted}: {formatDate(playbook.last_executed_at)}
        </p>
      </section>
    </div>
  );
}
