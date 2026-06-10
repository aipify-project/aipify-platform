"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { createClient } from "@/lib/supabase/client";
import { parseBrainDashboard, type BrainDashboard } from "@/lib/platform/intelligence-engine";

type PlatformBrainDashboardPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    pulseLabel: string;
    metrics: {
      knowledgePatternsApproved: string;
      patternsAwaitingReview: string;
      learningEvents30d: string;
      selfHealingSuccessRate: string;
      globalRecommendations: string;
      learningConfidence: string;
      approvedAutomations: string;
      automationCoverage: string;
    };
    recommendations: {
      title: string;
      empty: string;
      confidence: string;
    };
    privacyNote: string;
  };
};

const EMPTY: BrainDashboard = { metrics: null, recommendations: [], recent_reviews: [] };

export default function PlatformBrainDashboardPanel({
  labels,
}: PlatformBrainDashboardPanelProps) {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<BrainDashboard>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_intelligence_brain_dashboard");

      if (!cancelled) {
        setDashboard(error || !data ? EMPTY : parseBrainDashboard(data));
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

  const metrics = dashboard.metrics;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {metrics ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={labels.metrics.knowledgePatternsApproved}
            value={String(metrics.knowledge_patterns_approved)}
          />
          <MetricCard
            label={labels.metrics.patternsAwaitingReview}
            value={String(metrics.patterns_awaiting_review)}
          />
          <MetricCard
            label={labels.metrics.learningEvents30d}
            value={String(metrics.learning_events_30d)}
          />
          <MetricCard
            label={labels.metrics.selfHealingSuccessRate}
            value={`${metrics.self_healing_success_rate}%`}
          />
          <MetricCard
            label={labels.metrics.globalRecommendations}
            value={String(metrics.global_recommendations_generated)}
          />
          <MetricCard
            label={labels.metrics.learningConfidence}
            value={`${metrics.learning_confidence}%`}
          />
          <MetricCard
            label={labels.metrics.approvedAutomations}
            value={String(metrics.approved_automations_from_learning)}
          />
          <MetricCard
            label={labels.metrics.automationCoverage}
            value={`${metrics.automation_coverage}%`}
          />
        </dl>
      ) : (
        <AipifyEmptyState message={labels.recommendations.empty} pulseLabel={labels.pulseLabel} />
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recommendations.title}</h2>
        {dashboard.recommendations.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.recommendations.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dashboard.recommendations.map((rec) => (
              <li
                key={rec.id}
                className="rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3"
              >
                <p className="text-sm font-medium text-gray-900">{rec.message}</p>
                <p className="mt-1 text-xs text-gray-600">{rec.suggested_action}</p>
                <p className="mt-2 text-xs font-semibold text-violet-600">
                  {labels.recommendations.confidence}: {rec.confidence}%
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-900">
        {labels.privacyNote}
      </p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}
