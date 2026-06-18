"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseAipifyOperationsCenter,
  type AipifyOperationsCenter,
  type OperationsCenterLabels,
} from "@/lib/operations-center";
import { OperationsStatusBadge } from "./OperationsStatusBadge";

type AipifyOperationsCenterPanelProps = {
  labels: OperationsCenterLabels;
};

function formatWhen(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function ItemList({
  items,
  labels,
  empty,
}: {
  items: AipifyOperationsCenter["sections"]["completed"];
  labels: OperationsCenterLabels;
  empty: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">{empty}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {item.routePath ? (
                <Link href={item.routePath} className="font-medium text-indigo-700 hover:text-indigo-800">
                  {item.title}
                </Link>
              ) : (
                <p className="font-medium text-zinc-900">{item.title}</p>
              )}
              {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
            </div>
            <OperationsStatusBadge statusKey={item.statusKey} labels={labels.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AipifyOperationsCenterPanel({ labels }: AipifyOperationsCenterPanelProps) {
  const [center, setCenter] = useState<AipifyOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/operations/center");
    if (res.ok) setCenter(parseAipifyOperationsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void (async () => {
      await fetch("/api/operations/center", { method: "POST" });
      await load();
    })();
  }, [load]);

  const refresh = async () => {
    setBusy(true);
    await fetch("/api/operations/center", { method: "POST" });
    await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.hasCustomer) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.emptyState}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const sectionBlocks = [
    { key: "completed" as const, title: labels.sections.completed, items: center.sections.completed },
    {
      key: "requires_attention" as const,
      title: labels.sections.requiresAttention,
      items: center.sections.requiresAttention,
    },
    { key: "waiting" as const, title: labels.sections.waiting, items: center.sections.waiting },
    { key: "information" as const, title: labels.sections.information, items: center.sections.information },
  ];

  const sinceGroups = [
    { key: "today", title: labels.sinceLastLogin.today, items: center.sinceLastLogin.groups.today },
    { key: "yesterday", title: labels.sinceLastLogin.yesterday, items: center.sinceLastLogin.groups.yesterday },
    { key: "thisWeek", title: labels.sinceLastLogin.thisWeek, items: center.sinceLastLogin.groups.thisWeek },
  ];

  const taskGroups = [
    { title: labels.tasks.myTasks, items: center.tasks.myTasks },
    { title: labels.tasks.teamTasks, items: center.tasks.teamTasks },
    { title: labels.tasks.automationTasks, items: center.tasks.automationTasks },
  ];

  const packLabel = (key: string) => {
    const map: Record<string, string> = {
      hosts: labels.businessPacks.hosts,
      commerce: labels.businessPacks.commerce,
      support: labels.businessPacks.support,
      finance: labels.businessPacks.finance,
      growth_partners: labels.businessPacks.growthPartners,
    };
    return map[key] ?? labels.businessPacks.other;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
          <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
          <p className="mt-2 text-sm text-zinc-500">{labels.philosophy}</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={busy}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {labels.refresh}
        </button>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 text-white shadow-lg">
        <h2 className="text-lg font-semibold">{labels.executiveSummary.title}</h2>
        <p className="mt-1 text-sm text-indigo-100">{center.executiveSummary.headline}</p>
        {center.executiveSummary.bullets.length === 0 ? (
          <p className="mt-4 text-sm text-indigo-100">{labels.executiveSummary.empty}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-indigo-50">
            {center.executiveSummary.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sectionBlocks.map((section) => (
          <div key={section.key} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <OperationsStatusBadge
              statusKey={section.key === "requires_attention" ? "requires_attention" : section.key}
              labels={labels.status}
            />
            <p className="mt-3 text-2xl font-semibold text-zinc-900">{section.items.length}</p>
            <p className="mt-1 text-sm text-zinc-600">{section.title}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sectionBlocks.map((section) => (
          <section key={section.key} className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">{section.title}</h2>
            <div className="mt-4">
              <ItemList items={section.items} labels={labels} empty={labels.emptyState} />
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.sinceLastLogin.title}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {[
            [labels.sinceLastLogin.activities, center.sinceLastLogin.activityCounts.activities],
            [labels.sinceLastLogin.alerts, center.sinceLastLogin.activityCounts.alerts],
            [labels.sinceLastLogin.recommendations, center.sinceLastLogin.activityCounts.recommendations],
            [labels.sinceLastLogin.supportSignals, center.sinceLastLogin.activityCounts.supportSignals],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl bg-zinc-50 px-4 py-3">
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {sinceGroups.map((group) => (
            <div key={group.key}>
              <h3 className="text-sm font-medium text-zinc-800">{group.title}</h3>
              {group.items.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">{labels.sinceLastLogin.empty}</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.id} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm">
                      <p className="font-medium text-zinc-900">{item.title}</p>
                      <p className="text-zinc-600">{item.summary}</p>
                      <p className="mt-1 text-xs text-zinc-500">{formatWhen(item.occurredAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.tasks.title}</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          {taskGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-zinc-800">{group.title}</h3>
              <div className="mt-3">
                <ItemList items={group.items} labels={labels} empty={labels.tasks.empty} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.alerts.title}</h2>
        <div className="mt-4">
          <ItemList items={center.alerts} labels={labels} empty={labels.alerts.empty} />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.recommendations.title}</h2>
        {center.recommendations.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">{labels.recommendations.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center.recommendations.map((rec) => (
              <li key={rec.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-medium text-zinc-900">{rec.title}</p>
                <p className="mt-2 text-sm text-zinc-700">
                  <span className="font-medium">{labels.recommendations.why}</span> {rec.why}
                </p>
                {rec.expectedBenefit ? (
                  <p className="mt-1 text-sm text-zinc-600">
                    <span className="font-medium">{labels.recommendations.expectedBenefit}</span> {rec.expectedBenefit}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.businessPacks.title}</h2>
        {center.businessPackEvents.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">{labels.businessPacks.empty}</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {center.businessPackEvents.map((event) => (
              <li key={event.id} className="rounded-xl border border-zinc-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-indigo-700">
                    {packLabel(event.packKey)}
                  </span>
                  <OperationsStatusBadge statusKey={event.statusKey} labels={labels.status} />
                </div>
                {event.routePath ? (
                  <Link href={event.routePath} className="mt-2 block font-medium text-zinc-900 hover:text-indigo-700">
                    {event.title}
                  </Link>
                ) : (
                  <p className="mt-2 font-medium text-zinc-900">{event.title}</p>
                )}
                <p className="mt-1 text-sm text-zinc-600">{event.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.timeline.title}</h2>
        {center.timeline.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">{labels.timeline.empty}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="px-3 py-2 font-medium">{labels.timeline.user}</th>
                  <th className="px-3 py-2 font-medium">{labels.timeline.action}</th>
                  <th className="px-3 py-2 font-medium">{labels.timeline.system}</th>
                  <th className="px-3 py-2 font-medium">{labels.timeline.result}</th>
                  <th className="px-3 py-2 font-medium">{labels.timeline.timestamp}</th>
                </tr>
              </thead>
              <tbody>
                {center.timeline.map((entry) => (
                  <tr key={entry.id} className="border-b border-zinc-100">
                    <td className="px-3 py-3 text-zinc-900">{entry.actorLabel}</td>
                    <td className="px-3 py-3 text-zinc-800">{entry.actionLabel}</td>
                    <td className="px-3 py-3 text-zinc-700">{entry.systemLabel}</td>
                    <td className="px-3 py-3 text-zinc-600">{entry.resultLabel}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-zinc-500">{formatWhen(entry.occurredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/app/operations/automation-control" className="font-medium text-indigo-600 hover:text-indigo-700">
          {labels.links.automationControl} →
        </Link>
        <Link href="/app/approvals" className="font-medium text-indigo-600 hover:text-indigo-700">
          {labels.links.approvals} →
        </Link>
        <Link href="/app/command-center" className="font-medium text-indigo-600 hover:text-indigo-700">
          {labels.links.commandCenter} →
        </Link>
      </div>

      {center.privacyNote ? <p className="text-xs text-zinc-500">{center.privacyNote}</p> : null}
      <p className="text-xs text-zinc-500">{labels.humanOversight}</p>
    </div>
  );
}
