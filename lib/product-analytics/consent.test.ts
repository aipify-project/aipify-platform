import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  ANALYTICS_CONSENT_COOKIE_NAME,
  formatAnalyticsConsentCookie,
  isAnalyticsConsentAllowed,
  isAnalyticsConsentBlocked,
  parseAnalyticsConsentCookieValue,
  readAnalyticsConsentFromCookieString,
} from "./consent";

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`ok ${name}`);
    } catch (error) {
      console.error(`fail ${name}`);
      throw error;
    }
  })();
}

async function main() {
  await test("default consent is unknown when cookie is absent", async () => {
    assert.equal(parseAnalyticsConsentCookieValue(null), "unknown");
    assert.equal(readAnalyticsConsentFromCookieString(""), "unknown");
    assert.equal(isAnalyticsConsentBlocked("unknown"), true);
    assert.equal(isAnalyticsConsentAllowed("unknown"), false);
  });

  await test("accept maps to granted and allows analytics", async () => {
    assert.equal(parseAnalyticsConsentCookieValue("granted"), "granted");
    assert.equal(isAnalyticsConsentAllowed("granted"), true);
    assert.equal(isAnalyticsConsentBlocked("granted"), false);
  });

  await test("reject maps to denied and blocks analytics", async () => {
    assert.equal(parseAnalyticsConsentCookieValue("denied"), "denied");
    assert.equal(isAnalyticsConsentAllowed("denied"), false);
    assert.equal(isAnalyticsConsentBlocked("denied"), true);
  });

  await test("persisted cookie value is read correctly", async () => {
    const cookie = `${ANALYTICS_CONSENT_COOKIE_NAME}=granted; path=/`;
    assert.equal(readAnalyticsConsentFromCookieString(cookie), "granted");

    const deniedCookie = `other=1; ${ANALYTICS_CONSENT_COOKIE_NAME}=denied; aipify-locale=en`;
    assert.equal(readAnalyticsConsentFromCookieString(deniedCookie), "denied");
  });

  await test("invalid cookie values fall back to unknown", async () => {
    assert.equal(parseAnalyticsConsentCookieValue("maybe"), "unknown");
    assert.equal(isAnalyticsConsentBlocked("unknown"), true);
  });

  await test("consent cookie writer uses first-party cookie name and decision values", async () => {
    const granted = formatAnalyticsConsentCookie("granted");
    assert.match(granted, new RegExp(`^${ANALYTICS_CONSENT_COOKIE_NAME}=granted`));
    assert.match(granted, /path=\//);
    assert.match(granted, /SameSite=lax/i);

    const denied = formatAnalyticsConsentCookie("denied");
    assert.match(denied, new RegExp(`${ANALYTICS_CONSENT_COOKIE_NAME}=denied`));
  });

  await test("changing consent overwrites cookie decision value", async () => {
    const first = formatAnalyticsConsentCookie("granted");
    const second = formatAnalyticsConsentCookie("denied");
    assert.notEqual(first, second);
    assert.match(second, /=denied/);
  });

  await test("consent cookie on app.aipify.ai includes shared production domain", async () => {
    const granted = formatAnalyticsConsentCookie("granted", "app.aipify.ai");
    assert.match(granted, new RegExp(`^${ANALYTICS_CONSENT_COOKIE_NAME}=granted`));
    if (process.env.NODE_ENV === "production") {
      assert.match(granted, /Domain=\.aipify\.ai/);
      assert.match(granted, /Secure/);
    } else {
      assert.doesNotMatch(granted, /Domain=\.aipify\.ai/);
    }
  });

  await test("consent cookie on Vercel preview host stays host-only", async () => {
    const granted = formatAnalyticsConsentCookie("granted", "aipify-platform-abc123.vercel.app");
    assert.match(granted, new RegExp(`^${ANALYTICS_CONSENT_COOKIE_NAME}=granted`));
    assert.doesNotMatch(granted, /Domain=\.aipify\.ai/);
  });

  await test("consent cookie on localhost and app.localhost stays host-only", async () => {
    const localhost = formatAnalyticsConsentCookie("granted", "localhost");
    assert.match(localhost, new RegExp(`^${ANALYTICS_CONSENT_COOKIE_NAME}=granted`));
    assert.doesNotMatch(localhost, /Domain=\.aipify\.ai/);

    const appLocalhost = formatAnalyticsConsentCookie("granted", "app.localhost");
    assert.match(appLocalhost, new RegExp(`^${ANALYTICS_CONSENT_COOKIE_NAME}=granted`));
    assert.doesNotMatch(appLocalhost, /Domain=\.aipify\.ai/);
  });

  await test("marketing, app, and partners layouts mount AnalyticsConsentProvider", async () => {
    const marketing = fs.readFileSync(
      path.join(process.cwd(), "app/(marketing)/layout.tsx"),
      "utf8"
    );
    const app = fs.readFileSync(path.join(process.cwd(), "app/app/layout.tsx"), "utf8");
    const partners = fs.readFileSync(path.join(process.cwd(), "app/partners/layout.tsx"), "utf8");

    assert.match(marketing, /AnalyticsConsentProvider/);
    assert.match(app, /AnalyticsConsentProvider/);
    assert.match(partners, /AnalyticsConsentProvider/);
  });

  await test("platform and super layouts do not mount analytics consent provider", async () => {
    const platform = fs.readFileSync(path.join(process.cwd(), "app/platform/layout.tsx"), "utf8");
    const superAdmin = fs.readFileSync(path.join(process.cwd(), "app/super/layout.tsx"), "utf8");

    assert.doesNotMatch(platform, /AnalyticsConsentProvider/);
    assert.doesNotMatch(superAdmin, /AnalyticsConsentProvider/);
  });

  await test("consent module does not reference gtag or measurement ids", async () => {
    const source = fs.readFileSync(path.join(process.cwd(), "lib/product-analytics/consent.ts"), "utf8");
    assert.doesNotMatch(source, /gtag/);
    assert.doesNotMatch(source, /G-8RWDW82MTE/);
    assert.doesNotMatch(source, /localStorage/);
  });

  await test("marketing layout does not modify MarketingAnalyticsShell", async () => {
    const marketing = fs.readFileSync(
      path.join(process.cwd(), "app/(marketing)/layout.tsx"),
      "utf8"
    );
    assert.match(marketing, /MarketingAnalyticsShell/);
    assert.doesNotMatch(marketing, /gtag/);
  });

  console.log("All analytics consent tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
