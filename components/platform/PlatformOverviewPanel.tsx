"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import PriorityBadge from "@/components/platform/PriorityBadge";
import RecommendedActionsPanel from "@/components/platform/RecommendedActionsPanel";
import AipifyBrainOverviewSection from "@/components/platform/AipifyBrainOverviewSection";
import IntelligenceRecommendationsSection from "@/components/platform/IntelligenceRecommendationsSection";
import PlatformLearningPanel from "@/components/platform/PlatformLearningPanel";
import { createClient } from "@/lib/supabase/client";
import { getGreetingPeriodForTimezone, getBrowserTimezone } from "@/lib/core/greeting";
import {
  type PlatformAdminSession,
  type PlatformDashboardSnapshot,
} from "@/lib/platform/ai-dashboard";
import {
  buildExecutiveBriefingItems,
  buildRecommendedActions,
  buildSinceLoginEvents,
} from "@/lib/platform/executive-intelligence";
import { getSystemHealth } from "@/lib/platform/metrics-dashboard";
import type { PlatformMetrics } from "@/lib/platform/types";

type PlatformOverviewPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    note: string;
    loading: string;
    pulseLabel: string;
    briefing: {
      title: string;
      greetingMorning: string;
      greetingAfternoon: string;
      greetingEvening: string;
      sinceVisit: string;
      newCustomers: string;
      trialsEnding: string;
      supportResolved: string;
      escalated: string;
      failedAutomations: string;
      systemWarnings: string;
      newRecommendations: string;
      followUp: string;
      noIncidents: string;
      incidents: string;
    };
    priorityLabels: Record<string, string>;
    recommendedActions: {
      title: string;
      suggestedAction: string;
      empty: string;
      trialsExpiring: { title: string; reason: string; action: string };
      healthDropped: { title: string; reason: string; action: string };
      escalationWaiting: { title: string; reason: string; action: string };
      revenueOpportunity: { title: string; reason: string; action: string };
      failedAutomation: { title: string; reason: string; action: string };
    };
    brain: {
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
    intelligenceRecommendations: {
      title: string;
      subtitle: string;
      loading: string;
      empty: string;
      confidence: string;
      viewQueue: string;
    };
    learning: {
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
    sinceLogin: {
      title: string;
      markRead: string;
      markedRead: string;
      expand: string;
      openModule: string;
      newCustomers: string;
      supportResolved: string;
      escalated: string;
      installationsCompleted: string;
      automationsTriggered: string;
      aiRecommendations: string;
      systemIncidents: string;
      revenueEvents: string;
      recommendationHint: string;
      empty: string;
    };
  };
};

const READ_STORAGE_KEY = "aipify-platform-since-login-read";

const EMPTY_SNAPSHOT: PlatformDashboardSnapshot = {
  since: new Date().toISOString(),
  new_customers: 0,
  new_installations: 0,
  trials_ending_7d: 0,
  support_resolved: 0,
  escalated_cases: 0,
  waiting_human: 0,
  open_cases: 0,
  billing_events: 0,
  follow_up_customers: 0,
  system_incidents: 0,
  failed_automations: 0,
  system_warnings: 0,
  new_ai_recommendations: 0,
  automations_triggered: 0,
  revenue_events: 0,
};

export default function PlatformOverviewPanel({ labels }: PlatformOverviewPanelProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PlatformAdminSession | null>(null);
  const [snapshot, setSnapshot] = useState<PlatformDashboardSnapshot | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [markedRead, setMarkedRead] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const sessionResult = await supabase.rpc("record_platform_admin_login");
      const previousLogin =
        sessionResult.data && typeof sessionResult.data === "object"
          ? ((sessionResult.data as PlatformAdminSession).previous_login_at ?? null)
          : null;

      const [snapshotResult, metricsResult] = await Promise.all([
        supabase.rpc("get_platform_dashboard_snapshot", { p_since: previousLogin }),
        supabase.rpc("get_platform_metrics"),
        supabase.rpc("record_executive_metric_snapshot"),
      ]);

      if (!cancelled) {
        setSession(
          sessionResult.error || !sessionResult.data
            ? null
            : (sessionResult.data as PlatformAdminSession)
        );
        setSnapshot(
          snapshotResult.error || !snapshotResult.data
            ? null
            : ({ ...EMPTY_SNAPSHOT, ...(snapshotResult.data as object) } as PlatformDashboardSnapshot)
        );
        setMetrics(
          metricsResult.error || !metricsResult.data
            ? null
            : (metricsResult.data as PlatformMetrics)
        );
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!session?.last_login_at) return;
    const stored = localStorage.getItem(`${READ_STORAGE_KEY}-${session.last_login_at}`);
    setMarkedRead(stored === "1");
  }, [session?.last_login_at]);

  const greeting = useMemo(() => {
    const part = getGreetingPeriodForTimezone(getBrowserTimezone());
    if (part === "morning") return labels.briefing.greetingMorning;
    if (part === "afternoon") return labels.briefing.greetingAfternoon;
    return labels.briefing.greetingEvening;
  }, [labels.briefing]);

  const briefingItems = useMemo(() => {
    if (!snapshot) return [];
    return buildExecutiveBriefingItems(snapshot, labels.briefing);
  }, [labels.briefing, snapshot]);

  const recommendedActions = useMemo(() => {
    if (!snapshot) return [];
    return buildRecommendedActions(snapshot, metrics, labels.recommendedActions);
  }, [labels.recommendedActions, metrics, snapshot]);

  const sinceLoginEvents = useMemo(() => {
    if (!snapshot) return [];
    return buildSinceLoginEvents(snapshot, metrics, labels.sinceLogin);
  }, [labels.sinceLogin, metrics, snapshot]);

  function handleMarkRead() {
    if (!session?.last_login_at) return;
    localStorage.setItem(`${READ_STORAGE_KEY}-${session.last_login_at}`, "1");
    setMarkedRead(true);
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!session || !snapshot) {
    return <AipifyEmptyState message={labels.note} pulseLabel={labels.pulseLabel} />;
  }

  const adminName = session.admin_name;
  const health = metrics ? getSystemHealth(metrics) : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </header>

      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-indigo-50/40 p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-violet-900">{labels.briefing.title}</h2>
        <p className="mt-4 text-base font-semibold text-gray-900">
          {greeting.replace("{name}", adminName)}
        </p>
        <p className="mt-2 text-sm font-medium text-gray-600">{labels.briefing.sinceVisit}</p>
        <ul className="mt-4 space-y-3">
          {briefingItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start gap-2.5 rounded-xl bg-white/60 px-3 py-2.5"
            >
              <PriorityBadge
                priority={item.priority}
                label={labels.priorityLabels[item.priority] ?? item.priority}
              />
              <span className="text-sm leading-relaxed text-gray-700">{item.message}</span>
            </li>
          ))}
        </ul>
        {health && (
          <p className="mt-5 text-xs text-gray-500">
            Platform score: {health.score}% · {health.label}
          </p>
        )}
      </section>

      <RecommendedActionsPanel
        title={labels.recommendedActions.title}
        actions={recommendedActions}
        priorityLabels={labels.priorityLabels}
        suggestedActionLabel={labels.recommendedActions.suggestedAction}
        empty={labels.recommendedActions.empty}
      />

      <AipifyBrainOverviewSection labels={labels.brain} />

      <IntelligenceRecommendationsSection labels={labels.intelligenceRecommendations} />

      <PlatformLearningPanel labels={labels.learning} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sinceLogin.title}</h2>
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={markedRead}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
          >
            {markedRead ? labels.sinceLogin.markedRead : labels.sinceLogin.markRead}
          </button>
        </div>
        {markedRead ? (
          <p className="mt-4 text-sm text-gray-500">{labels.sinceLogin.empty}</p>
        ) : (
          <>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {sinceLoginEvents.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedEvent((current) => (current === event.id ? null : event.id))
                    }
                    className="w-full rounded-xl bg-gray-50/80 px-4 py-3 text-left text-sm text-gray-700 ring-1 ring-gray-100 transition hover:ring-violet-200"
                  >
                    <span className="font-medium">{event.label}</span>
                    {expandedEvent === event.id && event.href && (
                      <Link
                        href={event.href}
                        className="mt-2 block text-xs font-semibold text-violet-600 hover:text-violet-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {labels.sinceLogin.openModule} →
                      </Link>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-violet-700">{labels.sinceLogin.recommendationHint}</p>
          </>
        )}
      </section>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-sm text-blue-900">
        {labels.note}
      </div>
    </div>
  );
}
