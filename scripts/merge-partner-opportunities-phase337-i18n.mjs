#!/usr/bin/env node
/** Phase 337 — Partner Opportunity Center i18n */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/partnerOpportunities.json"), "utf8"),
);

const overrides = {
  no: { loading: "Forbereder mulighetspipeline …", title: "Mulighetssenter" },
  sv: { loading: "Förbereder möjlighetspipeline …", title: "Möjlighetscenter" },
  da: { loading: "Forbereder mulighedspipeline …", title: "Mulighedscenter" },
};

for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/partnerOpportunities.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...en, ...(overrides[locale] ?? {}) }, null, 2)}\n`);
  console.log("wrote", file);
}

let config = fs.readFileSync(path.join(ROOT, "lib/i18n/config.ts"), "utf8");
if (!config.includes('"partnerOpportunities"')) {
  config = config.replace('"partnerMaterials",', '"partnerMaterials",\n  "partnerOpportunities",');
  fs.writeFileSync(path.join(ROOT, "lib/i18n/config.ts"), config);
}
