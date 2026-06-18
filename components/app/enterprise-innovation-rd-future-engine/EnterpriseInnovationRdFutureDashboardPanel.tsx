"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseEnterpriseInnovationRdFutureCenter,
  type EnterpriseInnovationRdFutureCenter,
} from "@/lib/aipify/enterprise-innovation-rd-future-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "approved":
    case "running":
    case "validated":
    case "completed":
    case "active":
    case "adopt":
    case "trial":
    case "high":
    case "approval":
    case "implementation":
    case "measurement":
      return "bg-emerald-100 text-emerald-800";
    case "review":
    case "planned":
    case "assess":
    case "moderate":
    case "research":
    case "experiment":
    case "validation":
    case "paused":
      return "bg-amber-100 text-amber-800";
    case "rejected":
    case "archived":
    case "critical":
    case "hold":
    case "submitted":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-violet-100 text-violet-800";
  }
}

export function EnterpriseInnovationRdFutureDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseInnovationRdFutureCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-innovation-rd-future-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseInnovationRdFutureCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-innovation-rd-future-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-violet-50/40 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricIdeas, metricValue(overview.ideas_count)],
            [labels.metricExperiments, metricValue(overview.experiments_count)],
            [labels.metricResearch, metricValue(overview.research_projects_count)],
            [labels.metricTechnology, metricValue(overview.technology_reviews_count)],
            [labels.metricOpportunities, metricValue(overview.opportunities_count)],
            [labels.metricHealth, metricValue(overview.innovation_health_score)],
            [labels.metricVelocity, metricValue(overview.innovation_velocity)],
            [labels.metricValidation, metricValue(overview.validation_rate)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        {center.innovation_lab_route ? (
          <div className="mt-4">
            <Link
              href={center.innovation_lab_route}
              className="inline-flex rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
            >
              {labels.openInnovationLab}
            </Link>
          </div>
        ) : null}
      </section>

      <section id="ideas" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.ideasTitle}</h2>
        {center.ideas?.length ? (
          <ul className="mt-4 space-y-3">
            {center.ideas.map((idea) => (
              <li key={idea.id ?? idea.idea_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{idea.idea_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(idea.lifecycle_stage)}`}>
                    {idea.lifecycle_stage}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {idea.source_type} · {labels.scoreLabel} {idea.innovation_score} · {idea.owner_name}
                </p>
                {idea.summary ? <p className="mt-1 text-sm text-gray-600">{idea.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noIdeas}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("submit_idea", {
                idea_title: "Innovation request",
                source_type: "innovation_request",
              })
            }
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.submitIdea}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("approve_idea", { idea_key: "IDEA-001" })}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.approveIdea}
          </button>
        </div>
      </section>

      <section id="research" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.researchTitle}</h2>
        {center.research_projects?.length ? (
          <ul className="mt-4 space-y-3">
            {center.research_projects.map((project) => (
              <li key={project.id ?? project.project_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{project.project_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {project.project_type} · {project.pipeline_stage}
                </p>
                {project.summary ? <p className="mt-1 text-sm text-gray-600">{project.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noResearch}</p>
        )}
        {center.competitive_signals?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.competitiveTitle}</h3>
            <ul className="mt-3 space-y-2">
              {center.competitive_signals.map((signal) => (
                <li key={signal.id ?? signal.signal_key} className="text-sm text-gray-700">
                  <span className="font-medium">{signal.signal_title}</span>
                  <span className="text-xs text-gray-500"> · {signal.signal_type}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("create_research_project", {
              project_title: "Research program",
              project_type: "innovation_program",
            })
          }
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.createResearch}
        </button>
      </section>

      <section id="experiments" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.experimentsTitle}</h2>
        {center.experiments?.length ? (
          <ul className="mt-4 space-y-3">
            {center.experiments.map((exp) => (
              <li key={exp.id ?? exp.experiment_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{exp.experiment_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(exp.status)}`}>
                    {exp.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {exp.experiment_type} · {exp.pipeline_stage}
                </p>
                {exp.summary ? <p className="mt-1 text-sm text-gray-600">{exp.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noExperiments}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("start_experiment", {
                experiment_title: "Product experiment",
                experiment_type: "product",
              })
            }
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.startExperiment}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("complete_experiment", { experiment_key: "EXP-003" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.completeExperiment}
          </button>
        </div>
      </section>

      <section id="technology-radar" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.technologyRadarTitle}</h2>
        {center.technology_radar?.length ? (
          <ul className="mt-4 space-y-3">
            {center.technology_radar.map((item) => (
              <li key={item.id ?? item.radar_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{item.radar_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(item.maturity)}`}>
                    {item.maturity}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.radar_category}</p>
                {item.summary ? <p className="mt-1 text-sm text-gray-600">{item.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noTechnology}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("review_technology", {
              radar_title: "Technology evaluation",
              radar_category: "emerging_technology",
            })
          }
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.reviewTechnology}
        </button>
      </section>

      <section id="opportunities" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.opportunitiesTitle}</h2>
        {center.opportunities?.length ? (
          <ul className="mt-4 space-y-3">
            {center.opportunities.map((opp) => (
              <li key={opp.id ?? opp.opportunity_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{opp.opportunity_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(opp.priority)}`}>
                    {opp.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {opp.opportunity_type} · {opp.pipeline_stage}
                </p>
                {opp.summary ? <p className="mt-1 text-sm text-gray-600">{opp.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noOpportunities}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("add_opportunity", {
              opportunity_title: "Strategic opportunity",
              opportunity_type: "strategic_opportunity",
            })
          }
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.addOpportunity}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
          {center.advisor_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.governanceOwnership}</li>
          <li>{labels.governanceExperimentApproval}</li>
          <li>{labels.governanceMeasurable}</li>
          <li>{labels.governanceAlignment}</li>
          <li>{labels.governanceAudit}</li>
        </ul>
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("approve_innovation_initiative", { initiative_key: "INIT-001" })}
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.approveInitiative}
        </button>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
      </section>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.analyticsTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("refresh_analytics")}
          className="mt-4 rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {labels.pipelineLabel} {String(exec.innovation_pipeline ?? "—")} ·{" "}
          {labels.opportunitiesExecutiveLabel} {String(exec.future_opportunities ?? "—")} · {labels.researchExecutiveLabel}{" "}
          {String(exec.research_programs ?? "—")} · {labels.roiExecutiveLabel} {String(exec.innovation_roi ?? "—")}%
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
