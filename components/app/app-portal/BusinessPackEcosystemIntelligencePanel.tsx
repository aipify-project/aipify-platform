"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COVERAGE_CATEGORIES,
  ECOSYSTEM_PRIORITIES,
  ECOSYSTEM_STATUSES,
  RELATIONSHIP_STRENGTHS,
  parseEcosystemOverview,
  parseEcosystemRelationships,
  parseEcosystemTimeline,
  type EcosystemLabels,
  type EcosystemOverview,
  type EcosystemPackCard,
  type EcosystemRelationship,
  type EcosystemTimelineEvent,
} from "@/lib/app-portal/business-pack-ecosystem-intelligence";

type Props = { labels: EcosystemLabels };

const STATUS_STYLE: Record<string, string> = {
  thriving: "border-emerald-200 bg-emerald-50/60",
  healthy: "border-teal-200 bg-teal-50/60",
  stable: "border-slate-200 bg-slate-50/60",
  requires_optimization: "border-amber-200 bg-amber-50/60",
  fragmented: "border-red-200 bg-red-50/60",
};

const STRENGTH_STYLE: Record<string, string> = {
  strong: "text-emerald-700",
  moderate: "text-teal-700",
  emerging: "text-slate-600",
  underutilized: "text-amber-700",
};

export function BusinessPackEcosystemIntelligencePanel({ labels }: Props) {
  const [data, setData] = useState<EcosystemOverview | null>(null);
  const [relationships, setRelationships] = useState<EcosystemRelationship[]>([]);
  const [timeline, setTimeline] = useState<EcosystemTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packKey, setPackKey] = useState("");
  const [coverageCategory, setCoverageCategory] = useState("");
  const [ecosystemStatus, setEcosystemStatus] = useState("");
  const [relationshipStrength, setRelationshipStrength] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (packKey) params.set("pack_key", packKey);
    if (coverageCategory) params.set("coverage_category", coverageCategory);
    if (ecosystemStatus) params.set("ecosystem_status", ecosystemStatus);
    if (relationshipStrength) params.set("relationship_strength", relationshipStrength);
    if (priorityLevel) params.set("priority_level", priorityLevel);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    const relParams = new URLSearchParams();
    if (packKey) relParams.set("pack_key", packKey);
    if (relationshipStrength) relParams.set("relationship_strength", relationshipStrength);

    const timelineParams = new URLSearchParams();
    if (packKey) timelineParams.set("pack_key", packKey);
    if (periodFrom) timelineParams.set("period_from", periodFrom);

    const [dashRes, relRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/business-packs/ecosystem-intelligence?${params}`),
      fetch(`/api/aipify/business-packs/ecosystem-intelligence/relationships?${relParams}`),
      fetch(`/api/aipify/business-packs/ecosystem-intelligence/timeline?${timelineParams}`),
    ]);

    if (dashRes.ok) {
      setData(parseEcosystemOverview(await dashRes.json()));
    } else {
      const body = (await dashRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (relRes.ok) {
      const body = parseEcosystemRelationships(await relRes.json());
      setRelationships(body.relationships ?? []);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { events?: unknown };
      setTimeline(parseEcosystemTimeline(body));
    }
    setLoading(false);
  }, [packKey, coverageCategory, ecosystemStatus, relationshipStrength, priorityLevel, periodFrom, search, labels.accessDenied]);

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

  const empty = !data?.has_ecosystem_data;
  const status = data?.ecosystem_status ?? "stable";
  const coverage = data?.coverage_overview ?? {};

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
          <section className={`rounded-2xl border p-5 ${STATUS_STYLE[status] ?? STATUS_STYLE.stable}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.dashboard.ecosystemStatus}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{labels.ecosystemStatuses[status as keyof typeof labels.ecosystemStatuses] ?? status}</p>
            <p className="mt-3 text-sm text-slate-700">{data?.executive_summary}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.healthScore} value={`${data?.health_score ?? 0}/100`} />
            <Stat label={labels.dashboard.crossUtilization} value={`${data?.cross_utilization_score ?? 0}/100`} />
            <Stat label={labels.dashboard.opportunities} value={String(data?.opportunities?.length ?? 0)} />
            <Stat label={labels.dashboard.risks} value={String(data?.risks?.length ?? 0)} />
          </section>

          {Object.keys(coverage).length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.coverageOverview}</h2>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
                {Object.entries(coverage).map(([cat, count]) => (
                  <span key={cat}>{labels.coverageCategories[cat as keyof typeof labels.coverageCategories] ?? cat}: {count}</span>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={packKey} onChange={(e) => setPackKey(e.target.value)} placeholder={labels.filters.packKey} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={coverageCategory} onChange={(e) => setCoverageCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.coverageCategory}</option>
          {COVERAGE_CATEGORIES.map((c) => <option key={c} value={c}>{labels.coverageCategories[c]}</option>)}
        </select>
        <select value={ecosystemStatus} onChange={(e) => setEcosystemStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.ecosystemStatus}</option>
          {ECOSYSTEM_STATUSES.map((s) => <option key={s} value={s}>{labels.ecosystemStatuses[s]}</option>)}
        </select>
        <select value={relationshipStrength} onChange={(e) => setRelationshipStrength(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.relationshipStrength}</option>
          {RELATIONSHIP_STRENGTHS.map((s) => <option key={s} value={s}>{labels.relationshipStrengths[s]}</option>)}
        </select>
        <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priorityLevel}</option>
          {ECOSYSTEM_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && relationships.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.relationshipMap}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {relationships.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 last:border-0">
                <span className="text-slate-800">{r.label}</span>
                <span className={STRENGTH_STYLE[r.strength] ?? "text-slate-600"}>
                  {labels.relationshipStrengths[r.strength as keyof typeof labels.relationshipStrengths] ?? r.strength}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.packs?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.coverageAnalysis}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.packs!.map((pack) => (
              <EcosystemCard key={pack.pack_key} pack={pack} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {!empty && (data?.opportunities?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.opportunities}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.opportunities!.map((o) => (
              <li key={o.id}>{labels.opportunities[o.key as keyof typeof labels.opportunities] ?? o.key}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.risks?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.risks}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data!.risks!.map((r) => (
              <li key={r.id}>{labels.risks[r.key as keyof typeof labels.risks] ?? r.key}</li>
            ))}
          </ul>
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
          <div><dt className="font-medium">{labels.faq.autoOptimize}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoOptimizeAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyRelationships}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyRelationshipsAnswer}</dd></div>
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

function EcosystemCard({ pack, labels }: { pack: EcosystemPackCard; labels: EcosystemLabels }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{pack.name}</h3>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.card.adoptionScore}</dt><dd>{pack.adoption_score}/100</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.crossUtilization}</dt><dd>{pack.cross_utilization_score}/100</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.coverageCategory}</dt><dd>{labels.coverageCategories[pack.coverage_category as keyof typeof labels.coverageCategories] ?? pack.coverage_category}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.card.coverageStatus}</dt><dd>{labels.coverageStatuses[pack.coverage_status as keyof typeof labels.coverageStatuses] ?? pack.coverage_status}</dd></div>
      </dl>
    </article>
  );
}
