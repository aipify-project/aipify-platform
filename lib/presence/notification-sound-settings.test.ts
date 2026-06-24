import assert from "node:assert/strict";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import {
  resolveNotificationSoundStatus,
  runNotificationSoundTest,
} from "@/lib/presence/notification-sound-settings";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";
import { shouldPlayInAppNotificationSound } from "@/lib/presence/unified-notification-feed/sound-policy";

const basePrefs = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    quiet_hours_mode: "standard",
    working_hours_start: "09:00",
    working_hours_end: "17:00",
    timezone: "UTC",
    channel_in_app: true,
    min_level_in_app: "informational",
    quiet_hours_enabled: false,
    playful_moments_enabled: true,
  },
});

assert.ok(basePrefs);

const playfulNotification: PresenceNotification = {
  id: "bell-1",
  event_type: "playful_bell_moment",
  level: "informational",
  title: "Playful moment",
  body: "Ring-ding",
  status: "delivered",
  channels: ["in_app"],
  actions: [],
  created_at: "2026-06-22T12:00:00.000Z",
  read_at: null,
};

assert.equal(
  shouldPlayInAppNotificationSound(playfulNotification, basePrefs),
  true,
);

const playfulDisabled = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    channel_in_app: true,
    min_level_in_app: "informational",
    quiet_hours_mode: "standard",
    quiet_hours_enabled: false,
    playful_moments_enabled: false,
  },
});

assert.equal(
  shouldPlayInAppNotificationSound(playfulNotification, playfulDisabled),
  false,
);

const quietHours = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    channel_in_app: true,
    min_level_in_app: "informational",
    quiet_hours_mode: "standard",
    working_hours_start: "09:00",
    working_hours_end: "17:00",
    quiet_hours_enabled: true,
    playful_moments_enabled: true,
  },
});

assert.equal(
  shouldPlayInAppNotificationSound(
    playfulNotification,
    quietHours,
    new Date("2026-06-22T22:00:00.000Z"),
  ),
  false,
);

assert.equal(resolveNotificationSoundStatus({ ...basePrefs!, channel_in_app: false }), "disabled");
assert.equal(
  resolveNotificationSoundStatus({ ...basePrefs!, min_level_in_app: "critical" }),
  "disabled",
);
assert.equal(
  resolveNotificationSoundStatus(quietHours, new Date("2026-06-22T22:00:00.000Z")),
  "quiet_hours",
);

const activeOrBlocked = resolveNotificationSoundStatus(basePrefs);
assert.ok(activeOrBlocked === "active" || activeOrBlocked === "browser_blocked");

assert.equal(runNotificationSoundTest({ ...basePrefs!, channel_in_app: false }), "disabled");
assert.equal(
  runNotificationSoundTest({ ...basePrefs!, min_level_in_app: "critical" }),
  "disabled",
);
assert.equal(
  runNotificationSoundTest(quietHours, new Date("2026-06-22T22:00:00.000Z")),
  "quiet_hours",
);

const persisted = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    channel_in_app: true,
    quiet_hours_enabled: true,
    working_hours_start: "22:00:00",
    working_hours_end: "06:00:00",
    playful_moments_enabled: false,
  },
});

assert.equal(persisted?.quiet_hours_enabled, true);
assert.equal(persisted?.playful_moments_enabled, false);

console.log("notification-sound-settings.test.ts passed");
