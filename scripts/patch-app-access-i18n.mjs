#!/usr/bin/env node
/** Add APP access i18n keys (6 core locales): customerSuccess + notificationOrchestration + foundation.comingSoon */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const customerSuccess = {
  en: {
    organizationMissing:
      "Organization context is missing. Select or configure your workspace before using Customer Success.",
    subscriptionRequired: "This area requires an active organization subscription.",
    permissionMissing:
      "You do not have permission to access this area. Contact your organization administrator.",
    entitlementMissing:
      "This capability is not included in your organization's active Business Packs or plan.",
  },
  no: {
    organizationMissing:
      "Organisasjonskontekst mangler. Velg eller konfigurer arbeidsområdet før du bruker Customer Success.",
    subscriptionRequired: "Dette området krever et aktivt organisasjonsabonnement.",
    permissionMissing:
      "Du har ikke tilgang til dette området. Kontakt organisasjonens administrator.",
    entitlementMissing:
      "Denne funksjonen er ikke inkludert i organisasjonens aktive Business Packs eller abonnement.",
  },
  sv: {
    organizationMissing:
      "Organisationskontext saknas. Välj eller konfigurera arbetsytan innan du använder Customer Success.",
    subscriptionRequired: "Detta område kräver en aktiv organisationsprenumeration.",
    permissionMissing:
      "Du har inte behörighet till detta område. Kontakta organisationens administratör.",
    entitlementMissing:
      "Den här funktionen ingår inte i organisationens aktiva Business Packs eller abonnemang.",
  },
  da: {
    organizationMissing:
      "Organisationskontekst mangler. Vælg eller konfigurer arbejdsområdet, før du bruger Customer Success.",
    subscriptionRequired: "Dette område kræver et aktivt organisationsabonnement.",
    permissionMissing:
      "Du har ikke adgang til dette område. Kontakt organisationens administrator.",
    entitlementMissing:
      "Denne funktion er ikke inkluderet i organisationens aktive Business Packs eller abonnement.",
  },
  pl: {
    organizationMissing:
      "Brakuje kontekstu organizacji. Wybierz lub skonfiguruj workspace przed użyciem Customer Success.",
    subscriptionRequired: "Ten obszar wymaga aktywnej subskrypcji organizacji.",
    permissionMissing:
      "Nie masz uprawnień do tego obszaru. Skontaktuj się z administratorem organizacji.",
    entitlementMissing:
      "Ta funkcja nie jest objęta aktywnymi Business Packs ani planem organizacji.",
  },
  uk: {
    organizationMissing:
      "Відсутній контекст організації. Оберіть або налаштуйте workspace перед використанням Customer Success.",
    subscriptionRequired: "Цей розділ потребує активної підписки організації.",
    permissionMissing:
      "У вас немає доступу до цього розділу. Зверніться до адміністратора організації.",
    entitlementMissing:
      "Ця можливість не входить до активних Business Packs або плану вашої організації.",
  },
};

const notificationOrchestration = {
  en: {
    organizationMissing:
      "Organization context is missing. Select or configure your workspace before using Notification Center.",
    subscriptionRequired: "Notification Center requires an active organization subscription.",
    permissionMissing:
      "You do not have permission to access Notification Center. Contact your organization administrator.",
    entitlementMissing:
      "Notification Center is not included in your organization's active Business Packs or plan.",
  },
  no: {
    organizationMissing:
      "Organisasjonskontekst mangler. Velg eller konfigurer arbeidsområdet før du bruker varslingssenteret.",
    subscriptionRequired: "Varslingssenteret krever et aktivt organisasjonsabonnement.",
    permissionMissing:
      "Du har ikke tilgang til varslingssenteret. Kontakt organisasjonens administrator.",
    entitlementMissing:
      "Varslingssenteret er ikke inkludert i organisasjonens aktive Business Packs eller abonnement.",
  },
  sv: {
    organizationMissing:
      "Organisationskontext saknas. Välj eller konfigurera arbetsytan innan du använder meddelandecentret.",
    subscriptionRequired: "Meddelandecentret kräver en aktiv organisationsprenumeration.",
    permissionMissing:
      "Du har inte behörighet till meddelandecentret. Kontakta organisationens administratör.",
    entitlementMissing:
      "Meddelandecentret ingår inte i organisationens aktiva Business Packs eller abonnemang.",
  },
  da: {
    organizationMissing:
      "Organisationskontekst mangler. Vælg eller konfigurer arbejdsområdet, før du bruger meddelelsescenteret.",
    subscriptionRequired: "Meddelelsescenteret kræver et aktivt organisationsabonnement.",
    permissionMissing:
      "Du har ikke adgang til meddelelsescenteret. Kontakt organisationens administrator.",
    entitlementMissing:
      "Meddelelsescenteret er ikke inkluderet i organisationens aktive Business Packs eller abonnement.",
  },
  pl: {
    organizationMissing:
      "Brakuje kontekstu organizacji. Wybierz lub skonfiguruj workspace przed użyciem centrum powiadomień.",
    subscriptionRequired: "Centrum powiadomień wymaga aktywnej subskrypcji organizacji.",
    permissionMissing:
      "Nie masz uprawnień do centrum powiadomień. Skontaktuj się z administratorem organizacji.",
    entitlementMissing:
      "Centrum powiadomień nie jest objęte aktywnymi Business Packs ani planem organizacji.",
  },
  uk: {
    organizationMissing:
      "Відсутній контекст організації. Оберіть або налаштуйте workspace перед використанням центру сповіщень.",
    subscriptionRequired: "Центр сповіщень потребує активної підписки організації.",
    permissionMissing:
      "У вас немає доступу до центру сповіщень. Зверніться до адміністратора організації.",
    entitlementMissing:
      "Центр сповіщень не входить до активних Business Packs або плану вашої організації.",
  },
};

const foundationComingSoon = {
  en: "Coming soon",
  no: "Kommer snart",
  sv: "Kommer snart",
  da: "Kommer snart",
  pl: "Wkrótce",
  uk: "Незабаром",
};

for (const locale of Object.keys(customerSuccess)) {
  const csCopy = customerSuccess[locale];
  const noCopy = notificationOrchestration[locale];

  const portalPath = path.join(root, `locales/${locale}/customer-app/portalStructure.json`);
  const portal = JSON.parse(fs.readFileSync(portalPath, "utf8"));
  const csBlock = portal.portalStructure?.customerSuccess;
  if (csBlock) {
    Object.assign(csBlock, csCopy);
  } else {
    console.warn("Skip", locale, "— customerSuccess block missing");
  }
  if (portal.portalStructure?.foundation) {
    portal.portalStructure.foundation.comingSoon = foundationComingSoon[locale];
  }
  fs.writeFileSync(portalPath, `${JSON.stringify(portal, null, 2)}\n`);

  const settingsPath = path.join(root, `locales/${locale}/customer-app/settings.json`);
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    settings.notificationOrchestration = settings.notificationOrchestration ?? {};
    Object.assign(settings.notificationOrchestration, noCopy);
    fs.writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
  }

  const shellPath = path.join(root, `locales/${locale}/shell.json`);
  if (fs.existsSync(shellPath)) {
    const shell = JSON.parse(fs.readFileSync(shellPath, "utf8"));
    shell.licenseSidebar = shell.licenseSidebar ?? {};
    shell.licenseSidebar.organizationMissing =
      locale === "en" ? "Organization not linked" : csCopy.organizationMissing.split(".")[0];
    fs.writeFileSync(shellPath, `${JSON.stringify(shell, null, 2)}\n`);
  }

  console.log("Patched", locale);
}
