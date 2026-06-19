"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  CERTIFICATION_BADGES,
  EXTENSION_STATUS_BADGES,
  MARKETPLACE_TABS,
  parseCompanionMarketplaceCenter,
  type CompanionMarketplaceCenter,
  type CompanionMarketplaceLabels,
  type CompanionMarketplaceTab,
  type MarketplaceGovernance,
  type MarketplaceInstall,
} from "@/lib/customer-companion-marketplace-operations";

type Props = {
  labels: CompanionMarketplaceLabels;
  backHref: string;
  initialTab?: CompanionMarketplaceTab;
  visibleTabs?: CompanionMarketplaceTab[];
  titleOverride?: string;
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
            {String(item.extension_name ?? item.publisher_name ?? item.governance_title ?? item.title ?? i)}
          </p>
          {(item.description ?? item.summary ?? item.review_summary) ? (
            <p className="mt-1 text-zinc-600">{String(item.description ?? item.summary ?? item.review_summary)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.extension_category ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{String(item.extension_category)}</span>
            ) : null}
            {item.pricing_tier ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{String(item.pricing_tier)}</span>
            ) : null}
            {item.install_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${EXTENSION_STATUS_BADGES[String(item.install_status)] ?? EXTENSION_STATUS_BADGES.active}`}>
                {String(item.install_status)}
              </span>
            ) : null}
            {item.certification_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${CERTIFICATION_BADGES[String(item.certification_status)] ?? CERTIFICATION_BADGES.published}`}>
                {String(item.certification_status)}
              </span>
            ) : null}
          </div>
          {item.overall_rating != null ? <p className="mt-1 text-xs text-zinc-500">Rating: {String(item.overall_rating)}</p> : null}
        </div>
      ))}
    </>
  );
}

function InstallCard({ item, labels, busy, onRemove, onUpdate }: {
  item: MarketplaceInstall; labels: CompanionMarketplaceLabels; busy: boolean;
  onRemove: (key: string) => void; onUpdate: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.extension_name}</p>
      <p className="mt-1 text-xs text-zinc-500">{item.publisher_name} · v{item.version} · {item.install_status}</p>
      <div className="mt-3 flex gap-2">
        {item.install_status === "update_available" ? (
          <button type="button" disabled={busy} onClick={() => onUpdate(item.install_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.updateExtension}
          </button>
        ) : null}
        <button type="button" disabled={busy} onClick={() => onRemove(item.install_key)}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
          {labels.actions.removeExtension}
        </button>
      </div>
    </div>
  );
}

function GovernanceCard({ item, labels, busy, onApprove }: {
  item: MarketplaceGovernance; labels: CompanionMarketplaceLabels; busy: boolean; onApprove: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.governance_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">{item.governance_type} · {item.governance_status}</p>
      {item.governance_status === "pending" || item.governance_status === "review_required" ? (
        <button type="button" disabled={busy} onClick={() => onApprove(item.governance_key)}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
          {labels.actions.approveGovernance}
        </button>
      ) : null}
    </div>
  );
}

export function CompanionMarketplacePanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? MARKETPLACE_TABS;
  const [center, setCenter] = useState<CompanionMarketplaceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CompanionMarketplaceTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-marketplace-operations");
    if (res.ok) setCenter(parseCompanionMarketplaceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/companion-marketplace-operations/action", {
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
  const workflow = (center.integrations?.installation_workflow as string[]) ?? [];
  const advisorPrompts = (center.integrations?.extension_advisor_prompts as string[]) ?? [];
  const businessPacks = (center.integrations?.business_pack_links as Record<string, unknown>[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_marketplace")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshMarketplace}
        </button>
        <Link href="/app/companion/marketplace/extensions" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openExtensions}</Link>
        <Link href="/platform/developers" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openDevelopers}</Link>
        <Link href="/app/companion/governance" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openGovernance}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.catalogExtensions} value={Number(overview.catalog_extensions ?? 0)} />
          <OverviewCard label={labels.overview.installedExtensions} value={Number(overview.installed_extensions ?? 0)} />
          <OverviewCard label={labels.overview.updatesAvailable} value={Number(overview.updates_available ?? 0)} />
          <OverviewCard label={labels.overview.pendingGovernance} value={Number(overview.pending_governance ?? 0)} />
          <OverviewCard label={labels.overview.verifiedPublishers} value={Number(overview.verified_publishers ?? 0)} />
          <OverviewCard label={labels.overview.averageRating} value={Number(overview.average_rating ?? 0)} />
        </dl>
      ) : null}

      {tab === "extensions" ? (
        <section className="space-y-3">
          {(center.extensions ?? []).map((item) => (
            <div key={String(item.extension_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              <button type="button" disabled={busy}
                onClick={() => void runAction("install_extension", { extension_key: item.extension_key })}
                className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                {labels.actions.installExtension}
              </button>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "installed" ? (
        <section className="space-y-3">
          {(center.installed ?? []).map((item) => (
            <InstallCard key={item.install_key} item={item} labels={labels} busy={busy}
              onRemove={(key) => void runAction("remove_extension", { install_key: key })}
              onUpdate={(key) => void runAction("update_extension", { install_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "updates" ? <section className="space-y-3"><JsonList items={center.updates ?? []} /></section> : null}
      {tab === "publishers" ? <section className="space-y-3"><JsonList items={center.publishers ?? []} /></section> : null}
      {tab === "reviews" ? <section className="space-y-3"><JsonList items={center.reviews ?? []} /></section> : null}

      {tab === "categories" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {(center.categories ?? []).map((cat) => (
              <span key={cat} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">{cat.replace(/_/g, " ")}</span>
            ))}
          </div>
          {(center.governance ?? []).length ? (
            <div className="mt-6 space-y-3">
              <h2 className="font-semibold text-zinc-900">{labels.sections.permissionFramework}</h2>
              {(center.governance ?? []).map((item) => (
                <GovernanceCard key={item.governance_key} item={item} labels={labels} busy={busy}
                  onApprove={(key) => void runAction("approve_governance", { governance_key: key })} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <JsonList items={recommendations} />
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
          <div className="col-span-full grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.installationWorkflow}</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
                {workflow.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.extensionAdvisor}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                {advisorPrompts.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.businessPackIntegration}</h2>
              <div className="mt-4"><JsonList items={businessPacks} /></div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
