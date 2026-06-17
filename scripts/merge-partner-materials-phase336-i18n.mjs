#!/usr/bin/env node
/** Phase 336 — Partner Sales Materials Center i18n */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/partnerMaterials.json"), "utf8"),
);

const overrides = {
  no: {
    loading: "Forbereder salgsmateriell …",
    title: "Salgsmateriellsenter",
  },
  sv: {
    loading: "Förbereder säljmaterial …",
    title: "Säljmaterialcenter",
  },
  da: {
    loading: "Forbereder salgsmaterialer …",
    title: "Salgsmaterialcenter",
  },
};

for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/partnerMaterials.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...en, ...(overrides[locale] ?? {}) }, null, 2)}\n`);
  console.log("wrote", file);
}

let config = fs.readFileSync(path.join(ROOT, "lib/i18n/config.ts"), "utf8");
if (!config.includes('"partnerMaterials"')) {
  config = config.replace('"partnerCompliance",', '"partnerCompliance",\n  "partnerMaterials",');
  fs.writeFileSync(path.join(ROOT, "lib/i18n/config.ts"), config);
}
