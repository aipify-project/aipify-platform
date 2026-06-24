import type { PresenceNotification } from "@/lib/presence/notification-state";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";

export type UnifiedNotificationFeed = {
  notifications: PresenceNotification[];
  unreadCount: number;
};

const UNREAD_STATUSES = new Set(["pending", "delivered"]);

export function isNotificationUnread(notification: PresenceNotification): boolean {
  if (notification.read_at) return false;
  return UNREAD_STATUSES.has(notification.status);
}

export function parsePresenceNotificationFeed(data: unknown): UnifiedNotificationFeed {
  if (!data || typeof data !== "object") {
    return { notifications: [], unreadCount: 0 };
  }

  const record = data as Record<string, unknown>;
  const rawNotifications = Array.isArray(record.notifications) ? record.notifications : [];
  const notifications = rawNotifications
    .map(parsePresenceNotification)
    .filter((item): item is PresenceNotification => item !== null);

  const unreadFromServer = Number(record.unread_count ?? NaN);
  const unreadCount = Number.isFinite(unreadFromServer)
    ? unreadFromServer
    : notifications.filter(isNotificationUnread).length;

  return { notifications, unreadCount };
}

function parsePresenceNotification(value: unknown): PresenceNotification | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id : null;
  const eventType = typeof row.event_type === "string" ? row.event_type : null;
  const level = typeof row.level === "string" ? row.level : "informational";
  const title = typeof row.title === "string" ? row.title : null;

  if (!id || !eventType || !title) return null;

  return {
    id,
    event_type: eventType,
    level: level as PresenceNotificationLevel,
    title,
    body: typeof row.body === "string" ? row.body : null,
    status: typeof row.status === "string" ? row.status : "delivered",
    channels: Array.isArray(row.channels) ? (row.channels as PresenceNotification["channels"]) : ["in_app"],
    actions: Array.isArray(row.actions) ? (row.actions as PresenceNotification["actions"]) : [],
    action_href: typeof row.action_href === "string" ? row.action_href : null,
    metadata: row.metadata && typeof row.metadata === "object" ? (row.metadata as Record<string, unknown>) : null,
    created_at: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    read_at: typeof row.read_at === "string" ? row.read_at : null,
    archived_at: typeof row.archived_at === "string" ? row.archived_at : null,
  };
}

export function findLatestByEventType(
  notifications: PresenceNotification[],
  eventType: string,
): PresenceNotification | null {
  return notifications.find((item) => item.event_type === eventType) ?? null;
}

export function findUnreadCompanionReplyReady(
  notifications: PresenceNotification[],
  suppressedIds: ReadonlySet<string>,
): PresenceNotification | null {
  return (
    notifications.find(
      (item) =>
        item.event_type === "companion_reply_ready" &&
        isNotificationUnread(item) &&
        !suppressedIds.has(item.id),
    ) ?? null
  );
}

export function detectNewNotificationIds(
  previousIds: ReadonlySet<string>,
  notifications: PresenceNotification[],
): string[] {
  return notifications.filter((item) => !previousIds.has(item.id)).map((item) => item.id);
}
