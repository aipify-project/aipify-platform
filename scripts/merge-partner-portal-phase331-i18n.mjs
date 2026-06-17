#!/usr/bin/env node
/** Phase 331 — Growth Partner Portal Foundation i18n */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/partnerPortal.json"), "utf8"),
);

const overrides = {
  no: {
    portalTitle: "Growth Partner-arbeidsområde",
    loading: "Forbereder Growth Partner-arbeidsområdet ditt …",
    emptyWelcomeTitle: "Velkommen til Aipify Growth Partners.",
    nav: {
      dashboard: "Dashbord",
      opportunities: "Muligheter",
      customers: "Kunder",
      academy: "Akademi",
      materials: "Materialer",
      commissions: "Provisjoner",
      settlements: "Oppgjør",
      performance: "Ytelse",
      advisor: "Rådgiver",
      settings: "Innstillinger",
    },
  },
  sv: {
    portalTitle: "Growth Partner-arbetsyta",
    loading: "Förbereder din Growth Partner-arbetsyta …",
    emptyWelcomeTitle: "Välkommen till Aipify Growth Partners.",
    nav: {
      dashboard: "Instrumentpanel",
      opportunities: "Möjligheter",
      customers: "Kunder",
      academy: "Akademi",
      materials: "Material",
      commissions: "Provisioner",
      settlements: "Avräkningar",
      performance: "Prestanda",
      advisor: "Rådgivare",
      settings: "Inställningar",
    },
  },
  da: {
    portalTitle: "Growth Partner-arbejdsområde",
    loading: "Forbereder dit Growth Partner-arbejdsområde …",
    emptyWelcomeTitle: "Velkommen til Aipify Growth Partners.",
    nav: {
      dashboard: "Dashboard",
      opportunities: "Muligheder",
      customers: "Kunder",
      academy: "Akademi",
      materials: "Materialer",
      commissions: "Provisioner",
      settlements: "Afregninger",
      performance: "Performance",
      advisor: "Rådgiver",
      settings: "Indstillinger",
    },
  },
  es: { portalTitle: "Espacio de Growth Partner", loading: "Preparando su espacio de Growth Partner…" },
  pl: { portalTitle: "Przestrzeń Growth Partner", loading: "Przygotowywanie przestrzeni Growth Partner…" },
  uk: { portalTitle: "Робочий простір Growth Partner", loading: "Підготовка робочого простору Growth Partner…" },
};

for (const locale of ["no", "sv", "da", "es", "pl", "uk"]) {
  const file = path.join(ROOT, `locales/${locale}/partnerPortal.json`);
  fs.writeFileSync(file, `${JSON.stringify({ ...en, ...(overrides[locale] ?? {}) }, null, 2)}\n`);
  console.log("wrote", file);
}

let config = fs.readFileSync(path.join(ROOT, "lib/i18n/config.ts"), "utf8");
if (!config.includes('"partnerPortal"')) {
  config = config.replace('"partnersPortal",', '"partnersPortal",\n  "partnerPortal",');
  fs.writeFileSync(path.join(ROOT, "lib/i18n/config.ts"), config);
  console.log("patched i18n config");
}
