"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseFutureTechnologiesDashboard,
  type FutureTechnologiesDashboard,
} from "@/lib/aipify/future-technologies";

type FutureTechnologiesDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "adopted":
    case "active":
    case "evaluated":
      return "bg-emerald-100 text-emerald-800";
    case "pilot":
    case "assessment":
    case "recruiting":
      return "bg-blue-100 text-blue-800";
    case "exploration":
    case "open":
    case "draft":
      return "bg-cyan-100 text-cyan-800";
    case "deferred":
    case "cancelled":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-teal-100 text-teal-800";
  }
}

function priorityClass(priority?: string) {
  switch (priority) {
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function impactClass(impact?: string) {
  switch (impact) {
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function FutureTechnologiesDashboardPanel({ labels }: FutureTechnologiesDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<FutureTechnologiesDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/future-technologies/dashboard");
    if (res.ok) setDashboard(parseFutureTechnologiesDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/future-technologies/briefings/generate", { method: "POST" });
    await load();
  };

  const advanceInitiative = async (initiativeId: string) => {
    setActing(`advance-${initiativeId}`);
    await fetch(`/api/aipify/future-technologies/initiatives/${initiativeId}/advance`, { method: "POST" });
    setActing(null);
    await load();
  };

  const dismissRecommendation = async (recommendationId: string) => {
    setActing(`dismiss-${recommendationId}`);
    await fetch(`/api/aipify/future-technologies/recommendations/${recommendationId}/dismiss`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/innovation-lab" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.innovationLab}
        </Link>
        <Link href="/app/strategy" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.strategy}
        </Link>
        <Link href="/app/governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.governance}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-6">
        <h2 className="text-sm font-semibold text-cyan-900">{labels.futureReadiness}</h2>
        <p className="mt-2 text-4xl font-bold text-cyan-800">
          {dashboard.future_readiness_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-cyan-700">
          {dashboard.active_initiatives ?? 0} {labels.activeInitiatives} · {dashboard.open_pilot_opportunities ?? 0}{" "}
          {labels.pilotOpportunities} · {dashboard.avg_technology_relevance ?? 0}% {labels.techRelevance}
        </p>
        <p className="mt-2 text-sm text-cyan-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-cyan-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.activeInitiatives, value: dashboard.active_initiatives ?? 0 },
          { label: labels.pilotOpportunities, value: dashboard.open_pilot_opportunities ?? 0 },
          { label: labels.techRelevance, value: `${dashboard.avg_technology_relevance ?? 0}%` },
          { label: labels.observations, value: dashboard.technology_observations.length },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.emerging_interfaces && dashboard.emerging_interfaces.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.emergingInterfaces}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.emerging_interfaces.map((iface) => (
              <span
                key={iface.type}
                className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800"
              >
                {iface.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.technologyObservatory}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.technology_observations.map((obs) => (
            <article key={obs.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs capitalize text-gray-500">{obs.observation_area?.replace(/_/g, " ")}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(obs.maturity_level)}`}>
                  {obs.maturity_level}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{obs.title}</p>
              <p className="mt-1 text-xs text-gray-600">{obs.description}</p>
              <p className="mt-2 text-sm font-semibold text-cyan-700">{obs.relevance_score}% {labels.relevance}</p>
            </article>
          ))}
        </div>
      </section>

      {dashboard.trend_reports.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.trendReports}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.trend_reports.map((report) => (
              <article key={report.id} className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-teal-900">{report.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${impactClass(report.impact_level)}`}>
                    {report.impact_level} {labels.impact}
                  </span>
                </div>
                <p className="mt-1 text-xs text-teal-800">{report.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.emergingInitiatives}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.emerging_initiatives.map((init) => (
            <article key={init.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs text-cyan-700">{init.interface_label ?? init.interface_type}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(init.status)}`}>
                  {init.status}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{init.title}</p>
              <p className="mt-1 text-xs text-gray-600">{init.description}</p>
              <p className="mt-2 text-xs text-gray-500">
                {labels.businessValue}: {init.business_value_score}
                {init.governance_compatible ? ` · ${labels.governanceCompatible}` : ""}
              </p>
              {init.status !== "adopted" && init.status !== "deferred" ? (
                <button
                  type="button"
                  disabled={acting === `advance-${init.id}`}
                  onClick={() => void advanceInitiative(init.id)}
                  className="mt-3 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  {labels.advanceInitiative}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {dashboard.pilot_opportunities.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.pilotOpportunitiesSection}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.pilot_opportunities.map((pilot) => (
              <article key={pilot.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{pilot.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(pilot.status)}`}>
                    {pilot.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-indigo-800">{pilot.description}</p>
                <p className="mt-2 text-xs capitalize text-indigo-600">{pilot.participant_type?.replace(/_/g, " ")}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.readiness_assessments.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.readinessAssessments}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.readiness_assessments.map((assessment) => (
              <article key={assessment.id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs capitalize text-emerald-700">{assessment.assessment_type?.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-emerald-900">{assessment.title}</p>
                <p className="mt-1 text-xs text-emerald-800">{assessment.summary}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">{assessment.readiness_score}/100</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.scenario_plans.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.scenarioPlanning}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.scenario_plans.map((scenario) => (
              <article key={scenario.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{scenario.title}</p>
                  <span className="text-xs capitalize text-gray-500">{scenario.time_horizon?.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{scenario.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.recommendations.map((r) => (
              <article key={r.id} className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-amber-900">{r.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityClass(r.priority)}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-800">{r.description}</p>
                <button
                  type="button"
                  disabled={acting === `dismiss-${r.id}`}
                  onClick={() => void dismissRecommendation(r.id)}
                  className="mt-2 text-xs text-amber-800 underline hover:text-amber-900 disabled:opacity-50"
                >
                  {labels.dismiss}
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.responsible_adoption_principles && dashboard.responsible_adoption_principles.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.responsibleAdoption}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-700">
            {dashboard.responsible_adoption_principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
