"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SinceLastLoginSummaryPanel, {
  type SinceLastLoginSummaryLabels,
} from "@/components/shared/since-last-login/SinceLastLoginSummaryPanel";
import PriorityBadge from "@/components/platform/PriorityBadge";
import RecommendedActionsPanel from "@/components/platform/RecommendedActionsPanel";
import AipifyBrainOverviewSection from "@/components/platform/AipifyBrainOverviewSection";
import IntelligenceRecommendationsSection from "@/components/platform/IntelligenceRecommendationsSection";
import PlatformLearningPanel from "@/components/platform/PlatformLearningPanel";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformLayoutClasses } from "@/lib/design";
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
  sinceLastLoginLabels: SinceLastLoginSummaryLabels;
  labels: {
    title: string;
    subtitle: string;
    note: string;
    loading: string;
    loadErrorTitle: string;
    loadErrorMessage: string;
    retry: string;
    pulseLabel: string;
    platformScore: string;
    operationalLinksTitle: string;
    linkPlatformHealth: string;
    linkAuditLogs: string;
    linkInstallations: string;
    linkSupport: string;
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

const OPERATIONAL_LINKS = [
  { href: "/platform/operations/platform-health", labelKey: "linkPlatformHealth" as const },
  { href: "/platform/operations/audit-logs", labelKey: "linkAuditLogs" as const },
  { href: "/platform/installations", labelKey: "linkInstallations" as const },
  { href: "/platform/support", labelKey: "linkSupport" as const },
] as const;

export default function PlatformOverviewPanel({
  sinceLastLoginLabels,
  labels,
}: PlatformOverviewPanelProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [session, setSession] = useState<PlatformAdminSession | null>(null);
  const [snapshot, setSnapshot] = useState<PlatformDashboardSnapshot | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [markedRead, setMarkedRead] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(false);

      try {
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

        if (cancelled) return;

        const nextSession =
          sessionResult.error || !sessionResult.data
            ? null
            : (sessionResult.data as PlatformAdminSession);
        const nextSnapshot =
          snapshotResult.error || !snapshotResult.data
            ? null
            : ({ ...EMPTY_SNAPSHOT, ...(snapshotResult.data as object) } as PlatformDashboardSnapshot);
        const nextMetrics =
          metricsResult.error || !metricsResult.data
            ? null
            : (metricsResult.data as PlatformMetrics);

        setSession(nextSession);
        setSnapshot(nextSnapshot);
        setMetrics(nextMetrics);
        setLoadError(!nextSession || !nextSnapshot);
      } catch {
        if (!cancelled) {
          setSession(null);
          setSnapshot(null);
          setMetrics(null);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

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
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (loadError || !session || !snapshot) {
    return (
      <div
        role="alert"
        className={`${PlatformLayoutClasses.card} flex flex-col gap-4 border-rose-200 bg-rose-50 sm:flex-row sm:items-start sm:justify-between dark:border-rose-800/80 dark:bg-rose-950/40`}
      >
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-rose-950 dark:text-rose-50">
            {labels.loadErrorTitle}
          </h1>
          <p className="mt-1 text-sm text-rose-800/90 dark:text-rose-200/90">
            {labels.loadErrorMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadToken((token) => token + 1)}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-900 shadow-sm hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-50"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const adminName = session.admin_name;
  const health = metrics ? getSystemHealth(metrics) : null;

  return (
    <div className={PlatformLayoutClasses.page}>
      <header className={PlatformLayoutClasses.pageHeader}>
        <h1 className={PlatformLayoutClasses.pageTitle}>{labels.title}</h1>
        <p className={PlatformLayoutClasses.pageSubtitle}>{labels.subtitle}</p>
      </header>

      <section className={PlatformLayoutClasses.cardMuted}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {labels.operationalLinksTitle}
        </h2>
        <div className={`mt-3 ${PlatformLayoutClasses.navCardGrid}`}>
          {OPERATIONAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {labels[link.labelKey]}
            </Link>
          ))}
        </div>
      </section>

      <SinceLastLoginSummaryPanel
        scope="platform_admin"
        labels={sinceLastLoginLabels}
        variant="compact"
        touchLogin={false}
      />

      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-white to-indigo-50/40 p-6 shadow-sm sm:p-8 dark:border-violet-900/40 dark:from-violet-950/30 dark:via-slate-950 dark:to-indigo-950/20">
        <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-200">
          {labels.briefing.title}
        </h2>
        <p className="mt-4 text-base font-semibold text-gray-900 dark:text-slate-100">
          {greeting.replace("{name}", adminName)}
        </p>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-slate-400">
          {labels.briefing.sinceVisit}
        </p>
        <ul className="mt-4 space-y-3">
          {briefingItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start gap-2.5 rounded-xl bg-white/60 px-3 py-2.5 dark:bg-slate-900/50"
            >
              <PriorityBadge
                priority={item.priority}
                label={labels.priorityLabels[item.priority] ?? item.priority}
              />
              <span className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {item.message}
              </span>
            </li>
          ))}
        </ul>
        {health ? (
          <p className="mt-5 text-xs text-gray-500 dark:text-slate-400">
            {labels.platformScore
              .replace("{score}", String(health.score))
              .replace("{label}", health.label)}
          </p>
        ) : null}
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

      <section className={PlatformLayoutClasses.card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            {labels.sinceLogin.title}
          </h2>
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={markedRead}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-violet-200 hover:text-violet-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
          >
            {markedRead ? labels.sinceLogin.markedRead : labels.sinceLogin.markRead}
          </button>
        </div>
        {markedRead ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">{labels.sinceLogin.empty}</p>
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
                    className="w-full rounded-xl bg-gray-50/80 px-4 py-3 text-left text-sm text-gray-700 ring-1 ring-gray-100 transition hover:ring-violet-200 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800"
                  >
                    <span className="font-medium">{event.label}</span>
                    {expandedEvent === event.id && event.href ? (
                      <Link
                        href={event.href}
                        className="mt-2 block text-xs font-semibold text-violet-600 hover:text-violet-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {labels.sinceLogin.openModule} →
                      </Link>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-violet-700 dark:text-violet-300">
              {labels.sinceLogin.recommendationHint}
            </p>
          </>
        )}
      </section>

      <p className="text-sm text-slate-500 dark:text-slate-400">{labels.note}</p>
    </div>
  );
}
