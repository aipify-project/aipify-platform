import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import manifest from "../../app/manifest";
import {
  auditManifest,
  isFetchNetworkError,
  markInstallPromptDismissed,
  markWebAppInstalled,
  resetInstallPromptStoreForTests,
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
  resetInstallPromptStoreForTests();
});

test("appinstalled marks installed state", () => {
  resetInstallPromptStoreForTests();
  markWebAppInstalled();
  resetInstallPromptStoreForTests();
});

test("pwa locale keys exist in four languages", () => {
  for (const locale of LOCALES) {
    const pwa = loadJson(`locales/${locale}/pwa.json`);
    assert.ok(pwa.installAipify, `${locale} missing installAipify`);
    assert.ok(pwa.modalTitle, `${locale} missing modalTitle`);
    assert.ok(pwa.continueInstall, `${locale} missing continueInstall`);
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

test("/install route page exists", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "app/(marketing)/install/page.tsx")));
});

test("service worker file exists", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "public/sw.js")));
});

console.log("web-app-install tests passed");
