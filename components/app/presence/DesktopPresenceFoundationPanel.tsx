"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { DesktopPresenceBundle } from "@/lib/presence/desktop";
import type {
  PresenceNotification,
  PresenceNotificationPreferences,
} from "@/lib/presence/notification-state";
import {
  PRESENCE_NOTIFICATION_CHANNELS,
  type PresenceNotificationLevel,
} from "@/lib/presence/notifications";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import { createClient } from "@/lib/supabase/client";

type DesktopPresenceFoundationPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    sidebar: {
      health: string;
      activity: string;
      recommendations: string;
      executive: string;
      approvals: string;
      skills: string;
      desktopPrepared: string;
    };
    notifications: {
      title: string;
      unread: string;
      none: string;
      levels: Record<PresenceNotificationLevel, string>;
      actions: Record<string, string>;
    };
    preferences: {
      title: string;
      quietHours: string;
      channels: string;
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

export function DesktopPresenceFoundationPanel({
  labels,
}: DesktopPresenceFoundationPanelProps) {
  const [bundle, setBundle] = useState<DesktopPresenceBundle | null>(null);
  const [notifications, setNotifications] = useState<PresenceNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [prefs, setPrefs] = useState<PresenceNotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const [bundleRes, notifRes, prefsRes] = await Promise.all([
      supabase.rpc("get_desktop_presence_bundle"),
      supabase.rpc("list_presence_notifications", { p_limit: 15, p_unread_only: false }),
      supabase.rpc("get_presence_notification_preferences"),
    ]);

    if (!bundleRes.error && bundleRes.data?.has_customer) {
      const raw = bundleRes.data as Record<string, unknown>;
      setBundle({
        principle: String(raw.principle ?? labels.principle),
        unread_count: Number(raw.unread_count ?? 0),
        desktop_clients_prepared: ["macos", "windows", "linux"],
        sidebar: raw.sidebar as DesktopPresenceBundle["sidebar"],
      });
    }

    if (!notifRes.error && notifRes.data) {
      const raw = notifRes.data as {
        notifications: PresenceNotification[];
        unread_count: number;
      };
      setNotifications(raw.notifications ?? []);
      setUnreadCount(raw.unread_count ?? 0);
    }

    if (!prefsRes.error && prefsRes.data?.preferences) {
      const p = prefsRes.data.preferences as Record<string, unknown>;
      setPrefs({
        mode: (p.quiet_hours_mode as QuietHoursMode) ?? "standard",
        working_hours_start: String(p.working_hours_start ?? "09:00"),
        working_hours_end: String(p.working_hours_end ?? "17:00"),
        timezone: String(p.timezone ?? "UTC"),
        vacation_until: (p.vacation_until as string) ?? null,
        channel_in_app: p.channel_in_app !== false,
        channel_desktop: p.channel_desktop !== false,
        channel_email_digest: p.channel_email_digest === true,
        channel_mobile_push: p.channel_mobile_push === true,
        min_level_in_app: (p.min_level_in_app as PresenceNotificationLevel) ?? "informational",
        min_level_desktop: (p.min_level_desktop as PresenceNotificationLevel) ?? "important",
        min_level_email: (p.min_level_email as PresenceNotificationLevel) ?? "important",
      });
    }

    setLoading(false);
  }, [labels.principle]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleAction(notificationId: string, actionType: string) {
    await fetch(`/api/presence/notifications/${notificationId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType }),
    });
    await refresh();
  }

  async function handleSavePreferences() {
    if (!prefs) return;
    await fetch("/api/presence/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiet_hours_mode: prefs.mode,
        channel_in_app: prefs.channel_in_app,
        channel_desktop: prefs.channel_desktop,
        channel_email_digest: prefs.channel_email_digest,
        channel_mobile_push: prefs.channel_mobile_push,
      }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!bundle) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2 text-sm text-violet-900">
          {bundle.principle}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-500">{labels.sidebar.health}</h2>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {bundle.sidebar.health_status.score}%
          </p>
          <p className="text-xs text-gray-600">{bundle.sidebar.health_status.label}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-500">{labels.sidebar.approvals}</h2>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {bundle.sidebar.pending_approvals}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-500">{labels.sidebar.skills}</h2>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {bundle.sidebar.active_skills}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sidebar.desktopPrepared}</h2>
        <p className="mt-2 text-sm text-gray-600">
          macOS · Windows · Linux — infrastructure ready, native apps not built yet.
        </p>
        <p className="mt-4 text-sm text-gray-700">{bundle.sidebar.executive_summary}</p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{labels.notifications.title}</h2>
          <span className="text-sm text-gray-500">
            {labels.notifications.unread.replace("{count}", String(unreadCount))}
          </span>
        </div>
        {notifications.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">{labels.notifications.none}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li key={notification.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${LEVEL_STYLES[notification.level] ?? LEVEL_STYLES.informational}`}
                    >
                      {labels.notifications.levels[notification.level] ?? notification.level}
                    </span>
                    <p className="mt-2 font-medium text-gray-900">{notification.title}</p>
                    {notification.body && (
                      <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
                    )}
                  </div>
                </div>
                {Array.isArray(notification.actions) && notification.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {notification.actions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => void handleAction(notification.id, action.type)}
                        className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {prefs && (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{labels.preferences.title}</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="quiet-hours">
                {labels.preferences.quietHours}
              </label>
              <select
                id="quiet-hours"
                value={prefs.mode}
                onChange={(e) =>
                  setPrefs({ ...prefs, mode: e.target.value as QuietHoursMode })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {QUIET_HOURS_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {labels.preferences.modes[mode]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{labels.preferences.channels}</p>
              <div className="mt-2 flex flex-wrap gap-4">
                {PRESENCE_NOTIFICATION_CHANNELS.slice(0, 4).map((channel) => (
                  <label key={channel} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={
                        channel === "in_app"
                          ? prefs.channel_in_app
                          : channel === "desktop"
                            ? prefs.channel_desktop
                            : channel === "email_digest"
                              ? prefs.channel_email_digest
                              : prefs.channel_mobile_push
                      }
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (channel === "in_app") setPrefs({ ...prefs, channel_in_app: checked });
                        if (channel === "desktop") setPrefs({ ...prefs, channel_desktop: checked });
                        if (channel === "email_digest")
                          setPrefs({ ...prefs, channel_email_digest: checked });
                        if (channel === "mobile_push")
                          setPrefs({ ...prefs, channel_mobile_push: checked });
                      }}
                    />
                    {channel.replace("_", " ")}
                  </label>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleSavePreferences()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {saved ? labels.preferences.saved : labels.preferences.save}
            </button>
          </div>
        </section>
      )}

      <p className="text-xs text-gray-500">
        Open the{" "}
        <Link href="/app" className="text-indigo-600 hover:underline">
          Presence indicator
        </Link>{" "}
        in the top bar for live activity.
      </p>
    </div>
  );
}
