"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseModuleMarketplaceFoundationEngineDashboard, type ModuleMarketplaceFoundationEngineDashboard } from "@/lib/aipify/module-marketplace-foundation-engine";

type Props = { labels: Record<string, string> };

export function ModuleMarketplaceFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ModuleMarketplaceFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/module-marketplace-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseModuleMarketplaceFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const items = dashboard.catalog ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2"><Link href="/app/settings/modules" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.modulesSettings}</Link>
        <Link href="/app/subscription-plan-management-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.subscription}</Link></div>
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.catalog_count}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.catalog_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.active_modules}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_modules ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.beta_modules}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.beta_modules ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.future_modules}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.future_modules ?? 0)}</p>
        </div>
      </div>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.catalog}</h3>
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
