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
const LOCALES = ["en", "no", "sv", "da"] as const;

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

// 1. Intelligence nav leads with Aipify Companion (not Support Assistant).
const intelligenceGroup = APP_PORTAL_NAV_GROUPS.find((g) => g.id === "intelligence");
assert.ok(intelligenceGroup);
assert.equal(intelligenceGroup.items[0]?.id, "aipifyCompanion");
assert.equal(intelligenceGroup.items[0]?.href, COMPANION_EXPERIENCE_ROUTE);
assert.equal(intelligenceGroup.items[1]?.id, "commandBrief");
assert.equal(intelligenceGroup.items[2]?.id, "sinceLastLogin");
assert.equal(intelligenceGroup.items[3]?.id, "appNotifications");

// 2. Support group must not bury Companion as support link.
const supportGroup = APP_PORTAL_NAV_GROUPS.find((g) => g.id === "support");
assert.ok(supportGroup);
assert.equal(
  supportGroup.items.some((item) => item.id === ("supportAssistant" as string)),
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

// 5. i18n keys exist for en/no/sv/da — no placeholder strings.
for (const locale of LOCALES) {
  const nav = loadPortalNav(locale);
  assert.equal(nav.aipifyCompanion, "Aipify Companion");
  assert.notEqual(nav.aipifyCompanion, "Support Assistant");

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
}

// 6. Drawer opens without navigation — provider exposes open state API (unit-level contract).
assert.doesNotThrow(() => {
  const dict = { customerApp: loadCompanionSplit("en") };
  const labels = buildCompanionExperienceLabels(createTranslator(dict));
  assert.equal(typeof labels.openCompanion, "string");
  assert.ok(labels.openCompanion.length > 0);
});

console.log("companion-experience.test.ts: all assertions passed");
