import type { PresenceNotification } from "@/lib/presence/notification-state";
import {
  isNotificationUnread,
  type UnifiedNotificationFeed,
} from "@/lib/presence/unified-notification-feed/parse-feed";
import type { CompanionActiveSession } from "@/lib/presence/unified-notification-feed/companion-active-session";

const COMPANION_SEEN_EVENT_TYPES = new Set([
  "companion_reply_ready",
  "playful_bell_moment",
]);

export function parseNotificationConversationId(
  notification: PresenceNotification,
): string | null {
  const metadataConversationId = notification.metadata?.conversation_id;
  if (typeof metadataConversationId === "string" && metadataConversationId.trim()) {
    return metadataConversationId.trim();
  }

  const href = notification.action_href?.trim();
  if (!href) return null;

  try {
    const url = new URL(href, "https://aipify.local");
    const fromQuery = url.searchParams.get("conversation");
    return fromQuery?.trim() || null;
  } catch {
    const match = href.match(/[?&]conversation=([^&]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

export function isCompanionSeenEventType(eventType: string): boolean {
  return COMPANION_SEEN_EVENT_TYPES.has(eventType);
}

export function shouldAutoMarkReadInActiveCompanionChat(
  notification: PresenceNotification,
  session: CompanionActiveSession,
): boolean {
  if (!session.panelVisible || !session.conversationId || !session.hasVisibleAssistantReply) {
    return false;
  }
  if (!isNotificationUnread(notification)) return false;
  if (!isCompanionSeenEventType(notification.event_type)) return false;

  const notificationConversationId = parseNotificationConversationId(notification);

  if (notification.event_type === "playful_bell_moment") {
    if (!notificationConversationId) return true;
    return notificationConversationId === session.conversationId;
  }

  return notificationConversationId === session.conversationId;
}

export function findNotificationsToAutoMarkRead(
  notifications: PresenceNotification[],
  session: CompanionActiveSession,
): PresenceNotification[] {
  return notifications.filter((notification) =>
    shouldAutoMarkReadInActiveCompanionChat(notification, session),
  );
}

export function patchNotificationsReadLocally(
  notifications: PresenceNotification[],
  notificationIds: ReadonlySet<string>,
): PresenceNotification[] {
  if (notificationIds.size === 0) return notifications;

  const readAt = new Date().toISOString();
  return notifications.map((notification) =>
    notificationIds.has(notification.id)
      ? { ...notification, read_at: readAt, status: "read" }
      : notification,
  );
}

export function applyActiveCompanionSeenSync(
  feed: UnifiedNotificationFeed,
  session: CompanionActiveSession,
): { feed: UnifiedNotificationFeed; idsToMarkRead: string[] } {
  const toMark = findNotificationsToAutoMarkRead(feed.notifications, session);
  if (toMark.length === 0) {
    return { feed, idsToMarkRead: [] };
  }

  const ids = new Set(toMark.map((notification) => notification.id));
  const notifications = patchNotificationsReadLocally(feed.notifications, ids);
  const unreadCount = Math.max(0, feed.unreadCount - toMark.length);

  return {
    feed: { notifications, unreadCount },
    idsToMarkRead: toMark.map((notification) => notification.id),
  };
}
