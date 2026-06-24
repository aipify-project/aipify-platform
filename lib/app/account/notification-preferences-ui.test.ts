import assert from "node:assert/strict";
import {
  applyToggleChange,
  notificationPrefsToToggleState,
  toggleStateToPreferencesPatch,
} from "@/lib/app/account/notification-preferences-ui";
import {
  filterAccountRecentNotifications,
  isIdentifiableTestNotification,
  isValidInternalNotificationHref,
} from "@/lib/app/account/recent-notifications";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";

const basePrefs = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    channel_in_app: true,
    min_level_in_app: "informational",
    quiet_hours_enabled: false,
    playful_moments_enabled: true,
    working_hours_start: "22:00",
    working_hours_end: "06:00",
  },
});

assert.ok(basePrefs);

const allOn = notificationPrefsToToggleState(basePrefs!);
assert.equal(allOn.inAppEnabled, true);
assert.equal(allOn.soundEnabled, true);
assert.equal(allOn.companionRepliesEnabled, true);
assert.equal(allOn.approvalsCriticalEnabled, true);

const soundOffPrefs = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    channel_in_app: true,
    min_level_in_app: "critical",
    quiet_hours_enabled: false,
    playful_moments_enabled: true,
  },
});

const soundOff = notificationPrefsToToggleState(soundOffPrefs!);
assert.equal(soundOff.soundEnabled, false);

const patch = toggleStateToPreferencesPatch(
  applyToggleChange(allOn, "soundEnabled", false),
  basePrefs,
);
assert.equal(patch.min_level_in_app, "critical");

const companionOff = toggleStateToPreferencesPatch(
  applyToggleChange(allOn, "companionRepliesEnabled", false),
  basePrefs,
);
assert.equal(companionOff.min_level_in_app, "important");

const testNotification: PresenceNotification = {
  id: "test-1",
  event_type: "companion_reply_ready",
  level: "informational",
  title: "POST-P1.09E background companion reply certification",
  body: "Internal only",
  status: "delivered",
  channels: ["in_app"],
  actions: [],
  created_at: "2026-06-22T12:00:00.000Z",
  read_at: null,
};

assert.equal(isIdentifiableTestNotification(testNotification), true);
assert.equal(
  filterAccountRecentNotifications([testNotification]).length,
  0,
);

assert.equal(isValidInternalNotificationHref("/app/command-center"), true);
assert.equal(isValidInternalNotificationHref("https://evil.example"), false);
assert.equal(isValidInternalNotificationHref(null), false);

console.log("notification-preferences-ui.test.ts passed");
