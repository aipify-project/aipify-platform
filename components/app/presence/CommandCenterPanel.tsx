"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { ExecutiveActionCard } from "@/components/app/presence/ExecutiveActionCard";
import {
  buildExecutiveActionCards,
  buildOrganizationHealthMetrics,
  resolveExecutiveFeed,
} from "@/lib/executive/executive-center-defaults";
import type { CommandCenterBundle } from "@/lib/notification/command-center-state";
import type { ExecutiveFeedEntry } from "@/lib/notification/executive-feed";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { QuietHoursMode } from "@/lib/presence/quiet-hours";
import { QUIET_HOURS_MODES } from "@/lib/presence/quiet-hours";
import { createClient } from "@/lib/supabase/client";

type CommandCenterPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    corePrinciple: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    planGate: string;
    desktopConnect: string;
    sinceLastLogin: string;
    sections: {
      executiveBriefing: string;
      organizationHealth: string;
      attention: string;
      recommendedActions: string;
      recommendedActionsNote: string;
      insights: string;
      companionStatus: string;
      notifications: string;
      preferences: string;
      desktopCompanion: string;
    };
    feedFallback: string[];
    actionCards: {
      pendingApprovals: { title: string; detail: (count: number) => string; action: string };
      escalations: { title: string; detail: (count: number) => string; action: string };
      executiveSummary: { title: string; detail: string; action: string };
      securityAlerts: { title: string; detail: (count: number) => string; action: string };
    };
    health: {
      operational: string;
      security: string;
      team: string;
      commerce: string;
    };
    insights: {
      trends: string;
      risks: string;
      opportunities: string;
    };
    companion: {
      presence: string;
      desktop: string;
      learning: string;
      automation: string;
      macosAvailable: string;
      windowsPlanned: string;
      linuxPlanned: string;
    };
    notifications: {
      unread: string;
      none: string;
      levels: Record<PresenceNotificationLevel, string>;
    };
    preferences: {
      title: string;
      quietHours: string;
      save: string;
      saved: string;
      modes: Record<QuietHoursMode, string>;
    };
  };
};

const LEVEL_STYLES: Record<PresenceNotificationLevel, string> = {
  informational: "bg-gray-100 text-gray-700",
  important: "bg-sky-100 text-sky-800",
  action_required: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-800",
};

const HEALTH_STYLES = {
  healthy: "text-emerald-700",
  neutral: "text-gray-700",
  attention: "text-amber-700",
} as const;

export function CommandCenterPanel({ labels }: CommandCenterPanelProps) {
  const [bundle, setBundle] = useState<CommandCenterBundle | null>(null);
  const [quietMode, setQuietMode] = useState<QuietHoursMode>("standard");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const [centerRes, prefsRes] = await Promise.all([
      supabase.rpc("get_command_center_bundle"),
      supabase.rpc("get_presence_notification_preferences"),
    ]);

    if (!centerRes.error && centerRes.data?.has_customer) {
      setBundle(centerRes.data as CommandCenterBundle);
    }

    if (!prefsRes.error && prefsRes.data?.preferences) {
      const p = prefsRes.data.preferences as Record<string, unknown>;
      setQuietMode((p.quiet_hours_mode as QuietHoursMode) ?? "standard");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveQuietMode() {
    await fetch("/api/presence/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quiet_hours_mode: quietMode }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="px-6 py-16 text-base text-gray-600">{labels.loading}</div>
    );
  }

  if (!bundle?.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const feed = resolveExecutiveFeed(
    (bundle.executive_feed ?? []) as ExecutiveFeedEntry[],
    labels.feedFallback,
  );
  const notifications = (bundle.notifications ?? []) as PresenceNotification[];
  const hasCommandCenter = bundle.capabilities?.command_center !== false;
  const actionCards = buildExecutiveActionCards(bundle, labels.actionCards);
  const healthMetrics = buildOrganizationHealthMetrics(
    bundle.health_overview?.score,
    labels.health,
  );
  const recommendations = bundle.recommendations ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {labels.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">{labels.subtitle}</p>
        <p className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/50 px-5 py-4 text-base text-violet-950">
          {bundle.principle ?? labels.principle}
        </p>
        {!hasCommandCenter && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
            {labels.planGate}
          </p>
        )}
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {labels.sections.executiveBriefing}
        </h2>
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-gray-500">
          {labels.sinceLastLogin}
        </p>
        <ul className="mt-6 space-y-3">
          {feed.map((entry) => (
            <li key={entry.id} className="flex gap-3 text-base text-gray-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
              <span>{entry.message}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {labels.sections.organizationHealth}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
              <p className={`mt-3 text-3xl font-semibold ${HEALTH_STYLES[metric.status]}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="attention">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {labels.sections.attention}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {actionCards.map((card) => (
            <ExecutiveActionCard
              key={card.id}
              title={card.title}
              detail={card.detail}
              actionLabel={card.actionLabel}
              href={card.href}
              tone={card.tone}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              {labels.sections.recommendedActions}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{labels.sections.recommendedActionsNote}</p>
          </div>
        </div>
        {recommendations.length === 0 ? (
          <p className="mt-6 text-base text-gray-600">
            {labels.actionCards.executiveSummary.detail}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {recommendations.map((item) => (
              <li key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-base text-gray-700">
                {item.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {labels.sections.insights}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[labels.insights.trends, labels.insights.risks, labels.insights.opportunities].map(
            (label) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">{label}</p>
                <p className="mt-3 text-base leading-relaxed text-gray-700">
                  {label === labels.insights.trends
                    ? labels.feedFallback[2]
                    : label === labels.insights.risks
                      ? labels.feedFallback[4]
                      : labels.feedFallback[5]}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {labels.sections.companionStatus}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: labels.companion.presence, href: "/app/presence" },
            { label: labels.companion.desktop, href: "/app/command-center/connect" },
            { label: labels.companion.learning, href: "/app/learning" },
            { label: labels.companion.automation, href: "/app/automations" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-base font-medium text-gray-800 transition hover:border-violet-200 hover:bg-violet-50/40"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold text-gray-900">{labels.sections.desktopCompanion}</h3>
          <p className="mt-2 text-base text-gray-600">{labels.desktopConnect}</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ {labels.companion.macosAvailable}</li>
            <li>{labels.companion.windowsPlanned}</li>
            <li>{labels.companion.linuxPlanned}</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">{labels.sections.notifications}</h2>
          <span className="text-sm text-gray-500">
            {labels.notifications.unread.replace("{count}", String(bundle.unread_count ?? 0))}
          </span>
        </div>
        {notifications.length === 0 ? (
          <p className="mt-4 text-base text-gray-600">{labels.notifications.none}</p>
        ) : (
          <ul className="mt-6 divide-y divide-gray-100">
            {notifications.map((n) => (
              <li key={n.id} className="py-4">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${LEVEL_STYLES[n.level]}`}
                >
                  {labels.notifications.levels[n.level]}
                </span>
                <p className="mt-2 text-base font-medium text-gray-900">{n.title}</p>
                {n.body ? <p className="mt-1 text-sm text-gray-600">{n.body}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{labels.preferences.title}</h2>
        <label className="mt-4 block text-sm font-medium text-gray-700" htmlFor="quiet-hours">
          {labels.preferences.quietHours}
        </label>
        <select
          id="quiet-hours"
          value={quietMode}
          onChange={(e) => setQuietMode(e.target.value as QuietHoursMode)}
          className="mt-2 block w-full max-w-md rounded-xl border border-gray-300 px-4 py-3 text-sm"
        >
          {QUIET_HOURS_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {labels.preferences.modes[mode]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void saveQuietMode()}
          className="mt-4 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
        >
          {saved ? labels.preferences.saved : labels.preferences.save}
        </button>
      </section>

      <p className="text-xs text-gray-500">{labels.corePrinciple}</p>
    </div>
  );
}
