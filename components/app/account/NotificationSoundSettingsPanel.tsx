"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import {
  notificationSoundStatusKind,
  type NotificationSoundSettingsLabels,
} from "@/lib/presence/notification-sound-settings-labels";
import {
  resolveNotificationSoundStatus,
  runNotificationSoundTest,
  runNotificationSoundTestAsync,
  type NotificationSoundTestResult,
} from "@/lib/presence/notification-sound-settings";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";
import { primeSoftBellAudio } from "@/lib/presence/unified-notification-feed/sound-policy";

type NotificationSoundSettingsPanelProps = {
  labels: NotificationSoundSettingsLabels;
  initialPreferences?: PresenceNotificationPreferences | null;
  onPreferencesSaved?: (preferences: PresenceNotificationPreferences) => void;
};

type DraftPreferences = {
  channel_in_app: boolean;
  playful_moments_enabled: boolean;
  quiet_hours_enabled: boolean;
  working_hours_start: string;
  working_hours_end: string;
};

function toDraft(prefs: PresenceNotificationPreferences): DraftPreferences {
  return {
    channel_in_app: prefs.channel_in_app,
    playful_moments_enabled: prefs.playful_moments_enabled,
    quiet_hours_enabled: prefs.quiet_hours_enabled,
    working_hours_start: prefs.working_hours_start.slice(0, 5),
    working_hours_end: prefs.working_hours_end.slice(0, 5),
  };
}

function draftToEffective(
  draft: DraftPreferences,
  base: PresenceNotificationPreferences | null,
): PresenceNotificationPreferences {
  return {
    mode: base?.mode ?? "standard",
    working_hours_start: draft.working_hours_start,
    working_hours_end: draft.working_hours_end,
    timezone: base?.timezone ?? "UTC",
    vacation_until: base?.vacation_until ?? null,
    quiet_hours_enabled: draft.quiet_hours_enabled,
    channel_in_app: draft.channel_in_app,
    channel_desktop: base?.channel_desktop ?? true,
    channel_email_digest: base?.channel_email_digest ?? false,
    channel_mobile_push: base?.channel_mobile_push ?? false,
    min_level_in_app: base?.min_level_in_app ?? "informational",
    min_level_desktop: base?.min_level_desktop ?? "important",
    min_level_email: base?.min_level_email ?? "important",
    playful_moments_enabled: draft.playful_moments_enabled,
    sound_enabled: base?.sound_enabled ?? true,
    companion_replies_enabled: base?.companion_replies_enabled ?? true,
    approvals_critical_enabled: base?.approvals_critical_enabled ?? true,
  };
}

export function NotificationSoundSettingsPanel({
  labels,
  initialPreferences = null,
  onPreferencesSaved,
}: NotificationSoundSettingsPanelProps) {
  const [basePreferences, setBasePreferences] = useState<PresenceNotificationPreferences | null>(
    initialPreferences,
  );
  const [draft, setDraft] = useState<DraftPreferences | null>(
    initialPreferences ? toDraft(initialPreferences) : null,
  );
  const [loading, setLoading] = useState(!initialPreferences);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [testResult, setTestResult] = useState<NotificationSoundTestResult | null>(null);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/presence/preferences", { cache: "no-store" });
      if (!res.ok) throw new Error("load_failed");
      const parsed = parsePresenceNotificationPreferences(await res.json());
      if (!parsed) throw new Error("missing_preferences");
      setBasePreferences(parsed);
      setDraft(toDraft(parsed));
    } catch {
      setSaveState("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialPreferences) {
      void loadPreferences();
      return;
    }
    setBasePreferences(initialPreferences);
    setDraft(toDraft(initialPreferences));
    setLoading(false);
  }, [initialPreferences, loadPreferences]);

  const effectivePreferences = useMemo(
    () => (draft ? draftToEffective(draft, basePreferences) : null),
    [basePreferences, draft],
  );

  const soundStatus = resolveNotificationSoundStatus(effectivePreferences);

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    setSaveState("idle");
    setTestResult(null);
    try {
      const res = await fetch("/api/presence/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_in_app: draft.channel_in_app,
          playful_moments_enabled: draft.playful_moments_enabled,
          quiet_hours_enabled: draft.quiet_hours_enabled,
          working_hours_start: draft.working_hours_start,
          working_hours_end: draft.working_hours_end,
        }),
      });
      if (!res.ok) throw new Error("save_failed");
      const parsed = parsePresenceNotificationPreferences(await res.json());
      if (!parsed) throw new Error("missing_preferences");
      setBasePreferences(parsed);
      setDraft(toDraft(parsed));
      setSaveState("saved");
      onPreferencesSaved?.(parsed);
    } catch {
      setSaveState("error");
    } finally {
      setSaving(false);
    }
  }

  function handleTestSound() {
    if (!effectivePreferences) return;
    primeSoftBellAudio();
    void runNotificationSoundTestAsync(effectivePreferences).then(setTestResult);
  }

  if (loading || !draft) {
    return (
      <section
        className="rounded-2xl border border-aipify-border bg-white p-6 shadow-sm"
        aria-busy="true"
      />
    );
  }

  return (
    <section className="rounded-2xl border border-aipify-border bg-white p-6 shadow-sm">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-aipify-text">{labels.sectionTitle}</h2>
        <p className="text-sm text-aipify-text-secondary">{labels.sectionDescription}</p>
        <p className="text-xs text-aipify-text-muted">{labels.browserHint}</p>
      </header>

      <div className="mt-4 rounded-xl border border-aipify-border bg-aipify-surface-muted/40 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
          {labels.statusTitle}
        </p>
        <div className="mt-2">
          <AipifyStatusBadge
            kind={notificationSoundStatusKind(soundStatus)}
            label={labels.status[soundStatus]}
          />
        </div>
        {testResult ? (
          <p className="mt-2 text-xs text-aipify-text-secondary">{labels.testResult[testResult]}</p>
        ) : null}
      </div>

      <div className="mt-6 space-y-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-aipify-border text-aipify-companion"
            checked={draft.channel_in_app}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, channel_in_app: event.target.checked } : current,
              )
            }
          />
          <span>
            <span className="block text-sm font-medium text-aipify-text">{labels.soundEnabled}</span>
            <span className="mt-1 block text-xs text-aipify-text-secondary">
              {labels.soundEnabledHint}
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-aipify-border text-aipify-companion"
            checked={draft.playful_moments_enabled}
            onChange={(event) =>
              setDraft((current) =>
                current ? { ...current, playful_moments_enabled: event.target.checked } : current,
              )
            }
          />
          <span>
            <span className="block text-sm font-medium text-aipify-text">{labels.playfulMoments}</span>
            <span className="mt-1 block text-xs text-aipify-text-secondary">
              {labels.playfulMomentsHint}
            </span>
          </span>
        </label>

        <div className="space-y-3 rounded-xl border border-aipify-border px-4 py-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-aipify-border text-aipify-companion"
              checked={draft.quiet_hours_enabled}
              onChange={(event) =>
                setDraft((current) =>
                  current ? { ...current, quiet_hours_enabled: event.target.checked } : current,
                )
              }
            />
            <span>
              <span className="block text-sm font-medium text-aipify-text">
                {labels.quietHoursEnabled}
              </span>
              <span className="mt-1 block text-xs text-aipify-text-secondary">
                {labels.quietHoursEnabledHint}
              </span>
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-aipify-text">
              <span className="mb-1 block font-medium">{labels.quietHoursStart}</span>
              <input
                type="time"
                value={draft.working_hours_start}
                disabled={!draft.quiet_hours_enabled}
                onChange={(event) =>
                  setDraft((current) =>
                    current ? { ...current, working_hours_start: event.target.value } : current,
                  )
                }
                className="w-full rounded-lg border border-aipify-border px-3 py-2 text-sm disabled:opacity-50"
              />
            </label>
            <label className="block text-sm text-aipify-text">
              <span className="mb-1 block font-medium">{labels.quietHoursEnd}</span>
              <input
                type="time"
                value={draft.working_hours_end}
                disabled={!draft.quiet_hours_enabled}
                onChange={(event) =>
                  setDraft((current) =>
                    current ? { ...current, working_hours_end: event.target.value } : current,
                  )
                }
                className="w-full rounded-lg border border-aipify-border px-3 py-2 text-sm disabled:opacity-50"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-aipify-companion px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
          {saving ? labels.saving : labels.save}
        </button>
        <button
          type="button"
          onClick={handleTestSound}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-aipify-border bg-white px-5 py-2.5 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted"
        >
          {labels.testSound}
        </button>
        <p className="text-xs text-aipify-text-muted sm:ml-1">{labels.testSoundHint}</p>
      </div>

      {saveState === "saved" ? (
        <p className="mt-3 text-sm text-emerald-800">{labels.saved}</p>
      ) : null}
      {saveState === "error" ? (
        <p className="mt-3 text-sm text-rose-800">{labels.saveError}</p>
      ) : null}
    </section>
  );
}
