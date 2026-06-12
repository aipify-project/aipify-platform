"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalWisdomDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CultureSnapshot,
  type EthicsReview,
  type IntegrationLink,
  type OrganizationalWisdomDashboard,
  type ReflectionWorkspace,
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

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
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

      {dashboard.privacy_note ? <p className="text-xs text-gray-500">{dashboard.privacy_note}</p> : null}
    </div>
  );
}
