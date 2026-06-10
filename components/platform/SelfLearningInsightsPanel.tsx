"use client";

import {
  computeAcceptanceRate,
  getEnvironmentStyle,
  getHealingResultStyle,
  getRiskLevelStyle,
  type CustomerSelfLearning,
  type EnvironmentType,
} from "@/lib/platform/self-learning";
import { formatRelativeTime } from "@/lib/platform/intelligence-foundation";
import { formatDateTime } from "@/lib/i18n/format-date";

type SelfLearningInsightsPanelProps = {
  learning: CustomerSelfLearning;
  locale: string;
  labels: {
    title: string;
    environment: string;
    environmentLabels: Record<EnvironmentType, string>;
    stages: {
      detection: string;
      diagnosis: string;
      recommendation: string;
      healing: string;
    };
    learningEvents: {
      title: string;
      empty: string;
      eventType: string;
      category: string;
    };
    patterns: {
      title: string;
      empty: string;
      detections: string;
      successRate: string;
      action: string;
    };
    effectiveness: {
      title: string;
      empty: string;
      presented: string;
      accepted: string;
      acceptanceRate: string;
    };
    selfHealing: {
      title: string;
      empty: string;
      action: string;
      risk: string;
      result: string;
      duration: string;
      pendingApproval: string;
    };
    riskLabels: Record<string, string>;
    resultLabels: Record<string, string>;
    eventTypeLabels: Record<string, string>;
    categoryLabels: Record<string, string>;
  };
};

export default function SelfLearningInsightsPanel({
  learning,
  locale,
  labels,
}: SelfLearningInsightsPanelProps) {
  const env = learning.environment_type;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
          {env && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getEnvironmentStyle(env)}`}
            >
              {labels.environment}: {labels.environmentLabels[env] ?? env}
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["detection", "diagnosis", "recommendation", "healing"] as const).map((stage) => (
            <span
              key={stage}
              className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-100"
            >
              {labels.stages[stage]}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">{labels.learningEvents.title}</h3>
        {learning.learning_events.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.learningEvents.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {learning.learning_events.map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                    {labels.eventTypeLabels[event.event_type] ?? event.event_type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {labels.categoryLabels[event.event_category] ?? event.event_category}
                  </span>
                  <span className="ml-auto text-xs text-gray-400">
                    {formatRelativeTime(event.created_at, locale)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/20 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">{labels.patterns.title}</h3>
        {learning.patterns.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.patterns.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {learning.patterns.map((pattern) => (
              <li
                key={pattern.id}
                className="rounded-xl bg-white/90 px-4 py-4 ring-1 ring-violet-100"
              >
                <p className="font-medium text-gray-900">{pattern.pattern_name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {labels.patterns.action}: {pattern.recommended_action}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>
                    {labels.patterns.detections}: {pattern.detection_count}
                  </span>
                  <span>
                    {labels.patterns.successRate}: {pattern.success_rate}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">{labels.selfHealing.title}</h3>
        {learning.self_healing_executions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.selfHealing.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {learning.self_healing_executions.map((execution) => (
              <li
                key={execution.id}
                className="rounded-xl border border-gray-100 px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{execution.healing_action}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getHealingResultStyle(execution.execution_result)}`}
                  >
                    {labels.resultLabels[execution.execution_result] ?? execution.execution_result}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${getRiskLevelStyle(execution.risk_level)}`}
                  >
                    {labels.riskLabels[execution.risk_level] ?? execution.risk_level}
                  </span>
                  {execution.requires_approval && execution.execution_result === "pending_approval" && (
                    <span className="text-xs font-medium text-amber-600">
                      {labels.selfHealing.pendingApproval}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {formatDateTime(execution.executed_at, locale)}
                  {execution.execution_time_ms != null &&
                    ` · ${execution.execution_time_ms}ms`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">{labels.effectiveness.title}</h3>
        {learning.recommendation_effectiveness.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.effectiveness.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {learning.recommendation_effectiveness.slice(0, 5).map((record) => (
              <li
                key={record.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50/80 px-4 py-3"
              >
                <span className="text-sm font-medium text-gray-900">
                  {record.recommendation_type}
                </span>
                <span className="text-xs text-gray-500">
                  {labels.effectiveness.acceptanceRate}: {computeAcceptanceRate(record)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
