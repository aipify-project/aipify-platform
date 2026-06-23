import assert from "node:assert/strict";
import { mapAuthCallbackError } from "./auth-recovery-log";
import { buildPasswordResetRedirectUrl } from "./auth-redirect-urls";
import { buildRecoveryCallbackRedirectUrl } from "./recovery-session";
import { AUTH_REDIRECT_PATHS } from "./auth-redirect-urls";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("password reset redirect uses callback with next update-password", () => {
  const url = buildPasswordResetRedirectUrl({ requestHost: "app.aipify.ai" });
  assert.ok(url.includes("/auth/callback"));
  assert.ok(url.includes("type=recovery"));
  assert.ok(url.includes(encodeURIComponent("/auth/update-password")));
  assert.ok(!url.includes("/auth/update-password?code="));
});

test("code on update-password canonicalizes to callback", () => {
  const redirect = buildRecoveryCallbackRedirectUrl("sample-code-value");
  assert.ok(redirect.startsWith("/auth/callback?"));
  assert.ok(redirect.includes("code=sample-code-value"));
  assert.ok(redirect.includes("type=recovery"));
  assert.ok(redirect.includes(`next=${encodeURIComponent(AUTH_REDIRECT_PATHS.updatePassword)}`));
});

test("maps supabase expired errors", () => {
  assert.equal(mapAuthCallbackError("Email link is invalid or has expired"), "otp_expired");
  assert.equal(mapAuthCallbackError("otp_expired"), "otp_expired");
});

test("maps invalid code errors", () => {
  assert.equal(mapAuthCallbackError("bad_code_verifier"), "invalid_code");
  assert.equal(mapAuthCallbackError("flow_state_not_found"), "invalid_code");
});

test("maps unknown errors to exchange_failed", () => {
  assert.equal(mapAuthCallbackError("something else"), "exchange_failed");
});

console.log("recovery-flow.test.ts: all assertions passed");
