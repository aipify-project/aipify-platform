#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"];

const LOCALE_CONTENT = {
  en: {
    setup: {
      title: "Connect to",
      back: "Back to integrations",
      backStep: "Back",
      continueStep: "Continue",
      save: "Save securely",
      test: "Test connection",
      remove: "Remove integration",
      manualOption: "Manual connection key",
      apiKeyPlaceholder: "Paste your read-only connection key",
      approveScopes:
        "I approve these access permissions and understand what Aipify can read",
    },
    authHelp: {
      sectionTitles: {
        what: "What is this?",
        why: "Why Aipify needs it",
        where: "Where to find the key",
        project: "Which project or business should I choose?",
        permissions: "Which access permissions should I choose?",
        canChange: "Can I change this later?",
        revoke: "How do I revoke access?",
      },
      stepsTitle: "Step-by-step",
    },
    scopeDescriptions: {
      "metadata.read": "Reads basic technical information about the connection.",
      "organization.read": "Reads verified organization information.",
      "integration.status.read": "Reads integration status information.",
    },
    unonightSteps: {
      "1": "Log in to Unonight Admin.",
      "2": "Open Integrations → Aipify.",
      "3": "Create a new secure connection key.",
      "4": "Choose read-only access only.",
      "5": "Confirm access includes metadata.read and organization.read.",
      "6": "Copy the key when it is shown.",
      "7": "Paste the key into Aipify.",
      "8": "Test the connection.",
    },
    manualSteps: {
      login: "Log in to Unonight Admin.",
      open_menu: "Open Integrations → Aipify.",
      locate_keys: "Create a new secure connection key.",
      choose_permissions: "Choose read-only access only.",
      avoid_permissions: "Confirm access includes metadata.read and organization.read.",
      copy_key: "Copy the key when it is shown.",
      paste_in_aipify: "Paste the key into Aipify.",
      test_connection: "Test the connection.",
    },
  },
  no: {
    setup: {
      title: "Koble til",
      back: "Tilbake til integrasjoner",
      backStep: "Tilbake",
      continueStep: "Fortsett",
      save: "Lagre sikkert",
      test: "Test tilkoblingen",
      remove: "Fjern integrasjon",
    },
    authHelp: {
      sectionTitles: {
        what: "Hva er dette?",
        why: "Hvorfor trenger Aipify dette?",
        where: "Hvor finner jeg nøkkelen?",
        project: "Hvilket prosjekt eller hvilken virksomhet skal jeg velge?",
        permissions: "Hvilke tilganger skal jeg velge?",
        canChange: "Kan dette endres senere?",
        revoke: "Hvordan trekker jeg tilbake tilgangen?",
      },
      stepsTitle: "Steg for steg",
    },
    scopeDescriptions: {
      "metadata.read": "Leser grunnleggende teknisk informasjon om tilkoblingen.",
      "organization.read": "Leser verifisert organisasjonsinformasjon.",
      "integration.status.read": "Leser status for integrasjonen.",
    },
    unonightSteps: {
      "1": "Logg inn i Unonight Admin.",
      "2": "Åpne Integrasjoner → Aipify.",
      "3": "Opprett en ny sikker tilkoblingsnøkkel.",
      "4": "Velg kun lesetilgang.",
      "5": "Kontroller at tilgangene inkluderer metadata.read og organization.read.",
      "6": "Kopier nøkkelen når den vises.",
      "7": "Lim nøkkelen inn i Aipify.",
      "8": "Test tilkoblingen.",
    },
  },
  sv: {
    setup: {
      title: "Anslut till",
      loading: "Laddar konfiguration…",
      back: "Tillbaka till integrationer",
      selectSetupType: "Välj anslutningsmetod",
      oauthOption: "Automatisk anslutning (OAuth / officiell app)",
      manualOption: "Manuell anslutningsnyckel",
      permissionPreview: "Granska behörigheter innan du godkänner",
      approveScopes:
        "Jag godkänner dessa åtkomstbehörigheter och förstår vad Aipify kan läsa",
      approveScopesRequired: "Godkännande av behörigheter krävs innan sparning",
      apiKeyPlaceholder: "Klistra in skrivskyddad anslutningsnyckel",
      apiKeyMaskedNote: "Sparad nyckel (maskerad)",
      accessSummaryTitle: "Åtkomstsammanfattning",
      whatAipifyReads:
        "Aipify kan läsa driftsmetadata som krävs för godkända behörigheter — inte mer.",
      whatAipifyCannotDo:
        "Aipify kan inte ändra data i ditt externa system med skrivskyddad åtkomst.",
      credentialStorage:
        "Anslutningsnyckeln krypteras i vila och visas aldrig i full längd efter sparning.",
      revokeAccess: "Du kan när som helst återkalla åtkomsten genom att ta bort integrationen.",
      rotateKey:
        "Byt nyckel genom att spara en ny anslutningsnyckel och återkalla den gamla i det externa systemet.",
      connectionFailed: "Anslutningstestet misslyckades — kontrollera behörigheter och försök igen.",
      save: "Spara säkert",
      test: "Testa anslutningen",
      remove: "Ta bort integration",
      replace: "Byt anslutningsnyckel",
      connectOAuth: "Anslut med leverantör",
      successTitle: "Integration sparad",
      successBody: "Anslutningen sparades och loggades. Hela nyckeln visas aldrig igen.",
      whyAccess:
        "Aipify behöver begränsad åtkomst för att ge värde i din arbetsyta — endast det du godkänner.",
      whatNotToEnable:
        "Aktivera inte admin-, raderings- eller skrivbehörigheter om det inte uttryckligen krävs.",
      backStep: "Tillbaka",
      continueStep: "Fortsätt",
    },
    authHelp: {
      sectionTitles: {
        what: "Vad är detta?",
        why: "Varför behöver Aipify detta?",
        where: "Var hittar jag nyckeln?",
        project: "Vilket projekt eller vilken verksamhet ska jag välja?",
        permissions: "Vilka behörigheter ska jag välja?",
        canChange: "Kan detta ändras senare?",
        revoke: "Hur återkallar jag åtkomsten?",
      },
      stepsTitle: "Steg för steg",
      technicalDetailsTitle: "Tekniska detaljer",
      technicalDetailsToggleShow: "Visa tekniska detaljer",
      technicalDetailsToggleHide: "Dölj tekniska detaljer",
    },
    scopeDescriptions: {
      "metadata.read": "Läser grundläggande teknisk information om anslutningen.",
      "organization.read": "Läser verifierad organisationsinformation.",
      "integration.status.read": "Läser status för integrationen.",
    },
    manualSteps: {
      login: "Logga in i Unonight Admin.",
      open_menu: "Öppna Integrationer → Aipify.",
      locate_keys: "Skapa en ny säker anslutningsnyckel.",
      choose_permissions: "Välj endast skrivskyddad åtkomst.",
      avoid_permissions: "Kontrollera att behörigheterna inkluderar metadata.read och organization.read.",
      copy_key: "Kopiera nyckeln när den visas.",
      paste_in_aipify: "Klistra in nyckeln i Aipify.",
      test_connection: "Testa anslutningen.",
    },
    unonightSteps: {
      "1": "Logga in i Unonight Admin.",
      "2": "Öppna Integrationer → Aipify.",
      "3": "Skapa en ny säker anslutningsnyckel.",
      "4": "Välj endast skrivskyddad åtkomst.",
      "5": "Kontrollera att behörigheterna inkluderar metadata.read och organization.read.",
      "6": "Kopiera nyckeln när den visas.",
      "7": "Klistra in nyckeln i Aipify.",
      "8": "Testa anslutningen.",
    },
  },
  da: {
    setup: {
      title: "Forbind til",
      loading: "Indlæser opsætning…",
      back: "Tilbage til integrationer",
      selectSetupType: "Vælg forbindelsesmetode",
      oauthOption: "Automatisk forbindelse (OAuth / officiel app)",
      manualOption: "Manuel forbindelsesnøgle",
      permissionPreview: "Gennemgå tilladelser, før du godkender",
      approveScopes:
        "Jeg godkender disse adgangstilladelser og forstår, hvad Aipify kan læse",
      approveScopesRequired: "Godkendelse af tilladelser kræves før gemning",
      apiKeyPlaceholder: "Indsæt skrivebeskyttet forbindelsesnøgle",
      apiKeyMaskedNote: "Gemt nøgle (maskeret)",
      accessSummaryTitle: "Adgangsoversigt",
      whatAipifyReads:
        "Aipify kan læse driftsmetadata, der kræves for godkendte tilladelser — ikke mere.",
      whatAipifyCannotDo:
        "Aipify kan ikke ændre data i dit eksterne system med skrivebeskyttet adgang.",
      credentialStorage:
        "Forbindelsesnøglen krypteres i hvile og vises aldrig i fuld længde efter gemning.",
      revokeAccess: "Du kan til enhver tid tilbagekalde adgangen ved at fjerne integrationen.",
      rotateKey:
        "Skift nøgle ved at gemme en ny forbindelsesnøgle og tilbagekalde den gamle i det eksterne system.",
      connectionFailed: "Forbindelsestest mislykkedes — kontroller tilladelser og prøv igen.",
      save: "Gem sikkert",
      test: "Test forbindelsen",
      remove: "Fjern integration",
      replace: "Skift forbindelsesnøgle",
      connectOAuth: "Forbind med udbyder",
      successTitle: "Integration gemt",
      successBody: "Forbindelsen blev gemt og logført. Hele nøglen vises aldrig igen.",
      whyAccess:
        "Aipify har brug for begrænset adgang for at skabe værdi i dit arbejdsområde — kun det, du godkender.",
      whatNotToEnable:
        "Aktiver ikke admin-, slette- eller skrivetilladelser, medmindre det udtrykkeligt kræves.",
      backStep: "Tilbage",
      continueStep: "Fortsæt",
    },
    authHelp: {
      sectionTitles: {
        what: "Hvad er dette?",
        why: "Hvorfor har Aipify brug for dette?",
        where: "Hvor finder jeg nøglen?",
        project: "Hvilket projekt eller hvilken virksomhed skal jeg vælge?",
        permissions: "Hvilke tilladelser skal jeg vælge?",
        canChange: "Kan dette ændres senere?",
        revoke: "Hvordan tilbagekalder jeg adgangen?",
      },
      stepsTitle: "Trin for trin",
      technicalDetailsTitle: "Tekniske detaljer",
      technicalDetailsToggleShow: "Vis tekniske detaljer",
      technicalDetailsToggleHide: "Skjul tekniske detaljer",
    },
    scopeDescriptions: {
      "metadata.read": "Læser grundlæggende teknisk information om forbindelsen.",
      "organization.read": "Læser verificeret organisationsinformation.",
      "integration.status.read": "Læser status for integrationen.",
    },
    manualSteps: {
      login: "Log ind i Unonight Admin.",
      open_menu: "Åbn Integrationer → Aipify.",
      locate_keys: "Opret en ny sikker forbindelsesnøgle.",
      choose_permissions: "Vælg kun skrivebeskyttet adgang.",
      avoid_permissions: "Kontroller at tilladelserne inkluderer metadata.read og organization.read.",
      copy_key: "Kopier nøglen, når den vises.",
      paste_in_aipify: "Indsæt nøglen i Aipify.",
      test_connection: "Test forbindelsen.",
    },
    unonightSteps: {
      "1": "Log ind i Unonight Admin.",
      "2": "Åbn Integrationer → Aipify.",
      "3": "Opret en ny sikker forbindelsesnøgle.",
      "4": "Vælg kun skrivebeskyttet adgang.",
      "5": "Kontroller at tilladelserne inkluderer metadata.read og organization.read.",
      "6": "Kopier nøglen, når den vises.",
      "7": "Indsæt nøglen i Aipify.",
      "8": "Test forbindelsen.",
    },
  },
  pl: {
    setup: {
      title: "Połącz z",
      loading: "Ładowanie konfiguracji…",
      back: "Wróć do integracji",
      selectSetupType: "Wybierz metodę połączenia",
      oauthOption: "Połączenie automatyczne (OAuth / oficjalna aplikacja)",
      manualOption: "Ręczny klucz połączenia",
      permissionPreview: "Przejrzyj uprawnienia przed zatwierdzeniem",
      approveScopes:
        "Zatwierdzam te uprawnienia dostępu i rozumiem, co Aipify może odczytać",
      approveScopesRequired: "Zatwierdzenie uprawnień jest wymagane przed zapisem",
      apiKeyPlaceholder: "Wklej klucz połączenia tylko do odczytu",
      apiKeyMaskedNote: "Zapisany klucz (zamaskowany)",
      accessSummaryTitle: "Podsumowanie dostępu",
      whatAipifyReads:
        "Aipify może odczytywać metadane operacyjne wymagane dla zatwierdzonych uprawnień — nic więcej.",
      whatAipifyCannotDo:
        "Aipify nie może zmieniać danych w Twoim systemie zewnętrznym przy dostępie tylko do odczytu.",
      credentialStorage:
        "Klucz połączenia jest szyfrowany w spoczynku i nigdy nie jest wyświetlany w całości po zapisie.",
      revokeAccess: "Możesz w każdej chwili cofnąć dostęp, usuwając integrację.",
      rotateKey:
        "Wymień klucz, zapisując nowy klucz połączenia i cofając stary w systemie zewnętrznym.",
      connectionFailed: "Test połączenia nie powiódł się — sprawdź uprawnienia i spróbuj ponownie.",
      save: "Zapisz bezpiecznie",
      test: "Przetestuj połączenie",
      remove: "Usuń integrację",
      replace: "Wymień klucz połączenia",
      connectOAuth: "Połącz z dostawcą",
      successTitle: "Integracja zapisana",
      successBody: "Połączenie zostało zapisane i zarejestrowane. Pełny klucz nie jest już wyświetlany.",
      whyAccess:
        "Aipify potrzebuje ograniczonego dostępu, aby dostarczać wartość w Twojej przestrzeni roboczej — tylko to, co zatwierdzisz.",
      whatNotToEnable:
        "Nie włączaj uprawnień administracyjnych, usuwania ani zapisu, chyba że jest to wyraźnie wymagane.",
      backStep: "Wstecz",
      continueStep: "Kontynuuj",
    },
    authHelp: {
      sectionTitles: {
        what: "Co to jest?",
        why: "Dlaczego Aipify tego potrzebuje?",
        where: "Gdzie znaleźć klucz?",
        project: "Który projekt lub firmę wybrać?",
        permissions: "Jakie uprawnienia wybrać?",
        canChange: "Czy można to zmienić później?",
        revoke: "Jak cofnąć dostęp?",
      },
      stepsTitle: "Krok po kroku",
      technicalDetailsTitle: "Szczegóły techniczne",
      technicalDetailsToggleShow: "Pokaż szczegóły techniczne",
      technicalDetailsToggleHide: "Ukryj szczegóły techniczne",
    },
    scopeDescriptions: {
      "metadata.read": "Odczytuje podstawowe informacje techniczne o połączeniu.",
      "organization.read": "Odczytuje zweryfikowane informacje o organizacji.",
      "integration.status.read": "Odczytuje status integracji.",
    },
    manualSteps: {
      login: "Zaloguj się do Unonight Admin.",
      open_menu: "Otwórz Integracje → Aipify.",
      locate_keys: "Utwórz nowy bezpieczny klucz połączenia.",
      choose_permissions: "Wybierz tylko dostęp do odczytu.",
      avoid_permissions: "Sprawdź, czy uprawnienia obejmują metadata.read i organization.read.",
      copy_key: "Skopiuj klucz, gdy zostanie wyświetlony.",
      paste_in_aipify: "Wklej klucz w Aipify.",
      test_connection: "Przetestuj połączenie.",
    },
    unonightSteps: {
      "1": "Zaloguj się do Unonight Admin.",
      "2": "Otwórz Integracje → Aipify.",
      "3": "Utwórz nowy bezpieczny klucz połączenia.",
      "4": "Wybierz tylko dostęp do odczytu.",
      "5": "Sprawdź, czy uprawnienia obejmują metadata.read i organization.read.",
      "6": "Skopiuj klucz, gdy zostanie wyświetlony.",
      "7": "Wklej klucz w Aipify.",
      "8": "Przetestuj połączenie.",
    },
  },
  uk: {
    setup: {
      title: "Підключити",
      loading: "Завантаження налаштування…",
      back: "Назад до інтеграцій",
      selectSetupType: "Оберіть спосіб підключення",
      oauthOption: "Автоматичне підключення (OAuth / офіційний застосунок)",
      manualOption: "Ручний ключ підключення",
      permissionPreview: "Перегляньте дозволи перед підтвердженням",
      approveScopes:
        "Я підтверджую ці дозволи доступу та розумію, що Aipify може читати",
      approveScopesRequired: "Підтвердження дозволів потрібне перед збереженням",
      apiKeyPlaceholder: "Вставте ключ підключення лише для читання",
      apiKeyMaskedNote: "Збережений ключ (прихований)",
      accessSummaryTitle: "Підсумок доступу",
      whatAipifyReads:
        "Aipify може читати операційні метадані, потрібні для затверджених дозволів — не більше.",
      whatAipifyCannotDo:
        "Aipify не може змінювати дані у вашій зовнішній системі з доступом лише для читання.",
      credentialStorage:
        "Ключ підключення шифрується в спокої та ніколи не показується повністю після збереження.",
      revokeAccess: "Ви можете будь-коли скасувати доступ, видаливши інтеграцію.",
      rotateKey:
        "Замініть ключ, зберегши новий ключ підключення та скасувавши старий у зовнішній системі.",
      connectionFailed: "Тест підключення не вдався — перевірте дозволи та спробуйте знову.",
      save: "Зберегти безпечно",
      test: "Перевірити підключення",
      remove: "Видалити інтеграцію",
      replace: "Замінити ключ підключення",
      connectOAuth: "Підключити через постачальника",
      successTitle: "Інтеграцію збережено",
      successBody: "Підключення збережено та зареєстровано. Повний ключ більше не показується.",
      whyAccess:
        "Aipify потребує обмеженого доступу, щоб приносити користь у вашому робочому просторі — лише те, що ви затвердите.",
      whatNotToEnable:
        "Не вмикайте адміністративні, видалення чи запис дозволів, якщо це явно не потрібно.",
      backStep: "Назад",
      continueStep: "Продовжити",
    },
    authHelp: {
      sectionTitles: {
        what: "Що це?",
        why: "Навіщо Aipify це потрібно?",
        where: "Де знайти ключ?",
        project: "Який проєкт або бізнес обрати?",
        permissions: "Які дозволи обрати?",
        canChange: "Чи можна змінити це пізніше?",
        revoke: "Як скасувати доступ?",
      },
      stepsTitle: "Крок за кроком",
      technicalDetailsTitle: "Технічні деталі",
      technicalDetailsToggleShow: "Показати технічні деталі",
      technicalDetailsToggleHide: "Приховати технічні деталі",
    },
    scopeDescriptions: {
      "metadata.read": "Читає базову технічну інформацію про підключення.",
      "organization.read": "Читає перевірену інформацію про організацію.",
      "integration.status.read": "Читає статус інтеграції.",
    },
    manualSteps: {
      login: "Увійдіть до Unonight Admin.",
      open_menu: "Відкрийте Інтеграції → Aipify.",
      locate_keys: "Створіть новий безпечний ключ підключення.",
      choose_permissions: "Оберіть лише доступ для читання.",
      avoid_permissions: "Переконайтеся, що дозволи включають metadata.read та organization.read.",
      copy_key: "Скопіюйте ключ, коли він з’явиться.",
      paste_in_aipify: "Вставте ключ у Aipify.",
      test_connection: "Перевірте підключення.",
    },
    unonightSteps: {
      "1": "Увійдіть до Unonight Admin.",
      "2": "Відкрийте Інтеграції → Aipify.",
      "3": "Створіть новий безпечний ключ підключення.",
      "4": "Оберіть лише доступ для читання.",
      "5": "Переконайтеся, що дозволи включають metadata.read та organization.read.",
      "6": "Скопіюйте ключ, коли він з’явиться.",
      "7": "Вставте ключ у Aipify.",
      "8": "Перевірте підключення.",
    },
  },
};

function deepAssign(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepAssign(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

for (const locale of LOCALES) {
  const path = join(ROOT, "locales", locale, "customer-app", "portalStructure.json");
  const json = JSON.parse(readFileSync(path, "utf8"));
  const integrations = json.portalStructure?.integrations;
  if (!integrations) {
    console.error(`Missing integrations in ${locale}`);
    process.exit(1);
  }

  const content = LOCALE_CONTENT[locale];
  deepAssign(integrations.setup, content.setup);
  deepAssign(integrations.authHelp, content.authHelp);
  integrations.scopeDescriptions = {
    ...integrations.scopeDescriptions,
    ...content.scopeDescriptions,
  };
  if (content.manualSteps) {
    deepAssign(integrations.setup.manualSteps, content.manualSteps);
  }
  if (integrations.authHelp?.unonight?.steps && content.unonightSteps) {
    integrations.authHelp.unonight.steps = {
      ...integrations.authHelp.unonight.steps,
      ...content.unonightSteps,
    };
  }

  writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`Patched ${locale}`);
}
