"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  PERFORMANCE_BADGES,
  PROVIDER_TABS,
  VERIFICATION_BADGES,
  parseVerifiedProviderCenter,
  type VerifiedProviderCenter,
  type VerifiedProviderLabels,
  type VerifiedProviderTab,
} from "@/lib/platform-verified-providers";

type Props = {
  labels: VerifiedProviderLabels;
  backHref: string;
  initialTab?: VerifiedProviderTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(item.company_name ?? item.service_title ?? item.contract_title ?? item.verification_type ?? i)}
          </p>
          {(item.summary ?? item.sla_summary) ? (
            <p className="mt-1 text-zinc-600">{String(item.summary ?? item.sla_summary)}</p>
          ) : null}
          {item.verification_status ? (
            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${VERIFICATION_BADGES[String(item.verification_status)] ?? VERIFICATION_BADGES.pending}`}>
              {String(item.verification_status)}
            </span>
          ) : null}
          {item.performance_label ? (
            <span className={`mt-2 ml-1 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PERFORMANCE_BADGES[String(item.performance_label)] ?? PERFORMANCE_BADGES.healthy}`}>
              {String(item.performance_label)}
            </span>
          ) : null}
          {item.overall_rating != null ? (
            <p className="mt-1 text-xs text-zinc-500">Rating: {String(item.overall_rating)}</p>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function PlatformVerifiedProvidersPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<VerifiedProviderCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<VerifiedProviderTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-verified-providers/overview");
    if (res.ok) setCenter(parseVerifiedProviderCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/platform-verified-providers/actions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_performance")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshPerformance}
        </button>
        <Link href="/app/companion/ecosystem" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          Companion Ecosystem
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {PROVIDER_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.verifiedProviders} value={Number(overview.verified_providers ?? 0)} />
          <OverviewCard label={labels.overview.pendingProviders} value={Number(overview.pending_providers ?? 0)} />
          <OverviewCard label={labels.overview.reviewRequired} value={Number(overview.review_required ?? 0)} />
          <OverviewCard label={labels.overview.suspendedProviders} value={Number(overview.suspended_providers ?? 0)} />
          <OverviewCard label={labels.overview.totalServices} value={Number(overview.total_services ?? 0)} />
          <OverviewCard label={labels.overview.activeContracts} value={Number(overview.active_contracts ?? 0)} />
        </dl>
      ) : null}

      {tab === "providers" ? (
        <section className="space-y-3">
          {(center.providers ?? []).map((item) => (
            <div key={String(item.provider_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              {item.verification_status === "review_required" || item.verification_status === "pending" ? (
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={busy}
                    onClick={() => void runAction("verify_provider", { provider_key: item.provider_key })}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                    {labels.actions.verifyProvider}
                  </button>
                  <button type="button" disabled={busy}
                    onClick={() => void runAction("suspend_provider", { provider_key: item.provider_key })}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                    {labels.actions.suspendProvider}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "services" ? <section className="space-y-3"><JsonList items={center.services ?? []} /></section> : null}
      {tab === "verifications" ? <section className="space-y-3"><JsonList items={center.verifications ?? []} /></section> : null}
      {tab === "contracts" ? <section className="space-y-3"><JsonList items={center.contracts ?? []} /></section> : null}
      {tab === "performance" ? <section className="space-y-3"><JsonList items={center.performance ?? []} /></section> : null}

      {tab === "audit" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <ul className="space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
