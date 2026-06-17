"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ABOS_COMMAND_CENTER_PRIORITIES,
  ABOS_COMMAND_CENTER_RECOMMENDATION_TYPES,
  parseAbosCommandCenterOverview,
  parseAbosCommandCenterTimeline,
  type AbosCommandCenterLabels,
  type AbosCommandCenterOverview,
  type AbosCommandCenterPriorityItem,
  type AbosCommandCenterTimelineEvent,
  type AbosCompanionBriefing,
} from "@/lib/app-portal/abos-command-center";

type Props = { labels: AbosCommandCenterLabels };

const PRIORITY_STYLE: Record<string, string> = {
  informational: "bg-slate-100 text-slate-700",
  opportunity: "bg-emerald-100 text-emerald-900",
  important: "bg-amber-100 text-amber-950",
  immediate_attention: "bg-red-100 text-red-900",
};

const STATUS_STYLE: Record<string, string> = {
  thriving: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-slate-100 text-slate-800",
  requires_attention: "bg-amber-100 text-amber-950",
  critical_attention_required: "bg-red-100 text-red-900",
};

function formatBriefingLine(
  labels: AbosCommandCenterLabels,
  line: { key: string; count?: number; status?: string },
): string {
  const map: Record<string, string> = {
    overallHealth: labels.briefing.overallHealth,
    strategicInitiativesAttention: labels.briefing.strategicInitiativesAttention,
    resilienceVulnerability: labels.briefing.resilienceVulnerability,
    momentumPositive: labels.briefing.momentumPositive,
  };
  const template = map[line.key] ?? line.key;
  if (line.key === "overallHealth" && line.status) {
    const statusLabel = labels.orgStatus[line.status] ?? line.status;
    return template.replace("{{status}}", statusLabel);
  }
  return template.replace("{{count}}", String(line.count ?? 0));
}

function renderBriefing(labels: AbosCommandCenterLabels, briefing?: AbosCompanionBriefing) {
  if (!briefing) return null;
  const greeting = labels.briefing[briefing.greeting_key as keyof typeof labels.briefing] ?? labels.briefing.goodMorning;
  const closing = labels.briefing[briefing.closing_key as keyof typeof labels.briefing] ?? labels.briefing.focusPrioritiesToday;
  return (
    <div className="space-y-2 text-sm text-slate-800">
      <p className="text-base font-medium text-slate-900">{greeting}</p>
      {briefing.lines.map((line) => (
        <p key={line.key}>{formatBriefingLine(labels, line)}</p>
      ))}
      <p className="text-slate-600">{closing}</p>
    </div>
  );
}

export function AbosCommandCenterPanel({ labels }: Props) {
  const [data, setData] = useState<AbosCommandCenterOverview | null>(null);
  const [timeline, setTimeline] = useState<AbosCommandCenterTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priority, setPriority] = useState("");
  const [recommendationType, setRecommendationType] = useState("");
  const [focusCategory, setFocusCategory] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (priority) params.set("priority", priority);
    if (recommendationType) params.set("recommendation_type", recommendationType);
    if (focusCategory) params.set("focus_category", focusCategory);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const timelineParams = new URLSearchParams();
    if (periodFrom) timelineParams.set("period_from", periodFrom);
    if (search.trim()) timelineParams.set("search", search.trim());
    const [overviewRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/command-center?${params}`),
      fetch(`/api/aipify/command-center/timeline?${timelineParams}`),
    ]);
    if (overviewRes.ok) {
      setData(parseAbosCommandCenterOverview(await overviewRes.json()));
    } else {
      const body = (await overviewRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { timeline?: AbosCommandCenterTimelineEvent[] };
      setTimeline(parseAbosCommandCenterTimeline(body));
    }
    setLoading(false);
  }, [priority, recommendationType, focusCategory, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function generateBriefing() {
    setBusy(true);
    const res = await fetch("/api/aipify/command-center", { method: "POST" });
    setBusy(false);
    if (res.ok) void load();
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.briefing_started;
  const status = data?.organizational_status ?? "stable";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      </div>

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button type="button" disabled={busy} onClick={() => void generateBriefing()} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold">{labels.dashboard.executiveBriefing}</h2>
              {!empty && data?.organizational_status ? (
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[status] ?? STATUS_STYLE.stable}`}>
                  {labels.dashboard.organizationalStatus}: {labels.orgStatus[status] ?? status}
                </span>
              ) : null}
            </div>
            <div className="mt-3">{renderBriefing(labels, data?.companion_briefing)}</div>
          </section>

          <OverviewGrid labels={labels} data={data} />
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {ABOS_COMMAND_CENTER_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <select value={recommendationType} onChange={(e) => setRecommendationType(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.recommendationType}</option>
          {ABOS_COMMAND_CENTER_RECOMMENDATION_TYPES.map((t) => <option key={t} value={t}>{labels.recommendationTypes[t]}</option>)}
        </select>
        <input value={focusCategory} onChange={(e) => setFocusCategory(e.target.value)} placeholder={labels.filters.focusCategory} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.todays_priorities?.length ?? 0) > 0 ? (
        <PrioritySection title={labels.dashboard.todaysPriorities} items={data!.todays_priorities!} labels={labels} />
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendations}</h2>
          <ul className="mt-3 space-y-2">
            {data!.recommendations!.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
                <span>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[r.priority] ?? PRIORITY_STYLE.informational}`}>
                  {labels.priorityLevels[r.priority as keyof typeof labels.priorityLevels] ?? r.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.executiveTimeline}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {timeline.slice(0, 12).map((e) => (
              <li key={e.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{e.description}</span>
                <span className="text-xs text-slate-500">{e.created_at ? new Date(e.created_at).toLocaleDateString() : ""}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.replacesModules}</dt><dd className="mt-1 text-slate-600">{labels.faq.replacesModulesAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.runsOrganization}</dt><dd className="mt-1 text-slate-600">{labels.faq.runsOrganizationAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function OverviewGrid({ labels, data }: { labels: AbosCommandCenterLabels; data: AbosCommandCenterOverview | null }) {
  const s = data?.strategic_overview;
  const m = data?.momentum_overview;
  const r = data?.resilience_overview;
  const c = data?.capacity_overview;
  const risk = data?.risk_overview;
  const success = data?.success_overview;
  const ch = data?.customer_health_overview;
  const o = labels.overviews;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <OverviewCard title={labels.dashboard.strategicOverview}>
        <StatRow label={o.onTrack} value={String(s?.on_track ?? 0)} />
        <StatRow label={o.delayed} value={String(s?.delayed ?? 0)} />
        <StatRow label={o.milestonesAchieved} value={String(s?.milestones_achieved ?? 0)} />
      </OverviewCard>
      <OverviewCard title={labels.dashboard.momentumOverview}>
        <StatRow label={o.momentumScore} value={`${m?.score ?? 0}/100`} />
        <StatRow label={o.teamsAccelerating} value={String(m?.teams_accelerating ?? 0)} />
        <StatRow label={o.initiativesSlowing} value={String(m?.initiatives_slowing ?? 0)} />
        <StatRow label={o.bottlenecks} value={String(m?.bottlenecks ?? 0)} />
      </OverviewCard>
      <OverviewCard title={labels.dashboard.resilienceOverview}>
        <StatRow label={o.resilienceScore} value={`${r?.score ?? 0}/100`} />
        <StatRow label={o.vulnerabilities} value={String(r?.vulnerabilities ?? 0)} />
        <StatRow label={o.continuityReadiness} value={String(r?.continuity_readiness ?? 0)} />
      </OverviewCard>
      <OverviewCard title={labels.dashboard.capacityOverview}>
        <StatRow label={o.teamsApproachingLimits} value={String(c?.teams_approaching_limits ?? 0)} />
        <StatRow label={o.healthyDistribution} value={String(c?.healthy_distribution ?? 0)} />
        <StatRow label={o.capacityRisks} value={String(c?.capacity_risks ?? 0)} />
      </OverviewCard>
      <OverviewCard title={labels.dashboard.riskOverview}>
        <StatRow label={o.highPriorityRisks} value={String(risk?.high_priority ?? 0)} />
        <StatRow label={o.recentlyMitigated} value={String(risk?.recently_mitigated ?? 0)} />
      </OverviewCard>
      <OverviewCard title={labels.dashboard.successOverview}>
        <StatRow label={o.milestonesAchieved} value={String(success?.milestones_achieved ?? 0)} />
        <StatRow label={o.highPerforming} value={String(success?.high_performing ?? 0)} />
      </OverviewCard>
      <OverviewCard title={labels.dashboard.customerHealthOverview}>
        <StatRow label={o.adoptionScore} value={`${ch?.adoption_score ?? 0}/100`} />
        <StatRow label={o.learningScore} value={`${ch?.learning_score ?? 0}/100`} />
        <StatRow label={o.supportEngagement} value={String(ch?.support_engagement ?? 0)} />
      </OverviewCard>
    </div>
  );
}

function OverviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm text-slate-700">
      <span>{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function PrioritySection({
  title,
  items,
  labels,
}: {
  title: string;
  items: AbosCommandCenterPriorityItem[];
  labels: AbosCommandCenterLabels;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
            <span>{item.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[item.priority] ?? PRIORITY_STYLE.informational}`}>
              {labels.priorityLevels[item.priority as keyof typeof labels.priorityLevels] ?? item.priority}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
