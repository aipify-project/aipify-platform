"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseAutonomousEnterpriseOperationsCenter,
  type AutonomousEnterpriseOperationsCenter,
} from "@/lib/aipify/autonomous-enterprise-operations-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "captured":
    case "completed":
    case "approved":
    case "resolved":
    case "active":
    case "coordinating":
      return "bg-emerald-100 text-emerald-800";
    case "open":
    case "reviewing":
    case "pending":
    case "draft":
    case "planned":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "dismissed":
    case "rejected":
    case "blocked":
    case "critical":
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function AutonomousEnterpriseOperationsDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<AutonomousEnterpriseOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/autonomous-enterprise-operations-engine/dashboard");
    if (res.ok) {
      setCenter(parseAutonomousEnterpriseOperationsCenter(await res.json()));
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
    const res = await fetch("/api/aipify/autonomous-enterprise-operations-engine/actions", {
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
  const governance = center.governance ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section id="overview" className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        {center.mission ? <p className="mt-1 text-sm text-gray-600">{center.mission}</p> : null}
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricOpportunities, metricValue(overview.detected_opportunities)],
            [labels.metricRisks, metricValue(overview.detected_risks)],
            [labels.metricRecommendations, metricValue(overview.recommended_actions)],
            [labels.metricPendingApprovals, metricValue(overview.pending_approvals)],
            [labels.metricAutonomousActivity, metricValue(overview.autonomous_activity)],
            [labels.metricHealth, metricValue(overview.operations_health_score)],
            [labels.metricAutonomyLevel, metricValue(overview.autonomy_level)],
            [labels.metricAutomationCoverage, metricValue(overview.automation_coverage_percent)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        {center.autonomy_levels?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {center.autonomy_levels.map((level) => (
              <span
                key={level.level}
                className={`rounded-full px-2 py-0.5 text-xs ${
                  level.level === overview.autonomy_level
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {level.level}: {level.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {center.approvals_route ? (
            <Link href={center.approvals_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openApprovals}
            </Link>
          ) : null}
          {center.actions_route ? (
            <Link href={center.actions_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openActions}
            </Link>
          ) : null}
          {center.command_center_route ? (
            <Link href={center.command_center_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openCommandCenter}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="opportunities" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.opportunitiesTitle}</h2>
        {center.opportunities?.length ? (
          <ul className="mt-4 space-y-3">
            {center.opportunities.map((o) => (
              <li key={o.id ?? o.opportunity_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{o.opportunity_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(o.status)}`}>{o.status}</span>
                </div>
                <p className="text-xs text-gray-500">{o.opportunity_type}</p>
                {o.impact_summary ? <p className="mt-1 text-sm text-gray-600">{o.impact_summary}</p> : null}
                {o.recommendation ? (
                  <p className="mt-1 text-sm text-gray-600">
                    {labels.recommendation}: {o.recommendation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noOpportunities}</p>
        )}
      </section>

      <section id="risks" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.risksTitle}</h2>
        {center.risks?.length ? (
          <ul className="mt-4 space-y-3">
            {center.risks.map((r) => (
              <li key={r.id ?? r.risk_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{r.risk_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(r.severity)}`}>{r.severity}</span>
                </div>
                <p className="text-xs text-gray-500">{r.risk_type}</p>
                {r.impact_summary ? <p className="mt-1 text-sm text-gray-600">{r.impact_summary}</p> : null}
                {r.mitigation_recommendation ? (
                  <p className="mt-1 text-sm text-gray-600">
                    {labels.mitigation}: {r.mitigation_recommendation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noRisks}</p>
        )}
      </section>

      <section id="planning" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.plansTitle}</h2>
        {center.plans?.length ? (
          <ul className="mt-4 space-y-3">
            {center.plans.map((p) => (
              <li key={p.id ?? p.plan_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{p.plan_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(p.status)}`}>{p.status}</span>
                </div>
                <p className="text-xs text-gray-500">{p.plan_type}</p>
                {p.plan_summary ? <p className="mt-1 text-sm text-gray-600">{p.plan_summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noPlans}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("generate_plan", {
              plan_title: "Autonomous action plan",
              plan_type: "action",
              plan_summary: "Generated from Autonomous Operations Center.",
            })
          }
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {acting ? labels.acting : labels.generatePlan}
        </button>
      </section>

      <section id="recommendations" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recommendationsTitle}</h2>
        {center.recommendations?.length ? (
          <ul className="mt-4 space-y-3">
            {center.recommendations.map((r) => (
              <li key={r.id ?? r.recommendation_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{r.recommendation_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(r.status)}`}>{r.status}</span>
                </div>
                <p className="text-xs text-gray-500">{r.recommendation_type}</p>
                {r.observation ? <p className="mt-1 text-sm text-gray-600">{r.observation}</p> : null}
                {r.recommendation ? (
                  <p className="mt-1 text-sm text-gray-600">
                    {labels.recommendation}: {r.recommendation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noRecommendations}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="workflows" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.workflowsTitle}</h2>
          {center.workflows?.length ? (
            <ul className="mt-4 space-y-3">
              {center.workflows.map((w) => (
                <li key={w.id ?? w.workflow_key} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{w.workflow_title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(w.status)}`}>{w.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">{w.coordination_type}</p>
                  {w.summary ? <p className="mt-1 text-sm text-gray-600">{w.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noWorkflows}</p>
          )}
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("coordinate_workflow", {
                workflow_title: "Cross-team coordination",
                coordination_type: "cross_team",
                summary: "Autonomous workflow coordination initiated.",
              })
            }
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {acting ? labels.acting : labels.coordinateWorkflow}
          </button>
        </section>

        <section id="proactive-items" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.proactiveTitle}</h2>
          {center.proactive_items?.length ? (
            <ul className="mt-4 space-y-3">
              {center.proactive_items.map((item) => (
                <li key={item.id ?? item.item_key} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{item.item_title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(item.priority)}`}>{item.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.item_type} · {item.status}
                  </p>
                  {item.assigned_to ? <p className="mt-1 text-xs text-gray-500">{item.assigned_to}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noProactive}</p>
          )}
          <button
            type="button"
            disabled={acting}
            onClick={() =>
              void runAction("create_proactive_task", {
                item_title: "Proactive review task",
                item_type: "review",
                priority: "moderate",
              })
            }
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {acting ? labels.acting : labels.createProactiveTask}
          </button>
        </section>
      </div>

      <section id="approvals" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.approvalQueueTitle}</h2>
        {center.approval_queue?.length ? (
          <ul className="mt-4 space-y-3">
            {center.approval_queue.map((a) => (
              <li key={a.id ?? a.queue_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{a.queue_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(a.status)}`}>{a.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {a.approval_type} · {labels.autonomyLevelLabel} {a.autonomy_level_required} · {a.risk_level}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noApprovalQueue}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() =>
            void runAction("request_approval", {
              queue_title: "Autonomous operation approval",
              approval_type: "recommendation",
              autonomy_level_required: 4,
              risk_level: "medium",
            })
          }
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {acting ? labels.acting : labels.requestApproval}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="intelligence" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  <p className="text-xs text-gray-500">{s.signal_type}</p>
                  {s.impact ? <p className="mt-1 text-sm text-gray-600">{s.impact}</p> : null}
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
                  <p className="text-xs text-gray-500">{s.signal_type}</p>
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

      <section id="improvements" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.improvementsTitle}</h2>
        {center.improvements?.length ? (
          <ul className="mt-4 space-y-3">
            {center.improvements.map((i) => (
              <li key={i.id ?? i.improvement_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{i.improvement_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(i.status)}`}>{i.status}</span>
                </div>
                <p className="text-xs text-gray-500">{i.improvement_type}</p>
                {i.outcome_summary ? <p className="mt-1 text-sm text-gray-600">{i.outcome_summary}</p> : null}
                {i.business_impact ? <p className="mt-1 text-sm text-gray-600">{i.business_impact}</p> : null}
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
            void runAction("record_improvement", {
              improvement_title: "Operational improvement",
              improvement_type: "operational",
              outcome_summary: "Improvement identified through autonomous operations review.",
              business_impact: "Reduced manual coordination overhead.",
            })
          }
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {acting ? labels.acting : labels.recordImprovement}
        </button>
      </section>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {governance.human_oversight_mandatory ? <li>{labels.governanceHumanOversight}</li> : null}
          {governance.human_override_available ? <li>{labels.governanceHumanOverride}</li> : null}
          {governance.approval_boundaries_enforced ? <li>{labels.governanceApprovalBoundaries}</li> : null}
          {governance.audit_logging_required ? <li>{labels.governanceAudit}</li> : null}
          {governance.no_execution_beyond_policy ? <li>{labels.governanceNoExecutionBeyondPolicy}</li> : null}
        </ul>
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
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {String(exec.autonomous_activity ?? "—")} {labels.activityLabel},{" "}
          {String(exec.opportunities_captured ?? "—")} {labels.opportunitiesCapturedLabel},{" "}
          {String(exec.risks_prevented ?? "—")} {labels.risksPreventedLabel},{" "}
          {String(exec.operational_improvements ?? "—")} {labels.improvementsLabel},{" "}
          {String(exec.automation_coverage ?? "—")}% {labels.coverageLabel},{" "}
          {String(exec.business_impact_score ?? "—")} {labels.impactLabel}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
