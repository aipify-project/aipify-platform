import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildTokenHashRecoveryUrl } from "./secure-recovery-link-url";
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

test("token_hash recovery URL is cross-device (no PKCE code exchange required)", () => {
  const url = buildTokenHashRecoveryUrl("sample-hash-value", {
    requestHost: "app.aipify.ai",
  });
  assert.ok(url.startsWith("https://app.aipify.ai/auth/callback?"));
  assert.ok(url.includes("token_hash=sample-hash-value"));
  assert.ok(url.includes("type=recovery"));
  assert.ok(url.includes(encodeURIComponent(AUTH_REDIRECT_PATHS.updatePassword)));
  assert.ok(!url.includes("code="));
});

test("partner activation next path can target activate entry", () => {
  const url = buildTokenHashRecoveryUrl("hash", {
    requestHost: "app.aipify.ai",
    nextPath: "/auth/activate?portal=partner",
  });
  assert.ok(url.includes(encodeURIComponent("/auth/activate?portal=partner")));
});

test("forgot-password route uses secure recovery + Resend (not browser-bound recovery request)", () => {
  const route = readFileSync("app/api/auth/forgot-password/route.ts", "utf8");
  assert.match(route, /createSecureRecoveryLink/);
  assert.match(route, /sendAuthLifecycleEmail/);
  assert.doesNotMatch(route, /\.resetPasswordForEmail\s*\(/);
});

test("partners approve route can emit activation without inventing tokens", () => {
  const route = readFileSync("app/api/platform/sellers/partners/route.ts", "utf8");
  assert.match(route, /inspectPartnerAuthCapability/);
  assert.match(route, /createSecureRecoveryLink/);
  assert.match(route, /partner_activation/);
  assert.doesNotMatch(route, /inviteUserByEmail/);
});

test("secure recovery module never logs absolute URLs or token material", () => {
  const src = readFileSync("lib/auth/secure-recovery-link.ts", "utf8");
  assert.doesNotMatch(src, /console\.(log|info|warn|error).*absoluteUrl/);
  assert.doesNotMatch(src, /console\.(log|info|warn|error).*tokenHash/);
  assert.doesNotMatch(src, /console\.(log|info|warn|error).*hashed_token/);
});

console.log("secure-recovery-link.test.ts: all assertions passed");
