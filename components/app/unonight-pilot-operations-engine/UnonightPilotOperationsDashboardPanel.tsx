"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseUnonightPilotOperationsDashboard,
  type UnonightPilotOperationsDashboard,
} from "@/lib/aipify/unonight-pilot-operations-engine";

type UnonightPilotOperationsDashboardPanelProps = {
  labels: Record<string, string>;
};

function healthClass(status?: string) {
  switch (status) {
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "healthy":
      return "bg-teal-100 text-teal-800";
    case "needs_attention":
      return "bg-amber-100 text-amber-800";
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function milestoneClass(status?: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "blocked":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function UnonightPilotOperationsDashboardPanel({
  labels,
}: UnonightPilotOperationsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<UnonightPilotOperationsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(4);
  const [feedbackSummary, setFeedbackSummary] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/unonight-pilot-operations-engine/dashboard");
    if (res.ok) setDashboard(parseUnonightPilotOperationsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function completeMilestone(key: string) {
    setActionId(key);
    await fetch("/api/pilot/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestone_key: key, status: "completed" }),
    });
    await load();
    setActionId(null);
  }

  async function submitFeedback() {
    setActionId("feedback");
    await fetch("/api/pilot/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedback_type: "overall_satisfaction",
        source: "dashboard",
        rating: feedbackRating,
        comment_summary: feedbackSummary.slice(0, 500) || null,
      }),
    });
    setFeedbackSummary("");
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {labels.notPilotOrg}
      </div>
    );
  }

  const health = dashboard.pilot_health ?? {};
  const support = dashboard.support_improvements ?? {};
  const satisfaction = dashboard.administrator_satisfaction ?? {};
  const integration = dashboard.unonight_integration ?? {};
  const milestonesDone = dashboard.milestones.filter((m) => m.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.supportAi}
        </Link>
        <Link href="/app/admin-assistant-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.adminAssistant}
        </Link>
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/integration-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.integrationEngine}
        </Link>
        <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.operationsDashboard}
        </Link>
        <Link href="/app/quality-guardian-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.qualityGuardian}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-indigo-900">{labels.unonightPilot}</h2>
            <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
            <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
            {dashboard.is_unonight_pilot ? (
              <p className="mt-2 text-xs font-medium text-indigo-800">{labels.unonightNote}</p>
            ) : null}
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${healthClass(health.status ?? dashboard.config?.health_status)}`}>
            {labels.pilotHealth}: {health.status ?? dashboard.config?.health_status ?? labels.unknown}
            {health.score !== undefined ? ` (${health.score})` : ""}
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.openSupportCases}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{Number(support.open_cases ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.aiAcceptanceRate}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{Number(support.ai_acceptance_rate_pct ?? 0)}%</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.milestonesProgress}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {milestonesDone}/{dashboard.milestones.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.adminSatisfaction}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{Number(satisfaction.avg_rating_90d ?? 0)}</p>
        </div>
      </section>

      <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.unonightIntegration}</h2>
        <p className="mt-1 text-xs text-gray-600">
          {integration.connected ? labels.unonightConnected : labels.unonightNotConnected}
          {integration.last_sync_at ? ` · ${labels.lastSync}: ${new Date(integration.last_sync_at).toLocaleString()}` : ""}
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.supportImprovements}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-gray-700">
          <li>{labels.resolved30d}: {Number(support.resolved_30d ?? 0)}</li>
          <li>{labels.escalations30d}: {Number(support.escalations_30d ?? 0)}</li>
          <li>{labels.avgResponseHours}: {Number(support.avg_first_response_hours ?? 0)}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.unresolvedIssues}</h2>
        {dashboard.unresolved_issues.length === 0 ? (
          <p className="mt-3 text-xs text-gray-500">{labels.noUnresolvedIssues}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.unresolved_issues.map((issue) => (
              <li key={`${issue.type}-${issue.id}`} className="rounded-lg border border-gray-100 bg-white p-3 text-sm">
                <span className="text-xs uppercase text-gray-500">{issue.type}</span>
                <p className="font-medium text-gray-900">{issue.title}</p>
                <p className="text-xs text-gray-600">{issue.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.pilotMilestones}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.milestones.map((milestone) => (
            <li key={milestone.milestone_key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white p-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${milestoneClass(milestone.status)}`}>
                  {milestone.status}
                </span>
              </div>
              {milestone.status !== "completed" ? (
                <button
                  type="button"
                  disabled={actionId === milestone.milestone_key}
                  onClick={() => void completeMilestone(milestone.milestone_key)}
                  className="rounded border border-gray-200 px-2 py-1 text-xs"
                >
                  {labels.markComplete}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.submitFeedback}</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs text-gray-600">
            {labels.rating}
            <input
              type="number"
              min={1}
              max={5}
              value={feedbackRating}
              onChange={(e) => setFeedbackRating(Number(e.target.value))}
              className="ml-2 w-16 rounded border border-gray-200 px-2 py-1 text-sm"
            />
          </label>
          <input
            type="text"
            value={feedbackSummary}
            onChange={(e) => setFeedbackSummary(e.target.value)}
            placeholder={labels.feedbackPlaceholder}
            className="min-w-[200px] flex-1 rounded border border-gray-200 px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            disabled={actionId === "feedback"}
            onClick={() => void submitFeedback()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white"
          >
            {labels.submitFeedback}
          </button>
        </div>
      </section>

      {dashboard.recent_feedback.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentFeedback}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_feedback.map((item) => (
              <li key={item.id} className="rounded-lg border border-gray-100 bg-white p-3 text-sm">
                <p className="font-medium text-gray-900">{item.feedback_type}</p>
                <p className="text-xs text-gray-600">
                  {labels.rating}: {item.rating ?? "—"} · {item.comment_summary ?? labels.noComment}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600">
            {dashboard.principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
