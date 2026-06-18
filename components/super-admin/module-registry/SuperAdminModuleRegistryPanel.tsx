"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseSuperAdminModuleRegistryCenter,
  type SuperAdminModuleRegistryCenter,
} from "@/lib/module-registry";
import type { buildSuperAdminModuleRegistryLabels } from "@/lib/module-registry/labels";

type Labels = ReturnType<typeof buildSuperAdminModuleRegistryLabels>;

export function SuperAdminModuleRegistryPanel({ labels }: { labels: Labels }) {
  const [center, setCenter] = useState<SuperAdminModuleRegistryCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/super-admin/module-registry");
    if (res.ok) setCenter(parseSuperAdminModuleRegistryCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(actionType: string, moduleKey: string) {
    await fetch("/api/super-admin/module-registry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, payload: { module_key: moduleKey } }),
    });
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.title}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href="/super" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-3 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.privacyNote ? <p className="mt-1 text-xs text-zinc-500">{center.privacyNote}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: labels.stats.total, value: center.stats.totalModules },
          { label: labels.stats.active, value: center.stats.activeModules },
          { label: labels.stats.core, value: center.stats.coreModules },
          { label: labels.stats.pack, value: center.stats.packModules },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="font-semibold text-zinc-900">{labels.modules}</h2>
          <button type="button" onClick={() => void load()} className="text-sm text-indigo-600 hover:underline">{labels.refresh}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-100 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">{labels.modules}</th>
                <th className="px-4 py-3">{labels.category}</th>
                <th className="px-4 py-3">{labels.businessPack}</th>
                <th className="px-4 py-3">{labels.permissions}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {center.modules.map((mod) => (
                <tr key={mod.moduleKey}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{mod.moduleName}</p>
                    <p className="text-xs text-zinc-500">{mod.moduleKey}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-600">{mod.moduleCategory.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-zinc-600">{mod.requiredBusinessPack ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{mod.permissionCount ?? 0}</td>
                  <td className="px-4 py-3">
                    {mod.status === "active" ? (
                      <button type="button" onClick={() => void runAction("disable_module", mod.moduleKey)} className="text-xs text-amber-700 hover:underline">{labels.disable}</button>
                    ) : (
                      <button type="button" onClick={() => void runAction("enable_module", mod.moduleKey)} className="text-xs text-emerald-700 hover:underline">{labels.enable}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {center.recentAudit.length > 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {center.recentAudit.slice(0, 10).map((a) => (
              <li key={a.id}>{a.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
