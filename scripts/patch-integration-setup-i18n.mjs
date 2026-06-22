#!/usr/bin/env node
/**
 * Patches integrations i18n block in portalStructure.json for all core locales.
 * Run: node scripts/patch-integration-setup-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"];

const EXTENSIONS = {
  en: {
    plainLanguage: {
      apiKey: "Secure connection key",
      accessScope: "What Aipify can access",
      readOnly: "Aipify can read information but not change anything",
      connectionTest: "Test the connection",
      secureConnectionKey: "Secure connection key",
    },
    statuses: {
      pending: "⏳ Waiting for setup",
      missingInfo: "ℹ️ Information missing",
      needsReview: "👀 Connection needs review",
      connected: "✅ Connected and verified",
      failed: "❌ Connection failed",
      readOnly: "🔒 Limited to read-only access",
    },
    wizard7Steps: {
      choose_system: "Choose your system",
      explain_access: "Understand what Aipify needs",
      find_credential: "Find your connection key",
      enter_credential: "Enter your connection key",
      test_connection: "Test the connection",
      access_summary: "Review access summary",
      confirm_activation: "Confirm and activate",
    },
    securityWarnings: {
      readOnlyDefault: "Read-only access is the default — Aipify can read information but not change anything in your external system.",
      noWriteWithoutApproval: "Write or admin permissions are never enabled without your explicit approval.",
      credentialsEncrypted: "Your connection key is encrypted at rest and never shown in full after saving.",
      revokeAnytime: "You can revoke access at any time by removing the integration.",
    },
    kcLinks: {
      setupGuide: "Integration setup guide",
      setupGuideHref: "/app/support/knowledge/aipify/integration-setup/faq/integration-setup-faq",
      faq: "Integration FAQ",
      faqHref: "/app/support/knowledge/aipify/integration-setup/faq/integration-setup-faq",
      findApiKey: "Where to find your connection key",
      findApiKeyHref: "/app/support/knowledge/aipify/integration-setup/faq/integration-setup-faq#where-do-i-find-my-api-key",
    },
    companionPrompts: {
      whereFindKey: "Where do I find my connection key for this integration?",
      whichProject: "Which project or store should I connect?",
      isAccessSafe: "Is it safe to give Aipify read-only access?",
      whyConnectionFails: "Why did my connection test fail?",
      checkMySetup: "Can you check if my integration setup looks correct?",
    },
    setupExtra: {
      confirmActivation: "Confirm activation",
      confirmActivationBody: "Your connection is saved securely. Run a final test to activate the integration in your workspace.",
      connectionStatusLabel: "Connection setup progress",
      authHelpAsideTitle: "Connection help",
      testFailedTitle: "Connection test failed",
      activateCta: "Activate integration",
      activating: "Activating…",
      apiKeyLabel: "Secure connection key",
    },
    faqExtra: {
      whatIsSecureConnectionKey: "What is a secure connection key?",
      howToTestConnection: "How do I test an integration connection?",
      canChangePermissionsLater: "Can I change permissions later?",
      whoCanManageIntegrations: "Who can manage integrations in my organization?",
    },
    faqAnswersExtra: {
      "what-is-secure-connection-key":
        "A secure connection key (often called an API key) lets Aipify connect to your external system with the permissions you approve. Aipify stores it encrypted and never shows the full key after setup.",
      "how-to-test-connection":
        "After entering your connection key, click Test the connection. Aipify verifies access with your approved read-only scopes before activation.",
      "can-change-permissions-later":
        "Yes. Remove the integration, create a new key with updated scopes externally, and reconnect. All changes are audit logged.",
      "who-can-manage-integrations":
        "Organization owners and administrators can connect, test, and remove integrations. Other roles may have view-only access.",
    },
  },
  no: {
    plainLanguage: {
      apiKey: "Sikker tilkoblingsnøkkel",
      accessScope: "Hva Aipify får tilgang til",
      readOnly: "Aipify kan lese informasjon, men ikke endre noe",
      connectionTest: "Test tilkoblingen",
      secureConnectionKey: "Sikker tilkoblingsnøkkel",
    },
    statuses: {
      pending: "⏳ Venter på oppsett",
      missingInfo: "ℹ️ Informasjon mangler",
      needsReview: "👀 Tilkoblingen må kontrolleres",
      connected: "✅ Tilkoblet og verifisert",
      failed: "❌ Tilkoblingen mislyktes",
      readOnly: "🔒 Begrenset til lesetilgang",
    },
    wizard7Steps: {
      choose_system: "Velg system",
      explain_access: "Forstå hva Aipify trenger",
      find_credential: "Finn tilkoblingsnøkkelen",
      enter_credential: "Skriv inn tilkoblingsnøkkelen",
      test_connection: "Test tilkoblingen",
      access_summary: "Gjennomgå tilgangssammendrag",
      confirm_activation: "Bekreft og aktiver",
    },
    securityWarnings: {
      readOnlyDefault: "Lesetilgang er standard — Aipify kan lese informasjon, men ikke endre noe i det eksterne systemet ditt.",
      noWriteWithoutApproval: "Skrive- eller admin-tilganger aktiveres aldri uten din eksplisitte godkjenning.",
      credentialsEncrypted: "Tilkoblingsnøkkelen krypteres i hvile og vises aldri i full lengde etter lagring.",
      revokeAnytime: "Du kan når som helst trekke tilbake tilgangen ved å fjerne integrasjonen.",
    },
    kcLinks: {
      setupGuide: "Veiledning for integrasjonsoppsett",
      setupGuideHref: "/app/support/knowledge/aipify/integration-setup/faq/integration-setup-faq",
      faq: "Integrasjon FAQ",
      faqHref: "/app/support/knowledge/aipify/integration-setup/faq/integration-setup-faq",
      findApiKey: "Hvor finner jeg tilkoblingsnøkkelen",
      findApiKeyHref: "/app/support/knowledge/aipify/integration-setup/faq/integration-setup-faq#where-do-i-find-my-api-key",
    },
    companionPrompts: {
      whereFindKey: "Hvor finner jeg tilkoblingsnøkkelen for denne integrasjonen?",
      whichProject: "Hvilket prosjekt eller hvilken butikk skal jeg koble til?",
      isAccessSafe: "Er det trygt å gi Aipify skrivebeskyttet tilgang?",
      whyConnectionFails: "Hvorfor mislyktes tilkoblingstesten?",
      checkMySetup: "Kan du sjekke om integrasjonsoppsettet mitt ser riktig ut?",
    },
    setupExtra: {
      confirmActivation: "Bekreft aktivering",
      confirmActivationBody: "Tilkoblingen er lagret sikkert. Kjør en siste test for å aktivere integrasjonen i arbeidsområdet ditt.",
      connectionStatusLabel: "Fremdrift for tilkoblingsoppsett",
      authHelpAsideTitle: "Hjelp til tilkobling",
      testFailedTitle: "Tilkoblingstest mislyktes",
      activateCta: "Aktiver integrasjon",
      activating: "Aktiverer…",
      apiKeyLabel: "Sikker tilkoblingsnøkkel",
    },
    faqExtra: {
      whatIsSecureConnectionKey: "Hva er en sikker tilkoblingsnøkkel?",
      howToTestConnection: "Hvordan tester jeg en integrasjonstilkobling?",
      canChangePermissionsLater: "Kan jeg endre tilganger senere?",
      whoCanManageIntegrations: "Hvem kan administrere integrasjoner i organisasjonen min?",
    },
    faqAnswersExtra: {
      "what-is-secure-connection-key":
        "En sikker tilkoblingsnøkkel (ofte kalt API-nøkkel) lar Aipify koble til det eksterne systemet ditt med tilgangene du godkjenner. Aipify lagrer den kryptert og viser aldri hele nøkkelen etter oppsett.",
      "how-to-test-connection":
        "Etter at du har skrevet inn tilkoblingsnøkkelen, klikk Test tilkoblingen. Aipify verifiserer tilgang med godkjente lese-scopes før aktivering.",
      "can-change-permissions-later":
        "Ja. Fjern integrasjonen, opprett en ny nøkkel med oppdaterte scopes eksternt, og koble til på nytt. Alle endringer logges.",
      "who-can-manage-integrations":
        "Organisasjonseiere og administratorer kan koble til, teste og fjerne integrasjoner. Andre roller kan ha kun lesetilgang.",
    },
  },
};

// sv, da, pl, uk — derive from en with localized key strings
EXTENSIONS.sv = {
  ...EXTENSIONS.en,
  plainLanguage: {
    apiKey: "Säker anslutningsnyckel",
    accessScope: "Vad Aipify får åtkomst till",
    readOnly: "Aipify kan läsa information men inte ändra något",
    connectionTest: "Testa anslutningen",
    secureConnectionKey: "Säker anslutningsnyckel",
  },
  statuses: {
    pending: "⏳ Väntar på konfiguration",
    missingInfo: "ℹ️ Information saknas",
    needsReview: "👀 Anslutningen måste granskas",
    connected: "✅ Ansluten och verifierad",
    failed: "❌ Anslutningen misslyckades",
    readOnly: "🔒 Begränsad till skrivskyddad åtkomst",
  },
  wizard7Steps: {
    choose_system: "Välj system",
    explain_access: "Förstå vad Aipify behöver",
    find_credential: "Hitta anslutningsnyckeln",
    enter_credential: "Ange anslutningsnyckeln",
    test_connection: "Testa anslutningen",
    access_summary: "Granska åtkomstsammanfattning",
    confirm_activation: "Bekräfta och aktivera",
  },
  securityWarnings: {
    readOnlyDefault: "Skrivskyddad åtkomst är standard — Aipify kan läsa information men inte ändra något i ditt externa system.",
    noWriteWithoutApproval: "Skriv- eller admin-behörigheter aktiveras aldrig utan ditt uttryckliga godkännande.",
    credentialsEncrypted: "Din anslutningsnyckel krypteras i vila och visas aldrig i full längd efter sparning.",
    revokeAnytime: "Du kan när som helst återkalla åtkomst genom att ta bort integrationen.",
  },
  kcLinks: { ...EXTENSIONS.en.kcLinks, setupGuide: "Integrationsguide", faq: "Integrations-FAQ", findApiKey: "Var hittar jag anslutningsnyckeln" },
  companionPrompts: {
    whereFindKey: "Var hittar jag anslutningsnyckeln för denna integration?",
    whichProject: "Vilket projekt eller vilken butik ska jag ansluta?",
    isAccessSafe: "Är det säkert att ge Aipify skrivskyddad åtkomst?",
    whyConnectionFails: "Varför misslyckades anslutningstestet?",
    checkMySetup: "Kan du kontrollera om min integrationskonfiguration ser korrekt ut?",
  },
  setupExtra: {
    confirmActivation: "Bekräfta aktivering",
    confirmActivationBody: "Din anslutning är sparad säkert. Kör ett sista test för att aktivera integrationen i din arbetsyta.",
    connectionStatusLabel: "Framsteg för anslutningskonfiguration",
    authHelpAsideTitle: "Anslutningshjälp",
    testFailedTitle: "Anslutningstest misslyckades",
    activateCta: "Aktivera integration",
    activating: "Aktiverar…",
    apiKeyLabel: "Säker anslutningsnyckel",
  },
  faqExtra: {
    whatIsSecureConnectionKey: "Vad är en säker anslutningsnyckel?",
    howToTestConnection: "Hur testar jag en integrationsanslutning?",
    canChangePermissionsLater: "Kan jag ändra behörigheter senare?",
    whoCanManageIntegrations: "Vem kan hantera integrationer i min organisation?",
  },
  faqAnswersExtra: {
    "what-is-secure-connection-key":
      "En säker anslutningsnyckel (ofta kallad API-nyckel) låter Aipify ansluta till ditt externa system med de behörigheter du godkänner. Aipify lagrar den krypterad och visar aldrig hela nyckeln efter konfiguration.",
    "how-to-test-connection":
      "Efter att du angett anslutningsnyckeln, klicka på Testa anslutningen. Aipify verifierar åtkomst med godkända skrivskyddade scopes före aktivering.",
    "can-change-permissions-later":
      "Ja. Ta bort integrationen, skapa en ny nyckel med uppdaterade scopes externt och anslut igen. Alla ändringar loggas.",
    "who-can-manage-integrations":
      "Organisationsägare och administratörer kan ansluta, testa och ta bort integrationer. Andra roller kan ha skrivskyddad visning.",
  },
};

EXTENSIONS.da = {
  ...EXTENSIONS.en,
  plainLanguage: {
    apiKey: "Sikker forbindelsesnøgle",
    accessScope: "Hvad Aipify får adgang til",
    readOnly: "Aipify kan læse information, men ikke ændre noget",
    connectionTest: "Test forbindelsen",
    secureConnectionKey: "Sikker forbindelsesnøgle",
  },
  statuses: {
    pending: "⏳ Afventer opsætning",
    missingInfo: "ℹ️ Information mangler",
    needsReview: "👀 Forbindelsen skal gennemgås",
    connected: "✅ Forbundet og verificeret",
    failed: "❌ Forbindelsen mislykkedes",
    readOnly: "🔒 Begrænset til skrivebeskyttet adgang",
  },
  wizard7Steps: {
    choose_system: "Vælg system",
    explain_access: "Forstå hvad Aipify har brug for",
    find_credential: "Find forbindelsesnøglen",
    enter_credential: "Indtast forbindelsesnøglen",
    test_connection: "Test forbindelsen",
    access_summary: "Gennemgå adgangsoversigt",
    confirm_activation: "Bekræft og aktiver",
  },
  securityWarnings: {
    readOnlyDefault: "Skrivebeskyttet adgang er standard — Aipify kan læse information, men ikke ændre noget i dit eksterne system.",
    noWriteWithoutApproval: "Skrive- eller admin-tilladelser aktiveres aldrig uden din udtrykkelige godkendelse.",
    credentialsEncrypted: "Din forbindelsesnøgle krypteres i hvile og vises aldrig i fuld længde efter lagring.",
    revokeAnytime: "Du kan til enhver tid tilbagekalde adgang ved at fjerne integrationen.",
  },
  kcLinks: { ...EXTENSIONS.en.kcLinks, setupGuide: "Integrationsvejledning", faq: "Integrations-FAQ", findApiKey: "Hvor finder jeg forbindelsesnøglen" },
  companionPrompts: {
    whereFindKey: "Hvor finder jeg forbindelsesnøglen til denne integration?",
    whichProject: "Hvilket projekt eller hvilken butik skal jeg forbinde?",
    isAccessSafe: "Er det sikkert at give Aipify skrivebeskyttet adgang?",
    whyConnectionFails: "Hvorfor mislykkedes forbindelsestesten?",
    checkMySetup: "Kan du tjekke om min integrationsopsætning ser korrekt ud?",
  },
  setupExtra: {
    confirmActivation: "Bekræft aktivering",
    confirmActivationBody: "Din forbindelse er gemt sikkert. Kør en sidste test for at aktivere integrationen i dit workspace.",
    connectionStatusLabel: "Fremskridt for forbindelsesopsætning",
    authHelpAsideTitle: "Forbindelseshjælp",
    testFailedTitle: "Forbindelsestest mislykkedes",
    activateCta: "Aktiver integration",
    activating: "Aktiverer…",
    apiKeyLabel: "Sikker forbindelsesnøgle",
  },
  faqExtra: {
    whatIsSecureConnectionKey: "Hvad er en sikker forbindelsesnøgle?",
    howToTestConnection: "Hvordan tester jeg en integrationsforbindelse?",
    canChangePermissionsLater: "Kan jeg ændre tilladelser senere?",
    whoCanManageIntegrations: "Hvem kan administrere integrationer i min organisation?",
  },
  faqAnswersExtra: {
    "what-is-secure-connection-key":
      "En sikker forbindelsesnøgle (ofte kaldet API-nøgle) lader Aipify forbinde til dit eksterne system med de tilladelser, du godkender. Aipify gemmer den krypteret og viser aldrig hele nøglen efter opsætning.",
    "how-to-test-connection":
      "Efter du har indtastet forbindelsesnøglen, klik Test forbindelsen. Aipify verificerer adgang med godkendte skrivebeskyttede scopes før aktivering.",
    "can-change-permissions-later":
      "Ja. Fjern integrationen, opret en ny nøgle med opdaterede scopes eksternt, og forbind igen. Alle ændringer logges.",
    "who-can-manage-integrations":
      "Organisationsejere og administratorer kan forbinde, teste og fjerne integrationer. Andre roller kan have skrivebeskyttet visning.",
  },
};

EXTENSIONS.pl = {
  ...EXTENSIONS.en,
  plainLanguage: {
    apiKey: "Bezpieczny klucz połączenia",
    accessScope: "Do czego Aipify ma dostęp",
    readOnly: "Aipify może odczytywać informacje, ale nic nie zmienia",
    connectionTest: "Przetestuj połączenie",
    secureConnectionKey: "Bezpieczny klucz połączenia",
  },
  statuses: {
    pending: "⏳ Oczekuje na konfigurację",
    missingInfo: "ℹ️ Brakuje informacji",
    needsReview: "👀 Połączenie wymaga weryfikacji",
    connected: "✅ Połączono i zweryfikowano",
    failed: "❌ Połączenie nie powiodło się",
    readOnly: "🔒 Ograniczone do dostępu tylko do odczytu",
  },
  wizard7Steps: {
    choose_system: "Wybierz system",
    explain_access: "Zrozum, czego potrzebuje Aipify",
    find_credential: "Znajdź klucz połączenia",
    enter_credential: "Wprowadź klucz połączenia",
    test_connection: "Przetestuj połączenie",
    access_summary: "Przegląd uprawnień dostępu",
    confirm_activation: "Potwierdź i aktywuj",
  },
  securityWarnings: {
    readOnlyDefault: "Dostęp tylko do odczytu jest domyślny — Aipify może odczytywać informacje, ale nic nie zmienia w systemie zewnętrznym.",
    noWriteWithoutApproval: "Uprawnienia zapisu lub admina nigdy nie są włączane bez Twojej wyraźnej zgody.",
    credentialsEncrypted: "Klucz połączenia jest szyfrowany w spoczynku i nigdy nie jest wyświetlany w całości po zapisaniu.",
    revokeAnytime: "Możesz w każdej chwili cofnąć dostęp, usuwając integrację.",
  },
  kcLinks: { ...EXTENSIONS.en.kcLinks, setupGuide: "Przewodnik konfiguracji integracji", faq: "FAQ integracji", findApiKey: "Gdzie znaleźć klucz połączenia" },
  companionPrompts: {
    whereFindKey: "Gdzie znajdę klucz połączenia dla tej integracji?",
    whichProject: "Który projekt lub sklep powinienem połączyć?",
    isAccessSafe: "Czy bezpieczne jest udzielenie Aipify dostępu tylko do odczytu?",
    whyConnectionFails: "Dlaczego test połączenia nie powiódł się?",
    checkMySetup: "Czy możesz sprawdzić, czy moja konfiguracja integracji wygląda poprawnie?",
  },
  setupExtra: {
    confirmActivation: "Potwierdź aktywację",
    confirmActivationBody: "Połączenie zostało bezpiecznie zapisane. Uruchom ostatni test, aby aktywować integrację w workspace.",
    connectionStatusLabel: "Postęp konfiguracji połączenia",
    authHelpAsideTitle: "Pomoc przy połączeniu",
    testFailedTitle: "Test połączenia nie powiódł się",
    activateCta: "Aktywuj integrację",
    activating: "Aktywowanie…",
    apiKeyLabel: "Bezpieczny klucz połączenia",
  },
  faqExtra: {
    whatIsSecureConnectionKey: "Czym jest bezpieczny klucz połączenia?",
    howToTestConnection: "Jak przetestować połączenie integracji?",
    canChangePermissionsLater: "Czy mogę później zmienić uprawnienia?",
    whoCanManageIntegrations: "Kto może zarządzać integracjami w mojej organizacji?",
  },
  faqAnswersExtra: {
    "what-is-secure-connection-key":
      "Bezpieczny klucz połączenia (często nazywany kluczem API) pozwala Aipify połączyć się z systemem zewnętrznym z zatwierdzonymi uprawnieniami. Aipify przechowuje go zaszyfrowany i nigdy nie pokazuje pełnego klucza po konfiguracji.",
    "how-to-test-connection":
      "Po wprowadzeniu klucza połączenia kliknij Przetestuj połączenie. Aipify weryfikuje dostęp z zatwierdzonymi zakresami tylko do odczytu przed aktywacją.",
    "can-change-permissions-later":
      "Tak. Usuń integrację, utwórz nowy klucz z zaktualizowanymi zakresami zewnętrznie i połącz ponownie. Wszystkie zmiany są rejestrowane.",
    "who-can-manage-integrations":
      "Właściciele i administratorzy organizacji mogą łączyć, testować i usuwać integracje. Inne role mogą mieć dostęp tylko do podglądu.",
  },
};

EXTENSIONS.uk = {
  ...EXTENSIONS.en,
  plainLanguage: {
    apiKey: "Безпечний ключ підключення",
    accessScope: "До чого Aipify матиме доступ",
    readOnly: "Aipify може читати інформацію, але нічого не змінює",
    connectionTest: "Перевірити підключення",
    secureConnectionKey: "Безпечний ключ підключення",
  },
  statuses: {
    pending: "⏳ Очікує налаштування",
    missingInfo: "ℹ️ Не вистачає інформації",
    needsReview: "👀 Підключення потребує перевірки",
    connected: "✅ Підключено та перевірено",
    failed: "❌ Підключення не вдалося",
    readOnly: "🔒 Обмежено доступом лише для читання",
  },
  wizard7Steps: {
    choose_system: "Оберіть систему",
    explain_access: "Зрозумійте, що потрібно Aipify",
    find_credential: "Знайдіть ключ підключення",
    enter_credential: "Введіть ключ підключення",
    test_connection: "Перевірте підключення",
    access_summary: "Перегляньте підсумок доступу",
    confirm_activation: "Підтвердіть та активуйте",
  },
  securityWarnings: {
    readOnlyDefault: "Доступ лише для читання — стандарт. Aipify може читати інформацію, але нічого не змінює у зовнішній системі.",
    noWriteWithoutApproval: "Дозволи на запис або адміністрування ніколи не вмикаються без вашої явної згоди.",
    credentialsEncrypted: "Ключ підключення шифрується в спокої та ніколи не показується повністю після збереження.",
    revokeAnytime: "Ви можете будь-коли скасувати доступ, видаливши інтеграцію.",
  },
  kcLinks: { ...EXTENSIONS.en.kcLinks, setupGuide: "Посібник з налаштування інтеграції", faq: "FAQ інтеграцій", findApiKey: "Де знайти ключ підключення" },
  companionPrompts: {
    whereFindKey: "Де знайти ключ підключення для цієї інтеграції?",
    whichProject: "Який проєкт або магазин мені підключити?",
    isAccessSafe: "Чи безпечно надати Aipify доступ лише для читання?",
    whyConnectionFails: "Чому перевірка підключення не вдалася?",
    checkMySetup: "Чи можете перевірити, чи правильно налаштовано мою інтеграцію?",
  },
  setupExtra: {
    confirmActivation: "Підтвердити активацію",
    confirmActivationBody: "Підключення збережено безпечно. Запустіть фінальну перевірку, щоб активувати інтеграцію у workspace.",
    connectionStatusLabel: "Прогрес налаштування підключення",
    authHelpAsideTitle: "Допомога з підключенням",
    testFailedTitle: "Перевірка підключення не вдалася",
    activateCta: "Активувати інтеграцію",
    activating: "Активація…",
    apiKeyLabel: "Безпечний ключ підключення",
  },
  faqExtra: {
    whatIsSecureConnectionKey: "Що таке безпечний ключ підключення?",
    howToTestConnection: "Як перевірити підключення інтеграції?",
    canChangePermissionsLater: "Чи можу я пізніше змінити дозволи?",
    whoCanManageIntegrations: "Хто може керувати інтеграціями в моїй організації?",
  },
  faqAnswersExtra: {
    "what-is-secure-connection-key":
      "Безпечний ключ підключення (часто називається API-ключем) дозволяє Aipify підключитися до зовнішньої системи з дозволами, які ви схвалюєте. Aipify зберігає його зашифрованим і ніколи не показує повний ключ після налаштування.",
    "how-to-test-connection":
      "Після введення ключа підключення натисніть Перевірити підключення. Aipify перевіряє доступ із схваленими областями лише для читання перед активацією.",
    "can-change-permissions-later":
      "Так. Видаліть інтеграцию, створіть новий ключ із оновленими областями зовні та підключіться знову. Усі зміни реєструються.",
    "who-can-manage-integrations":
      "Власники та адміністратори організації можуть підключати, перевіряти та видаляти інтеграції. Інші ролі можуть мати доступ лише для перегляду.",
  },
};

const AUTH_HELP_EN = {
  sectionTitles: {
    what: "What is this?",
    why: "Why Aipify needs it",
    where: "Where to find it",
    project: "Which project or store",
    permissions: "Which permissions to choose",
    canChange: "Can I change this later?",
    revoke: "How to revoke access",
  },
  stepsTitle: "Step-by-step",
  technicalDetailsTitle: "Technical details",
  technicalDetailsToggleShow: "Show technical details",
  technicalDetailsToggleHide: "Hide technical details",
  shopify: {
    what: "A Shopify Admin API access token lets Aipify read store data you approve — orders, products, and customers metadata.",
    why: "Aipify uses read-only store signals to surface operational insights in your workspace.",
    where: "Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app → Configure Admin API scopes.",
    project: "Select the Shopify store (production or development) you want Aipify to connect to.",
    permissions: "Enable read-only scopes only — for example read_products, read_orders. Avoid write scopes unless explicitly required.",
    canChange: "Yes. Create a new token with updated scopes in Shopify, replace credentials in Aipify, then revoke the old token.",
    revoke: "Delete the custom app or revoke the token in Shopify Admin, then remove the integration in Aipify.",
    steps: {
      "1": "Log in to Shopify Admin for your store.",
      "2": "Go to Settings → Apps and sales channels → Develop apps.",
      "3": "Create an app and configure Admin API read-only scopes.",
      "4": "Install the app and copy the Admin API access token.",
      "5": "Paste the token into Aipify and run Test the connection.",
    },
    technicalDetails: "Uses Shopify Admin REST/GraphQL API with custom app access tokens. Token shown once at creation.",
  },
  wordpress: {
    what: "An Application Password or REST API token lets Aipify read approved WordPress site metadata.",
    why: "Aipify connects to understand your site structure and surface operational context.",
    where: "WordPress Admin → Users → Profile → Application Passwords (or a security plugin's API section).",
    permissions: "Create a dedicated user with read-only capabilities. Avoid administrator accounts for API access.",
    canChange: "Revoke the application password in WordPress and create a new one in Aipify.",
    revoke: "Remove the Application Password in WordPress Admin and delete the integration in Aipify.",
    steps: {
      "1": "Log in to WordPress Admin.",
      "2": "Open Users → Profile → Application Passwords.",
      "3": "Create a new application password with a descriptive name.",
      "4": "Copy the generated password and paste it into Aipify.",
    },
    technicalDetails: "WordPress Application Passwords (WP 5.6+) use Basic Auth over HTTPS for REST API access.",
  },
  woocommerce: {
    what: "WooCommerce REST API keys let Aipify read store data from your WordPress/WooCommerce site.",
    why: "Read-only commerce signals help Aipify prepare operational insights for your organization.",
    where: "WordPress Admin → WooCommerce → Settings → Advanced → REST API → Add key.",
    project: "Select the WooCommerce store URL that matches your live or staging environment.",
    permissions: "Set permission to Read. Never choose Write unless explicitly approved.",
    canChange: "Revoke the key in WooCommerce, generate a new read key, and update Aipify.",
    revoke: "Delete the REST API key in WooCommerce and remove the integration in Aipify.",
    steps: {
      "1": "Log in to WordPress Admin.",
      "2": "Go to WooCommerce → Settings → Advanced → REST API.",
      "3": "Click Add key, set Read permission, and generate.",
      "4": "Copy Consumer key and Consumer secret.",
      "5": "Paste into Aipify and run Test the connection.",
    },
    technicalDetails: "WooCommerce REST API v3 uses Consumer key/secret over HTTPS.",
  },
  custom_api: {
    what: "A secure API key or bearer token for your custom system lets Aipify read approved operational data.",
    why: "Custom integrations let Aipify work inside your existing admin or API without replacing your tools.",
    where: "Check your system's Admin, Developer, or Integrations settings — each platform differs.",
    permissions: "Request read-only or minimum scopes. Document which endpoints Aipify may call.",
    canChange: "Rotate the key in your system and update credentials in Aipify.",
    revoke: "Revoke the API key in your external system and remove the integration in Aipify.",
    steps: {
      "1": "Log in to your system's admin panel.",
      "2": "Open Developer, API, or Integrations settings.",
      "3": "Create a read-only API key or token.",
      "4": "Copy the key and paste it into Aipify.",
    },
    technicalDetails: "Supports HTTPS REST APIs with API key, Bearer token, or Basic Auth as configured.",
  },
  stripe: {
    what: "A Stripe restricted API key lets Aipify read payment and subscription metadata you approve.",
    why: "Billing and subscription signals help Aipify align workspace insights with your commercial data.",
    where: "Stripe Dashboard → Developers → API keys → Create restricted key.",
    project: "Select the correct Stripe account (test or live mode) before creating the key.",
    permissions: "Grant read-only permissions for the resources listed in the setup wizard. Never use the secret key.",
    canChange: "Roll the restricted key in Stripe and update Aipify credentials.",
    revoke: "Delete the restricted key in Stripe Dashboard and remove the integration in Aipify.",
    steps: {
      "1": "Log in to Stripe Dashboard.",
      "2": "Go to Developers → API keys.",
      "3": "Create a restricted key with read-only permissions.",
      "4": "Copy the key (shown once).",
      "5": "Paste into Aipify and run Test the connection.",
    },
    technicalDetails: "Uses Stripe restricted API keys — not the account secret key. Test/live mode must match your environment.",
  },
};

const ERROR_GUIDANCE_EN = {
  actions: {
    retry: "Try again",
    findKey: "Help finding my key",
    contactSupport: "Contact support",
  },
  findKeyHref: "/app/support/knowledge/aipify/integration-setup/faq/integration-setup-faq#where-do-i-find-my-api-key",
  contactSupportHref: "/app/support/contact",
  unauthorized: {
    title: "The connection key was not accepted",
    body: "The external system rejected the credentials. This usually means the key is wrong, expired, or missing required read permissions.",
    checklist: {
      verifyKey: "Verify you copied the full connection key without extra spaces.",
      readOnly: "Confirm the key has read-only permissions for the scopes Aipify listed.",
      notRevoked: "Check the key has not been revoked in your external platform.",
      correctProject: "Make sure you selected the correct store, site, or project.",
    },
  },
  network: {
    title: "Could not reach the external system",
    body: "Aipify could not connect to the provider. This may be a temporary network issue or the provider may be unavailable.",
    checklist: {
      connectivity: "Check your internet connection and try again.",
      providerStatus: "Verify the external platform is online and accessible.",
      retryLater: "Wait a few minutes and run Test the connection again.",
    },
  },
  invalidScope: {
    title: "The approved permissions do not match",
    body: "The connection key does not include the read permissions Aipify needs for this integration.",
    checklist: {
      readOnly: "Create a new key with read-only scopes listed in the setup wizard.",
      approvedScopes: "Compare approved scopes in Aipify with permissions on the external key.",
      regenerateKey: "Regenerate the key after updating permissions, then paste the new key.",
    },
  },
  missingEnv: {
    title: "Integration configuration is incomplete",
    body: "A required platform setting is missing. Your organization admin or Aipify Support may need to complete configuration.",
    checklist: {
      contactAdmin: "Contact your organization administrator to verify integration settings.",
      supportTicket: "Open a support request with your provider name and setup step.",
    },
  },
  validationPending: {
    title: "Connection validation is still in progress",
    body: "Aipify is still verifying the connection. This can take a moment after saving credentials.",
    checklist: {
      wait: "Wait a few seconds and try again.",
      retryTest: "Click Test the connection once more.",
    },
  },
  unknown: {
    title: "Something unexpected happened",
    body: "The connection test did not succeed. Review your setup and try again, or contact support if the issue continues.",
    checklist: {
      verifySetup: "Walk through the setup steps and confirm read-only permissions.",
      retryTest: "Run Test the connection again after verifying your key.",
    },
  },
};

function buildAuthHelp(locale) {
  const base = AUTH_HELP_EN;
  if (locale === "en") return base;
  // Non-English locales use English auth help as structural baseline;
  // section titles localized per locale extension where available.
  return base;
}

function patchIntegrations(integrations, locale, ext) {
  integrations.plainLanguage = ext.plainLanguage;
  integrations.statuses = ext.statuses;
  integrations.wizard7Steps = ext.wizard7Steps;
  integrations.securityWarnings = ext.securityWarnings;
  integrations.kcLinks = ext.kcLinks;
  integrations.companionPrompts = ext.companionPrompts;
  integrations.authHelp = buildAuthHelp(locale);
  integrations.errorGuidance = ERROR_GUIDANCE_EN;

  Object.assign(integrations.setup, ext.setupExtra);
  Object.assign(integrations.faq, ext.faqExtra);
  Object.assign(integrations.faqAnswers, ext.faqAnswersExtra);

  return integrations;
}

function ensureIntegrationsBlock(portalStructure, locale, ext) {
  if (!portalStructure.integrations) {
    // pl/uk may lack full block — clone structure from en template via ext + minimal hub
    portalStructure.integrations = {
      hub: {
        title: ext.hub?.title ?? "Integrations",
        subtitle: ext.hub?.subtitle ?? "Connect external platforms to Aipify.",
        loading: "Loading integrations…",
        readOnlyPrinciple: ext.securityWarnings.readOnlyDefault,
        privacyNote: ext.securityWarnings.credentialsEncrypted,
        canManageNote: "You can connect, test, replace, and remove integrations.",
        viewOnlyNote: "Your role can view integrations but cannot change credentials.",
        connectedTitle: "Connected integrations",
        noConnections: "No integrations connected yet.",
        providersTitle: "Available platforms",
        connectCta: "Connect",
        manageCta: "Manage",
        lastTestSuccess: "Last connection test succeeded",
        lastTestFailed: "Last connection test failed",
        permissionReadOnly: ext.plainLanguage.readOnly,
        permissionReadWrite: "Read & write access",
        helpTitle: "Integration help",
      },
      setup: {
        title: "Connect",
        loading: "Loading setup…",
        back: "Back to Integrations",
        selectSetupType: "Choose connection method",
        oauthOption: "Automatic connection (OAuth / official app)",
        manualOption: "Manual connection key",
        permissionPreview: "Review permissions before approving",
        approveScopes: "I approve these permission scopes and understand what Aipify can access",
        approveScopesRequired: "Scope approval is required before saving",
        apiKeyPlaceholder: "Paste your read-only connection key",
        apiKeyMaskedNote: "Saved key (masked)",
        accessSummaryTitle: "Access summary",
        whatAipifyReads: "Aipify can read operational metadata required for the approved scopes only.",
        whatAipifyCannotDo: "Aipify cannot change data in your external system with read-only access.",
        credentialStorage: ext.securityWarnings.credentialsEncrypted,
        revokeAccess: ext.securityWarnings.revokeAnytime,
        rotateKey: "Replace credentials by saving a new key and revoking the old one externally.",
        connectionFailed: "Connection test failed — review permissions and try again.",
        save: "Save securely",
        test: ext.plainLanguage.connectionTest,
        remove: "Remove integration",
        replace: "Replace credentials",
        connectOAuth: "Connect with provider",
        saving: "Saving…",
        testing: "Testing…",
        successTitle: "Integration saved",
        successBody: "Your connection was saved and logged. Full secrets are never shown again.",
        whyAccess: "Aipify needs limited access to deliver value inside your workspace.",
        whatNotToEnable: "Do not enable admin-wide, destructive, or write permissions unless explicitly required.",
        backStep: "Back",
        continueStep: "Continue",
        steps: {},
        manualSteps: {},
        oauthSteps: {},
      },
      guidance: {
        whyAccess: "Why Aipify needs access",
        whatCanRead: "Aipify reads only metadata covered by approved scopes.",
        whatCannotDo: ext.plainLanguage.readOnly,
        howStored: ext.securityWarnings.credentialsEncrypted,
        howRevoke: ext.securityWarnings.revokeAnytime,
        howRotate: "Generate a new read-only key externally, replace in Aipify, test, then revoke the old key.",
        ifFails: "Verify read-only scopes, key validity, and run Test the connection again.",
      },
      faq: {},
      faqAnswers: {},
    };
  }
  return patchIntegrations(portalStructure.integrations, locale, ext);
}

for (const locale of LOCALES) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "portalStructure.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const ext = EXTENSIONS[locale];
  ensureIntegrationsBlock(raw.portalStructure, locale, ext);
  fs.writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`Patched ${locale}/portalStructure.json`);
}

// Patch companion.json context suggestions
const COMPANION_SUGGESTIONS = {
  en: {
    integrationSetup: "Integration setup",
    whereFindKey: "Where do I find my connection key for this integration?",
    whichProject: "Which project or store should I connect?",
    isAccessSafe: "Is it safe to give Aipify read-only access?",
    whyConnectionFails: "Why did my connection test fail?",
    checkMySetup: "Can you check if my integration setup looks correct?",
  },
  no: {
    integrationSetup: "Integrasjonsoppsett",
    whereFindKey: "Hvor finner jeg tilkoblingsnøkkelen for denne integrasjonen?",
    whichProject: "Hvilket prosjekt eller hvilken butikk skal jeg koble til?",
    isAccessSafe: "Er det trygt å gi Aipify skrivebeskyttet tilgang?",
    whyConnectionFails: "Hvorfor mislyktes tilkoblingstesten?",
    checkMySetup: "Kan du sjekke om integrasjonsoppsettet mitt ser riktig ut?",
  },
  sv: {
    integrationSetup: "Integrationskonfiguration",
    whereFindKey: "Var hittar jag anslutningsnyckeln för denna integration?",
    whichProject: "Vilket projekt eller vilken butik ska jag ansluta?",
    isAccessSafe: "Är det säkert att ge Aipify skrivskyddad åtkomst?",
    whyConnectionFails: "Varför misslyckades anslutningstestet?",
    checkMySetup: "Kan du kontrollera om min integrationskonfiguration ser korrekt ut?",
  },
  da: {
    integrationSetup: "Integrationsopsætning",
    whereFindKey: "Hvor finder jeg forbindelsesnøglen til denne integration?",
    whichProject: "Hvilket projekt eller hvilken butik skal jeg forbinde?",
    isAccessSafe: "Er det sikkert at give Aipify skrivebeskyttet adgang?",
    whyConnectionFails: "Hvorfor mislykkedes forbindelsestesten?",
    checkMySetup: "Kan du tjekke om min integrationsopsætning ser korrekt ud?",
  },
  pl: {
    integrationSetup: "Konfiguracja integracji",
    whereFindKey: "Gdzie znajdę klucz połączenia dla tej integracji?",
    whichProject: "Który projekt lub sklep powinienem połączyć?",
    isAccessSafe: "Czy bezpieczne jest udzielenie Aipify dostępu tylko do odczytu?",
    whyConnectionFails: "Dlaczego test połączenia nie powiódł się?",
    checkMySetup: "Czy możesz sprawdzić, czy moja konfiguracja integracji wygląda poprawnie?",
  },
  uk: {
    integrationSetup: "Налаштування інтеграції",
    whereFindKey: "Де знайти ключ підключення для цієї інтеграції?",
    whichProject: "Який проєкт або магазин мені підключити?",
    isAccessSafe: "Чи безпечно надати Aipify доступ лише для читання?",
    whyConnectionFails: "Чому перевірка підключення не вдалася?",
    checkMySetup: "Чи можете перевірити, чи правильно налаштовано мою інтеграцію?",
  },
};

for (const locale of LOCALES) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "companion.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const exp = raw.companionExperience ?? raw.customerApp?.companionExperience;
  const target = raw.companionExperience ? raw.companionExperience : raw;
  const ce = raw.companionExperience ?? (raw.companionExperience = {});
  if (!ce.contextPages) ce.contextPages = {};
  if (!ce.contextSuggestions) ce.contextSuggestions = {};
  Object.assign(ce.contextPages, { integrationSetup: COMPANION_SUGGESTIONS[locale].integrationSetup });
  Object.assign(ce.contextSuggestions, COMPANION_SUGGESTIONS[locale]);
  fs.writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`Patched ${locale}/companion.json`);
}

console.log("Done.");
