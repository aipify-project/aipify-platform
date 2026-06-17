#!/usr/bin/env node
/** Phase 333 — Partner Commission Engine i18n */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/partnerCommissions.json"), "utf8"),
);

const overrides = {
  no: {
    loading: "Beregner provisjonsprestasjon …",
    emptyTitle: "Ingen provisjoner er opptjent ennå.",
    viewOpportunities: "Se muligheter",
  },
  sv: {
    loading: "Beräknar provisionsprestanda …",
    emptyTitle: "Inga provisioner har intjänats ännu.",
    viewOpportunities: "Visa möjligheter",
  },
  da: {
    loading: "Beregner provisionsperformance …",
    emptyTitle: "Ingen provisioner er optjent endnu.",
    viewOpportunities: "Se muligheder",
  },
};

for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/partnerCommissions.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...en, ...(overrides[locale] ?? {}) }, null, 2)}\n`);
  console.log("wrote", file);
}

let config = fs.readFileSync(path.join(ROOT, "lib/i18n/config.ts"), "utf8");
if (!config.includes('"partnerCommissions"')) {
  config = config.replace('"partnerAcademy",', '"partnerAcademy",\n  "partnerCommissions",');
  fs.writeFileSync(path.join(ROOT, "lib/i18n/config.ts"), config);
}
