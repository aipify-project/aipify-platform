"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import {
  getPresenceAnimationClass,
  getPresenceGlowClass,
  type PresenceState,
} from "@/lib/presence/presence-engine";
import { createClient } from "@/lib/supabase/client";
import { parseBrainDashboard, type BrainDashboard } from "@/lib/platform/intelligence-engine";

type AipifyBrainOverviewSectionProps = {
  labels: {
    title: string;
    viewBrain: string;
    loading: string;
    approvedPatterns: string;
    awaitingReview: string;
    healingSuccessRate: string;
    learningConfidence: string;
    automationCoverage: string;
    pulseLabel: string;
    confidenceHigh: string;
    confidenceMedium: string;
    confidenceLow: string;
  };
};

const EMPTY: BrainDashboard = { metrics: null, presence: null, recommendations: [], recent_reviews: [] };

function resolvePresenceState(state: string): PresenceState {
  const map: Record<string, PresenceState> = {
    standby: "standby",
    monitoring: "standby",
    analysing: "analysing",
    working: "working",
    learning: "learning",
    self_healing: "self_healing",
    human_approval_required: "human_approval_required",
    critical_attention: "critical_attention",
  };
  return map[state] ?? "standby";
}

function confidenceLabel(
  level: string | undefined,
  metricsConfidence: number,
  labels: AipifyBrainOverviewSectionProps["labels"]
): string {
  if (level === "high" || metricsConfidence >= 80) return labels.confidenceHigh;
  if (level === "medium" || metricsConfidence >= 50) return labels.confidenceMedium;
  return labels.confidenceLow;
}

export default function AipifyBrainOverviewSection({ labels }: AipifyBrainOverviewSectionProps) {
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
  if (!metrics) return null;

  const presenceState = resolvePresenceState(dashboard.presence?.state ?? "standby");
  const animationClass = getPresenceAnimationClass(presenceState);
  const glowClass = getPresenceGlowClass(presenceState);

  return (
    <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`relative rounded-xl border border-violet-100 bg-white p-2 ${animationClass}`}>
            <span
              className={`pointer-events-none absolute inset-1 rounded-lg bg-gradient-to-br ${glowClass} blur-sm`}
              aria-hidden="true"
            />
            <AipifyPulse
              size="sm"
              variant="gradient"
              title={labels.pulseLabel}
              aria-label={labels.pulseLabel}
              className="relative"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        </div>
        <Link
          href="/platform/intelligence"
          className="text-sm font-semibold text-violet-700 hover:text-violet-900"
        >
          {labels.viewBrain} →
        </Link>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label={labels.approvedPatterns} value={String(metrics.knowledge_patterns_approved)} />
        <Metric label={labels.awaitingReview} value={String(metrics.patterns_awaiting_review)} />
        <Metric
          label={labels.healingSuccessRate}
          value={`${metrics.self_healing_success_rate}%`}
        />
        <Metric
          label={labels.learningConfidence}
          value={confidenceLabel(
            dashboard.presence?.system_confidence,
            metrics.learning_confidence,
            labels
          )}
        />
        <Metric label={labels.automationCoverage} value={`${metrics.automation_coverage}%`} />
      </dl>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-violet-100 bg-white/80 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}
