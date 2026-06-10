import type { PresenceNotificationLevel } from "./notifications";
import { meetsMinimumLevel } from "./notifications";

export const QUIET_HOURS_MODES = [
  "standard",
  "working_hours_only",
  "minimal",
  "vacation",
] as const;

export type QuietHoursMode = (typeof QUIET_HOURS_MODES)[number];

export type QuietHoursPreferences = {
  mode: QuietHoursMode;
  working_hours_start: string;
  working_hours_end: string;
  timezone: string;
  vacation_until: string | null;
};

export function isWithinWorkingHours(
  prefs: QuietHoursPreferences,
  now: Date = new Date()
): boolean {
  const hour = now.getHours();
  const [startH] = prefs.working_hours_start.split(":").map(Number);
  const [endH] = prefs.working_hours_end.split(":").map(Number);
  return hour >= startH && hour < endH;
}

export function isWeekend(now: Date = new Date()): boolean {
  const day = now.getDay();
  return day === 0 || day === 6;
}

export function shouldDeliverNotification(
  level: PresenceNotificationLevel,
  prefs: QuietHoursPreferences,
  now: Date = new Date()
): boolean {
  if (level === "critical") return true;

  if (prefs.mode === "vacation") {
    return meetsMinimumLevel(level, "action_required");
  }

  if (prefs.mode === "minimal") {
    return meetsMinimumLevel(level, "action_required");
  }

  if (prefs.mode === "working_hours_only") {
    if (!isWithinWorkingHours(prefs, now)) {
      return meetsMinimumLevel(level, "important");
    }
    return true;
  }

  // standard — quieter on weekends and after hours
  if (isWeekend(now)) {
    return meetsMinimumLevel(level, "important");
  }
  if (!isWithinWorkingHours(prefs, now)) {
    return meetsMinimumLevel(level, "action_required");
  }
  return true;
}
