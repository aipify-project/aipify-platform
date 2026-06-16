#!/usr/bin/env node
/**
 * Merge Phase 269 decisionCenter i18n from en into no/sv/da/es/pl/uk.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(fs.readFileSync(path.join(root, "locales/en/customerApp.json"), "utf8"));
const block = en.portalStructure.decisionCenter;
const navKey = "decisionCenter";
const navVal = en.portalStructure.nav[navKey];

const locales = ["no", "sv", "da", "es", "pl", "uk"];

for (const loc of locales) {
  const file = path.join(root, `locales/${loc}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!data.portalStructure) {
    console.warn(`skip ${loc}: no portalStructure`);
    continue;
  }
  data.portalStructure.nav[navKey] = navVal;
  data.portalStructure.decisionCenter = block;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`updated ${loc}`);
}
