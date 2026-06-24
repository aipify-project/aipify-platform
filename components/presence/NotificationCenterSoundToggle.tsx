"use client";

import { useCallback, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";
import type { UnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed/labels";

type NotificationCenterSoundToggleProps = {
  labels: UnifiedNotificationCenterLabels;
};

export function NotificationCenterSoundToggle({ labels }: NotificationCenterSoundToggleProps) {
  const feed = useUnifiedNotificationFeed();
  const [saving, setSaving] = useState(false);

  const soundEnabled =
    feed.preferences?.channel_in_app !== false && feed.preferences?.sound_enabled !== false;
  const disabled = saving || !feed.preferences;

  const toggleSound = useCallback(async () => {
    if (!feed.preferences || saving) return;
    const nextEnabled = !soundEnabled;
    setSaving(true);
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
    } catch {
      // Keep current UI state — user can retry from settings.
    } finally {
      setSaving(false);
    }
  }, [feed, saving, soundEnabled]);

  return (
    <button
      type="button"
      onClick={() => void toggleSound()}
      disabled={disabled}
      className="mt-3 inline-flex min-h-[36px] w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      aria-pressed={soundEnabled}
      aria-label={`${labels.soundToggleLabel}: ${soundEnabled ? labels.soundOn : labels.soundOff}`}
    >
      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
        {soundEnabled ? (
          <Volume2 className="h-4 w-4 text-aipify-companion" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4 w-4 text-gray-500" aria-hidden="true" />
        )}
        {labels.soundToggleLabel}
      </span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          soundEnabled ? "bg-violet-100 text-violet-800" : "bg-gray-200 text-gray-700"
        }`}
      >
        {soundEnabled ? labels.soundOn : labels.soundOff}
      </span>
    </button>
  );
}
