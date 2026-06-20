#!/usr/bin/env node
/** Add APP access i18n keys to portalStructure customerSuccess (6 core locales). */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const locales = {
  en: {
    organizationMissing:
      "Organization context is missing. Select or configure your workspace before using Customer Success.",
    subscriptionRequired: "This area requires an active organization subscription.",
    permissionMissing:
      "You do not have permission to access this area. Contact your organization administrator.",
  },
  no: {
    organizationMissing:
      "Organisasjonskontekst mangler. Velg eller konfigurer arbeidsområdet før du bruker Customer Success.",
    subscriptionRequired: "Dette området krever et aktivt organisasjonsabonnement.",
    permissionMissing:
      "Du har ikke tilgang til dette området. Kontakt organisasjonens administrator.",
  },
  sv: {
    organizationMissing:
      "Organisationskontext saknas. Välj eller konfigurera arbetsytan innan du använder Customer Success.",
    subscriptionRequired: "Detta område kräver en aktiv organisationsprenumeration.",
    permissionMissing:
      "Du har inte behörighet till detta område. Kontakta organisationens administratör.",
  },
  da: {
    organizationMissing:
      "Organisationskontekst mangler. Vælg eller konfigurer arbejdsområdet, før du bruger Customer Success.",
    subscriptionRequired: "Dette område kræver et aktivt organisationsabonnement.",
    permissionMissing:
      "Du har ikke adgang til dette område. Kontakt organisationens administrator.",
  },
  pl: {
    organizationMissing:
      "Brakuje kontekstu organizacji. Wybierz lub skonfiguruj workspace przed użyciem Customer Success.",
    subscriptionRequired: "Ten obszar wymaga aktywnej subskrypcji organizacji.",
    permissionMissing:
      "Nie masz uprawnień do tego obszaru. Skontaktuj się z administratorem organizacji.",
  },
  uk: {
    organizationMissing:
      "Відсутній контекст організації. Оберіть або налаштуйте workspace перед використанням Customer Success.",
    subscriptionRequired: "Цей розділ потребує активної підписки організації.",
    permissionMissing:
      "У вас немає доступу до цього розділу. Зверніться до адміністратора організації.",
  },
};

for (const [locale, copy] of Object.entries(locales)) {
  const filePath = path.join(root, `locales/${locale}/customer-app/portalStructure.json`);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const block = json.portalStructure?.customerSuccess;
  if (!block) {
    console.warn("Skip", locale, "— customerSuccess block missing");
    continue;
  }
  Object.assign(block, copy);
  const shellPath = path.join(root, `locales/${locale}/shell.json`);
  if (fs.existsSync(shellPath)) {
    const shell = JSON.parse(fs.readFileSync(shellPath, "utf8"));
    shell.licenseSidebar = shell.licenseSidebar ?? {};
    shell.licenseSidebar.organizationMissing =
      locale === "en"
        ? "Organization not linked"
        : copy.organizationMissing.split(".")[0];
    fs.writeFileSync(shellPath, `${JSON.stringify(shell, null, 2)}\n`);
  }
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
  console.log("Patched", locale);
}
