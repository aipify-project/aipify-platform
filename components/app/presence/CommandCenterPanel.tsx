"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { CommandCenterBundle } from "@/lib/notification/command-center-state";
import type { QuickActionId } from "@/lib/notification/command-center";
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
    sections: {
      executiveFeed: string;
      health: string;
      approvals: string;
      skills: string;
      activity: string;
      recommendations: string;
      notifications: string;
      quickActions: string;
      desktopPrepared: string;
    };
    feedEmpty: string;
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

  async function runQuickAction(actionId: QuickActionId, notificationId?: string) {
    await fetch("/api/presence/quick-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id: actionId, notification_id: notificationId }),
    });
    await refresh();
  }

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
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!bundle?.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const feed = (bundle.executive_feed ?? []) as ExecutiveFeedEntry[];
  const notifications = (bundle.notifications ?? []) as PresenceNotification[];
  const hasCommandCenter = bundle.capabilities?.command_center !== false;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2 text-sm text-violet-900">
          {bundle.principle ?? labels.principle}
        </p>
        <p className="mt-2 text-xs text-gray-500">{bundle.core_principle ?? labels.corePrinciple}</p>
        {!hasCommandCenter && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {labels.planGate}
          </p>
        )}
        <Link
          href="/app/command-center/connect"
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          {labels.desktopConnect}
        </Link>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.executiveFeed}</h2>
        {feed.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{labels.feedEmpty}</p>
        ) : (
          <ol className="mt-4 space-y-4">
            {feed.map((entry) => (
              <li key={entry.id} className="flex gap-4 text-sm">
                <span className="w-14 shrink-0 font-mono text-gray-500">{entry.time_label}</span>
                <span className="text-gray-800">{entry.message}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500">{labels.sections.health}</h3>
          <p className="mt-2 text-2xl font-semibold">
            {bundle.health_overview?.score ?? "—"}%
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500">{labels.sections.approvals}</h3>
          <p className="mt-2 text-2xl font-semibold">{bundle.pending_approvals ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500">{labels.sections.skills}</h3>
          <p className="mt-2 text-2xl font-semibold">{bundle.active_skills ?? 0}</p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections.notifications}</h2>
          <span className="text-sm text-gray-500">
            {labels.notifications.unread.replace("{count}", String(bundle.unread_count ?? 0))}
          </span>
        </div>
        {notifications.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{labels.notifications.none}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {notifications.map((n) => (
              <li key={n.id} className="py-3 text-sm">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs ${LEVEL_STYLES[n.level]}`}
                >
                  {labels.notifications.levels[n.level]}
                </span>
                <p className="mt-2 font-medium text-gray-900">{n.title}</p>
                {n.body && <p className="text-gray-600">{n.body}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.quickActions}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(bundle.quick_actions ?? []).map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => void runQuickAction(action.id as QuickActionId)}
              className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.preferences.title}</h2>
        <select
          value={quietMode}
          onChange={(e) => setQuietMode(e.target.value as QuietHoursMode)}
          className="mt-3 block w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {saved ? labels.preferences.saved : labels.preferences.save}
        </button>
      </section>

      <p className="text-xs text-gray-500">
        {labels.sections.desktopPrepared}: macOS · Windows · Linux —{" "}
        <Link href="/app" className="text-indigo-600 hover:underline">
          Open web dashboard
        </Link>
      </p>
    </div>
  );
}
