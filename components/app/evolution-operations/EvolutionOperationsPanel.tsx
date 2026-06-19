"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  EvolutionAdoptionItem,
  EvolutionOperationsCenter,
  EvolutionOperationsLabels,
  EvolutionOperationsTab,
  EvolutionRecommendation,
} from "@/lib/evolution-operations";
import { parseEvolutionOperationsCenter } from "@/lib/evolution-operations/parse";

type Tab = EvolutionOperationsTab;

type Props = {
  labels: EvolutionOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function RecommendationCard({
  rec,
  labels,
  onAccept,
  onReject,
  onTraining,
  busy,
}: {
  rec: EvolutionRecommendation;
  labels: EvolutionOperationsLabels;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onTraining?: (id: string) => void;
  busy?: boolean;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{rec.recommendation_type?.replace(/_/g, " ")} · {rec.status}</p>
      <p className="font-medium text-aipify-text">{rec.title}</p>
      {rec.summary ? <p className="mt-1 text-aipify-text-secondary">{rec.summary}</p> : null}
      {rec.estimated_value ? <p className="mt-1 text-xs text-aipify-text-muted">{rec.estimated_value}</p> : null}
      {rec.value_generated ? <p className="mt-1 text-xs font-medium text-aipify-text">{rec.value_generated}</p> : null}
      {rec.status === "pending" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {onAccept ? <button type="button" disabled={busy} onClick={() => onAccept(rec.id)} className={`${AipifyShellClasses.primaryButton} text-xs`}>{labels.acceptRecommendation}</button> : null}
          {onReject ? <button type="button" disabled={busy} onClick={() => onReject(rec.id)} className={`${AipifyShellClasses.secondaryButton} text-xs`}>{labels.rejectRecommendation}</button> : null}
          {onTraining && rec.recommendation_type === "training" ? <button type="button" disabled={busy} onClick={() => onTraining(rec.id)} className={`${AipifyShellClasses.secondaryButton} text-xs`}>{labels.assignTraining}</button> : null}
        </div>
      ) : null}
    </div>
  );
}

function AdoptionCard({ item, labels }: { item: EvolutionAdoptionItem; labels: EvolutionOperationsLabels }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{item.item_type?.replace(/_/g, " ")} · {item.status}</p>
      <p className="font-medium text-aipify-text">{item.title}</p>
      {item.usage_pct != null ? <p className="mt-1 text-xs text-aipify-text-muted">{labels.usagePct}: {item.usage_pct}%</p> : null}
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: unknown[] }) {
  if (!items.length) return null;
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      {title ? <h2 className="font-semibold text-aipify-text">{title}</h2> : null}
      <ul className={`${title ? "mt-2" : ""} list-disc space-y-1 pl-5 text-aipify-text-secondary`}>
        {items.map((item) => <li key={String(item)}>{String(item)}</li>)}
      </ul>
    </div>
  );
}

export function EvolutionOperationsPanel({ labels, initialTab = "overview", titleOverride, subtitleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<EvolutionOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EvolutionRecommendation[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/evolution-operations");
    if (res.ok) setCenter(parseEvolutionOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/evolution-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setBusy(true);
    const res = await fetch(`/api/app/evolution-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
    setBusy(false);
  }

  if (loading && !center) {
    return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  }
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const overview = center.overview ?? {};
  const maturity = (center.maturity_engine?.current ?? {}) as Record<string, unknown>;
  const executive = center.executive_dashboard ?? {};
  const health = center.health_review ?? {};
  const routes = center.routes ?? {};
  const insights = center.companion_insights ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "adoption", label: labels.adoption },
    { id: "maturity", label: labels.maturity },
    { id: "recommendations", label: labels.recommendations },
    { id: "training", label: labels.training },
    { id: "optimization", label: labels.optimization },
    { id: "companion_insights", label: labels.companionInsights },
    { id: "reports", label: labels.reports },
    { id: "executive", label: labels.executive },
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
        <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm" />
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>{labels.searchRecommendations}</button>
        <Link href={routes.learning ?? "/app/learning"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>{labels.training}</Link>
        <Link href={routes.organizational_evolution_legacy ?? "/app/evolution/legacy"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>{labels.legacyLink}</Link>
      </div>

      {searchResults.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {searchResults.map((r) => <RecommendationCard key={r.id} rec={r} labels={labels} />)}
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={tab === item.id ? `${AipifyShellClasses.primaryButton} text-sm` : `${AipifyShellClasses.secondaryButton} text-sm`}>{item.label}</button>
        ))}
      </nav>

      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {([[labels.maturityScore, overview.maturity_score], [labels.adoptionScore, overview.adoption_score], [labels.pendingRecommendations, overview.pending_recommendations], [labels.unusedFeatures, overview.unused_features], [labels.trainingGaps, overview.training_gaps]] as const).map(([label, value]) => (
            <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "adoption" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.adoption ?? []).length === 0 ? <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} /> : center.adoption?.map((a) => <AdoptionCard key={a.id} item={a} labels={labels} />)}
        </div>
      ) : null}

      {tab === "maturity" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.maturityEngine}</h2>
            <p className="mt-2 text-aipify-text">Level {String(maturity.level ?? "—")}: {String(maturity.label ?? "")} · Score: {String(maturity.score ?? "—")}</p>
            {maturity.explanation ? <p className="mt-2 text-aipify-text-secondary">{String(maturity.explanation)}</p> : null}
          </div>
          <ListSection title="Improvement guidance" items={Array.isArray(maturity.improvement_guidance) ? maturity.improvement_guidance as string[] : []} />
        </div>
      ) : null}

      {tab === "recommendations" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.recommendations ?? []).map((r) => (
            <RecommendationCard key={r.id} rec={r} labels={labels} busy={busy}
              onAccept={(id) => void runAction("accept_recommendation", { recommendation_id: id })}
              onReject={(id) => void runAction("reject_recommendation", { recommendation_id: id })}
              onTraining={(id) => void runAction("assign_training", { recommendation_id: id })}
            />
          ))}
        </div>
      ) : null}

      {tab === "training" ? (
        <div className="space-y-4">
          <ListSection title={labels.training} items={Array.isArray(center.training_integration?.engines) ? center.training_integration.engines as string[] : []} />
          <ListSection title="Training needs" items={Array.isArray(health.training_needs) ? health.training_needs as string[] : []} />
        </div>
      ) : null}

      {tab === "optimization" ? (
        <div className="space-y-4">
          <ListSection title={labels.processOptimization} items={Array.isArray(center.process_optimization?.examples) ? center.process_optimization.examples as string[] : []} />
          <ListSection title={labels.healthReview} items={Array.isArray(health.weaknesses) ? health.weaknesses as string[] : []} />
        </div>
      ) : null}

      {tab === "companion_insights" ? (
        <ListSection title={labels.companionInsights} items={Array.isArray(insights.prompts) ? insights.prompts as string[] : []} />
      ) : null}

      {tab === "reports" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.reports ?? {}).map(([key, value]) => (
            <div key={key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs uppercase text-aipify-text-muted">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 font-medium text-aipify-text">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "executive" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executiveDashboard}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              {labels.maturityScore}: {String(executive.maturity_score ?? "—")} · {labels.adoptionScore}: {String(executive.adoption_score ?? "—")}
            </p>
            {Array.isArray(executive.companion_recommendations) ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {executive.companion_recommendations.map((h) => <li key={String(h)}>{String(h)}</li>)}
              </ul>
            ) : null}
          </div>
          <ListSection title={labels.successTracking} items={Object.entries(center.success_tracking ?? {}).map(([k, v]) => `${k}: ${String(v)}`)} />
          <ListSection title={labels.departmentEvolution} items={(center.department_evolution ?? []).map((d) => `${d.department_name} — maturity ${d.maturity_score ?? "—"}`)} />
          <ListSection title={labels.learningLoop} items={Array.isArray(center.learning_loop?.workflow) ? center.learning_loop.workflow as string[] : []} />
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
