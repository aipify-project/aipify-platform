"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OSC_CORE_PRINCIPLE,
  OSC_PHILOSOPHY,
  OSC_VISION,
  parseOrganizationalStewardshipCenter,
  type OrganizationalStewardshipCenter,
} from "@/lib/organizational-stewardship-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  organizationalLegacyLink: string;
  organizationalMemoryLink: string;
  knowledgeEvolutionLink: string;
  organizationalWisdomLink: string;
  capabilityMaturityLink: string;
  dashboardTitle: string;
  indicatorsTitle: string;
  reflectionsTitle: string;
  reviewsTitle: string;
  highlightsTitle: string;
  milestonesTitle: string;
  snapshotsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  sessionsTitle: string;
  successionTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  completeReview: string;
  completeSession: string;
  scheduleReflection: string;
  generateReport: string;
  printSummary: string;
  exportSnapshot: string;
  coordinateSuccession: string;
  archiveMilestone: string;
  humansDecide: string;
  privacyNote: string;
  stewardshipScore: string;
  domains: Record<string, string>;
  healthLabels: Record<string, string>;
  reviewTypes: Record<string, string>;
  sessionTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  exceptional: "border-emerald-200 bg-emerald-50",
  strong: "border-teal-200 bg-teal-50",
  developing: "border-slate-200 bg-slate-50",
  needs_attention: "border-amber-200 bg-amber-50",
  reactive: "border-rose-200 bg-rose-50",
};

export function OrganizationalStewardshipCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalStewardshipCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-stewardship/center");
    if (res.ok) setCenter(parseOrganizationalStewardshipCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-stewardship/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.stewardship_health_label ?? "developing"] ?? HEALTH_STYLES.developing;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.organizational_legacy && <Link href={center.links.organizational_legacy} className="text-slate-600 hover:underline">{labels.organizationalLegacyLink}</Link>}
        {center?.links?.organizational_memory && <Link href={center.links.organizational_memory} className="text-slate-600 hover:underline">{labels.organizationalMemoryLink}</Link>}
        {center?.links?.knowledge_evolution && <Link href={center.links.knowledge_evolution} className="text-slate-600 hover:underline">{labels.knowledgeEvolutionLink}</Link>}
        {center?.links?.organizational_wisdom && <Link href={center.links.organizational_wisdom} className="text-slate-600 hover:underline">{labels.organizationalWisdomLink}</Link>}
        {center?.links?.capability_maturity && <Link href={center.links.capability_maturity} className="text-slate-600 hover:underline">{labels.capabilityMaturityLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OSC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OSC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OSC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.stewardship_health_label] ?? dash.stewardship_health_label} · {labels.stewardshipScore}: {dash.stewardship_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.leadership} value={`${dash.leadership_participation_pct}%`} />
            <Metric label={labels.metrics.resources} value={`${dash.resource_stewardship_pct}%`} />
            <Metric label={labels.metrics.knowledge} value={`${dash.knowledge_continuity_pct}%`} />
            <Metric label={labels.metrics.governance} value={`${dash.governance_participation_pct}%`} />
            <Metric label={labels.metrics.reflection} value={`${dash.reflection_frequency_pct}%`} />
            <Metric label={labels.metrics.sustainable} value={`${dash.sustainable_decisions_pct}%`} />
            <Metric label={labels.metrics.succession} value={`${dash.succession_preparedness_pct}%`} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateReport} onClick={() => void postAction({ action: "generate_stewardship_report" })} />
              <ActionBtn label={labels.printSummary} variant="muted" onClick={() => void postAction({ action: "print_executive_summary" })} />
              <ActionBtn label={labels.exportSnapshot} variant="muted" onClick={() => void postAction({ action: "export_stewardship_snapshot", period_label: "Current period" })} />
              <ActionBtn label={labels.coordinateSuccession} variant="muted" onClick={() => void postAction({ action: "coordinate_succession_discussion" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.indicatorsTitle} empty={center?.stewardship_indicators.length === 0} emptyLabel={labels.emptySection}>
        {center?.stewardship_indicators.map((item) => (
          <li key={item.indicator_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs text-gray-500">{labels.domains[item.domain] ?? item.domain}</p>
              <span className="text-xs font-medium text-indigo-700">{item.indicator_score}%</span>
            </div>
            <p className="mt-1 font-medium text-gray-900">{item.title}</p>
            <p className="mt-2 text-gray-700">{item.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.reflectionsTitle} empty={center?.reflection_prompts.length === 0} emptyLabel={labels.emptySection}>
        {center?.reflection_prompts.map((ref) => (
          <li key={ref.reflection_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[ref.domain] ?? ref.domain}</p>
            <p className="mt-1 text-gray-800">{ref.prompt}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.reviewsTitle} empty={center?.stewardship_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.stewardship_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
            <p className="mt-1 text-gray-700">{rev.prompt}</p>
            {rev.status !== "completed" && center?.can_manage && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.completeReview} onClick={() => void postAction({ action: "complete_review", review_key: rev.review_key })} />
                <ActionBtn label={labels.scheduleReflection} variant="muted" onClick={() => void postAction({ action: "schedule_leadership_reflection", review_key: rev.review_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.highlightsTitle} empty={center?.impact_highlights.length === 0} emptyLabel={labels.emptySection}>
        {center?.impact_highlights.map((hl) => (
          <li key={hl.highlight_key} className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[hl.domain] ?? hl.domain}</p>
            <p className="mt-1 font-medium text-gray-900">{hl.title}</p>
            <p className="mt-1 text-gray-700">{hl.summary}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.milestonesTitle} empty={center?.stewardship_milestones.length === 0} emptyLabel={labels.emptySection}>
        {center?.stewardship_milestones.map((ms) => (
          <li key={ms.milestone_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[ms.domain] ?? ms.domain}</p>
            <p className="mt-1 font-medium text-gray-900">{ms.title}</p>
            <p className="mt-1 text-gray-700">{ms.summary}</p>
          </li>
        ))}
        {center?.can_manage && (
          <li className="pt-2">
            <ActionBtn label={labels.archiveMilestone} onClick={() => void postAction({ action: "archive_stewardship_milestone", title: "Stewardship milestone", summary: "Milestone archived via Stewardship Center." })} />
          </li>
        )}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-gray-900">{snap.period_label}</p>
              <span className="text-xs text-indigo-700">{labels.stewardshipScore}: {snap.stewardship_score}</span>
            </div>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.continuity} value={center.executive_view.leadership_continuity} />
            <ExecField label={labels.executiveFields.readiness} value={center.executive_view.long_term_readiness} />
            <ExecField label={labels.executiveFields.responsibility} value={center.executive_view.responsibility_measures} />
            <ExecField label={labels.executiveFields.opportunities} value={center.executive_view.stewardship_opportunities} />
          </dl>
        </section>
      )}

      <Section title={labels.successionTitle} empty={center?.succession_integration.length === 0} emptyLabel={labels.emptySection}>
        {center?.succession_integration.map((link) => (
          <li key={link.key} className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3 text-sm">
            <Link href={link.route} className="font-medium text-indigo-700 hover:underline">{link.label}</Link>
          </li>
        ))}
      </Section>

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.sessionsTitle} empty={center?.stewardship_sessions.length === 0} emptyLabel={labels.emptySection}>
        {center?.stewardship_sessions.map((sess) => (
          <li key={sess.session_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.sessionTypes[sess.session_type] ?? sess.session_type}</p>
            <p className="mt-1 text-gray-700">{sess.prompt}</p>
            {sess.status !== "completed" && center?.can_manage && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionBtn label={labels.completeSession} onClick={() => void postAction({ action: "complete_session", session_key: sess.session_key })} />
                <ActionBtn label={labels.scheduleReflection} variant="muted" onClick={() => void postAction({ action: "schedule_leadership_reflection", session_key: sess.session_key })} />
              </div>
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
