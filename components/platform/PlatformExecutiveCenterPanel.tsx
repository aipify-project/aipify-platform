"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import {
  formatTimeSaved,
  getExecutiveImpactStyle,
  getExecutiveRiskStyle,
  parseExecutiveCenterBundle,
  type ExecutiveCenterBundle,
} from "@/lib/platform/executive-center";
import type { ExecutiveCenterLabels } from "@/lib/platform/executive-page-labels";
import {
  getGreetingName,
  type PlatformAdminSession,
} from "@/lib/platform/ai-dashboard";
import { createClient } from "@/lib/supabase/client";

type PlatformExecutiveCenterPanelProps = {
  labels: ExecutiveCenterLabels;
};

export default function PlatformExecutiveCenterPanel({
  labels,
}: PlatformExecutiveCenterPanelProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PlatformAdminSession | null>(null);
  const [bundle, setBundle] = useState<ExecutiveCenterBundle | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const sessionResult = await supabase.rpc("record_platform_admin_login");
    const previousLogin =
      sessionResult.data && typeof sessionResult.data === "object"
        ? ((sessionResult.data as PlatformAdminSession).previous_login_at ?? null)
        : null;

    const [bundleResult] = await Promise.all([
      supabase.rpc("get_executive_center_bundle", { p_since: previousLogin }),
      supabase.rpc("update_presence_settings", {
        p_surface: "platform",
        p_view_mode: "executive",
        p_executive_summaries: true,
      }),
    ]);

    setSession(
      sessionResult.error || !sessionResult.data
        ? null
        : (sessionResult.data as PlatformAdminSession)
    );
    setBundle(
      bundleResult.error || !bundleResult.data
        ? null
        : parseExecutiveCenterBundle(bundleResult.data)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const greeting = useMemo(() => {
    const part = getGreetingName(new Date().getHours());
    if (part === "morning") return labels.greetingMorning;
    if (part === "afternoon") return labels.greetingAfternoon;
    return labels.greetingEvening;
  }, [labels]);

  const visibleRecommendations = useMemo(
    () => bundle?.recommendations.filter((r) => !dismissed.has(r.id)) ?? [],
    [bundle?.recommendations, dismissed]
  );

  async function postAction(id: string, endpoint: string) {
    setBusyId(id);
    try {
      const response = await fetch(`/api/platform/actions/${id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (response.ok) await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!session || !bundle) {
    return <AipifyEmptyState message={labels.subtitle} pulseLabel={labels.presence} />;
  }

  const adminName = session.admin_name.split(" ")[0] ?? session.admin_name;
  const sv = bundle.since_visit;
  const cards = bundle.cards;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </header>

      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/50 p-6 shadow-sm sm:p-8">
        <p className="text-xl font-semibold text-gray-900">
          {greeting.replace("{name}", adminName.toUpperCase())}
        </p>
        <p className="mt-3 text-sm font-medium text-gray-600">{labels.sinceVisit}</p>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
              Aipify resolved
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-800">
              <li>{labels.resolved.incidents.replace("{count}", String(sv.incidents_resolved))}</li>
              <li>{labels.resolved.webhooks.replace("{count}", String(sv.webhook_failures_fixed))}</li>
              <li>{labels.resolved.support.replace("{count}", String(sv.support_requests_handled))}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Needs attention
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-800">
              {sv.pending_approvals > 0 && (
                <li>{labels.waiting.approvals.replace("{count}", String(sv.pending_approvals))}</li>
              )}
              {sv.recommendations_discovered > 0 && (
                <li>
                  {labels.waiting.recommendations.replace(
                    "{count}",
                    String(sv.recommendations_discovered)
                  )}
                </li>
              )}
            </ul>
            <p className="mt-4 text-sm font-semibold text-emerald-700">
              {labels.overallHealth.replace("{score}", String(sv.overall_health))}
            </p>
          </div>
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ExecutiveMetricCard
          title={labels.cards.businessHealth}
          value={`${cards.business_health.score}%`}
          sub={
            cards.business_health.delta > 0
              ? labels.cards.deltaUp.replace("{delta}", String(cards.business_health.delta))
              : undefined
          }
          accent="violet"
        />
        <ExecutiveMetricCard
          title={labels.cards.aiActivity}
          value={String(cards.ai_activity_today)}
          sub={labels.cards.aiActivitySub}
          accent="indigo"
        />
        <ExecutiveMetricCard
          title={labels.cards.timeSaved}
          value={formatTimeSaved(cards.time_saved.hours, cards.time_saved.minutes)}
          sub={labels.cards.timeSavedSub}
          accent="emerald"
        />
        <ExecutiveMetricCard
          title={labels.cards.pendingApprovals}
          value={String(cards.pending_approvals)}
          sub={labels.cards.pendingApprovalsSub}
          accent="amber"
        />
        <ExecutiveMetricCard
          title={labels.cards.customerSatisfaction}
          value={`${cards.customer_satisfaction}%`}
          sub={labels.cards.customerSatisfactionSub}
          accent="sky"
        />
        <ExecutiveMetricCard
          title={labels.cards.revenueOpportunities}
          value={String(cards.revenue_opportunities)}
          sub={labels.cards.revenueOpportunitiesSub}
          accent="rose"
        />
      </dl>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.timeline.title}</h2>
          {bundle.timeline.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.timeline.empty}</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {bundle.timeline.map((event) => (
                <li key={event.id} className="border-l-2 border-violet-200 pl-4">
                  <p className="text-xs font-semibold text-violet-600">{event.time}</p>
                  <p className="mt-1 text-sm text-gray-800">{event.executive_title}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.workload.title}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <WorkloadItem label={labels.workload.monitoring} value={bundle.workload.monitoring} />
            <WorkloadItem label={labels.workload.learning} value={bundle.workload.learning} />
            <WorkloadItem label={labels.workload.healing} value={bundle.workload.healing} />
            <WorkloadItem label={labels.workload.automations} value={bundle.workload.automations} />
            <WorkloadItem label={labels.workload.support} value={bundle.workload.support} />
          </dl>
        </section>
      </div>

      {bundle.pending_approval_actions.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/30 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.approvals.title}</h2>
          <ul className="mt-4 space-y-4">
            {bundle.pending_approval_actions.map((action) => (
              <li
                key={action.id}
                className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{action.title}?</p>
                    {action.expected_impact && (
                      <p className="mt-1 text-sm text-gray-600">{action.expected_impact}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${getExecutiveRiskStyle(action.risk_level)}`}
                  >
                    {labels.approvals.impact}:{" "}
                    {labels.approvals.riskLabels[
                      action.risk_level as keyof typeof labels.approvals.riskLabels
                    ] ?? action.risk_level}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {labels.approvals.affectedCustomers.replace(
                    "{count}",
                    String(action.affected_customers)
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {labels.approvals.rollback}:{" "}
                  {action.rollback_available
                    ? labels.approvals.rollbackYes
                    : labels.approvals.rollbackNo}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === action.id}
                    onClick={() => void postAction(action.id, "approve")}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {busyId === action.id ? labels.approvals.processing : labels.approvals.approve}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === action.id}
                    onClick={() => void postAction(action.id, "reject")}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-rose-200 hover:text-rose-700 disabled:opacity-50"
                  >
                    {labels.approvals.decline}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recommendations.title}</h2>
        {visibleRecommendations.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.recommendations.empty}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {visibleRecommendations.map((rec) => (
              <li
                key={rec.id}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 ring-1 ring-gray-100"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ring-1 ring-inset ${getExecutiveImpactStyle(rec.impact_level)}`}
                  >
                    {labels.recommendations.impactLabels[rec.impact_level]}
                  </span>
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                </div>
                <dl className="mt-3 space-y-2 text-sm text-gray-700">
                  <div>
                    <dt className="font-medium text-gray-500">
                      {labels.recommendations.businessImpact}
                    </dt>
                    <dd>{rec.business_impact}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">
                      {labels.recommendations.suggestedAction}
                    </dt>
                    <dd>{rec.suggested_action}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">
                      {labels.recommendations.expectedBenefit}
                    </dt>
                    <dd>{rec.expected_benefit}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  {rec.action_id && (
                    <button
                      type="button"
                      disabled={busyId === rec.action_id}
                      onClick={() => void postAction(rec.action_id!, "approve")}
                      className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                      {labels.recommendations.approve}
                    </button>
                  )}
                  <Link
                    href="/platform/intelligence/global-patterns"
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-violet-200 hover:text-violet-700"
                  >
                    {labels.recommendations.review}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDismissed((prev) => new Set(prev).add(rec.id))}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {labels.recommendations.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.insights.title}</h2>
        <ul className="mt-4 space-y-4">
          {bundle.insights.map((insight) => (
            <li key={insight.id} className="rounded-xl bg-white/80 p-4 ring-1 ring-indigo-100">
              <p className="font-semibold text-indigo-900">{insight.question}</p>
              <p className="mt-2 text-sm text-gray-700">{insight.answer}</p>
              <p className="mt-2 text-sm font-medium text-violet-700">
                {labels.insights.recommendation}: {insight.recommendation}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/40 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.weekly.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.weekly.subtitle}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryItem
            label={labels.weekly.healthTrend}
            value={`+${bundle.weekly_summary.health_trend}%`}
          />
          <SummaryItem
            label={labels.weekly.revenueOpportunities}
            value={String(bundle.weekly_summary.revenue_opportunities)}
          />
          <SummaryItem
            label={labels.weekly.supportTrend}
            value={bundle.weekly_summary.support_trend}
          />
          <SummaryItem
            label={labels.weekly.learningDiscoveries}
            value={String(bundle.weekly_summary.learning_discoveries)}
          />
          <SummaryItem
            label={labels.weekly.healingEffectiveness}
            value={bundle.weekly_summary.healing_effectiveness}
          />
        </dl>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">{labels.weekly.priorities}</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {bundle.weekly_summary.priorities.map((priority) => (
              <li key={priority}>{priority}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{labels.monthly.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {labels.monthly.subtitle.replace("{period}", bundle.monthly_report.period)}
            </p>
          </div>
          <a
            href="/api/platform/executive/monthly-report"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            {labels.monthly.download}
          </a>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(labels.monthly.sections).map((section) => (
            <li key={section} className="text-sm text-gray-600">
              • {section}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ExecutiveMetricCard({
  title,
  value,
  sub,
  accent,
}: {
  title: string;
  value: string;
  sub?: string;
  accent: "violet" | "indigo" | "emerald" | "amber" | "sky" | "rose";
}) {
  const ring: Record<string, string> = {
    violet: "ring-violet-100",
    indigo: "ring-indigo-100",
    emerald: "ring-emerald-100",
    amber: "ring-amber-100",
    sky: "ring-sky-100",
    rose: "ring-rose-100",
  };

  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${ring[accent]}`}>
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function WorkloadItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/90 px-4 py-3 ring-1 ring-violet-100">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
