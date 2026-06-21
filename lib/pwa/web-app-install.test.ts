import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../../app/manifest";
import {
  APP_WEB_APP_INSTALL_ARTICLE_PATH,
  APP_WEB_APP_INSTALL_ARTICLE_SLUG,
  auditManifest,
  isFetchNetworkError,
  markInstallPromptDismissed,
  markWebAppInstalled,
  resetInstallPromptDismissal,
  resetInstallPromptStoreForTests,
  resolveWebAppInstallCardState,
  resolveWebAppInstallModalPhase,
  resolveWebAppInstallVisibility,
  shouldShowManualInstallGuidance,
  shouldUseNativeInstallPrompt,
  wasInstallPromptDismissed,
} from "./index";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const LOCALES = ["en", "no", "sv", "da"] as const;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

function loadJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8")) as Record<string, unknown>;
}

function read(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const SAFARI_IOS_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const FIREFOX_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0";

test("manifest audit passes for app/manifest.ts", () => {
  const issues = auditManifest(manifest());
  assert.deepEqual(issues, [], issues.join("; "));
});

test("login network error mapping detects Failed to fetch", () => {
  assert.equal(isFetchNetworkError("Failed to fetch"), true);
  assert.equal(isFetchNetworkError("NetworkError when attempting to fetch resource."), true);
  assert.equal(isFetchNetworkError("Invalid email or password"), false);
});

test("install prompt dismissal is session scoped", () => {
  resetInstallPromptStoreForTests();
  assert.equal(wasInstallPromptDismissed(), false);
  markInstallPromptDismissed();
  assert.equal(wasInstallPromptDismissed(), true);
  resetInstallPromptDismissal();
  assert.equal(wasInstallPromptDismissed(), false);
  resetInstallPromptStoreForTests();
});

test("appinstalled marks installed state", () => {
  resetInstallPromptStoreForTests();
  markWebAppInstalled();
  resetInstallPromptStoreForTests();
});

test("install card resolves available state", () => {
  assert.equal(
    resolveWebAppInstallCardState({
      userAgent: CHROME_UA,
      standalone: false,
      installed: false,
      dismissed: false,
      hasDeferredPrompt: true,
    }),
    "available"
  );
});

test("install card resolves already_installed state", () => {
  assert.equal(
    resolveWebAppInstallCardState({
      userAgent: CHROME_UA,
      standalone: true,
      installed: false,
      dismissed: false,
      hasDeferredPrompt: false,
    }),
    "already_installed"
  );
});

test("install card resolves dismissed state", () => {
  assert.equal(
    resolveWebAppInstallCardState({
      userAgent: CHROME_UA,
      standalone: false,
      installed: false,
      dismissed: true,
      hasDeferredPrompt: false,
    }),
    "dismissed"
  );
});

test("install card resolves unsupported state", () => {
  assert.equal(
    resolveWebAppInstallCardState({
      userAgent: FIREFOX_UA,
      standalone: false,
      installed: false,
      dismissed: false,
      hasDeferredPrompt: false,
    }),
    "unsupported"
  );
});

test("native prompt is used only when deferred prompt exists", () => {
  assert.equal(
    shouldUseNativeInstallPrompt({
      userAgent: CHROME_UA,
      standalone: false,
      installed: false,
      dismissed: false,
      hasDeferredPrompt: true,
    }),
    true
  );
  assert.equal(
    shouldUseNativeInstallPrompt({
      userAgent: CHROME_UA,
      standalone: false,
      installed: false,
      dismissed: false,
      hasDeferredPrompt: false,
    }),
    false
  );
});

test("manual guidance is offered for Safari without deferred prompt", () => {
  assert.equal(
    shouldShowManualInstallGuidance({
      userAgent: SAFARI_IOS_UA,
      standalone: false,
      installed: false,
      dismissed: false,
      hasDeferredPrompt: false,
    }),
    true
  );
  assert.equal(
    resolveWebAppInstallModalPhase({
      userAgent: SAFARI_IOS_UA,
      standalone: false,
      installed: false,
      dismissed: false,
      hasDeferredPrompt: false,
    }),
    "manual"
  );
});

test("menu visibility hides dismissed installs without prompt", () => {
  assert.equal(
    resolveWebAppInstallVisibility({
      userAgent: CHROME_UA,
      standalone: false,
      installed: false,
      dismissed: true,
      hasDeferredPrompt: false,
    }),
    "hidden"
  );
});

test("authenticated install KC route exists", () => {
  const routePath = `app/app/support/knowledge-center/articles/[slug]/page.tsx`;
  assert.ok(fs.existsSync(path.join(ROOT, routePath)));
  assert.equal(APP_WEB_APP_INSTALL_ARTICLE_SLUG, "installing-aipify-web-app");
  assert.equal(
    APP_WEB_APP_INSTALL_ARTICLE_PATH,
    "/app/support/knowledge-center/articles/installing-aipify-web-app"
  );
});

test("authenticated preferences use install card not public install route", () => {
  const panel = read("components/app/account/AccountPreferencesPanel.tsx");
  const card = read("components/pwa/AipifyWebAppInstallCard.tsx");
  assert.match(panel, /AipifyWebAppInstallCard/);
  assert.doesNotMatch(panel, /href=["']\/install["']/);
  assert.match(card, /APP_WEB_APP_INSTALL_ARTICLE_PATH/);
});

test("PwaInstallProvider does not redirect authenticated flow to /install", () => {
  const provider = read("components/pwa/PwaInstallProvider.tsx");
  assert.doesNotMatch(provider, /window\.location\.href\s*=\s*["']\/install["']/);
  assert.doesNotMatch(provider, /location\.href\s*=\s*["']\/install["']/);
});

test("pwa locale keys exist in four languages", () => {
  for (const locale of LOCALES) {
    const pwa = loadJson(`locales/${locale}/pwa.json`);
    assert.ok(pwa.installAipify, `${locale} missing installAipify`);
    assert.ok(pwa.modalTitle, `${locale} missing modalTitle`);
    assert.ok(pwa.continueInstall, `${locale} missing continueInstall`);
    const card = pwa.installCard as Record<string, string> | undefined;
    assert.ok(card?.availableTitle, `${locale} missing installCard.availableTitle`);
    assert.ok(card?.dismissedTitle, `${locale} missing installCard.dismissedTitle`);
    const guidance = pwa.modalGuidance as Record<string, string> | undefined;
    assert.ok(guidance?.manualTitle, `${locale} missing modalGuidance.manualTitle`);
    assert.ok(guidance?.unsupportedTitle, `${locale} missing modalGuidance.unsupportedTitle`);
  }
});

test("notification preferences empty state exists in four languages", () => {
  for (const locale of LOCALES) {
    const portal = loadJson(`locales/${locale}/customer-app/portalStructure.json`) as {
      portalStructure?: { pages?: { accountNotifications?: Record<string, string> } };
    };
    const page = portal.portalStructure?.pages?.accountNotifications ?? {};
    assert.ok(page.emptyTitle, `${locale} missing accountNotifications.emptyTitle`);
    assert.ok(page.emptyDescription, `${locale} missing accountNotifications.emptyDescription`);
    assert.ok(page.emptyAction, `${locale} missing accountNotifications.emptyAction`);
  }
});

test("auth network error strings exist in four languages", () => {
  for (const locale of LOCALES) {
    const auth = loadJson(`locales/${locale}/auth.json`) as { errors?: Record<string, string> };
    assert.ok(auth.errors?.networkTitle, `${locale} missing auth.errors.networkTitle`);
    assert.ok(auth.errors?.networkBody, `${locale} missing auth.errors.networkBody`);
  }
});

test("installing-aipify-web-app article and 28 FAQs in marketing locales", () => {
  for (const locale of LOCALES) {
    const marketing = loadJson(`locales/${locale}/marketing.json`) as {
      publicKnowledge?: {
        articles?: Record<string, { title?: string }>;
        faqs?: Record<string, Record<string, { q?: string; a?: string }>>;
      };
    };
    const article = marketing.publicKnowledge?.articles?.["installing-aipify-web-app"];
    assert.ok(article?.title, `${locale}: missing article title`);
    const faqs = marketing.publicKnowledge?.faqs?.["installing-aipify-web-app"] ?? {};
    assert.equal(Object.keys(faqs).length, 28, `${locale}: expected 28 FAQs`);
  }
});

test("/install route page exists for logged-out users", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "app/(marketing)/install/page.tsx")));
});

test("service worker bypasses cache for auth routes", () => {
  const sw = read("public/sw.js");
  assert.match(sw, /\/login/);
  assert.match(sw, /\/app/);
  assert.match(sw, /\/api\//);
  assert.match(sw, /shouldBypassServiceWorkerCache/);
  assert.match(sw, /Response\.error\(\)/);
  assert.match(sw, /passthroughFetch/);
});

console.log("web-app-install tests passed");
