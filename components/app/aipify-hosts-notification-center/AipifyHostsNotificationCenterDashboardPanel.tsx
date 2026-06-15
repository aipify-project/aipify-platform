"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsNotificationCenterActionResult,
  parseAipifyHostsNotificationCenterDashboard,
  type HostsNotificationCenterDashboard,
  type HostsNotificationCenterSectionKey,
  type HostsNotificationPreferences,
  type HostsNotificationRow,
} from "@/lib/aipify/aipify-hosts-notification-center";

type Props = { labels: Record<string, string> };

function priorityBadge(priority: string): string {
  const map: Record<string, string> = {
    informational: "bg-gray-100 text-gray-700 ring-gray-200",
    important: "bg-sky-50 text-sky-800 ring-sky-200",
    high: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[priority] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    unread: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    read: "bg-gray-100 text-gray-700 ring-gray-200",
    archived: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function NotificationTable({
  rows,
  labels,
  busy,
  onMarkRead,
  onArchive,
  onAcknowledge,
  showAcknowledge,
}: {
  rows: HostsNotificationRow[];
  labels: Record<string, string>;
  busy: boolean;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onAcknowledge: (id: string) => void;
  showAcknowledge?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <EmptyBoard
        title={showAcknowledge ? labels.emptyCriticalTitle : labels.emptyNotificationsTitle}
        message={showAcknowledge ? labels.emptyCriticalMessage : labels.emptyNotificationsMessage}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.priority}</th>
            <th className="px-4 py-3">{labels.message}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.when}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-gray-100 ${row.requires_attention && !row.acknowledged ? "bg-amber-50/40" : ""}`}
            >
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "cat", row.category)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${priorityBadge(row.priority)}`}>
                  {labelFor(labels, "priority", row.priority)}
                </span>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{row.title}</p>
                <p className="mt-0.5 text-gray-600">{row.message}</p>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "status", row.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.created_at ? new Date(row.created_at).toLocaleString() : "—"}</td>
              <td className="px-4 py-3 space-x-2">
                {row.status === "unread" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onMarkRead(row.id)}
                    className="text-xs font-medium text-indigo-700 hover:text-indigo-900 disabled:opacity-60"
                  >
                    {labels.markRead}
                  </button>
                )}
                {row.status !== "archived" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onArchive(row.id)}
                    className="text-xs font-medium text-gray-700 hover:text-gray-900 disabled:opacity-60"
                  >
                    {labels.archive}
                  </button>
                )}
                {showAcknowledge && row.requires_attention && !row.acknowledged && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onAcknowledge(row.id)}
                    className="text-xs font-medium text-red-700 hover:text-red-900 disabled:opacity-60"
                  >
                    {labels.acknowledge}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreferencesForm({
  prefs,
  labels,
  busy,
  onSave,
}: {
  prefs: HostsNotificationPreferences;
  labels: Record<string, string>;
  busy: boolean;
  onSave: (next: HostsNotificationPreferences) => void;
}) {
  const [local, setLocal] = useState(prefs);

  useEffect(() => {
    setLocal(prefs);
  }, [prefs]);

  const toggle = (key: keyof HostsNotificationPreferences) => {
    if (typeof local[key] === "boolean") {
      setLocal({ ...local, [key]: !local[key] });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{labels.settingsTitle}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["channel_in_app", labels.channelInApp],
            ["channel_email", labels.channelEmail],
            ["channel_push", labels.channelPush],
            ["quiet_hours_enabled", labels.quietHours],
            ["escalate_critical_to_owner", labels.escalateOwner],
            ["escalate_critical_to_property_manager", labels.escalatePropertyManager],
            ["repeat_critical_alerts", labels.repeatCritical],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={Boolean(local[key])}
              onChange={() => toggle(key)}
              className="rounded border-gray-300"
            />
            {label}
          </label>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{labels.minPriority}</label>
        <select
          value={local.min_priority}
          onChange={(e) => setLocal({ ...local, min_priority: e.target.value })}
          className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {["informational", "important", "high", "critical"].map((p) => (
            <option key={p} value={p}>
              {labelFor(labels, "priority", p)}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => onSave(local)}
        className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {labels.savePreferences}
      </button>
    </div>
  );
}

export function AipifyHostsNotificationCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsNotificationCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsNotificationCenterSectionKey>("all_notifications");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    const res = await fetch(`/api/aipify/aipify-hosts/notification-center/dashboard?${params.toString()}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsNotificationCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/notification-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsNotificationCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const notificationRows =
    activeSection === "all_notifications"
      ? dashboard.all_notifications
      : activeSection === "critical_alerts"
        ? dashboard.critical_alerts
        : activeSection === "operational_updates"
          ? dashboard.operational_updates
          : activeSection === "guest_activity"
            ? dashboard.guest_activity
            : activeSection === "team_activity"
              ? dashboard.team_activity
              : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-indigo-900">{labels.governanceNote}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-3">
        <MetricCard label={labels.unreadCount} value={dashboard.stats.unread_count} />
        <MetricCard label={labels.criticalAlerts} value={dashboard.stats.critical_alerts} />
        <MetricCard label={labels.requiresAttention} value={dashboard.stats.requires_attention} />
      </dl>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsNotificationCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "notification_settings" ? (
        <PreferencesForm
          prefs={dashboard.preferences}
          labels={labels}
          busy={busy}
          onSave={(next) =>
            void runAction({
              action: "update_preferences",
              preferences: {
                channel_in_app: next.channel_in_app,
                channel_email: next.channel_email,
                channel_push: next.channel_push,
                quiet_hours_enabled: next.quiet_hours_enabled,
                min_priority: next.min_priority,
                escalate_critical_to_owner: next.escalate_critical_to_owner,
                escalate_critical_to_property_manager: next.escalate_critical_to_property_manager,
                repeat_critical_alerts: next.repeat_critical_alerts,
              },
            })
          }
        />
      ) : (
        <NotificationTable
          rows={notificationRows}
          labels={labels}
          busy={busy}
          showAcknowledge={activeSection === "critical_alerts"}
          onMarkRead={(id) => void runAction({ action: "update_status", notification_id: id, status: "read" })}
          onArchive={(id) => void runAction({ action: "update_status", notification_id: id, status: "archived" })}
          onAcknowledge={(id) => void runAction({ action: "acknowledge_critical", notification_id: id })}
        />
      )}

      {activeSection !== "notification_settings" && dashboard.recent_activity.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">{labels.recentActivity}</h2>
          <NotificationTable
            rows={dashboard.recent_activity.slice(0, 5)}
            labels={labels}
            busy={busy}
            onMarkRead={(id) => void runAction({ action: "update_status", notification_id: id, status: "read" })}
            onArchive={(id) => void runAction({ action: "update_status", notification_id: id, status: "archived" })}
            onAcknowledge={(id) => void runAction({ action: "acknowledge_critical", notification_id: id })}
          />
        </section>
      )}
    </div>
  );
}
