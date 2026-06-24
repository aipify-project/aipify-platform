import assert from "node:assert/strict";
import {
  normalizePreferencesRpcPayload,
  summarizePreferencesRpcPayload,
} from "@/lib/app/notifications/preferences-route-diagnostics";

const payload = {
  has_customer: true,
  preferences: {
    quiet_hours_mode: "standard",
    working_hours_start: "09:00:00",
    working_hours_end: "17:00:00",
    timezone: "Europe/Oslo",
    channel_in_app: true,
    sound_enabled: true,
    min_level_in_app: "informational",
    quiet_hours_enabled: false,
    playful_moments_enabled: true,
  },
};

const normalized = normalizePreferencesRpcPayload(JSON.stringify(payload));
assert.deepEqual(normalized, payload);

const summary = summarizePreferencesRpcPayload(payload);
assert.equal(summary.hasCustomer, true);
assert.equal(summary.hasPreferencesObject, true);
assert.equal(summary.parserAccepted, true);
assert.ok(summary.preferenceKeys.includes("sound_enabled"));

console.log("preferences-route-diagnostics.test.ts passed");
