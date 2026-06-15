"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGroupOverviewCenter,
  type GroupOrganizationLabels,
  type GroupOverviewCenter,
} from "@/lib/group-organization";

type GroupOverviewPanelProps = {
  labels: GroupOrganizationLabels;
  backHref: string;
};

export function GroupOverviewPanel({ labels, backHref }: GroupOverviewPanelProps) {
  const [center, setCenter] = useState<GroupOverviewCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/group-organization/overview");
    if (res.ok) setCenter(parseGroupOverviewCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function archiveEntity(entityId: string) {
    setActingId(entityId);
    await fetch("/api/group-organization/entities/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive", entity_id: entityId }),
    });
    setActingId(null);
    await load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <p className="text-sm text-zinc-400">{labels.loading}</p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-400">{labels.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href={backHref} className="text-sm text-zinc-400 hover:text-zinc-200">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">{labels.title}</h1>
        <p className="mt-2 text-zinc-400">{labels.subtitle}</p>
        <p className="mt-3 text-sm font-medium text-zinc-300">
          {center.parent.legal_name} · {center.tagline || labels.tagline}
        </p>
        <p className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300">
          {labels.foundationStatement}
        </p>
        <p className="mt-2 text-xs text-zinc-500">{labels.principle}</p>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="font-semibold text-zinc-100">{labels.sections.summary}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              [labels.summary.totalEntities, center.summary.total_entities],
              [labels.summary.activeEntities, center.summary.active_entities],
              [labels.summary.activeUsers, center.summary.active_users],
              [labels.summary.activeSubscriptions, center.summary.active_subscriptions],
              [labels.summary.investments, center.summary.investments_count],
              [labels.summary.signals, center.summary.shared_signals_count],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-xl bg-zinc-950/60 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
              <dd className="mt-1 text-xl font-semibold text-zinc-100">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="font-semibold text-zinc-100">{labels.sections.hierarchy}</h2>
        <ol className="mt-3 space-y-2">
          {center.hierarchy_levels.map((level) => (
            <li key={level.key} className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-200">
                {level.level}
              </span>
              {level.name}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="font-semibold text-zinc-100">{labels.sections.entities}</h2>
        </div>
        {center.entities.length === 0 ? (
          <p className="p-5 text-sm text-zinc-500">{labels.entities.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-950/40 text-left text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">{labels.entities.name}</th>
                  <th className="px-5 py-3 font-medium">{labels.entities.type}</th>
                  <th className="px-5 py-3 font-medium">{labels.entities.status}</th>
                  <th className="px-5 py-3 font-medium">{labels.entities.domain}</th>
                  <th className="px-5 py-3 font-medium">{labels.entities.users}</th>
                  <th className="px-5 py-3 font-medium">{labels.entities.subscriptions}</th>
                  <th className="px-5 py-3 font-medium">{labels.entities.departments}</th>
                  <th className="px-5 py-3 font-medium">{labels.entities.teams}</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {center.entities.map((entity) => (
                  <tr key={entity.id}>
                    <td className="px-5 py-3 font-medium text-zinc-100">{entity.name}</td>
                    <td className="px-5 py-3 text-zinc-400">
                      {labels.entityTypes[entity.entity_type] ?? entity.entity_type}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                        {labels.statuses[entity.status] ?? entity.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-400">{entity.primary_domain || "—"}</td>
                    <td className="px-5 py-3 text-zinc-400">{entity.metrics.active_users}</td>
                    <td className="px-5 py-3 text-zinc-400">{entity.metrics.active_subscriptions}</td>
                    <td className="px-5 py-3 text-zinc-400">{entity.departments_count}</td>
                    <td className="px-5 py-3 text-zinc-400">{entity.teams_count}</td>
                    <td className="px-5 py-3">
                      {entity.status === "active" && (
                        <button
                          type="button"
                          disabled={actingId === entity.id}
                          onClick={() => void archiveEntity(entity.id)}
                          className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
                        >
                          {labels.entities.archive}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="font-semibold text-zinc-100">{labels.sections.investments}</h2>
          {center.investments.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">{labels.investments.empty}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {center.investments.map((inv) => (
                <li key={inv.id} className="rounded-xl bg-zinc-950/60 px-4 py-3 text-sm">
                  <p className="font-medium text-zinc-100">{inv.company_name}</p>
                  <p className="mt-1 text-zinc-400">
                    {labels.investments.ownership}: {inv.ownership_percentage}%
                  </p>
                  {inv.investment_amount != null && (
                    <p className="text-zinc-400">
                      {labels.investments.amount}: {inv.investment_amount} {inv.currency}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500">{inv.status}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="font-semibold text-zinc-100">{labels.sections.sharedIntelligence}</h2>
          {center.shared_intelligence.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">{labels.intelligence.empty}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {center.shared_intelligence.map((signal) => (
                <li key={signal.id} className="rounded-xl bg-zinc-950/60 px-4 py-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {labels.signalTypes[signal.signal_type] ?? signal.signal_type}
                  </p>
                  <p className="mt-1 text-zinc-300">{signal.summary}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {labels.intelligence.confidence}: {signal.confidence}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="font-semibold text-zinc-100">{labels.sections.audit}</h2>
        {center.recent_audit.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">{labels.audit.empty}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {center.recent_audit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-zinc-950/60 px-3 py-2 text-sm text-zinc-400">
                <span className="font-medium text-zinc-300">{entry.event_type}</span> — {entry.summary}
                <span className="mt-1 block text-xs text-zinc-600">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
