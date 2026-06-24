import type { PresenceNotification } from "@/lib/presence/notification-state";
import { isNotificationUnread } from "@/lib/presence/unified-notification-feed";

const TEST_NOTIFICATION_PATTERNS = [
  /certification/i,
  /^POST-P1/i,
  /production-foundation-notification/i,
  /production worker app smoke/i,
  /companion-production-worker-app-smoke/i,
  /live e2e certification/i,
];

export function isIdentifiableTestNotification(notification: PresenceNotification): boolean {
  const haystack = `${notification.title} ${notification.body ?? ""}`.trim();
  return TEST_NOTIFICATION_PATTERNS.some((pattern) => pattern.test(haystack));
}

export function filterAccountRecentNotifications(
  notifications: PresenceNotification[],
): PresenceNotification[] {
  return notifications.filter((notification) => !isIdentifiableTestNotification(notification));
}

export function isValidInternalNotificationHref(href: string | null | undefined): href is string {
  if (!href?.trim()) return false;
  const trimmed = href.trim();
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("//")) return false;
  return trimmed.startsWith("/app/") || trimmed.startsWith("/dashboard/");
}

export function formatNotificationTimestamp(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function countUnreadNotifications(notifications: PresenceNotification[]): number {
  return notifications.filter(isNotificationUnread).length;
}

export async function performPresenceNotificationAction(
  notificationId: string,
  actionType: "mark_as_reviewed" | "dismiss",
): Promise<boolean> {
  const res = await fetch(`/api/presence/notifications/${notificationId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action_type: actionType }),
  });
  return res.ok;
}

export function markNotificationReadLocally(
  notifications: PresenceNotification[],
  notificationId: string,
): PresenceNotification[] {
  const readAt = new Date().toISOString();
  return notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read_at: readAt, status: "reviewed" }
      : notification,
  );
}

export function removeNotificationLocally(
  notifications: PresenceNotification[],
  notificationId: string,
): PresenceNotification[] {
  return notifications.filter((notification) => notification.id !== notificationId);
}

export function markAllNotificationsReadLocally(
  notifications: PresenceNotification[],
): PresenceNotification[] {
  const readAt = new Date().toISOString();
  return notifications.map((notification) =>
    isNotificationUnread(notification)
      ? { ...notification, read_at: readAt, status: "reviewed" }
      : notification,
  );
}
