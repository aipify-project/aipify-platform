"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseOrganizationalRelationshipAction,
  parseOrganizationalRelationshipIntelligence,
  type OrganizationalRelationshipIntelligence,
  type OrganizationalRelationshipIntelligenceLabels,
  type RelationshipEntity,
  type RelationshipRisk,
  type CompanionRelationshipRecommendation,
} from "@/lib/organizational-relationship-intelligence";
import { RelationshipStatusBadge } from "./RelationshipStatusBadge";

type Props = { labels: OrganizationalRelationshipIntelligenceLabels };

function formatWhen(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

function EntityCard({ entity, labels }: { entity: RelationshipEntity; labels: OrganizationalRelationshipIntelligenceLabels }) {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-zinc-900">{entity.title}</p>
          {entity.summary ? <p className="mt-1 text-sm text-zinc-600">{entity.summary}</p> : null}
          {entity.suggestedAction ? (
            <p className="mt-2 text-sm text-indigo-700">{labels.suggestedAction}: {entity.suggestedAction}</p>
          ) : null}
        </div>
        <RelationshipStatusBadge statusKey={entity.statusKey} labels={labels.status} />
      </div>
      <dl className="mt-3 grid gap-1 text-xs text-zinc-500 sm:grid-cols-2">
        <div><dt className="inline font-medium text-zinc-600">{labels.entity.owner}: </dt><dd className="inline">{entity.owner}</dd></div>
        {entity.department ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.department}: </dt><dd className="inline">{entity.department}</dd></div> : null}
        {entity.lastContactAt ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.lastContact}: </dt><dd className="inline">{formatWhen(entity.lastContactAt)}</dd></div> : null}
        {entity.openTasks ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.openTasks}: </dt><dd className="inline">{entity.openTasks}</dd></div> : null}
        {entity.openSupportCases ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.openSupportCases}: </dt><dd className="inline">{entity.openSupportCases}</dd></div> : null}
        {entity.revenueLabel ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.revenue}: </dt><dd className="inline">{entity.revenueLabel}</dd></div> : null}
        {entity.riskLevel ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.riskLevel}: </dt><dd className="inline">{entity.riskLevel}</dd></div> : null}
        {entity.contractExpiresAt ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.contractExpires}: </dt><dd className="inline">{formatWhen(entity.contractExpiresAt)}</dd></div> : null}
        {entity.blockedBy ? <div><dt className="inline font-medium text-zinc-600">{labels.entity.blockedBy}: </dt><dd className="inline">{entity.blockedBy}</dd></div> : null}
      </dl>
    </li>
  );
}

function SectionBlock({ title, items, labels, empty }: { title: string; items: RelationshipEntity[]; labels: OrganizationalRelationshipIntelligenceLabels; empty: string }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? <p className="text-sm text-zinc-500">{empty}</p> : (
        <ul className="space-y-3">{items.map((item) => <EntityCard key={item.id} entity={item} labels={labels} />)}</ul>
      )}
    </section>
  );
}

export function OrganizationalRelationshipIntelligencePanel({ labels }: Props) {
  const [data, setData] = useState<OrganizationalRelationshipIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/relationships");
    if (res.ok) setData(parseOrganizationalRelationshipIntelligence(await res.json()));
    else setData(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseOrganizationalRelationshipAction(await res.json()).ok) await load();
    setBusy(false);
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!data?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {data?.error ? <p className="mt-2 text-sm">{data.error}</p> : null}
      </div>
    );
  }

  const sections = [
    { title: labels.sections.customerRelationships, items: data.sections.customerRelationships },
    { title: labels.sections.vendorRelationships, items: data.sections.vendorRelationships },
    { title: labels.sections.partnerRelationships, items: data.sections.partnerRelationships },
    { title: labels.sections.employeeRelationships, items: data.sections.employeeRelationships },
    { title: labels.sections.projectRelationships, items: data.sections.projectRelationships },
    { title: labels.sections.dependencyMap, items: data.sections.dependencyMap },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {data.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{data.governanceNote}</p> : null}
          {data.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{data.privacyNote}</p> : null}
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      {data.companionRecommendations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.recommendations.title}</h2>
          <ul className="space-y-3">
            {data.companionRecommendations.map((rec: CompanionRelationshipRecommendation) => (
              <li key={rec.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{rec.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{rec.summary}</p>
                    {rec.suggestedAction ? <p className="mt-2 text-sm text-indigo-700">{labels.suggestedAction}: {rec.suggestedAction}</p> : null}
                  </div>
                  <RelationshipStatusBadge statusKey={rec.statusKey} labels={labels.status} />
                </div>
                {data.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("recommendation", rec.id, "acknowledge")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("recommendation", rec.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.canExecutive ? (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executive.title}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div><dt className="text-zinc-500">{labels.executive.relationshipRisks}</dt><dd className="text-xl font-semibold text-amber-700">{data.executiveDashboard.relationshipRisks}</dd></div>
            <div><dt className="text-zinc-500">{labels.executive.relationshipOpportunities}</dt><dd className="text-xl font-semibold text-emerald-700">{data.executiveDashboard.relationshipOpportunities}</dd></div>
          </dl>
        </section>
      ) : null}

      {sections.map((section) => (
        <SectionBlock key={section.title} title={section.title} items={section.items} labels={labels} empty={labels.emptyState} />
      ))}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.risks.title}</h2>
        {data.organizationalRisks.length === 0 ? (
          <p className="text-sm text-zinc-500">{labels.risks.empty}</p>
        ) : (
          <ul className="space-y-3">
            {data.organizationalRisks.map((risk: RelationshipRisk) => (
              <li key={risk.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{risk.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{risk.summary}</p>
                    {risk.suggestedAction ? <p className="mt-2 text-sm text-indigo-700">{labels.suggestedAction}: {risk.suggestedAction}</p> : null}
                  </div>
                  <RelationshipStatusBadge statusKey={risk.statusKey} labels={labels.status} />
                </div>
                {data.canManage ? (
                  <button type="button" disabled={busy} onClick={() => void handleAction("risk", risk.id, "resolve")} className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.resolve}</button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.timeline.title}</h2>
        {data.relationshipTimeline.length === 0 ? (
          <p className="text-sm text-zinc-500">{labels.timeline.empty}</p>
        ) : (
          <ul className="space-y-2">
            {data.relationshipTimeline.map((event) => (
              <li key={event.id} className="rounded-lg border border-zinc-100 px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900">{event.title}</p>
                  <span className="text-xs text-zinc-500">{formatWhen(event.occurredAt)}</span>
                </div>
                <p className="mt-1 text-zinc-600">{event.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/app/assistant/relationships" className="text-indigo-700 hover:text-indigo-800">{labels.links.personalRsi}</Link>
        <Link href="/app/relationship-intelligence-engine" className="text-indigo-700 hover:text-indigo-800">{labels.links.legacyEngine}</Link>
      </div>
    </div>
  );
}
