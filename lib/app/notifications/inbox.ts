import type { PresenceNotification } from "@/lib/presence/notification-state";
import { isNotificationUnread } from "@/lib/presence/unified-notification-feed";

export type NotificationInboxFilter = "unread" | "all" | "archived";

export type NotificationInboxCounts = {
  unread: number;
  all: number;
  archived: number;
};

export type NotificationInboxPage = {
  notifications: PresenceNotification[];
  filter: NotificationInboxFilter;
  limit: number;
  offset: number;
  hasMore: boolean;
  counts: NotificationInboxCounts;
};

export type NotificationPresentationStatus = "unread" | "read" | "archived";

export const INBOX_PAGE_SIZE = 25;

export function getNotificationPresentationStatus(
  notification: PresenceNotification,
): NotificationPresentationStatus {
  if (notification.archived_at) return "archived";
  if (isNotificationUnread(notification)) return "unread";
  return "read";
}

export function parseNotificationInboxPage(data: unknown): NotificationInboxPage {
  if (!data || typeof data !== "object") {
    return emptyInboxPage("all");
  }

  const record = data as Record<string, unknown>;
  const rawNotifications = Array.isArray(record.notifications) ? record.notifications : [];
  const countsRaw =
    record.counts && typeof record.counts === "object"
      ? (record.counts as Record<string, unknown>)
      : {};

  const filter = normalizeInboxFilter(record.filter);
  const limit = Number(record.limit ?? INBOX_PAGE_SIZE);
  const offset = Number(record.offset ?? 0);

  return {
    notifications: rawNotifications
      .map(parseInboxNotification)
      .filter((item): item is PresenceNotification => item !== null),
    filter,
    limit: Number.isFinite(limit) ? limit : INBOX_PAGE_SIZE,
    offset: Number.isFinite(offset) ? offset : 0,
    hasMore: record.has_more === true,
    counts: {
      unread: Number(countsRaw.unread ?? 0) || 0,
      all: Number(countsRaw.all ?? 0) || 0,
      archived: Number(countsRaw.archived ?? 0) || 0,
    },
  };
}

function emptyInboxPage(filter: NotificationInboxFilter): NotificationInboxPage {
  return {
    notifications: [],
    filter,
    limit: INBOX_PAGE_SIZE,
    offset: 0,
    hasMore: false,
    counts: { unread: 0, all: 0, archived: 0 },
  };
}

function normalizeInboxFilter(value: unknown): NotificationInboxFilter {
  if (value === "unread" || value === "archived") return value;
  return "all";
}

function parseInboxNotification(value: unknown): PresenceNotification | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id : null;
  const eventType = typeof row.event_type === "string" ? row.event_type : null;
  const title = typeof row.title === "string" ? row.title : null;
  if (!id || !eventType || !title) return null;

  return {
    id,
    event_type: eventType,
    level: typeof row.level === "string" ? (row.level as PresenceNotification["level"]) : "informational",
    title,
    body: typeof row.body === "string" ? row.body : null,
    status: typeof row.status === "string" ? row.status : "delivered",
    channels: Array.isArray(row.channels) ? (row.channels as PresenceNotification["channels"]) : ["in_app"],
    actions: Array.isArray(row.actions) ? (row.actions as PresenceNotification["actions"]) : [],
    action_href: typeof row.action_href === "string" ? row.action_href : null,
    metadata:
      row.metadata && typeof row.metadata === "object"
        ? (row.metadata as Record<string, unknown>)
        : null,
    created_at: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    read_at: typeof row.read_at === "string" ? row.read_at : null,
    archived_at: typeof row.archived_at === "string" ? row.archived_at : null,
  };
}

export async function fetchNotificationInboxPage(input: {
  filter: NotificationInboxFilter;
  offset: number;
  limit?: number;
}): Promise<NotificationInboxPage> {
  const params = new URLSearchParams({
    filter: input.filter,
    offset: String(input.offset),
    limit: String(input.limit ?? INBOX_PAGE_SIZE),
  });
  const res = await fetch(`/api/presence/notifications/inbox?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return emptyInboxPage(input.filter);
  return parseNotificationInboxPage(await res.json());
}

export async function performPresenceNotificationAction(
  notificationId: string,
  actionType: "mark_as_reviewed" | "archive" | "dismiss",
): Promise<boolean> {
  const res = await fetch(`/api/presence/notifications/${notificationId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action_type: actionType }),
  });
  return res.ok;
}

export async function performPresenceNotificationBulkAction(
  actionType: "mark_all_read" | "archive_all_read",
): Promise<boolean> {
  const res = await fetch("/api/presence/notifications/bulk-action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action_type: actionType }),
  });
  return res.ok;
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

export function patchNotificationReadLocally(
  notifications: PresenceNotification[],
  notificationId: string,
): PresenceNotification[] {
  const readAt = new Date().toISOString();
  return notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read_at: readAt, status: "read" }
      : notification,
  );
}

export function patchNotificationArchivedLocally(
  notifications: PresenceNotification[],
  notificationId: string,
): PresenceNotification[] {
  const archivedAt = new Date().toISOString();
  return notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, archived_at: archivedAt, read_at: notification.read_at ?? archivedAt, status: "read" }
      : notification,
  );
}

export function removeNotificationFromActiveList(
  notifications: PresenceNotification[],
  notificationId: string,
): PresenceNotification[] {
  return notifications.filter((notification) => notification.id !== notificationId);
}

export function patchAllNotificationsReadLocally(
  notifications: PresenceNotification[],
): PresenceNotification[] {
  const readAt = new Date().toISOString();
  return notifications.map((notification) =>
    isNotificationUnread(notification)
      ? { ...notification, read_at: readAt, status: "read" }
      : notification,
  );
}
