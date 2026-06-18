"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseOrganizationalConsciousnessAction,
  parseOrganizationalConsciousnessCenter,
  type AlignmentItem,
  type AwarenessItem,
  type CoherenceItem,
  type CompanionAdvisorItem,
  type ConsciousnessSectionItem,
  type EmergingSignalItem,
  type ExecutiveAwarenessMetric,
  type LongTermItem,
  type NarrativeItem,
  type OrganizationalConsciousnessCenter,
  type ReflectionItem,
  type StrategicItem,
} from "@/lib/organizational-consciousness-center";
import type { OrganizationalConsciousnessCenterLabels } from "@/lib/organizational-consciousness-center/labels";
import { ConsciousnessStatusBadge } from "./ConsciousnessStatusBadge";

type Props = { labels: OrganizationalConsciousnessCenterLabels };

function SectionCard({ title, items }: { title: string; items: ConsciousnessSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? (
        <p className="mt-2 text-lg font-bold text-violet-900">
          {item.metricLabel}: {item.metricValue}
        </p>
      ) : null}
    </div>
  );
}

export function OrganizationalConsciousnessCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalConsciousnessCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/consciousness");
    if (res.ok) setCenter(parseOrganizationalConsciousnessCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/consciousness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseOrganizationalConsciousnessAction(await res.json()).ok) await load();
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
            <Link href="/app/intelligence/corporate-brain" className="text-violet-700 hover:underline">{labels.links.corporateBrain}</Link>
            <Link href="/app/executive/board" className="text-violet-700 hover:underline">{labels.links.executiveBoard}</Link>
            <Link href="/app/governance/trust" className="text-violet-700 hover:underline">{labels.links.governanceTrust}</Link>
            <Link href="/app/intelligence/strategy" className="text-violet-700 hover:underline">{labels.links.strategicIntelligence}</Link>
            <Link href="/app/aipify-enterprise-organizational-consciousness-engine" className="text-violet-700 hover:underline">{labels.links.legacyConsciousness}</Link>
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.refresh}
        </button>
      </div>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>
            {center.consciousnessSettings.consciousnessEnabled
              ? labels.governanceControls.enabled
              : labels.governanceControls.disabled}
          </span>
          {center.consciousnessSettings.humanControlRequired ? (
            <span>{labels.governanceControls.humanControl}</span>
          ) : null}
        </div>
      </section>

      {center.executiveAwarenessDashboard.length > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveAwarenessDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveAwarenessDashboard.map((m: ExecutiveAwarenessMetric) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">
                  {m.metricKey.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
                <div className="mt-2">
                  <ConsciousnessStatusBadge statusKey={m.statusKey} labels={labels.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard title={labels.sections.organizationalAwareness} items={center.sections.organizational_awareness} />
        <SectionCard title={labels.sections.strategicAwareness} items={center.sections.strategic_awareness} />
        <SectionCard title={labels.sections.operationalAwareness} items={center.sections.operational_awareness} />
        <SectionCard title={labels.sections.culturalAwareness} items={center.sections.cultural_awareness} />
        <SectionCard title={labels.sections.organizationalAlignment} items={center.sections.organizational_alignment} />
        <SectionCard title={labels.sections.longTermTrends} items={center.sections.long_term_trends} />
        <SectionCard title={labels.sections.emergingSignals} items={center.sections.emerging_signals} />
      </div>

      {center.awarenessEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.awarenessEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.awarenessEngine.map((a: AwarenessItem) => (
              <div key={a.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{a.areaName}</p>
                  <ConsciousnessStatusBadge statusKey={a.statusKey} labels={labels.status} />
                </div>
                {a.evaluationLabel ? (
                  <p className="mt-2 text-sm text-zinc-600">
                    <span className="font-medium">{labels.evaluation}:</span> {a.evaluationLabel}
                  </p>
                ) : null}
                {a.signalLabel ? (
                  <p className="mt-1 text-sm text-violet-900">
                    <span className="font-medium">{labels.signal}:</span> {a.signalLabel}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.organizationalAlignmentAnalysis.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.organizationalAlignmentAnalysis.title}</h2>
          <ul className="space-y-3">
            {center.organizationalAlignmentAnalysis.map((item: AlignmentItem) => (
              <li key={item.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{item.alignmentType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{item.title}</p>
                    {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                    {item.evidenceLabel ? (
                      <p className="mt-2 text-xs text-zinc-500">
                        <span className="font-medium">{labels.evidence}:</span> {item.evidenceLabel}
                      </p>
                    ) : null}
                  </div>
                  <ConsciousnessStatusBadge statusKey={item.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("alignment", item.id, "acknowledge")}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
                    >
                      {labels.actions.acknowledge}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("alignment", item.id, "resolve")}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
                    >
                      {labels.actions.resolve}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("alignment", item.id, "escalate")}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
                    >
                      {labels.actions.escalate}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.strategicAwarenessLayer.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.strategicAwarenessLayer.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.strategicAwarenessLayer.map((s: StrategicItem) => (
              <div key={s.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500">{s.strategicType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{s.title}</p>
                {s.trendLabel ? <p className="mt-2 text-sm text-blue-900">{s.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.organizationalNarrativeEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.organizationalNarrativeEngine.title}</h2>
          <ul className="space-y-3">
            {center.organizationalNarrativeEngine.map((n: NarrativeItem) => (
              <li key={n.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="text-xs font-medium uppercase text-violet-800">{n.narrativeType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{n.title}</p>
                {n.narrative ? <p className="mt-2 text-sm text-zinc-700">{n.narrative}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.emergingSignalDetection.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.emergingSignalDetection.title}</h2>
          <ul className="space-y-3">
            {center.emergingSignalDetection.map((s: EmergingSignalItem) => (
              <li key={s.id} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-amber-800">{s.signalType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{s.title}</p>
                    {s.summary ? <p className="mt-1 text-sm text-zinc-600">{s.summary}</p> : null}
                    {s.evidenceLabel ? (
                      <p className="mt-2 text-xs text-zinc-500">
                        <span className="font-medium">{labels.evidence}:</span> {s.evidenceLabel}
                      </p>
                    ) : null}
                  </div>
                  <ConsciousnessStatusBadge statusKey={s.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("emerging_signal", s.id, "acknowledge")}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
                    >
                      {labels.actions.acknowledge}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("emerging_signal", s.id, "dismiss")}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
                    >
                      {labels.actions.dismiss}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.organizationalCoherenceEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.organizationalCoherenceEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.organizationalCoherenceEngine.map((c: CoherenceItem) => (
              <div key={c.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="font-medium text-zinc-900">{c.dimensionName}</p>
                {c.alignmentScoreLabel ? (
                  <p className="mt-2 text-lg font-bold text-emerald-900">{c.alignmentScoreLabel}</p>
                ) : null}
                <div className="mt-2">
                  <ConsciousnessStatusBadge statusKey={c.statusKey} labels={labels.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.longTermIntelligenceLayer.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.longTermIntelligenceLayer.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.longTermIntelligenceLayer.map((l: LongTermItem) => (
              <div key={l.id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-sm font-semibold text-indigo-900">{l.horizonLabel}</p>
                {l.trendSummary ? <p className="mt-2 text-sm text-zinc-700">{l.trendSummary}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.reflectionEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.reflectionEngine.title}</h2>
          <ul className="space-y-3">
            {center.reflectionEngine.map((r: ReflectionItem) => (
              <li key={r.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{r.reflectionType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{r.title}</p>
                    {r.summary ? <p className="mt-1 text-sm text-zinc-600">{r.summary}</p> : null}
                  </div>
                  <ConsciousnessStatusBadge statusKey={r.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.companionStrategicAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionStrategicAdvisor.map((item: CompanionAdvisorItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.question}</p>
                {item.insight ? <p className="mt-2 text-sm text-zinc-700">{item.insight}</p> : null}
                {item.evidenceLabel ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    <span className="font-medium">{labels.companionAdvisor.evidence}:</span> {item.evidenceLabel}
                  </p>
                ) : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("companion", item.id, "acknowledge")}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
                    >
                      {labels.actions.acknowledge}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("companion", item.id, "dismiss")}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
                    >
                      {labels.actions.dismiss}
                    </button>
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
