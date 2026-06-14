"use client";

import { useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { usePlatformProfile } from "@/components/platform/PlatformProfileProvider";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  computeAutomationItemHealthScore,
  enrichAutomationHealthSummary,
  filterAutomations,
  formatAipifyProductLabel,
  getAutomationHealthBand,
  getGreetingPeriod,
  type AutomationFilterKey,
  type AutomationHealthBand,
  type AipifyInsightState,
} from "@/lib/platform/automation-experience";
import { getAutomationCategoryStyle } from "@/lib/platform/intelligence-engine";
import { createClient } from "@/lib/supabase/client";
import type {
  AutomationCategoryKey,
  PlatformAutomation,
  WeeklyExecutiveDigest,
} from "@/lib/platform/types";
import WeeklyExecutiveDigestCard from "./WeeklyExecutiveDigestCard";

type PlatformAutomationsPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    name: string;
    status: string;
    trigger: string;
    lastRun: string;
    nextRun: string;
    actions: string;
    healthTitle: string;
    healthScore: string;
    lastSuccess: string;
    totalExecutions: string;
    failureCount: string;
    avgExecution: string;
    runs: string;
    view: string;
    pulseLabel: string;
    greeting: { morning: string; afternoon: string; evening: string };
    executiveSummary: {
      intro: string;
      activeAutomations: string;
      needsAttention: string;
      selfHealingToday: string;
      platformHealth: string;
    };
    insight: {
      title: string;
      healthy: string;
      needsAttention: string;
      critical: string;
      improving: string;
      healthyWithFocus: string;
      criticalWithFocus: string;
      needsAttentionWithFocus: string;
    };
    healthBands: Record<AutomationHealthBand, string>;
    insightStates: Record<AipifyInsightState, string>;
    filters: Record<AutomationFilterKey, string>;
    searchPlaceholder: string;
    emptyHealthy: string;
    actionButtons: {
      review: string;
      runNow: string;
      pause: string;
      viewHistory: string;
      testRecovery: string;
      viewLogs: string;
      disable: string;
    };
    monitoringNote: string;
    statusLabels: Record<string, string> & {
      running?: string;
      self_healing?: string;
      admin_approved?: string;
    };
    digest: {
      title: string;
      newCustomers: string;
      supportRequests: string;
      aipifyResolved: string;
      revenueGrowth: string;
      supportEscalations: string;
      trialsExpiring: string;
      recommendations: string;
    };
    categories: {
      ai_generated: string;
      admin_approved: string;
      self_healing: string;
    };
  };
};

const CATEGORY_ORDER: AutomationCategoryKey[] = [
  "ai_generated",
  "admin_approved",
  "self_healing",
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  paused: "bg-gray-100 text-gray-700 ring-gray-200",
  warning: "bg-amber-100 text-amber-900 ring-amber-200",
  failed: "bg-rose-100 text-rose-900 ring-rose-200",
  running: "bg-sky-100 text-sky-800 ring-sky-200",
};

const INSIGHT_STYLES: Record<AipifyInsightState, string> = {
  healthy: "border-emerald-200 bg-emerald-50/60",
  needs_attention: "border-amber-200 bg-amber-50/60",
  critical: "border-rose-200 bg-rose-50/60",
  improving: "border-violet-200 bg-violet-50/60",
};

const HEALTH_BAND_STYLES: Record<AutomationHealthBand, string> = {
  healthy: "text-emerald-700 bg-emerald-50 ring-emerald-100",
  needs_attention: "text-amber-800 bg-amber-50 ring-amber-100",
  at_risk: "text-orange-800 bg-orange-50 ring-orange-100",
  critical: "text-rose-800 bg-rose-50 ring-rose-100",
};

const FILTER_KEYS: AutomationFilterKey[] = [
  "all",
  "active",
  "warning",
  "failed",
  "self_healing",
  "admin_approved",
];

function displayStatusLabel(
  automation: PlatformAutomation,
  labels: PlatformAutomationsPanelProps["labels"]
): string {
  const category = automation.category_key ?? "admin_approved";
  if (category === "self_healing" && automation.status === "active") {
    return labels.statusLabels.self_healing ?? labels.categories.self_healing;
  }
  return labels.statusLabels[automation.status] ?? automation.status;
}

function statusStyle(automation: PlatformAutomation): string {
  if (automation.status === "active" && automation.last_run_at) {
    const lastRun = new Date(automation.last_run_at).getTime();
    if (Date.now() - lastRun < 15 * 60 * 1000) {
      return STATUS_STYLES.running ?? STATUS_STYLES.active;
    }
  }
  return STATUS_STYLES[automation.status] ?? STATUS_STYLES.paused;
}

export default function PlatformAutomationsPanel({
  locale,
  labels,
}: PlatformAutomationsPanelProps) {
  const { displayName } = usePlatformProfile();
  const [automations, setAutomations] = useState<PlatformAutomation[]>([]);
  const [digest, setDigest] = useState<WeeklyExecutiveDigest | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AutomationFilterKey>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [autoResult, digestResult] = await Promise.all([
        supabase.rpc("list_platform_automations"),
        supabase.rpc("get_weekly_executive_digest"),
      ]);

      if (!cancelled) {
        setAutomations(
          autoResult.error || !autoResult.data
            ? []
            : (autoResult.data as PlatformAutomation[])
        );
        setDigest(
          digestResult.error || !digestResult.data
            ? null
            : (digestResult.data as WeeklyExecutiveDigest)
        );
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const health = useMemo(
    () => enrichAutomationHealthSummary(automations),
    [automations]
  );

  const filteredAutomations = useMemo(
    () => filterAutomations(automations, filter, search),
    [automations, filter, search]
  );

  const greeting = labels.greeting[getGreetingPeriod()].replace(
    "{name}",
    displayName.split(" ")[0] ?? displayName
  );

  const insightMessage = (() => {
    const { state, focusName } = health.insight;
    if (state === "healthy" && focusName) {
      return labels.insight.healthyWithFocus.replace("{name}", focusName);
    }
    if (state === "critical" && focusName) {
      return labels.insight.criticalWithFocus.replace("{name}", focusName);
    }
    if (state === "needs_attention" && focusName) {
      return labels.insight.needsAttentionWithFocus.replace("{name}", focusName);
    }
    const baseInsightMessages: Record<AipifyInsightState, string> = {
      healthy: labels.insight.healthy,
      needs_attention: labels.insight.needsAttention,
      critical: labels.insight.critical,
      improving: labels.insight.improving,
    };
    return baseInsightMessages[state];
  })();

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 via-white to-gray-50 p-6 shadow-sm">
        <p className="text-base font-medium text-gray-900">{greeting}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.executiveSummary.intro}</p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label={labels.executiveSummary.activeAutomations}
            value={String(health.activeCount)}
          />
          <SummaryCard
            label={labels.executiveSummary.needsAttention}
            value={String(health.needsAttentionCount)}
            highlight={health.needsAttentionCount > 0}
          />
          <SummaryCard
            label={labels.executiveSummary.selfHealingToday}
            value={String(health.selfHealingToday)}
          />
          <SummaryCard
            label={labels.executiveSummary.platformHealth}
            value={`${health.platformHealthScore}%`}
            highlight={health.platformHealthScore < 90}
          />
        </dl>
      </section>

      <section
        className={`rounded-2xl border p-5 shadow-sm ${INSIGHT_STYLES[health.insight.state]}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {labels.insight.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-800">{insightMessage}</p>
          </div>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
            {labels.insightStates[health.insight.state]}
          </span>
        </div>
      </section>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTER_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === key
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {labels.filters[key]}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 lg:max-w-xs"
        />
      </div>

      {digest && (
        <WeeklyExecutiveDigestCard
          digest={digest}
          labels={{
            ...labels.digest,
            aiResolved: labels.digest.aipifyResolved,
          }}
        />
      )}

      {automations.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : filteredAutomations.length === 0 ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-6 py-8 text-center">
          <p className="text-sm text-emerald-900">{labels.emptyHealthy}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORY_ORDER.map((categoryKey) => {
            const categoryAutomations = filteredAutomations.filter(
              (automation) => (automation.category_key ?? "admin_approved") === categoryKey
            );
            if (categoryAutomations.length === 0) return null;

            const isSelfHealing = categoryKey === "self_healing";

            return (
              <section key={categoryKey}>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {labels.categories[categoryKey]}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${getAutomationCategoryStyle(categoryKey)}`}
                  >
                    {categoryAutomations.length}
                  </span>
                </div>
                <ul className="space-y-4">
                  {categoryAutomations.map((automation) => {
                    const healthScore = computeAutomationItemHealthScore(automation);
                    const band = getAutomationHealthBand(healthScore);
                    const displayName = formatAipifyProductLabel(automation.name);

                    return (
                      <li
                        key={automation.id}
                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-gray-900">
                                {displayName}
                              </h3>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${statusStyle(automation)}`}
                              >
                                {displayStatusLabel(automation, labels)}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${HEALTH_BAND_STYLES[band]}`}
                              >
                                {labels.healthBands[band]}
                              </span>
                            </div>
                            {automation.description && (
                              <p className="mt-2 text-sm text-gray-600">
                                {formatAipifyProductLabel(automation.description)}
                              </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">{labels.monitoringNote}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(isSelfHealing
                              ? [
                                  labels.actionButtons.review,
                                  labels.actionButtons.testRecovery,
                                  labels.actionButtons.viewLogs,
                                  labels.actionButtons.disable,
                                ]
                              : [
                                  labels.actionButtons.review,
                                  labels.actionButtons.runNow,
                                  labels.actionButtons.pause,
                                  labels.actionButtons.viewHistory,
                                ]
                            ).map((action) => (
                              <button
                                key={action}
                                type="button"
                                className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>

                        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                          <HealthMetric
                            label={labels.healthScore}
                            value={`${healthScore}%`}
                          />
                          <HealthMetric
                            label={labels.lastSuccess}
                            value={formatDateTime(automation.last_success_at, locale)}
                          />
                          <HealthMetric
                            label={labels.runs}
                            value={String(automation.total_executions)}
                          />
                          <HealthMetric
                            label={labels.failureCount}
                            value={String(automation.failure_count)}
                          />
                          <HealthMetric
                            label={labels.avgExecution}
                            value={`${automation.avg_execution_ms} ms`}
                          />
                        </dl>

                        <div className="mt-4 grid gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600 sm:grid-cols-3">
                          <p>
                            <span className="font-medium text-gray-700">{labels.trigger}:</span>{" "}
                            {automation.trigger_type}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">{labels.lastRun}:</span>{" "}
                            {formatDateTime(automation.last_run_at, locale)}
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">{labels.nextRun}:</span>{" "}
                            {formatDateTime(automation.next_run_at, locale)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-4 ring-1 ring-inset ${
        highlight
          ? "bg-amber-50/80 ring-amber-100"
          : "bg-white/90 ring-gray-100"
      }`}
    >
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}

function HealthMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-inset ring-gray-100">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
