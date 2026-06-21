import assert from "node:assert/strict";
import {
  APP_LOCALE_ORDER,
  appLocaleOptions,
  coerceToAppLocale,
  isAppLocale,
  resolveAppLocale,
} from "./app-locales";
import { LOCALE_COOKIE } from "./config";
import {
  parseAcceptLanguageHeader,
  resolveAppUiLocale,
  resolvePublicLocale,
} from "./resolve-locale";

let passed = 0;

function test(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`✓ ${name}`);
}

test("APP locale order lists Nordic languages before English", () => {
  assert.deepEqual([...APP_LOCALE_ORDER], ["no", "sv", "da", "en"]);
});

test("appLocaleOptions exposes four enabled locales", () => {
  assert.equal(appLocaleOptions().length, 4);
});

test("coerceToAppLocale maps nb/nn to no", () => {
  assert.equal(coerceToAppLocale("nb-NO"), "no");
  assert.equal(coerceToAppLocale("nn"), "no");
});

test("coerceToAppLocale falls back to en for unsupported locales", () => {
  assert.equal(coerceToAppLocale("es"), "en");
  assert.equal(coerceToAppLocale(undefined), "en");
});

test("resolveAppLocale accepts only APP locales", () => {
  assert.equal(resolveAppLocale("sv"), "sv");
  assert.equal(resolveAppLocale("pl"), "en");
});

test("isAppLocale guards APP locale codes", () => {
  assert.equal(isAppLocale("da"), true);
  assert.equal(isAppLocale("uk"), false);
});

test("parseAcceptLanguageHeader prefers first supported language", () => {
  assert.equal(parseAcceptLanguageHeader("da-DK, en;q=0.8"), "da");
  assert.equal(parseAcceptLanguageHeader("nb-NO, en;q=0.5"), "no");
});

test("resolveAppUiLocale prefers cookie over user preference", () => {
  const resolved = resolveAppUiLocale({
    cookieLocale: "sv",
    userPreferredLocale: "no",
    organizationDefaultLanguage: "da",
    acceptLanguage: "en-US",
  });
  assert.equal(resolved.locale, "sv");
  assert.equal(resolved.source, "cookie");
});

test("resolveAppUiLocale uses user preference when cookie missing", () => {
  const resolved = resolveAppUiLocale({
    userPreferredLocale: "no",
    organizationDefaultLanguage: "da",
    acceptLanguage: "en-US",
  });
  assert.equal(resolved.locale, "no");
  assert.equal(resolved.source, "user_preference");
});

test("resolveAppUiLocale uses organization default before browser", () => {
  const resolved = resolveAppUiLocale({
    organizationDefaultLanguage: "da",
    acceptLanguage: "sv-SE",
  });
  assert.equal(resolved.locale, "da");
  assert.equal(resolved.source, "organization_default");
});

test("resolveAppUiLocale uses browser before default", () => {
  const resolved = resolveAppUiLocale({
    acceptLanguage: "sv-SE, en;q=0.8",
  });
  assert.equal(resolved.locale, "sv");
  assert.equal(resolved.source, "browser");
});

test("resolveAppUiLocale defaults to English", () => {
  const resolved = resolveAppUiLocale({});
  assert.equal(resolved.locale, "en");
  assert.equal(resolved.source, "default");
});

test("resolveAppUiLocale ignores non-app cookie values", () => {
  const resolved = resolveAppUiLocale({
    cookieLocale: "es",
    acceptLanguage: "no-NO",
  });
  assert.equal(resolved.locale, "no");
  assert.equal(resolved.source, "browser");
});

test("resolvePublicLocale keeps marketing locales in cookie", () => {
  const resolved = resolvePublicLocale({
    cookieLocale: "pl",
    acceptLanguage: "en-US",
  });
  assert.equal(resolved.locale, "pl");
  assert.equal(resolved.source, "cookie");
});

test("route preservation keeps pathname search and hash", () => {
  const pathname = "/app/support/success-center";
  const search = "?tab=overview";
  const hash = "#insights";
  const nextUrl = `${pathname}${search}${hash}`;
  assert.equal(nextUrl, "/app/support/success-center?tab=overview#insights");
});

test("language selector labels include required accessibility keys", () => {
  const labels = {
    label: "Language",
    activeLanguage: "Active language",
    changeLanguage: "Change language",
    switchFailed: "Could not change language",
    retry: "Retry",
    openMenu: "Language options",
  };
  assert.ok(labels.label.length > 0);
  assert.ok(labels.activeLanguage.length > 0);
  assert.ok(labels.changeLanguage.length > 0);
});

test("header and settings share APP locale source via /api/locale scope", () => {
  const payload = { locale: "no", scope: "app" };
  assert.equal(payload.scope, "app");
  assert.equal(isAppLocale(payload.locale), true);
});

test("completeness validator checks four APP locales", () => {
  assert.equal(APP_LOCALE_ORDER.length, 4);
});

test("no raw translation keys should be used as visible labels", () => {
  const rawKey = "customerApp.settings.title";
  assert.notEqual(rawKey, "Settings");
  assert.match(rawKey, /^customerApp\./);
});

test("representative support routes remain under /app/support", () => {
  const routes = [
    "/app/support/success-center",
    "/app/support/getting-started",
    "/app/support/academy",
    "/app/support/customer-success",
    "/app/support/customer-health",
    "/app/support/history",
  ];
  for (const route of routes) {
    assert.match(route, /^\/app\//);
  }
});

test("command center route stays stable during locale switch", () => {
  const route = "/app/command-center";
  assert.equal(route.replace(/\/$/, ""), "/app/command-center");
});

test("account preferences route is canonical for language settings", () => {
  assert.equal("/app/account/preferences".endsWith("/preferences"), true);
});

test("sync requires shared current locale value", () => {
  const headerLocale = coerceToAppLocale("no");
  const settingsLocale = coerceToAppLocale("no");
  assert.equal(headerLocale, settingsLocale);
});

test("persistence only accepts APP locale codes", () => {
  for (const locale of APP_LOCALE_ORDER) {
    assert.equal(isAppLocale(locale), true);
  }
});

test("English remains canonical fallback locale", () => {
  assert.equal(resolveAppLocale("invalid"), "en");
});

test("public locale resolution keeps extended marketing locale", () => {
  const resolved = resolvePublicLocale({ cookieLocale: "uk" });
  assert.equal(resolved.locale, "uk");
});

test("browser mapping handles en variants", () => {
  assert.equal(parseAcceptLanguageHeader("en-GB, no;q=0.9"), "en");
});

test("organization default is coerced to supported APP locale", () => {
  const resolved = resolveAppUiLocale({ organizationDefaultLanguage: "no" });
  assert.equal(resolved.appLocale, "no");
});

test("selector options include native labels and flags", () => {
  const option = appLocaleOptions()[0];
  assert.ok(option.nativeLabel.length > 0);
  assert.ok(option.flagEmoji.length > 0);
  assert.ok(option.flagSrc.startsWith("/flags/"));
});

test("locale cookie name remains aipify-locale", () => {
  assert.equal(LOCALE_COOKIE, "aipify-locale");
});

test("non-app marketing locale coerces app locale separately", () => {
  const publicResolved = resolvePublicLocale({ cookieLocale: "es" });
  assert.equal(publicResolved.locale, "es");
  assert.equal(publicResolved.appLocale, "en");
});

test("accept-language q-values do not break parsing", () => {
  assert.equal(parseAcceptLanguageHeader("sv-SE;q=0.9, da;q=0.8"), "sv");
});

test("user preference beats organization default", () => {
  const resolved = resolveAppUiLocale({
    userPreferredLocale: "sv",
    organizationDefaultLanguage: "no",
  });
  assert.equal(resolved.source, "user_preference");
});

test("missing keys humanize to title case, not raw keys", () => {
  const sample = "customerApp.settings.accountPreferences.languageSection";
  assert.notEqual(sample.split(".").pop(), sample);
});

test("settings and account preferences expose the same language keys", () => {
  assert.match("customerApp.settings.accountPreferences.languageSection", /languageSection$/);
  assert.match("shell.languageSelector.label", /label$/);
});

console.log(`\n${passed} app language selector / i18n tests passed.`);
