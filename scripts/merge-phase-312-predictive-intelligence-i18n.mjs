#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(fs.readFileSync(path.join(root, "locales/en/customerApp.json"), "utf8"));
const block = en.portalStructure.predictiveIntelligence;
const navVal = en.portalStructure.nav.predictiveIntelligence;

for (const loc of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(root, `locales/${loc}/customerApp.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.portalStructure.nav ??= {};
  data.portalStructure.nav.predictiveIntelligence = navVal;
  data.portalStructure.predictiveIntelligence = block;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`updated ${loc}`);
}
