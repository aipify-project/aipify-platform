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
  return `${start.slice(0, 5)}–${end.slice(0, 5)}`;
}
