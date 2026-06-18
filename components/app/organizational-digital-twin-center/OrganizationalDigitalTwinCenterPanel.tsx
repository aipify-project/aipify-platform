"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  DTC_CORE_PRINCIPLE,
  DTC_PHILOSOPHY,
  DTC_VISION,
  parseOrganizationalDigitalTwinCenter,
  type OrganizationalDigitalTwinCenter,
} from "@/lib/organizational-digital-twin-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  digitalTwinEngineLink: string;
  changeManagementLink: string;
  organizationalHealthLink: string;
  simulationsLink: string;
  dashboardTitle: string;
  domainsTitle: string;
  nodesTitle: string;
  relationshipsTitle: string;
  dependenciesTitle: string;
  visualizationsTitle: string;
  impactTitle: string;
  snapshotsTitle: string;
  comparisonsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  captureSnapshot: string;
  completeReview: string;
  generateSummary: string;
  exportMap: string;
  generateDiagram: string;
  humansDecide: string;
  privacyNote: string;
  domains: Record<string, string>;
  nodeTypes: Record<string, string>;
  relationshipTypes: Record<string, string>;
  vizTypes: Record<string, string>;
  riskLevels: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const RISK_STYLES: Record<string, string> = {
  critical: "border-rose-200 bg-rose-50",
  high: "border-orange-200 bg-orange-50",
  medium: "border-amber-200 bg-amber-50",
  low: "border-slate-200 bg-slate-50",
};

export function OrganizationalDigitalTwinCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalDigitalTwinCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-digital-twin/center");
    if (res.ok) setCenter(parseOrganizationalDigitalTwinCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-digital-twin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.digital_twin_engine && <Link href={center.links.digital_twin_engine} className="text-slate-600 hover:underline">{labels.digitalTwinEngineLink}</Link>}
        {center?.links?.change_management && <Link href={center.links.change_management} className="text-slate-600 hover:underline">{labels.changeManagementLink}</Link>}
        {center?.links?.organizational_health && <Link href={center.links.organizational_health} className="text-slate-600 hover:underline">{labels.organizationalHealthLink}</Link>}
        {center?.links?.simulations && <Link href={center.links.simulations} className="text-slate-600 hover:underline">{labels.simulationsLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {DTC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {DTC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {DTC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.nodes} value={dash.structural_nodes} />
            <Metric label={labels.metrics.relationships} value={dash.relationships_mapped} />
            <Metric label={labels.metrics.dependencies} value={dash.critical_dependencies} />
            <Metric label={labels.metrics.workflowHealth} value={dash.workflow_health_score} />
            <Metric label={labels.metrics.automation} value={`${dash.automation_coverage_pct}%`} />
            <Metric label={labels.metrics.knowledge} value={dash.knowledge_distribution_score} />
            <Metric label={labels.metrics.maturity} value={dash.workflow_maturity_score} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateSummary} onClick={() => void postAction({ action: "generate_executive_summary" })} />
              <ActionBtn label={labels.exportMap} variant="muted" onClick={() => void postAction({ action: "export_dependency_map" })} />
              <ActionBtn label={labels.generateDiagram} variant="muted" onClick={() => void postAction({ action: "generate_workflow_diagram" })} />
              <ActionBtn label={labels.captureSnapshot} variant="muted" onClick={() => void postAction({ action: "capture_snapshot", label: "Executive snapshot" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.domainsTitle} empty={center?.domain_metrics.length === 0} emptyLabel={labels.emptySection}>
        {center?.domain_metrics.map((m) => (
          <li key={m.metric_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[m.domain] ?? m.domain}</p>
                <p className="font-medium text-gray-900">{m.label}</p>
              </div>
              <p className="font-semibold text-gray-900">{m.value_label}</p>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.dependenciesTitle} empty={center?.dependencies.length === 0} emptyLabel={labels.emptySection}>
        {center?.dependencies.map((dep) => (
          <li key={dep.dependency_key} className={`rounded-xl border p-4 text-sm ${RISK_STYLES[dep.risk_level] ?? RISK_STYLES.medium}`}>
            <p className="font-medium text-gray-900">{dep.label}</p>
            <p className="mt-1 text-gray-700">{dep.summary}</p>
            <p className="mt-1 text-xs text-gray-500">{labels.riskLevels[dep.risk_level] ?? dep.risk_level} · {dep.systems_involved.join(", ")}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.relationshipsTitle} empty={center?.relationships.length === 0} emptyLabel={labels.emptySection}>
        {center?.relationships.map((rel) => (
          <li key={rel.relationship_key} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.relationshipTypes[rel.relationship_type] ?? rel.relationship_type}</p>
            <p className="mt-1 text-gray-800">{rel.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.nodesTitle} empty={center?.nodes.length === 0} emptyLabel={labels.emptySection}>
        {center?.nodes.map((node) => (
          <li key={node.node_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{node.label}</p>
            <p className="mt-1 text-xs text-gray-500">{labels.nodeTypes[node.node_type] ?? node.node_type}</p>
            <p className="mt-1 text-gray-700">{node.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.visualizationsTitle} empty={center?.visualizations.length === 0} emptyLabel={labels.emptySection}>
        {center?.visualizations.map((viz) => (
          <li key={viz.visualization_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{viz.title}</p>
            <p className="mt-1 text-xs text-gray-500">{labels.vizTypes[viz.viz_type] ?? viz.viz_type}</p>
            <p className="mt-1 text-gray-700">{viz.description}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.impactTitle} empty={center?.impact_scenarios.length === 0} emptyLabel={labels.emptySection}>
        {center?.impact_scenarios.map((sc) => (
          <li key={sc.scenario_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="font-medium text-gray-900">{sc.question}</p>
            <p className="mt-2 text-gray-700">{sc.impact_summary}</p>
            <p className="mt-1 text-xs text-gray-500">{sc.confidence} · {sc.affected_areas.join(", ")}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="font-medium text-gray-900">{snap.label}</p>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.comparisonsTitle} empty={center?.comparisons.length === 0} emptyLabel={labels.emptySection}>
        {center?.comparisons.map((cmp) => (
          <li key={cmp.comparison_key} className="rounded-xl border border-teal-100 bg-teal-50/20 p-3 text-sm">
            <p className="text-xs text-gray-500">{cmp.before_label} → {cmp.after_label}</p>
            <p className="mt-1 text-gray-800">{cmp.finding}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.complexity} value={center.executive_view.complexity_indicator} />
            <ExecField label={labels.executiveFields.risks} value={center.executive_view.dependency_risks} />
            <ExecField label={labels.executiveFields.maturity} value={center.executive_view.workflow_maturity} />
            <ExecField label={labels.executiveFields.opportunities} value={center.executive_view.structural_opportunities} />
            <ExecField label={labels.executiveFields.priorities} value={center.executive_view.executive_priorities} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.reviewsTitle} empty={center?.governance_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.governance_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="font-medium text-gray-900">{rev.review_type}</p>
            <p className="mt-1 text-gray-700">{rev.prompt}</p>
            {rev.status !== "completed" && center?.can_manage && (
              <ActionBtn label={labels.completeReview} className="mt-3" onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
            )}
          </li>
        ))}
      </Section>

      {center?.privacy_note && <p className="text-xs text-gray-500">{labels.privacyNote}: {center.privacy_note}</p>}
    </div>
  );
}

function Section({ title, empty, emptyLabel, children }: { title: string; empty?: boolean; emptyLabel: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {empty ? <p className="mt-4 text-sm text-gray-500">{emptyLabel}</p> : <ul className="mt-4 space-y-3">{children}</ul>}
    </section>
  );
}

function InsightSection({ title, items, canManage, dismissLabel, onDismiss }: { title: string; items: { insight_key: string; message: string }[]; canManage: boolean; dismissLabel: string; onDismiss: (key: string) => void }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((ins) => (
          <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
            <p className="text-gray-800">{ins.message}</p>
            {canManage && <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => onDismiss(ins.insight_key)}>{dismissLabel}</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecommendationSection({ title, items, canManage, acceptLabel, dismissLabel, onAccept, onDismiss }: { title: string; items: { recommendation_key: string; message: string }[]; canManage: boolean; acceptLabel: string; dismissLabel: string; onAccept: (key: string) => void; onDismiss: (key: string) => void }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((rec) => (
          <li key={rec.recommendation_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-gray-800">{rec.message}</p>
            {canManage && (
              <div className="mt-2 flex gap-2">
                <ActionBtn label={acceptLabel} onClick={() => onAccept(rec.recommendation_key)} />
                <ActionBtn label={dismissLabel} variant="muted" onClick={() => onDismiss(rec.recommendation_key)} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExecField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-gray-800">{value}</dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ActionBtn({ label, onClick, variant = "primary", className = "" }: { label: string; onClick: () => void; variant?: "primary" | "muted"; className?: string }) {
  const styles = variant === "primary"
    ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
    : "rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50";
  return <button type="button" className={`${styles} ${className}`} onClick={onClick}>{label}</button>;
}
