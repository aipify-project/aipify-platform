"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseInnovationLabDashboard,
  type InnovationLabDashboard,
} from "@/lib/aipify/innovation-lab";

type InnovationLabDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "approved":
    case "completed":
    case "active":
    case "rollout":
      return "bg-emerald-100 text-emerald-800";
    case "under_review":
    case "analysis":
    case "pilot":
    case "sandbox":
      return "bg-blue-100 text-blue-800";
    case "in_experiment":
    case "design":
    case "recruiting":
      return "bg-amber-100 text-amber-800";
    case "declined":
    case "cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function riskClass(risk?: string) {
  switch (risk) {
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-emerald-100 text-emerald-800";
  }
}

export function InnovationLabDashboardPanel({ labels }: InnovationLabDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<InnovationLabDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/innovation-lab/dashboard");
    if (res.ok) setDashboard(parseInnovationLabDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/innovation-lab/briefings/generate", { method: "POST" });
    await load();
  };

  const approveIdea = async (ideaId: string) => {
    setActing(`approve-${ideaId}`);
    await fetch(`/api/aipify/innovation-lab/ideas/${ideaId}/approve`, { method: "POST" });
    setActing(null);
    await load();
  };

  const advanceExperiment = async (experimentId: string) => {
    setActing(`advance-${experimentId}`);
    await fetch(`/api/aipify/innovation-lab/experiments/${experimentId}/advance`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.governance}
        </Link>
        <Link href="/app/simulations" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.simulationLab}
        </Link>
        <Link href="/app/academy" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.academy}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-fuchsia-200 bg-fuchsia-50/50 p-6">
        <h2 className="text-sm font-semibold text-fuchsia-900">{labels.innovationScore}</h2>
        <p className="mt-2 text-4xl font-bold text-fuchsia-800">
          {dashboard.innovation_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-fuchsia-700">
          {dashboard.active_experiments ?? 0} {labels.activeExperiments} · {dashboard.ideas_in_pipeline ?? 0}{" "}
          {labels.ideasInPipeline} · {dashboard.return_on_innovation ?? 0}% {labels.returnOnInnovation}
        </p>
        <p className="mt-2 text-sm text-fuchsia-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-fuchsia-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.experimentCompletion, value: `${dashboard.experiment_completion_pct ?? 0}%` },
          { label: labels.activeExperiments, value: dashboard.active_experiments ?? 0 },
          { label: labels.ideasInPipeline, value: dashboard.ideas_in_pipeline ?? 0 },
          { label: labels.returnOnInnovation, value: `${dashboard.return_on_innovation ?? 0}%` },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.lab_structure && dashboard.lab_structure.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.labStructure}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {dashboard.lab_structure.map((area) => (
              <article key={area.area} className="rounded-lg border border-fuchsia-100 bg-fuchsia-50 p-3">
                <p className="text-sm font-medium text-fuchsia-900">{area.label}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.ideaPipeline}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.ideas.map((idea) => (
            <article key={idea.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(idea.status)}`}>
                  {idea.status?.replace(/_/g, " ")}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${riskClass(idea.risk_level)}`}>
                  {idea.risk_level} {labels.risk}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{idea.title}</p>
              <p className="mt-1 text-xs text-gray-600">{idea.problem_statement}</p>
              <p className="mt-2 text-xs text-gray-500">
                {labels.value}: {idea.customer_value_score} · {labels.alignment}: {idea.strategic_alignment_score}
              </p>
              {(idea.status === "submitted" || idea.status === "under_review") ? (
                <button
                  type="button"
                  disabled={acting === `approve-${idea.id}`}
                  onClick={() => void approveIdea(idea.id)}
                  className="mt-3 rounded-md bg-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-700 disabled:opacity-50"
                >
                  {labels.approveIdea}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.experiments}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.experiments.map((exp) => (
            <article key={exp.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs capitalize text-gray-500">{exp.experiment_type?.replace(/_/g, " ")}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(exp.status)}`}>
                  {exp.status}
                </span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{exp.title}</p>
              <p className="mt-1 text-xs text-gray-600">{exp.description}</p>
              <p className="mt-2 text-xs text-fuchsia-700 capitalize">
                {labels.stage}: {exp.stage?.replace(/_/g, " ")} · {exp.participant_count} {labels.participants}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-fuchsia-500" style={{ width: `${exp.progress_pct}%` }} />
              </div>
              {exp.status !== "completed" && exp.status !== "cancelled" ? (
                <button
                  type="button"
                  disabled={acting === `advance-${exp.id}`}
                  onClick={() => void advanceExperiment(exp.id)}
                  className="mt-3 rounded-md bg-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-700 disabled:opacity-50"
                >
                  {labels.advanceExperiment}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {dashboard.pilot_programs.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.pilotPrograms}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.pilot_programs.map((pilot) => (
              <article key={pilot.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{pilot.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(pilot.status)}`}>
                    {pilot.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-indigo-800">{pilot.description}</p>
                <p className="mt-2 text-xs text-indigo-700">
                  {pilot.current_participants}/{pilot.max_participants} {labels.participants}
                </p>
                <p className="mt-1 text-xs text-indigo-600">{pilot.success_criteria}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.feature_flags.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.featureFlags}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.feature_flags.map((flag) => (
              <article key={flag.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{flag.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(flag.status)}`}>
                    {flag.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{flag.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {flag.target_segment?.replace(/_/g, " ")} · {flag.exposure_pct}% {labels.exposure}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.scorecard ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.innovationScorecard}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: labels.experimentCompletion, value: `${dashboard.scorecard.experiment_completion_pct ?? 0}%` },
              { label: labels.satisfactionImpact, value: `${dashboard.scorecard.customer_satisfaction_impact ?? 0}%` },
              { label: labels.adoptionPotential, value: `${dashboard.scorecard.adoption_potential_pct ?? 0}%` },
              { label: labels.businessValue, value: dashboard.scorecard.business_value_score ?? 0 },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700">{m.label}</p>
                <p className="text-lg font-semibold text-emerald-900">{m.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.lessons_learned.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.lessonsLearned}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.lessons_learned.map((lesson) => (
              <li key={lesson.id} className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm">
                <span className="font-medium text-violet-900">{lesson.title}</span>
                <span className="ml-2 text-xs capitalize text-violet-700">{lesson.outcome_type}</span>
                <p className="mt-1 text-xs text-violet-800">{lesson.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.sandbox_capabilities && dashboard.sandbox_capabilities.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.sandboxEnvironment}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-700">
            {dashboard.sandbox_capabilities.map((cap) => (
              <li key={cap}>{cap}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.governance_controls && dashboard.governance_controls.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-900">{labels.governanceControls}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
            {dashboard.governance_controls.map((ctrl) => (
              <li key={ctrl}>{ctrl}</li>
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
