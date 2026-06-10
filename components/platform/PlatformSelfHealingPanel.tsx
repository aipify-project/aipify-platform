"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import IntelligencePresenceStrip from "@/components/platform/IntelligencePresenceStrip";
import { createClient } from "@/lib/supabase/client";
import {
  getHealingStrategySuccessRate,
  parseSelfHealingDashboard,
  type SelfHealingDashboard,
} from "@/lib/platform/intelligence-engine";
import { getHealingResultStyle, getRiskLevelStyle } from "@/lib/platform/self-learning";

type PlatformSelfHealingPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    pulseLabel: string;
    presence: {
      title: string;
      currentState: string;
      activeSignals: string;
      healingToday: string;
      pendingReviews: string;
      systemConfidence: string;
      currentAction: string;
      estimatedCompletion: string;
      riskLevel: string;
      approvalRequired: string;
      lastResult: string;
      yes: string;
      no: string;
      confidenceHigh: string;
      confidenceMedium: string;
      confidenceLow: string;
      seconds: string;
      learningEventsDetected: string;
      recommendationsAwaiting: string;
      completedToday: string;
    };
    metrics: {
      attempts: string;
      successful: string;
      failed: string;
      escalated: string;
      avgResolution: string;
      mostCommonIncident: string;
      topPattern: string;
    };
    strategies: {
      title: string;
      autoExecute: string;
      manualApproval: string;
      locked: string;
      lastExecuted: string;
      successRate: string;
      failureCount: string;
      avgResolution: string;
      empty: string;
    };
    recentRuns: {
      title: string;
      empty: string;
    };
    riskLevels: {
      low: string;
      medium: string;
      high: string;
      critical: string;
    };
  };
};

const EMPTY: SelfHealingDashboard = {
  live_presence: null,
  totals: { attempts: 0, successful: 0, failed: 0, escalated: 0, avg_resolution_ms: 0 },
  strategies: [],
  recent_runs: [],
  top_pattern: null,
  most_common_incident: null,
};

export default function PlatformSelfHealingPanel({
  locale,
  labels,
}: PlatformSelfHealingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<SelfHealingDashboard>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_self_healing_dashboard");

      if (!cancelled) {
        setDashboard(error || !data ? EMPTY : parseSelfHealingDashboard(data));
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  const { totals } = dashboard;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {dashboard.live_presence ? (
        <IntelligencePresenceStrip
          title={labels.presence.title}
          variant="selfHealing"
          presence={dashboard.live_presence}
          labels={{ ...labels.presence, pulseLabel: labels.pulseLabel }}
        />
      ) : null}

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={labels.metrics.attempts} value={String(totals.attempts)} />
        <Metric label={labels.metrics.successful} value={String(totals.successful)} />
        <Metric label={labels.metrics.failed} value={String(totals.failed)} />
        <Metric label={labels.metrics.escalated} value={String(totals.escalated)} />
        <Metric label={labels.metrics.avgResolution} value={`${totals.avg_resolution_ms} ms`} />
        <Metric
          label={labels.metrics.mostCommonIncident}
          value={dashboard.most_common_incident ?? "—"}
        />
        <Metric label={labels.metrics.topPattern} value={dashboard.top_pattern ?? "—"} />
      </dl>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.strategies.title}</h2>
        {dashboard.strategies.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.strategies.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dashboard.strategies.map((strategy) => {
              const isCritical = strategy.risk_level === "critical";
              const successRate = getHealingStrategySuccessRate(strategy);
              return (
                <li
                  key={strategy.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{strategy.title}</p>
                      {strategy.description && (
                        <p className="mt-1 text-xs text-gray-500">{strategy.description}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getRiskLevelStyle(
                          strategy.risk_level as "low" | "medium" | "high" | "critical"
                        )}`}
                      >
                        {labels.riskLevels[strategy.risk_level as keyof typeof labels.riskLevels] ??
                          strategy.risk_level}
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-100">
                        {isCritical
                          ? labels.strategies.locked
                          : strategy.auto_execute
                            ? labels.strategies.autoExecute
                            : labels.strategies.manualApproval}
                      </span>
                    </div>
                  </div>
                  <dl className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <dt>{labels.strategies.lastExecuted}</dt>
                      <dd className="font-semibold text-gray-900">
                        {strategy.last_executed_at
                          ? formatDateTime(strategy.last_executed_at, locale)
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt>{labels.strategies.successRate}</dt>
                      <dd className="font-semibold text-gray-900">{successRate}%</dd>
                    </div>
                    <div>
                      <dt>{labels.strategies.failureCount}</dt>
                      <dd className="font-semibold text-gray-900">{strategy.failure_count}</dd>
                    </div>
                    <div>
                      <dt>{labels.strategies.avgResolution}</dt>
                      <dd className="font-semibold text-gray-900">
                        {strategy.avg_resolution_ms ?? 0} ms
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recentRuns.title}</h2>
        {dashboard.recent_runs.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.recentRuns.empty}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {dashboard.recent_runs.slice(0, 10).map((run) => (
              <li
                key={run.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-4 py-3 text-sm"
              >
                <span className="font-medium text-gray-900">{run.healing_action}</span>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getRiskLevelStyle(
                      run.risk_level as "low" | "medium" | "high" | "critical"
                    )}`}
                  >
                    {run.risk_level}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getHealingResultStyle(
                      run.execution_result as "success" | "failed" | "skipped" | "pending_approval"
                    )}`}
                  >
                    {run.execution_result}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(run.executed_at, locale)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}
