#!/usr/bin/env node
/**
 * Sync missing marketing.json sections from English into no/sv/da with locale translations.
 * Run: node scripts/sync-marketing-i18n.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateMarketingTree } from "../lib/marketing/i18n/marketing-translator.mjs";
import { MARKETING_SURFACE_PATCHES } from "../lib/marketing/i18n/marketing-surface-patches.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TARGET_LOCALES = ["no", "sv", "da"];

/** Top-level sections synced from English with phrase translation + overrides. */
const SECTIONS_TO_SYNC = [
  "homepageRedesign",
  "platformAuthority",
  "productPageRedesign",
  "publicPages",
  "growthPartnersPageRedesign",
  "knowledgePageRedesign",
  "meta",
  "nav",
  "footer",
  "hero",
  "valueStrip",
  "trustBar",
  "pricingPage",
  "installPage",
];

function loadJson(rel) {
  return JSON.parse(readFileSync(path.join(root, rel), "utf8"));
}

function saveJson(rel, data) {
  writeFileSync(path.join(root, rel), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function deepMerge(base, overlay) {
  const result = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const baseValue = base[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      result[key] = deepMerge(baseValue, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

const en = loadJson("locales/en/marketing.json");

for (const locale of TARGET_LOCALES) {
  const rel = `locales/${locale}/marketing.json`;
  let target = loadJson(rel);

  for (const section of SECTIONS_TO_SYNC) {
    if (!en[section]) continue;
    if (section === "nav" || section === "footer") {
      continue;
    }
    const translated = translateMarketingTree(en[section], locale, section);
    target[section] = deepMerge(translated, target[section] ?? {});
  }

  const surfacePatch = MARKETING_SURFACE_PATCHES[locale];
  if (surfacePatch) {
    target = deepMerge(target, surfacePatch);
  }

  // Hoist publicPages if it was incorrectly nested under digitalHeadquarters
  if (!target.publicPages && target.digitalHeadquarters?.publicPages) {
    target.publicPages = target.digitalHeadquarters.publicPages;
    const { publicPages: _removed, ...restDh } = target.digitalHeadquarters;
    target.digitalHeadquarters = restDh;
  }

  // Translate business pack detail shared labels if still English
  if (target.businessPackDetailPages?.shared) {
    target.businessPackDetailPages.shared = translateMarketingTree(
      en.businessPackDetailPages?.shared ?? target.businessPackDetailPages.shared,
      locale,
      "businessPackDetailPages.shared",
    );
  }

  saveJson(rel, target);
  console.log(`✓ Updated ${rel}`);
}

console.log("\nMarketing locale sync complete.");
