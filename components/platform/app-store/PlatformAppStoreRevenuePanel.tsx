"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parsePlatformAppStoreRevenue,
  type PlatformAppStoreRevenue,
  buildPlatformAppStoreRevenueLabels,
} from "@/lib/app-store";

type Labels = ReturnType<typeof buildPlatformAppStoreRevenueLabels>;

export function PlatformAppStoreRevenuePanel({ labels }: { labels: Labels }) {
  const [data, setData] = useState<PlatformAppStoreRevenue | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/app-store/revenue");
    if (res.ok) setData(parsePlatformAppStoreRevenue(await res.json()));
    else setData(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!data?.found) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-gray-600">Access denied or data unavailable.</p>
      </div>
    );
  }

  const summary = data.summary ?? {};
  const topPacks = (data.most_installed_packs ?? []) as Record<string, unknown>[];
  const revenue = (data.revenue_per_pack ?? []) as Record<string, unknown>[];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <Link href="/platform" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {data.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{data.principle}</p> : null}
        {data.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{data.privacy_note}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.publishedPacks, value: summary.published_packs },
          { label: labels.totalInstalls, value: summary.total_installs },
          { label: labels.activeLicenses, value: summary.active_licenses },
          { label: labels.renewalsDue, value: summary.renewals_due_30d },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{item.value ?? 0}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">{labels.growth}</h2>
        <div className="mt-4 flex gap-8 text-sm">
          <p>{labels.installs30d}: <span className="font-semibold">{data.growth?.installs_30d ?? 0}</span></p>
          <p>{labels.removals30d}: <span className="font-semibold">{data.growth?.removals_30d ?? 0}</span></p>
          <p>{labels.cancelledLicenses}: <span className="font-semibold">{summary.cancelled_licenses ?? 0}</span></p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">{labels.mostInstalled}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {topPacks.map((p) => (
              <li key={String(p.pack_key)} className="flex justify-between text-gray-700">
                <span>{String(p.pack_key)}</span>
                <span className="font-medium">{String(p.install_count ?? 0)} installs</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">{labels.revenuePerPack}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {revenue.map((r) => (
              <li key={String(r.pack_key)} className="flex justify-between text-gray-700">
                <span>{String(r.pack_key)}</span>
                <span className="font-medium">{String(r.active_licenses ?? 0)} active · {String(r.total_seats ?? 0)} seats</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
