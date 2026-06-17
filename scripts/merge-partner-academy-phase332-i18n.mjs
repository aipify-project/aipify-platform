#!/usr/bin/env node
/** Phase 332 — Partner Academy Foundation i18n */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/partnerAcademy.json"), "utf8"),
);

const overrides = {
  no: {
    title: "Partner Academy",
    loading: "Forbereder læringsopplevelsen din …",
    emptyTitle: "Velkommen til Aipify Partner Academy.",
    startLearning: "Start læring",
  },
  sv: {
    title: "Partner Academy",
    loading: "Förbereder din lärupplevelse …",
    emptyTitle: "Välkommen till Aipify Partner Academy.",
    startLearning: "Börja lära",
  },
  da: {
    title: "Partner Academy",
    loading: "Forbereder din læringsoplevelse …",
    emptyTitle: "Velkommen til Aipify Partner Academy.",
    startLearning: "Start læring",
  },
};

for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/partnerAcademy.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...en, ...(overrides[locale] ?? {}) }, null, 2)}\n`);
  console.log("wrote", file);
}

let config = fs.readFileSync(path.join(ROOT, "lib/i18n/config.ts"), "utf8");
if (!config.includes('"partnerAcademy"')) {
  config = config.replace('"partnerPortal",', '"partnerPortal",\n  "partnerAcademy",');
  fs.writeFileSync(path.join(ROOT, "lib/i18n/config.ts"), config);
}
