"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  CONFIDENCE_BADGES,
  ECOSYSTEM_TABS,
  PERFORMANCE_BADGES,
  VERIFICATION_BADGES,
  parseCompanionEcosystemCenter,
  type CompanionEcosystemCenter,
  type CompanionEcosystemLabels,
  type CompanionEcosystemTab,
  type EcosystemApproval,
} from "@/lib/customer-companion-ecosystem-operations";

type Props = {
  labels: CompanionEcosystemLabels;
  backHref: string;
  initialTab?: CompanionEcosystemTab;
  visibleTabs?: CompanionEcosystemTab[];
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
            {String(
              item.company_name ?? item.service_title ?? item.recommendation_title ??
                item.pack_title ?? item.approval_title ?? item.provider_name ?? i
            )}
          </p>
          {(item.summary ?? item.reason_summary ?? item.review_summary ?? item.sla_summary) ? (
            <p className="mt-1 text-zinc-600">
              {String(item.summary ?? item.reason_summary ?? item.review_summary ?? item.sla_summary)}
            </p>
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
          {item.confidence_level ? (
            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${CONFIDENCE_BADGES[String(item.confidence_level)] ?? CONFIDENCE_BADGES.moderate}`}>
              {String(item.confidence_level)}
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

function ApprovalCard({
  item,
  labels,
  busy,
  onApprove,
  onDeny,
}: {
  item: EcosystemApproval;
  labels: CompanionEcosystemLabels;
  busy: boolean;
  onApprove: (key: string) => void;
  onDeny: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.approval_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">{item.approval_status}</p>
      {item.approval_status === "pending" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onApprove(item.approval_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.approveRequest}
          </button>
          <button type="button" disabled={busy} onClick={() => onDeny(item.approval_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
            {labels.actions.denyRequest}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function CompanionEcosystemPanel({
  labels,
  backHref,
  initialTab = "overview",
  visibleTabs,
}: Props) {
  const tabs = visibleTabs ?? ECOSYSTEM_TABS;
  const [center, setCenter] = useState<CompanionEcosystemCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CompanionEcosystemTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-ecosystem-operations");
    if (res.ok) setCenter(parseCompanionEcosystemCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/companion-ecosystem-operations/action", {
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
  const marketplace = center.marketplace ?? {};
  const marketplaceServices = (marketplace.services as Record<string, unknown>[]) ?? center.services ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const businessPacks = (center.integrations?.business_pack_links as Record<string, unknown>[]) ?? [];
  const workflow = (center.integrations?.service_workflow as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_marketplace_health")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshMarketplace}
        </button>
        <Link href="/app/companion/services" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openServices}</Link>
        <Link href="/app/companion/governance" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openGovernance}</Link>
        <Link href="/platform/providers" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openProviderRegistry}</Link>
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
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.verifiedProviders} value={Number(overview.verified_providers ?? 0)} />
          <OverviewCard label={labels.overview.marketplaceServices} value={Number(overview.marketplace_services ?? 0)} />
          <OverviewCard label={labels.overview.activeRequests} value={Number(overview.active_requests ?? 0)} />
          <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
          <OverviewCard label={labels.overview.completedRequests} value={Number(overview.completed_requests ?? 0)} />
          <OverviewCard label={labels.overview.averageRating} value={Number(overview.average_rating ?? 0)} />
          <OverviewCard label={labels.overview.activeContracts} value={Number(overview.active_contracts ?? 0)} />
        </dl>
      ) : null}

      {tab === "providers" ? <section className="space-y-3"><JsonList items={center.providers ?? []} /></section> : null}

      {tab === "services" || tab === "marketplace" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.serviceAdvisor}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {((marketplace.service_advisor_prompts as string[]) ?? []).map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.domainAwareness}</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {((marketplace.domain_awareness as string[]) ?? []).join(" · ")}
            </p>
          </section>
          <section className="col-span-full space-y-3"><JsonList items={marketplaceServices} /></section>
        </div>
      ) : null}

      {tab === "requests" ? (
        <section className="space-y-3"><JsonList items={center.requests ?? []} /></section>
      ) : null}

      {tab === "approvals" ? (
        <section className="space-y-3">
          {(center.approvals ?? []).map((item) => (
            <ApprovalCard key={item.approval_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_request", { approval_key: key })}
              onDeny={(key) => void runAction("deny_request", { approval_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "ratings" ? <section className="space-y-3"><JsonList items={center.ratings ?? []} /></section> : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          <h2 className="mb-4 font-semibold text-zinc-900">{labels.sections.companionRecommendations}</h2>
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
              <h2 className="font-semibold text-zinc-900">{labels.sections.businessPackIntegration}</h2>
              <div className="mt-4"><JsonList items={businessPacks} /></div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.serviceWorkflow}</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
                {workflow.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.growthPartnerIntegration}</h2>
              <p className="mt-2 text-sm text-zinc-600">
                {String((center.integrations?.growth_partner_integration as Record<string, unknown>)?.note ?? "")}
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
