import assert from "node:assert/strict";
import {
  buildSafeSessionMetadata,
  resolvePortalSessionResolution,
} from "./session-diagnostics";

const active = buildSafeSessionMetadata({
  user: { id: "user-1" } as never,
  session: { expires_at: Math.floor(Date.now() / 1000) + 300, access_token: "a.b.c" } as never,
});
assert.equal(active.auth_event_hint, "active");
assert.ok((active.expires_in_seconds ?? 0) > 0);

const expired = buildSafeSessionMetadata({
  user: { id: "user-1" } as never,
  session: { expires_at: Math.floor(Date.now() / 1000) - 10, access_token: "a.b.c" } as never,
});
assert.equal(expired.auth_event_hint, "expired_or_missing");

assert.deepEqual(
  resolvePortalSessionResolution({
    user: { id: "abc" } as never,
    refreshUser: null,
  }),
  { status: "authenticated", userId: "abc" },
);

assert.deepEqual(
  resolvePortalSessionResolution({
    user: null,
    refreshUser: { id: "refreshed" } as never,
  }),
  { status: "authenticated", userId: "refreshed" },
);

assert.equal(
  resolvePortalSessionResolution({
    user: null,
    refreshUser: null,
    refreshErrorMessage: "Invalid Refresh Token: Already Used",
  }).status,
  "unauthenticated",
);

assert.equal(
  resolvePortalSessionResolution({
    user: null,
    refreshUser: null,
    getUserErrorMessage: "Failed to fetch",
  }).status,
  "transient",
);

console.log("session-diagnostics.test.ts: all assertions passed");
