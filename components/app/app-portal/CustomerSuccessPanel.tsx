"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  RECOMMENDATION_PRIORITIES,
  CUSTOMER_SUCCESS_STATUSES,
  parseCustomerSuccessOverview,
  type CustomerSuccessLabels,
  type CustomerSuccessOverview,
  type CustomerSuccessStatus,
} from "@/lib/app-portal/customer-success";
import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";

type Props = { labels: CustomerSuccessLabels };

const ACCESS_MESSAGES: Record<
  AppOrganizationContextState,
  keyof Pick<
    CustomerSuccessLabels,
    | "accessDenied"
    | "organizationMissing"
    | "subscriptionRequired"
    | "permissionMissing"
    | "entitlementMissing"
  >
> = {
  ready: "accessDenied",
  unauthenticated: "accessDenied",
  user_not_provisioned: "organizationMissing",
  organization_missing: "organizationMissing",
  membership_missing: "organizationMissing",
  subscription_inactive: "subscriptionRequired",
  entitlement_missing: "entitlementMissing",
  access_denied: "permissionMissing",
};

const STATUS_STYLE: Record<CustomerSuccessStatus, string> = {
  getting_started: "bg-slate-100 text-slate-700",
  developing: "bg-blue-100 text-blue-900",
  established: "bg-teal-100 text-teal-900",
  advanced: "bg-indigo-100 text-indigo-900",
  high_performing: "bg-emerald-100 text-emerald-900",
};

const PRIORITY_STYLE: Record<string, string> = {
  opportunity: "bg-slate-100 text-slate-700",
  recommended: "bg-blue-100 text-blue-900",
  important: "bg-amber-100 text-amber-950",
  high_impact: "bg-red-100 text-red-900",
};

const MATURITY_LABELS: Record<string, keyof CustomerSuccessLabels["maturity"]> = {
  getting_started: "gettingStarted",
  operational: "operational",
  optimized: "optimized",
  strategic: "strategic",
  transformational: "transformational",
};

export function CustomerSuccessPanel({ labels }: Props) {
  const [data, setData] = useState<CustomerSuccessOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessState, setAccessState] = useState<AppOrganizationContextState | null>(null);
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [successStatus, setSuccessStatus] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (priority) params.set("priority", priority);
    if (successStatus) params.set("success_status", successStatus);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/aipify/customer-success?${params}`);
    if (res.ok) {
      setData(parseCustomerSuccessOverview(await res.json()));
      setAccessState(null);
    } else {
      const body = (await res.json()) as { error?: string; access_state?: AppOrganizationContextState };
      setAccessState(body.access_state ?? "access_denied");
      setError(body.error ?? labels.accessDenied);
      setData(null);
    }
    setLoading(false);
  }, [category, priority, successStatus, periodFrom, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function beginJourney() {
    setBusy(true);
    const res = await fetch("/api/aipify/customer-success", { method: "POST" });
    setBusy(false);
    if (res.ok) setData(parseCustomerSuccessOverview(await res.json()));
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
    const messageKey = accessState ? ACCESS_MESSAGES[accessState] : "accessDenied";
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
        <p className="text-slate-600">{labels[messageKey]}</p>
      </div>
    );
  }

  const empty = !data?.journey_started;
  const scores = data?.category_scores;
  const maturityKey = data?.maturity?.key ?? "getting_started";
  const maturityLabelKey = MATURITY_LABELS[maturityKey] ?? "gettingStarted";

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
          <button type="button" disabled={busy} onClick={() => void beginJourney()} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{labels.emptyCta}</button>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={labels.dashboard.adoptionScore} value={`${data?.adoption_score ?? 0}/100`} />
            <Stat label={labels.dashboard.utilizationScore} value={`${data?.utilization_score ?? 0}/100`} />
            {data?.success_status ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{labels.filters.successStatus}</p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[data.success_status]}`}>
                  {labels.statuses[data.success_status]}
                </span>
              </div>
            ) : null}
            {data?.maturity ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{labels.maturity.title}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{labels.maturity[maturityLabelKey]}</p>
                <p className="text-xs text-slate-500">{labels.maturity.stage} {data.maturity.stage}</p>
              </div>
            ) : null}
          </section>

          {scores ? (
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ScoreBar label={labels.scores.learningCompletion} value={scores.learning_completion} />
              <ScoreBar label={labels.scores.featureAdoption} value={scores.feature_adoption} />
              <ScoreBar label={labels.scores.userEngagement} value={scores.user_engagement} />
              <ScoreBar label={labels.scores.operationalMaturity} value={scores.operational_maturity} />
              <ScoreBar label={labels.scores.securityCompletion} value={scores.security_completion} />
              <ScoreBar label={labels.scores.integrationUsage} value={scores.integration_usage} />
            </section>
          ) : null}

          {data?.personal_progress ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{labels.dashboard.personalProgress}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {data.personal_progress.courses_completed ?? 0} courses · {data.personal_progress.certifications ?? 0} certifications
              </p>
            </section>
          ) : null}
        </>
      )}

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={labels.filters.search} className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          <option value="learning">Learning</option>
          <option value="security">Security</option>
          <option value="adoption">Adoption</option>
          <option value="integration">Integration</option>
          <option value="operations">Operations</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.priority}</option>
          {RECOMMENDATION_PRIORITIES.map((p) => <option key={p} value={p}>{labels.priorities[p]}</option>)}
        </select>
        <select value={successStatus} onChange={(e) => setSuccessStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.successStatus}</option>
          {CUSTOMER_SUCCESS_STATUSES.map((s) => <option key={s} value={s}>{labels.statuses[s]}</option>)}
        </select>
        <input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label={labels.filters.periodFrom} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </section>

      {!empty && (data?.recommendations?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recommendedActions}</h2>
          <ul className="mt-3 space-y-2">
            {data!.recommendations!.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-800">
                <span>{labels.recommendations[r.key as keyof typeof labels.recommendations] ?? r.key}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[r.priority] ?? PRIORITY_STYLE.recommended}`}>
                  {labels.priorities[r.priority as keyof typeof labels.priorities] ?? r.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.recently_improved?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.recentlyImproved}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {data!.recently_improved!.map((i) => <li key={i.id}>{i.text}</li>)}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.areas_requiring_attention?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold">{labels.dashboard.areasAttention}</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {data!.areas_requiring_attention!.map((i) => <li key={i.id}>{i.text}</li>)}
          </ul>
        </section>
      ) : null}

      {!empty && (data?.milestones_achieved?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.dashboard.milestonesAchieved}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data!.milestones_achieved!.map((m) => (
              <li key={m.key} className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                <span>{m.title}</span>
                <span className="text-xs text-slate-500">{new Date(m.achieved_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!empty && data?.adoption_insights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.insights.title}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <InsightList title={labels.insights.frequentlyUsed} items={data.adoption_insights.features_frequently_used} />
            <InsightList title={labels.insights.rarelyUsed} items={data.adoption_insights.features_rarely_used} />
            <InsightList title={labels.insights.highEngagement} items={data.adoption_insights.teams_high_engagement} />
            <InsightList title={labels.insights.requiringSupport} items={data.adoption_insights.teams_requiring_support} />
            <InsightList title={labels.insights.trainingOpportunities} items={data.adoption_insights.training_opportunities} />
            <InsightList title={labels.insights.securityRecommendations} items={data.adoption_insights.security_recommendations} />
          </div>
        </section>
      ) : null}

      {!empty && data?.can_manage && data.team_reporting ? (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold">{labels.team.title}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            <p>{labels.team.teamCount}: {data.team_reporting.team_count}</p>
            <p>{labels.team.twoFaAdoption}: {data.team_reporting.two_fa_adoption_percent}%</p>
            <p>{labels.team.learningCompletions}: {data.team_reporting.learning_completions}</p>
          </div>
        </section>
      ) : null}

      {!empty && (data?.timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">{labels.timeline.title}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data!.timeline!.slice(0, 10).map((e) => (
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
          <div><dt className="font-medium">{labels.faq.autoImprove}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoImproveAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.whyAdoption}</dt><dd className="mt-1 text-slate-600">{labels.faq.whyAdoptionAnswer}</dd></div>
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

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <ul className="mt-1 space-y-1 text-sm text-slate-700">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
