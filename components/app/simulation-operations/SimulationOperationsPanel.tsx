"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  SimulationOperationsCenter,
  SimulationOperationsLabels,
  SimulationOperationsTab,
  SimulationScenario,
} from "@/lib/simulation-operations";
import { parseSimulationOperationsCenter } from "@/lib/simulation-operations/parse";

type Tab = SimulationOperationsTab;

type Props = {
  labels: SimulationOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function ScenarioCard({
  scenario,
  labels,
  onRun,
  busy,
}: {
  scenario: SimulationScenario;
  labels: SimulationOperationsLabels;
  onRun?: (id: string) => void;
  busy?: boolean;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{scenario.simulation_category?.replace(/_/g, " ")}</p>
      <p className="font-medium text-aipify-text">{scenario.title}</p>
      {scenario.description ? <p className="mt-1 text-aipify-text-secondary">{scenario.description}</p> : null}
      {scenario.status ? <p className="mt-1 text-xs text-aipify-text-muted">Status: {scenario.status}</p> : null}
      {onRun ? (
        <button type="button" disabled={busy} onClick={() => onRun(scenario.id)} className={`${AipifyShellClasses.primaryButton} mt-3 text-xs`}>
          {labels.runSimulation}
        </button>
      ) : null}
    </div>
  );
}

export function SimulationOperationsPanel({ labels, initialTab = "overview", titleOverride, subtitleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<SimulationOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SimulationScenario[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/simulation-operations");
    if (res.ok) setCenter(parseSimulationOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/simulation-operations/action", {
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
    const res = await fetch(`/api/app/simulation-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
  const executive = center.executive_simulation_center ?? {};
  const advisor = center.companion_advisor ?? {};
  const routes = center.routes ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "organization_twin", label: labels.organizationTwin },
    { id: "scenarios", label: labels.scenarios },
    { id: "forecasts", label: labels.forecasts },
    { id: "experiments", label: labels.experiments },
    { id: "comparisons", label: labels.comparisons },
    { id: "decision_lab", label: labels.decisionLab },
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
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>{labels.searchScenarios}</button>
        <Link href={routes.digital_twin_legacy ?? "/app/intelligence/digital-twin"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>{labels.organizationTwin}</Link>
      </div>

      {searchResults.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {searchResults.map((s) => <ScenarioCard key={s.id} scenario={s} labels={labels} />)}
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={tab === item.id ? `${AipifyShellClasses.primaryButton} text-sm` : `${AipifyShellClasses.secondaryButton} text-sm`}>{item.label}</button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([[labels.scenarioCount, overview.scenario_count], [labels.activeSimulations, overview.active_simulations], [labels.runCount, overview.run_count], [labels.decisionOptions, overview.decision_options]] as const).map(([label, value]) => (
              <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? 0)}</p>
              </div>
            ))}
          </div>
          {Array.isArray(center.simulation_workflow) ? (
            <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h2 className="font-semibold text-aipify-text">{labels.simulationWorkflow}</h2>
              <p className="mt-2 text-aipify-text-secondary">{center.simulation_workflow.join(" → ")}</p>
            </div>
          ) : null}
        </>
      ) : null}

      {tab === "organization_twin" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.organization_twin ?? []).map((m) => (
            <div key={m.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs uppercase text-aipify-text-muted">{m.model_domain}</p>
              <p className="font-medium text-aipify-text">{m.title}</p>
              {m.summary ? <p className="mt-1 text-aipify-text-secondary">{m.summary}</p> : null}
              {m.confidence_pct != null ? <p className="mt-1 text-xs text-aipify-text-muted">{labels.confidence}: {m.confidence_pct}%</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "scenarios" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.scenarios ?? []).length === 0 ? <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} /> : center.scenarios?.map((s) => (
            <ScenarioCard key={s.id} scenario={s} labels={labels} busy={busy} onRun={(id) => void runAction("run_simulation", { scenario_id: id })} />
          ))}
        </div>
      ) : null}

      {tab === "forecasts" ? (
        <div className="space-y-3">
          {(center.forecasts ?? []).map((f) => (
            <div key={f.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{f.scenario_title} · {f.run_type}</p>
              {f.revenue_impact != null ? <p className="mt-1 text-xs text-aipify-text-muted">{labels.revenueImpact}: {f.revenue_impact}</p> : null}
              {f.cost_impact != null ? <p className="text-xs text-aipify-text-muted">{labels.costImpact}: {f.cost_impact}</p> : null}
              {f.forecast_confidence_pct != null ? <p className="text-xs text-aipify-text-muted">{labels.confidence}: {f.forecast_confidence_pct}%</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "experiments" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.experiments ?? []).map((s) => <ScenarioCard key={s.id} scenario={s} labels={labels} busy={busy} onRun={(id) => void runAction("run_simulation", { scenario_id: id })} />)}
        </div>
      ) : null}

      {tab === "comparisons" ? (
        <div className="space-y-3">
          {(center.comparisons ?? []).map((c) => (
            <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{c.comparison_title}</p>
              {c.summary ? <p className="mt-1 text-aipify-text-secondary">{c.summary}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "decision_lab" ? (
        <div className="space-y-4">
          {Object.entries(
            (center.decision_lab ?? []).reduce<Record<string, typeof center.decision_lab>>((acc, opt) => {
              const key = opt.decision_title;
              acc[key] = [...(acc[key] ?? []), opt];
              return acc;
            }, {}),
          ).map(([title, options]) => (
            <div key={title} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{title}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {options?.map((o) => (
                  <div key={o.id} className="rounded border border-aipify-border p-3">
                    <p className="font-medium text-aipify-text">{o.option_label}</p>
                    {o.option_summary ? <p className="mt-1 text-aipify-text-secondary">{o.option_summary}</p> : null}
                    <p className="mt-2 text-xs text-aipify-text-muted">
                      Cost: {o.cost_estimate ?? "—"} · Risk: {o.risk_level} · Return: {o.expected_return_pct ?? "—"}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
            <h2 className="font-semibold text-aipify-text">{labels.executiveSimulation}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              Decision confidence: {String(executive.decision_confidence ?? "—")}% · Forecast confidence: {String(executive.forecast_confidence ?? "—")}%
            </p>
            {Array.isArray(executive.companion_recommendations) ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {executive.companion_recommendations.map((h) => <li key={String(h)}>{String(h)}</li>)}
              </ul>
            ) : null}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.learningLoop}</h2>
            {(center.learning_loop ?? []).map((l) => (
              <div key={l.id} className="mt-3 border-t border-aipify-border pt-3">
                <p className="text-aipify-text-secondary">Forecast: {l.forecast_summary}</p>
                <p className="text-aipify-text-secondary">Actual: {l.actual_summary}</p>
                {l.lessons_learned ? <p className="mt-1 text-xs font-medium text-aipify-text">{l.lessons_learned}</p> : null}
              </div>
            ))}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.companionAdvisor}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {Array.isArray(advisor.prompts) ? advisor.prompts.map((p) => <li key={String(p)}>{String(p)}</li>) : null}
            </ul>
          </div>
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
