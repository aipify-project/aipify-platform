"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAipifyInternalOperationsEngineDashboard, type AipifyInternalOperationsEngineDashboard } from "@/lib/aipify/aipify-internal-operations-engine";

type Props = { labels: Record<string, string> };

export function AipifyInternalOperationsEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyInternalOperationsEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/aipify-internal-operations-engine/dashboard");
    if (res.ok) setDashboard(parseAipifyInternalOperationsEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const items = dashboard.tasks ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2"><Link href="/app/quality-guardian-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.quality}</Link>
        <Link href="/app/unonight-pilot-operations-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.pilot}</Link></div>
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.open_tasks}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.open_tasks ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.open_feedback}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.open_feedback ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.validations_passed}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.validations_passed ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.release_blockers}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.release_blockers ?? 0)}</p>
        </div>
      </div>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.tasks}</h3>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {items.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.task_title ?? item.module_name ?? item.checklist_title ?? item.intervention_type ?? item.module_key ?? item.checklist_key ?? JSON.stringify(item).slice(0, 80))}
              </li>
            ))}
          </ul>
        )}
      </section>
      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
