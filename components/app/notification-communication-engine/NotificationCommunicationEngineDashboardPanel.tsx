"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseNotificationCommunicationEngineDashboard,
  type NotificationCommunicationEngineDashboard,
} from "@/lib/aipify/notification-communication-engine";

type NotificationCommunicationEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function priorityClass(priority?: string) {
  switch (priority) {
    case "critical":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatCategory(category?: string) {
  return (category ?? "").replace(/_/g, " ");
}

export function NotificationCommunicationEngineDashboardPanel({
  labels,
}: NotificationCommunicationEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<NotificationCommunicationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState("immediate");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/notification-communication-engine/dashboard");
    if (res.ok) {
      const parsed = parseNotificationCommunicationEngineDashboard(await res.json());
      setDashboard(parsed);
      setFrequency(String(parsed.preferences?.frequency ?? "immediate"));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleNotification(id: string, action: "read" | "dismiss") {
    setActionId(id);
    await fetch(`/api/notifications/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  async function generateDigest() {
    setActionId("digest");
    await fetch("/api/notifications/digests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ digest_type: "daily" }),
    });
    await load();
    setActionId(null);
  }

  async function savePreferences() {
    setActionId("prefs");
    await fetch("/api/notifications/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frequency }),
    });
    await load();
    setActionId(null);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const trends = dashboard.trends ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.operationsDashboard}
        </Link>
        <Link href="/app/presence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.presence}
        </Link>
        <Link href="/app/admin-assistant-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.adminAssistant}
        </Link>
        <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.secureAiActions}
        </Link>
      </div>

      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-sky-900">{labels.notificationEngine}</h2>
            <p className="mt-2 text-sm text-sky-900">{dashboard.philosophy}</p>
            <p className="mt-1 text-xs text-sky-700">{dashboard.safety_note}</p>
          </div>
          <button
            type="button"
            disabled={actionId === "digest"}
            onClick={() => void generateDigest()}
            className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-sm text-sky-900"
          >
            {labels.generateDigest}
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.unread}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.unread ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.criticalUnread}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.critical_unread ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.deliveredWeek}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{trends.delivered_7d ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.recentDigests}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.recent_digests.length}</p>
        </div>
      </section>

      {(dashboard.critical_alerts?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
          <h3 className="text-sm font-semibold text-rose-900">{labels.criticalAlerts}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.critical_alerts.map((alert) => (
              <li key={alert.id} className="rounded-lg border border-rose-100 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    {alert.message && <p className="mt-1 text-xs text-gray-600">{alert.message}</p>}
                    {alert.recommended_action && (
                      <p className="mt-1 text-xs text-rose-700">{alert.recommended_action}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.action_url && (
                      <Link href={alert.action_url} className="rounded border border-gray-200 px-2 py-1 text-xs">
                        {labels.openAction}
                      </Link>
                    )}
                    <button
                      type="button"
                      disabled={actionId === alert.id}
                      onClick={() => void handleNotification(alert.id, "read")}
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                    >
                      {labels.markRead}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">{labels.unreadNotifications}</h3>
        {dashboard.unread_notifications.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{labels.noNotifications}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.unread_notifications.map((n) => (
              <li key={n.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-xs capitalize ${priorityClass(n.priority)}`}>
                        {n.priority}
                      </span>
                      <span className="text-xs capitalize text-gray-500">{formatCategory(n.category)}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">{n.title}</p>
                    {n.message && <p className="mt-1 text-xs text-gray-600">{n.message}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {n.action_url && (
                      <Link href={n.action_url} className="rounded border border-gray-200 px-2 py-1 text-xs">
                        {labels.openAction}
                      </Link>
                    )}
                    <button
                      type="button"
                      disabled={actionId === n.id}
                      onClick={() => void handleNotification(n.id, "read")}
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                    >
                      {labels.markRead}
                    </button>
                    <button
                      type="button"
                      disabled={actionId === n.id}
                      onClick={() => void handleNotification(n.id, "dismiss")}
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                    >
                      {labels.dismiss}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.preferences}</h3>
          <div className="mt-3 space-y-3">
            <label className="block text-xs text-gray-600">
              {labels.frequency}
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="immediate">{labels.immediate}</option>
                <option value="daily_digest">{labels.dailyDigest}</option>
                <option value="weekly_digest">{labels.weeklyDigest}</option>
              </select>
            </label>
            <button
              type="button"
              disabled={actionId === "prefs"}
              onClick={() => void savePreferences()}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            >
              {labels.savePreferences}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recentHistory}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_history.slice(0, 8).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 text-xs text-gray-600">
                <span className="truncate">{item.title}</span>
                <span className="shrink-0 capitalize">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {(dashboard.principles?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles!.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
