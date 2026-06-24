"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import type { UnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed/labels";

type NotificationCenterSoundToggleProps = {
  labels: UnifiedNotificationCenterLabels;
};

type SaveState = "idle" | "saving" | "saved" | "error";

function resolveSoundEnabled(preferences: PresenceNotificationPreferences): boolean {
  return preferences.channel_in_app !== false && preferences.sound_enabled === true;
}

export function NotificationCenterSoundToggle({ labels }: NotificationCenterSoundToggleProps) {
  const feed = useUnifiedNotificationFeed();
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [optimisticEnabled, setOptimisticEnabled] = useState<boolean | null>(null);
  const savedTimerRef = useRef<number | null>(null);

  const hasPreferences = feed.preferences !== null;
  const serverEnabled = hasPreferences ? resolveSoundEnabled(feed.preferences!) : false;
  const displayEnabled = optimisticEnabled ?? serverEnabled;
  const isLoading = feed.preferencesLoading;
  const loadFailed = feed.preferencesLoadFailed || (!isLoading && !hasPreferences);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (optimisticEnabled === null || !feed.preferences) return;
    if (resolveSoundEnabled(feed.preferences) === optimisticEnabled) {
      setOptimisticEnabled(null);
    }
  }, [feed.preferences, optimisticEnabled]);

  const toggleSound = useCallback(async () => {
    if (!feed.preferences || saveState === "saving" || loadFailed) return;

    const nextEnabled = !displayEnabled;
    setOptimisticEnabled(nextEnabled);
    setSaveState("saving");

    if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);

    try {
      const res = await fetch("/api/presence/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sound_enabled: nextEnabled }),
      });
      if (!res.ok) throw new Error("save_failed");
      const parsed = parsePresenceNotificationPreferences(await res.json());
      if (!parsed) throw new Error("missing_preferences");
      feed.applyPreferences(parsed);
      setOptimisticEnabled(null);
      setSaveState("saved");
      savedTimerRef.current = window.setTimeout(() => {
        setSaveState("idle");
      }, 2400);
    } catch {
      setOptimisticEnabled(null);
      setSaveState("error");
    }
  }, [displayEnabled, feed, loadFailed, saveState]);

  function handleRetry() {
    setSaveState("idle");
    void feed.refreshPreferences();
  }

  if (isLoading) {
    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
        <p className="text-xs text-gray-500">{labels.soundToggleLoading}</p>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="mt-3 space-y-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
        <p className="text-xs text-rose-800">{labels.soundToggleLoadError}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="text-xs font-semibold text-aipify-companion hover:underline"
        >
          {labels.soundToggleRetry}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
          {displayEnabled ? (
            <Volume2 className="h-4 w-4 text-aipify-companion" aria-hidden="true" />
          ) : (
            <VolumeX className="h-4 w-4 text-gray-500" aria-hidden="true" />
          )}
          {labels.soundToggleLabel}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={displayEnabled}
          aria-label={`${labels.soundToggleLabel}: ${displayEnabled ? labels.soundOn : labels.soundOff}`}
          disabled={saveState === "saving"}
          onClick={() => void toggleSound()}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aipify-companion disabled:cursor-not-allowed disabled:opacity-60 ${
            displayEnabled ? "bg-aipify-companion" : "bg-gray-300"
          }`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
              displayEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <p className="text-xs font-medium text-gray-600">
        {displayEnabled ? labels.soundOn : labels.soundOff}
      </p>
      {saveState === "saving" ? (
        <p className="text-xs text-gray-500">{labels.soundToggleSaving}</p>
      ) : null}
      {saveState === "saved" ? (
        <p className="text-xs text-emerald-800">{labels.soundToggleSaved}</p>
      ) : null}
      {saveState === "error" ? (
        <p className="text-xs text-rose-800">{labels.soundToggleSaveError}</p>
      ) : null}
    </div>
  );
}
