"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCorporateBrainAction,
  parseCorporateBrainCenter,
  type BrainSectionItem,
  type CompanionHistorianItem,
  type CorporateBrainCenter,
  type DecisionMemoryItem,
  type ExecutiveMemoryMetric,
  type HistoricalSearchItem,
  type IntelligenceItem,
  type KnowledgeGraphNode,
  type LessonItem,
  type MemoryEntity,
  type PreservationItem,
  type TimelineItem,
} from "@/lib/corporate-brain-center";
import type { CorporateBrainCenterLabels } from "@/lib/corporate-brain-center/labels";
import { BrainStatusBadge } from "./BrainStatusBadge";

type Props = { labels: CorporateBrainCenterLabels };

function SectionCard({ title, items }: { title: string; items: BrainSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-violet-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

export function CorporateBrainCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<CorporateBrainCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/corporate-brain");
    if (res.ok) setCenter(parseCorporateBrainCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/corporate-brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseCorporateBrainAction(await res.json()).ok) await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-violet-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/learning" className="text-violet-700 hover:underline">{labels.links.learning}</Link>
            <Link href="/app/knowledge/evolution" className="text-violet-700 hover:underline">{labels.links.knowledgeEvolution}</Link>
            <Link href="/app/settings/employee-knowledge" className="text-violet-700 hover:underline">{labels.links.employeeKnowledge}</Link>
            <Link href="/app/settings/business-dna" className="text-violet-700 hover:underline">{labels.links.businessDna}</Link>
            <Link href="/app/assistant/memory" className="text-violet-700 hover:underline">{labels.links.assistantMemory}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.brainSettings.brainEnabled ? labels.governanceControls.enabled : labels.governanceControls.disabled}</span>
          {center.brainSettings.knowledgePreservationEnabled ? <span>{labels.governanceControls.preservation}</span> : null}
        </div>
      </section>

      {center.executiveMemoryDashboard.length > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveMemoryDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.executiveMemoryDashboard.map((m: ExecutiveMemoryMetric) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard title={labels.sections.organizationalMemory} items={center.sections.organizational_memory} />
        <SectionCard title={labels.sections.businessKnowledge} items={center.sections.business_knowledge} />
        <SectionCard title={labels.sections.historicalDecisions} items={center.sections.historical_decisions} />
        <SectionCard title={labels.sections.lessonsLearned} items={center.sections.lessons_learned} />
        <SectionCard title={labels.sections.institutionalKnowledge} items={center.sections.institutional_knowledge} />
        <SectionCard title={labels.sections.knowledgeTimeline} items={center.sections.knowledge_timeline} />
        <SectionCard title={labels.sections.corporateIntelligence} items={center.sections.corporate_intelligence} />
      </div>

      {center.memoryEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.memoryEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.memoryEngine.map((e: MemoryEntity) => (
              <div key={e.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{e.entityName}</p>
                <p className="mt-1 text-xs text-zinc-500">{e.recordCountLabel}</p>
                <p className="mt-1 text-sm text-zinc-600">{e.connectionLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.organizationalTimeline.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.organizationalTimeline.title}</h2>
          <ul className="space-y-2 border-l-2 border-violet-200 pl-4">
            {center.organizationalTimeline.map((t: TimelineItem) => (
              <li key={t.id} className="relative rounded-lg border border-zinc-100 bg-white px-4 py-3">
                <span className="absolute -left-[1.35rem] top-4 h-2.5 w-2.5 rounded-full bg-violet-400 ring-2 ring-white" />
                <p className="text-xs font-medium text-violet-800">{t.timelineYear} {t.timelineMonth}</p>
                <p className="font-medium text-zinc-900">{t.eventTitle}</p>
                {t.outcomeLabel ? <p className="mt-1 text-sm text-zinc-600">{labels.outcome}: {t.outcomeLabel}</p> : null}
                {t.impactLabel ? <p className="mt-1 text-sm text-violet-900">{labels.impact}: {t.impactLabel}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.decisionMemory.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.decisionMemory.title}</h2>
          <ul className="space-y-3">
            {center.decisionMemory.map((d: DecisionMemoryItem) => (
              <li key={d.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{d.decisionTitle}</p>
                {d.reasonLabel ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.reason}:</span> {d.reasonLabel}</p> : null}
                {d.alternativesLabel ? <p className="mt-1 text-sm text-zinc-500"><span className="font-medium">{labels.alternatives}:</span> {d.alternativesLabel}</p> : null}
                {d.expectedOutcomeLabel ? <p className="mt-1 text-sm text-violet-900"><span className="font-medium">{labels.expectedOutcome}:</span> {d.expectedOutcomeLabel}</p> : null}
                {d.actualOutcomeLabel ? <p className="mt-1 text-sm text-zinc-700"><span className="font-medium">{labels.actualOutcome}:</span> {d.actualOutcomeLabel}</p> : null}
                {d.lessonsLabel ? <p className="mt-1 text-sm text-amber-900"><span className="font-medium">{labels.lesson}:</span> {d.lessonsLabel}</p> : null}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                  {d.ownerName ? <span>{labels.owner}: {d.ownerName}</span> : null}
                  {d.sourceLabel ? <span>{labels.source}: {d.sourceLabel}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.corporateKnowledgeGraph.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.corporateKnowledgeGraph.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.corporateKnowledgeGraph.map((n: KnowledgeGraphNode) => (
              <div key={n.id} className="rounded-xl border border-violet-100 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{n.nodeName}</p>
                <p className="mt-1 text-xs text-violet-800">{n.connectionCountLabel}</p>
                <p className="mt-1 text-sm text-zinc-600">{n.relationshipLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.lessonsLearnedEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.lessonsLearnedEngine.title}</h2>
          <ul className="space-y-3">
            {center.lessonsLearnedEngine.map((l: LessonItem) => (
              <li key={l.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{l.lessonType}</p>
                    <p className="mt-1 font-medium text-zinc-900">{l.title}</p>
                    {l.summary ? <p className="mt-1 text-sm text-zinc-600">{l.summary}</p> : null}
                    {l.lessonLabel ? <p className="mt-2 text-sm font-medium text-amber-900">{labels.lesson}: {l.lessonLabel}</p> : null}
                  </div>
                  <BrainStatusBadge statusKey={l.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.historicalSearch.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.historicalSearch.title}</h2>
          <ul className="space-y-3">
            {center.historicalSearch.map((h: HistoricalSearchItem) => (
              <li key={h.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <p className="font-medium text-zinc-900">{h.question}</p>
                {h.answer ? <p className="mt-2 text-sm text-zinc-700">{h.answer}</p> : null}
                {h.sourceLabel ? <p className="mt-2 text-xs text-zinc-500">{labels.source}: {h.sourceLabel}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.corporateIntelligenceLayer.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.corporateIntelligenceLayer.title}</h2>
          <ul className="space-y-2">
            {center.corporateIntelligenceLayer.map((i: IntelligenceItem) => (
              <li key={i.id} className="rounded-lg border border-zinc-100 bg-white px-4 py-3">
                <p className="text-xs font-medium uppercase text-zinc-500">{i.intelType.replace(/_/g, " ")}</p>
                <p className="font-medium text-zinc-900">{i.title}</p>
                {i.summary ? <p className="mt-1 text-sm text-zinc-600">{i.summary}</p> : null}
                {i.trendLabel ? <p className="mt-1 text-xs text-violet-700">{i.trendLabel}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.knowledgePreservation.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.knowledgePreservation.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.knowledgePreservation.map((p: PreservationItem) => (
              <div key={p.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="font-medium text-zinc-900">{p.title}</p>
                {p.summary ? <p className="mt-1 text-sm text-zinc-600">{p.summary}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionCorporateHistorian.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionHistorian.title}</h2>
          <ul className="space-y-3">
            {center.companionCorporateHistorian.map((item: CompanionHistorianItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.question}</p>
                {item.historicalContext ? <p className="mt-2 text-sm text-zinc-700">{item.historicalContext}</p> : null}
                {item.evidenceLabel ? <p className="mt-2 text-xs text-zinc-500"><span className="font-medium">{labels.companionHistorian.evidence}:</span> {item.evidenceLabel}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
