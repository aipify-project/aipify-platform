"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDecisionIntelligenceDashboard,
  type AbosSuccessCriterion,
  type AssumptionReview,
  type BlueprintObjective,
  type DecisionJournal,
  type DecisionWorkspace,
  type IntegrationLink,
  type OutcomeLearning,
  type HeritageArchive,
  type HeritageExecutiveReflection,
  type HeritageOutcomeReview,
  type HeritagePatternSnapshot,
  type DecisionIntelligenceDashboard,
} from "@/lib/aipify/decision-intelligence-engine";

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
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
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
  const items = Array.isArray(meta?.[itemsKey]) ? (meta[itemsKey] as Array<Record<string, unknown>>) : [];
  if (items.length === 0) return null;
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {typeof meta?.principle === "string" ? (
        <p className="mt-1 text-xs text-gray-600">{meta.principle}</p>
      ) : null}
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={String(item.key ?? i)} className="rounded border border-gray-100 px-3 py-2 text-sm">
            <span className="font-medium">{String(item.label ?? item.key ?? "")}</span>
            {item.description ? (
              <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p>
            ) : null}
            {item.cross_link ? (
              <Link href={String(item.cross_link)} className="mt-1 inline-block text-xs text-indigo-700">
                {String(item.cross_link)}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
      {typeof meta?.boundary_note === "string" ? (
        <p className="mt-2 text-xs text-gray-500">{meta.boundary_note}</p>
      ) : null}
    </section>
  );
}

function WorkspaceCard({ workspace }: { workspace: DecisionWorkspace }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{workspace.title}</span>
        <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">{workspace.status}</span>
      </div>
      <p className="mt-1 text-xs text-indigo-800">{workspace.decision_statement}</p>
      {workspace.cross_link_route ? (
        <Link href={workspace.cross_link_route} className="mt-1 inline-block text-xs text-indigo-600">
          {workspace.cross_link_route}
        </Link>
      ) : null}
    </div>
  );
}

function JournalRow({ journal }: { journal: DecisionJournal }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{journal.title}</span>
        {journal.decision_date ? (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{journal.decision_date}</span>
        ) : null}
      </div>
      {journal.rationale_summary ? (
        <p className="mt-1 text-xs text-gray-600">{journal.rationale_summary}</p>
      ) : null}
    </div>
  );
}

function AssumptionCard({ assumption }: { assumption: AssumptionReview }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">{assumption.title}</span>
        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{assumption.status}</span>
      </div>
      <p className="mt-1 text-xs text-amber-800">{assumption.summary}</p>
      <p className="mt-1 text-xs text-amber-700">
        {assumption.assumption_type?.replace(/_/g, " ")} · {assumption.confidence} confidence
      </p>
    </div>
  );
}

function OutcomeRow({ learning }: { learning: OutcomeLearning }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <span className="font-medium text-emerald-900">{learning.title}</span>
      {learning.what_worked_summary ? (
        <p className="mt-1 text-xs text-emerald-800">{learning.what_worked_summary}</p>
      ) : null}
      {learning.change_summary ? (
        <p className="mt-1 text-xs text-emerald-700">{learning.change_summary}</p>
      ) : null}
    </div>
  );
}

function HeritageArchiveRow({ archive }: { archive: HeritageArchive }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{archive.title}</span>
        <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">{archive.status}</span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{archive.decision_summary}</p>
      {archive.visibility ? (
        <p className="mt-1 text-xs text-violet-700">{archive.visibility.replace(/_/g, " ")}</p>
      ) : null}
    </div>
  );
}

function HeritageOutcomeRow({ review }: { review: HeritageOutcomeReview }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <span className="font-medium text-teal-900">{review.title}</span>
      {review.what_happened_summary ? (
        <p className="mt-1 text-xs text-teal-800">{review.what_happened_summary}</p>
      ) : null}
    </div>
  );
}

function HeritageReflectionRow({ reflection }: { reflection: HeritageExecutiveReflection }) {
  return (
    <div className="rounded-lg border border-rose-100 bg-rose-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-rose-900">{reflection.title}</span>
        {reflection.reflection_type ? (
          <span className="rounded bg-rose-100 px-2 py-0.5 text-xs text-rose-800">
            {reflection.reflection_type.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {reflection.reflection_summary ? (
        <p className="mt-1 text-xs text-rose-800">{reflection.reflection_summary}</p>
      ) : null}
    </div>
  );
}

function HeritagePatternRow({ pattern }: { pattern: HeritagePatternSnapshot }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm">
      <span className="font-medium text-slate-900">{pattern.title}</span>
      {pattern.theme_summary ? <p className="mt-1 text-xs text-slate-700">{pattern.theme_summary}</p> : null}
      {pattern.pattern_type ? (
        <p className="mt-1 text-xs text-slate-600">{pattern.pattern_type.replace(/_/g, " ")}</p>
      ) : null}
    </div>
  );
}

export function DecisionIntelligenceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<DecisionIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/decision-intelligence-engine/dashboard");
    if (res.ok) setDashboard(parseDecisionIntelligenceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.deibp125_cross_links ?? dashboard.integration_links ?? [];
  const objectives = dashboard.decision_intelligence_objectives ?? [];
  const limitationItems = dashboard.limitation_principles?.must_avoid ?? [];
  const selfLovePractices = dashboard.self_love_in_decisions?.practices ?? [];
  const companionExamples = (dashboard.companion_adaptation?.examples ?? []) as Array<{
    emoji?: string;
    prompt?: string;
    consideration?: string;
  }>;
  const companionLimitations = (dashboard.companion_limitations?.limitations ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const knowledgePreserves = (dashboard.decision_knowledge_library?.preserves ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const successMetrics = dashboard.success_metrics ?? [];
  const phase153Objectives = dashboard.phase153_objectives ?? [];
  const phase153IntegrationLinks = dashboard.iwdhbp153_integration_links ?? [];
  const phase153CompanionLimits = (dashboard.phase153_companion_limitations?.limitations ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const phase153SelfLovePractices = dashboard.phase153_self_love_connection?.practices ?? [];
  const phase153WisdomAssets = (dashboard.phase153_institutional_wisdom_library?.assets ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const phase153FutureLeaderAreas = (dashboard.phase153_future_leader_preparation_engine?.areas ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const phase153SecurityRequirements = dashboard.phase153_security_requirements ?? [];
  const phase153VisionPhrases = dashboard.phase153_vision_phrases ?? [];
  const heritageSections = dashboard.phase153_sections;
  const heritageMetrics = dashboard.phase153_heritage_metrics ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/assistant/decisions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.personalDse}
        </Link>
        <Link
          href="/app/organizational-decision-support-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.organizationalDecisionSupport}
        </Link>
        <Link href="/app/executive-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.executiveIntelligence}
        </Link>
        <Link href="/app/strategic-foresight-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.strategicForesight}
        </Link>
        <Link href="/app/digital-twin" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.digitalTwin}
        </Link>
        <Link href="/app/wisdom-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.wisdomEngine}
        </Link>
        <Link href="/app/simulations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.simulationLab}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
        <Link href="/app/future-leaders-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.futureLeaders}
        </Link>
        <Link href="/app/organizational-memory-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.organizationalMemory}
        </Link>
        <Link href="/app/collective-decision-council-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.collectiveDecisionCouncil}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
        <p className="text-sm font-medium text-indigo-800">{labels.decisionQualityScore}</p>
        <p className="text-3xl font-bold text-indigo-900">{dashboard.decision_quality_score ?? 0}</p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.safety_note ? <p className="mt-2 text-xs text-indigo-600">{dashboard.safety_note}</p> : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeWorkspaces}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.active_workspaces ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.journalEntries}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.journal_entries ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.assumptionReviews}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.assumption_reviews ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.intelligenceCapabilities}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.intelligence_center_capabilities_count ?? 9}</p>
        </div>
      </div>

      {objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {objectives.map((o) => (
              <ObjectiveCard key={o.key ?? o.label} objective={o} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.decisionIntelligenceCenter}
        meta={dashboard.decision_intelligence_center}
        itemsKey="capabilities"
      />

      {dashboard.workspaces.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.activeDecisionWorkspaces}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.workspaces.map((w) => (
              <WorkspaceCard key={w.id ?? w.workspace_key} workspace={w} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection title={labels.decisionWorkspaceFields} meta={dashboard.decision_workspaces} itemsKey="fields" />

      {dashboard.journals.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.decisionJournals}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.journals.map((j) => (
              <JournalRow key={j.id ?? j.journal_key} journal={j} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection title={labels.decisionJournalCaptures} meta={dashboard.decision_journal} itemsKey="captures" />

      {dashboard.assumptions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.assumptionReviewsList}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.assumptions.map((a) => (
              <AssumptionCard key={a.id ?? a.assumption_key} assumption={a} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.assumptionIntelligence}
        meta={dashboard.assumption_intelligence}
        itemsKey="types"
      />

      <MetaListSection title={labels.tradeoffAnalysis} meta={dashboard.tradeoff_analysis} itemsKey="questions" />

      <MetaListSection title={labels.stakeholderImpact} meta={dashboard.stakeholder_impact} itemsKey="groups" />

      {dashboard.outcome_learnings_list.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.outcomeLearnings}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.outcome_learnings_list.map((o) => (
              <OutcomeRow key={o.id ?? o.learning_key} learning={o} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection title={labels.outcomeLearningQuestions} meta={dashboard.outcome_learning} itemsKey="questions" />

      <MetaListSection
        title={labels.executiveReflection}
        meta={dashboard.executive_reflection}
        itemsKey="considerations"
      />

      <MetaListSection
        title={labels.executiveAdvisoryCompanion}
        meta={dashboard.executive_advisory_companion}
        itemsKey="supports"
      />

      {companionExamples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          <ul className="mt-3 space-y-2">
            {companionExamples.map((ex, i) => (
              <li key={i} className="rounded border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
                <span>
                  {ex.emoji ? `${ex.emoji} ` : ""}
                  {ex.prompt}
                </span>
                {ex.consideration ? <p className="mt-1 text-xs text-indigo-700">{ex.consideration}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {companionLimitations.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.companionLimitations}</h2>
          <ul className="mt-3 space-y-2">
            {companionLimitations.map((lim, i) => (
              <li key={i} className="text-sm text-amber-900">
                <span className="font-medium">{lim.label}</span>
                {lim.description ? <span className="text-xs"> — {lim.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {selfLovePractices.length > 0 ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveInDecisions}</h2>
          {dashboard.self_love_in_decisions?.principle ? (
            <p className="mt-1 text-xs text-rose-800">{dashboard.self_love_in_decisions.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-rose-900">
            {selfLovePractices.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {knowledgePreserves.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.decisionKnowledgeLibrary}</h2>
          <ul className="mt-3 space-y-2">
            {knowledgePreserves.map((item, i) => (
              <li key={i} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h2>
          <ul className="mt-3 space-y-2">
            {integrationLinks.map((link) => (
              <li key={link.key ?? link.route}>
                <Link href={link.route ?? "#"} className="text-sm text-indigo-700 hover:underline">
                  {link.label}
                </Link>
                {link.relationship ? <p className="text-xs text-gray-500">{link.relationship}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/20 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.limitationPrinciples}</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {successMetrics.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.successMetrics}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {successMetrics.map((m) => (
              <li key={String(m.key)} className="rounded border border-gray-100 px-3 py-2 text-sm">
                {String(m.label ?? m.key)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.success_criteria?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.success_criteria?.map((c) => (
              <SuccessCriterionRow
                key={c.key ?? c.label}
                criterion={c}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.phase153_mission || dashboard.implementation_blueprint_phase153 ? (
        <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <h2 className="text-sm font-semibold text-violet-900">{labels.phase153Title}</h2>
          {dashboard.phase153_mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.phase153_mission}</p>
          ) : null}
          {dashboard.phase153_philosophy ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.phase153_philosophy}</p>
          ) : null}
          {dashboard.phase153_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-violet-800">{dashboard.phase153_abos_principle}</p>
          ) : null}
          {dashboard.phase153_vision ? (
            <p className="mt-2 text-xs italic text-violet-700">{dashboard.phase153_vision}</p>
          ) : null}
          {dashboard.phase153_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.phase153_distinction_note}</p>
          ) : null}
          {dashboard.decision_heritage_note ? (
            <p className="mt-2 text-xs text-violet-600">{dashboard.decision_heritage_note}</p>
          ) : null}
        </section>
      ) : null}

      {phase153Objectives.length > 0 ? (
        <section className="rounded-xl border border-violet-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153Objectives}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase153Objectives.map((o) => (
              <ObjectiveCard key={o.key ?? o.label} objective={o} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.phase153HeritageCenter}
        meta={dashboard.phase153_decision_heritage_center}
        itemsKey="capabilities"
      />

      {(heritageSections?.heritage_archives?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153HeritageArchives}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {heritageSections?.heritage_archives?.map((a) => (
              <HeritageArchiveRow key={a.id ?? a.archive_key} archive={a} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.phase153DecisionJournalEngine}
        meta={dashboard.phase153_decision_journal_engine}
        itemsKey="captures"
      />

      {(heritageSections?.outcome_reviews?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153OutcomeReviews}</h2>
          <div className="mt-3 space-y-2">
            {heritageSections?.outcome_reviews?.map((r) => (
              <HeritageOutcomeRow key={r.id ?? r.review_key} review={r} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.phase153OutcomeReviewEngine}
        meta={dashboard.phase153_outcome_review_engine}
        itemsKey="prompts"
      />

      {(heritageSections?.executive_reflections?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153ExecutiveReflections}</h2>
          <div className="mt-3 space-y-2">
            {heritageSections?.executive_reflections?.map((r) => (
              <HeritageReflectionRow key={r.id ?? r.reflection_key} reflection={r} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.phase153ExecutiveReflectionEngine}
        meta={dashboard.phase153_executive_reflection_engine}
        itemsKey="dimensions"
      />

      <MetaListSection title={labels.phase153WisdomCompanion} meta={dashboard.phase153_wisdom_companion} itemsKey="supports" />

      {(heritageSections?.pattern_snapshots?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153PatternSnapshots}</h2>
          <p className="mt-1 text-xs text-gray-500">{labels.phase153PatternNote}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {heritageSections?.pattern_snapshots?.map((p) => (
              <HeritagePatternRow key={p.id ?? p.snapshot_key} pattern={p} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.phase153DecisionPatternEngine}
        meta={dashboard.phase153_decision_pattern_engine}
        itemsKey="pattern_types"
      />

      {phase153WisdomAssets.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153InstitutionalWisdomLibrary}</h2>
          <ul className="mt-3 space-y-2">
            {phase153WisdomAssets.map((item, i) => (
              <li key={i} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase153FutureLeaderAreas.length > 0 ? (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-4">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.phase153FutureLeaderPreparation}</h2>
          <ul className="mt-3 space-y-2">
            {phase153FutureLeaderAreas.map((item, i) => (
              <li key={i} className="rounded border border-indigo-100 px-3 py-2 text-sm">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-xs text-indigo-700">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase153CompanionLimits.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.phase153CompanionLimitations}</h2>
          <ul className="mt-3 space-y-2">
            {phase153CompanionLimits.map((lim, i) => (
              <li key={i} className="text-sm text-amber-900">
                <span className="font-medium">{lim.label}</span>
                {lim.description ? <span className="text-xs"> — {lim.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase153SelfLovePractices.length > 0 ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.phase153SelfLoveConnection}</h2>
          {dashboard.phase153_self_love_connection?.principle ? (
            <p className="mt-1 text-xs text-rose-800">{dashboard.phase153_self_love_connection.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {phase153SelfLovePractices.map((p, i) => {
              const item = p as { label?: string; description?: string } | string;
              if (typeof item === "string") {
                return (
                  <li key={item} className="text-sm text-rose-900">
                    {item}
                  </li>
                );
              }
              return (
                <li key={i} className="text-sm text-rose-900">
                  <span className="font-medium">{item.label}</span>
                  {item.description ? <span className="text-xs"> — {item.description}</span> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {phase153SecurityRequirements.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153SecurityRequirements}</h2>
          <ul className="mt-3 space-y-2">
            {phase153SecurityRequirements.map((req) => (
              <li key={String(req.key)} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{String(req.label ?? req.key)}</span>
                {req.description ? <p className="mt-1 text-xs text-gray-600">{String(req.description)}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase153IntegrationLinks.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153IntegrationLinks}</h2>
          <ul className="mt-3 space-y-2">
            {phase153IntegrationLinks.map((link) => (
              <li key={link.key ?? link.route}>
                <Link href={link.route ?? "#"} className="text-sm text-violet-700 hover:underline">
                  {link.label}
                </Link>
                {link.relationship ? <p className="text-xs text-gray-500">{link.relationship}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {typeof heritageMetrics.heritage_archives === "number" ? (
        <section className="rounded-xl border border-violet-100 bg-violet-50/20 p-4">
          <h2 className="text-sm font-semibold text-violet-900">{labels.phase153Engagement}</h2>
          <p className="mt-2 text-sm text-violet-900">
            {labels.phase153HeritageArchives}: {heritageMetrics.heritage_archives ?? 0} · {labels.phase153OutcomeReviews}:{" "}
            {heritageMetrics.outcome_reviews ?? 0} · {labels.phase153ExecutiveReflections}:{" "}
            {heritageMetrics.executive_reflections ?? 0} · {labels.phase153PatternSnapshots}:{" "}
            {heritageMetrics.pattern_snapshots ?? 0}
          </p>
        </section>
      ) : null}

      {phase153VisionPhrases.length > 0 ? (
        <section className="rounded-xl border border-violet-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153VisionPhrases}</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-violet-900">
            {phase153VisionPhrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.phase153_success_criteria?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase153SuccessCriteria}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.phase153_success_criteria?.map((c) => (
              <SuccessCriterionRow
                key={c.key ?? c.label}
                criterion={c}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.privacy_note ? <p className="text-xs text-gray-500">{dashboard.privacy_note}</p> : null}
      {dashboard.phase153_privacy_note ? (
        <p className="text-xs text-violet-600">{dashboard.phase153_privacy_note}</p>
      ) : null}
    </div>
  );
}
