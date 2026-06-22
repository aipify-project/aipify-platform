#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..");
const locales = ["en", "no", "sv", "da", "es", "pl", "uk"];

const APP_EMPLOYEE_I18N_BY_LOCALE = {
  en: {
    employee: "Employee",
    employees: "Employees",
    role: "Role",
    team: "Team",
    department: "Department",
    status: {
      active: "Active",
      inactive: "Inactive",
      pendingInvitation: "Invitation pending",
      suspended: "Suspended",
      disabled: "Disabled",
      offboarded: "Offboarded",
    },
    outcomes: {
      multipleMatches: "Multiple employees matched — review the shortlist or refine your search.",
      noMatch: "No employee matched that search in your organization.",
      maskedContact: "Contact details are masked until your role allows directory contact reads.",
      permissionDenied: "Your role cannot search organization employees.",
      providerMissing: "No live APP employee directory provider is connected for this organization.",
      unsupportedField: "That employee search field is not supported by the connected provider.",
      clarification: "More than one employee may match — add an email or choose from the shortlist.",
    },
    commandBrief: {
      newEmployee: "New employees were added to the organization.",
      pendingInvitation: "Employee invitations are waiting to be accepted.",
      inactiveEmployee: "Inactive employees may need review.",
      accessReviewRequired: "Employee access grants should be reviewed.",
      missingTeamAssignment: "Some active employees have no team or department assignment.",
      roleChange: "Recent employee role changes may need review.",
    },
    warnings: {
      teamPartialSource: "Team assignment uses Organization Center enrichment — some employees may lack team metadata.",
      roleNotPermission: "Role name does not guarantee module access — effective permissions are evaluated separately.",
      writeBlocked: "Employee directory write-actions are disabled in Companion runtime.",
    },
  },
  no: {
    employee: "Ansatt",
    employees: "Ansatte",
    role: "Rolle",
    team: "Team",
    department: "Avdeling",
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      pendingInvitation: "Invitasjon venter",
      suspended: "Suspendert",
      disabled: "Deaktivert",
      offboarded: "Avsluttet",
    },
    outcomes: {
      multipleMatches: "Flere ansatte passet — se listen eller presiser søket.",
      noMatch: "Ingen ansatt passet søket i organisasjonen din.",
      maskedContact: "Kontaktinformasjon er maskert til rollen din tillater kontaktoppslag.",
      permissionDenied: "Rollen din kan ikke søke i organisasjonens ansatte.",
      providerMissing: "Ingen live APP-ansattkatalog er koblet til denne organisasjonen ennå.",
      unsupportedField: "Det søkefeltet støttes ikke av den tilkoblede leverandøren.",
      clarification: "Flere ansatte kan passe — legg til e-post eller velg fra listen.",
    },
    commandBrief: {
      newEmployee: "Nye ansatte er lagt til i organisasjonen.",
      pendingInvitation: "Ansattinvitasjoner venter på aksept.",
      inactiveEmployee: "Inaktive ansatte kan trenge gjennomgang.",
      accessReviewRequired: "Ansattes tilganger bør gjennomgås.",
      missingTeamAssignment: "Noen aktive ansatte mangler team- eller avdelingstilhørighet.",
      roleChange: "Nylige rolleendringer kan trenge gjennomgang.",
    },
    warnings: {
      teamPartialSource: "Teamtilhørighet berikes fra Organization Center — noen ansatte kan mangle teammetadata.",
      roleNotPermission: "Rollenavn garanterer ikke modultilgang — effektive tillatelser vurderes separat.",
      writeBlocked: "Skrivehandlinger for ansattkatalog er deaktivert i Companion.",
    },
  },
  sv: {
    employee: "Anställd",
    employees: "Anställda",
    role: "Roll",
    team: "Team",
    department: "Avdelning",
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      pendingInvitation: "Inbjudan väntar",
      suspended: "Suspenderad",
      disabled: "Inaktiverad",
      offboarded: "Avslutad",
    },
    outcomes: {
      multipleMatches: "Flera anställda matchade — granska listan eller förfina sökningen.",
      noMatch: "Ingen anställd matchade sökningen i din organisation.",
      maskedContact: "Kontaktuppgifter maskeras tills din roll tillåter kontaktuppslag.",
      permissionDenied: "Din roll kan inte söka bland organisationens anställda.",
      providerMissing: "Ingen live APP-personalkatalog är ansluten till denna organisation ännu.",
      unsupportedField: "Det sökfältet stöds inte av den anslutna leverantören.",
      clarification: "Flera anställda kan matcha — lägg till e-post eller välj från listan.",
    },
    commandBrief: {
      newEmployee: "Nya anställda har lagts till i organisationen.",
      pendingInvitation: "Inbjudningar till anställda väntar på accept.",
      inactiveEmployee: "Inaktiva anställda kan behöva granskas.",
      accessReviewRequired: "Anställdas åtkomst bör granskas.",
      missingTeamAssignment: "Vissa aktiva anställda saknar team- eller avdelningstillhörighet.",
      roleChange: "Nyliga rolländringar kan behöva granskas.",
    },
    warnings: {
      teamPartialSource: "Teamtillhörighet berikas från Organization Center — vissa anställda kan sakna teammetadata.",
      roleNotPermission: "Rollnamn garanterar inte modulåtkomst — effektiva behörigheter bedöms separat.",
      writeBlocked: "Skrivåtgärder för personalkatalogen är inaktiverade i Companion.",
    },
  },
  da: {
    employee: "Medarbejder",
    employees: "Medarbejdere",
    role: "Rolle",
    team: "Team",
    department: "Afdeling",
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      pendingInvitation: "Invitation afventer",
      suspended: "Suspenderet",
      disabled: "Deaktiveret",
      offboarded: "Fratrådt",
    },
    outcomes: {
      multipleMatches: "Flere medarbejdere matchede — gennemgå listen eller præcisér søgningen.",
      noMatch: "Ingen medarbejder matchede søgningen i din organisation.",
      maskedContact: "Kontaktoplysninger maskeres, indtil din rolle tillader kontaktoppslag.",
      permissionDenied: "Din rolle kan ikke søge i organisationens medarbejdere.",
      providerMissing: "Ingen live APP-medarbejderkatalog er tilkoblet denne organisation endnu.",
      unsupportedField: "Det søgefelt understøttes ikke af den tilkoblede udbyder.",
      clarification: "Flere medarbejdere kan matche — tilføj e-mail eller vælg fra listen.",
    },
    commandBrief: {
      newEmployee: "Nye medarbejdere er tilføjet organisationen.",
      pendingInvitation: "Medarbejderinvitationer afventer accept.",
      inactiveEmployee: "Inaktive medarbejdere kan kræve gennemgang.",
      accessReviewRequired: "Medarbejderadgange bør gennemgås.",
      missingTeamAssignment: "Nogle aktive medarbejdere mangler team- eller afdelingstilhørighed.",
      roleChange: "Nylige rolleændringer kan kræve gennemgang.",
    },
    warnings: {
      teamPartialSource: "Teamtilknytning beriges fra Organization Center — nogle medarbejdere kan mangle teammetadata.",
      roleNotPermission: "Rollenavn garanterer ikke moduladgang — effektive tilladelser vurderes separat.",
      writeBlocked: "Skrivehandlinger for medarbejderkatalog er deaktiveret i Companion.",
    },
  },
  es: {
    employee: "Empleado",
    employees: "Empleados",
    role: "Rol",
    team: "Equipo",
    department: "Departamento",
    status: {
      active: "Activo",
      inactive: "Inactivo",
      pendingInvitation: "Invitación pendiente",
      suspended: "Suspendido",
      disabled: "Desactivado",
      offboarded: "Dado de baja",
    },
    outcomes: {
      multipleMatches: "Varios empleados coincidieron — revise la lista o refine la búsqueda.",
      noMatch: "Ningún empleado coincidió con esa búsqueda en su organización.",
      maskedContact: "Los datos de contacto están enmascarados hasta que su rol permita lecturas de contacto.",
      permissionDenied: "Su rol no puede buscar empleados de la organización.",
      providerMissing: "Aún no hay un proveedor de directorio de empleados APP conectado para esta organización.",
      unsupportedField: "Ese campo de búsqueda no es compatible con el proveedor conectado.",
      clarification: "Puede haber más de un empleado — añada un correo o elija de la lista.",
    },
    commandBrief: {
      newEmployee: "Se añadieron nuevos empleados a la organización.",
      pendingInvitation: "Hay invitaciones de empleados pendientes de aceptación.",
      inactiveEmployee: "Los empleados inactivos pueden necesitar revisión.",
      accessReviewRequired: "Las concesiones de acceso de empleados deben revisarse.",
      missingTeamAssignment: "Algunos empleados activos no tienen equipo o departamento asignado.",
      roleChange: "Los cambios recientes de rol pueden necesitar revisión.",
    },
    warnings: {
      teamPartialSource: "La asignación de equipo usa Organization Center — algunos empleados pueden carecer de metadatos de equipo.",
      roleNotPermission: "El nombre del rol no garantiza acceso al módulo — los permisos efectivos se evalúan por separado.",
      writeBlocked: "Las acciones de escritura del directorio de empleados están deshabilitadas en Companion.",
    },
  },
  pl: {
    employee: "Pracownik",
    employees: "Pracownicy",
    role: "Rola",
    team: "Zespół",
    department: "Dział",
    status: {
      active: "Aktywny",
      inactive: "Nieaktywny",
      pendingInvitation: "Oczekuje zaproszenia",
      suspended: "Zawieszony",
      disabled: "Wyłączony",
      offboarded: "Zakończony",
    },
    outcomes: {
      multipleMatches: "Dopasowano wielu pracowników — przejrzyj listę lub doprecyzuj wyszukiwanie.",
      noMatch: "Żaden pracownik nie pasuje do tego wyszukiwania w Twojej organizacji.",
      maskedContact: "Dane kontaktowe są maskowane, dopóki Twoja rola nie zezwala na odczyt kontaktu.",
      permissionDenied: "Twoja rola nie może przeszukiwać pracowników organizacji.",
      providerMissing: "Brak podłączonego live katalogu pracowników APP dla tej organizacji.",
      unsupportedField: "To pole wyszukiwania nie jest obsługiwane przez podłączonego dostawcę.",
      clarification: "Może pasować więcej niż jeden pracownik — dodaj e-mail lub wybierz z listy.",
    },
    commandBrief: {
      newEmployee: "Do organizacji dodano nowych pracowników.",
      pendingInvitation: "Zaproszenia pracownicze oczekują na akceptację.",
      inactiveEmployee: "Nieaktywni pracownicy mogą wymagać przeglądu.",
      accessReviewRequired: "Uprawnienia pracowników powinny zostać sprawdzone.",
      missingTeamAssignment: "Niektórzy aktywni pracownicy nie mają przypisanego zespołu ani działu.",
      roleChange: "Ostatnie zmiany ról mogą wymagać przeglądu.",
    },
    warnings: {
      teamPartialSource: "Przypisanie zespołu korzysta z Organization Center — część pracowników może nie mieć metadanych zespołu.",
      roleNotPermission: "Nazwa roli nie gwarantuje dostępu do modułu — skuteczne uprawnienia są oceniane osobno.",
      writeBlocked: "Akcje zapisu katalogu pracowników są wyłączone w Companion.",
    },
  },
  uk: {
    employee: "Співробітник",
    employees: "Співробітники",
    role: "Роль",
    team: "Команда",
    department: "Відділ",
    status: {
      active: "Активний",
      inactive: "Неактивний",
      pendingInvitation: "Запрошення очікує",
      suspended: "Призупинений",
      disabled: "Вимкнений",
      offboarded: "Звільнений",
    },
    outcomes: {
      multipleMatches: "Знайдено кілька співробітників — перегляньте список або уточніть пошук.",
      noMatch: "Жоден співробітник не відповідає цьому пошуку у вашій організації.",
      maskedContact: "Контактні дані маскуються, доки ваша роль не дозволить читання контактів.",
      permissionDenied: "Ваша роль не може шукати співробітників організації.",
      providerMissing: "Для цієї організації ще не підключено live каталог співробітників APP.",
      unsupportedField: "Це поле пошуку не підтримується підключеним провайдером.",
      clarification: "Може підходити кілька співробітників — додайте email або оберіть зі списку.",
    },
    commandBrief: {
      newEmployee: "До організації додано нових співробітників.",
      pendingInvitation: "Запрошення співробітників очікують прийняття.",
      inactiveEmployee: "Неактивні співробітники можуть потребувати перегляду.",
      accessReviewRequired: "Доступи співробітників слід перевірити.",
      missingTeamAssignment: "Деякі активні співробітники не мають команди чи відділу.",
      roleChange: "Нещодавні зміни ролей можуть потребувати перегляду.",
    },
    warnings: {
      teamPartialSource: "Призначення команди використовує Organization Center — у частини співробітників може не бути метаданих команди.",
      roleNotPermission: "Назва ролі не гарантує доступ до модуля — ефективні дозволи оцінюються окремо.",
      writeBlocked: "Дії запису каталогу співробітників вимкнено в Companion.",
    },
  },
};

for (const locale of locales) {
  const filePath = path.join(repoRoot, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  raw.companionPlatformKnowledge.directory.providers.app_employee_directory =
    locale === "en"
      ? "APP organization employees"
      : APP_EMPLOYEE_I18N_BY_LOCALE[locale].employees;
  raw.companionPlatformKnowledge.directory.searchTerms.app_employee_directory =
    locale === "en"
      ? "employee staff colleague organization member search"
      : `${APP_EMPLOYEE_I18N_BY_LOCALE[locale].employee} ${APP_EMPLOYEE_I18N_BY_LOCALE[locale].employees}`;
  raw.companionPlatformKnowledge.directory.appEmployee = APP_EMPLOYEE_I18N_BY_LOCALE[locale];
  fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`Updated ${locale}/customer-app/companionPlatformKnowledge.json`);
}

console.log("APP employee directory i18n generation complete.");
