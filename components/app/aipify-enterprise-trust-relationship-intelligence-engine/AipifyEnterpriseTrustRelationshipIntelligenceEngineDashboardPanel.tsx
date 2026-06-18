"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAipifyEnterpriseTrustRelationshipIntelligenceEngineDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ExecutiveReview,
  type AipifyEnterpriseTrustRelationshipIntelligenceEngineDashboard,
  type IntegrationLink,
  type ReflectionEntry,
  type ScaffoldNote,
} from "@/lib/aipify/aipify-enterprise-trust-relationship-intelligence-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-indigo-900">{objective.description}</p>
      ) : null}
    </div>
  );
}

function SuccessCriterionRow({ criterion, metLabel, pendingLabel }: {
  criterion: AbosSuccessCriterion; metLabel: string; pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
    </div>
  );
}

function MetaListSection({ title, meta, itemsKey }: {
  title: string; meta?: Record<string, unknown>; itemsKey: string;
}) {
  const items = Array.isArray(meta?.[itemsKey])
    ? (meta[itemsKey] as Array<Record<string, unknown>>)
    : [];
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? (
        <p className="text-sm text-gray-600">{meta.principle}</p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
            <span className="font-medium text-gray-900">{String(item.label ?? item.key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewRow({ review }: { review: ExecutiveReview }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{review.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">{review.status}</span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{review.summary}</p>
    </div>
  );
}

function ReflectionRow({ reflection }: { reflection: ReflectionEntry }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <span className="font-medium text-gray-900">{reflection.title}</span>
      <p className="mt-1 text-xs text-gray-600">{reflection.reflection_summary}</p>
    </div>
  );
}

function ScaffoldRow({ note }: { note: ScaffoldNote }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/20 px-3 py-2 text-sm">
      <span className="font-medium text-indigo-900">{note.title}</span>
      <p className="mt-1 text-xs text-indigo-800">{note.summary}</p>
    </div>
  );
}

export function AipifyEnterpriseTrustRelationshipIntelligenceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyEnterpriseTrustRelationshipIntelligenceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/aipify-enterprise-trust-relationship-intelligence-engine/dashboard");
    if (res.ok) setDashboard(parseAipifyEnterpriseTrustRelationshipIntelligenceEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks = dashboard.aetriebp262_integration_links?.length
    ? dashboard.aetriebp262_integration_links
    : dashboard.integration_links;
  const eraOpener = dashboard.aetriebp262_era_opener_summary?.length
    ? dashboard.aetriebp262_era_opener_summary
    : dashboard.era_opener_summary ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-indigo-900">{dashboard.aipify_enterprise_trust_relationship_intelligence_score ?? 0}</p>
        <p className="text-xs text-indigo-700">{labels.scoreLabel}</p>
        {dashboard.aipify_enterprise_trust_relationship_intelligence_mission ? <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.aipify_enterprise_trust_relationship_intelligence_mission}</p> : null}
        {dashboard.philosophy ? <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p> : null}
        {dashboard.distinction_note ? <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p> : null}
        {dashboard.aipify_enterprise_trust_relationship_intelligence_vision ? <p className="mt-2 text-xs italic text-indigo-800">{dashboard.aipify_enterprise_trust_relationship_intelligence_vision}</p> : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div><span className="font-medium">{labels.modeLabel}:</span> {dashboard.enterprise_trust_relationship_intelligence_mode}</div>
          <div><span className="font-medium">{labels.readinessLabel}:</span> {dashboard.enterprise_trust_relationship_intelligence_maturity_level ?? 1}</div>
          <div><span className="font-medium">{labels.executiveReviews}:</span> {dashboard.executive_reviews_count ?? 0}</div>
          <div><span className="font-medium">{labels.activeReflections}:</span> {dashboard.active_reflections_count ?? 0}</div>
        </div>
        {dashboard.safety_note ? <p className="mt-3 text-xs text-indigo-800">{dashboard.safety_note}</p> : null}
        {dashboard.human_oversight_required ? <p className="mt-2 text-xs font-medium text-indigo-800">{labels.humanOversightRequired}</p> : null}
      </section>

      {eraOpener.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.eraOpenerSummary}</h2>
          <p className="text-sm text-gray-600">{labels.eraOpenerNote}</p>
          <ul className="space-y-2 text-sm">
            {eraOpener.map((link: IntegrationLink) => (
              <li key={link.key ?? link.label} className="rounded border border-indigo-100 px-3 py-2">
                {link.route ? <Link href={link.route} className="font-medium text-indigo-800 hover:underline">{link.label}</Link> : <span className="font-medium">{link.label}</span>}
                {link.description ? <p className="mt-1 text-xs text-gray-500">{link.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <MetaListSection title={labels.centerLabel} meta={dashboard.center_meta} itemsKey="capabilities" />
      <MetaListSection title={labels.engineLabel} meta={dashboard.engine_meta} itemsKey="reflection_questions" />
      <MetaListSection title={labels.frameworkLabel} meta={dashboard.framework_meta} itemsKey="domains" />
      <MetaListSection title={labels.reviewsLabel} meta={dashboard.executive_reviews_meta} itemsKey="review_themes" />
      <MetaListSection title={labels.companionLabel} meta={dashboard.companion_meta} itemsKey="capabilities" />
      <MetaListSection title={labels.subEngineLabel} meta={dashboard.sub_engine_meta} itemsKey="practices" />

      {dashboard.reflections.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.reflections}</h2>
          <div className="space-y-2">{dashboard.reflections.map((r) => <ReflectionRow key={r.id} reflection={r} />)}</div>
        </section>
      ) : null}

      {dashboard.executive_reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveReviewEntries}</h2>
          <div className="space-y-2">{dashboard.executive_reviews.map((r) => <ReviewRow key={r.id} review={r} />)}</div>
        </section>
      ) : null}

      {dashboard.scaffold_notes.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.scaffoldNotes}</h2>
          <div className="space-y-2">{dashboard.scaffold_notes.map((n) => <ScaffoldRow key={n.id} note={n} />)}</div>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.crossLinks}</h2>
          <ul className="space-y-2 text-sm">
            {integrationLinks.map((link: IntegrationLink) => (
              <li key={link.key ?? link.label} className="rounded border border-gray-100 px-3 py-2">
                {link.route ? <Link href={link.route} className="font-medium text-indigo-800 hover:underline">{link.label}</Link> : <span className="font-medium">{link.label}</span>}
                {link.relationship ? <p className="mt-1 text-xs text-gray-500">{link.relationship}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.aipify_enterprise_trust_relationship_intelligence_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.aipify_enterprise_trust_relationship_intelligence_objectives.map((o) => <ObjectiveCard key={o.key ?? o.label} objective={o} />)}
          </div>
        </section>
      ) : null}

      {dashboard.companion_limitations_meta?.must_avoid?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionLimitations}</h2>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {dashboard.companion_limitations_meta.must_avoid.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ) : null}

      {dashboard.aipify_enterprise_trust_relationship_intelligence_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.aipify_enterprise_trust_relationship_intelligence_success_criteria.map((c) => (
            <SuccessCriterionRow key={c.key ?? c.label} criterion={c} metLabel={labels.criterionMet} pendingLabel={labels.criterionPending} />
          ))}
        </section>
      ) : null}

      {dashboard.aipify_enterprise_trust_relationship_intelligence_privacy_note ? <p className="text-xs text-gray-500">{dashboard.aipify_enterprise_trust_relationship_intelligence_privacy_note}</p> : null}
    </div>
  );
}
