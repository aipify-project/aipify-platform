import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import type { QuietHoursMode } from "@/lib/presence/quiet-hours";

export function parsePresenceNotificationPreferences(
  data: unknown,
): PresenceNotificationPreferences | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.has_customer === false) return null;

  const prefsRaw = record.preferences;
  if (!prefsRaw || typeof prefsRaw !== "object") return null;
  const prefs = prefsRaw as Record<string, unknown>;

  return {
    mode: (prefs.quiet_hours_mode as QuietHoursMode) ?? "standard",
    working_hours_start: String(prefs.working_hours_start ?? "09:00"),
    working_hours_end: String(prefs.working_hours_end ?? "17:00"),
    timezone: String(prefs.timezone ?? "UTC"),
    vacation_until: typeof prefs.vacation_until === "string" ? prefs.vacation_until : null,
    quiet_hours_enabled: prefs.quiet_hours_enabled === true,
    channel_in_app: prefs.channel_in_app !== false,
    channel_desktop: prefs.channel_desktop !== false,
    channel_email_digest: prefs.channel_email_digest === true,
    channel_mobile_push: prefs.channel_mobile_push === true,
    min_level_in_app: (prefs.min_level_in_app as PresenceNotificationLevel) ?? "informational",
    min_level_desktop: (prefs.min_level_desktop as PresenceNotificationLevel) ?? "important",
    min_level_email: (prefs.min_level_email as PresenceNotificationLevel) ?? "important",
    playful_moments_enabled: prefs.playful_moments_enabled !== false,
  };
}
