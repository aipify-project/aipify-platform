"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseProactiveOrganizationDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type EarlySignal,
  type IntegrationLink,
  type ProactiveOrganizationDashboard,
  type ProactiveRecommendation,
  type PulseSnapshot,
  type SupportOpportunity,
} from "@/lib/aipify/proactive-organization-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-violet-900">{objective.description}</p> : null}
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

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "open":
    case "improving":
    case "strong":
    case "acknowledged":
    case "on_track":
      return "bg-emerald-100 text-emerald-800";
    case "moderate":
    case "monitoring":
    case "pending":
    case "in_progress":
    case "stable":
      return "bg-amber-100 text-amber-800";
    case "important":
    case "critical":
    case "high":
    case "urgent":
    case "declining":
    case "needs_attention":
    case "volatile":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function SignalRow({ signal }: { signal: EarlySignal }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{signal.title}</span>
        <div className="flex flex-wrap gap-2">
          {signal.severity ? (
            <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(signal.severity)}`}>{signal.severity}</span>
          ) : null}
          {signal.trend_direction ? (
            <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(signal.trend_direction)}`}>
              {signal.trend_direction}
            </span>
          ) : null}
        </div>
      </div>
      <p className="mt-1 text-xs capitalize text-gray-500">{signal.signal_type?.replace(/_/g, " ")}</p>
      <p className="mt-1 text-xs text-gray-600">{signal.summary}</p>
    </li>
  );
}

function OpportunityRow({ opportunity }: { opportunity: SupportOpportunity }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{opportunity.title}</span>
        {opportunity.priority ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(opportunity.priority)}`}>
            {opportunity.priority}
          </span>
        ) : null}
      </div>
      {opportunity.target_audience ? (
        <p className="mt-1 text-xs text-gray-500">{opportunity.target_audience}</p>
      ) : null}
      <p className="mt-1 text-xs text-gray-600">{opportunity.summary}</p>
    </li>
  );
}

function PulseRow({ snapshot }: { snapshot: PulseSnapshot }) {
  return (
    <li className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize">{snapshot.pulse_dimension?.replace(/_/g, " ")}</span>
        {snapshot.signal_strength ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(snapshot.signal_strength)}`}>
            {snapshot.signal_strength.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-gray-600">{snapshot.summary}</p>
    </li>
  );
}

function RecommendationRow({ recommendation }: { recommendation: ProactiveRecommendation }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{recommendation.title}</span>
        <div className="flex flex-wrap gap-2">
          {recommendation.status ? (
            <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(recommendation.status)}`}>
              {recommendation.status}
            </span>
          ) : null}
        </div>
      </div>
      <p className="mt-1 text-xs capitalize text-gray-500">
        {recommendation.recommendation_type?.replace(/_/g, " ")}
      </p>
      <p className="mt-1 text-xs text-gray-600">{recommendation.summary}</p>
    </li>
  );
}

function MetaGrid({ items, title }: { items: Record<string, unknown>[]; title: string }) {
  if (!items.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={String(item.key)} className="rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm">
            <span className="font-medium text-violet-900">{String(item.label ?? item.key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CrossLinkGrid({ links, title }: { links: IntegrationLink[]; title: string }) {
  if (!links.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.key ?? link.route}
            href={link.route ?? "#"}
            className="rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm hover:border-violet-300"
          >
            <span className="font-medium text-violet-900">{link.label}</span>
            {link.note ? <p className="mt-1 text-xs text-gray-500">{link.note}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProactiveOrganizationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ProactiveOrganizationDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/aipify/proactive-organization-engine/dashboard");
      if (!res.ok) throw new Error(await res.text());
      const data = parseProactiveOrganizationDashboard(await res.json());
      setDashboard(data);
    } catch {
      setError(labels.loading);
    } finally {
      setLoading(false);
    }
  }, [labels.loading]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (error || !dashboard?.has_customer) {
    return <p className="text-sm text-rose-600">{error ?? labels.loading}</p>;
  }

  const companionExamples = dashboard.proactive_companion?.examples ?? [];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-700">{labels.blueprintTitle}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-800">{labels.proactiveScore}</p>
            <p className="text-3xl font-bold text-violet-900">{dashboard.proactive_score ?? 0}</p>
            {dashboard.human_governance_required ? (
              <p className="mt-2 text-xs text-violet-600">{labels.humanGovernanceRequired}</p>
            ) : null}
            {dashboard.care_not_surveillance_mode ? (
              <p className="mt-1 text-xs text-violet-600">{labels.careNotSurveillance}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.signalsActive}</span>
            <p className="text-xl font-semibold">{dashboard.signals_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.supportOpportunitiesOpen}</span>
            <p className="text-xl font-semibold">{dashboard.support_opportunities_open ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.recommendationsPending}</span>
            <p className="text-xl font-semibold">{dashboard.recommendations_pending ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.pulseIndicators}</span>
            <p className="text-xl font-semibold">{dashboard.pulse_indicators ?? 0}</p>
          </div>
        </div>
        {dashboard.safety_note ? (
          <p className="mt-4 text-xs italic text-violet-700">{dashboard.safety_note}</p>
        ) : null}
      </div>

      {dashboard.philosophy ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{labels.philosophy}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.philosophy}</p>
        </section>
      ) : null}

      {dashboard.distinction_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 px-4 py-3">
          <h3 className="text-sm font-semibold text-amber-900">{labels.distinctionNote}</h3>
          <p className="mt-2 text-xs text-amber-900">{dashboard.distinction_note}</p>
        </section>
      ) : null}

      <MetaGrid items={dashboard.proactive_organization_center} title={labels.proactiveCenter} />

      {dashboard.proactive_organization_objectives?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.proactive_organization_objectives.map((obj) => (
              <ObjectiveCard key={obj.key} objective={obj} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.early_signals.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.earlySignals}</h3>
          <ul className="space-y-2">{dashboard.early_signals.map((s) => <SignalRow key={s.id} signal={s} />)}</ul>
        </section>
      ) : null}

      {dashboard.support_opportunities.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.supportOpportunities}</h3>
          <ul className="space-y-2">
            {dashboard.support_opportunities.map((o) => (
              <OpportunityRow key={o.id} opportunity={o} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.pulse_snapshots.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.orgPulse}</h3>
          <ul className="space-y-2">
            {dashboard.pulse_snapshots.map((p) => (
              <PulseRow key={p.id} snapshot={p} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recommendations.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.preventativeRecommendations}</h3>
          <ul className="space-y-2">
            {dashboard.recommendations.map((r) => (
              <RecommendationRow key={r.id} recommendation={r} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaGrid items={dashboard.preventative_support_engine} title={labels.preventativeSupport} />
      <MetaGrid items={dashboard.executive_anticipation_dashboard} title={labels.executiveAnticipation} />
      <MetaGrid items={dashboard.proactive_knowledge_delivery} title={labels.proactiveKnowledge} />

      {companionExamples.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.proactiveCompanion}</h3>
          <div className="space-y-2">
            {companionExamples.map((ex) => (
              <div key={ex.prompt} className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
                <p className="font-medium text-violet-900">
                  {ex.emoji ? `${ex.emoji} ` : ""}
                  {ex.prompt}
                </p>
                {ex.consideration ? <p className="mt-1 text-xs text-gray-600">{ex.consideration}</p> : null}
              </div>
            ))}
          </div>
          <Link
            href="/app/proactive-companion-engine"
            className="mt-3 inline-block text-xs font-medium text-violet-700 hover:underline"
          >
            {labels.proactiveCompanionLink} →
          </Link>
        </section>
      ) : null}

      <MetaGrid items={dashboard.companion_limitations} title={labels.companionLimitations} />
      <MetaGrid items={dashboard.self_love_connection} title={labels.selfLoveConnection} />
      <MetaGrid items={dashboard.security_requirements} title={labels.securityRequirements} />
      <CrossLinkGrid links={dashboard.integration_links} title={labels.crossLinks} />

      {dashboard.proactive_organization_privacy_note ? (
        <section className="rounded-lg border border-green-100 bg-green-50/40 px-4 py-3">
          <h3 className="text-sm font-semibold text-green-900">{labels.privacyNote}</h3>
          <p className="mt-2 text-xs text-green-900">{dashboard.proactive_organization_privacy_note}</p>
        </section>
      ) : null}

      {dashboard.proactive_organization_success_criteria?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="space-y-2">
            {dashboard.proactive_organization_success_criteria.map((c) => (
              <SuccessCriterionRow
                key={c.key}
                criterion={c}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
