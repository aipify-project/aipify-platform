"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  FEDERATION_STATUS_BADGES,
  FEDERATION_TABS,
  RISK_LEVEL_BADGES,
  parseFederationCenter,
  type FederationCenter,
  type FederationLabels,
  type FederationRegistry,
  type FederationTab,
  type FederationWorkspace,
} from "@/lib/customer-federation-operations";

type Props = {
  labels: FederationLabels;
  backHref: string;
  initialTab?: FederationTab;
  visibleTabs?: FederationTab[];
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
            {String(
              item.federation_name ?? item.network_name ?? item.intelligence_title
                ?? item.workspace_title ?? item.benchmark_title ?? item.trend_title
                ?? item.risk_title ?? item.knowledge_title ?? item.research_title
                ?? item.partner_org_name ?? i
            )}
          </p>
          {(item.summary ?? item.description) ? (
            <p className="mt-1 text-zinc-600">{String(item.summary ?? item.description)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.federation_type ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{String(item.federation_type)}</span>
            ) : null}
            {item.federation_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${FEDERATION_STATUS_BADGES[String(item.federation_status)] ?? FEDERATION_STATUS_BADGES.active}`}>
                {String(item.federation_status)}
              </span>
            ) : null}
            {item.trust_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${FEDERATION_STATUS_BADGES[String(item.trust_status)] ?? FEDERATION_STATUS_BADGES.verified}`}>
                {String(item.trust_status)}
              </span>
            ) : null}
            {item.risk_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${RISK_LEVEL_BADGES[String(item.risk_level)] ?? RISK_LEVEL_BADGES.moderate}`}>
                {String(item.risk_level)}
              </span>
            ) : null}
            {item.is_aggregated === true ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">aggregated</span>
            ) : null}
          </div>
          {item.variance_pct != null ? (
            <p className="mt-1 text-xs text-zinc-500">Variance: {String(item.variance_pct)}%</p>
          ) : null}
        </div>
      ))}
    </>
  );
}

function FederationCard({ item, labels, busy, onJoin }: {
  item: FederationRegistry; labels: FederationLabels; busy: boolean; onJoin: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.federation_name}</p>
      {item.description ? <p className="mt-1 text-sm text-zinc-600">{item.description}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">{item.industry} · {item.region} · {item.federation_status}</p>
      {item.federation_status !== "active" ? (
        <button type="button" disabled={busy} onClick={() => onJoin(item.federation_key)}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
          {labels.actions.joinFederation}
        </button>
      ) : null}
    </div>
  );
}

function WorkspaceCard({ item, labels, busy, onCreate }: {
  item: FederationWorkspace; labels: FederationLabels; busy: boolean; onCreate?: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.workspace_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">{item.workspace_type} · {item.workspace_status}</p>
      {onCreate ? null : null}
    </div>
  );
}

export function FederationPanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? FEDERATION_TABS;
  const [center, setCenter] = useState<FederationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FederationTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/federation-operations");
    if (res.ok) setCenter(parseFederationCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/federation-operations/action", {
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
  const advisorPrompts = (center.integrations?.federation_advisor_prompts as string[]) ?? [];
  const benchmarks = (center.reports?.benchmarks as Record<string, unknown>[]) ?? [];
  const observatory = (center.reports?.industry_observatory as Record<string, unknown>[]) ?? [];
  const riskSignals = (center.reports?.risk_signals as Record<string, unknown>[]) ?? [];
  const knowledge = (center.integrations?.knowledge_federation as Record<string, unknown>[]) ?? [];
  const research = (center.integrations?.research_network as Record<string, unknown>[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const trustRelationships = (center.trust_relationships?.relationships as Record<string, unknown>[]) ?? [];
  const governanceRules = (center.governance?.rules as string[]) ?? [];

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
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_federation")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshFederation}
        </button>
        <Link href="/app/federation/workspaces" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openWorkspaces}</Link>
        <Link href="/app/network" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openNetwork}</Link>
        <Link href="/app/settings/security" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openTrustCenter}</Link>
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
          <OverviewCard label={labels.overview.activeFederations} value={Number(overview.active_federations ?? 0)} />
          <OverviewCard label={labels.overview.federationNetworks} value={Number(overview.federation_networks ?? 0)} />
          <OverviewCard label={labels.overview.trustRelationships} value={Number(overview.trust_relationships ?? 0)} />
          <OverviewCard label={labels.overview.sharedIntelligence} value={Number(overview.shared_intelligence ?? 0)} />
          <OverviewCard label={labels.overview.federatedWorkspaces} value={Number(overview.federated_workspaces ?? 0)} />
          <OverviewCard label={labels.overview.trustReviewsRequired} value={Number(overview.trust_reviews_required ?? 0)} />
        </dl>
      ) : null}

      {tab === "networks" ? <section className="space-y-3"><JsonList items={center.networks ?? []} /></section> : null}

      {tab === "organizations" ? (
        <section className="space-y-3">
          {(center.federations ?? []).map((item) => (
            <FederationCard key={item.federation_key} item={item} labels={labels} busy={busy}
              onJoin={(key) => void runAction("join_federation", { federation_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "trust" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.trustFramework}</h2>
            <div className="mt-4 space-y-3">
              {trustRelationships.map((item, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <JsonList items={[item]} />
                  {item.trust_status === "pending" || item.trust_status === "review_required" ? (
                    <button type="button" disabled={busy}
                      onClick={() => void runAction("approve_trust", { trust_key: item.trust_key })}
                      className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                      {labels.actions.approveTrust}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "intelligence" ? (
        <section className="space-y-3">
          {(center.shared_intelligence ?? []).map((item) => (
            <div key={String(item.intelligence_key)} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <JsonList items={[item]} />
              {item.intelligence_status === "approved" ? (
                <button type="button" disabled={busy}
                  onClick={() => void runAction("share_intelligence", { intelligence_key: item.intelligence_key })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.shareIntelligence}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "workspaces" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("create_workspace", { workspace_title: "New Federated Workspace" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.createWorkspace}
          </button>
          {(center.workspaces ?? []).map((item) => (
            <WorkspaceCard key={item.workspace_key} item={item} labels={labels} busy={busy} />
          ))}
        </section>
      ) : null}

      {tab === "governance" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.governanceRules}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600">
            {governanceRules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <JsonList items={recommendations} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.benchmarking}</h2>
            <div className="mt-4"><JsonList items={benchmarks} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.industryObservatory}</h2>
            <div className="mt-4"><JsonList items={observatory} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.riskNetwork}</h2>
            <div className="mt-4 space-y-3">
              {riskSignals.map((item) => (
                <div key={String(item.risk_key)}>
                  <JsonList items={[item]} />
                  {item.risk_status === "pending" ? (
                    <button type="button" disabled={busy}
                      onClick={() => void runAction("publish_risk_signal", { risk_key: item.risk_key })}
                      className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                      {labels.actions.publishRiskSignal}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.knowledgeFederation}</h2>
            <div className="mt-4"><JsonList items={knowledge} /></div>
          </div>
          <button type="button" disabled={busy} onClick={() => void runAction("start_research", { research_title: "New Research Initiative" })}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {labels.actions.startResearch}
          </button>
          <JsonList items={research} />
        </section>
      ) : null}

      {center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.federationAdvisor}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          {advisorPrompts.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
