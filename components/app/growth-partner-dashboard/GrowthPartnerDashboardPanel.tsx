"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { getOperationsStatusDefinition } from "@/lib/operations-center/status-standard";
import { parseGrowthPartnerDashboard, type GrowthPartnerDashboard } from "@/lib/growth-partner-signup";

export type GrowthPartnerDashboardLabels = {
  title: string;
  welcome: string;
  welcomeSubtitle: string;
  status: string;
  nextSteps: string;
  trainingProgress: string;
  certificationStatus: string;
  commissionOverview: string;
  myLeads: string;
  myCustomers: string;
  payoutProfile: string;
  profileSettings: string;
  startTraining: string;
  viewOperations: string;
  accessDenied: string;
  privacyNote: string;
  refresh: string;
  modules: string;
  commissionNote: string;
  statusWaiting: string;
  statusVerified: string;
};

type Props = { labels: GrowthPartnerDashboardLabels };

function StatusBadge({ statusKey, labels }: { statusKey?: string; labels: GrowthPartnerDashboardLabels }) {
  const def = getOperationsStatusDefinition(statusKey ?? "waiting");
  const label = statusKey === "verified" ? labels.statusVerified : labels.statusWaiting;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-800 ring-1 ring-inset ring-zinc-200">
      <span aria-hidden>{def.symbol}</span>
      <span>{label}</span>
    </span>
  );
}

export function GrowthPartnerDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GrowthPartnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/growth-partner/dashboard");
    if (res.ok) setDashboard(parseGrowthPartnerDashboard(await res.json()));
    else setDashboard(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!dashboard?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        <Link href="/growth-partners" className="mt-4 inline-block text-sm font-medium text-violet-700 hover:underline">
          Start your Aipify business
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">{labels.welcome}{dashboard.fullName ? `, ${dashboard.fullName}` : ""}</h2>
          <p className="mt-1 text-sm text-zinc-600">{labels.welcomeSubtitle}</p>
          {dashboard.companyName ? <p className="mt-1 text-sm text-zinc-500">{dashboard.companyName}</p> : null}
          {dashboard.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{dashboard.privacyNote}</p> : null}
        </div>
        <button type="button" onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          {labels.refresh}
        </button>
      </div>

      <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-800">{labels.status}</p>
        <div className="mt-3">
          <StatusBadge statusKey={dashboard.statusKey} labels={labels} />
        </div>
        {dashboard.statusLabel ? <p className="mt-2 text-sm text-zinc-700">{dashboard.statusLabel}</p> : null}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-zinc-900">{labels.nextSteps}</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-700">
          {dashboard.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          {dashboard.academyRoute ? (
            <Link href={dashboard.academyRoute} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
              {labels.startTraining}
            </Link>
          ) : null}
          {dashboard.operationsRoute ? (
            <Link href={dashboard.operationsRoute} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              {labels.viewOperations}
            </Link>
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-5">
          <p className="text-xs font-medium uppercase text-zinc-500">{labels.trainingProgress}</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">{dashboard.trainingProgressPct ?? 0}%</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
          <p className="text-xs font-medium uppercase text-zinc-500">{labels.myLeads}</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{dashboard.leadsCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5">
          <p className="text-xs font-medium uppercase text-zinc-500">{labels.myCustomers}</p>
          <p className="mt-2 text-3xl font-bold text-indigo-900">{dashboard.customersCount ?? 0}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-zinc-900">{labels.commissionOverview}</h3>
        <p className="mt-2 text-sm text-zinc-600">{dashboard.commissionOverview?.note ?? labels.commissionNote}</p>
      </section>

      {dashboard.trainingModules.length > 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-zinc-900">{labels.modules}</h3>
          <ul className="mt-4 space-y-2">
            {dashboard.trainingModules.map((mod) => (
              <li key={mod.moduleKey} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-100 px-4 py-3 text-sm">
                <span className="text-zinc-800">{mod.moduleTitle}</span>
                <span className="text-xs capitalize text-zinc-500">{mod.status.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
          <h3 className="font-medium text-zinc-900">{labels.payoutProfile}</h3>
          <p className="mt-2 text-sm text-zinc-600">Complete certification first — payout details are collected securely inside your dashboard.</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
          <h3 className="font-medium text-zinc-900">{labels.profileSettings}</h3>
          <p className="mt-2 text-sm text-zinc-600">Add photo, logo, website, regions, and marketing preferences after onboarding.</p>
        </div>
      </div>
    </div>
  );
}
