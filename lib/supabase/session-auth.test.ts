import assert from "node:assert/strict";
import {
  isAuthTransientError,
  isSessionAccessValid,
} from "./session-auth";

const futureSession = {
  access_token: "token",
  user: { id: "user-1" },
  expires_at: Math.floor(Date.now() / 1000) + 120,
} as never;

const expiredSession = {
  access_token: "token",
  user: { id: "user-1" },
  expires_at: Math.floor(Date.now() / 1000) - 5,
} as never;

assert.equal(isSessionAccessValid(futureSession), true);
assert.equal(isSessionAccessValid(expiredSession), false);
assert.equal(isAuthTransientError("Invalid Refresh Token: Already Used"), true);
assert.equal(isAuthTransientError("Invalid Refresh Token: Refresh Token Not Found"), false);

console.log("session-auth.test.ts: all assertions passed");
