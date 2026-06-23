/** Phase 25 — Presence notification architecture (desktop-ready). */

export const PRESENCE_NOTIFICATION_LEVELS = [
  "informational",
  "important",
  "action_required",
  "critical",
] as const;

export type PresenceNotificationLevel = (typeof PRESENCE_NOTIFICATION_LEVELS)[number];

export const PRESENCE_NOTIFICATION_CHANNELS = [
  "in_app",
  "desktop",
  "email_digest",
  "mobile_push",
  "future_integration",
] as const;

export type PresenceNotificationChannel = (typeof PRESENCE_NOTIFICATION_CHANNELS)[number];

export const PRESENCE_EVENT_TYPES = [
  "support_cases_resolved",
  "executive_briefing_ready",
  "installation_completed",
  "payment_issue_detected",
  "subscription_issue_detected",
  "recommendation_generated",
  "approval_awaiting_action",
  "health_warning_detected",
  "update_scheduled",
  "automation_completed",
  "customer_escalation_detected",
  "new_opportunity_identified",
  "companion_reply_ready",
] as const;

export type PresenceEventType = (typeof PRESENCE_EVENT_TYPES)[number];

export const NOTIFICATION_ACTION_TYPES = [
  "view_details",
  "approve",
  "approve_recommendation",
  "open_dashboard",
  "dismiss",
  "escalate",
  "mark_as_reviewed",
] as const;

export type NotificationActionType = (typeof NOTIFICATION_ACTION_TYPES)[number];

export const DESKTOP_CLIENT_PLATFORMS = ["macos", "windows", "linux"] as const;

export type DesktopClientPlatform = (typeof DESKTOP_CLIENT_PLATFORMS)[number];

export const PRESENCE_DESKTOP_PRINCIPLE =
  "Aipify should work quietly in the background and speak up only when it has something valuable to say.";

export const LEVEL_ORDER: Record<PresenceNotificationLevel, number> = {
  informational: 1,
  important: 2,
  action_required: 3,
  critical: 4,
};

export function meetsMinimumLevel(
  level: PresenceNotificationLevel,
  minimum: PresenceNotificationLevel
): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minimum];
}
