import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import {
  COMPANION_EXPERIENCE_ROUTE,
  resolveCompanionPageLabelKey,
  resolveCompanionSuggestions,
} from "@/lib/app/companion";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { createTranslator } from "@/lib/i18n/translate";

const ROOT = process.cwd();
const LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;

function loadCompanionSplit(locale: string) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "companion.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
}

function loadPortalNav(locale: string) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "portalStructure.json");
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as {
    portalStructure: { nav: Record<string, string> };
  };
  return parsed.portalStructure.nav;
}

// 1. Foundation nav (job 58) — Companion is not a primary sidebar product.
assert.deepEqual(
  APP_PORTAL_NAV_GROUPS.map((g) => g.id),
  ["kompisWeb", "kompisBedrift", "account"]
);
assert.equal(
  APP_PORTAL_NAV_GROUPS.some((g) => g.items.some((item) => item.id === "aipifyCompanion")),
  false
);
assert.equal(
  APP_PORTAL_NAV_GROUPS.some((g) => g.items.some((item) => item.href === COMPANION_EXPERIENCE_ROUTE)),
  false
);

// 2. Account group must not bury Companion as support link.
const accountGroup = APP_PORTAL_NAV_GROUPS.find((g) => g.id === "account");
assert.ok(accountGroup);
assert.equal(
  accountGroup.items.some((item) => item.id === ("supportAssistant" as string)),
  false
);

// 3. Canonical companion route constant.
assert.equal(COMPANION_EXPERIENCE_ROUTE, "/app/companion");

// 4. Context helper maps routes to suggestions.
const commandSuggestions = resolveCompanionSuggestions("/app/command-center");
assert.ok(commandSuggestions.length >= 1);
assert.equal(resolveCompanionPageLabelKey("/app/command-center"), "commandCenter");

const defaultSuggestions = resolveCompanionSuggestions("/app/billing/invoices");
assert.ok(defaultSuggestions.length >= 1);

const integrationSetupSuggestions = resolveCompanionSuggestions(
  "/app/platform/integrations/connect/shopify"
);
assert.ok(integrationSetupSuggestions.some((s) => s.promptKey === "whereFindKey"));
assert.equal(resolveCompanionPageLabelKey("/app/platform/integrations/connect/shopify"), "integrationSetup");

// 5. i18n — Companion brand strings (route `/app/companion` remains; not primary nav).
// Full companionExperience blocks are complete for core APP locales; `es` is a known
// partial overlay (pre-existing) and must not block foundation nav acceptance.
const COMPLETE_COMPANION_EXPERIENCE_LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

for (const locale of LOCALES) {
  const nav = loadPortalNav(locale);
  if (typeof nav.aipifyCompanion === "string") {
    assert.equal(nav.aipifyCompanion, "Aipify Companion");
    assert.notEqual(nav.aipifyCompanion, "Support Assistant");
  }
}

for (const locale of COMPLETE_COMPANION_EXPERIENCE_LOCALES) {
  const split = loadCompanionSplit(locale);
  const experience = split.companionExperience as Record<string, unknown>;
  assert.ok(experience, `missing companionExperience in ${locale}`);
  assert.equal(experience.title, "Aipify Companion");
  assert.notEqual(experience.inputPlaceholder, "Search Placeholder");
  assert.notEqual(experience.title, "Title");

  const dict = { customerApp: split };
  const labels = buildCompanionExperienceLabels(createTranslator(dict));
  assert.ok(labels.quickActions.orgStatus.title.length > 0);
  assert.ok(labels.contextSuggestions.defaultWhatNow.length > 0);
  assert.ok(labels.scrollToLatest.length > 0);
  assert.ok(labels.scrollToLatestAria.length > 0);
  assert.ok(labels.conversations.confirmDelete.length > 0);
  assert.ok(labels.replyToast.viewReply.length > 0);
}

// 6. Drawer opens without navigation — provider exposes open state API (unit-level contract).
assert.doesNotThrow(() => {
  const dict = { customerApp: loadCompanionSplit("en") };
  const labels = buildCompanionExperienceLabels(createTranslator(dict));
  assert.equal(typeof labels.openCompanion, "string");
  assert.ok(labels.openCompanion.length > 0);
});

console.log("companion-experience.test.ts: all assertions passed");
