import assert from "node:assert/strict";
import {
  applyToggleChange,
  notificationPrefsToToggleState,
  toggleStateToPreferencesPatch,
} from "@/lib/app/notifications/preferences-ui";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";

const basePrefs = parsePresenceNotificationPreferences({
  has_customer: true,
  preferences: {
    channel_in_app: true,
    sound_enabled: true,
    companion_replies_enabled: true,
    approvals_critical_enabled: false,
    quiet_hours_enabled: false,
    playful_moments_enabled: true,
    working_hours_start: "22:00",
    working_hours_end: "06:00",
  },
});

assert.ok(basePrefs);

const state = notificationPrefsToToggleState(basePrefs!);
assert.equal(state.soundEnabled, true);
assert.equal(state.companionRepliesEnabled, true);
assert.equal(state.approvalsCriticalEnabled, false);

const soundOnly = toggleStateToPreferencesPatch(
  applyToggleChange(state, "soundEnabled", false),
);
assert.equal(soundOnly.sound_enabled, false);
assert.equal(soundOnly.companion_replies_enabled, true);
assert.equal(soundOnly.approvals_critical_enabled, false);

const companionOnly = toggleStateToPreferencesPatch(
  applyToggleChange(state, "companionRepliesEnabled", false),
);
assert.equal(companionOnly.sound_enabled, true);
assert.equal(companionOnly.companion_replies_enabled, false);
assert.equal(companionOnly.approvals_critical_enabled, false);

console.log("notification-preferences-ui.test.ts passed");
