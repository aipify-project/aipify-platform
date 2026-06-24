import assert from "node:assert/strict";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";

const successPayload = {
  has_customer: true,
  preferences: {
    quiet_hours_mode: "standard",
    working_hours_start: "09:00",
    working_hours_end: "17:00",
    timezone: "Europe/Oslo",
    vacation_until: null,
    quiet_hours_enabled: false,
    channel_in_app: true,
    channel_desktop: true,
    channel_email_digest: false,
    channel_mobile_push: false,
    min_level_in_app: "informational",
    min_level_desktop: "important",
    min_level_email: "important",
    playful_moments_enabled: true,
    sound_enabled: true,
    companion_replies_enabled: true,
    approvals_critical_enabled: true,
  },
};

const parsed = parsePresenceNotificationPreferences(successPayload);
assert.equal(parsed?.sound_enabled, true);

const falseCustomer = parsePresenceNotificationPreferences({ has_customer: false });
assert.equal(falseCustomer, null);

console.log("presence-preferences-shape.test.ts passed");
