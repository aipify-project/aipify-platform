#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(fs.readFileSync(path.join(root, "locales/en/partnersPortal.json"), "utf8"));
const block = en.economyEngine;
const navGroup = en.navGroups.settlement;
const navVal = en.nav.settlementPortal;

for (const loc of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(root, `locales/${loc}/partnersPortal.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.navGroups ??= {};
  data.nav ??= {};
  data.navGroups.settlement = navGroup;
  data.nav.settlementPortal = navVal;
  data.economyEngine = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`updated ${loc}`);
}
