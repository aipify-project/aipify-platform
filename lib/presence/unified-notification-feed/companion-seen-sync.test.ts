import assert from "node:assert/strict";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import {
  applyActiveCompanionSeenSync,
  findNotificationsToAutoMarkRead,
  parseNotificationConversationId,
  shouldAutoMarkReadInActiveCompanionChat,
} from "@/lib/presence/unified-notification-feed/companion-seen-sync";

const sampleNotification = (overrides: Partial<PresenceNotification> = {}): PresenceNotification => ({
  id: "n-1",
  event_type: "companion_reply_ready",
  level: "informational",
  title: "Reply ready",
  body: "Your question is answered.",
  status: "delivered",
  channels: ["in_app"],
  actions: [],
  action_href: "/app/companion?conversation=conv-active",
  metadata: { conversation_id: "conv-active" },
  created_at: "2026-06-22T10:00:00.000Z",
  read_at: null,
  ...overrides,
});

assert.equal(parseNotificationConversationId(sampleNotification()), "conv-active");
assert.equal(
  parseNotificationConversationId(
    sampleNotification({ metadata: null, action_href: "/app/companion?conversation=from-href" }),
  ),
  "from-href",
);

const activeSession = {
  panelVisible: true,
  conversationId: "conv-active",
  hasVisibleAssistantReply: true,
};

assert.equal(
  shouldAutoMarkReadInActiveCompanionChat(sampleNotification(), activeSession),
  true,
);
assert.equal(
  shouldAutoMarkReadInActiveCompanionChat(
    sampleNotification({ event_type: "playful_bell_moment", metadata: { conversation_id: "conv-active" } }),
    activeSession,
  ),
  true,
);
assert.equal(
  shouldAutoMarkReadInActiveCompanionChat(
    sampleNotification({ event_type: "playful_bell_moment", metadata: {} }),
    activeSession,
  ),
  true,
);
assert.equal(
  shouldAutoMarkReadInActiveCompanionChat(
    sampleNotification({ metadata: { conversation_id: "other-conv" } }),
    activeSession,
  ),
  false,
);
assert.equal(
  shouldAutoMarkReadInActiveCompanionChat(
    sampleNotification({ read_at: "2026-06-22T11:00:00.000Z", status: "read" }),
    activeSession,
  ),
  false,
);
assert.equal(
  shouldAutoMarkReadInActiveCompanionChat(sampleNotification(), {
    ...activeSession,
    panelVisible: false,
  }),
  false,
);

const backgroundUnread = sampleNotification({ id: "bg-1", metadata: { conversation_id: "bg-conv" } });
assert.equal(findNotificationsToAutoMarkRead([backgroundUnread], activeSession).length, 0);

const raceNotification = sampleNotification({ id: "race-1" });
const synced = applyActiveCompanionSeenSync(
  { notifications: [raceNotification], unreadCount: 1 },
  activeSession,
);
assert.deepEqual(synced.idsToMarkRead, ["race-1"]);
assert.equal(synced.feed.unreadCount, 0);
assert.ok(synced.feed.notifications[0]?.read_at);

console.log("companion-seen-sync.test.ts passed");
