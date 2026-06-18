"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseBusinessOsCommandCenter,
  parseBusinessOsCommandCenterAction,
  type BusinessOsCommandCenter,
  type CommandSectionItem,
  type CompanionItem,
  type CrossIntelligenceItem,
  type EventStreamItem,
  type MissionMetric,
  type PulseMetric,
  type RadarItem,
  type ReadinessItem,
  type WidgetItem,
} from "@/lib/business-os-command-center";
import type { BusinessOsCommandCenterLabels } from "@/lib/business-os-command-center/labels";
import { getPulsePeriodLabel, getRadarTierLabel } from "@/lib/business-os-command-center/labels";
import { CommandCenterStatusBadge } from "./CommandCenterStatusBadge";

type Props = { labels: BusinessOsCommandCenterLabels };

function SectionOverview({ title, items }: { title: string; items: CommandSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? (
        <p className="mt-2 text-lg font-bold text-indigo-900">{item.metricLabel}: {item.metricValue}</p>
      ) : null}
    </div>
  );
}

export function BusinessOsCommandCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<BusinessOsCommandCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pulsePeriod, setPulsePeriod] = useState<"today" | "this_week" | "this_month">("today");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/command-center");
    if (res.ok) setCenter(parseBusinessOsCommandCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (
    itemType: string,
    id: string,
    action: string,
    payload?: Record<string, unknown>,
  ) => {
    setBusy(true);
    const res = await fetch("/api/command-center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action, payload }),
    });
    if (parseBusinessOsCommandCenterAction(await res.json()).ok) await load();
    setBusy(false);
  };

  const pulseForPeriod = useMemo(() => {
    if (!center) return [];
    return center.liveBusinessPulse.filter((p) => p.periodKey === pulsePeriod);
  }, [center, pulsePeriod]);

  const visibleWidgets = useMemo(() => {
    if (!center) return [];
    return center.widgets.filter((w) => !w.isHidden).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [center]);

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

  const briefing = center.morningBriefing;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app" className="text-indigo-700 hover:underline">{labels.links.portalHome}</Link>
            {center.links?.desktopConnect ? (
              <Link href={center.links.desktopConnect} className="text-indigo-700 hover:underline">{labels.links.desktopConnect}</Link>
            ) : null}
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      {briefing.greeting ? (
        <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">{labels.morningBriefing.title}</h2>
          <p className="mt-2 text-xl font-bold">{briefing.greeting}</p>
          {briefing.sinceLoginSummary ? <p className="mt-2 text-sm text-indigo-100">{labels.morningBriefing.sinceLogin}: {briefing.sinceLoginSummary}</p> : null}
          {briefing.highlights.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {briefing.highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-2 text-sm">
                  <CommandCenterStatusBadge statusKey={h.statusKey} labels={labels.status} />
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {briefing.recommendedActions.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm font-medium text-indigo-200">{labels.morningBriefing.recommendedActions}</p>
              <ol className="mt-2 space-y-2">
                {briefing.recommendedActions.map((a) => (
                  <li key={a.rank} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
                    <span className="font-semibold">{a.rank}. {a.action}</span>
                    {a.reason ? <p className="mt-1 text-indigo-100">{a.reason}</p> : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveMissionControl.title}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {center.executiveMissionControl.map((m: MissionMetric) => (
            <div key={m.id} className="rounded-xl border border-indigo-100 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey}</p>
                <CommandCenterStatusBadge statusKey={m.statusKey} labels={labels.status} />
              </div>
              <p className="mt-1 text-lg font-bold text-indigo-900">{m.metricValue}</p>
              {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionOverview title={labels.sections.executiveOverview} items={center.sections.executiveOverview} />
        <SectionOverview title={labels.sections.operationalOverview} items={center.sections.operationalOverview} />
        <SectionOverview title={labels.sections.financialOverview} items={center.sections.financialOverview} />
        <SectionOverview title={labels.sections.customerOverview} items={center.sections.customerOverview} />
        <SectionOverview title={labels.sections.workforceOverview} items={center.sections.workforceOverview} />
        <SectionOverview title={labels.sections.intelligenceOverview} items={center.sections.intelligenceOverview} />
        <SectionOverview title={labels.sections.companionRecommendations} items={center.sections.companionRecommendations} />
      </div>

      {center.organizationRadar.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.organizationRadar.title}</h2>
          <ul className="space-y-3">
            {center.organizationRadar.map((r: RadarItem) => (
              <li key={r.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-600">{getRadarTierLabel(r.radarTier, labels.organizationRadar)}</p>
                    <p className="mt-1 font-medium text-zinc-900">{r.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{r.summary}</p>
                  </div>
                  <CommandCenterStatusBadge statusKey={r.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.liveBusinessPulse.title}</h2>
          <div className="flex gap-2">
            {(["today", "this_week", "this_month"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setPulsePeriod(period)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${pulsePeriod === period ? "bg-indigo-700 text-white" : "border border-zinc-300 text-zinc-700"}`}
              >
                {getPulsePeriodLabel(period, labels.liveBusinessPulse)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {pulseForPeriod.map((p: PulseMetric) => (
            <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase text-zinc-500 capitalize">{p.metricCategory}</p>
              <p className="mt-1 text-lg font-bold text-zinc-900">{p.metricValue}</p>
              {p.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{p.trendLabel}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {center.unifiedEventStream.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.unifiedEventStream.title}</h2>
          <ul className="space-y-2">
            {center.unifiedEventStream.map((e: EventStreamItem) => (
              <li key={e.id} className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-zinc-200 bg-white p-4">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500">{e.eventSource} · {e.eventType.replace(/_/g, " ")}</p>
                  <p className="mt-1 font-medium text-zinc-900">{e.title}</p>
                  {e.summary ? <p className="mt-1 text-sm text-zinc-600">{e.summary}</p> : null}
                </div>
                <CommandCenterStatusBadge statusKey={e.statusKey} labels={labels.status} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {visibleWidgets.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.widgets.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleWidgets.map((w: WidgetItem) => (
              <div key={w.id} className={`rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${w.size === "large" ? "lg:col-span-2" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium capitalize text-zinc-900">{w.widgetKey.replace(/_/g, " ")}</p>
                  {w.isPinned ? <span className="text-xs text-indigo-600">Pinned</span> : null}
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("widget", w.id, w.isPinned ? "unpin" : "pin")} className="rounded border border-zinc-300 px-2 py-1 text-xs">{w.isPinned ? labels.widgets.unpin : labels.widgets.pin}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("widget", w.id, "hide")} className="rounded border border-zinc-300 px-2 py-1 text-xs">{labels.widgets.hide}</button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.crossSystemIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.crossSystemIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.crossSystemIntelligence.map((c: CrossIntelligenceItem) => (
              <li key={c.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <p className="font-medium text-zinc-900">{c.correlationTitle}</p>
                <p className="mt-1 text-sm text-zinc-700">{c.observation}</p>
                {c.suggestedAction ? (
                  <p className="mt-2 text-sm font-medium text-indigo-800">{labels.crossSystemIntelligence.suggestedAction}: {c.suggestedAction}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.companionAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionAdvisor.map((item: CompanionItem) => (
              <li key={item.id} className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
                <p className="text-xs font-medium uppercase text-indigo-700">{item.capabilityType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{item.recommendation}</p>
                {item.reason ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.companionAdvisor.reason}:</span> {item.reason}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.executiveReadiness.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveReadiness.title}</h2>
          <ul className="space-y-3">
            {center.executiveReadiness.map((r: ReadinessItem) => (
              <li key={r.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{r.title}</p>
                  {center.canManage ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleAction("settings", "", "set_readiness_mode", { readiness_mode: r.modeKey })}
                      className="rounded-lg border border-indigo-300 px-3 py-1 text-xs font-medium text-indigo-800 disabled:opacity-50"
                    >
                      {labels.actions.setReadinessMode}
                    </button>
                  ) : null}
                </div>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="font-medium">{labels.executiveReadiness.keyMetrics}</dt><dd className="text-zinc-600">{r.keyMetrics}</dd></div>
                  <div><dt className="font-medium">{labels.executiveReadiness.risks}</dt><dd className="text-zinc-600">{r.risks}</dd></div>
                  <div><dt className="font-medium">{labels.executiveReadiness.achievements}</dt><dd className="text-zinc-600">{r.achievements}</dd></div>
                  <div><dt className="font-medium">{labels.executiveReadiness.priorities}</dt><dd className="text-zinc-600">{r.priorities}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
