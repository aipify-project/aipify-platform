"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  GraphEntity,
  GraphRelationship,
  KnowledgeGraphCenter,
  KnowledgeGraphLabels,
  KnowledgeGraphTab,
  MemoryRecord,
} from "@/lib/knowledge-graph-operations";
import { parseKnowledgeGraphCenter } from "@/lib/knowledge-graph-operations/parse";

type Tab = KnowledgeGraphTab;

type Props = {
  labels: KnowledgeGraphLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function EntityCard({ entity, labels }: { entity: GraphEntity; labels: KnowledgeGraphLabels }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{entity.entity_type.replace(/_/g, " ")}</p>
      <p className="font-medium text-aipify-text">{entity.title}</p>
      {entity.summary ? <p className="mt-1 text-aipify-text-secondary">{entity.summary}</p> : null}
      {entity.connection_count != null && entity.connection_count > 0 ? (
        <p className="mt-1 text-xs text-aipify-text-muted">{entity.connection_count} connections</p>
      ) : null}
      {entity.record_href ? (
        <Link href={entity.record_href} className={`${AipifyShellClasses.secondaryButton} mt-3 inline-flex text-xs`}>
          {labels.viewRecord}
        </Link>
      ) : null}
    </div>
  );
}

function RelationshipCard({ rel }: { rel: GraphRelationship }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-aipify-text">{rel.from_entity?.title ?? "Entity"}</span>
        <span className="text-aipify-text-muted">→ {rel.relationship_type.replace(/_/g, " ")} →</span>
        <span className="font-medium text-aipify-text">{rel.to_entity?.title ?? "Entity"}</span>
      </div>
      {rel.strength ? <p className="mt-1 text-xs text-aipify-text-muted">Strength: {rel.strength}</p> : null}
    </div>
  );
}

function MemoryCard({ record }: { record: MemoryRecord }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{record.memory_type.replace(/_/g, " ")}</p>
      <p className="font-medium text-aipify-text">{record.title}</p>
      {record.summary ? <p className="mt-1 text-aipify-text-secondary">{record.summary}</p> : null}
      {record.reason ? <p className="mt-1 text-xs text-aipify-text-muted">Why: {record.reason}</p> : null}
      {record.outcome ? <p className="mt-1 text-xs text-aipify-text-secondary">Outcome: {record.outcome}</p> : null}
    </div>
  );
}

export function KnowledgeGraphPanel({ labels, initialTab = "overview", titleOverride, subtitleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<KnowledgeGraphCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GraphEntity[]>([]);
  const [impactResult, setImpactResult] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/knowledge-graph-operations");
    if (res.ok) setCenter(parseKnowledgeGraphCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    const res = await fetch("/api/app/knowledge-graph-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    if (action_type === "impact_analysis" && res.ok) {
      const data = await res.json();
      const impact = data.impact as Record<string, unknown> | undefined;
      setImpactResult(String(impact?.impact_summary ?? ""));
    }
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/app/knowledge-graph-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
    setBusy(false);
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const insights = center.insights ?? {};
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion_integration ?? {};
  const routes = center.routes ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "relationships", label: labels.relationships },
    { id: "entities", label: labels.entities },
    { id: "connections", label: labels.connections },
    { id: "insights", label: labels.insights },
    { id: "dependencies", label: labels.dependencies },
    { id: "timeline", label: labels.timeline },
    { id: "memory", label: labels.memory },
    { id: "decisions", label: labels.decisions },
    { id: "reports", label: labels.reports },
    { id: "companion", label: labels.companion },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{subtitleOverride ?? labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <div className={`${AipifyShellClasses.surfaceCard} flex flex-wrap gap-2 p-3`}>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm"
        />
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>
          {labels.searchGraph}
        </button>
        <Link href={routes.search ?? "/app/search"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
          {labels.searchIntegration}
        </Link>
      </div>

      {searchResults.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {searchResults.map((e) => (
            <EntityCard key={e.id} entity={e} labels={labels} />
          ))}
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={tab === item.id ? `${AipifyShellClasses.primaryButton} text-sm` : `${AipifyShellClasses.secondaryButton} text-sm`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                [labels.entityCount, overview.entity_count],
                [labels.relationshipCount, overview.relationship_count],
                [labels.dependencyCount, overview.dependency_count],
                [labels.memoryRecords, overview.memory_records],
                [labels.decisionCount, overview.decisions],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? 0)}</p>
              </div>
            ))}
          </div>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.connections}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(center.entities ?? []).slice(0, 6).map((e) => (
                <EntityCard key={e.id} entity={e} labels={labels} />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {tab === "relationships" ? (
        <div className="space-y-3">
          {(center.relationships ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.relationships?.map((rel) => <RelationshipCard key={rel.id} rel={rel} />)
          )}
        </div>
      ) : null}

      {tab === "entities" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.entities ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.entities?.map((e) => (
              <div key={e.id}>
                <EntityCard entity={e} labels={labels} />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setSelectedEntityId(e.id);
                    void runAction("impact_analysis", { entity_id: e.id, action: "change" });
                  }}
                  className={`${AipifyShellClasses.secondaryButton} mt-2 text-xs`}
                >
                  {labels.runImpactAnalysis}
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}

      {impactResult && selectedEntityId ? (
        <div className={`${AipifyShellClasses.surfaceCard} border-l-4 border-amber-400 p-4 text-sm`}>
          <p className="font-medium text-aipify-text">{labels.impactAnalysis}</p>
          <p className="mt-1 text-aipify-text-secondary">{impactResult}</p>
        </div>
      ) : null}

      {tab === "connections" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.connections ?? []).map((c) => (
            c.entity ? <EntityCard key={c.entity.id} entity={c.entity} labels={labels} /> : null
          ))}
        </div>
      ) : null}

      {tab === "insights" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-4 p-4 text-sm`}>
          {Array.isArray(insights.relationship_insights) ? (
            <ul className="list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {insights.relationship_insights.map((t) => (
                <li key={String(t)}>{String(t)}</li>
              ))}
            </ul>
          ) : null}
          <div>
            <h3 className="font-semibold text-aipify-text">{labels.executiveDashboard}</h3>
            {Array.isArray(executive.companion_highlights) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {executive.companion_highlights.map((h) => (
                  <li key={String(h)}>{String(h)}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "dependencies" ? (
        <div className="space-y-3">
          {(center.dependencies ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.dependencies?.map((d) => (
              <div key={d.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">
                  {d.entity?.title} → depends on → {d.depends_on?.title}
                </p>
                <p className="mt-1 text-xs uppercase text-aipify-text-muted">{d.dependency_type} · {d.impact_level}</p>
                {d.summary ? <p className="mt-1 text-aipify-text-secondary">{d.summary}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "timeline" ? (
        <div className="space-y-3">
          {(center.knowledge_timeline ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.knowledge_timeline?.map((ev) => (
              <div key={ev.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs uppercase text-aipify-text-muted">{ev.event_type}</p>
                <p className="font-medium text-aipify-text">{ev.title}</p>
                {ev.summary ? <p className="mt-1 text-aipify-text-secondary">{ev.summary}</p> : null}
                {ev.occurred_at ? <p className="mt-1 text-xs text-aipify-text-muted">{new Date(ev.occurred_at).toLocaleString()}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "memory" ? (
        <div className="space-y-3">
          {(center.organizational_memory ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.organizational_memory?.map((m) => <MemoryCard key={m.id} record={m} />)
          )}
        </div>
      ) : null}

      {tab === "decisions" ? (
        <div className="space-y-3">
          {(center.decision_history ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.decision_history?.map((d) => (
              <div key={d.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{d.decision_title}</p>
                {d.reason ? <p className="mt-1 text-aipify-text-secondary">{d.reason}</p> : null}
                {d.outcome ? <p className="mt-1 text-xs text-aipify-text-muted">Outcome: {d.outcome}</p> : null}
                {d.lessons_learned ? <p className="mt-2 text-xs font-medium text-aipify-text-secondary">{d.lessons_learned}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.reports ?? {}).map(([key, value]) => (
            <div key={key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs uppercase text-aipify-text-muted">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 font-medium text-aipify-text">{typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "companion" ? (
        <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.companionIntegration}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
            {Array.isArray(companion.prompts) ? companion.prompts.map((p) => <li key={String(p)}>{String(p)}</li>) : null}
          </ul>
        </div>
      ) : null}

      {(center.audit_recent ?? []).length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <div className="space-y-2">
            {center.audit_recent?.map((entry) => (
              <div key={`${entry.action}-${entry.created_at}`} className={`${AipifyShellClasses.surfaceCard} p-3 text-xs text-aipify-text-secondary`}>
                <span className="font-medium text-aipify-text">{entry.action}</span> — {entry.summary}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
