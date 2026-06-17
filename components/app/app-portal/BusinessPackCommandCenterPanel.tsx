"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PACK_COMMAND_PRIORITIES,
  PACK_COMMAND_VALUE_CATEGORIES,
  PACK_HEALTH_STATUSES,
  parsePackCommandInsights,
  parsePackCommandOverview,
  parsePackCommandTimeline,
  type PackCommandCard,
  type PackCommandInsights,
  type PackCommandLabels,
  type PackCommandOverview,
  type PackCommandTimelineEvent,
} from "@/lib/app-portal/business-pack-command-center";

type Props = { labels: PackCommandLabels };

const HEALTH_STYLE: Record<string, string> = {
  thriving: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-slate-100 text-slate-700",
  requires_attention: "bg-amber-100 text-amber-950",
  at_risk: "bg-red-100 text-red-900",
};

const ECOSYSTEM_STYLE: Record<string, string> = {
  thriving: "border-emerald-200 bg-emerald-50/60",
  healthy: "border-teal-200 bg-teal-50/60",
  stable: "border-slate-200 bg-slate-50/60",
  requires_attention: "border-amber-200 bg-amber-50/60",
  critical_review_needed: "border-red-200 bg-red-50/60",
};

export function BusinessPackCommandCenterPanel({ labels }: Props) {
  const [data, setData] = useState<PackCommandOverview | null>(null);
  const [insights, setInsights] = useState<PackCommandInsights | null>(null);
  const [timeline, setTimeline] = useState<PackCommandTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packKey, setPackKey] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [adoptionLevel, setAdoptionLevel] = useState("");
  const [valueCategory, setValueCategory] = useState("");
  const [owner, setOwner] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [expandedPack, setExpandedPack] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (packKey) params.set("pack_key", packKey);
    if (healthStatus) params.set("health_status", healthStatus);
    if (adoptionLevel) params.set("adoption_level", adoptionLevel);
    if (valueCategory) params.set("value_category", valueCategory);
    if (owner) params.set("owner", owner);
    if (priorityLevel) params.set("priority_level", priorityLevel);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const timelineParams = new URLSearchParams();
    if (packKey) timelineParams.set("pack_key", packKey);
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, insightsRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/business-packs/command-center?${params}`),
      fetch("/api/aipify/business-packs/command-center/insights"),
      fetch(`/api/aipify/business-packs/command-center/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parsePackCommandOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (insightsRes.ok) setInsights(parsePackCommandInsights(await insightsRes.json()));
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parsePackCommandTimeline(body));
    }
    setLoading(false);
  }, [packKey, healthStatus, adoptionLevel, valueCategory, owner, priorityLevel, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

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

  const empty = !data?.has_command_data;
  const ecosystem = data?.ecosystem_status ?? "stable";

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
          <Link href="/app/business-packs/available" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">{labels.emptyCta}</Link>
        </section>
      ) : (
        <>
          <section className={`rounded-2xl border p-5 ${ECOSYSTEM_STYLE[ecosystem] ?? ECOSYSTEM_STYLE.stable}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.ecosystemStatus}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{labels.ecosystemStatuses[ecosystem as keyof typeof labels.ecosystemStatuses] ?? ecosystem}</p>
            <p className="mt-3 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.totalInstalled} value={String(data?.total_installed ?? 0)} />
            <Stat label={labels.dashboard.activePacks} value={String(data?.active_packs ?? 0)} />
            <Stat label={labels.dashboard.adoptionOverview} value={`${data?.adoption_overview?.average_score ?? 0}/100`} />
            <Stat label={labels.dashboard.valueOverview} value={`${data?.value_overview?.average_score ?? 0}/100`} />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Stat label={labels.dashboard.packsRequiringAttention} value={String(data?.packs_requiring_attention ?? 0)} />
            <Stat label={labels.dashboard.optimizationOpportunities} value={String(data?.optimization_opportunities ?? 0)} />
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={packKey} onChange={(e) => setPackKey(e.target.value)} placeholder={labels.filters.packKey} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.healthStatus}</option>
          {PACK_HEALTH_STATUSES.map((s) => <option key={s} value={s}>{labels.healthStatuses[s]}</option>)}
        </select>
        <select value={adoptionLevel} onChange={(e) => setAdoptionLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.adoptionLevel}</option>
          <option value="low">{labels.filters.lowAdoption}</option>
          <option value="healthy">{labels.filters.healthyAdoption}</option>
          <option value="high">{labels.filters.highAdoption}</option>
        </select>
        <select value={valueCategory} onChange={(e) => setValueCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.valueCategory}</option>
          {PACK_COMMAND_VALUE_CATEGORIES.map((c) => <option key={c} value={c}>{labels.valueCategories[c]}</option>)}
        </select>
        <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder={labels.filters.owner} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priorityLevel}</option>
          {PACK_COMMAND_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.packs?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.healthOverview}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.packs!.map((pack) => (
              <CommandCard
                key={pack.pack_key}
                pack={pack}
                labels={labels}
                expanded={expandedPack === pack.pack_key}
                onToggle={() => setExpandedPack(expandedPack === pack.pack_key ? null : pack.pack_key)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && insights?.found ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.commandInsights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.insights.mostValuable} items={insights.most_valuable?.map((p) => `${p.name} (${p.value_score ?? 0})`) ?? []} />
            <InsightList title={labels.insights.leastAdopted} items={insights.least_adopted?.map((p) => `${p.name} (${p.adoption_score ?? 0})`) ?? []} />
            <InsightList title={labels.insights.fastestGrowing} items={insights.fastest_growing?.map((p) => p.name) ?? []} />
            <InsightList title={labels.insights.requiringReview} items={insights.requiring_review?.map((p) => p.name) ?? []} />
            <InsightList title={labels.insights.trainingOpportunities} items={insights.training_opportunities?.map((p) => p.name) ?? []} />
            <InsightList title={labels.insights.governanceObservations} items={insights.governance_observations ?? []} />
          </div>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {timeline.map((e) => (
              <li key={e.id}>{labels.timelineEvents[e.event_type as keyof typeof labels.timelineEvents] ?? e.description}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendedActions}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.recommendations!.map((r) => (
              <li key={r.id}>
                {labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}
                <span className="ml-2 text-xs text-slate-500">({labels.priorityLevels[r.priority_level as keyof typeof labels.priorityLevels] ?? r.priority_level})</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.replacePages}</dt><dd className="mt-1 text-slate-600">{labels.faq.replacePagesAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.autoManage}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoManageAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function CommandCard({
  pack,
  labels,
  expanded,
  onToggle,
}: {
  pack: PackCommandCard;
  labels: PackCommandLabels;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{pack.name}</h3>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${HEALTH_STYLE[pack.health_status] ?? HEALTH_STYLE.stable}`}>
            {labels.healthStatuses[pack.health_status as keyof typeof labels.healthStatuses] ?? pack.health_status}
          </span>
        </div>
        <p className="text-sm text-slate-500">{labels.card.adoptionScore}: {pack.adoption_score}/100</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.valueScore}</dt><dd>{pack.value_score}/100</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.usageTrend}</dt><dd>{labels.usageTrends[pack.usage_trend as keyof typeof labels.usageTrends] ?? pack.usage_trend}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.assignedOwner}</dt><dd>{pack.assigned_owner || "—"}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.lastActivity}</dt><dd>{pack.last_activity_at ? new Date(pack.last_activity_at).toLocaleDateString() : "—"}</dd></div>
      </dl>
      <p className="mt-3 text-sm text-indigo-800">{pack.recommended_action}</p>
      <button type="button" onClick={onToggle} className="mt-4 text-sm font-medium text-indigo-700 hover:underline">{labels.card.viewDetails}</button>
      {expanded ? (
        <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <p>{labels.card.recommendedAction}: {pack.recommended_action}</p>
          <p className="mt-2">{labels.filters.priorityLevel}: {labels.priorityLevels[pack.priority_level as keyof typeof labels.priorityLevels] ?? pack.priority_level}</p>
        </div>
      ) : null}
    </article>
  );
}
