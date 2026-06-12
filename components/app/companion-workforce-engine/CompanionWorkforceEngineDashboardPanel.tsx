"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCompanionWorkforceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CompanionWorkforceDashboard,
  type IntegrationLink,
  type WorkforceCollaboration,
  type WorkforceConflict,
  type WorkforceMember,
  type WorkforceRoutingRule,
} from "@/lib/aipify/companion-workforce-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-teal-900">{objective.description}</p> : null}
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
    case "resolved":
    case "governed":
    case "guided":
      return "bg-emerald-100 text-emerald-800";
    case "assisted":
    case "moderate":
    case "pending":
    case "pending_review":
      return "bg-amber-100 text-amber-800";
    case "important":
    case "critical":
    case "in_review":
    case "escalated":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function MemberRow({ member }: { member: WorkforceMember }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{member.display_name}</span>
        <div className="flex flex-wrap gap-2">
          {member.governance_tier ? (
            <span className={`rounded px-2 py-0.5 text-xs capitalize ${badgeClass(member.governance_tier)}`}>
              {member.governance_tier}
            </span>
          ) : null}
          {member.status ? (
            <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(member.status)}`}>{member.status}</span>
          ) : null}
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {member.department}
        {member.companion_key ? ` · ${member.companion_key}` : ""}
      </p>
      {member.role_description ? <p className="mt-1 text-xs text-gray-600">{member.role_description}</p> : null}
      {member.route_href ? (
        <Link href={member.route_href} className="mt-2 inline-block text-xs font-medium text-teal-700 hover:underline">
          Open companion surface →
        </Link>
      ) : null}
    </li>
  );
}

function CollaborationRow({ item }: { item: WorkforceCollaboration }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{item.title}</span>
        {item.status ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(item.status)}`}>{item.status}</span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-gray-500 capitalize">
        {item.companion_a} + {item.companion_b}
        {item.collaboration_type ? ` · ${item.collaboration_type.replace(/_/g, " ")}` : ""}
      </p>
      {item.summary ? <p className="mt-1 text-xs text-gray-600">{item.summary}</p> : null}
    </li>
  );
}

function RoutingRow({ rule }: { rule: WorkforceRoutingRule }) {
  return (
    <li className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{rule.title}</span>
        {rule.rule_type ? (
          <span className="text-xs capitalize text-gray-500">{rule.rule_type.replace(/_/g, " ")}</span>
        ) : null}
      </div>
      {rule.summary ? <p className="mt-1 text-xs text-gray-600">{rule.summary}</p> : null}
    </li>
  );
}

function ConflictRow({ conflict }: { conflict: WorkforceConflict }) {
  return (
    <li className="rounded-lg border border-rose-100 bg-rose-50/20 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{conflict.title}</span>
        {conflict.human_review_status ? (
          <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(conflict.human_review_status)}`}>
            {conflict.human_review_status.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {conflict.summary ? <p className="mt-1 text-xs text-gray-600">{conflict.summary}</p> : null}
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
          <div key={String(item.key)} className="rounded-lg border border-teal-100 bg-white px-3 py-2 text-sm">
            <span className="font-medium text-teal-900">{String(item.label ?? item.key)}</span>
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
            className="rounded-lg border border-teal-100 bg-white px-3 py-2 text-sm hover:border-teal-300"
          >
            <span className="font-medium text-teal-900">{link.label}</span>
            {link.note ? <p className="mt-1 text-xs text-gray-500">{link.note}</p> : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CompanionWorkforceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CompanionWorkforceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/aipify/companion-workforce-engine/dashboard");
      if (!res.ok) throw new Error(await res.text());
      const data = parseCompanionWorkforceDashboard(await res.json());
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

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (error || !dashboard?.has_customer) {
    return <p className="text-sm text-rose-600">{error ?? labels.loading}</p>;
  }

  const healthIndicators = Array.isArray(dashboard.companion_health_engine?.indicators)
    ? (dashboard.companion_health_engine.indicators as Record<string, unknown>[])
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{labels.blueprintTitle}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-800">{labels.workforceScore}</p>
            <p className="text-3xl font-bold text-teal-900">{dashboard.workforce_score ?? 0}</p>
            {dashboard.human_oversight_required ? (
              <p className="mt-2 text-xs text-teal-600">{labels.humanOversightRequired}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.membersActive}</span>
            <p className="text-xl font-semibold">{dashboard.members_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.collaborationsActive}</span>
            <p className="text-xl font-semibold">{dashboard.collaborations_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.routingRulesActive}</span>
            <p className="text-xl font-semibold">{dashboard.routing_rules_active ?? 0}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-teal-600">{labels.conflictsPending}</span>
            <p className="text-xl font-semibold">{dashboard.conflicts_pending ?? 0}</p>
          </div>
        </div>
        {dashboard.safety_note ? (
          <p className="mt-4 text-xs italic text-teal-700">{dashboard.safety_note}</p>
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

      <MetaGrid items={dashboard.companion_workforce_center} title={labels.workforceCenter} />

      {dashboard.companion_workforce_objectives?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.blueprintObjectives}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.companion_workforce_objectives.map((obj) => (
              <ObjectiveCard key={obj.key} objective={obj} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.members.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.companionDirectory}</h3>
          <ul className="space-y-2">{dashboard.members.map((m) => <MemberRow key={m.id} member={m} />)}</ul>
        </section>
      ) : null}

      <MetaGrid items={dashboard.collaboration_model} title={labels.collaborationModel} />

      {dashboard.collaborations.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.activeCollaborations}</h3>
          <ul className="space-y-2">
            {dashboard.collaborations.map((c) => (
              <CollaborationRow key={c.id} item={c} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaGrid items={dashboard.workforce_orchestration} title={labels.workforceOrchestration} />

      {dashboard.routing_rules.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.routingRules}</h3>
          <ul className="space-y-2">
            {dashboard.routing_rules.map((r) => (
              <RoutingRow key={r.id} rule={r} />
            ))}
          </ul>
        </section>
      ) : null}

      <MetaGrid items={dashboard.responsibility_framework} title={labels.responsibilityFramework} />
      <MetaGrid items={dashboard.human_collaboration_model} title={labels.humanCollaboration} />

      {healthIndicators.length ? (
        <MetaGrid items={healthIndicators} title={labels.companionHealth} />
      ) : null}

      <MetaGrid items={dashboard.conflict_management} title={labels.conflictManagement} />

      {dashboard.conflicts.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.openConflicts}</h3>
          <ul className="space-y-2">
            {dashboard.conflicts.map((f) => (
              <ConflictRow key={f.id} conflict={f} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_limitations.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.companionLimitations}</h3>
          <ul className="space-y-2">
            {dashboard.companion_limitations.map((item) => (
              <li key={String(item.key)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{String(item.label)}</span>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <MetaGrid items={dashboard.self_love_connection} title={labels.selfLoveConnection} />
      <MetaGrid items={dashboard.security_requirements} title={labels.securityRequirements} />

      <CrossLinkGrid links={dashboard.integration_links} title={labels.crossLinks} />

      {dashboard.companion_workforce_success_criteria?.length ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <div className="space-y-2">
            {dashboard.companion_workforce_success_criteria.map((c) => (
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

      {dashboard.companion_workforce_privacy_note ? (
        <p className="text-xs italic text-gray-500">{dashboard.companion_workforce_privacy_note}</p>
      ) : null}
    </div>
  );
}
