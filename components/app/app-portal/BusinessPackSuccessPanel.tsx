"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BUSINESS_PACK_SUCCESS_PRIORITIES,
  BUSINESS_PACK_SUCCESS_STATUSES,
  parseBusinessPackSuccessOverview,
  type BusinessPackCard,
  type BusinessPackSuccessLabels,
  type BusinessPackSuccessOverview,
} from "@/lib/app-portal/business-pack-success";

type Props = { labels: BusinessPackSuccessLabels };

const STATUS_STYLE: Record<string, string> = {
  getting_started: "bg-slate-100 text-slate-700",
  active: "bg-blue-100 text-blue-900",
  healthy: "bg-teal-100 text-teal-900",
  optimized: "bg-emerald-100 text-emerald-900",
  requires_attention: "bg-amber-100 text-amber-950",
};

const PRIORITY_STYLE: Record<string, string> = {
  opportunity: "bg-slate-100 text-slate-700",
  recommended: "bg-blue-100 text-blue-900",
  important: "bg-amber-100 text-amber-950",
  high_impact: "bg-red-100 text-red-900",
};

export function BusinessPackSuccessPanel({ labels }: Props) {
  const [data, setData] = useState<BusinessPackSuccessOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [packKey, setPackKey] = useState("");
  const [adoptionStatus, setAdoptionStatus] = useState("");
  const [successStatus, setSuccessStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [expandedPack, setExpandedPack] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (packKey) params.set("pack_key", packKey);
    if (adoptionStatus) params.set("adoption_status", adoptionStatus);
    if (successStatus) params.set("success_status", successStatus);
    if (priority) params.set("priority", priority);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/business-packs/success?${params}`);
    if (res.ok) {
      setData(parseBusinessPackSuccessOverview(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [packKey, adoptionStatus, successStatus, priority, periodFrom, search, labels.accessDenied]);

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

  const empty = !data?.has_installed_packs;
  const insights = data?.adoption_insights;

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
          <section className="grid gap-4 sm:grid-cols-3">
            <Stat label={labels.dashboard.overallAdoptionScore} value={`${data?.overall_adoption_score ?? 0}/100`} />
            <Stat label={labels.dashboard.installedPacks} value={String(data?.installed_packs?.length ?? 0)} />
            <Stat label={labels.dashboard.successMilestones} value={String(data?.milestones_achieved?.length ?? 0)} />
          </section>

          {(data?.most_active_packs?.length ?? 0) > 0 ? (
            <HighlightSection title={labels.dashboard.mostActivePacks} items={data!.most_active_packs!} />
          ) : null}

          {(data?.underutilized_packs?.length ?? 0) > 0 ? (
            <HighlightSection title={labels.dashboard.underutilizedPacks} items={data!.underutilized_packs!} muted />
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input value={packKey} onChange={(e) => setPackKey(e.target.value)} placeholder={labels.filters.pack} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={adoptionStatus} onChange={(e) => setAdoptionStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.adoptionStatus}</option>
          {BUSINESS_PACK_SUCCESS_STATUSES.map((s) => <option key={s} value={s}>{labels.packStatus[s]}</option>)}
        </select>
        <select value={successStatus} onChange={(e) => setSuccessStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.successStatus}</option>
          {BUSINESS_PACK_SUCCESS_STATUSES.map((s) => <option key={s} value={s}>{labels.packStatus[s]}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {BUSINESS_PACK_SUCCESS_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorityLevels[p]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.installed_packs?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.dashboard.installedPacks}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data!.installed_packs!.map((pack) => (
              <PackCard
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

      {!empty && insights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.adoptionInsights}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
            <InsightList title={labels.insights.featuresFrequentlyUsed} items={insights.features_frequently_used} />
            <InsightList title={labels.insights.featuresRarelyUsed} items={insights.features_rarely_used} />
            <InsightList title={labels.insights.usersActivelyEngaging} items={insights.users_actively_engaging} />
            <InsightList title={labels.insights.areasRequiringOnboarding} items={insights.areas_requiring_onboarding} />
            <InsightList title={labels.insights.learningOpportunities} items={insights.learning_opportunities} />
            <InsightList title={labels.insights.recommendedConfigurations} items={insights.recommended_configurations} />
          </div>
        </section>
      ) : null}

      {!empty && (data?.milestones_achieved?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.successMilestones}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data!.milestones_achieved!.map((m) => (
              <li key={`${m.pack_key}-${m.key}`} className="flex justify-between gap-2">
                <span>✓ {labels.milestones[m.key as keyof typeof labels.milestones] ?? m.title}</span>
                <span className="text-xs text-slate-500">{m.achieved_at ? new Date(m.achieved_at).toLocaleDateString() : ""}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendedNextActions}</h2>
          <ul className="mt-3 space-y-2">
            {data!.recommendations!.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
                <span>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[r.priority] ?? PRIORITY_STYLE.recommended}`}>
                  {labels.priorityLevels[r.priority as keyof typeof labels.priorityLevels] ?? r.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.successTimeline}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data!.timeline!.slice(0, 12).map((e) => (
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
          <div><dt className="font-medium">{labels.faq.improveAutomatically}</dt><dd className="mt-1 text-slate-600">{labels.faq.improveAutomaticallyAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyImportant}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyImportantAnswer}</dd></div>
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

function HighlightSection({
  title,
  items,
  muted,
}: {
  title: string;
  items: Array<{ pack_key: string; name: string; score: number }>;
  muted?: boolean;
}) {
  return (
    <section className={`rounded-2xl border p-5 ${muted ? "border-amber-100 bg-amber-50/40" : "border-teal-100 bg-teal-50/40"}`}>
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.pack_key} className="flex justify-between gap-2">
            <span>{item.name}</span>
            <span className="font-medium">{item.score}/100</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="font-medium text-slate-900">{title}</p>
      <ul className="mt-1 list-disc pl-5">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function PackCard({
  pack,
  labels,
  expanded,
  onToggle,
}: {
  pack: BusinessPackCard;
  labels: BusinessPackSuccessLabels;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{pack.name}</h3>
          <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[pack.status] ?? STATUS_STYLE.active}`}>
            {labels.packStatus[pack.status as keyof typeof labels.packStatus] ?? pack.status}
          </span>
        </div>
        <p className="text-lg font-semibold text-indigo-700">{pack.adoption_score}/100</p>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <div><dt className="text-xs text-slate-500">{labels.packCard.usageTrend}</dt><dd>{labels.usageTrends[pack.usage_trend as keyof typeof labels.usageTrends] ?? pack.usage_trend}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.packCard.usersAssigned}</dt><dd>{pack.users_assigned}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.packCard.featuresActivated}</dt><dd>{pack.features_activated}</dd></div>
        <div><dt className="text-xs text-slate-500">{labels.packCard.lastActivity}</dt><dd>{pack.last_activity ? new Date(pack.last_activity).toLocaleDateString() : "—"}</dd></div>
      </dl>
      <button type="button" onClick={onToggle} className="mt-4 text-sm font-medium text-indigo-700 hover:underline">
        {expanded ? "−" : "+"} {labels.packCard.viewDetails}
      </button>
      {expanded ? (
        <div className="mt-4 space-y-4 border-t border-slate-100 pt-4 text-sm">
          {(pack.milestones?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.dashboard.successMilestones}</p>
              <ul className="mt-2 space-y-1">
                {pack.milestones!.map((m) => (
                  <li key={m.key}>✓ {labels.milestones[m.key as keyof typeof labels.milestones] ?? m.title}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(pack.onboarding_checklist?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.dashboard.onboardingChecklist}</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {pack.onboarding_checklist!.map((item) => (
                  <li key={item.key}>{labels.onboarding[item.key as keyof typeof labels.onboarding] ?? item.title}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(pack.recommended_actions?.length ?? 0) > 0 ? (
            <div>
              <p className="font-medium">{labels.packCard.recommendedActions}</p>
              <ul className="mt-2 space-y-1">
                {pack.recommended_actions!.map((r) => (
                  <li key={r.id}>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
