import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

const PANEL_KEYS = [
  "title",
  "subtitle",
  "principle",
  "overview",
  "activeDomains",
  "pendingDomains",
  "domainLicenses",
  "installedPacks",
  "usage",
  "domainSettings",
  "purchased",
  "used",
  "available",
  "addDomain",
  "purchaseLicense",
  "platform",
  "status",
  "packs",
  "primary",
  "accessDenied",
  "storeLink",
  "back",
  "domainPlaceholder",
  "selectPlatform",
  "save",
] as const;

const WEBSITE_KOMPIS_KEYS = [
  "metadataUrlLabel",
  "sourcePriority",
  "publicSiteIndexComingLater",
] as const;

for (const locale of LOCALES) {
  const domainLicense = JSON.parse(
    readFileSync(join("locales", locale, "customer-app/settings.json"), "utf8"),
  ).domainLicense as {
    websiteKompis?: Record<string, string>;
  } & Record<string, unknown>;

  for (const key of PANEL_KEYS) {
    const value = domainLicense[key];
    assert.equal(typeof value, "string", `${locale} domainLicense.${key}`);
    assert.ok(String(value).trim().length > 0, `${locale} domainLicense.${key} empty`);
  }

  for (const key of WEBSITE_KOMPIS_KEYS) {
    const value = domainLicense.websiteKompis?.[key];
    assert.equal(typeof value, "string", `${locale} domainLicense.websiteKompis.${key}`);
    assert.ok(String(value).trim().length > 0, `${locale} domainLicense.websiteKompis.${key} empty`);
  }
}

console.log("domain-license-locale.test.ts: OK");
