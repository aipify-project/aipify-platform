import assert from "node:assert/strict";
import {
  detectNewNotificationIds,
  findLatestByEventType,
  findUnreadCompanionReplyReady,
  isNotificationUnread,
  parsePresenceNotificationFeed,
} from "@/lib/presence/unified-notification-feed/parse-feed";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import { shouldPlayInAppNotificationSound } from "@/lib/presence/unified-notification-feed/sound-policy";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";

const sampleNotification = (overrides: Partial<PresenceNotification> = {}): PresenceNotification => ({
  id: "n-1",
  event_type: "companion_reply_ready",
  level: "informational",
  title: "Reply ready",
  body: "Your question is answered.",
  status: "delivered",
  channels: ["in_app"],
  actions: [],
  action_href: "/app/companion?conversation=abc",
  created_at: "2026-06-22T10:00:00.000Z",
  read_at: null,
  ...overrides,
});

const feed = parsePresenceNotificationFeed({
  unread_count: 2,
  notifications: [
    sampleNotification({ id: "a" }),
    sampleNotification({
      id: "b",
      event_type: "playful_bell_moment",
      read_at: "2026-06-22T11:00:00.000Z",
    }),
  ],
});
assert.equal(feed.unreadCount, 2);
assert.equal(feed.notifications.length, 2);
assert.equal(feed.notifications[1]?.event_type, "playful_bell_moment");

const derivedUnread = parsePresenceNotificationFeed({
  notifications: [
    sampleNotification({ status: "delivered" }),
    sampleNotification({ id: "read", read_at: "2026-06-22T12:00:00.000Z", status: "acted" }),
  ],
});
assert.equal(derivedUnread.unreadCount, 1);

assert.equal(isNotificationUnread(sampleNotification({ status: "pending" })), true);
assert.equal(isNotificationUnread(sampleNotification({ status: "delivered" })), true);
assert.equal(
  isNotificationUnread(sampleNotification({ status: "acted", read_at: "2026-06-22T12:00:00.000Z" })),
  false,
);

const playful = findLatestByEventType(
  [
    sampleNotification({ id: "1", event_type: "approval_awaiting_action" }),
    sampleNotification({ id: "2", event_type: "playful_bell_moment", title: "Fox moment" }),
  ],
  "playful_bell_moment",
);
assert.equal(playful?.title, "Fox moment");

const toastCandidates = [sampleNotification({ id: "toast-1" })];
assert.equal(findUnreadCompanionReplyReady(toastCandidates, new Set(["toast-1"])), null);
assert.notEqual(findUnreadCompanionReplyReady(toastCandidates, new Set()), null);

assert.deepEqual(
  detectNewNotificationIds(new Set(["existing"]), [
    sampleNotification({ id: "existing" }),
    sampleNotification({ id: "new-bell", event_type: "playful_bell_moment" }),
  ]),
  ["new-bell"],
);

const prefs = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    quiet_hours_mode: "standard",
    working_hours_start: "09:00",
    working_hours_end: "17:00",
    timezone: "UTC",
    channel_in_app: true,
    min_level_in_app: "informational",
  },
});
assert.ok(prefs);
assert.equal(
  shouldPlayInAppNotificationSound(sampleNotification(), prefs, new Date("2026-06-22T12:00:00.000Z")),
  true,
);

const blocked = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: { channel_in_app: false, min_level_in_app: "informational", quiet_hours_mode: "standard" },
});
assert.equal(shouldPlayInAppNotificationSound(sampleNotification(), blocked), false);
assert.equal(parsePresenceNotificationPreferences({ has_customer: false }), null);

console.log("unified-notification-feed.test.ts passed");
