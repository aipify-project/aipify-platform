import assert from "node:assert/strict";
import {
  classifyPasswordSignInFailure,
  parsePasswordSignInPayload,
} from "@/lib/auth/password-sign-in";

assert.equal(classifyPasswordSignInFailure("Invalid login credentials"), "invalid_credentials");
assert.equal(classifyPasswordSignInFailure("Email not confirmed"), "email_not_confirmed");
assert.equal(classifyPasswordSignInFailure("Failed to fetch"), "network");
assert.equal(classifyPasswordSignInFailure("Unexpected auth error"), "auth_failed");

assert.deepEqual(parsePasswordSignInPayload({ email: "  owner@example.com ", password: "secret" }), {
  email: "owner@example.com",
  password: "secret",
});
assert.equal(parsePasswordSignInPayload({ email: "", password: "secret" }), null);
assert.equal(parsePasswordSignInPayload(null), null);

console.log("password-sign-in.test.ts passed");
