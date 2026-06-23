import assert from "node:assert/strict";
import {
  AUTH_REDIRECT_PATHS,
  buildAuthCallbackRedirectUrl,
  buildAuthRedirectUrl,
  buildPasswordResetRedirectUrl,
  getAuthAppOrigin,
  resolveAuthAppOrigin,
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

test("request host app.aipify.ai forces production origin even in development", () => {
  assert.equal(
    resolveAuthAppOrigin({ requestHost: "app.aipify.ai" }),
    productionOrigin,
  );
  assert.equal(
    buildPasswordResetRedirectUrl({ requestHost: "app.aipify.ai" }),
    `${productionOrigin}${AUTH_REDIRECT_PATHS.callback}?next=${encodeURIComponent(AUTH_REDIRECT_PATHS.updatePassword)}&type=recovery`,
  );
});

test("marketing apex hosts force app.aipify.ai for password reset", () => {
  for (const host of ["aipify.ai", "www.aipify.ai"]) {
    assert.equal(resolveAuthAppOrigin({ requestHost: host }), productionOrigin);
    assert.equal(
      buildPasswordResetRedirectUrl({ requestHost: host }),
      `${productionOrigin}${AUTH_REDIRECT_PATHS.callback}?next=${encodeURIComponent(AUTH_REDIRECT_PATHS.updatePassword)}&type=recovery`,
    );
  }
});

test("deployed runtime never emits localhost for password reset", () => {
  const previousVercel = process.env.VERCEL;
  const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  process.env.VERCEL = "1";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3001";

  try {
    const url = buildPasswordResetRedirectUrl();
    assert.ok(url.startsWith(productionOrigin));
    assert.ok(!url.includes("localhost:3001"));
  } finally {
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
    if (previousAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previousAppUrl;
  }
});

test("development auth origin prefers NEXT_PUBLIC_APP_URL on localhost", () => {
  if (process.env.NODE_ENV !== "development") return;

  const previous = process.env.NEXT_PUBLIC_APP_URL;
  const previousVercel = process.env.VERCEL;
  delete process.env.VERCEL;

  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3001";
  try {
    assert.equal(resolveAuthAppOrigin({ requestHost: "localhost:3001" }), "http://localhost:3001");
    assert.ok(
      buildAuthRedirectUrl(AUTH_REDIRECT_PATHS.callback, "", {
        requestHost: "localhost:3001",
      }).startsWith("http://localhost:3001"),
    );
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = previous;
    if (previousVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
  }
});

test("auth callback redirect uses canonical login path", () => {
  const url = buildAuthCallbackRedirectUrl(AUTH_REDIRECT_PATHS.login, {
    requestHost: CUSTOMER_PORTAL_DOMAIN,
  });
  assert.ok(url.includes(AUTH_REDIRECT_PATHS.callback));
  assert.ok(url.includes(`next=${encodeURIComponent(AUTH_REDIRECT_PATHS.login)}`));
  assert.ok(url.startsWith(productionOrigin));
});

test("auth redirect paths cover Supabase allow-list routes", () => {
  assert.equal(AUTH_REDIRECT_PATHS.callback, "/auth/callback");
  assert.equal(AUTH_REDIRECT_PATHS.resetPassword, "/auth/reset-password");
  assert.equal(AUTH_REDIRECT_PATHS.updatePassword, "/auth/update-password");
});

console.log("auth-redirect-urls tests passed");
