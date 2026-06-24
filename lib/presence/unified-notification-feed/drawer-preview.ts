import type { PresenceNotification } from "@/lib/presence/notification-state";
import { isNotificationUnread } from "./parse-feed";

export const DRAWER_NOTIFICATION_PREVIEW_LIMIT = 5;

export function isPresenceTestNotification(notification: PresenceNotification): boolean {
  const metadata = notification.metadata;
  if (!metadata) return false;
  if (metadata.is_test === true || metadata.test_notification === true) return true;
  return metadata.source_provenance === "certification";
}

function sortByNewest(a: PresenceNotification, b: PresenceNotification): number {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export function selectDrawerNotificationPreview(
  notifications: PresenceNotification[],
  limit = DRAWER_NOTIFICATION_PREVIEW_LIMIT,
): PresenceNotification[] {
  const live = notifications.filter(
    (notification) => !notification.archived_at && !isPresenceTestNotification(notification),
  );
  const unread = live.filter(isNotificationUnread).sort(sortByNewest);
  const read = live.filter((notification) => !isNotificationUnread(notification)).sort(sortByNewest);
  return [...unread, ...read].slice(0, limit);
}
