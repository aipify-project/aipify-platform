"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseJointOperationsDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type IntegrationLink,
  type JointOperationsDashboard,
  type JointPartnership,
  type JointSharedObjective,
  type JointSharedWorkspace,
} from "@/lib/aipify/joint-operations-engine";

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

function badgeClass(value?: string) {
  switch (value) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "draft":
    case "pending":
    case "proposed":
    case "pending_approval":
      return "bg-amber-100 text-amber-800";
    case "paused":
    case "ended":
    case "rejected":
    case "archived":
      return "bg-stone-100 text-stone-700";
    case "executive":
    case "elevated":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function PartnershipRow({ partnership }: { partnership: JointPartnership }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{partnership.partner_display_name}</span>
        <div className="flex flex-wrap gap-2">
          {partnership.partner_type ? (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-700">
              {partnership.partner_type.replace(/_/g, " ")}
            </span>
          ) : null}
          {partnership.governance_tier ? (
            <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(partnership.governance_tier)}`}>
              {partnership.governance_tier}
            </span>
          ) : null}
          {partnership.status ? (
            <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(partnership.status)}`}>
              {partnership.status.replace(/_/g, " ")}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function WorkspaceRow({ workspace }: { workspace: JointSharedWorkspace }) {
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
              {workspace.status.replace(/_/g, " ")}
            </span>
          ) : null}
        </div>
      </div>
      {workspace.participating_org_count != null ? (
        <p className="mt-1 text-xs text-gray-500">
          {workspace.participating_org_count} participating org(s)
        </p>
      ) : null}
    </li>
  );
}

function ObjectiveRow({ objective }: { objective: JointSharedObjective }) {
  return (
    <li className="rounded-lg border border-sky-100 bg-sky-50/20 px-3 py-2 text-sm">
      <span className="font-medium">{objective.title}</span>
      {objective.outcome_summary ? (
        <p className="mt-1 text-xs text-gray-600">{objective.outcome_summary}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {objective.time_horizon ? (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
            {objective.time_horizon.replace(/_/g, " ")}
          </span>
        ) : null}
        {objective.status ? (
          <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(objective.status)}`}>
            {objective.status}
          </span>
        ) : null}
      </div>
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
          <div key={String(item.key)} className="rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm">
            <span className="font-medium text-sky-900">{String(item.label ?? item.key)}</span>
            {item.description ? (
              <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p>
            ) : null}
            {item.cross_link ? (
              <Link
                href={String(item.cross_link)}
                className="mt-2 inline-block text-xs font-medium text-sky-700 hover:underline"
              >
                Related →
              </Link>
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
            className="rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm hover:border-sky-300"
          >
            <span className="font-medium text-sky-900">{link.label}</span>
            {link.relationship ? <p className="mt-1 text-xs text-gray-500">{link.relationship}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function JointOperationsEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<JointOperationsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/aipify/joint-operations-engine/dashboard");
      if (!res.ok) throw new Error(await res.text());
      setDashboard(parseJointOperationsDashboard(await res.json()));
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
    (dashboard.joint_operations_center_meta as Record<string, unknown> | undefined)?.capabilities,
  )
    ? ((dashboard.joint_operations_center_meta as Record<string, unknown>).capabilities as Record<
        string,
        unknown
      >[])
    : [];

  const companionLimitations = dashboard.companion_limitations_meta?.must_avoid ?? [];

  const securityRequirements = Array.isArray(
    (dashboard.security_requirements_meta as Record<string, unknown> | undefined)?.requirements,
  )
    ? ((dashboard.security_requirements_meta as Record<string, unknown>).requirements as Record<
        string,
        unknown
      >[])
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-sky-700">{labels.blueprintTitle}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-sky-800">{labels.collaborationScore}</p>
            <p className="text-3xl font-bold text-sky-900">{dashboard.collaboration_score ?? 0}</p>
            {dashboard.participation_opt_in_required ? (
              <p className="mt-2 text-xs text-sky-600">{labels.optInRequired}</p>
            ) : null}
            {dashboard.executive_approval_required ? (
              <p className="mt-1 text-xs text-sky-600">{labels.executiveApprovalRequired}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.partnershipsCount}</span>
            <p className="text-xl font-semibold">{dashboard.partnerships_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.activePartnerships}</span>
            <p className="text-xl font-semibold">{dashboard.active_partnerships_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.sharedWorkspaces}</span>
            <p className="text-xl font-semibold">{dashboard.shared_workspaces_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-sky-600">{labels.sharedObjectives}</span>
            <p className="text-xl font-semibold">{dashboard.shared_objectives_count ?? 0}</p>
          </div>
        </div>
        {dashboard.safety_note ? (
          <p className="mt-4 text-xs italic text-sky-700">{dashboard.safety_note}</p>
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

      <MetaGrid items={centerCapabilities} title={labels.jointOperationsCenter} />

      {dashboard.joint_operations_objectives?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.joint_operations_objectives.map((obj) => (
              <ObjectiveCard key={obj.key} objective={obj} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.partnerships.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.partnerships}</h3>
          <ul className="space-y-2">
            {dashboard.partnerships.map((p) => (
              <PartnershipRow key={p.id} partnership={p} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.shared_workspaces.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.sharedWorkspacesList}</h3>
          <ul className="space-y-2">
            {dashboard.shared_workspaces.map((w) => (
              <WorkspaceRow key={w.id} workspace={w} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.shared_objectives.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.sharedObjectivesList}</h3>
          <ul className="space-y-2">
            {dashboard.shared_objectives.map((o) => (
              <ObjectiveRow key={o.id} objective={o} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaObjectSection
        data={dashboard.collaboration_framework_engine_meta}
        title={labels.collaborationFramework}
        listKey="domains"
      />
      <MetaObjectSection
        data={dashboard.shared_workspace_engine_meta}
        title={labels.sharedWorkspaceEngine}
        listKey="features"
      />
      <MetaObjectSection
        data={dashboard.joint_governance_engine_meta}
        title={labels.jointGovernance}
        listKey="controls"
      />
      <MetaObjectSection
        data={dashboard.cross_organizational_companion_engine_meta}
        title={labels.crossOrgCompanion}
        listKey="capabilities"
      />
      <MetaObjectSection
        data={dashboard.partner_experience_engine_meta}
        title={labels.partnerExperience}
        listKey="areas"
      />
      <MetaObjectSection
        data={dashboard.shared_objectives_framework_meta}
        title={labels.sharedObjectivesFramework}
        listKey="elements"
      />
      <MetaObjectSection
        data={dashboard.collaboration_memory_engine_meta}
        title={labels.collaborationMemory}
        listKey="preserves"
      />

      {companionLimitations.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.companionLimitations}</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            {companionLimitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection_meta ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveConnection}</h3>
          {Array.isArray(dashboard.self_love_connection_meta.values) ? (
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {(dashboard.self_love_connection_meta.values as string[]).map((v) => (
                <li key={v} className="capitalize">
                  {v.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <MetaGrid items={securityRequirements} title={labels.securityRequirements} />
      <CrossLinkGrid links={dashboard.integration_links} title={labels.crossLinks} />

      {dashboard.joint_operations_success_criteria?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="space-y-2">
            {dashboard.joint_operations_success_criteria.map((c) => (
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

      {dashboard.joint_operations_privacy_note ? (
        <p className="text-xs italic text-gray-500">{dashboard.joint_operations_privacy_note}</p>
      ) : null}
    </div>
  );
}
