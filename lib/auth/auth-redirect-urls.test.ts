import assert from "node:assert/strict";
import {
  AUTH_REDIRECT_PATHS,
  buildAuthCallbackRedirectUrl,
  buildAuthRedirectUrl,
  buildPasswordResetRedirectUrl,
  getAuthAppOrigin,
} from "./auth-redirect-urls";
import { CUSTOMER_PORTAL_DOMAIN } from "@/lib/portals/hosts";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

const productionOrigin = `https://${CUSTOMER_PORTAL_DOMAIN}`;

test("production auth origin is app.aipify.ai", () => {
  if (process.env.NODE_ENV === "production") {
    assert.equal(getAuthAppOrigin(), productionOrigin);
    assert.equal(
      buildPasswordResetRedirectUrl(),
      `${productionOrigin}${AUTH_REDIRECT_PATHS.callback}?next=${encodeURIComponent(AUTH_REDIRECT_PATHS.updatePassword)}&type=recovery`,
    );
  }
});

test("development auth origin prefers NEXT_PUBLIC_APP_URL", () => {
  if (process.env.NODE_ENV !== "development") return;

  const previous = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3001";
  try {
    assert.equal(getAuthAppOrigin(), "http://localhost:3001");
    assert.ok(buildAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback).startsWith("http://localhost:3001"));
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previous;
  }
});

test("auth callback redirect uses canonical login path", () => {
  const url = buildAuthCallbackRedirectUrl(AUTH_REDIRECT_PATHS.login);
  assert.ok(url.includes(AUTH_REDIRECT_PATHS.callback));
  assert.ok(url.includes(`next=${encodeURIComponent(AUTH_REDIRECT_PATHS.login)}`));
  assert.ok(!url.includes("localhost:3001") || process.env.NODE_ENV === "development");
});

test("auth redirect paths cover Supabase allow-list routes", () => {
  assert.equal(AUTH_REDIRECT_PATHS.callback, "/auth/callback");
  assert.equal(AUTH_REDIRECT_PATHS.resetPassword, "/auth/reset-password");
  assert.equal(AUTH_REDIRECT_PATHS.updatePassword, "/auth/update-password");
});

console.log("auth-redirect-urls tests passed");
