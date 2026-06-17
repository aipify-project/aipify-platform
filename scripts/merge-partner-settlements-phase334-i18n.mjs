#!/usr/bin/env node
/** Phase 334 — Partner Settlement & Self-Billing Engine i18n */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/partnerSettlements.json"), "utf8"),
);

const overrides = {
  no: {
    loading: "Forbereder oppgjørsoversikt …",
    noPayableTitle: "Ingen utbetalbart oppgjør denne måneden",
    noPayableMessage: "Ingen utbetalbart oppgjør denne måneden.",
  },
  sv: {
    loading: "Förbereder avräkningsöversikt …",
    noPayableTitle: "Ingen utbetalbar avräkning denna månad",
    noPayableMessage: "Ingen utbetalbar avräkning denna månad.",
  },
  da: {
    loading: "Forbereder afregningsoversigt …",
    noPayableTitle: "Intet udbetalbart afregning denne måned",
    noPayableMessage: "Intet udbetalbart afregning denne måned.",
  },
};

for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/partnerSettlements.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...en, ...(overrides[locale] ?? {}) }, null, 2)}\n`);
  console.log("wrote", file);
}

let config = fs.readFileSync(path.join(ROOT, "lib/i18n/config.ts"), "utf8");
if (!config.includes('"partnerSettlements"')) {
  config = config.replace('"partnerCommissions",', '"partnerCommissions",\n  "partnerSettlements",');
  fs.writeFileSync(path.join(ROOT, "lib/i18n/config.ts"), config);
}
