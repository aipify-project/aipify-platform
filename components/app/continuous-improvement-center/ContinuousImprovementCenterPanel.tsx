"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CI_CORE_PRINCIPLE,
  CI_PHILOSOPHY,
  CI_VISION,
  parseContinuousImprovementCenter,
  type ContinuousImprovementCenter,
  type ImprovementInitiative,
  type ImprovementOpportunity,
} from "@/lib/continuous-improvement-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  executiveLink: string;
  decisionSupportLink: string;
  strategicIntelligenceLink: string;
  ciEngineLink: string;
  enterpriseImprovementLink: string;
  dashboardTitle: string;
  opportunitiesTitle: string;
  initiativesTitle: string;
  insightsTitle: string;
  recommendationsTitle: string;
  lessonsTitle: string;
  workflowTitle: string;
  emptySection: string;
  domain: string;
  impact: string;
  effort: string;
  frequency: string;
  priorityMatrix: string;
  owner: string;
  teams: string;
  status: string;
  dismiss: string;
  accept: string;
  approve: string;
  complete: string;
  archive: string;
  submitOpportunity: string;
  opportunityTitle: string;
  opportunitySummary: string;
  captureLesson: string;
  lessonTitle: string;
  lessonContent: string;
  humansDecide: string;
  privacyNote: string;
  domains: Record<string, string>;
  priorityMatrixLabels: Record<string, string>;
  statuses: Record<string, string>;
  outcomeTypes: Record<string, string>;
  metrics: Record<string, string>;
};

type Props = { labels: PanelLabels };

const MATRIX_STYLES: Record<string, string> = {
  quick_wins: "bg-emerald-100 text-emerald-900",
  strategic_improvements: "bg-indigo-100 text-indigo-900",
  monitor: "bg-sky-100 text-sky-800",
  future_consideration: "bg-gray-100 text-gray-700",
};

const STATUS_STYLES: Record<string, string> = {
  proposed: "bg-gray-100 text-gray-700",
  under_review: "bg-amber-100 text-amber-900",
  approved: "bg-indigo-100 text-indigo-900",
  in_progress: "bg-sky-100 text-sky-900",
  completed: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-100 text-slate-600",
};

export function ContinuousImprovementCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<ContinuousImprovementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [oppTitle, setOppTitle] = useState("");
  const [oppSummary, setOppSummary] = useState("");
  const [oppDomain, setOppDomain] = useState("operational");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/continuous-improvement/center");
    if (res.ok) setCenter(parseContinuousImprovementCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/continuous-improvement/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.executive && (
          <Link href={center.links.executive} className="text-slate-600 hover:underline">
            {labels.executiveLink}
          </Link>
        )}
        {center?.links?.decision_support && (
          <Link href={center.links.decision_support} className="text-slate-600 hover:underline">
            {labels.decisionSupportLink}
          </Link>
        )}
        {center?.links?.strategic_intelligence && (
          <Link href={center.links.strategic_intelligence} className="text-slate-600 hover:underline">
            {labels.strategicIntelligenceLink}
          </Link>
        )}
        {center?.links?.continuous_improvement_engine && (
          <Link href={center.links.continuous_improvement_engine} className="text-slate-600 hover:underline">
            {labels.ciEngineLink}
          </Link>
        )}
        {center?.links?.enterprise_improvement && (
          <Link href={center.links.enterprise_improvement} className="text-slate-600 hover:underline">
            {labels.enterpriseImprovementLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {CI_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {CI_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {CI_VISION}
        </p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.opportunities} value={dash.opportunities_identified} />
            <Metric label={labels.metrics.implemented} value={dash.improvements_implemented} />
            <Metric label={labels.metrics.impactHours} value={dash.impact_estimate_hours} />
            <Metric label={labels.metrics.participation} value={dash.department_participation} />
            <Metric label={labels.metrics.activeInitiatives} value={dash.initiatives_active} />
            <Metric label={labels.metrics.recommendations} value={dash.recommendations_open} />
            <Metric label={labels.metrics.satisfaction} value={`${dash.employee_satisfaction}/5`} />
            <Metric label={labels.metrics.trust} value={`${dash.executive_trust_score}%`} />
          </dl>
        </section>
      )}

      <OpportunitySection
        title={labels.opportunitiesTitle}
        opportunities={center?.opportunities ?? []}
        labels={labels}
        canManage={center?.can_manage ?? false}
        canContribute={center?.can_contribute ?? false}
        oppTitle={oppTitle}
        oppSummary={oppSummary}
        oppDomain={oppDomain}
        setOppTitle={setOppTitle}
        setOppSummary={setOppSummary}
        setOppDomain={setOppDomain}
        onAction={postAction}
      />

      <InitiativeSection
        title={labels.initiativesTitle}
        initiatives={center?.initiatives ?? []}
        labels={labels}
        canManage={center?.can_manage ?? false}
        onAction={postAction}
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.insightsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.insights.map((ins) => (
            <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
              <p className="text-gray-800">{ins.message}</p>
              {center?.can_manage && (
                <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_insight", insight_key: ins.insight_key })}>
                  {labels.dismiss}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recommendationsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.recommendations.map((rec) => (
            <li key={rec.recommendation_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="text-gray-800">{rec.message}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {center?.can_manage && (
                  <>
                    <ActionBtn label={labels.accept} onClick={() => void postAction({ action: "accept_recommendation", recommendation_key: rec.recommendation_key })} />
                    <ActionBtn label={labels.dismiss} variant="muted" onClick={() => void postAction({ action: "dismiss_recommendation", recommendation_key: rec.recommendation_key })} />
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.lessonsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.lessons_learned.map((lesson) => (
            <li key={lesson.lesson_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="font-medium text-gray-900">{lesson.title}</p>
              <p className="mt-1 text-gray-700">{lesson.content}</p>
              <p className="mt-2 text-xs text-gray-500">{labels.outcomeTypes[lesson.outcome_type] ?? lesson.outcome_type}</p>
            </li>
          ))}
        </ul>
        {center?.can_contribute && (
          <form
            className="mt-6 space-y-3 rounded-xl border border-dashed border-gray-200 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              void postAction({ action: "capture_lesson", title: lessonTitle, content: lessonContent }).then(() => {
                setLessonTitle("");
                setLessonContent("");
              });
            }}
          >
            <input type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder={labels.lessonTitle} className="w-full rounded-lg border px-3 py-2 text-sm" required />
            <textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} placeholder={labels.lessonContent} className="w-full rounded-lg border px-3 py-2 text-sm" rows={3} required />
            <button type="submit" className="rounded-lg border border-indigo-200 bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
              {labels.captureLesson}
            </button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.workflowTitle}</h2>
        <ol className="mt-4 flex flex-wrap gap-2 text-sm">
          {(["proposed", "under_review", "approved", "in_progress", "completed", "archived"] as const).map((stage, i) => (
            <li key={stage} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[stage]}`}>{labels.statuses[stage]}</span>
              {i < 5 && <span className="text-gray-400">→</span>}
            </li>
          ))}
        </ol>
      </section>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function OpportunitySection({
  title,
  opportunities,
  labels,
  canManage,
  canContribute,
  oppTitle,
  oppSummary,
  oppDomain,
  setOppTitle,
  setOppSummary,
  setOppDomain,
  onAction,
}: {
  title: string;
  opportunities: ImprovementOpportunity[];
  labels: PanelLabels;
  canManage: boolean;
  canContribute: boolean;
  oppTitle: string;
  oppSummary: string;
  oppDomain: string;
  setOppTitle: (v: string) => void;
  setOppSummary: (v: string) => void;
  setOppDomain: (v: string) => void;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {opportunities.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {opportunities.map((opp) => (
            <li key={opp.opportunity_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold text-gray-900">{opp.title}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${MATRIX_STYLES[opp.priority_matrix] ?? MATRIX_STYLES.monitor}`}>
                  {labels.priorityMatrixLabels[opp.priority_matrix] ?? opp.priority_matrix}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{opp.summary}</p>
              <p className="mt-2 text-xs text-gray-500">
                {labels.domain}: {labels.domains[opp.domain] ?? opp.domain} · {labels.impact}: {opp.impact} · {labels.effort}: {opp.effort} · {labels.frequency}: {opp.frequency}
              </p>
              {canManage && (
                <ActionBtn label={labels.dismiss} variant="muted" className="mt-3" onClick={() => void onAction({ action: "dismiss_opportunity", opportunity_key: opp.opportunity_key })} />
              )}
            </li>
          ))}
        </ul>
      )}
      {canContribute && (
        <form
          className="mt-6 space-y-3 rounded-xl border border-dashed border-gray-200 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void onAction({ action: "submit_opportunity", title: oppTitle, summary: oppSummary, domain: oppDomain }).then(() => {
              setOppTitle("");
              setOppSummary("");
            });
          }}
        >
          <input type="text" value={oppTitle} onChange={(e) => setOppTitle(e.target.value)} placeholder={labels.opportunityTitle} className="w-full rounded-lg border px-3 py-2 text-sm" required />
          <textarea value={oppSummary} onChange={(e) => setOppSummary(e.target.value)} placeholder={labels.opportunitySummary} className="w-full rounded-lg border px-3 py-2 text-sm" rows={3} required />
          <select value={oppDomain} onChange={(e) => setOppDomain(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            {Object.entries(labels.domains).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border border-indigo-200 bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
            {labels.submitOpportunity}
          </button>
        </form>
      )}
    </section>
  );
}

function InitiativeSection({
  title,
  initiatives,
  labels,
  canManage,
  onAction,
}: {
  title: string;
  initiatives: ImprovementInitiative[];
  labels: PanelLabels;
  canManage: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {initiatives.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {initiatives.map((init) => (
            <li key={init.initiative_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold text-gray-900">{init.title}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[init.status] ?? STATUS_STYLES.proposed}`}>
                  {labels.statuses[init.status] ?? init.status}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{init.summary}</p>
              <p className="mt-2 text-xs text-gray-500">
                {labels.domain}: {labels.domains[init.domain] ?? init.domain}
                {init.owner_label ? ` · ${labels.owner}: ${init.owner_label}` : ""}
                {init.participating_teams ? ` · ${labels.teams}: ${init.participating_teams}` : ""}
              </p>
              {canManage && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {init.status === "under_review" && (
                    <ActionBtn label={labels.approve} onClick={() => void onAction({ action: "approve_initiative", initiative_key: init.initiative_key })} />
                  )}
                  {init.status === "approved" && (
                    <ActionBtn label={labels.statuses.in_progress} onClick={() => void onAction({ action: "update_initiative_status", initiative_key: init.initiative_key, status: "in_progress" })} />
                  )}
                  {init.status === "in_progress" && (
                    <ActionBtn label={labels.complete} onClick={() => void onAction({ action: "complete_initiative", initiative_key: init.initiative_key })} />
                  )}
                  {init.status === "completed" && (
                    <ActionBtn label={labels.archive} variant="muted" onClick={() => void onAction({ action: "archive_initiative", initiative_key: init.initiative_key })} />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = "primary",
  className = "",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "muted";
  className?: string;
}) {
  const styles =
    variant === "muted"
      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      : "border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${styles} ${className}`}>
      {label}
    </button>
  );
}
