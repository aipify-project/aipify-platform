import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";

export type NotificationSettingsToggleState = {
  inAppEnabled: boolean;
  soundEnabled: boolean;
  playfulMomentsEnabled: boolean;
  companionRepliesEnabled: boolean;
  approvalsCriticalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
};

export type NotificationSettingsToggleKey = Exclude<
  keyof NotificationSettingsToggleState,
  "quietHoursStart" | "quietHoursEnd"
>;

function formatTimeValue(value: string): string {
  return value.slice(0, 5);
}

function decodeContentLevel(
  level: PresenceNotificationLevel,
): Pick<
  NotificationSettingsToggleState,
  "soundEnabled" | "companionRepliesEnabled" | "approvalsCriticalEnabled"
> {
  if (level === "critical") {
    return {
      soundEnabled: false,
      companionRepliesEnabled: false,
      approvalsCriticalEnabled: false,
    };
  }
  if (level === "action_required") {
    return {
      soundEnabled: true,
      companionRepliesEnabled: true,
      approvalsCriticalEnabled: false,
    };
  }
  if (level === "important") {
    return {
      soundEnabled: true,
      companionRepliesEnabled: false,
      approvalsCriticalEnabled: true,
    };
  }
  return {
    soundEnabled: true,
    companionRepliesEnabled: true,
    approvalsCriticalEnabled: true,
  };
}

function encodeContentLevel(state: NotificationSettingsToggleState): PresenceNotificationLevel {
  if (!state.inAppEnabled) {
    return "informational";
  }
  if (!state.soundEnabled) {
    return "critical";
  }
  if (!state.companionRepliesEnabled && !state.approvalsCriticalEnabled) {
    return "critical";
  }
  if (!state.companionRepliesEnabled) {
    return "important";
  }
  if (!state.approvalsCriticalEnabled) {
    return "action_required";
  }
  return "informational";
}

export function notificationPrefsToToggleState(
  prefs: PresenceNotificationPreferences,
): NotificationSettingsToggleState {
  const content = decodeContentLevel(prefs.min_level_in_app);

  return {
    inAppEnabled: prefs.channel_in_app,
    soundEnabled: prefs.channel_in_app ? content.soundEnabled : false,
    playfulMomentsEnabled: prefs.playful_moments_enabled,
    companionRepliesEnabled: content.companionRepliesEnabled,
    approvalsCriticalEnabled: content.approvalsCriticalEnabled,
    quietHoursEnabled: prefs.quiet_hours_enabled,
    quietHoursStart: formatTimeValue(prefs.working_hours_start),
    quietHoursEnd: formatTimeValue(prefs.working_hours_end),
  };
}

export function toggleStateToPreferencesPatch(
  state: NotificationSettingsToggleState,
  base: PresenceNotificationPreferences | null,
): Record<string, unknown> {
  const minLevel = encodeContentLevel(state);

  return {
    channel_in_app: state.inAppEnabled,
    min_level_in_app: state.inAppEnabled ? minLevel : base?.min_level_in_app ?? minLevel,
    playful_moments_enabled: state.playfulMomentsEnabled,
    quiet_hours_enabled: state.quietHoursEnabled,
    working_hours_start: state.quietHoursStart,
    working_hours_end: state.quietHoursEnd,
  };
}

export function applyToggleChange(
  current: NotificationSettingsToggleState,
  key: NotificationSettingsToggleKey,
  value: boolean,
): NotificationSettingsToggleState {
  const next = { ...current, [key]: value };

  if (key === "inAppEnabled" && !value) {
    next.soundEnabled = false;
  }

  if (key === "inAppEnabled" && value && !next.soundEnabled) {
    next.soundEnabled = true;
    next.companionRepliesEnabled = true;
    next.approvalsCriticalEnabled = true;
  }

  return next;
}

export function formatQuietHoursRange(start: string, end: string): string {
  return `${formatTimeValue(start)}–${formatTimeValue(end)}`;
}
