"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAppPortalExecutiveInsights,
  type AppPortalExecutiveInsights,
  type AppPortalExecutiveInsightsLabels,
  type ExecutiveInsightsHealthStatus,
  type RiskSeverity,
} from "@/lib/app-portal/executive-insights";

type Props = { labels: AppPortalExecutiveInsightsLabels };

const HEALTH_STYLE: Record<ExecutiveInsightsHealthStatus, string> = {
  healthy: "bg-emerald-100 text-emerald-900 border-emerald-200",
  warning: "bg-amber-100 text-amber-900 border-amber-200",
  critical: "bg-rose-100 text-rose-900 border-rose-200",
};

const SEV_STYLE: Record<RiskSeverity, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

export function AppPortalExecutiveInsightsPanel({ labels }: Props) {
  const [insights, setInsights] = useState<AppPortalExecutiveInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/executive-insights");
    if (res.status === 403) {
      setDenied(true);
      setLoading(false);
      return;
    }
    if (res.ok) setInsights(parseAppPortalExecutiveInsights(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (denied) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">{labels.accessDeniedTitle}</h1>
        <p className="text-slate-600">{labels.accessDeniedBody}</p>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:underline">← APP Dashboard</Link>
      </div>
    );
  }

  if (!insights) {
    return <p className="p-6 text-sm text-red-600">Failed to load insights.</p>;
  }

  const health = insights.health;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/app" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">← APP Dashboard</Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">
          {insights.principle || labels.principle}
        </p>
      </div>

      {insights.sparse_data ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <Link href="/app/business-packs/available" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {labels.exploreBusinessPacks}
          </Link>
        </section>
      ) : null}

      {health ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.health}</h2>
          <div className="mt-4 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.health.score}</p>
              <p className="text-4xl font-semibold tabular-nums text-slate-900">{health.score}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{labels.health.trend}</p>
              <p className="text-sm font-medium text-slate-800">{labels.health.trends[health.trend]}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-sm font-medium ${HEALTH_STYLE[health.status]}`}>
              {labels.health.statuses[health.status]}
            </span>
          </div>
          {health.factors.length > 0 ? (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {health.factors.map((f) => (
                <li key={f.key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">{f.label}</span>
                  <span className="font-medium text-slate-900">{String(f.value)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {insights.priorities.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.sections.priorities}</h2>
          <ul className="mt-4 space-y-2">
            {insights.priorities.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link href={p.href} className="block rounded-lg border border-slate-100 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.sections.sinceLastLogin}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {insights.since_last_login.new_team_members != null ? (
            <div className="rounded-lg bg-slate-50 px-3 py-2"><dt className="text-slate-500">{labels.sinceLastLogin.newTeamMembers}</dt><dd className="font-semibold">{insights.since_last_login.new_team_members}</dd></div>
          ) : null}
          {insights.since_last_login.integrations_connected != null ? (
            <div className="rounded-lg bg-slate-50 px-3 py-2"><dt className="text-slate-500">{labels.sinceLastLogin.integrationsConnected}</dt><dd className="font-semibold">{insights.since_last_login.integrations_connected}</dd></div>
          ) : null}
          {insights.since_last_login.business_packs_installed != null ? (
            <div className="rounded-lg bg-slate-50 px-3 py-2"><dt className="text-slate-500">{labels.sinceLastLogin.businessPacksInstalled}</dt><dd className="font-semibold">{insights.since_last_login.business_packs_installed}</dd></div>
          ) : null}
          {insights.since_last_login.tasks_completed != null ? (
            <div className="rounded-lg bg-slate-50 px-3 py-2"><dt className="text-slate-500">{labels.sinceLastLogin.tasksCompleted}</dt><dd className="font-semibold">{insights.since_last_login.tasks_completed}</dd></div>
          ) : null}
        </dl>
        {(insights.since_last_login.billing_events?.length ?? 0) > 0 ? (
          <div className="mt-3 text-sm"><p className="font-medium text-slate-700">{labels.sinceLastLogin.billingEvents}</p><ul className="mt-1 list-inside list-disc text-slate-600">{insights.since_last_login.billing_events!.map((e) => <li key={e}>{e}</li>)}</ul></div>
        ) : null}
        <Link href="/app/since-last-login" className="mt-4 inline-block text-sm font-medium text-indigo-700 hover:underline">{labels.sections.sinceLastLogin} →</Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {insights.opportunities.length > 0 ? (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-6">
            <h2 className="font-semibold text-emerald-950">{labels.sections.opportunities}</h2>
            <ul className="mt-4 space-y-3">
              {insights.opportunities.map((o) => (
                <li key={o.id} className="rounded-xl bg-white/80 p-4 text-sm shadow-sm">
                  <p className="font-medium text-slate-900">{o.title}</p>
                  <p className="mt-1 text-slate-600">{o.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {insights.risks.length > 0 ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6">
            <h2 className="font-semibold text-amber-950">{labels.sections.risks}</h2>
            <ul className="mt-4 space-y-3">
              {insights.risks.map((r) => (
                <li key={r.id} className="rounded-xl bg-white/80 p-4 text-sm shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900">{r.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${SEV_STYLE[r.severity]}`}>{labels.severity[r.severity]}</span>
                  </div>
                  <p className="mt-1 text-slate-600">{r.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {insights.recommendations.length > 0 ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6">
          <h2 className="font-semibold text-indigo-950">{labels.sections.recommendations}</h2>
          <ul className="mt-4 space-y-4">
            {insights.recommendations.map((rec) => (
              <li key={rec.id} className="rounded-xl border border-indigo-100 bg-white p-4 text-sm">
                <p className="font-medium text-slate-900">{rec.title}</p>
                <p className="mt-2 text-slate-600"><span className="font-medium">{labels.recommendation.why}</span> {rec.why}</p>
                <p className="mt-1 text-slate-600"><span className="font-medium">{labels.recommendation.expectedImpact}</span> {rec.expected_impact}</p>
                <Link href={rec.href} className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline">{labels.recommendation.suggestedAction}: {rec.action}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div><dt className="font-medium text-slate-900">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium text-slate-900">{labels.faq.autoDecisions}</dt><dd className="mt-1 text-slate-600">{labels.faq.autoDecisionsAnswer}</dd></div>
          <div><dt className="font-medium text-slate-900">{labels.faq.updateFrequency}</dt><dd className="mt-1 text-slate-600">{labels.faq.updateFrequencyAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}
