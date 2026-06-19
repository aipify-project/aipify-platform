"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  CERTIFICATION_BADGES,
  DEVELOPER_TABS,
  parseDeveloperPortalCenter,
  type DeveloperPortalCenter,
  type DeveloperPortalLabels,
  type DeveloperPortalTab,
} from "@/lib/platform-developer-ecosystem";

type Props = { labels: DeveloperPortalLabels; backHref: string; initialTab?: DeveloperPortalTab };

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
            {String(item.extension_name ?? item.publisher_name ?? item.module_title ?? i)}
          </p>
          {(item.description ?? item.summary) ? (
            <p className="mt-1 text-zinc-600">{String(item.description ?? item.summary)}</p>
          ) : null}
          {item.certification_status ? (
            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${CERTIFICATION_BADGES[String(item.certification_status)] ?? CERTIFICATION_BADGES.published}`}>
              {String(item.certification_status)}
            </span>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function PlatformDeveloperPortalPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<DeveloperPortalCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<DeveloperPortalTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-developer-ecosystem/overview");
    if (res.ok) setCenter(parseDeveloperPortalCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/platform-developer-ecosystem/actions", {
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
  const doc = center.documentation ?? {};
  const certFlow = (doc.certification_flow as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_analytics")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshAnalytics}
        </button>
        <Link href="/app/companion/marketplace" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          Companion Marketplace
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEVELOPER_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.verifiedPublishers} value={Number(overview.verified_publishers ?? 0)} />
          <OverviewCard label={labels.overview.catalogExtensions} value={Number(overview.catalog_extensions ?? 0)} />
          <OverviewCard label={labels.overview.certifiedExtensions} value={Number(overview.certified_extensions ?? 0)} />
          <OverviewCard label={labels.overview.sdkModules} value={Number(overview.sdk_modules ?? 0)} />
          <OverviewCard label={labels.overview.totalInstalls} value={Number(overview.total_installs ?? 0)} />
        </dl>
      ) : null}

      {tab === "documentation" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm text-sm text-zinc-600">
          <p>{String(doc.sdk_guide ?? "")}</p>
          <ol className="mt-4 list-decimal space-y-1 pl-5">
            {certFlow.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
      ) : null}

      {tab === "apis" || tab === "publishing" ? (
        <section className="space-y-3">
          {(center.extensions ?? []).map((item) => (
            <div key={String(item.extension_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              {item.certification_status === "review" ? (
                <button type="button" disabled={busy}
                  onClick={() => void runAction("certify_extension", { extension_key: item.extension_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.certifyExtension}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "sdks" ? <section className="space-y-3"><JsonList items={center.sdk_modules ?? []} /></section> : null}
      {tab === "testing" ? <section className="space-y-3"><JsonList items={center.publishers ?? []} /></section> : null}
      {tab === "analytics" ? <section className="space-y-3"><JsonList items={center.extensions ?? []} /></section> : null}

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
