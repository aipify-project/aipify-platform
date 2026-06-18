"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parsePlatformModuleRegistryOverview,
  type PlatformModuleRegistryOverview,
} from "@/lib/module-registry";
import type { buildPlatformModuleRegistryLabels } from "@/lib/module-registry/labels";

type Labels = ReturnType<typeof buildPlatformModuleRegistryLabels>;

export function PlatformModuleRegistryPanel({ labels }: { labels: Labels }) {
  const [overview, setOverview] = useState<PlatformModuleRegistryOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/module-registry");
    if (res.ok) setOverview(parsePlatformModuleRegistryOverview(await res.json()));
    else setOverview(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading && !overview) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!overview?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.title}</p>
        <p className="mt-2 text-sm">{overview?.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href="/platform" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        {overview.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{overview.privacyNote}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-5">
          <p className="text-xs uppercase tracking-wide text-violet-800">{labels.catalog}</p>
          <p className="mt-2 text-3xl font-bold text-violet-950">{overview.catalog.total}</p>
        </div>
        <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-5">
          <p className="text-xs uppercase tracking-wide text-cyan-900">{labels.organizations}</p>
          <p className="mt-2 text-3xl font-bold text-cyan-950">{overview.adoption.organizationsWithModules}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
          <p className="text-xs uppercase tracking-wide text-emerald-900">{labels.activations}</p>
          <p className="mt-2 text-3xl font-bold text-emerald-950">{overview.adoption.activeActivations}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.businessPacks}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {overview.businessPacks.map((pack) => (
            <li key={pack.packKey} className="rounded-xl border border-zinc-100 p-4">
              <p className="font-medium capitalize text-zinc-900">{pack.packKey.replace(/_/g, " ")}</p>
              <p className="mt-1 text-sm text-zinc-600">{pack.modules} modules</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-zinc-500">{labels.packActivations}: {overview.adoption.businessPackActivations}</p>
      </section>
    </div>
  );
}
