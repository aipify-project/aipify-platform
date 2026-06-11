"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { COMMON_TIMEZONES, getBrowserTimezone } from "@/lib/core/greeting";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import { PRESENCE_NOTIFICATION_LEVELS } from "@/lib/presence/notifications";
import { createClient } from "@/lib/supabase/client";

type CustomerSettingsCenterPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    sections: {
      notifications: string;
      presence: string;
      quietHours: string;
      executiveBriefing: string;
      desktop: string;
      developer: string;
      updates: string;
      learning: string;
      timezone: string;
    };
    timezoneHint: string;
    quietModes: Record<QuietHoursMode, string>;
    levels: Record<PresenceNotificationLevel, string>;
    save: string;
    saved: string;
    links: {
      developer: string;
      updates: string;
      desktopConnect: string;
      learning: string;
      businessDna: string;
      supportOperations: string;
      employeeKnowledge: string;
    };
  };
};

export function CustomerSettingsCenterPanel({ labels }: CustomerSettingsCenterPanelProps) {
  const [quietMode, setQuietMode] = useState<QuietHoursMode>("standard");
  const [timezone, setTimezone] = useState("UTC");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/presence/preferences");
    if (res.ok) {
      const data = await res.json();
      const prefs = data.preferences as Record<string, unknown> | undefined;
      setQuietMode((prefs?.quiet_hours_mode as QuietHoursMode) ?? "standard");
      setTimezone(String(prefs?.timezone ?? getBrowserTimezone()));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function savePreferences() {
    await fetch("/api/presence/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quiet_hours_mode: quietMode, timezone }),
    });

    const supabase = createClient();
    await supabase.rpc("update_user_timezone", { p_timezone: timezone });

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.timezone}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.timezoneHint}</p>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.quietHours}</h2>
        <select
          value={quietMode}
          onChange={(e) => setQuietMode(e.target.value as QuietHoursMode)}
          className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          {QUIET_HOURS_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {labels.quietModes[mode]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void savePreferences()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {saved ? labels.saved : labels.save}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.notifications}</h2>
        <ul className="mt-3 space-y-1 text-sm text-gray-700">
          {PRESENCE_NOTIFICATION_LEVELS.map((level) => (
            <li key={level}>{labels.levels[level]}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-2 text-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.presence}</h2>
        <Link href="/app/presence" className="block text-indigo-600 hover:underline">
          {labels.sections.executiveBriefing}
        </Link>
        <Link href="/app/command-center/connect" className="block text-indigo-600 hover:underline">
          {labels.links.desktopConnect}
        </Link>
        <Link href="/app/settings/developer" className="block text-indigo-600 hover:underline">
          {labels.links.developer}
        </Link>
        <Link href="/app/settings/updates" className="block text-indigo-600 hover:underline">
          {labels.links.updates}
        </Link>
        <Link href="/app/learning" className="block text-indigo-600 hover:underline">
          {labels.links.learning}
        </Link>
        <Link href="/app/settings/business-dna" className="block text-indigo-600 hover:underline">
          {labels.links.businessDna}
        </Link>
        <Link href="/app/settings/support-operations" className="block text-indigo-600 hover:underline">
          {labels.links.supportOperations}
        </Link>
        <Link href="/app/settings/employee-knowledge" className="block text-indigo-600 hover:underline">
          {labels.links.employeeKnowledge}
        </Link>
      </section>
    </div>
  );
}
