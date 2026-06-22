#!/usr/bin/env node
/**
 * Patches integration wizard completion i18n for all core locales.
 * Run: node scripts/patch-integration-wizard-completion-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LOCALES = ["en", "no", "sv", "da", "pl", "uk"];

const COMPLETION = {
  en: {
    verifiedHeading: "Unonight is connected and verified",
    credentialSavedHeading: "Connection key saved",
    statusActive: "✅ Active",
    statusReadOnly: "🔒 Read-only access",
    statusAwaitingVerification: "⏳ Awaiting verification",
    organizationLabel: "Organization",
    accessTypeLabel: "Access type",
    permissionsLabel: "Permissions",
    lastVerifiedLabel: "Last verified",
    apiVersionLabel: "API version",
    technicalDetailsLabel: "Technical details",
    technicalScopeLabel: "Technical scope identifiers",
    verifiedBody:
      "Aipify verified your read-only connection with Unonight. You can manage the integration from Platform → Integrations.",
    credentialSavedBody:
      "Your connection key is stored securely. Run a connection test to verify access before activation.",
    primaryIntegrations: "Go to connected integrations",
    secondaryRetest: "Test connection again",
    tertiaryOverview: "Back to your overview",
    primaryTest: "Test connection",
    secondaryIntegrations: "Back to integrations",
    activateCta: "Activate integration",
    activating: "Activating…",
    overviewHref: "/app",
  },
  no: {
    verifiedHeading: "Unonight er tilkoblet og verifisert",
    credentialSavedHeading: "Tilkoblingsnøkkelen er lagret",
    statusActive: "✅ Aktiv",
    statusReadOnly: "🔒 Lesetilgang",
    statusAwaitingVerification: "⏳ Venter på verifisering",
    organizationLabel: "Organisasjon",
    accessTypeLabel: "Tilgangstype",
    permissionsLabel: "Tillatelser",
    lastVerifiedLabel: "Sist verifisert",
    apiVersionLabel: "API-versjon",
    technicalDetailsLabel: "Tekniske detaljer",
    technicalScopeLabel: "Tekniske scope-identifikatorer",
    verifiedBody:
      "Aipify har verifisert den skrivebeskyttede tilkoblingen til Unonight. Du kan administrere integrasjonen under Plattform → Integrasjoner.",
    credentialSavedBody:
      "Tilkoblingsnøkkelen er lagret sikkert. Kjør en tilkoblingstest for å verifisere tilgang før aktivering.",
    primaryIntegrations: "Gå til tilkoblede integrasjoner",
    secondaryRetest: "Test tilkoblingen på nytt",
    tertiaryOverview: "Tilbake til din oversikt",
    primaryTest: "Test tilkoblingen",
    secondaryIntegrations: "Tilbake til integrasjoner",
    activateCta: "Aktiver integrasjon",
    activating: "Aktiverer…",
    overviewHref: "/app",
  },
  sv: {
    verifiedHeading: "Unonight är ansluten och verifierad",
    credentialSavedHeading: "Anslutningsnyckeln har sparats",
    statusActive: "✅ Aktiv",
    statusReadOnly: "🔒 Skrivskyddad åtkomst",
    statusAwaitingVerification: "⏳ Väntar på verifiering",
    organizationLabel: "Organisation",
    accessTypeLabel: "Åtkomsttyp",
    permissionsLabel: "Behörigheter",
    lastVerifiedLabel: "Senast verifierad",
    apiVersionLabel: "API-version",
    technicalDetailsLabel: "Tekniska detaljer",
    technicalScopeLabel: "Tekniska scope-identifierare",
    verifiedBody:
      "Aipify har verifierat din skrivskyddade anslutning till Unonight. Du kan hantera integrationen under Plattform → Integrationer.",
    credentialSavedBody:
      "Din anslutningsnyckel lagras säkert. Kör ett anslutningstest för att verifiera åtkomst före aktivering.",
    primaryIntegrations: "Gå till anslutna integrationer",
    secondaryRetest: "Testa anslutningen igen",
    tertiaryOverview: "Tillbaka till din översikt",
    primaryTest: "Testa anslutningen",
    secondaryIntegrations: "Tillbaka till integrationer",
    activateCta: "Aktivera integration",
    activating: "Aktiverar…",
    overviewHref: "/app",
  },
  da: {
    verifiedHeading: "Unonight er forbundet og verificeret",
    credentialSavedHeading: "Forbindelsesnøglen er gemt",
    statusActive: "✅ Aktiv",
    statusReadOnly: "🔒 Skrivebeskyttet adgang",
    statusAwaitingVerification: "⏳ Afventer verificering",
    organizationLabel: "Organisation",
    accessTypeLabel: "Adgangstype",
    permissionsLabel: "Tilladelser",
    lastVerifiedLabel: "Sidst verificeret",
    apiVersionLabel: "API-version",
    technicalDetailsLabel: "Tekniske detaljer",
    technicalScopeLabel: "Tekniske scope-identifikatorer",
    verifiedBody:
      "Aipify har verificeret din skrivebeskyttede forbindelse til Unonight. Du kan administrere integrationen under Platform → Integrationer.",
    credentialSavedBody:
      "Din forbindelsesnøgle gemmes sikkert. Kør en forbindelsestest for at verificere adgang før aktivering.",
    primaryIntegrations: "Gå til tilsluttede integrationer",
    secondaryRetest: "Test forbindelsen igen",
    tertiaryOverview: "Tilbage til din oversigt",
    primaryTest: "Test forbindelsen",
    secondaryIntegrations: "Tilbage til integrationer",
    activateCta: "Aktiver integration",
    activating: "Aktiverer…",
    overviewHref: "/app",
  },
  pl: {
    verifiedHeading: "Unonight jest połączony i zweryfikowany",
    credentialSavedHeading: "Klucz połączenia został zapisany",
    statusActive: "✅ Aktywny",
    statusReadOnly: "🔒 Dostęp tylko do odczytu",
    statusAwaitingVerification: "⏳ Oczekuje na weryfikację",
    organizationLabel: "Organizacja",
    accessTypeLabel: "Typ dostępu",
    permissionsLabel: "Uprawnienia",
    lastVerifiedLabel: "Ostatnia weryfikacja",
    apiVersionLabel: "Wersja API",
    technicalDetailsLabel: "Szczegóły techniczne",
    technicalScopeLabel: "Techniczne identyfikatory zakresów",
    verifiedBody:
      "Aipify zweryfikowało połączenie tylko do odczytu z Unonight. Możesz zarządzać integracją w Platforma → Integracje.",
    credentialSavedBody:
      "Klucz połączenia jest bezpiecznie przechowywany. Uruchom test połączenia, aby zweryfikować dostęp przed aktywacją.",
    primaryIntegrations: "Przejdź do połączonych integracji",
    secondaryRetest: "Przetestuj połączenie ponownie",
    tertiaryOverview: "Wróć do przeglądu",
    primaryTest: "Przetestuj połączenie",
    secondaryIntegrations: "Wróć do integracji",
    activateCta: "Aktywuj integrację",
    activating: "Aktywowanie…",
    overviewHref: "/app",
  },
  uk: {
    verifiedHeading: "Unonight підключено та перевірено",
    credentialSavedHeading: "Ключ підключення збережено",
    statusActive: "✅ Активно",
    statusReadOnly: "🔒 Доступ лише для читання",
    statusAwaitingVerification: "⏳ Очікує перевірки",
    organizationLabel: "Організація",
    accessTypeLabel: "Тип доступу",
    permissionsLabel: "Дозволи",
    lastVerifiedLabel: "Остання перевірка",
    apiVersionLabel: "Версія API",
    technicalDetailsLabel: "Технічні деталі",
    technicalScopeLabel: "Технічні ідентифікатори областей",
    verifiedBody:
      "Aipify перевірило ваше підключення лише для читання до Unonight. Керуйте інтеграцією в Платформа → Інтеграції.",
    credentialSavedBody:
      "Ключ підключення збережено безпечно. Запустіть перевірку підключення перед активацією.",
    primaryIntegrations: "Перейти до підключених інтеграцій",
    secondaryRetest: "Перевірити підключення знову",
    tertiaryOverview: "Назад до огляду",
    primaryTest: "Перевірити підключення",
    secondaryIntegrations: "Назад до інтеграцій",
    activateCta: "Активувати інтеграцію",
    activating: "Активація…",
    overviewHref: "/app",
  },
};

const REMOVE_DIALOG = {
  en: {
    title: "Remove integration?",
    body: "This disconnects Aipify from your external platform for this organization.",
    disconnectWhat: "The live connection to your external platform will be disconnected.",
    syncStops: "Background sync and ingestion for this integration will stop.",
    credentialsRemoved: "Stored credentials will be removed from Aipify.",
    auditRemains: "Audit records of setup and removal actions will remain.",
    confirm: "❌ Remove integration",
    cancel: "Cancel",
  },
  no: {
    title: "Fjerne integrasjon?",
    body: "Dette kobler Aipify fra den eksterne plattformen for denne organisasjonen.",
    disconnectWhat: "Den live tilkoblingen til den eksterne plattformen blir frakoblet.",
    syncStops: "Bakgrunnssynkronisering og innhenting for denne integrasjonen stopper.",
    credentialsRemoved: "Lagrede legitimasjoner fjernes fra Aipify.",
    auditRemains: "Revisjonslogger for oppsett og fjerning beholdes.",
    confirm: "❌ Fjern integrasjon",
    cancel: "Avbryt",
  },
  sv: {
    title: "Ta bort integration?",
    body: "Detta kopplar bort Aipify från din externa plattform för denna organisation.",
    disconnectWhat: "Den live-anslutningen till din externa plattform kopplas bort.",
    syncStops: "Bakgrundssynkronisering och inhämtning för denna integration stoppas.",
    credentialsRemoved: "Lagrad autentisering tas bort från Aipify.",
    auditRemains: "Granskningsloggar för konfiguration och borttagning behålls.",
    confirm: "❌ Ta bort integration",
    cancel: "Avbryt",
  },
  da: {
    title: "Fjern integration?",
    body: "Dette afbryder Aipify fra din eksterne platform for denne organisation.",
    disconnectWhat: "Den live forbindelse til din eksterne platform afbrydes.",
    syncStops: "Baggrundssynkronisering og indhentning for denne integration stopper.",
    credentialsRemoved: "Gemte legitimationsoplysninger fjernes fra Aipify.",
    auditRemains: "Revisionslogge for opsætning og fjernelse bevares.",
    confirm: "❌ Fjern integration",
    cancel: "Annuller",
  },
  pl: {
    title: "Usunąć integrację?",
    body: "Spowoduje to odłączenie Aipify od zewnętrznej platformy dla tej organizacji.",
    disconnectWhat: "Aktywne połączenie z zewnętrzną platformą zostanie rozłączone.",
    syncStops: "Synchronizacja w tle i pobieranie danych dla tej integracji zostanie zatrzymane.",
    credentialsRemoved: "Zapisane dane uwierzytelniające zostaną usunięte z Aipify.",
    auditRemains: "Rejestry audytu konfiguracji i usunięcia pozostaną.",
    confirm: "❌ Usuń integrację",
    cancel: "Anuluj",
  },
  uk: {
    title: "Видалити інтеграцію?",
    body: "Це відключить Aipify від вашої зовнішньої платформи для цієї організації.",
    disconnectWhat: "Активне підключення до зовнішньої платформи буде розірвано.",
    syncStops: "Фонова синхронізація та отримання даних для цієї інтеграції зупиняться.",
    credentialsRemoved: "Збережені облікові дані будуть видалені з Aipify.",
    auditRemains: "Журнали аудиту налаштування та видалення залишаться.",
    confirm: "❌ Видалити інтеграцію",
    cancel: "Скасувати",
  },
};

const STATUS_EXTRA = {
  en: {
    credentialSaved: "ℹ️ Connection key saved securely",
    verifiedReadOnly: "✅ Connected and verified",
    active: "✅ Integration is active",
    awaitingVerification: "⏳ Awaiting verification",
  },
  no: {
    credentialSaved: "ℹ️ Tilkoblingsnøkkelen er lagret sikkert",
    verifiedReadOnly: "✅ Tilkoblet og verifisert",
    active: "✅ Integrasjonen er aktiv",
    awaitingVerification: "⏳ Venter på verifisering",
  },
  sv: {
    credentialSaved: "ℹ️ Anslutningsnyckeln har sparats säkert",
    verifiedReadOnly: "✅ Ansluten och verifierad",
    active: "✅ Integrationen är aktiv",
    awaitingVerification: "⏳ Väntar på verifiering",
  },
  da: {
    credentialSaved: "ℹ️ Forbindelsesnøglen er gemt sikkert",
    verifiedReadOnly: "✅ Forbundet og verificeret",
    active: "✅ Integrationen er aktiv",
    awaitingVerification: "⏳ Afventer verificering",
  },
  pl: {
    credentialSaved: "ℹ️ Klucz połączenia został bezpiecznie zapisany",
    verifiedReadOnly: "✅ Połączono i zweryfikowano",
    active: "✅ Integracja jest aktywna",
    awaitingVerification: "⏳ Oczekuje na weryfikację",
  },
  uk: {
    credentialSaved: "ℹ️ Ключ підключення збережено безпечно",
    verifiedReadOnly: "✅ Підключено та перевірено",
    active: "✅ Інтеграція активна",
    awaitingVerification: "⏳ Очікує перевірки",
  },
};

const SCOPE_DESCRIPTIONS = {
  en: {
    metadata_read: "Read approved operational metadata about your organization",
    organization_read: "Read your organization name and identity for verification",
    integration_status_read: "Read integration health and connection status",
  },
  no: {
    metadata_read: "Lese godkjent driftsmetadata om organisasjonen din",
    organization_read: "Lese organisasjonsnavn og identitet for verifisering",
    integration_status_read: "Lese integrasjonstilstand og tilkoblingsstatus",
  },
  sv: {
    metadata_read: "Läsa godkänd operativ metadata om din organisation",
    organization_read: "Läsa organisationsnamn och identitet för verifiering",
    integration_status_read: "Läsa integrationshälsa och anslutningsstatus",
  },
  da: {
    metadata_read: "Læse godkendt driftsmetadata om din organisation",
    organization_read: "Læse organisationsnavn og identitet til verificering",
    integration_status_read: "Læse integrationstilstand og forbindelsesstatus",
  },
  pl: {
    metadata_read: "Odczyt zatwierdzonych metadanych operacyjnych organizacji",
    organization_read: "Odczyt nazwy i tożsamości organizacji w celu weryfikacji",
    integration_status_read: "Odczyt stanu integracji i statusu połączenia",
  },
  uk: {
    metadata_read: "Читання схвалених операційних метаданих організації",
    organization_read: "Читання назви та ідентичності організації для перевірки",
    integration_status_read: "Читання стану інтеграції та статусу підключення",
  },
};

const SETUP_NO = {
  title: "Koble til",
  loading: "Laster oppsett…",
  back: "Tilbake til integrasjoner",
  selectSetupType: "Velg tilkoblingsmetode",
  oauthOption: "Automatisk tilkobling (OAuth / offisiell app)",
  manualOption: "Manuell API-nøkkel",
  permissionPreview: "Gjennomgå tillatelser før godkjenning",
  approveScopes: "Jeg godkjenner disse tilgangsområdene og forstår hva Aipify får tilgang til",
  approveScopesRequired: "Godkjenning av scopes kreves før lagring",
  apiKeyPlaceholder: "Lim inn skrivebeskyttet API-nøkkel",
  apiKeyMaskedNote: "Lagret nøkkel (maskert)",
  accessSummaryTitle: "Tilgangssammendrag",
  whatAipifyReads: "Aipify kan lese driftsmetadata som kreves for godkjente scopes.",
  whatAipifyCannotDo: "Aipify kan ikke endre data i det eksterne systemet med lesetilgang.",
  credentialStorage: "Legitimasjon krypteres i hvile og vises aldri i full lengde etter lagring.",
  revokeAccess: "Du kan trekke tilbake tilgang ved å fjerne integrasjonen når som helst.",
  rotateKey: "Erstatt legitimasjon ved å lagre en ny API-nøkkel og tilbakekalle den gamle i den eksterne plattformen.",
  connectionFailed: "Tilkoblingstest mislyktes — kontroller tillatelser og prøv igjen.",
  save: "Lagre sikkert",
  test: "Test tilkoblingen",
  remove: "Fjern integrasjon",
  replace: "Erstatt legitimasjon",
  connectOAuth: "Koble til med leverandør",
  saving: "Lagrer…",
  testing: "Tester…",
  successTitle: "Integrasjon lagret",
  successBody: "Tilkoblingen ble lagret og loggført. Fullstendige hemmeligheter vises aldri igjen.",
  whyAccess: "Aipify trenger begrenset tilgang for å levere verdi i arbeidsområdet ditt — innenfor det du godkjenner.",
  whatNotToEnable: "Ikke aktiver admin-, destruktive eller skrivetillatelser med mindre det er eksplisitt nødvendig.",
  backStep: "Tilbake",
  continueStep: "Fortsett",
  manageIntegration: "Administrer integrasjon",
};

const AUTH_HELP_SECTIONS = {
  no: {
    what: "Hva er dette?",
    why: "Hvorfor Aipify trenger det",
    where: "Hvor finner du det",
    project: "Hvilket prosjekt eller hvilken butikk",
    permissions: "Hvilke tillatelser du bør velge",
    canChange: "Kan jeg endre dette senere?",
    revoke: "Slik trekker du tilbake tilgang",
    stepsTitle: "Trinn for trinn",
    technicalDetailsTitle: "Tekniske detaljer",
    technicalDetailsToggleShow: "Vis tekniske detaljer",
    technicalDetailsToggleHide: "Skjul tekniske detaljer",
  },
  sv: {
    what: "Vad är detta?",
    why: "Varför Aipify behöver det",
    where: "Var hittar du det",
    project: "Vilket projekt eller vilken butik",
    permissions: "Vilka behörigheter du bör välja",
    canChange: "Kan jag ändra detta senare?",
    revoke: "Så återkallar du åtkomst",
    stepsTitle: "Steg för steg",
    technicalDetailsTitle: "Tekniska detaljer",
    technicalDetailsToggleShow: "Visa tekniska detaljer",
    technicalDetailsToggleHide: "Dölj tekniska detaljer",
  },
  da: {
    what: "Hvad er dette?",
    why: "Hvorfor Aipify har brug for det",
    where: "Hvor finder du det",
    project: "Hvilket projekt eller hvilken butik",
    permissions: "Hvilke tilladelser du bør vælge",
    canChange: "Kan jeg ændre dette senere?",
    revoke: "Sådan tilbagekalder du adgang",
    stepsTitle: "Trin for trin",
    technicalDetailsTitle: "Tekniske detaljer",
    technicalDetailsToggleShow: "Vis tekniske detaljer",
    technicalDetailsToggleHide: "Skjul tekniske detaljer",
  },
  pl: {
    what: "Co to jest?",
    why: "Dlaczego Aipify tego potrzebuje",
    where: "Gdzie to znaleźć",
    project: "Który projekt lub sklep",
    permissions: "Jakie uprawnienia wybrać",
    canChange: "Czy mogę to później zmienić?",
    revoke: "Jak cofnąć dostęp",
    stepsTitle: "Krok po kroku",
    technicalDetailsTitle: "Szczegóły techniczne",
    technicalDetailsToggleShow: "Pokaż szczegóły techniczne",
    technicalDetailsToggleHide: "Ukryj szczegóły techniczne",
  },
  uk: {
    what: "Що це?",
    why: "Навіщо це потрібно Aipify",
    where: "Де це знайти",
    project: "Який проєкт або магазин",
    permissions: "Які дозволи обрати",
    canChange: "Чи можу я змінити це пізніше?",
    revoke: "Як скасувати доступ",
    stepsTitle: "Покроково",
    technicalDetailsTitle: "Технічні деталі",
    technicalDetailsToggleShow: "Показати технічні деталі",
    technicalDetailsToggleHide: "Приховати технічні деталі",
  },
};

const GUIDANCE = {
  no: {
    whyAccess: "Hvorfor Aipify trenger tilgang",
    whatCanRead: "Aipify leser kun metadata og driftsignaler innenfor godkjente scopes — ikke private samtaler eller betalingskortdata.",
    whatCannotDo: "Aipify kan ikke endre det eksterne systemet med lesetilgang og utfører aldri destruktive handlinger.",
    howStored: "Legitimasjon krypteres i hvile. Maskerte hint kan vises; fullstendige hemmeligheter vises aldri etter lagring.",
    howRevoke: "Fjern integrasjonen under Plattform → Integrasjoner for å trekke tilbake tilgang umiddelbart.",
    howRotate: "Generer en ny skrivebeskyttet nøkkel eksternt, erstatt i Aipify, test, og tilbakekall den gamle nøkkelen.",
    ifFails: "Hvis tilkoblingen mislykkes, kontroller lese-scopes, nøkkelens gyldighet, og kjør Test tilkoblingen på nytt.",
  },
  sv: {
    whyAccess: "Varför Aipify behöver åtkomst",
    whatCanRead: "Aipify läser endast metadata och operativa signaler inom godkända scopes — inte privata konversationer eller betalkortsdata.",
    whatCannotDo: "Aipify kan inte ändra ditt externa system med skrivskyddad åtkomst och utför aldrig destruktiva åtgärder.",
    howStored: "Autentisering krypteras i vila. Maskerade ledtrådar kan visas; fullständiga hemligheter visas aldrig efter sparning.",
    howRevoke: "Ta bort integrationen under Plattform → Integrationer för att återkalla åtkomst omedelbart.",
    howRotate: "Generera en ny skrivskyddad nyckel externt, ersätt i Aipify, testa och återkalla den gamla nyckeln.",
    ifFails: "Om anslutningen misslyckas, verifiera scopes, nyckelns giltighet och kör Testa anslutningen igen.",
  },
  da: {
    whyAccess: "Hvorfor Aipify har brug for adgang",
    whatCanRead: "Aipify læser kun metadata og operationelle signaler inden for godkendte scopes — ikke private samtaler eller betalingskortdata.",
    whatCannotDo: "Aipify kan ikke ændre dit eksterne system med skrivebeskyttet adgang og udfører aldrig destruktive handlinger.",
    howStored: "Legitimationsoplysninger krypteres i hvile. Maskerede hints kan vises; fulde hemmeligheder vises aldrig efter lagring.",
    howRevoke: "Fjern integrationen under Platform → Integrationer for at tilbagekalde adgang med det samme.",
    howRotate: "Generer en ny skrivebeskyttet nøgle eksternt, erstat i Aipify, test og tilbagekald den gamle nøgle.",
    ifFails: "Hvis forbindelsen mislykkes, verificer scopes, nøglens gyldighed og kør Test forbindelsen igen.",
  },
  pl: {
    whyAccess: "Dlaczego Aipify potrzebuje dostępu",
    whatCanRead: "Aipify odczytuje tylko metadane i sygnały operacyjne objęte zatwierdzonymi zakresami — nie prywatne rozmowy ani dane kart.",
    whatCannotDo: "Aipify nie może modyfikować systemu zewnętrznego z dostępem tylko do odczytu i nigdy nie wykonuje destrukcyjnych działań.",
    howStored: "Dane uwierzytelniające są szyfrowane w spoczynku. Mogą być widoczne maskowane podpowiedzi; pełne sekrety nigdy nie są pokazywane po zapisaniu.",
    howRevoke: "Usuń integrację w Platforma → Integracje, aby natychmiast cofnąć dostęp.",
    howRotate: "Wygeneruj nowy klucz tylko do odczytu zewnętrznie, zastąp w Aipify, przetestuj, a następnie unieważnij stary klucz.",
    ifFails: "Jeśli połączenie nie powiedzie się, sprawdź zakresy, ważność klucza i uruchom ponownie test połączenia.",
  },
  uk: {
    whyAccess: "Навіщо Aipify потрібен доступ",
    whatCanRead: "Aipify читає лише метадані та операційні сигнали в межах схвалених областей — не приватні розмови чи платіжні дані.",
    whatCannotDo: "Aipify не може змінювати зовнішню систему з доступом лише для читання і ніколи не виконує руйнівних дій.",
    howStored: "Облікові дані шифруються в спокої. Можуть відображатися масковані підказки; повні секрети ніколи не показуються після збереження.",
    howRevoke: "Видаліть інтеграцію в Платформа → Інтеграції, щоб негайно скасувати доступ.",
    howRotate: "Створіть новий ключ лише для читання зовні, замініть у Aipify, перевірте, потім відкличте старий ключ.",
    ifFails: "Якщо підключення не вдалося, перевірте області, дійсність ключа та запустіть перевірку підключення знову.",
  },
};

const HUB_NO = {
  readOnlyPrinciple: "Aipify ber kun om tilgangen som trengs for å hjelpe organisasjonen din. Skrivebeskyttet tilgang foretrekkes når det er mulig.",
  privacyNote: "Legitimasjon krypteres i hvile. Fullstendige hemmeligheter vises aldri etter lagring.",
  canManageNote: "Du kan koble til, teste, erstatte og fjerne integrasjoner for organisasjonen din.",
  viewOnlyNote: "Rollen din kan se integrasjoner, men ikke endre legitimasjon. Kontakt en organisasjonsadministrator.",
  connectedTitle: "Tilkoblede integrasjoner",
  noConnections: "Ingen integrasjoner er koblet til ennå.",
  providersTitle: "Tilgjengelige plattformer",
  connectCta: "Koble til",
  manageCta: "Administrer",
  lastTestSuccess: "Siste tilkoblingstest lyktes",
  lastTestFailed: "Siste tilkoblingstest mislyktes",
  permissionReadOnly: "Skrivebeskyttet tilgang",
  permissionReadWrite: "Lese- og skrivetilgang",
  helpTitle: "Integrasjonshjelp",
};

for (const locale of LOCALES) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "portalStructure.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const integrations = raw.portalStructure?.integrations ?? raw.integrations;
  if (!integrations) {
    console.warn(`Skip ${locale}: no integrations block`);
    continue;
  }

  integrations.statuses = { ...integrations.statuses, ...STATUS_EXTRA[locale] };
  integrations.scopeDescriptions = SCOPE_DESCRIPTIONS[locale];
  integrations.setup = integrations.setup ?? {};
  integrations.setup.completion = COMPLETION[locale];
  integrations.setup.removeDialog = REMOVE_DIALOG[locale];
  integrations.setup.manageIntegration =
    locale === "no"
      ? "Administrer integrasjon"
      : locale === "sv"
        ? "Hantera integration"
        : locale === "da"
          ? "Administrer integration"
          : locale === "pl"
            ? "Zarządzaj integracją"
            : locale === "uk"
              ? "Керувати інтеграцією"
              : "Manage integration";

  if (locale === "no") {
    Object.assign(integrations.setup, SETUP_NO);
    Object.assign(integrations.hub, HUB_NO);
    Object.assign(integrations.guidance, GUIDANCE.no);
    integrations.authHelp = integrations.authHelp ?? {};
    Object.assign(integrations.authHelp.sectionTitles, AUTH_HELP_SECTIONS.no);
    integrations.authHelp.stepsTitle = AUTH_HELP_SECTIONS.no.stepsTitle;
    integrations.authHelp.technicalDetailsTitle = AUTH_HELP_SECTIONS.no.technicalDetailsTitle;
    integrations.authHelp.technicalDetailsToggleShow = AUTH_HELP_SECTIONS.no.technicalDetailsToggleShow;
    integrations.authHelp.technicalDetailsToggleHide = AUTH_HELP_SECTIONS.no.technicalDetailsToggleHide;
  } else if (AUTH_HELP_SECTIONS[locale]) {
    integrations.authHelp = integrations.authHelp ?? {};
    Object.assign(integrations.authHelp.sectionTitles, AUTH_HELP_SECTIONS[locale]);
    integrations.authHelp.stepsTitle = AUTH_HELP_SECTIONS[locale].stepsTitle;
    integrations.authHelp.technicalDetailsTitle = AUTH_HELP_SECTIONS[locale].technicalDetailsTitle;
    integrations.authHelp.technicalDetailsToggleShow = AUTH_HELP_SECTIONS[locale].technicalDetailsToggleShow;
    integrations.authHelp.technicalDetailsToggleHide = AUTH_HELP_SECTIONS[locale].technicalDetailsToggleHide;
    if (GUIDANCE[locale]) Object.assign(integrations.guidance, GUIDANCE[locale]);
  }

  fs.writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`Patched ${locale}/portalStructure.json`);
}

console.log("Done.");
