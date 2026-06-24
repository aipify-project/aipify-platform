import assert from "node:assert/strict";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import {
  isPresenceTestNotification,
  selectDrawerNotificationPreview,
} from "@/lib/presence/unified-notification-feed/drawer-preview";

function sample(id: string, overrides: Partial<PresenceNotification> = {}): PresenceNotification {
  return {
    id,
    event_type: "companion_reply_ready",
    level: "informational",
    title: `Notification ${id}`,
    body: null,
    status: "delivered",
    channels: ["in_app"],
    actions: [],
    created_at: `2026-06-22T10:0${id}:00.000Z`,
    read_at: null,
    ...overrides,
  };
}

assert.equal(isPresenceTestNotification(sample("1", { metadata: { is_test: true } })), true);
assert.equal(
  isPresenceTestNotification(sample("2", { metadata: { source_provenance: "certification" } })),
  true,
);
assert.equal(isPresenceTestNotification(sample("3")), false);

const preview = selectDrawerNotificationPreview([
  sample("read-old", { read_at: "2026-06-22T09:00:00.000Z", created_at: "2026-06-22T08:00:00.000Z" }),
  sample("unread-new", { created_at: "2026-06-22T12:00:00.000Z" }),
  sample("unread-old", { created_at: "2026-06-22T11:00:00.000Z" }),
  sample("test", { metadata: { is_test: true }, created_at: "2026-06-22T13:00:00.000Z" }),
  sample("read-new", { read_at: "2026-06-22T10:00:00.000Z", created_at: "2026-06-22T10:30:00.000Z" }),
  sample("extra", { created_at: "2026-06-22T09:30:00.000Z" }),
]);

assert.equal(preview.length, 5);
assert.equal(preview[0]?.id, "unread-new");
assert.equal(preview[1]?.id, "unread-old");
assert.equal(preview.some((item) => item.id === "test"), false);

console.log("drawer-preview.test.ts passed");
