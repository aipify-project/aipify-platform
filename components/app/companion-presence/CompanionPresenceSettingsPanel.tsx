"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type CompanionPresenceSettingsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacyTitle: string;
    privacyNote: string;
    orgSection: string;
    indicatorEnabled: string;
    heartbeatInterval: string;
    showSinceLastLogin: string;
    showTaskCounts: string;
    showApprovalCounts: string;
    showNotificationCounts: string;
    criticalAck: string;
    userSection: string;
    quietMode: string;
    quietModeHint: string;
  };
};

type OrgSettings = {
  indicator_enabled: boolean;
  heartbeat_interval_seconds: number;
  show_since_last_login: boolean;
  show_task_counts: boolean;
  show_approval_counts: boolean;
  show_notification_counts: boolean;
  critical_alert_requires_ack: boolean;
};

export function CompanionPresenceSettingsPanel({
  labels,
}: CompanionPresenceSettingsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const [orgSettings, setOrgSettings] = useState<OrgSettings>({
    indicator_enabled: true,
    heartbeat_interval_seconds: 60,
    show_since_last_login: true,
    show_task_counts: true,
    show_approval_counts: true,
    show_notification_counts: true,
    critical_alert_requires_ack: true,
  });
  const [quietMode, setQuietMode] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/presence/companion/state");
    if (res.ok) {
      const data = await res.json();
      const org = data.org_settings as OrgSettings | undefined;
      if (org) setOrgSettings(org);
      setQuietMode(data.user_preferences?.quiet_mode_enabled ?? false);
      setCanManage(data.has_organization === true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveOrgSettings() {
    await fetch("/api/presence/companion/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_settings: orgSettings }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function saveQuietMode(enabled: boolean) {
    setQuietMode(enabled);
    await fetch("/api/presence/companion/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quiet_mode_enabled: enabled }),
    });
  }

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5">
        <h2 className="text-base font-semibold text-gray-900">{labels.privacyTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.privacyNote}</p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-gray-900">{labels.userSection}</h2>
        <label className="flex items-center gap-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={quietMode}
            onChange={(e) => void saveQuietMode(e.target.checked)}
            className="rounded border-gray-300"
          />
          {labels.quietMode}
        </label>
        <p className="text-xs text-gray-500">{labels.quietModeHint}</p>
      </section>

      {canManage ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900">{labels.orgSection}</h2>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={orgSettings.indicator_enabled}
              onChange={(e) =>
                setOrgSettings((s) => ({ ...s, indicator_enabled: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            {labels.indicatorEnabled}
          </label>
          <label className="block text-sm text-gray-700">
            {labels.heartbeatInterval}
            <input
              type="number"
              min={30}
              max={300}
              value={orgSettings.heartbeat_interval_seconds}
              onChange={(e) =>
                setOrgSettings((s) => ({
                  ...s,
                  heartbeat_interval_seconds: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </label>
          {(
            [
              ["show_since_last_login", labels.showSinceLastLogin],
              ["show_task_counts", labels.showTaskCounts],
              ["show_approval_counts", labels.showApprovalCounts],
              ["show_notification_counts", labels.showNotificationCounts],
              ["critical_alert_requires_ack", labels.criticalAck],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={orgSettings[key]}
                onChange={(e) =>
                  setOrgSettings((s) => ({ ...s, [key]: e.target.checked }))
                }
                className="rounded border-gray-300"
              />
              {label}
            </label>
          ))}
          <button
            type="button"
            onClick={() => void saveOrgSettings()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {saved ? labels.saved : labels.save}
          </button>
        </section>
      ) : null}
    </div>
  );
}
