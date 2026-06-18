"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseCustomerLicenseDashboard,
  type CustomerLicenseDashboard,
  type LicenseDashboardLabels,
} from "@/lib/app-store";

export function CustomerLicenseDashboardPanel({ labels }: { labels: LicenseDashboardLabels }) {
  const [dashboard, setDashboard] = useState<CustomerLicenseDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/licenses");
    if (res.ok) setDashboard(parseCustomerLicenseDashboard(await res.json()));
    else setDashboard(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!dashboard?.found) {
    return (
      <PlatformEmptyState
        title={labels.emptyTitle}
        message={labels.emptyDescription}
        primaryAction={{ label: labels.browseStore, href: "/app/store" }}
      />
    );
  }

  const packs = (dashboard.business_packs ?? []) as Record<string, unknown>[];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <Link href="/app/store" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {dashboard.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{dashboard.principle}</p> : null}
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{labels.currentPlan}</p>
          <p className="mt-2 text-lg font-semibold text-gray-900 capitalize">
            {dashboard.current_plan?.plan_key ?? "—"}
          </p>
          <p className="text-sm text-gray-500">{labels.status}: {dashboard.current_plan?.status ?? "—"}</p>
          {dashboard.current_plan?.renewal_date ? (
            <p className="mt-1 text-sm text-gray-500">
              {labels.renewalDate}: {dashboard.current_plan.renewal_date}
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{labels.consumption}</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {dashboard.consumption?.active_pack_licenses ?? 0} {labels.activeLicenses.toLowerCase()}
          </p>
          <p className="text-sm text-gray-500">
            {labels.totalSeats}: {dashboard.consumption?.total_seats ?? 0} · {labels.employees}: {dashboard.consumption?.employees ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.userLicenses}</p>
          <p className="mt-2 text-sm text-indigo-900">
            {(dashboard.user_licenses ?? []).slice(0, 4).map((t) => t.label).join(" · ")}
          </p>
          <Link href="/app/store" className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline">
            {labels.purchaseSeats}
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{labels.businessPacks}</h2>
          <Link href="/app/settings/module-access" className="text-sm text-indigo-600 hover:underline">
            {labels.manageAccess}
          </Link>
        </div>
        {packs.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyDescription}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {packs.map((pack) => {
              const card = pack.card as Record<string, unknown> | undefined;
              return (
                <div key={String(pack.pack_key)} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
                  <div>
                    <p className="font-medium text-gray-900">{String(card?.pack_name ?? pack.pack_key)}</p>
                    <p className="text-sm text-gray-500">
                      {String(pack.tier_key)} · {labels.status}: {String(pack.license_status)}
                      {pack.renewal_date ? ` · ${labels.renewalDate}: ${String(pack.renewal_date)}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/app/store/${String(pack.pack_key)}?upgrade=1`}
                      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-900"
                    >
                      {labels.upgrade}
                    </Link>
                    <Link
                      href={`/app/store/${String(pack.pack_key)}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700"
                    >
                      {labels.renew}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
