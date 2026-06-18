"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCollectiveDecisionCouncilDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CollectiveDecisionCouncilDashboard,
  type CouncilMemoryEntry,
  type CouncilPerspective,
  type CouncilWorkspace,
  type IntegrationLink,
  type StakeholderImpact,
  type TransparencyRecord,
} from "@/lib/aipify/collective-decision-council-engine";

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
    </div>
  );
}

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "decided":
    case "governed":
    case "guided":
      return "bg-emerald-100 text-emerald-800";
    case "draft":
    case "assisted":
    case "moderate":
    case "review":
      return "bg-amber-100 text-amber-800";
    case "deliberating":
    case "challenged":
    case "high":
      return "bg-rose-100 text-rose-800";
    case "human":
      return "bg-violet-100 text-violet-800";
    case "companion":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function WorkspaceRow({ workspace }: { workspace: CouncilWorkspace }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{workspace.title}</span>
        <div className="flex flex-wrap gap-2">
          {workspace.governance_tier ? (
            <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(workspace.governance_tier)}`}>
              {workspace.governance_tier}
            </span>
          ) : null}
          {workspace.status ? (
            <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(workspace.status)}`}>
              {workspace.status}
            </span>
          ) : null}
        </div>
      </div>
      {workspace.context_summary ? (
        <p className="mt-1 text-xs text-gray-600">{workspace.context_summary}</p>
      ) : null}
      {workspace.cross_link_route ? (
        <Link
          href={workspace.cross_link_route}
          className="mt-2 inline-block text-xs font-medium text-violet-700 hover:underline"
        >
          Related surface →
        </Link>
      ) : null}
    </li>
  );
}

function PerspectiveRow({ perspective }: { perspective: CouncilPerspective }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{perspective.role}</span>
        {perspective.contributor_type ? (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(perspective.contributor_type)}`}>
            {perspective.contributor_type}
          </span>
        ) : null}
        {perspective.perspective_type ? (
          <span className="text-xs capitalize text-gray-500">
            {perspective.perspective_type.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {perspective.summary ? <p className="mt-1 text-xs text-gray-600">{perspective.summary}</p> : null}
    </li>
  );
}

function StakeholderImpactRow({ impact }: { impact: StakeholderImpact }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize">{impact.stakeholder_group?.replace(/_/g, " ")}</span>
        {impact.impact_level ? (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(impact.impact_level)}`}>
            {impact.impact_level}
          </span>
        ) : null}
      </div>
      {impact.impact_summary ? <p className="mt-1 text-xs text-gray-600">{impact.impact_summary}</p> : null}
    </li>
  );
}

function TransparencyRow({ record }: { record: TransparencyRecord }) {
  return (
    <li className="rounded-lg border border-violet-100 bg-violet-50/20 px-3 py-2 text-sm">
      <span className="font-medium">{record.workspace_key}</span>
      {record.rationale_summary ? (
        <p className="mt-1 text-xs text-gray-600">{record.rationale_summary}</p>
      ) : null}
    </li>
  );
}

function MemoryRow({ entry }: { entry: CouncilMemoryEntry }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      {entry.lesson_summary ? <p className="text-xs text-gray-700">{entry.lesson_summary}</p> : null}
      {entry.reflection_summary ? (
        <p className="mt-1 text-xs italic text-gray-500">{entry.reflection_summary}</p>
      ) : null}
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
            {item.description ? (
              <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function MetaObjectSection({
  data,
  title,
  listKey,
}: {
  data?: Record<string, unknown>;
  title: string;
  listKey: string;
}) {
  if (!data) return null;
  const items = Array.isArray(data[listKey]) ? (data[listKey] as Record<string, unknown>[]) : [];
  return <MetaGrid items={items} title={title} />;
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
            {link.relationship ? <p className="mt-1 text-xs text-gray-500">{link.relationship}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CollectiveDecisionCouncilEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CollectiveDecisionCouncilDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/aipify/collective-decision-council-engine/dashboard");
      if (!res.ok) throw new Error(await res.text());
      const data = parseCollectiveDecisionCouncilDashboard(await res.json());
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

  const centerCapabilities = Array.isArray(
    (dashboard.collective_decision_center as Record<string, unknown> | undefined)?.capabilities
  )
    ? ((dashboard.collective_decision_center as Record<string, unknown>).capabilities as Record<string, unknown>[])
    : [];

  const companionLimitations = Array.isArray(
    (dashboard.companion_limitations as Record<string, unknown> | undefined)?.limitations
  )
    ? ((dashboard.companion_limitations as Record<string, unknown>).limitations as Record<string, unknown>[])
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-700">{labels.blueprintTitle}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-800">{labels.councilWisdomScore}</p>
            <p className="text-3xl font-bold text-violet-900">{dashboard.council_wisdom_score ?? 0}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-violet-600">{labels.humanOversightRequired}</p>
            ) : null}
            <p className="mt-1 text-xs text-violet-600">{labels.companionsDoNotVote}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.activeWorkspaces}</span>
            <p className="text-xl font-semibold">{dashboard.active_workspaces ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.perspectives}</span>
            <p className="text-xl font-semibold">{dashboard.perspectives ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.humanPerspectives}</span>
            <p className="text-xl font-semibold">{dashboard.human_perspectives ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.companionPerspectives}</span>
            <p className="text-xl font-semibold">{dashboard.companion_perspectives ?? 0}</p>
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

      <MetaGrid items={centerCapabilities} title={labels.collectiveDecisionCenter} />

      {dashboard.collective_decision_council_objectives?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.collective_decision_council_objectives.map((obj) => (
              <ObjectiveCard key={obj.key} objective={obj} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.workspaces.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.decisionWorkspaces}</h3>
          <ul className="space-y-2">
            {dashboard.workspaces.map((w) => (
              <WorkspaceRow key={w.id} workspace={w} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaObjectSection
        data={dashboard.human_companion_council_model}
        title={labels.humanCompanionCouncil}
        listKey="roles"
      />

      {dashboard.perspectives_list.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.councilPerspectives}</h3>
          <ul className="space-y-2">
            {dashboard.perspectives_list.map((p) => (
              <PerspectiveRow key={p.id} perspective={p} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaObjectSection
        data={dashboard.decision_perspective_engine}
        title={labels.perspectiveEngine}
        listKey="types"
      />
      <MetaObjectSection
        data={dashboard.companion_advisory_engine}
        title={labels.companionAdvisory}
        listKey="supports"
      />

      {dashboard.stakeholder_impacts_list.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.stakeholderImpacts}</h3>
          <ul className="space-y-2">
            {dashboard.stakeholder_impacts_list.map((s) => (
              <StakeholderImpactRow key={s.id} impact={s} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaObjectSection
        data={dashboard.stakeholder_impact_review}
        title={labels.stakeholderMapping}
        listKey="groups"
      />
      <MetaObjectSection
        data={dashboard.disagreement_framework}
        title={labels.disagreementFramework}
        listKey="principles"
      />

      {dashboard.transparency_records_list.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.transparencyRecords}</h3>
          <ul className="space-y-2">
            {dashboard.transparency_records_list.map((t) => (
              <TransparencyRow key={t.id} record={t} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaObjectSection
        data={dashboard.decision_transparency_engine}
        title={labels.transparencyEngine}
        listKey="captures"
      />

      {dashboard.council_memory_list.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.councilMemory}</h3>
          <ul className="space-y-2">
            {dashboard.council_memory_list.map((m) => (
              <MemoryRow key={m.id} entry={m} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaObjectSection
        data={dashboard.council_memory_engine}
        title={labels.councilMemoryEngine}
        listKey="preserves"
      />

      {companionLimitations.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.companionLimitations}</h3>
          <ul className="space-y-2">
            {companionLimitations.map((item) => (
              <li key={String(item.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{String(item.label)}</span>
                {item.description ? (
                  <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveConnection}</h3>
          {Array.isArray(dashboard.self_love_connection.practices) ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {(dashboard.self_love_connection.practices as string[]).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <MetaGrid items={dashboard.security_requirements ?? []} title={labels.securityRequirements} />
      <CrossLinkGrid links={dashboard.integration_links} title={labels.crossLinks} />

      {dashboard.success_criteria?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="space-y-2">
            {dashboard.success_criteria.map((c) => (
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

      {dashboard.privacy_note ? (
        <p className="text-xs italic text-gray-500">{dashboard.privacy_note}</p>
      ) : null}
    </div>
  );
}
