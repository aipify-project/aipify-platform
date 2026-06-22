import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const locales = ["en", "no", "sv", "da", "pl", "uk"];

const hubPatch = {
  en: {
    actionsMenuLabel: "Actions",
    actions: {
      manage: "Manage",
      retryTest: "Retry test",
      disconnect: "Disconnect",
      retry: "Try again",
      editSetup: "Edit setup",
      removeIntegration: "Remove integration",
      continueSetup: "Continue setup",
    },
    removeDialog: {
      title: "Remove {provider} integration?",
      body: "The failed connection and stored connection key will be removed. Historical activity logs are preserved.",
    },
    disconnectDialog: {
      title: "Disconnect {provider}?",
      body: "This disconnects Aipify from the external platform for this organization.",
    },
    feedback: {
      removeFailed: "Could not remove integration. Try again.",
      testFailed: "Connection test failed. Review setup and try again.",
    },
  },
  no: {
    actionsMenuLabel: "Handlinger",
    actions: {
      manage: "Administrer",
      retryTest: "Test på nytt",
      disconnect: "Koble fra",
      retry: "Prøv på nytt",
      editSetup: "Rediger oppsett",
      removeIntegration: "Fjern integrasjon",
      continueSetup: "Fortsett oppsett",
    },
    removeDialog: {
      title: "Fjerne {provider}-integrasjonen?",
      body: "Den mislykkede tilkoblingen og den lagrede tilkoblingsnøkkelen fjernes. Historiske aktivitetslogger beholdes.",
    },
    disconnectDialog: {
      title: "Koble fra {provider}?",
      body: "Dette kobler Aipify fra den eksterne plattformen for denne organisasjonen.",
    },
    feedback: {
      removeFailed: "Integrasjonen kunne ikke fjernes. Prøv igjen.",
      testFailed: "Tilkoblingstest mislyktes. Kontroller oppsettet og prøv igjen.",
    },
  },
  sv: {
    actionsMenuLabel: "Åtgärder",
    actions: {
      manage: "Hantera",
      retryTest: "Testa igen",
      disconnect: "Koppla från",
      retry: "Försök igen",
      editSetup: "Redigera inställning",
      removeIntegration: "Ta bort integration",
      continueSetup: "Fortsätt installation",
    },
    removeDialog: {
      title: "Ta bort {provider}-integrationen?",
      body: "Den misslyckade anslutningen och den lagrade anslutningsnyckeln tas bort. Historiska aktivitetsloggar behålls.",
    },
    disconnectDialog: {
      title: "Koppla från {provider}?",
      body: "Detta kopplar bort Aipify från den externa plattformen för den här organisationen.",
    },
    feedback: {
      removeFailed: "Integrationen kunde inte tas bort. Försök igen.",
      testFailed: "Anslutningstestet misslyckades. Granska inställningen och försök igen.",
    },
  },
  da: {
    actionsMenuLabel: "Handlinger",
    actions: {
      manage: "Administrer",
      retryTest: "Test igen",
      disconnect: "Afbryd forbindelse",
      retry: "Prøv igen",
      editSetup: "Rediger opsætning",
      removeIntegration: "Fjern integration",
      continueSetup: "Fortsæt opsætning",
    },
    removeDialog: {
      title: "Fjerne {provider}-integrationen?",
      body: "Den mislykkede forbindelse og den gemte forbindelsesnøgle fjernes. Historiske aktivitetslogfiler bevares.",
    },
    disconnectDialog: {
      title: "Afbryd {provider}?",
      body: "Dette afbryder Aipify fra den eksterne platform for denne organisation.",
    },
    feedback: {
      removeFailed: "Integrationen kunne ikke fjernes. Prøv igen.",
      testFailed: "Forbindelsestest mislykkedes. Gennemgå opsætningen og prøv igen.",
    },
  },
  pl: {
    actionsMenuLabel: "Działania",
    actions: {
      manage: "Zarządzaj",
      retryTest: "Testuj ponownie",
      disconnect: "Rozłącz",
      retry: "Spróbuj ponownie",
      editSetup: "Edytuj konfigurację",
      removeIntegration: "Usuń integrację",
      continueSetup: "Kontynuuj konfigurację",
    },
    removeDialog: {
      title: "Usunąć integrację {provider}?",
      body: "Nieudane połączenie i zapisany klucz połączenia zostaną usunięte. Historyczne dzienniki aktywności zostaną zachowane.",
    },
    disconnectDialog: {
      title: "Rozłączyć {provider}?",
      body: "Spowoduje to rozłączenie Aipify z zewnętrzną platformą dla tej organizacji.",
    },
    feedback: {
      removeFailed: "Nie udało się usunąć integracji. Spróbuj ponownie.",
      testFailed: "Test połączenia nie powiódł się. Sprawdź konfigurację i spróbuj ponownie.",
    },
  },
  uk: {
    actionsMenuLabel: "Дії",
    actions: {
      manage: "Керувати",
      retryTest: "Повторити тест",
      disconnect: "Відключити",
      retry: "Спробувати знову",
      editSetup: "Редагувати налаштування",
      removeIntegration: "Видалити інтеграцію",
      continueSetup: "Продовжити налаштування",
    },
    removeDialog: {
      title: "Видалити інтеграцію {provider}?",
      body: "Невдале підключення та збережений ключ підключення будуть видалені. Історичні журнали активності збережуться.",
    },
    disconnectDialog: {
      title: "Відключити {provider}?",
      body: "Це відключить Aipify від зовнішньої платформи для цієї організації.",
    },
    feedback: {
      removeFailed: "Не вдалося видалити інтеграцію. Спробуйте ще раз.",
      testFailed: "Тест підключення не вдався. Перевірте налаштування та спробуйте знову.",
    },
  },
};

const providerNames = {
  en: {
    custom_api: "Custom API",
    unonight: "Unonight",
    shopify: "Shopify",
    wordpress: "WordPress",
    stripe: "Stripe",
    woocommerce: "WooCommerce",
  },
  no: {
    custom_api: "Egendefinert API",
    unonight: "Unonight",
    shopify: "Shopify",
    wordpress: "WordPress",
    stripe: "Stripe",
    woocommerce: "WooCommerce",
  },
  sv: {
    custom_api: "Anpassat API",
    unonight: "Unonight",
    shopify: "Shopify",
    wordpress: "WordPress",
    stripe: "Stripe",
    woocommerce: "WooCommerce",
  },
  da: {
    custom_api: "Brugerdefineret API",
    unonight: "Unonight",
    shopify: "Shopify",
    wordpress: "WordPress",
    stripe: "Stripe",
    woocommerce: "WooCommerce",
  },
  pl: {
    custom_api: "Niestandardowe API",
    unonight: "Unonight",
    shopify: "Shopify",
    wordpress: "WordPress",
    stripe: "Stripe",
    woocommerce: "WooCommerce",
  },
  uk: {
    custom_api: "Користувацьке API",
    unonight: "Unonight",
    shopify: "Shopify",
    wordpress: "WordPress",
    stripe: "Stripe",
    woocommerce: "WooCommerce",
  },
};

const setupRemovePatch = {
  en: {
    titleNamed: "Remove {provider} integration?",
    bodyFailed:
      "The failed connection and stored connection key will be removed. Historical activity logs are preserved.",
    confirmDisconnect: "❌ Disconnect",
  },
  no: {
    titleNamed: "Fjerne {provider}-integrasjonen?",
    bodyFailed:
      "Den mislykkede tilkoblingen og den lagrede tilkoblingsnøkkelen fjernes. Historiske aktivitetslogger beholdes.",
    confirmDisconnect: "❌ Koble fra",
  },
  sv: {
    titleNamed: "Ta bort {provider}-integrationen?",
    bodyFailed:
      "Den misslyckade anslutningen och den lagrade anslutningsnyckeln tas bort. Historiska aktivitetsloggar behålls.",
    confirmDisconnect: "❌ Koppla från",
  },
  da: {
    titleNamed: "Fjerne {provider}-integrationen?",
    bodyFailed:
      "Den mislykkede forbindelse og den gemte forbindelsesnøgle fjernes. Historiske aktivitetslogfiler bevares.",
    confirmDisconnect: "❌ Afbryd forbindelse",
  },
  pl: {
    titleNamed: "Usunąć integrację {provider}?",
    bodyFailed:
      "Nieudane połączenie i zapisany klucz połączenia zostaną usunięte. Historyczne dzienniki aktywności zostaną zachowane.",
    confirmDisconnect: "❌ Rozłącz",
  },
  uk: {
    titleNamed: "Видалити інтеграцію {provider}?",
    bodyFailed:
      "Невдале підключення та збережений ключ підключення будуть видалені. Історичні журнали активності збережуться.",
    confirmDisconnect: "❌ Відключити",
  },
};

for (const locale of locales) {
  const file = path.join(root, "locales", locale, "customer-app", "portalStructure.json");
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const integrations = json.portalStructure?.integrations;
  if (!integrations?.hub) {
    console.warn(`Skip ${locale}: integrations.hub missing`);
    continue;
  }

  Object.assign(integrations.hub, hubPatch[locale]);
  integrations.providerNames = providerNames[locale];
  Object.assign(integrations.setup.removeDialog, setupRemovePatch[locale]);

  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`Patched ${locale}`);
}
