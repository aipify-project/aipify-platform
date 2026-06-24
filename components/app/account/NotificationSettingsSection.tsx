"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
  Volume2,
} from "lucide-react";
import { NotificationPreferenceToggleCard } from "@/components/app/account/NotificationPreferenceToggleCard";
import type { NotificationSettingsPageLabels } from "@/lib/app/notifications/labels";
import {
  fetchNotificationPreferences,
  resolvePreferencesLoadErrorMessage,
  type NotificationPreferencesLoadError,
} from "@/lib/app/notifications/load-notification-preferences";
import {
  applyToggleChange,
  formatQuietHoursRange,
  notificationPrefsToToggleState,
  toggleStateToPreferencesPatch,
  type NotificationSettingsToggleKey,
  type NotificationSettingsToggleState,
} from "@/lib/app/notifications/preferences-ui";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { notificationSoundStatusKind } from "@/lib/presence/notification-sound-settings-labels";
import {
  resolveNotificationSoundStatus,
  runNotificationSoundTestAsync,
  type NotificationSoundTestResult,
} from "@/lib/presence/notification-sound-settings";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";
import {
  getNotificationAudioContextState,
  primeSoftBellAudio,
} from "@/lib/presence/unified-notification-feed/sound-policy";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";

type SaveState = "idle" | "saving" | "saved" | "error";

type NotificationSettingsSectionProps = {
  labels: NotificationSettingsPageLabels;
  organizationKey: string | null;
  organizationName?: string | null;
  organizationReady: boolean;
  sharedPreferences?: PresenceNotificationPreferences | null;
  onPreferencesSaved?: (preferences: PresenceNotificationPreferences) => void;
  onRefreshSharedPreferences?: () => Promise<void>;
};

const PREFS_RETRY_MS = 900;
const PREFS_MAX_RETRIES = 8;

function draftToEffective(
  state: NotificationSettingsToggleState,
  base: PresenceNotificationPreferences | null,
): PresenceNotificationPreferences | null {
  if (!base) return null;
  const patch = toggleStateToPreferencesPatch(state);
  return {
    ...base,
    channel_in_app: patch.channel_in_app as boolean,
    sound_enabled: patch.sound_enabled as boolean,
    companion_replies_enabled: patch.companion_replies_enabled as boolean,
    approvals_critical_enabled: patch.approvals_critical_enabled as boolean,
    playful_moments_enabled: patch.playful_moments_enabled as boolean,
    quiet_hours_enabled: patch.quiet_hours_enabled as boolean,
    working_hours_start: String(patch.working_hours_start),
    working_hours_end: String(patch.working_hours_end),
  };
}

function logNotificationSettingsDiagnostic(
  event: string,
  payload: Record<string, string | number | boolean | null>,
): void {
  if (process.env.NODE_ENV === "production") return;
  console.info("[aipify:notification-settings]", event, payload);
}

export function NotificationSettingsSection({
  labels,
  organizationKey,
  organizationName = null,
  organizationReady,
  sharedPreferences = null,
  onPreferencesSaved,
  onRefreshSharedPreferences,
}: NotificationSettingsSectionProps) {
  const [basePreferences, setBasePreferences] = useState<PresenceNotificationPreferences | null>(
    sharedPreferences,
  );
  const [draft, setDraft] = useState<NotificationSettingsToggleState | null>(
    sharedPreferences ? notificationPrefsToToggleState(sharedPreferences) : null,
  );
  const [loading, setLoading] = useState(!sharedPreferences);
  const [loadError, setLoadError] = useState<NotificationPreferencesLoadError | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [testResult, setTestResult] = useState<NotificationSoundTestResult | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const savedTimerRef = useRef<number | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);

  const applyLoadedPreferences = useCallback((parsed: PresenceNotificationPreferences) => {
    setBasePreferences(parsed);
    setDraft(notificationPrefsToToggleState(parsed));
    setLoadError(null);
    retryCountRef.current = 0;
  }, []);

  const loadPreferences = useCallback(async () => {
    if (!organizationKey || !organizationReady) return;
    setLoading(true);
    setLoadError(null);
    try {
      const result = await fetchNotificationPreferences();
      if (result.preferences) {
        applyLoadedPreferences(result.preferences);
        logNotificationSettingsDiagnostic("preferences_loaded", {
          organizationKey,
          soundEnabled: result.preferences.sound_enabled,
          playfulMomentsEnabled: result.preferences.playful_moments_enabled,
          quietHoursEnabled: result.preferences.quiet_hours_enabled,
        });
        return;
      }
      setLoadError(result.error ?? "page_load_error");
      setBasePreferences(null);
      setDraft(null);
    } finally {
      setLoading(false);
    }
  }, [applyLoadedPreferences, organizationKey, organizationReady]);

  useEffect(() => {
    if (sharedPreferences) {
      applyLoadedPreferences(sharedPreferences);
      setLoading(false);
    }
  }, [applyLoadedPreferences, sharedPreferences]);

  useEffect(() => {
    if (!organizationKey || !organizationReady) return;
    if (sharedPreferences) return;
    void loadPreferences();
  }, [organizationKey, organizationReady, loadPreferences, sharedPreferences]);

  useEffect(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    if (!organizationReady || !organizationKey || loading || !loadError) {
      return;
    }

    if (retryCountRef.current >= PREFS_MAX_RETRIES) {
      return;
    }

    retryTimerRef.current = window.setTimeout(() => {
      retryCountRef.current += 1;
      void loadPreferences();
    }, PREFS_RETRY_MS);

    return () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [loadError, loadPreferences, loading, organizationKey, organizationReady]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
    };
  }, []);

  const effectivePreferences = useMemo(
    () => (draft ? draftToEffective(draft, basePreferences) : null),
    [basePreferences, draft],
  );

  const soundStatus = resolveNotificationSoundStatus(effectivePreferences);

  const persistDraft = useCallback(
    async (nextDraft: NotificationSettingsToggleState) => {
      if (!basePreferences) return;
      setSaveState("saving");
      setTestResult(null);
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);

      try {
        const res = await fetch("/api/presence/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toggleStateToPreferencesPatch(nextDraft)),
        });
        if (!res.ok) throw new Error("save_failed");
        const parsed = parsePresenceNotificationPreferences(await res.json());
        if (!parsed) throw new Error("missing_preferences");
        applyLoadedPreferences(parsed);
        setSaveState("saved");
        onPreferencesSaved?.(parsed);
        savedTimerRef.current = window.setTimeout(() => {
          setSaveState("idle");
        }, 2400);
      } catch {
        setSaveState("error");
      }
    },
    [applyLoadedPreferences, basePreferences, onPreferencesSaved],
  );

  const queuePersist = useCallback(
    (nextDraft: NotificationSettingsToggleState) => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => {
        void persistDraft(nextDraft);
      }, 350);
    },
    [persistDraft],
  );

  const updateToggle = useCallback(
    (key: NotificationSettingsToggleKey, value: boolean) => {
      setDraft((current) => {
        if (!current) return current;
        const next = applyToggleChange(current, key, value);
        queuePersist(next);
        return next;
      });
    },
    [queuePersist],
  );

  const updateQuietHoursField = useCallback(
    (field: "quietHoursStart" | "quietHoursEnd", value: string) => {
      setDraft((current) => {
        if (!current) return current;
        const next = { ...current, [field]: value };
        queuePersist(next);
        return next;
      });
    },
    [queuePersist],
  );

  function handleTestSound() {
    if (!effectivePreferences) return;
    primeSoftBellAudio();
    const audioState = getNotificationAudioContextState();
    logNotificationSettingsDiagnostic("test_sound_requested", {
      organizationKey,
      organizationName,
      soundEnabled: effectivePreferences.sound_enabled,
      playfulMomentsEnabled: effectivePreferences.playful_moments_enabled,
      quietHoursEnabled: effectivePreferences.quiet_hours_enabled,
      audioContextState: audioState.state,
      audioPrimed: audioState.primed,
    });
    void runNotificationSoundTestAsync(effectivePreferences).then((result) => {
      setTestResult(result);
      logNotificationSettingsDiagnostic("test_sound_result", {
        organizationKey,
        result,
        audioContextState: getNotificationAudioContextState().state,
      });
    });
  }

  async function handleRetry() {
    retryCountRef.current = 0;
    await onRefreshSharedPreferences?.();
    await loadPreferences();
  }

  if (loading) {
    return (
      <section
        id="notification-sound-settings"
        className="flex min-h-[320px] items-center justify-center rounded-xl border border-aipify-border bg-white p-5 shadow-sm"
        aria-busy="true"
      >
        <AipifyLoader centered />
      </section>
    );
  }

  if (loadError || !draft) {
    const message = loadError
      ? resolvePreferencesLoadErrorMessage(loadError, labels.contextGate)
      : labels.contextGate.pageLoadError;

    return (
      <PlatformEmptyState
        title={labels.contextGate.pageLoadError}
        message={message}
        primaryAction={{
          label: labels.contextGate.retry,
          onClick: () => {
            void handleRetry();
          },
        }}
      />
    );
  }

  const quietHoursActiveLabel = draft.quietHoursEnabled
    ? labels.toggles.quietHours.activeRange.replace(
        "{range}",
        formatQuietHoursRange(draft.quietHoursStart, draft.quietHoursEnd),
      )
    : null;

  return (
    <section id="notification-sound-settings" className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-aipify-text">{labels.settingsSectionTitle}</h2>
        <p className="text-sm text-aipify-text-secondary">{labels.settingsSectionDescription}</p>
        {organizationName ? (
          <p className="text-xs font-medium text-aipify-text-secondary">
            {labels.activeOrganization.replace("{name}", organizationName)}
          </p>
        ) : null}
        <p className="text-xs text-aipify-text-muted">{labels.browserHint}</p>
        {saveState === "saving" ? (
          <p className="text-sm text-aipify-text-secondary">{labels.saving}</p>
        ) : null}
        {saveState === "saved" ? (
          <p className="text-sm text-emerald-800">{labels.saved}</p>
        ) : null}
        {saveState === "error" ? (
          <p className="text-sm text-rose-800">{labels.saveError}</p>
        ) : null}
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <NotificationPreferenceToggleCard
          icon={<BellRing className="h-5 w-5" aria-hidden="true" />}
          title={labels.toggles.inAppEnabled.title}
          description={labels.toggles.inAppEnabled.description}
          enabled={draft.inAppEnabled}
          onLabel={labels.onLabel}
          offLabel={labels.offLabel}
          onToggle={(value) => updateToggle("inAppEnabled", value)}
        />
        <NotificationPreferenceToggleCard
          icon={<Volume2 className="h-5 w-5" aria-hidden="true" />}
          title={labels.toggles.soundEnabled.title}
          description={labels.toggles.soundEnabled.description}
          enabled={draft.soundEnabled}
          onLabel={labels.onLabel}
          offLabel={labels.offLabel}
          disabled={!draft.inAppEnabled}
          onToggle={(value) => updateToggle("soundEnabled", value)}
        />
        <NotificationPreferenceToggleCard
          icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
          title={labels.toggles.playfulMoments.title}
          description={labels.toggles.playfulMoments.description}
          enabled={draft.playfulMomentsEnabled}
          onLabel={labels.onLabel}
          offLabel={labels.offLabel}
          onToggle={(value) => updateToggle("playfulMomentsEnabled", value)}
        />
        <NotificationPreferenceToggleCard
          icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
          title={labels.toggles.companionReplies.title}
          description={labels.toggles.companionReplies.description}
          enabled={draft.companionRepliesEnabled}
          onLabel={labels.onLabel}
          offLabel={labels.offLabel}
          disabled={!draft.inAppEnabled}
          onToggle={(value) => updateToggle("companionRepliesEnabled", value)}
        />
        <NotificationPreferenceToggleCard
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
          title={labels.toggles.approvalsCritical.title}
          description={labels.toggles.approvalsCritical.description}
          enabled={draft.approvalsCriticalEnabled}
          onLabel={labels.onLabel}
          offLabel={labels.offLabel}
          disabled={!draft.inAppEnabled}
          onToggle={(value) => updateToggle("approvalsCriticalEnabled", value)}
        />
        <NotificationPreferenceToggleCard
          icon={<Clock className="h-5 w-5" aria-hidden="true" />}
          title={labels.toggles.quietHours.title}
          description={labels.toggles.quietHours.description}
          enabled={draft.quietHoursEnabled}
          onLabel={labels.onLabel}
          offLabel={labels.offLabel}
          onToggle={(value) => updateToggle("quietHoursEnabled", value)}
          footer={
            <div className="space-y-3">
              {quietHoursActiveLabel ? (
                <p className="text-xs font-medium text-aipify-text-secondary">{quietHoursActiveLabel}</p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs text-aipify-text">
                  <span className="mb-1 block font-medium">{labels.quietHoursStart}</span>
                  <input
                    type="time"
                    value={draft.quietHoursStart}
                    disabled={!draft.quietHoursEnabled}
                    onChange={(event) => updateQuietHoursField("quietHoursStart", event.target.value)}
                    className="w-full rounded-lg border border-aipify-border px-3 py-2 text-sm disabled:opacity-50"
                  />
                </label>
                <label className="block text-xs text-aipify-text">
                  <span className="mb-1 block font-medium">{labels.quietHoursEnd}</span>
                  <input
                    type="time"
                    value={draft.quietHoursEnd}
                    disabled={!draft.quietHoursEnabled}
                    onChange={(event) => updateQuietHoursField("quietHoursEnd", event.target.value)}
                    className="w-full rounded-lg border border-aipify-border px-3 py-2 text-sm disabled:opacity-50"
                  />
                </label>
              </div>
            </div>
          }
        />
        <article className="flex h-full flex-col rounded-xl border border-aipify-border bg-white p-4 shadow-sm md:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aipify-surface-muted text-aipify-companion"
                aria-hidden="true"
              >
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-aipify-text">{labels.toggles.testSound.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-aipify-text-secondary">
                  {labels.toggles.testSound.description}
                </p>
                <div className="mt-2">
                  <AipifyStatusBadge
                    kind={notificationSoundStatusKind(soundStatus)}
                    label={labels.soundLabels.status[soundStatus]}
                  />
                </div>
                {testResult ? (
                  <p className="mt-2 text-xs text-aipify-text-secondary">
                    {labels.soundLabels.testResult[testResult]}
                  </p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={handleTestSound}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-aipify-border bg-white px-5 py-2.5 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted"
            >
              {labels.toggles.testSound.title}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
