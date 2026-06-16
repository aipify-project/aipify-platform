"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CUSTOMER_HEALTH_PRIORITIES,
  CUSTOMER_HEALTH_TRENDS,
  parseCustomerHealthOverview,
  parseCustomerHealthTimeline,
  type CustomerHealthLabels,
  type CustomerHealthOverview,
  type CustomerHealthStatus,
  type CustomerHealthTimelineEvent,
  type CustomerHealthTrend,
} from "@/lib/app-portal/customer-health";

type Props = { labels: CustomerHealthLabels };

const STATUS_STYLE: Record<CustomerHealthStatus, string> = {
  thriving: "bg-emerald-100 text-emerald-900",
  healthy: "bg-teal-100 text-teal-900",
  stable: "bg-blue-100 text-blue-900",
  requires_attention: "bg-amber-100 text-amber-950",
  critical_support_needed: "bg-red-100 text-red-900",
};

const TREND_STYLE: Record<CustomerHealthTrend, string> = {
  improving: "text-emerald-700",
  stable: "text-slate-600",
  declining: "text-red-700",
  insufficient_data: "text-slate-500",
};

const PRIORITY_STYLE: Record<string, string> = {
  informational: "bg-slate-100 text-slate-700",
  opportunity: "bg-blue-100 text-blue-900",
  important: "bg-amber-100 text-amber-950",
  high_priority: "bg-red-100 text-red-900",
};

export function CustomerHealthPanel({ labels }: Props) {
  const [data, setData] = useState<CustomerHealthOverview | null>(null);
  const [timeline, setTimeline] = useState<CustomerHealthTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [trend, setTrend] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (priority) params.set("priority", priority);
    if (trend) params.set("trend", trend);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const [overviewRes, timelineRes] = await Promise.all([
      fetch(`/api/aipify/customer-health?${params}`),
      fetch(`/api/aipify/customer-health/timeline?${periodFrom ? `period_from=${periodFrom}` : ""}`),
    ]);
    if (overviewRes.ok) {
      setData(parseCustomerHealthOverview(await overviewRes.json()));
    } else {
      const body = (await overviewRes.json()) as { error?: string };
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    if (timelineRes.ok) {
      const body = (await timelineRes.json()) as { timeline?: CustomerHealthTimelineEvent[] };
      setTimeline(parseCustomerHealthTimeline(body));
    }
    setLoading(false);
  }, [category, priority, trend, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function startReview() {
    setBusy(true);
    const res = await fetch("/api/aipify/customer-health", { method: "POST" });
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
      <div className="mx-auto max-w-5xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels.accessDenied}</p>
      </div>
    );
  }

  const empty = !data?.review_started;
  const indicators = data?.health_indicators;
  const engagement = data?.engagement_insights;
  const support = data?.support_insights;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
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
          <button type="button" disabled={busy} onClick={() => void startReview()} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.overallHealth} value={`${data?.overall_health_score ?? 0}/100`} />
            <Stat label={labels.dashboard.engagement} value={`${data?.engagement_score ?? 0}/100`} />
            <Stat label={labels.dashboard.supportSatisfaction} value={`${data?.support_satisfaction_score ?? 0}/100`} />
            <Stat label={labels.dashboard.openRecommendations} value={String(data?.open_recommendations_count ?? 0)} />
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <Stat label={labels.dashboard.adoption} value={`${data?.adoption_score ?? 0}/100`} />
            <Stat label={labels.dashboard.learningCompletion} value={`${data?.learning_completion_score ?? 0}/100`} />
            {data?.health_status ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{labels.dashboard.healthStatus}</p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[data.health_status]}`}>
                  {labels.statuses[data.health_status]}
                </span>
                {data.relationship_trend ? (
                  <p className={`mt-2 text-xs ${TREND_STYLE[data.relationship_trend]}`}>
                    {labels.dashboard.relationshipTrend}: {labels.trends[data.relationship_trend]}
                  </p>
                ) : null}
              </div>
            ) : null}
          </section>
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          <option value="learning">Learning</option>
          <option value="support">Support</option>
          <option value="adoption">Adoption</option>
          <option value="security">Security</option>
          <option value="relationship">Relationship</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {CUSTOMER_HEALTH_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <select value={trend} onChange={(e) => setTrend(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.trend}</option>
          {CUSTOMER_HEALTH_TRENDS.map((t) => <option key={t} value={t}>{labels.trends[t]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && indicators ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.indicators.title}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <Indicator label={labels.indicators.platformEngagement} value={indicators.platform_engagement} />
            <Indicator label={labels.indicators.trainingParticipation} value={indicators.training_participation} />
            <Indicator label={labels.indicators.supportInteractions} value={indicators.support_interactions} />
            <Indicator label={labels.indicators.adoptionProgress} value={indicators.adoption_progress} />
            <Indicator label={labels.indicators.securityCompletion} value={indicators.security_completion} />
            <Indicator label={labels.indicators.integrationActivity} value={indicators.integration_activity} />
          </div>
        </section>
      ) : null}

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.openRecommendations}</h2>
          <ul className="mt-3 space-y-2">
            {data!.recommendations!.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
                <span>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[r.priority] ?? PRIORITY_STYLE.informational}`}>
                  {labels.priorities[r.priority as keyof typeof labels.priorities] ?? r.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && engagement ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.engagement.title}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.engagement.activeTeams} items={engagement.active_teams} />
            <InsightList title={labels.engagement.departmentsSupport} items={engagement.departments_requiring_support} />
            <InsightList title={labels.engagement.underutilized} items={engagement.underutilized_capabilities} />
            <InsightList title={labels.engagement.positiveMomentum} items={engagement.positive_momentum} />
            <InsightList title={labels.engagement.decliningActivity} items={engagement.declining_activity} />
          </div>
        </section>
      ) : null}

      {!empty && support ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.support.title}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
            <p>{labels.support.openRequests}: {support.open_requests}</p>
            <p>{labels.support.resolvedRequests}: {support.resolved_requests}</p>
            <p>{labels.support.resolutionTrend}: {support.resolution_trend}</p>
            <p>{labels.support.satisfaction}: {support.satisfaction_indicator}/100</p>
            <p>{labels.support.selfService}: {support.self_service_sessions}</p>
            <p>{labels.support.knowledgeEngagement}: {support.knowledge_engagement}</p>
          </div>
        </section>
      ) : null}

      {!empty && data?.can_manage && data.department_reporting ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.team.title}</h2>
          <p className="mt-2 text-sm text-slate-700">{labels.team.engagement}: {data.department_reporting.engagement_score}/100</p>
          <p className="text-sm text-slate-700">{labels.team.learning}: {data.department_reporting.learning_participation}/100</p>
        </section>
      ) : null}

      {!empty && (data?.personal_recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.openRecommendations}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {data!.personal_recommendations!.map((p) => <li key={p.id}>{p.title} · {p.status}</li>)}
          </ul>
        </section>
      ) : null}

      {!empty && timeline.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.timeline.title}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {timeline.slice(0, 12).map((e) => (
              <li key={e.id} className="flex justify-between gap-2 border-b border-slate-100 pb-2">
                <span>{e.description}</span>
                <span className="text-xs text-slate-500">{new Date(e.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.goodCustomer}</dt><dd className="mt-1 text-slate-600">{labels.faq.goodCustomerAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.improveOutcomes}</dt><dd className="mt-1 text-slate-600">{labels.faq.improveOutcomesAnswer}</dd></div>
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

function Indicator({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600"><span>{label}</span><span>{value}</span></div>
      <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${Math.min(100, value)}%` }} /></div>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <ul className="mt-1 space-y-1 text-sm text-slate-700">{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}
