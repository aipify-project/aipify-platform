"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseKnowledgeEvolutionAction,
  parseKnowledgeEvolutionEngine,
  type KnowledgeCandidate,
  type KnowledgeEvolutionEngine,
  type KnowledgeEvolutionEngineLabels,
  type KnowledgeEvolutionItem,
} from "@/lib/knowledge-evolution-engine";
import { KnowledgeEvolutionStatusBadge } from "./KnowledgeEvolutionStatusBadge";

type Props = { labels: KnowledgeEvolutionEngineLabels };

function formatWhen(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

function EvolutionItemCard({
  item,
  labels,
  busy,
  canManage,
  onAction,
}: {
  item: KnowledgeEvolutionItem;
  labels: KnowledgeEvolutionEngineLabels;
  busy: boolean;
  canManage: boolean;
  onAction: (id: string, action: string) => void;
}) {
  const improvementLabel =
    item.suggestedImprovementType &&
    item.suggestedImprovementType in labels.improvementTypes
      ? labels.improvementTypes[item.suggestedImprovementType as keyof typeof labels.improvementTypes]
      : item.suggestedImprovementType;

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-zinc-900">{item.title}</p>
          <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
          {item.suggestedAction ? (
            <p className="mt-2 text-sm text-indigo-700">
              {labels.suggestedAction}: {item.suggestedAction}
              {improvementLabel ? ` · ${improvementLabel}` : ""}
            </p>
          ) : null}
        </div>
        <KnowledgeEvolutionStatusBadge statusKey={item.statusKey} labels={labels.status} />
      </div>
      <dl className="mt-3 grid gap-1 text-xs text-zinc-500 sm:grid-cols-2">
        <div><dt className="inline font-medium text-zinc-600">{labels.governance.source}: </dt><dd className="inline">{item.source}</dd></div>
        <div><dt className="inline font-medium text-zinc-600">{labels.governance.owner}: </dt><dd className="inline">{item.owner}</dd></div>
        <div><dt className="inline font-medium text-zinc-600">{labels.governance.department}: </dt><dd className="inline">{item.department || "—"}</dd></div>
        {item.version ? <div><dt className="inline font-medium text-zinc-600">{labels.governance.version}: </dt><dd className="inline">{item.version}</dd></div> : null}
        {item.reviewDate ? <div><dt className="inline font-medium text-zinc-600">{labels.governance.reviewDate}: </dt><dd className="inline">{formatWhen(item.reviewDate)}</dd></div> : null}
        {item.lastUpdatedAt ? <div><dt className="inline font-medium text-zinc-600">{labels.governance.lastUpdated}: </dt><dd className="inline">{formatWhen(item.lastUpdatedAt)}</dd></div> : null}
        {item.usageFrequency ? <div><dt className="inline font-medium text-zinc-600">{labels.governance.usage}: </dt><dd className="inline">{item.usageFrequency}</dd></div> : null}
        {item.occurrenceCount ? <div><dt className="inline font-medium text-zinc-600">{labels.governance.occurrences}: </dt><dd className="inline">{item.occurrenceCount}</dd></div> : null}
      </dl>
      {canManage && item.itemType === "signal" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => onAction(item.id, "resolve_signal")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.resolve}</button>
          <button type="button" disabled={busy} onClick={() => onAction(item.id, "dismiss_signal")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
        </div>
      ) : null}
    </li>
  );
}

function CandidateCard({
  candidate,
  labels,
  busy,
  canManage,
  onAction,
}: {
  candidate: KnowledgeCandidate;
  labels: KnowledgeEvolutionEngineLabels;
  busy: boolean;
  canManage: boolean;
  onAction: (id: string, action: string) => void;
}) {
  const typeLabel =
    candidate.candidateType in labels.candidateTypes
      ? labels.candidateTypes[candidate.candidateType as keyof typeof labels.candidateTypes]
      : candidate.candidateType;

  return (
    <li className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{typeLabel}</p>
          <p className="mt-1 font-medium text-zinc-900">{candidate.title}</p>
          <p className="mt-1 text-sm text-zinc-600">{candidate.summary}</p>
          {candidate.suggestedAction ? <p className="mt-2 text-sm text-indigo-800">{candidate.suggestedAction}</p> : null}
          {candidate.approvalRequired ? <p className="mt-1 text-xs text-amber-800">{labels.supportCandidates.approvalRequired}</p> : null}
        </div>
        <KnowledgeEvolutionStatusBadge statusKey="waiting" labels={labels.status} />
      </div>
      {canManage && candidate.status === "pending_approval" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => onAction(candidate.id, "approve")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.approve}</button>
          <button type="button" disabled={busy} onClick={() => onAction(candidate.id, "reject")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.reject}</button>
        </div>
      ) : null}
    </li>
  );
}

function SectionBlock({
  title,
  items,
  labels,
  busy,
  canManage,
  onAction,
}: {
  title: string;
  items: KnowledgeEvolutionItem[];
  labels: KnowledgeEvolutionEngineLabels;
  busy: boolean;
  canManage: boolean;
  onAction: (id: string, action: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{labels.emptyState}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <EvolutionItemCard key={item.id} item={item} labels={labels} busy={busy} canManage={canManage} onAction={onAction} />
          ))}
        </ul>
      )}
    </section>
  );
}

function IntelligenceList({ title, items }: { title: string; items: { title: string; usageFrequency?: number; occurrenceCount?: number }[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-zinc-600">
        {items.map((item) => (
          <li key={item.title}>
            {item.title}
            {item.usageFrequency ? ` · ${item.usageFrequency}` : ""}
            {item.occurrenceCount ? ` · ${item.occurrenceCount}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KnowledgeEvolutionEnginePanel({ labels }: Props) {
  const [engine, setEngine] = useState<KnowledgeEvolutionEngine | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/knowledge/evolution");
    if (res.ok) setEngine(parseKnowledgeEvolutionEngine(await res.json()));
    else setEngine(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/knowledge/evolution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", candidate_id: id, manage_action: action }),
    });
    const result = parseKnowledgeEvolutionAction(await res.json());
    if (result.ok) await load();
    setBusy(false);
  };

  if (loading && !engine) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!engine?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {engine?.error ? <p className="mt-2 text-sm">{engine.error}</p> : null}
      </div>
    );
  }

  const sectionBlocks = [
    { title: labels.sections.knowledgeOpportunities, items: engine.sections.knowledgeOpportunities },
    { title: labels.sections.missingKnowledge, items: engine.sections.missingKnowledge },
    { title: labels.sections.suggestedImprovements, items: engine.sections.suggestedImprovements },
    { title: labels.sections.outdatedContent, items: engine.sections.outdatedContent },
    { title: labels.sections.highRiskGaps, items: engine.sections.highRiskGaps },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {engine.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{engine.governanceNote}</p> : null}
          {engine.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{engine.privacyNote}</p> : null}
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.healthTitle}</h2>
        <p className="mt-1 text-3xl font-bold text-teal-800">{engine.knowledgeHealth.score}<span className="text-lg font-medium text-zinc-600"> / 100</span></p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-4 text-sm">
          <div><dt className="text-zinc-500">{labels.coverage}</dt><dd className="font-semibold text-zinc-900">{engine.knowledgeHealth.coveragePct}%</dd></div>
          <div><dt className="text-zinc-500">{labels.freshness}</dt><dd className="font-semibold text-zinc-900">{engine.knowledgeHealth.freshnessPct}%</dd></div>
          <div><dt className="text-zinc-500">{labels.pendingApprovals}</dt><dd className="font-semibold text-zinc-900">{engine.knowledgeHealth.pendingApprovals}</dd></div>
          <div><dt className="text-zinc-500">{labels.openGaps}</dt><dd className="font-semibold text-zinc-900">{engine.knowledgeHealth.openGaps}</dd></div>
        </dl>
      </section>

      {engine.canExecutive ? (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executive.title}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-5 text-sm">
            <div><dt className="text-zinc-500">{labels.executive.knowledgeHealth}</dt><dd className="text-xl font-semibold text-zinc-900">{engine.executiveDashboard.knowledgeHealth}</dd></div>
            <div><dt className="text-zinc-500">{labels.executive.knowledgeCoverage}</dt><dd className="text-xl font-semibold text-zinc-900">{engine.executiveDashboard.knowledgeCoverage}%</dd></div>
            <div><dt className="text-zinc-500">{labels.executive.knowledgeRisks}</dt><dd className="text-xl font-semibold text-amber-700">{engine.executiveDashboard.knowledgeRisks}</dd></div>
            <div><dt className="text-zinc-500">{labels.executive.knowledgeGrowth}</dt><dd className="text-xl font-semibold text-emerald-700">{engine.executiveDashboard.knowledgeGrowth}</dd></div>
            <div><dt className="text-zinc-500">{labels.executive.pendingApprovals}</dt><dd className="text-xl font-semibold text-indigo-700">{engine.executiveDashboard.pendingApprovals}</dd></div>
          </dl>
        </section>
      ) : null}

      {sectionBlocks.map((block) => (
        <SectionBlock key={block.title} title={block.title} items={block.items} labels={labels} busy={busy} canManage={engine.canManage ?? false} onAction={handleAction} />
      ))}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.supportCandidates.title}</h2>
        {engine.supportCandidates.length === 0 ? (
          <p className="text-sm text-zinc-500">{labels.supportCandidates.empty}</p>
        ) : (
          <ul className="space-y-3">
            {engine.supportCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} labels={labels} busy={busy} canManage={engine.canManage ?? false} onAction={handleAction} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.intelligence.title}</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <IntelligenceList title={labels.intelligence.mostValuableDocuments} items={engine.organizationalIntelligence.mostValuableDocuments} />
          <IntelligenceList title={labels.intelligence.mostUsedProcedures} items={engine.organizationalIntelligence.mostUsedProcedures} />
          <IntelligenceList title={labels.intelligence.mostSearchedTopics} items={engine.organizationalIntelligence.mostSearchedTopics} />
          <IntelligenceList title={labels.intelligence.mostRequestedInformation} items={engine.organizationalIntelligence.mostRequestedInformation} />
        </div>
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/app/knowledge-center" className="text-indigo-700 hover:text-indigo-800">{labels.links.knowledgeCenter}</Link>
        <Link href="/app/knowledge-center/knowledge-evolution" className="text-indigo-700 hover:text-indigo-800">{labels.links.legacyCenter}</Link>
        <Link href="/app/settings/employee-knowledge" className="text-indigo-700 hover:text-indigo-800">{labels.links.employeeKnowledge}</Link>
      </div>
    </div>
  );
}
