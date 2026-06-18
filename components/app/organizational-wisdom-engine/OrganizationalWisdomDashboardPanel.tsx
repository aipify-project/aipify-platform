"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalWisdomDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CultureSnapshot,
  type EthicsReview,
  type EthicalForesightSession,
  type IntegrationLink,
  type OrganizationalWisdomDashboard,
  type ReflectionWorkspace,
  type StakeholderAwarenessSnapshot,
  type WisdomCouncilReview,
  type WisdomMemoryEntry,
  type WisdomPractice,
} from "@/lib/aipify/organizational-wisdom-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? (
        <p className="mt-1 text-xs text-violet-900">{objective.description}</p>
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
              <Link href={String(item.cross_link)} className="mt-1 inline-block text-xs text-violet-700">
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

function WorkspaceCard({ workspace }: { workspace: ReflectionWorkspace }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-violet-900">{workspace.title}</span>
        <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">{workspace.status}</span>
      </div>
      <p className="mt-1 text-xs text-violet-800">{workspace.reflection_topic}</p>
      {workspace.cross_link_route ? (
        <Link href={workspace.cross_link_route} className="mt-1 inline-block text-xs text-violet-600">
          {workspace.cross_link_route}
        </Link>
      ) : null}
    </div>
  );
}

function EthicsReviewCard({ review }: { review: EthicsReview }) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-amber-900">{review.title}</span>
        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{review.status}</span>
      </div>
      {review.who_benefits_summary ? (
        <p className="mt-1 text-xs text-amber-800">{review.who_benefits_summary}</p>
      ) : null}
      {review.who_harmed_summary ? (
        <p className="mt-1 text-xs text-amber-700">{review.who_harmed_summary}</p>
      ) : null}
    </div>
  );
}

function CultureSnapshotRow({ snapshot }: { snapshot: CultureSnapshot }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-emerald-900">{snapshot.title}</span>
        <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
          {snapshot.theme_area?.replace(/_/g, " ")}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{snapshot.signal_strength}</span>
      </div>
      {snapshot.theme_summary ? (
        <p className="mt-1 text-xs text-emerald-800">{snapshot.theme_summary}</p>
      ) : null}
    </div>
  );
}

function PracticeRow({ practice }: { practice: WisdomPractice }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{practice.title}</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
          {practice.practice_type?.replace(/_/g, " ")}
        </span>
      </div>
      {practice.summary ? <p className="mt-1 text-xs text-gray-600">{practice.summary}</p> : null}
      {practice.cross_link_route ? (
        <Link href={practice.cross_link_route} className="mt-1 inline-block text-xs text-violet-600">
          {practice.cross_link_route}
        </Link>
      ) : null}
    </div>
  );
}

function CouncilReviewCard({ review }: { review: WisdomCouncilReview }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-teal-900">{review.title}</span>
        <span className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-800">{review.status}</span>
      </div>
      {review.reflection_summary ? (
        <p className="mt-1 text-xs text-teal-800">{review.reflection_summary}</p>
      ) : null}
      {review.cross_link_route ? (
        <Link href={review.cross_link_route} className="mt-1 inline-block text-xs text-teal-600">
          {review.cross_link_route}
        </Link>
      ) : null}
    </div>
  );
}

function ForesightSessionCard({ session }: { session: EthicalForesightSession }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-indigo-900">{session.title}</span>
        <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">{session.status}</span>
      </div>
      {session.who_benefits_summary ? (
        <p className="mt-1 text-xs text-indigo-800">{session.who_benefits_summary}</p>
      ) : null}
    </div>
  );
}

function WisdomMemoryRow({ entry }: { entry: WisdomMemoryEntry }) {
  return (
    <div className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{entry.title}</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
          {entry.entry_type?.replace(/_/g, " ")}
        </span>
      </div>
      {entry.summary ? <p className="mt-1 text-xs text-gray-600">{entry.summary}</p> : null}
      {entry.cross_link_route ? (
        <Link href={entry.cross_link_route} className="mt-1 inline-block text-xs text-violet-600">
          {entry.cross_link_route}
        </Link>
      ) : null}
    </div>
  );
}

function StakeholderSnapshotRow({ snapshot }: { snapshot: StakeholderAwarenessSnapshot }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-sky-900">{snapshot.title}</span>
        <span className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
          {snapshot.stakeholder_group?.replace(/_/g, " ")}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{snapshot.signal_strength}</span>
      </div>
      {snapshot.theme_summary ? <p className="mt-1 text-xs text-sky-800">{snapshot.theme_summary}</p> : null}
    </div>
  );
}

export function OrganizationalWisdomDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalWisdomDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/organizational-wisdom-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalWisdomDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.owebp129_cross_links ?? dashboard.integration_links ?? [];
  const objectives = dashboard.organizational_wisdom_objectives ?? [];
  const limitationItems = dashboard.limitation_principles?.must_avoid ?? [];
  const selfLovePractices = dashboard.self_love_in_wisdom?.practices ?? [];
  const companionExamples = (dashboard.companion_adaptation?.examples ?? []) as Array<{
    emoji?: string;
    prompt?: string;
    consideration?: string;
  }>;
  const companionLimitations = (dashboard.companion_limitations?.limitations ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const governanceConnections = (dashboard.ethical_governance_integration?.connections ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const successMetrics = dashboard.success_metrics ?? [];
  const phase157Objectives = dashboard.phase157_objectives ?? [];
  const phase157CompanionLimits = (dashboard.phase157_companion_limitations?.limitations ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const phase157SelfLovePractices = dashboard.phase157_self_love_connection?.practices ?? [];
  const phase157SecurityReqs = (dashboard.phase157_security_requirements?.requirements ?? []) as Array<{
    label?: string;
    description?: string;
  }>;
  const owcebp157Links = dashboard.owcebp157_integration_links ?? [];
  const phase157SuccessCriteria = dashboard.phase157_success_criteria ?? [];
  const phase157Engagement = dashboard.phase157_engagement_summary ?? {};
  const phase157Sections = dashboard.phase157_sections ?? {};
  const councilReviews = phase157Sections.wisdom_council_reviews ?? [];
  const foresightSessions = phase157Sections.ethical_foresight_sessions ?? [];
  const wisdomMemoryEntries = phase157Sections.wisdom_memory_entries ?? [];
  const stakeholderSnapshots = phase157Sections.stakeholder_awareness_snapshots ?? [];
  const phase157VisionPhrases = dashboard.phase157_vision_phrases ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/wisdom-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.wisdomEngine}
        </Link>
        <Link
          href="/app/ai-ethics-responsible-use-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.aiEthics}
        </Link>
        <Link href="/app/purpose-values-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.purposeValues}
        </Link>
        <Link href="/app/decision-intelligence-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.decisionIntelligence}
        </Link>
        <Link href="/app/social-impact-purpose-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.socialImpact}
        </Link>
        <Link href="/app/governance-policy-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.boardGovernance}
        </Link>
        <Link href="/app/organizational-memory-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.organizationalMemory}
        </Link>
        <Link href="/app/inclusion-humanity-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.inclusionHumanity}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
        <Link
          href="/app/collective-decision-council-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.collectiveDecisionCouncil}
        </Link>
        <Link href="/app/strategic-foresight-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.strategicForesight}
        </Link>
        <Link href="/app/change-management-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.changeManagement}
        </Link>
        <Link href="/app/future-leaders-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.futureLeaders}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <p className="text-sm font-medium text-violet-800">{labels.wisdomMaturityScore}</p>
        <p className="text-3xl font-bold text-violet-900">{dashboard.wisdom_maturity_score ?? 0}</p>
        <p className="mt-2 text-sm text-violet-800">{dashboard.philosophy}</p>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-violet-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.safety_note ? <p className="mt-2 text-xs text-violet-600">{dashboard.safety_note}</p> : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeReflectionWorkspaces}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.active_reflection_workspaces ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.ethicsReviews}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.ethics_reviews ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.cultureThemeSnapshots}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.culture_theme_snapshots ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.wisdomCenterCapabilities}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.wisdom_center_capabilities_count ?? 8}</p>
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

      <MetaListSection title={labels.wisdomCenter} meta={dashboard.wisdom_center} itemsKey="capabilities" />

      {dashboard.reflection_workspaces.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.activeReflectionWorkspaces}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.reflection_workspaces.map((w) => (
              <WorkspaceCard key={w.id ?? w.workspace_key} workspace={w} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.ethicalIntelligenceEngine}
        meta={dashboard.ethical_intelligence_engine}
        itemsKey="questions"
      />

      <MetaListSection
        title={labels.valuesAlignmentEngine}
        meta={dashboard.values_alignment_engine}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.multiPerspectiveFramework}
        meta={dashboard.multi_perspective_framework}
        itemsKey="perspectives"
      />

      {dashboard.ethics_reviews_list.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.ethicsReviewsList}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.ethics_reviews_list.map((r) => (
              <EthicsReviewCard key={r.id ?? r.review_key} review={r} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.decisionEthicsReview}
        meta={dashboard.decision_ethics_review}
        itemsKey="prompts"
      />

      {dashboard.culture_snapshots.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.cultureThemeSnapshots}</h2>
          <p className="mt-1 text-xs text-gray-500">{labels.cultureInsightNote}</p>
          <div className="mt-3 space-y-2">
            {dashboard.culture_snapshots.map((c) => (
              <CultureSnapshotRow key={c.id ?? c.snapshot_key} snapshot={c} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection title={labels.cultureInsightEngine} meta={dashboard.culture_insight_engine} itemsKey="areas" />

      {dashboard.wisdom_practices.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.wisdomPractices}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.wisdom_practices.map((p) => (
              <PracticeRow key={p.id ?? p.practice_key} practice={p} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.wisdomPracticesLibrary}
        meta={dashboard.wisdom_practices_library}
        itemsKey="resources"
      />

      <MetaListSection title={labels.wisdomCompanion} meta={dashboard.wisdom_companion} itemsKey="supports" />

      {companionExamples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          <ul className="mt-3 space-y-2">
            {companionExamples.map((ex, i) => (
              <li key={i} className="rounded border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
                <span>
                  {ex.emoji ? `${ex.emoji} ` : ""}
                  {ex.prompt}
                </span>
                {ex.consideration ? <p className="mt-1 text-xs text-violet-700">{ex.consideration}</p> : null}
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
          <h2 className="text-sm font-semibold text-rose-900">{labels.selfLoveInWisdom}</h2>
          {dashboard.self_love_in_wisdom?.principle ? (
            <p className="mt-1 text-xs text-rose-800">{dashboard.self_love_in_wisdom.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-rose-900">
            {selfLovePractices.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {governanceConnections.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.ethicalGovernanceIntegration}</h2>
          {dashboard.ethical_governance_integration?.principle ? (
            <p className="mt-1 text-xs text-gray-600">
              {String(dashboard.ethical_governance_integration.principle)}
            </p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {governanceConnections.map((conn, i) => (
              <li key={i} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{conn.label}</span>
                {conn.description ? <p className="mt-1 text-xs text-gray-600">{conn.description}</p> : null}
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
                <Link href={link.route ?? "#"} className="text-sm text-violet-700 hover:underline">
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

      {(dashboard.phase157_mission || dashboard.phase157_distinction_note) && labels.phase157Title ? (
        <section className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
          <h2 className="text-sm font-semibold text-teal-900">{labels.phase157Title}</h2>
          {dashboard.phase157_mission ? (
            <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.phase157_mission}</p>
          ) : null}
          {dashboard.phase157_philosophy ? (
            <p className="mt-2 text-xs text-teal-900">{dashboard.phase157_philosophy}</p>
          ) : null}
          {dashboard.phase157_abos_principle ? (
            <p className="mt-1 text-xs font-medium text-teal-800">{dashboard.phase157_abos_principle}</p>
          ) : null}
          {dashboard.phase157_vision ? (
            <p className="mt-2 text-xs italic text-teal-700">{dashboard.phase157_vision}</p>
          ) : null}
          {dashboard.phase157_distinction_note ? (
            <p className="mt-2 text-xs text-teal-700">{dashboard.phase157_distinction_note}</p>
          ) : null}
          {dashboard.organizational_wisdom_council_note ? (
            <p className="mt-2 text-xs text-teal-600">{dashboard.organizational_wisdom_council_note}</p>
          ) : null}
        </section>
      ) : null}

      {phase157Objectives.length > 0 ? (
        <section className="rounded-xl border border-teal-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157Objectives}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {phase157Objectives.map((o) => (
              <ObjectiveCard key={o.key ?? o.label} objective={o} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.phase157WisdomCouncilCenter}
        meta={dashboard.phase157_wisdom_council_center}
        itemsKey="capabilities"
      />

      <MetaListSection
        title={labels.phase157EthicalForesight}
        meta={dashboard.phase157_ethical_foresight_engine}
        itemsKey="questions"
      />

      <MetaListSection
        title={labels.phase157StakeholderAwareness}
        meta={dashboard.phase157_stakeholder_awareness_framework}
        itemsKey="stakeholders"
      />

      <MetaListSection
        title={labels.phase157ExecutiveWisdom}
        meta={dashboard.phase157_executive_wisdom_reviews}
        itemsKey="dimensions"
      />

      {councilReviews.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157CouncilReviews}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {councilReviews.map((r) => (
              <CouncilReviewCard key={r.id ?? r.review_key} review={r} />
            ))}
          </div>
        </section>
      ) : null}

      {foresightSessions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157ForesightSessions}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {foresightSessions.map((s) => (
              <ForesightSessionCard key={s.id ?? s.session_key} session={s} />
            ))}
          </div>
        </section>
      ) : null}

      <MetaListSection
        title={labels.phase157WisdomCompanion}
        meta={dashboard.phase157_wisdom_companion}
        itemsKey="supports"
      />

      <MetaListSection
        title={labels.phase157EthicalInnovation}
        meta={dashboard.phase157_ethical_innovation_engine}
        itemsKey="tensions"
      />

      <MetaListSection
        title={labels.phase157FutureConsequences}
        meta={dashboard.phase157_future_consequence_framework}
        itemsKey="dimensions"
      />

      <MetaListSection
        title={labels.phase157WisdomMemory}
        meta={dashboard.phase157_wisdom_memory_engine}
        itemsKey="record_types"
      />

      {wisdomMemoryEntries.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157MemoryEntries}</h2>
          <div className="mt-3 space-y-2">
            {wisdomMemoryEntries.map((e) => (
              <WisdomMemoryRow key={e.id ?? e.entry_key} entry={e} />
            ))}
          </div>
        </section>
      ) : null}

      {stakeholderSnapshots.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157StakeholderSnapshots}</h2>
          <p className="mt-1 text-xs text-gray-500">{labels.phase157StakeholderNote}</p>
          <div className="mt-3 space-y-2">
            {stakeholderSnapshots.map((s) => (
              <StakeholderSnapshotRow key={s.id ?? s.snapshot_key} snapshot={s} />
            ))}
          </div>
        </section>
      ) : null}

      {phase157CompanionLimits.length > 0 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.phase157CompanionLimitations}</h2>
          <ul className="mt-3 space-y-2">
            {phase157CompanionLimits.map((lim, i) => (
              <li key={i} className="text-sm text-amber-900">
                <span className="font-medium">{lim.label}</span>
                {lim.description ? <span className="text-xs"> — {lim.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(phase157SelfLovePractices) && phase157SelfLovePractices.length > 0 ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
          <h2 className="text-sm font-semibold text-rose-900">{labels.phase157SelfLove}</h2>
          {dashboard.phase157_self_love_connection?.principle ? (
            <p className="mt-1 text-xs text-rose-800">{dashboard.phase157_self_love_connection.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-1 text-sm text-rose-900">
            {(phase157SelfLovePractices as Array<{ label?: string; description?: string } | string>).map(
              (p, i) => (
                <li key={i}>
                  {typeof p === "string" ? p : `${p.label ?? ""}${p.description ? ` — ${p.description}` : ""}`}
                </li>
              ),
            )}
          </ul>
        </section>
      ) : null}

      {phase157SecurityReqs.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157Security}</h2>
          {dashboard.phase157_security_requirements?.principle ? (
            <p className="mt-1 text-xs text-gray-600">
              {String(dashboard.phase157_security_requirements.principle)}
            </p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {phase157SecurityReqs.map((req, i) => (
              <li key={i} className="rounded border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{req.label}</span>
                {req.description ? <p className="mt-1 text-xs text-gray-600">{req.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {typeof phase157Engagement.wisdom_council_reviews === "number" ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157Engagement}</h2>
          <p className="mt-2 text-sm text-gray-700">
            {labels.phase157CouncilReviews}: {String(phase157Engagement.wisdom_council_reviews ?? 0)} ·{" "}
            {labels.phase157ForesightSessions}: {String(phase157Engagement.ethical_foresight_sessions ?? 0)} ·{" "}
            {labels.phase157MemoryEntries}: {String(phase157Engagement.wisdom_memory_entries ?? 0)} ·{" "}
            {labels.phase157StakeholderSnapshots}:{" "}
            {String(phase157Engagement.stakeholder_awareness_snapshots ?? 0)}
          </p>
          {phase157Engagement.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{String(phase157Engagement.privacy_note)}</p>
          ) : null}
        </section>
      ) : null}

      {phase157VisionPhrases.length > 0 ? (
        <section className="rounded-xl border border-teal-100 bg-teal-50/20 p-4">
          <h2 className="text-sm font-semibold text-teal-900">{labels.phase157VisionPhrases}</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-teal-900">
            {phase157VisionPhrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase157SuccessCriteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157SuccessCriteria}</h2>
          <div className="mt-3 space-y-2">
            {phase157SuccessCriteria.map((c) => (
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

      {owcebp157Links.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.phase157IntegrationLinks}</h2>
          <ul className="mt-3 space-y-2">
            {owcebp157Links.map((link) => (
              <li key={link.key ?? link.route}>
                <Link href={link.route ?? "#"} className="text-sm text-teal-700 hover:underline">
                  {link.label}
                </Link>
                {link.relationship ? <p className="text-xs text-gray-500">{link.relationship}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.phase157_privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.phase157_privacy_note}</p>
      ) : null}

      {dashboard.privacy_note ? <p className="text-xs text-gray-500">{dashboard.privacy_note}</p> : null}
    </div>
  );
}
