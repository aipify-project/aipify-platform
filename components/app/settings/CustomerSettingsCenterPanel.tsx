"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AppLanguageSelector,
  coerceClientAppLocale,
  type AppLanguageSelectorLabels,
} from "@/components/app/AppLanguageSelector";
import type { AppLocale } from "@/lib/i18n/app-locales";
import { COMMON_TIMEZONES, getBrowserTimezone } from "@/lib/core/greeting";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import { PRESENCE_NOTIFICATION_LEVELS } from "@/lib/presence/notifications";
import { createClient } from "@/lib/supabase/client";

type SettingsCategory = {
  id: string;
  title: string;
  description: string;
  links: Array<{ href: string; label: string }>;
};

type CustomerSettingsCenterPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    sections: {
      notifications: string;
      quietHours: string;
      timezone: string;
      language: string;
    };
    timezoneHint: string;
    languageHint: string;
    quietModes: Record<QuietHoursMode, string>;
    levels: Record<PresenceNotificationLevel, string>;
    save: string;
    saved: string;
    categories: SettingsCategory[];
  };
  currentLocale: AppLocale;
  languageSelectorLabels: AppLanguageSelectorLabels;
};

export function CustomerSettingsCenterPanel({
  labels,
  currentLocale,
  languageSelectorLabels,
}: CustomerSettingsCenterPanelProps) {
  const [quietMode, setQuietMode] = useState<QuietHoursMode>("standard");
  const [timezone, setTimezone] = useState("UTC");
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const res = await fetch("/api/presence/preferences");
    if (res.ok) {
      const data = await res.json();
      const prefs = data.preferences as Record<string, unknown> | undefined;
      setQuietMode((prefs?.quiet_hours_mode as QuietHoursMode) ?? "standard");
      setTimezone(String(prefs?.timezone ?? getBrowserTimezone()));
    } else {
      const payload = (await res.json()) as { error?: string };
      setLoadError(typeof payload.error === "string" ? payload.error : "Failed to load settings");
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
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-gray-600">{labels.subtitle}</p>
        {loadError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {loadError}
          </p>
        ) : null}
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {labels.categories.map((category) => (
          <article
            key={category.id}
            className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">{category.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{category.description}</p>
            <ul className="mt-6 space-y-2">
              {category.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-violet-700 transition hover:text-violet-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.language}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.languageHint}</p>
        <div className="mt-4">
          <AppLanguageSelector
            currentLocale={coerceClientAppLocale(currentLocale)}
            labels={languageSelectorLabels}
            variant="settings"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.timezone}</h2>
        <p className="mt-1 text-sm text-gray-500">{labels.timezoneHint}</p>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="mt-4 w-full max-w-md rounded-xl border border-gray-200 px-4 py-3 text-sm"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.quietHours}</h2>
        <select
          value={quietMode}
          onChange={(e) => setQuietMode(e.target.value as QuietHoursMode)}
          className="mt-4 w-full max-w-md rounded-xl border border-gray-200 px-4 py-3 text-sm"
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
          className="mt-4 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
        >
          {saved ? labels.saved : labels.save}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.notifications}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {PRESENCE_NOTIFICATION_LEVELS.map((level) => (
            <li key={level}>{labels.levels[level]}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
