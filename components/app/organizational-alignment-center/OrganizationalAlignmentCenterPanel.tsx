"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  OAC_CORE_PRINCIPLE,
  OAC_PHILOSOPHY,
  OAC_VISION,
  parseOrganizationalAlignmentCenter,
  type OrganizationalAlignmentCenter,
} from "@/lib/organizational-alignment-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  executionExcellenceLink: string;
  capabilityMaturityLink: string;
  changeManagementLink: string;
  organizationalHealthLink: string;
  purposeValuesLink: string;
  dashboardTitle: string;
  indicatorsTitle: string;
  prioritiesTitle: string;
  misalignmentsTitle: string;
  timelineTitle: string;
  snapshotsTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  reviewsTitle: string;
  emptySection: string;
  dismiss: string;
  accept: string;
  completeReview: string;
  discussMisalignment: string;
  scheduleWorkshop: string;
  generateSummary: string;
  generateReport: string;
  exportSnapshot: string;
  humansDecide: string;
  privacyNote: string;
  owner: string;
  alignmentScore: string;
  domains: Record<string, string>;
  healthLabels: Record<string, string>;
  misalignmentTypes: Record<string, string>;
  timelineTypes: Record<string, string>;
  reviewTypes: Record<string, string>;
  metrics: Record<string, string>;
  executiveFields: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  exceptional: "border-emerald-200 bg-emerald-50",
  strong: "border-teal-200 bg-teal-50",
  stable: "border-slate-200 bg-slate-50",
  needs_attention: "border-amber-200 bg-amber-50",
  misaligned: "border-rose-200 bg-rose-50",
};

export function OrganizationalAlignmentCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalAlignmentCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-alignment/center");
    if (res.ok) setCenter(parseOrganizationalAlignmentCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-alignment/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;
  const healthStyle = HEALTH_STYLES[dash?.alignment_health_label ?? "stable"] ?? HEALTH_STYLES.stable;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && <Link href={center.links.executive} className="text-slate-600 hover:underline">{labels.executiveLink}</Link>}
        {center?.links?.execution_excellence && <Link href={center.links.execution_excellence} className="text-slate-600 hover:underline">{labels.executionExcellenceLink}</Link>}
        {center?.links?.capability_maturity && <Link href={center.links.capability_maturity} className="text-slate-600 hover:underline">{labels.capabilityMaturityLink}</Link>}
        {center?.links?.change_management && <Link href={center.links.change_management} className="text-slate-600 hover:underline">{labels.changeManagementLink}</Link>}
        {center?.links?.organizational_health && <Link href={center.links.organizational_health} className="text-slate-600 hover:underline">{labels.organizationalHealthLink}</Link>}
        {center?.links?.purpose_values && <Link href={center.links.purpose_values} className="text-slate-600 hover:underline">{labels.purposeValuesLink}</Link>}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{labels.corePrinciple}: {OAC_CORE_PRINCIPLE}</p>
        <p className="mt-2 text-sm text-gray-600">{labels.philosophyTitle}: {OAC_PHILOSOPHY}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.visionTitle}: {OAC_VISION}</p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className={`rounded-2xl border p-5 shadow-sm ${healthStyle}`}>
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.healthLabels[dash.alignment_health_label] ?? dash.alignment_health_label} · {dash.alignment_score}/100
          </p>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.strongAlignment} value={dash.strong_alignment_count} />
            <Metric label={labels.metrics.opportunities} value={dash.alignment_opportunities} />
            <Metric label={labels.metrics.misalignments} value={dash.misalignment_open} />
            <Metric label={labels.metrics.crossFunctional} value={`${dash.cross_functional_trend_pct}%`} />
            <Metric label={labels.metrics.goalConsistency} value={`${dash.goal_consistency_pct}%`} />
            <Metric label={labels.metrics.initiativeOverlap} value={dash.initiative_overlap_count} />
            <Metric label={labels.metrics.confidence} value={`${dash.leadership_confidence}/5`} />
          </dl>
          {center?.can_manage && (
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionBtn label={labels.generateSummary} onClick={() => void postAction({ action: "generate_alignment_summary" })} />
              <ActionBtn label={labels.generateReport} variant="muted" onClick={() => void postAction({ action: "generate_executive_report" })} />
              <ActionBtn label={labels.scheduleWorkshop} variant="muted" onClick={() => void postAction({ action: "schedule_workshop" })} />
              <ActionBtn label={labels.exportSnapshot} variant="muted" onClick={() => void postAction({ action: "export_department_snapshot", department_label: "Organization" })} />
            </div>
          )}
        </section>
      )}

      <Section title={labels.indicatorsTitle} empty={center?.indicators.length === 0} emptyLabel={labels.emptySection}>
        {center?.indicators.map((ind) => (
          <li key={ind.indicator_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.domains[ind.domain] ?? ind.domain}</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-gray-900">{ind.label}</p>
              <span className="text-xs text-gray-600">{ind.value_label} · {ind.trend}</span>
            </div>
          </li>
        ))}
      </Section>

      <Section title={labels.prioritiesTitle} empty={center?.priorities.length === 0} emptyLabel={labels.emptySection}>
        {center?.priorities.map((pri) => (
          <li key={pri.priority_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{labels.domains[pri.domain] ?? pri.domain}</p>
                <p className="font-medium text-gray-900">{pri.title}</p>
              </div>
              <span className="text-xs font-medium text-indigo-700">{labels.alignmentScore}: {pri.alignment_score}</span>
            </div>
            <p className="mt-2 text-gray-700">{pri.summary}</p>
            <p className="mt-2 text-xs text-gray-500">{labels.owner}: {pri.owner_label}</p>
          </li>
        ))}
      </Section>

      <Section title={labels.misalignmentsTitle} empty={center?.misalignments.length === 0} emptyLabel={labels.emptySection}>
        {center?.misalignments.map((mis) => (
          <li key={mis.misalignment_key} className="rounded-xl border border-amber-100 bg-amber-50/30 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.misalignmentTypes[mis.misalignment_type] ?? mis.misalignment_type}</p>
            <p className="mt-1 text-gray-800">{mis.message}</p>
            {center?.can_manage && (
              <div className="mt-2 flex gap-2">
                <ActionBtn label={labels.discussMisalignment} onClick={() => void postAction({ action: "discuss_misalignment", misalignment_key: mis.misalignment_key })} />
                <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_misalignment", misalignment_key: mis.misalignment_key })} />
              </div>
            )}
          </li>
        ))}
      </Section>

      <Section title={labels.timelineTitle} empty={center?.timeline.length === 0} emptyLabel={labels.emptySection}>
        {center?.timeline.map((evt) => (
          <li key={evt.timeline_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <p className="text-xs text-gray-500">{labels.timelineTypes[evt.event_type] ?? evt.event_type}</p>
            <p className="mt-1 font-medium text-gray-900">{evt.label}</p>
            {evt.summary && <p className="mt-1 text-gray-700">{evt.summary}</p>}
          </li>
        ))}
      </Section>

      <Section title={labels.snapshotsTitle} empty={center?.snapshots.length === 0} emptyLabel={labels.emptySection}>
        {center?.snapshots.map((snap) => (
          <li key={snap.snapshot_key} className="rounded-xl border border-gray-100 p-3 text-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium text-gray-900">{snap.department_label}</p>
              <span className="text-xs text-indigo-700">{labels.alignmentScore}: {snap.alignment_score}</span>
            </div>
            <p className="mt-1 text-gray-700">{snap.summary}</p>
          </li>
        ))}
      </Section>

      {center?.executive_view && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ExecField label={labels.executiveFields.vision} value={center.executive_view.vision_clarity} />
            <ExecField label={labels.executiveFields.strategic} value={center.executive_view.strategic_consistency} />
            <ExecField label={labels.executiveFields.collaboration} value={center.executive_view.collaboration_trends} />
            <ExecField label={labels.executiveFields.focus} value={center.executive_view.focus_areas} />
          </dl>
        </section>
      )}

      <InsightSection title={labels.insightsTitle} items={center?.insights ?? []} canManage={center?.can_manage ?? false} dismissLabel={labels.dismiss} onDismiss={(key) => void postAction({ action: "dismiss_insight", insight_key: key })} />
      <RecommendationSection title={labels.recommendationsTitle} items={center?.recommendations ?? []} canManage={center?.can_manage ?? false} acceptLabel={labels.accept} dismissLabel={labels.dismiss} onAccept={(key) => void postAction({ action: "accept_recommendation", recommendation_key: key })} onDismiss={(key) => void postAction({ action: "dismiss_recommendation", recommendation_key: key })} />

      <Section title={labels.reviewsTitle} empty={center?.alignment_reviews.length === 0} emptyLabel={labels.emptySection}>
        {center?.alignment_reviews.map((rev) => (
          <li key={rev.review_key} className="rounded-xl border border-gray-100 p-4 text-sm">
            <p className="text-xs text-gray-500">{labels.reviewTypes[rev.review_type] ?? rev.review_type}</p>
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
