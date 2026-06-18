"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseOrganizationalEvolutionCenter,
  type OrganizationalEvolutionCenter,
} from "@/lib/aipify/organizational-evolution-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "validated":
    case "implemented":
    case "approved":
    case "success":
      return "bg-emerald-100 text-emerald-800";
    case "under_review":
    case "suggested":
    case "monitoring":
      return "bg-amber-100 text-amber-800";
    case "archived":
    case "failure":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function OrganizationalEvolutionDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalEvolutionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-evolution-engine/dashboard");
    if (res.ok) {
      setCenter(parseOrganizationalEvolutionCenter(await res.json()));
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
    const res = await fetch("/api/aipify/organizational-evolution-engine/actions", {
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
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
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

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricSignals, metricValue(overview.learning_signals)],
            [labels.metricOpportunities, metricValue(overview.improvement_opportunities)],
            [labels.metricApproved, metricValue(overview.approved_improvements)],
            [labels.metricLearnings, metricValue(overview.operational_learnings)],
            [labels.metricKnowledge, metricValue(overview.knowledge_improvements)],
            [labels.metricWorkflows, metricValue(overview.workflow_improvements)],
            [labels.metricHealth, metricValue(overview.evolution_health_score)],
            [labels.metricVelocity, metricValue(overview.improvement_velocity_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.learning_route ? (
            <Link href={center.learning_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openLearning}
            </Link>
          ) : null}
          {center.approvals_route ? (
            <Link href={center.approvals_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openApprovals}
            </Link>
          ) : null}
          {center.knowledge_route ? (
            <Link href={center.knowledge_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openKnowledge}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="learning-signals" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.signalsTitle}</h2>
        {center.learning_signals?.length ? (
          <ul className="mt-4 space-y-3">
            {center.learning_signals.map((s) => (
              <li key={s.id ?? s.signal_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{s.signal_title}</p>
                <p className="text-xs uppercase text-gray-500">{s.signal_type}</p>
                {s.observation ? <p className="mt-1 text-sm text-gray-600">{s.observation}</p> : null}
                {s.source_summary ? <p className="mt-1 text-xs text-gray-500">{s.source_summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noSignals}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("record_learning_signal", {
              signal_title: "Approved feedback captured",
              signal_type: "user_feedback",
              observation: "Structured learning signal from evolution center.",
            })
          }
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {acting ? labels.acting : labels.recordSignal}
        </button>
      </section>

      <section id="improvements" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.improvementsTitle}</h2>
        {center.improvement_opportunities?.length ? (
          <ul className="mt-4 space-y-3">
            {center.improvement_opportunities.map((o) => (
              <li key={o.id ?? o.opportunity_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{o.opportunity_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(o.evolution_status)}`}>
                    {o.evolution_status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{o.opportunity_type}</p>
                {o.recommendation ? (
                  <p className="mt-1 text-sm text-gray-600">
                    {labels.recommendation}: {o.recommendation}
                  </p>
                ) : null}
                {["detected", "suggested", "under_review"].includes(o.evolution_status ?? "") ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => void runAction("approve_improvement", { opportunity_key: o.opportunity_key, improvement_title: o.opportunity_title })}
                      className="rounded bg-slate-800 px-3 py-1 text-xs text-white disabled:opacity-50"
                    >
                      {labels.approve}
                    </button>
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => void runAction("reject_improvement", { opportunity_key: o.opportunity_key })}
                      className="rounded border border-slate-300 px-3 py-1 text-xs disabled:opacity-50"
                    >
                      {labels.reject}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noImprovements}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("suggest_improvement", {
              opportunity_title: "Workflow review opportunity",
              opportunity_type: "workflow",
              observation: "Pattern detected in operational telemetry.",
            })
          }
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {acting ? labels.acting : labels.suggestImprovement}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="operational-learning" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.operationalLearningTitle}</h2>
          {center.operational_learnings?.length ? (
            <ul className="mt-4 space-y-3">
              {center.operational_learnings.map((l) => (
                <li key={l.id ?? l.learning_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{l.learning_title}</p>
                  <p className="text-xs text-gray-500">{l.learning_type}</p>
                  {l.outcome_summary ? <p className="mt-1 text-sm text-gray-600">{l.outcome_summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noOperationalLearning}</p>
          )}
        </section>

        <section id="patterns" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.patternsTitle}</h2>
          {center.patterns?.length ? (
            <ul className="mt-4 space-y-3">
              {center.patterns.map((p) => (
                <li key={p.id ?? p.pattern_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{p.pattern_title}</p>
                  <p className="text-xs text-gray-500">
                    {p.pattern_type} · {p.frequency}
                  </p>
                  {p.recommendation ? <p className="mt-1 text-sm text-gray-600">{p.recommendation}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noPatterns}</p>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="knowledge-evolution" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.knowledgeTitle}</h2>
          {center.knowledge_evolution?.length ? (
            <ul className="mt-4 space-y-3">
              {center.knowledge_evolution.map((k) => (
                <li key={k.id ?? k.knowledge_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{k.knowledge_title}</p>
                  <p className="text-xs text-gray-500">
                    {k.knowledge_status} · {k.accuracy_score}%
                  </p>
                  {k.recommendation ? <p className="mt-1 text-sm text-gray-600">{k.recommendation}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noKnowledge}</p>
          )}
        </section>

        <section id="workflow-evolution" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.workflowTitle}</h2>
          {center.workflow_evolution?.length ? (
            <ul className="mt-4 space-y-3">
              {center.workflow_evolution.map((w) => (
                <li key={w.id ?? w.workflow_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{w.workflow_title}</p>
                  <p className="text-xs text-gray-500">
                    {w.workflow_status} · {w.success_rate_percent}%
                  </p>
                  {w.recommendation ? <p className="mt-1 text-sm text-gray-600">{w.recommendation}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noWorkflows}</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.approvedTitle}</h2>
        {center.approved_improvements?.length ? (
          <ul className="mt-4 space-y-3">
            {center.approved_improvements.map((i) => (
              <li key={i.id ?? i.improvement_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{i.improvement_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(i.evolution_status)}`}>
                    {i.evolution_status}
                  </span>
                </div>
                {i.business_impact ? <p className="mt-1 text-sm text-gray-600">{i.business_impact}</p> : null}
                {i.evolution_status === "approved" ? (
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => void runAction("implement_improvement", { improvement_key: i.improvement_key })}
                    className="mt-2 rounded bg-slate-800 px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    {labels.implement}
                  </button>
                ) : null}
                {i.evolution_status === "implemented" ? (
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => void runAction("validate_outcome", { improvement_key: i.improvement_key })}
                    className="mt-2 rounded border border-slate-300 px-3 py-1 text-xs disabled:opacity-50"
                  >
                    {labels.validate}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noApproved}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="intelligence" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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

        <section id="advisor" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
          <li>{labels.governanceNoSelfModify}</li>
          <li>{labels.governanceNoPolicyChanges}</li>
          <li>{labels.governanceNoPermissionChanges}</li>
          <li>{labels.governanceHumanApproval}</li>
          <li>{labels.governanceHumanOverride}</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
      </section>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.auditTitle}</h2>
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
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {String(exec.improvement_velocity ?? "—")} {labels.velocityLabel},{" "}
          {String(exec.operational_improvements ?? "—")} {labels.implementedLabel},{" "}
          {String(exec.business_impact_score ?? "—")} {labels.impactLabel}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
