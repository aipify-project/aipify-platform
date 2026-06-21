import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseProductPageContent } from "./parse-product-page";
import {
  loadMarketingDictionary,
  validateMarketingLocaleCompleteness,
} from "./validate-marketing-locale-completeness";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));

// 1. Completeness validator passes for en/no/sv/da.
const completeness = validateMarketingLocaleCompleteness(root);
assert.equal(completeness.passed, true, formatCompletenessFailure(completeness));

// 2–4. Product hero is localized (not English fallback title).
const EN_HERO_TITLE = "One platform for operational clarity, governed execution, and human control.";
for (const locale of ["no", "sv", "da"] as const) {
  const marketing = loadMarketingDictionary(root, locale);
  const content = parseProductPageContent(marketing);
  assert.notEqual(content.hero.title, EN_HERO_TITLE, `${locale} hero title still English`);
}

// 5–7. Command Brief demo uses localized since-items.
const EN_DEMO_SINCE = "6 salon appointments confirmed for this week";
for (const locale of ["no", "sv", "da"] as const) {
  const content = parseProductPageContent(loadMarketingDictionary(root, locale));
  assert.notEqual(content.commandBriefSection.demo.sinceItems[0], EN_DEMO_SINCE, `${locale} demo still English`);
}

// 8–10. Breadcrumbs localized.
assert.equal(parseProductPageContent(loadMarketingDictionary(root, "no")).breadcrumbs.home, "Hjem");
assert.equal(parseProductPageContent(loadMarketingDictionary(root, "sv")).breadcrumbs.home, "Hem");
assert.equal(parseProductPageContent(loadMarketingDictionary(root, "da")).breadcrumbs.home, "Hjem");

// 11–13. Norwegian/Swedish/Danish hero CTAs not raw English defaults.
assert.match(parseProductPageContent(loadMarketingDictionary(root, "no")).hero.ctaSecondary, /Aipify/i);
assert.match(parseProductPageContent(loadMarketingDictionary(root, "sv")).hero.ctaSecondary, /Aipify/i);
assert.match(parseProductPageContent(loadMarketingDictionary(root, "da")).hero.ctaSecondary, /Aipify/i);

// 14–16. Command Brief section titles localized.
assert.match(
  parseProductPageContent(loadMarketingDictionary(root, "no")).commandBriefSection.title,
  /Command Brief/i,
);
assert.match(
  parseProductPageContent(loadMarketingDictionary(root, "no")).commandBriefSection.points[0]?.title ?? "",
  /Siden/i,
);

// 17. Engines UI labels exist and are not empty.
const noEngines = parseProductPageContent(loadMarketingDictionary(root, "no")).engines.ui;
assert.ok(noEngines.primaryLabel.length > 0);
assert.ok(noEngines.signalLabel.length > 0);

// 18–20. No raw translation keys in product meta/hero (marketing.* pattern).
for (const locale of ["no", "sv", "da"] as const) {
  const content = parseProductPageContent(loadMarketingDictionary(root, locale));
  assert.doesNotMatch(content.hero.title, /^marketing\./);
  assert.doesNotMatch(content.meta.title, /^marketing\./);
  assert.doesNotMatch(content.hero.subtitle, /^productPageRedesign\./);
}

// 21. productPageRedesign section exists in all core locales.
for (const locale of ["en", "no", "sv", "da"] as const) {
  const marketing = loadMarketingDictionary(root, locale);
  assert.ok(marketing.productPageRedesign, `${locale} missing productPageRedesign`);
}

// 22. homepageRedesign section exists in all core locales.
for (const locale of ["en", "no", "sv", "da"] as const) {
  const marketing = loadMarketingDictionary(root, locale);
  assert.ok(marketing.homepageRedesign, `${locale} missing homepageRedesign`);
}

function formatCompletenessFailure(result: ReturnType<typeof validateMarketingLocaleCompleteness>): string {
  return result.issues
    .slice(0, 5)
    .map((issue) => `${issue.locale}:${issue.key}`)
    .join(", ");
}

console.log("marketing-i18n: 22 scenarios passed");
