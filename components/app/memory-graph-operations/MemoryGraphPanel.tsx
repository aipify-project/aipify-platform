"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  DEPENDENCY_RISK_BADGES,
  ENTITY_TYPE_BADGES,
  MEMORY_GRAPH_TABS,
  RELATIONSHIP_STRENGTH_BADGES,
  parseMemoryGraphCenter,
  type MemoryGraphCenter,
  type MemoryGraphLabels,
  type MemoryGraphTab,
} from "@/lib/customer-memory-graph-operations";

type Props = {
  labels: MemoryGraphLabels;
  backHref: string;
  initialTab?: MemoryGraphTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: unknown }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <ul className="mt-1 space-y-0.5 text-xs text-zinc-500">
      {items.map((item, i) => <li key={i}>· {String(item)}</li>)}
    </ul>
  );
}

function ItemList({ items, labels }: { items: Record<string, unknown>[]; labels: MemoryGraphLabels }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={String(
            item.entity_key ?? item.relationship_key ?? item.connection_key ?? item.knowledge_key
              ?? item.decision_key ?? item.project_key ?? item.customer_key ?? item.dependency_key
              ?? item.pack_key ?? i
          )}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm"
        >
          <p className="font-medium text-zinc-900">
            {String(
              item.entity_title ?? item.connection_title ?? item.knowledge_title
                ?? item.decision_title ?? item.project_title ?? item.customer_title
                ?? item.dependency_title ?? item.pack_title ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.reasoning ? <p className="mt-1 text-indigo-700">{String(item.reasoning)}</p> : null}
          {item.source_entity_key && item.target_entity_key ? (
            <p className="mt-1 text-zinc-500">{String(item.source_entity_key)} → {String(item.target_entity_key)}</p>
          ) : null}
          {item.owner_name ? <p className="mt-1 text-zinc-500">{String(item.owner_name)}</p> : null}
          <JsonList items={item.connection_chain} />
          <JsonList items={item.stakeholders} />
          <JsonList items={item.interactions} />
          <div className="mt-2 flex flex-wrap gap-1">
            {item.entity_type ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ENTITY_TYPE_BADGES[String(item.entity_type)] ?? ENTITY_TYPE_BADGES.custom}`}>
                {String(item.entity_type)}
              </span>
            ) : null}
            {item.relationship_strength ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${RELATIONSHIP_STRENGTH_BADGES[String(item.relationship_strength)] ?? RELATIONSHIP_STRENGTH_BADGES.moderate}`}>
                {labels.relationshipStrength[String(item.relationship_strength) as keyof typeof labels.relationshipStrength] ?? String(item.relationship_strength)}
              </span>
            ) : null}
            {item.relationship_type ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.relationship_type)}</span>
            ) : null}
            {item.risk_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${DEPENDENCY_RISK_BADGES[String(item.risk_level)] ?? DEPENDENCY_RISK_BADGES.moderate}`}>
                {labels.dependencyRisk[String(item.risk_level) as keyof typeof labels.dependencyRisk] ?? String(item.risk_level)}
              </span>
            ) : null}
            {item.dependency_type ? (
              <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">{String(item.dependency_type)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MemoryGraphPanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<MemoryGraphCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MemoryGraphTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/memory-graph-operations");
    if (res.ok) setCenter(parseMemoryGraphCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/memory-graph-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.context_advisor_prompts as string[]) ?? [];
  const recommendations = center.recommendations ?? (executive.companion_recommendations as Record<string, unknown>[]) ?? [];

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
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_graph")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshGraph}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_context_briefing")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateContextBriefing}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {MEMORY_GRAPH_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.totalEntities} value={Number(overview.total_entities ?? 0)} />
            <OverviewCard label={labels.overview.totalRelationships} value={Number(overview.total_relationships ?? 0)} />
            <OverviewCard label={labels.overview.totalConnections} value={Number(overview.total_connections ?? 0)} />
            <OverviewCard label={labels.overview.knowledgeAssets} value={Number(overview.knowledge_assets ?? 0)} />
            <OverviewCard label={labels.overview.customerNetworks} value={Number(overview.customer_networks ?? 0)} />
            <OverviewCard label={labels.overview.projectNetworks} value={Number(overview.project_networks ?? 0)} />
            <OverviewCard label={labels.overview.decisionLinks} value={Number(overview.decision_links ?? 0)} />
            <OverviewCard label={labels.overview.activeDependencies} value={Number(overview.active_dependencies ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.dependencyMapping}</h2>
            <div className="mt-4"><ItemList items={center.dependencies ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.customerIntelligence}</h2>
            <div className="mt-4"><ItemList items={center.customer_intelligence ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "relationships" ? (
        <section className="space-y-4">
          <ItemList items={center.relationships ?? []} labels={labels} />
          <button type="button" disabled={busy} onClick={() => void runAction("add_relationship")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {labels.actions.addRelationship}
          </button>
        </section>
      ) : null}

      {tab === "entities" ? (
        <section className="space-y-6">
          <ItemList items={center.entities ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "connections" ? (
        <section><ItemList items={center.connections ?? []} labels={labels} /></section>
      ) : null}

      {tab === "knowledge" ? (
        <section><ItemList items={center.knowledge ?? []} labels={labels} /></section>
      ) : null}

      {tab === "decisions" ? (
        <section className="space-y-4">
          <ItemList items={center.decisions ?? []} labels={labels} />
          <button type="button" disabled={busy} onClick={() => void runAction("connect_decision")}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
            {labels.actions.connectDecision}
          </button>
        </section>
      ) : null}

      {tab === "projects" ? (
        <section><ItemList items={center.projects ?? []} labels={labels} /></section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <div className="mt-4"><ItemList items={recommendations} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.knowledgeMap}</h2>
            <div className="mt-4"><ItemList items={center.knowledge ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <button type="button" disabled={busy} onClick={() => void runAction("identify_dependency")}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
            {labels.actions.identifyDependency}
          </button>
        </section>
      ) : null}
    </div>
  );
}
