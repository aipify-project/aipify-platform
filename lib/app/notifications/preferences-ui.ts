import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import type { NotificationSettingsToggleState } from "@/lib/app/account/notification-preferences-ui";

function formatTimeValue(value: string): string {
  return value.slice(0, 5);
}

export function notificationPrefsToToggleState(
  prefs: PresenceNotificationPreferences,
): NotificationSettingsToggleState {
  return {
    inAppEnabled: prefs.channel_in_app,
    soundEnabled: prefs.channel_in_app ? prefs.sound_enabled : false,
    playfulMomentsEnabled: prefs.playful_moments_enabled,
    companionRepliesEnabled: prefs.companion_replies_enabled,
    approvalsCriticalEnabled: prefs.approvals_critical_enabled,
    quietHoursEnabled: prefs.quiet_hours_enabled,
    quietHoursStart: formatTimeValue(prefs.working_hours_start),
    quietHoursEnd: formatTimeValue(prefs.working_hours_end),
  };
}

export function toggleStateToPreferencesPatch(
  state: NotificationSettingsToggleState,
): Record<string, unknown> {
  return {
    channel_in_app: state.inAppEnabled,
    sound_enabled: state.soundEnabled,
    companion_replies_enabled: state.companionRepliesEnabled,
    approvals_critical_enabled: state.approvalsCriticalEnabled,
    playful_moments_enabled: state.playfulMomentsEnabled,
    quiet_hours_enabled: state.quietHoursEnabled,
    working_hours_start: state.quietHoursStart,
    working_hours_end: state.quietHoursEnd,
  };
}

export { applyToggleChange, formatQuietHoursRange } from "@/lib/app/account/notification-preferences-ui";
export type {
  NotificationSettingsToggleKey,
  NotificationSettingsToggleState,
} from "@/lib/app/account/notification-preferences-ui";
