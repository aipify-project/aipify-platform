"use client";

import Link from "next/link";
import type {
  IntelligenceSuccessCriterion,
  IndustryInsightSector,
  OpportunityScoreItem,
  SalesExpertEngineDashboard,
} from "@/lib/aipify/sales-expert-operating-system";

type Props = {
  dashboard: SalesExpertEngineDashboard;
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-gray-100 p-3 text-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function SuccessCriteriaList({
  criteria,
  labels,
}: {
  criteria?: IntelligenceSuccessCriterion[];
  labels: Record<string, string>;
}) {
  if (!criteria || criteria.length === 0) return null;
  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold">{labels.intelligenceSuccessCriteria}</h3>
      <ul className="mt-3 space-y-2">
        {criteria.map((c) => (
          <li key={c.key ?? c.label} className="flex items-start gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
            <span className={c.met ? "text-emerald-600" : "text-gray-400"}>{c.met ? "✓" : "○"}</span>
            <div>
              <span className="font-medium">{c.label}</span>
              {c.note ? <p className="mt-0.5 text-xs text-gray-600">{c.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IndustrySectorBlock({ sector, labels }: { sector: IndustryInsightSector; labels: Record<string, string> }) {
  return (
    <li className="rounded border border-gray-100 p-3 text-sm">
      <p className="font-medium">{sector.label}</p>
      {sector.patterns && sector.patterns.length > 0 ? (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-500">{labels.intelligencePatterns}</p>
          <ul className="mt-1 list-inside list-disc text-xs text-gray-700">
            {sector.patterns.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {sector.common_objections && sector.common_objections.length > 0 ? (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-500">{labels.intelligenceObjections}</p>
          <ul className="mt-1 list-inside list-disc text-xs text-gray-700">
            {sector.common_objections.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function ScoreRow({ score, labels }: { score: OpportunityScoreItem; labels: Record<string, string> }) {
  return (
    <li className="rounded border border-gray-100 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{score.title}</span>
        <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800">
          {labels.intelligenceScore}: {score.composite_score ?? "—"}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {score.pipeline_stage} · {labels.intelligenceEngagement}: {score.engagement_score ?? "—"}
      </p>
      {score.score_note ? <p className="mt-1 text-xs text-gray-600">{score.score_note}</p> : null}
    </li>
  );
}

export function SalesIntelligenceTab({ dashboard, labels }: Props) {
  const summary = dashboard.sales_intelligence_summary;
  const pipeline = dashboard.pipeline_intelligence;
  const industry = dashboard.industry_insights;
  const followUp = dashboard.follow_up_intelligence;
  const scoring = dashboard.opportunity_scoring;
  const insights = dashboard.opportunity_insights;
  const counts = pipeline?.counts;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.intelligenceTitle}</h2>
        {dashboard.sales_intelligence_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">
            {labels.intelligenceMission}: {dashboard.sales_intelligence_mission}
          </p>
        ) : null}
        {dashboard.sales_intelligence_abos_principle ? (
          <p className="mt-2 text-xs text-teal-800">
            {labels.intelligenceAbosPrinciple}: {dashboard.sales_intelligence_abos_principle}
          </p>
        ) : null}
        {dashboard.sales_intelligence_distinction_note ? (
          <p className="mt-2 text-xs text-teal-700">
            {labels.intelligenceDistinctionNote}: {dashboard.sales_intelligence_distinction_note}
          </p>
        ) : null}
        {scoring?.principle ? (
          <p className="mt-2 text-xs font-medium text-teal-800">{scoring.principle}</p>
        ) : null}
      </section>

      {summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.intelligenceSummary}</h3>
          {summary.privacy_note ? <p className="mt-1 text-xs text-gray-500">{summary.privacy_note}</p> : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label={labels.activeOpportunities} value={summary.active_opportunities ?? 0} />
            <MetricCard label={labels.intelligenceDemoCandidates} value={summary.demo_candidates_count ?? 0} />
            <MetricCard label={labels.intelligenceStale} value={summary.stale_opportunities_count ?? 0} />
            <MetricCard label={labels.intelligenceFollowUpPriorities} value={summary.follow_up_priorities_count ?? 0} />
          </div>
          {summary.market_observations_note ? (
            <p className="mt-3 text-xs text-gray-600">{summary.market_observations_note}</p>
          ) : null}
        </section>
      ) : null}

      {insights?.companion_examples && insights.companion_examples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.intelligenceOpportunityInsights}</h3>
          {insights.principle ? <p className="mt-1 text-xs text-gray-600">{insights.principle}</p> : null}
          <ul className="mt-3 space-y-2 text-sm">
            {insights.companion_examples.map((ex) => (
              <li key={ex.key ?? ex.example} className="rounded border border-gray-100 px-3 py-2">
                {ex.emoji ? <span className="mr-1">{ex.emoji}</span> : null}
                {ex.example}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {counts ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.intelligencePipeline}</h3>
          {pipeline?.principle ? <p className="mt-1 text-xs text-gray-600">{pipeline.principle}</p> : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label={labels.intelligenceEarlyStage} value={counts.early_stage ?? 0} />
            <MetricCard label={labels.intelligenceDemoCandidates} value={counts.demo_candidates ?? 0} />
            <MetricCard label={labels.intelligenceRenewalRelated} value={counts.renewal_related ?? 0} />
            <MetricCard label={labels.intelligenceExpansion} value={counts.expansion_conversations ?? 0} />
            <MetricCard label={labels.intelligenceFollowUpPriorities} value={counts.follow_up_priorities ?? 0} />
          </div>
        </section>
      ) : null}

      {scoring?.scores && scoring.scores.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.intelligenceOpportunityScoring}</h3>
          <ul className="mt-3 space-y-2">
            {scoring.scores.map((s) => (
              <ScoreRow key={s.opportunity_id ?? s.title} score={s} labels={labels} />
            ))}
          </ul>
        </section>
      ) : null}

      {followUp ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.intelligenceFollowUp}</h3>
          {followUp.principle ? <p className="mt-1 text-xs text-gray-600">{followUp.principle}</p> : null}
          {followUp.stale_opportunities && followUp.stale_opportunities.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500">{labels.intelligenceStaleOpportunities}</p>
              <ul className="mt-2 space-y-2 text-sm">
                {followUp.stale_opportunities.map((o) => (
                  <li key={o.id ?? o.title} className="rounded border border-amber-100 bg-amber-50/50 px-3 py-2">
                    <span className="font-medium">{o.title}</span>
                    <p className="mt-0.5 text-xs text-gray-600">{o.suggested_action}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {followUp.demo_stage_nudges && followUp.demo_stage_nudges.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-500">{labels.intelligenceDemoNudges}</p>
              <ul className="mt-2 space-y-2 text-sm">
                {followUp.demo_stage_nudges.map((n) => (
                  <li key={n.id ?? n.title} className="rounded border border-gray-100 px-3 py-2">
                    <span className="font-medium">{n.title}</span>
                    <p className="mt-0.5 text-xs text-gray-600">{n.nudge}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {industry?.industries && industry.industries.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.intelligenceIndustryInsights}</h3>
          {industry.principle ? <p className="mt-1 text-xs text-gray-600">{industry.principle}</p> : null}
          <ul className="mt-3 space-y-3">
            {industry.industries.map((sector) => (
              <IndustrySectorBlock key={sector.key} sector={sector} labels={labels} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.sales_intelligence_objectives && dashboard.sales_intelligence_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.intelligenceObjectives}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.sales_intelligence_objectives.map((o) => (
              <li key={o.key ?? o.label}>
                <span className="font-medium">{o.label}</span>
                {o.description ? <p className="text-xs text-gray-600">{o.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.sales_intelligence_self_love_connection ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/30 p-4 text-sm">
          <h3 className="font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.sales_intelligence_self_love_connection.principle}</p>
          {dashboard.sales_intelligence_self_love_connection.route ? (
            <Link href={dashboard.sales_intelligence_self_love_connection.route} className="mt-2 inline-block text-teal-700 hover:underline">
              {labels.selfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_intelligence_trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.sales_intelligence_trust_connection.principle}</p>
          {dashboard.sales_intelligence_trust_connection.experts_should_understand ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.sales_intelligence_trust_connection.experts_should_understand.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_intelligence_integration_links && dashboard.sales_intelligence_integration_links.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.sales_intelligence_integration_links.map((link) => (
              <li key={link.key ?? link.route}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-teal-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SuccessCriteriaList criteria={dashboard.sales_intelligence_success_criteria} labels={labels} />

      {dashboard.sales_intelligence_vision_phrases && dashboard.sales_intelligence_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-teal-900">
            {dashboard.sales_intelligence_vision_phrases.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
