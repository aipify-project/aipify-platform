"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseExecutiveInsightsEngineDashboard,
  type ExecutiveInsightsEngineDashboard,
} from "@/lib/aipify/executive-insights-engine";

type Props = { labels: Record<string, string> };

function healthClass(status?: string) {
  switch (status) {
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "healthy":
      return "bg-sky-100 text-sky-800";
    case "needs_attention":
      return "bg-amber-100 text-amber-800";
    case "action_recommended":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function urgencyClass(urgency?: string) {
  switch (urgency) {
    case "critical":
    case "high":
      return "bg-rose-100 text-rose-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function ExecutiveInsightsEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ExecutiveInsightsEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/executive-insights-engine/dashboard");
    if (res.ok) setDashboard(parseExecutiveInsightsEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generateReport(period: string) {
    setActionId(`report-${period}`);
    const res = await fetch("/api/executive/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporting_period: period }),
    });
    if (res.ok) {
      const report = (await res.json()) as { id?: string };
      if (report.id) await fetch(`/api/executive/reports/${report.id}/export`);
    }
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const health = dashboard.organization_health ?? {};
  const since = dashboard.since_last_time;

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Link href="/app/analytics-insights-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.analytics}
          </Link>
          <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.operations}
          </Link>
          <Link href="/app/customer-success-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.customerSuccess}
          </Link>
          <Link href="/app/strategy" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.strategicIntelligence}
          </Link>
          <Link href="/app/executive" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.executiveDashboard}
          </Link>
        </div>
      )}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${healthClass(summary.health_status as string)}`}
          >
            {String(summary.health_status ?? "healthy")}
          </span>
        </div>
        {dashboard.mission ? <p className="mt-2 text-sm font-medium">{dashboard.mission}</p> : null}
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p> : null}
        {dashboard.executive_insights_engine_note ? (
          <p className="mt-1 text-xs text-violet-700">{dashboard.executive_insights_engine_note}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-1 text-xs text-violet-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.strategic_thinking_note ? (
          <p className="mt-1 text-xs text-indigo-800">{dashboard.strategic_thinking_note}</p>
        ) : null}
        {dashboard.executive_companion_note ? (
          <p className="mt-1 text-xs text-teal-800">{dashboard.executive_companion_note}</p>
        ) : null}
        {dashboard.executive_reflection_note ? (
          <p className="mt-1 text-xs text-rose-800">{dashboard.executive_reflection_note}</p>
        ) : null}
        {dashboard.companion_mission ? (
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.companion_mission}</p>
        ) : null}
        {dashboard.companion_philosophy ? (
          <p className="mt-1 text-sm text-teal-800">{dashboard.companion_philosophy}</p>
        ) : null}
        {dashboard.companion_abos_principle ? (
          <p className="mt-1 text-xs text-teal-700">{dashboard.companion_abos_principle}</p>
        ) : null}
        {dashboard.blueprint_distinction_note ? (
          <p className="mt-1 text-xs text-gray-500">{dashboard.blueprint_distinction_note}</p>
        ) : null}
        {dashboard.companion_blueprint_distinction_note ? (
          <p className="mt-1 text-xs text-gray-500">{dashboard.companion_blueprint_distinction_note}</p>
        ) : null}
        {dashboard.reflection_blueprint_distinction_note ? (
          <p className="mt-1 text-xs text-gray-500">{dashboard.reflection_blueprint_distinction_note}</p>
        ) : null}
        {dashboard.reflection_mission ? (
          <p className="mt-2 text-sm font-medium text-rose-900">{dashboard.reflection_mission}</p>
        ) : null}
        {dashboard.reflection_philosophy ? (
          <p className="mt-1 text-sm text-rose-800">{dashboard.reflection_philosophy}</p>
        ) : null}
        {dashboard.reflection_abos_principle ? (
          <p className="mt-1 text-xs text-rose-700">{dashboard.reflection_abos_principle}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.safety_note}</p>
        ) : null}
      </section>

      {since ? (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.sinceLastTime}</h3>
          {since.trend_summary ? (
            <p className="mt-2 text-sm text-indigo-900">{since.trend_summary}</p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.supportResolved}</p>
              <p className="mt-1 text-xl font-semibold">{since.support_cases_resolved ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.kcUpdated}</p>
              <p className="mt-1 text-xl font-semibold">{since.kc_articles_updated ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.tasksCompleted}</p>
              <p className="mt-1 text-xl font-semibold">{since.high_priority_tasks_completed ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.bottlenecks}</p>
              <p className="mt-1 text-xl font-semibold">{since.bottlenecks_open ?? 0}</p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.bellMoments}</p>
              <p className="mt-1 text-xl font-semibold">{since.bell_moments ?? 0}</p>
            </div>
          </div>
          {since.assumption_note ? (
            <p className="mt-3 text-xs text-gray-500">{since.assumption_note}</p>
          ) : null}
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.organizationHealth}</p>
          <p className="mt-1 text-2xl font-semibold">{String(health.score ?? summary.health_score ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.operationalRisks}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.risk_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.strategicOpportunities}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.opportunity_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.actionsRequiringAttention}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.action_count ?? 0)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={actionId !== null}
          onClick={() => void generateReport("weekly")}
          className="rounded-lg bg-violet-700 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {actionId === "report-weekly" ? labels.generating : labels.generateWeekly}
        </button>
        <button
          type="button"
          disabled={actionId !== null}
          onClick={() => void generateReport("monthly")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          {actionId === "report-monthly" ? labels.generating : labels.generateMonthly}
        </button>
      </div>

      {dashboard.insight_categories && dashboard.insight_categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.insightCategories}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.insight_categories.map((category) => (
              <div key={category.key ?? category.label} className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
                <p className="text-sm font-medium text-violet-900">{category.label}</p>
                {category.description ? (
                  <p className="mt-1 text-xs text-gray-600">{category.description}</p>
                ) : null}
                {(category.examples ?? []).length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-gray-600">
                    {category.examples!.slice(0, 2).map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.majorAchievements}</h3>
        {(dashboard.major_achievements ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.major_achievements.map((item, idx) => (
              <li key={String(item.title ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{String(item.title ?? "")}</span>
                {item.summary ? <span className="text-gray-600"> · {String(item.summary)}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.operationalRisks}</h3>
        {(dashboard.operational_risks ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.operational_risks.slice(0, 8).map((item, idx) => (
              <li key={String(item.title ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{String(item.title ?? "")}</span>
                  {item.severity ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${urgencyClass(item.severity)}`}>
                      {String(item.severity)}
                    </span>
                  ) : null}
                </div>
                {item.source_label ? (
                  <p className="mt-1 text-xs text-gray-500">{String(item.source_label)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.strategicOpportunities}</h3>
        {(dashboard.strategic_opportunities ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.strategic_opportunities.slice(0, 8).map((item, idx) => (
              <li key={String(item.title ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.title ?? "")}
                {item.summary ? <span className="text-gray-600"> · {String(item.summary)}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.customerTrends}</h3>
        {(dashboard.customer_trends ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.customer_trends.map((trend, idx) => (
              <div key={String(trend.metric ?? idx)} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="text-xs text-gray-500">{String(trend.metric ?? "")}</p>
                <p className="mt-1 font-semibold">{String(trend.value ?? "—")}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendedActions}</h3>
        {(dashboard.recommended_actions ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {dashboard.recommended_actions.map((action, idx) => (
              <li key={String(action.action_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{String(action.title ?? "")}</span>
                  {action.urgency ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${urgencyClass(action.urgency)}`}>
                      {String(action.urgency)}
                    </span>
                  ) : null}
                </div>
                {action.rationale ? <p className="mt-1 text-gray-600">{String(action.rationale)}</p> : null}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  {action.expected_outcome ? <span>{labels.expectedOutcome}: {String(action.expected_outcome)}</span> : null}
                  {action.estimated_effort ? <span>{labels.estimatedEffort}: {String(action.estimated_effort)}</span> : null}
                </div>
                {action.route ? (
                  <Link href={String(action.route)} className="mt-2 inline-block text-xs text-violet-700">
                    {labels.openModule}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recentReports}</h3>
        {(dashboard.recent_reports ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.recent_reports.map((report, idx) => (
              <li key={String(report.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium capitalize">{String(report.reporting_period ?? "")}</span>
                <span className="text-gray-500"> · {String(report.created_at ?? "")}</span>
                {report.summary ? <p className="mt-1 text-gray-600">{String(report.summary)}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.success_criteria.map((criterion) => (
              <li
                key={criterion.key ?? criterion.label}
                className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                >
                  {criterion.met ? labels.criterionMet : labels.criterionPending}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{criterion.label}</p>
                  {criterion.note ? <p className="mt-1 text-xs text-gray-500">{criterion.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.strategic_engagement_summary ? (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-6">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.strategicEngagement}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.strategicObjectives}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.strategic_engagement_summary.strategic_objectives_active ?? 0}
                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  / {dashboard.strategic_engagement_summary.strategic_objectives_total ?? 0}
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.activeOkrs}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.strategic_engagement_summary.active_okr_objectives ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.openOpportunities}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.strategic_engagement_summary.open_strategic_opportunities ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.pendingDecisions}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.strategic_engagement_summary.pending_org_decisions ?? 0}
              </p>
            </div>
          </div>
          {dashboard.strategic_engagement_summary.summary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.strategic_engagement_summary.summary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.strategic_thinking_objectives && dashboard.strategic_thinking_objectives.length > 0 ? (
        <section className="rounded-xl border border-indigo-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicObjectivesTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.strategic_thinking_objectives.map((obj) => (
              <div key={obj.key ?? obj.label} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <p className="text-sm font-medium text-indigo-900">{obj.label}</p>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.strategic_conversations && dashboard.strategic_conversations.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicConversations}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.strategic_conversations.map((item) => (
              <li key={item.key ?? item.scenario} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.scenario ? <p className="text-xs text-gray-500">{item.scenario}</p> : null}
                <p className="mt-1">{item.question ?? item.example}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.priority_alignment ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.priorityAlignment}</h3>
          {dashboard.priority_alignment.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.priority_alignment.principle}</p>
          ) : null}
          {(dashboard.priority_alignment.dimensions ?? []).length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.priority_alignment.dimensions!.map((dim) => (
                <div key={String(dim.key ?? dim.label)} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <p className="font-medium">{String(dim.label ?? "")}</p>
                  {dim.description ? <p className="mt-1 text-xs text-gray-600">{String(dim.description)}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {(dashboard.priority_alignment.misalignment_scaffold ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-gray-600">
              {dashboard.priority_alignment.misalignment_scaffold!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {dashboard.priority_alignment.boundary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.priority_alignment.boundary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.opportunity_exploration ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.opportunityExploration}</h3>
          {dashboard.opportunity_exploration.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.opportunity_exploration.principle}</p>
          ) : null}
          {(dashboard.opportunity_exploration.exploration_types ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.opportunity_exploration.exploration_types!.map((item) => (
                <li key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{String(item.label ?? "")}</span>
                    {item.source_type ? (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                        {String(item.source_type)}
                      </span>
                    ) : null}
                  </div>
                  {item.description ? <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.opportunity_exploration.awareness_not_certainty ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.opportunity_exploration.awareness_not_certainty}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.strategic_review_sessions ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicReviewSessions}</h3>
          {dashboard.strategic_review_sessions.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.strategic_review_sessions.principle}</p>
          ) : null}
          {(dashboard.strategic_review_sessions.cadences ?? []).length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {dashboard.strategic_review_sessions.cadences!.map((cadence) => (
                <div key={String(cadence.key ?? cadence.label)} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <p className="font-medium">{String(cadence.label ?? "")}</p>
                  {cadence.description ? <p className="mt-1 text-xs text-gray-600">{String(cadence.description)}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {dashboard.strategic_review_sessions.boundary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.strategic_review_sessions.boundary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.executive_briefings && dashboard.executive_briefings.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveBriefings}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.executive_briefings.map((item) => (
              <li key={item.key ?? item.scenario} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.scenario ? <p className="text-xs text-gray-500">{item.scenario}</p> : null}
                <p className="mt-1">{item.example}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.strategic_trust ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicTrust}</h3>
          {dashboard.strategic_trust.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.strategic_trust.principle}</p>
          ) : null}
          {dashboard.strategic_trust.data_vs_hypotheses ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-emerald-800">{labels.verifiedData}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                  {(dashboard.strategic_trust.data_vs_hypotheses.verified_data ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-amber-800">{labels.hypotheses}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                  {(dashboard.strategic_trust.data_vs_hypotheses.hypotheses ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
          {dashboard.strategic_trust.uncertainty_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.strategic_trust.uncertainty_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.strategic_self_love ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicSelfLove}</h3>
          {dashboard.strategic_self_love.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.strategic_self_love.principle}</p>
          ) : null}
          {(dashboard.strategic_self_love.strategic_patterns ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.strategic_self_love.strategic_patterns!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(dashboard.strategic_integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.strategic_integration_links!.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      {dashboard.strategic_success_criteria && dashboard.strategic_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.strategicSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.strategic_success_criteria.map((criterion) => (
              <li
                key={criterion.key ?? criterion.label}
                className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                >
                  {criterion.met ? labels.criterionMet : labels.criterionPending}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{criterion.label}</p>
                  {criterion.note ? <p className="mt-1 text-xs text-gray-500">{criterion.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.companion_integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.companion_integration_links!.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-teal-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      {dashboard.companion_engagement_summary ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50/40 p-6">
          <h3 className="text-sm font-semibold text-teal-900">{labels.companionEngagement}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-teal-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.companionHealthScore}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.companion_engagement_summary.organization_health_score ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-teal-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.companionReports}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.companion_engagement_summary.executive_reports_total ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-teal-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.companionRisks}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.companion_engagement_summary.operational_risks_count ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-teal-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.companionActions}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.companion_engagement_summary.recommended_actions_count ?? 0}
              </p>
            </div>
          </div>
          {dashboard.companion_engagement_summary.summary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.companion_engagement_summary.summary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.executive_companion_objectives && dashboard.executive_companion_objectives.length > 0 ? (
        <section className="rounded-xl border border-teal-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionObjectivesTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.executive_companion_objectives.map((obj) => (
              <div key={obj.key ?? obj.label} className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
                <p className="text-sm font-medium text-teal-900">{obj.label}</p>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_daily_briefings && dashboard.companion_daily_briefings.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionDailyBriefings}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.companion_daily_briefings.map((item) => (
              <li key={item.key ?? item.scenario} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.scenario ? <p className="text-xs text-gray-500">{item.scenario}</p> : null}
                <p className="mt-1">{item.example}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_leadership_preparation ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipPreparation}</h3>
          {dashboard.companion_leadership_preparation.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.companion_leadership_preparation.principle}</p>
          ) : null}
          {(dashboard.companion_leadership_preparation.preparation_types ?? []).length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.companion_leadership_preparation.preparation_types!.map((item) => (
                <div key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <p className="font-medium">{String(item.label ?? "")}</p>
                  {item.description ? <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {dashboard.companion_leadership_preparation.boundary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.companion_leadership_preparation.boundary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_executive_reflection && dashboard.companion_executive_reflection.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveReflection}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.companion_executive_reflection.map((item) => (
              <li key={item.key ?? item.scenario} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.scenario ? <p className="text-xs text-gray-500">{item.scenario}</p> : null}
                <p className="mt-1">{item.question ?? item.example}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_priority_alignment ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionPriorityAlignment}</h3>
          {dashboard.companion_priority_alignment.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.companion_priority_alignment.principle}</p>
          ) : null}
          {(dashboard.companion_priority_alignment.dimensions ?? []).length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.companion_priority_alignment.dimensions!.map((dim) => (
                <div key={String(dim.key ?? dim.label)} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <p className="font-medium">{String(dim.label ?? "")}</p>
                  {dim.description ? <p className="mt-1 text-xs text-gray-600">{String(dim.description)}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {dashboard.companion_priority_alignment.intentional_leadership_note ? (
            <p className="mt-3 text-xs text-gray-500">
              {dashboard.companion_priority_alignment.intentional_leadership_note}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_organizational_visibility ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.organizationalVisibility}</h3>
          {dashboard.companion_organizational_visibility.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.companion_organizational_visibility.principle}</p>
          ) : null}
          {(dashboard.companion_organizational_visibility.visibility_areas ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.companion_organizational_visibility.visibility_areas!.map((item) => (
                <li key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  <p className="font-medium">{String(item.label ?? "")}</p>
                  {item.description ? <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_executive_decision_support ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveDecisionSupport}</h3>
          {dashboard.companion_executive_decision_support.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.companion_executive_decision_support.principle}</p>
          ) : null}
          {(dashboard.companion_executive_decision_support.support_patterns ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.companion_executive_decision_support.support_patterns!.map((item) => (
                <li key={String(item.key ?? item.scenario)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  {item.scenario ? <p className="text-xs text-gray-500">{String(item.scenario)}</p> : null}
                  <p className="mt-1">{String(item.prompt ?? "")}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.companion_executive_decision_support.boundary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.companion_executive_decision_support.boundary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_trust ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionTrust}</h3>
          {dashboard.companion_trust.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.companion_trust.principle}</p>
          ) : null}
          {(dashboard.companion_trust.what_informs_observations ?? []).length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-emerald-800">{labels.whatInformsObservations}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {dashboard.companion_trust.what_informs_observations!.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(dashboard.companion_trust.uncertainty_areas ?? []).length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-amber-800">{labels.uncertaintyAreas}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {dashboard.companion_trust.uncertainty_areas!.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {dashboard.companion_trust.uncertainty_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.companion_trust.uncertainty_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_self_love ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionSelfLove}</h3>
          {dashboard.companion_self_love.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.companion_self_love.principle}</p>
          ) : null}
          {dashboard.companion_self_love.journey_phrase ? (
            <p className="mt-2 text-sm italic text-teal-800">{dashboard.companion_self_love.journey_phrase}</p>
          ) : null}
          {(dashboard.companion_self_love.companion_patterns ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.companion_self_love.companion_patterns!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_success_criteria && dashboard.companion_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.companionSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.companion_success_criteria.map((criterion) => (
              <li
                key={criterion.key ?? criterion.label}
                className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                >
                  {criterion.met ? labels.criterionMet : labels.criterionPending}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{criterion.label}</p>
                  {criterion.note ? <p className="mt-1 text-xs text-gray-500">{criterion.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.reflection_integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.reflection_integration_links!.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      {dashboard.reflection_engagement_summary ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-6">
          <h3 className="text-sm font-semibold text-rose-900">{labels.reflectionEngagement}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-rose-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.reflectionHealthScore}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.reflection_engagement_summary.organization_health_score ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-rose-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.reflectionReports}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.reflection_engagement_summary.executive_reports_total ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-rose-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.reflectionPromptsAvailable}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.reflection_engagement_summary.reflection_prompts_available ?? 0}
              </p>
            </div>
            <div className="rounded-lg border border-rose-100 bg-white p-3 text-sm">
              <p className="text-xs text-gray-500">{labels.strategicObjectives}</p>
              <p className="mt-1 text-xl font-semibold">
                {dashboard.reflection_engagement_summary.strategic_objectives_active ?? 0}
              </p>
            </div>
          </div>
          {dashboard.reflection_engagement_summary.summary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.reflection_engagement_summary.summary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.executive_reflection_objectives && dashboard.executive_reflection_objectives.length > 0 ? (
        <section className="rounded-xl border border-rose-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reflectionObjectivesTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.executive_reflection_objectives.map((obj) => (
              <div key={obj.key ?? obj.label} className="rounded-lg border border-rose-100 bg-rose-50/30 p-4">
                <p className="text-sm font-medium text-rose-900">{obj.label}</p>
                {obj.description ? <p className="mt-1 text-xs text-gray-600">{obj.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.reflection_prompts && dashboard.reflection_prompts.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reflectionPromptsTitle}</h3>
          <ul className="mt-3 space-y-3">
            {dashboard.reflection_prompts.map((item) => (
              <li key={item.key ?? item.scenario} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.scenario ? <p className="text-xs text-gray-500">{item.scenario}</p> : null}
                <p className="mt-1">{item.question ?? item.example}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.reflection_decision_learning ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.decisionLearning}</h3>
          {dashboard.reflection_decision_learning.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.reflection_decision_learning.principle}</p>
          ) : null}
          {(dashboard.reflection_decision_learning.dimensions ?? []).length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboard.reflection_decision_learning.dimensions!.map((item) => (
                <div key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <p className="font-medium">{String(item.label ?? "")}</p>
                  {item.description ? <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {dashboard.reflection_decision_learning.boundary_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.reflection_decision_learning.boundary_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.reflection_leadership_growth ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.leadershipGrowth}</h3>
          {dashboard.reflection_leadership_growth.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.reflection_leadership_growth.principle}</p>
          ) : null}
          {(dashboard.reflection_leadership_growth.growth_areas ?? []).length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.reflection_leadership_growth.growth_areas!.map((item) => (
                <li key={String(item.key ?? item.label)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                  <p className="font-medium">{String(item.label ?? "")}</p>
                  {item.description ? <p className="mt-1 text-xs text-gray-600">{String(item.description)}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.reflection_leadership_growth.journey_note ? (
            <p className="mt-3 text-sm italic text-rose-800">{dashboard.reflection_leadership_growth.journey_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.reflection_companion_guidance && dashboard.reflection_companion_guidance.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reflectionCompanionGuidance}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.reflection_companion_guidance.map((item) => (
              <li key={item.key ?? item.scenario} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {item.scenario ? <p className="text-xs text-gray-500">{item.scenario}</p> : null}
                <p className="mt-1">{item.prompt ?? item.question ?? item.example}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.reflection_trust ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reflectionTrust}</h3>
          {dashboard.reflection_trust.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.reflection_trust.principle}</p>
          ) : null}
          {(dashboard.reflection_trust.what_contributes ?? []).length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-emerald-800">{labels.whatContributes}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {dashboard.reflection_trust.what_contributes!.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {(dashboard.reflection_trust.what_remains_private ?? []).length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-amber-800">{labels.whatRemainsPrivate}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {dashboard.reflection_trust.what_remains_private!.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.reflection_self_love ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reflectionSelfLove}</h3>
          {dashboard.reflection_self_love.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.reflection_self_love.principle}</p>
          ) : null}
          {dashboard.reflection_self_love.learning_phrase ? (
            <p className="mt-2 text-sm italic text-rose-800">{dashboard.reflection_self_love.learning_phrase}</p>
          ) : null}
          {(dashboard.reflection_self_love.reflection_patterns ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.reflection_self_love.reflection_patterns!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.reflection_recognition_connection ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recognitionConnection}</h3>
          {dashboard.reflection_recognition_connection.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.reflection_recognition_connection.principle}</p>
          ) : null}
          {(dashboard.reflection_recognition_connection.recognition_patterns ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.reflection_recognition_connection.recognition_patterns!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.reflection_privacy_principles ? (
        <section className="rounded-xl border border-rose-200 bg-rose-50/30 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.privacyPrinciples}</h3>
          {dashboard.reflection_privacy_principles.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.reflection_privacy_principles.principle}</p>
          ) : null}
          {(dashboard.reflection_privacy_principles.privacy_rules ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.reflection_privacy_principles.privacy_rules!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {dashboard.reflection_privacy_principles.growth_not_evaluation_note ? (
            <p className="mt-3 text-xs text-gray-500">
              {dashboard.reflection_privacy_principles.growth_not_evaluation_note}
            </p>
          ) : null}
        </section>
      ) : null}

      {dashboard.reflection_success_criteria && dashboard.reflection_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reflectionSuccessCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.reflection_success_criteria.map((criterion) => (
              <li
                key={criterion.key ?? criterion.label}
                className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                >
                  {criterion.met ? labels.criterionMet : labels.criterionPending}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{criterion.label}</p>
                  {criterion.note ? <p className="mt-1 text-xs text-gray-500">{criterion.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.reflection_vision_phrases ?? []).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.reflectionVisionPhrases}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.reflection_vision_phrases!.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.trust_connection ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          {dashboard.trust_connection.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.trust_connection.principle}</p>
          ) : null}
          {(dashboard.trust_connection.executives_should_know ?? []).length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
              {dashboard.trust_connection.executives_should_know!.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.data_sources ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.dataSources}</h3>
          {dashboard.data_sources.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.data_sources.principle}</p>
          ) : null}
          {(dashboard.data_sources.modules ?? []).length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {dashboard.data_sources.modules!.map((mod) => {
                const route = typeof mod.route === "string" ? mod.route : undefined;
                const label = typeof mod.label === "string" ? mod.label : String(mod.key ?? "");
                return route ? (
                  <Link key={route} href={route} className="rounded border border-gray-200 px-2 py-1 text-xs">
                    {label}
                  </Link>
                ) : (
                  <span key={label} className="rounded border border-gray-200 px-2 py-1 text-xs">
                    {label}
                  </span>
                );
              })}
            </ul>
          ) : null}
          {dashboard.data_sources.privacy_note ? (
            <p className="mt-3 text-xs text-gray-500">{dashboard.data_sources.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
