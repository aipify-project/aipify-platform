"use client";

import { useEffect, useState } from "react";
import {
  parsePlatformLearningOverview,
  type PlatformLearningOverview,
} from "@/lib/platform/self-learning";

type PlatformLearningPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    pulseLabel: string;
    totals: {
      patterns: string;
      approvedPatterns: string;
      learningEvents: string;
      healingExecutions: string;
    };
    patterns: {
      title: string;
      empty: string;
      approved: string;
    };
    environments: {
      title: string;
      internal: string;
      pilot: string;
      customer: string;
      enterprise: string;
    };
    privacyNote: string;
  };
};

const EMPTY_OVERVIEW: PlatformLearningOverview = {
  patterns: [],
  recommendation_effectiveness: [],
  learning_by_environment: {},
  recent_healing_executions: [],
  totals: {
    patterns: 0,
    approved_patterns: 0,
    learning_events_30d: 0,
    healing_executions_30d: 0,
  },
};

export default function PlatformLearningPanel({ labels }: PlatformLearningPanelProps) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<PlatformLearningOverview>(EMPTY_OVERVIEW);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/platform/learning");
        if (!response.ok) throw new Error("Failed");
        const data = await response.json();
        if (!cancelled) {
          setOverview(parsePlatformLearningOverview(data));
        }
      } catch {
        if (!cancelled) setOverview(EMPTY_OVERVIEW);
      } finally {
        if (!cancelled) setLoading(false);
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

  const approvedPatterns = overview.patterns.filter((p) => p.approved_for_global_use);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.totals.patterns} value={String(overview.totals.patterns)} />
        <MetricCard
          label={labels.totals.approvedPatterns}
          value={String(overview.totals.approved_patterns)}
        />
        <MetricCard
          label={labels.totals.learningEvents}
          value={String(overview.totals.learning_events_30d)}
        />
        <MetricCard
          label={labels.totals.healingExecutions}
          value={String(overview.totals.healing_executions_30d)}
        />
      </dl>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {labels.patterns.title}
        </h3>
        {approvedPatterns.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.patterns.empty}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {approvedPatterns.slice(0, 4).map((pattern) => (
              <li
                key={pattern.id}
                className="rounded-xl bg-violet-50/50 px-4 py-3 text-sm text-gray-700"
              >
                <span className="font-medium text-gray-900">{pattern.pattern_name}</span>
                <span className="mt-1 block text-xs text-violet-600">
                  {labels.patterns.approved} · {pattern.detection_count} detections
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {Object.keys(overview.learning_by_environment).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {labels.environments.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(overview.learning_by_environment).map(([env, count]) => (
              <span
                key={env}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
              >
                {labels.environments[env as keyof typeof labels.environments] ?? env}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-900">
        {labels.privacyNote}
      </p>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}
