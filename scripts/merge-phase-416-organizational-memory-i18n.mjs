/**
 * Phase 416 — Enterprise Organizational Memory Engine i18n for all core locales.
 * Run: node scripts/merge-phase-416-organizational-memory-i18n.mjs
 * Then: node scripts/generate-customer-app-split-locales.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const localesDir = path.join(root, "locales");
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"];

const enPath = path.join(localesDir, "en", "customerApp.json");
const enBlock = JSON.parse(fs.readFileSync(enPath, "utf8")).enterpriseOrganizationalMemoryEngine;

const NAV = {
  en: "Organizational Memory",
  no: "Organisasjonsminne",
  sv: "Organisationsminne",
  da: "Organisationshukommelse",
  pl: "Pamięć organizacyjna",
  uk: "Організаційна пам'ять",
};

const SUBTITLE = {
  no: "Fang, strukturer, beskytt og hent institusjonell kunnskap — retningslinjer, beslutninger, operativt minne og kollektiv intelligens.",
  sv: "Fånga, strukturera, skydda och hämta institutionell kunskap — policyer, beslut, operativt minne och kollektiv intelligens.",
  da: "Indfang, strukturer, beskytt og hent institutionel viden — politikker, beslutninger, operationelt minde og kollektiv intelligens.",
  pl: "Przechwytuj, strukturyzuj, chroń i odzyskuj wiedzę instytucjonalną — polityki, decyzje, pamięć operacyjną i inteligencję zbiorową.",
  uk: "Збирайте, структуруйте, захищайте та відновлюйте інституційні знання — політики, рішення, операційну пам'ять і колективний інтелект.",
};

for (const locale of LOCALES) {
  const filePath = path.join(localesDir, locale, "customerApp.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (locale === "en") {
    data.enterpriseOrganizationalMemoryEngine = enBlock;
  } else {
    data.enterpriseOrganizationalMemoryEngine = {
      ...enBlock,
      subtitle: SUBTITLE[locale] ?? enBlock.subtitle,
      loading:
        locale === "no"
          ? "Forbereder oversikt over organisasjonsminne"
          : locale === "sv"
            ? "Förbereder översikt över organisationsminne"
            : locale === "da"
              ? "Forbereder oversigt over organisationshukommelse"
              : locale === "pl"
                ? "Przygotowywanie przeglądu pamięci organizacyjnej"
                : "Підготовка огляду організаційної пам'яті",
      loadFailed:
        locale === "no"
          ? "Kunne ikke laste organisasjonsminnesenter"
          : locale === "sv"
            ? "Kunde inte ladda organisationsminnescenter"
            : locale === "da"
              ? "Kunne ikke indlæse organisationshukommelsescenter"
              : locale === "pl"
                ? "Nie można załadować centrum pamięci organizacyjnej"
                : "Не вдалося завантажити центр організаційної пам'яті",
    };
  }
  if (!data.nav) data.nav = {};
  data.nav.enterpriseOrganizationalMemoryEngine = NAV[locale];
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${locale}/customerApp.json`);
}

console.log("Done. Run: node scripts/generate-customer-app-split-locales.mjs");
