"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseGroupOverviewCenter,
  type GroupOrganizationLabels,
  type GroupOverviewCenter,
} from "@/lib/group-organization";

type GroupOverviewPanelProps = {
  labels: GroupOrganizationLabels;
  backHref: string;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

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
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (!center) {
    return (
      <PlatformEmptyState
        title={labels.title}
        message={labels.subtitle}
        primaryAction={{ label: labels.back, href: backHref }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="space-y-3">
        <Link href={backHref} className="text-sm font-medium text-indigo-700 hover:text-indigo-900">
          ← {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">{labels.subtitle}</p>
        <p className="text-sm font-medium text-gray-800">
          {center.parent.legal_name} · {center.tagline || labels.tagline}
        </p>
        <p className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 text-sm text-indigo-950">
          {labels.foundationStatement}
        </p>
        <p className="text-xs text-gray-500">{labels.principle}</p>
      </header>

      <SectionCard title={labels.sections.summary}>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <MetricCard key={label} label={label} value={value} />
          ))}
        </dl>
      </SectionCard>

      <SectionCard title={labels.sections.entities}>
        {center.entities.length === 0 ? (
          <PlatformEmptyState
            title={labels.entities.empty}
            message={labels.subtitle}
            className="border-none bg-gray-50/50"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">{labels.entities.name}</th>
                  <th className="px-4 py-3 font-medium">{labels.entities.type}</th>
                  <th className="px-4 py-3 font-medium">{labels.entities.status}</th>
                  <th className="px-4 py-3 font-medium">{labels.entities.domain}</th>
                  <th className="px-4 py-3 font-medium">{labels.entities.users}</th>
                  <th className="px-4 py-3 font-medium">{labels.entities.subscriptions}</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {center.entities.map((entity) => (
                  <tr key={entity.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{entity.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {labels.entityTypes[entity.entity_type] ?? entity.entity_type}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {labels.statuses[entity.status] ?? entity.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{entity.primary_domain || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{entity.metrics.active_users}</td>
                    <td className="px-4 py-3 text-gray-600">{entity.metrics.active_subscriptions}</td>
                    <td className="px-4 py-3">
                      {entity.status === "active" && (
                        <button
                          type="button"
                          disabled={actingId === entity.id}
                          onClick={() => void archiveEntity(entity.id)}
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
      </SectionCard>

      <SectionCard title={labels.sections.hierarchy}>
        <ol className="grid gap-3 sm:grid-cols-2">
          {center.hierarchy_levels.map((level) => (
            <li
              key={level.key}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-sm text-gray-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-900 ring-1 ring-gray-200">
                {level.level}
              </span>
              {level.name}
            </li>
          ))}
        </ol>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title={labels.sections.investments}>
          {center.investments.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.investments.empty}</p>
          ) : (
            <ul className="space-y-3">
              {center.investments.map((inv) => (
                <li key={inv.id} className="rounded-xl border border-gray-100 px-4 py-3 text-sm">
                  <p className="font-medium text-gray-900">{inv.company_name}</p>
                  <p className="mt-1 text-gray-600">
                    {labels.investments.ownership}: {inv.ownership_percentage}%
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title={labels.sections.sharedIntelligence}>
          {center.shared_intelligence.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.intelligence.empty}</p>
          ) : (
            <ul className="space-y-3">
              {center.shared_intelligence.map((signal) => (
                <li key={signal.id} className="rounded-xl border border-gray-100 px-4 py-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {labels.signalTypes[signal.signal_type] ?? signal.signal_type}
                  </p>
                  <p className="mt-1 text-gray-700">{signal.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title={labels.sections.audit}>
        {center.recent_audit.length === 0 ? (
          <PlatformEmptyState
            title={labels.audit.empty}
            message={labels.principle}
            className="border-none bg-gray-50/50"
          />
        ) : (
          <ul className="space-y-2">
            {center.recent_audit.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2 text-sm text-gray-600"
              >
                <span className="font-medium text-gray-800">{entry.event_type}</span> — {entry.summary}
                <span className="mt-1 block text-xs text-gray-400">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
