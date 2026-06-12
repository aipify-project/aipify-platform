"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalSensemakingDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type ExecutiveSensemakingReview,
  type IntegrationLink,
  type KnowledgeSynthesis,
  type OrganizationalSensemakingDashboard,
  type SensemakingSignal,
} from "@/lib/aipify/organizational-sensemaking-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-sky-900">{objective.description}</p>
      ) : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: AbosSuccessCriterion;
  metLabel: string;
  pendingLabel: string;
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

function MetaListSection({
  title,
  meta,
  itemsKey,
}: {
  title: string;
  meta?: Record<string, unknown>;
  itemsKey: string;
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
          <div
            key={String(item.key ?? item.label)}
            className="rounded-lg border border-gray-100 px-3 py-2 text-sm"
          >
            <span className="font-medium text-gray-900">{String(item.label ?? item.key)}</span>
            {typeof item.cross_link === "string" ? (
              <Link href={item.cross_link} className="mt-1 block text-xs text-sky-700 hover:underline">
                {item.cross_link}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function SignalRow({ signal }: { signal: SensemakingSignal }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sky-900">{signal.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {signal.signal_strength}
        </span>
      </div>
      <p className="mt-1 text-xs text-sky-800">{signal.theme_summary}</p>
      <p className="mt-1 text-xs text-gray-500">{signal.signal_type?.replace(/_/g, " ")}</p>
    </div>
  );
}

function SynthesisRow({ synthesis }: { synthesis: KnowledgeSynthesis }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{synthesis.title}</span>
        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          {synthesis.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{synthesis.summary}</p>
    </div>
  );
}

function ReviewRow({ review }: { review: ExecutiveSensemakingReview }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="font-medium text-sky-900">{review.title}</div>
      <p className="mt-1 text-xs text-sky-800">{review.reflection_summary}</p>
    </div>
  );
}

export function OrganizationalSensemakingEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalSensemakingDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/organizational-sensemaking-engine/dashboard");
    if (res.ok) {
      setDashboard(parseOrganizationalSensemakingDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks =
    dashboard.ocsmebp158_integration_links?.length
      ? dashboard.ocsmebp158_integration_links
      : dashboard.integration_links;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-2xl font-bold text-sky-900">{dashboard.sensemaking_score ?? 0}</p>
        <p className="text-xs text-sky-700">{labels.sensemakingScore}</p>
        {dashboard.organizational_sensemaking_mission ? (
          <p className="mt-2 text-sm font-medium text-sky-900">
            {dashboard.organizational_sensemaking_mission}
          </p>
        ) : null}
        {dashboard.philosophy ? (
          <p className="mt-2 text-sm text-sky-900">{dashboard.philosophy}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-sky-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.organizational_sensemaking_vision ? (
          <p className="mt-2 text-xs italic text-sky-800">{dashboard.organizational_sensemaking_vision}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-medium">{labels.sensemakingMode}:</span> {dashboard.sensemaking_mode}
          </div>
          <div>
            <span className="font-medium">{labels.signalsCount}:</span> {dashboard.signals_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.activeSignals}:</span>{" "}
            {dashboard.active_signals_count ?? 0}
          </div>
          <div>
            <span className="font-medium">{labels.synthesesCount}:</span>{" "}
            {dashboard.syntheses_count ?? 0}
          </div>
        </div>
        {!dashboard.enabled ? (
          <p className="mt-3 text-xs text-sky-800">{labels.enableRequired}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-sky-800">{dashboard.safety_note}</p>
        ) : null}
      </section>

      <MetaListSection
        title={labels.sensemakingCenter}
        meta={dashboard.sensemaking_center_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.collectiveIntelligence}
        meta={dashboard.collective_intelligence_engine_meta}
        itemsKey="domains"
      />

      <MetaListSection
        title={labels.organizationalSignals}
        meta={dashboard.organizational_signal_engine_meta}
        itemsKey="signal_types"
      />

      <MetaListSection
        title={labels.executiveSensemakingReviews}
        meta={dashboard.executive_sensemaking_reviews_meta}
        itemsKey="review_types"
      />

      <MetaListSection
        title={labels.sensemakingCompanion}
        meta={dashboard.sensemaking_companion_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.diversePerspectives}
        meta={dashboard.diverse_perspective_framework_meta}
        itemsKey="perspectives"
      />

      <MetaListSection
        title={labels.knowledgeSynthesis}
        meta={dashboard.knowledge_synthesis_engine_meta}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.organizationalAwareness}
        meta={dashboard.organizational_awareness_engine_meta}
        itemsKey="awareness_domains"
      />

      {dashboard.signals.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.signalSnapshots}</h2>
          <div className="space-y-2">
            {dashboard.signals.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.syntheses.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.knowledgeSyntheses}</h2>
          <div className="space-y-2">
            {dashboard.syntheses.map((synthesis) => (
              <SynthesisRow key={synthesis.id} synthesis={synthesis} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.reviews.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.executiveReviews}</h2>
          <div className="space-y-2">
            {dashboard.reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.crossLinks}</h2>
          <ul className="space-y-2 text-sm">
            {integrationLinks.map((link: IntegrationLink) => (
              <li key={link.key ?? link.label} className="rounded border border-gray-100 px-3 py-2">
                {link.route ? (
                  <Link href={link.route} className="font-medium text-sky-800 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.relationship ? (
                  <p className="mt-1 text-xs text-gray-500">{link.relationship}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.organizational_sensemaking_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.organizational_sensemaking_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_limitations_meta?.must_avoid?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionLimitations}</h2>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {dashboard.companion_limitations_meta.must_avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.organizational_sensemaking_success_criteria?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          {dashboard.organizational_sensemaking_success_criteria.map((criterion) => (
            <SuccessCriterionRow
              key={criterion.key ?? criterion.label}
              criterion={criterion}
              metLabel={labels.criterionMet}
              pendingLabel={labels.criterionPending}
            />
          ))}
        </section>
      ) : null}

      {dashboard.organizational_sensemaking_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.organizational_sensemaking_privacy_note}</p>
      ) : null}
    </div>
  );
}
