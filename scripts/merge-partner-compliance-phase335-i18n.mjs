#!/usr/bin/env node
/** Phase 335 — Partner Self-Billing & Compliance Center i18n */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/partnerCompliance.json"), "utf8"),
);

const overrides = {
  no: {
    loading: "Gjennomgår partnerens compliance-status …",
    emptyTitle: "Fullfør compliance-oppsett for å aktivere partnerutbetalinger.",
  },
  sv: {
    loading: "Granskar partnerns compliance-status …",
    emptyTitle: "Slutför compliance-inställningen för att aktivera partnerutbetalningar.",
  },
  da: {
    loading: "Gennemgår partnerens compliance-status …",
    emptyTitle: "Fuldfør compliance-opsætning for at aktivere partnerudbetalinger.",
  },
};

for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/partnerCompliance.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...en, ...(overrides[locale] ?? {}) }, null, 2)}\n`);
  console.log("wrote", file);
}

let config = fs.readFileSync(path.join(ROOT, "lib/i18n/config.ts"), "utf8");
if (!config.includes('"partnerCompliance"')) {
  config = config.replace('"partnerSettlements",', '"partnerSettlements",\n  "partnerCompliance",');
  fs.writeFileSync(path.join(ROOT, "lib/i18n/config.ts"), config);
}

const portalPath = path.join(ROOT, "locales/en/partnerPortal.json");
const portal = JSON.parse(fs.readFileSync(portalPath, "utf8"));
if (!portal.nav.compliance) {
  portal.nav.compliance = "Compliance Center";
  fs.writeFileSync(portalPath, `${JSON.stringify(portal, null, 2)}\n`);
  for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
    const file = path.join(ROOT, `locales/${locale}/partnerPortal.json`);
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, "utf8"));
      data.nav = data.nav ?? {};
      data.nav.compliance = data.nav.compliance ?? "Compliance Center";
      fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
    }
  }
}
