#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..");
const locales = ["en", "no", "sv", "da", "es", "pl", "uk"];

const CRM_I18N = {
  en: {
    customer: "Customer", lead: "Lead", prospect: "Prospect", contact: "Contact", company: "Company",
    owner: "Customer owner", assignedSeller: "Assigned seller", partnerAttribution: "Partner attribution",
    status: { active: "Active", inactive: "Inactive", prospect: "Prospect", atRisk: "At risk", open: "Open" },
    outcomes: {
      multipleMatches: "Multiple CRM records matched — review the shortlist or refine your search.",
      noMatch: "No customer, lead, or contact matched that search in your organization.",
      maskedContact: "Contact details are masked until your role allows directory contact reads.",
      permissionDenied: "Your role cannot search CRM customers or leads.",
      providerMissing: "No live CRM directory provider is connected for this organization.",
      partialResult: "Aipify returned partial CRM metadata — some fields are unavailable from the current source.",
      clarification: "More than one record may match — add an email, organization number, or choose from the list.",
    },
    commandBrief: {
      newLead: "New leads are available in your CRM pipeline.",
      leadWithoutFollowUp: "Leads are waiting for follow-up.",
      recommendedFollowUp: "Recommended follow-ups are ready for review.",
      customerHealthWarning: "Customers need health attention.",
      churnRisk: "Customers show elevated churn risk.",
      dealStatusChange: "Deal status changes may need review.",
      conversionDeviation: "Conversion metrics deviate from expected patterns.",
      unassignedCustomer: "Customers have no assigned owner.",
      duplicateCustomerCandidate: "Possible duplicate customer records were detected.",
    },
    warnings: {
      partnerNotOwner: "Partner attribution is metadata — the customer belongs to your organization on Aipify Platform.",
      writeBlocked: "CRM directory write-actions are disabled in Companion runtime.",
      leadNotCustomer: "Leads and customers are separate relationship types — no automatic merge.",
    },
  },
  no: {
    customer: "Kunde", lead: "Lead", prospect: "Prospekt", contact: "Kontakt", company: "Firma",
    owner: "Kundeeier", assignedSeller: "Tildelt selger", partnerAttribution: "Partnerattribusjon",
    status: { active: "Aktiv", inactive: "Inaktiv", prospect: "Prospekt", atRisk: "I risiko", open: "Åpen" },
    outcomes: {
      multipleMatches: "Flere CRM-poster passet — se listen eller presiser søket.",
      noMatch: "Ingen kunde, lead eller kontakt passet søket i organisasjonen din.",
      maskedContact: "Kontaktinformasjon er maskert til rollen din tillater kontaktoppslag.",
      permissionDenied: "Rollen din kan ikke søke i CRM-kunder eller leads.",
      providerMissing: "Ingen live CRM-katalog er koblet til denne organisasjonen ennå.",
      partialResult: "Aipify returnerte delvis CRM-metadata — noen felter er utilgjengelige.",
      clarification: "Flere poster kan passe — legg til e-post, org.nr. eller velg fra listen.",
    },
    commandBrief: {
      newLead: "Nye leads er tilgjengelige i CRM-pipeline.",
      leadWithoutFollowUp: "Leads venter på oppfølging.",
      recommendedFollowUp: "Anbefalt oppfølging er klar for gjennomgang.",
      customerHealthWarning: "Kunder trenger helseoppmerksomhet.",
      churnRisk: "Kunder viser forhøyet churn-risiko.",
      dealStatusChange: "Avtalestatusendringer kan trenge gjennomgang.",
      conversionDeviation: "Konverteringsmålinger avviker fra forventet mønster.",
      unassignedCustomer: "Kunder har ingen tildelt eier.",
      duplicateCustomerCandidate: "Mulige duplikate kundeposter ble oppdaget.",
    },
    warnings: {
      partnerNotOwner: "Partnerattribusjon er metadata — kunden tilhører organisasjonen din på Aipify Platform.",
      writeBlocked: "CRM-skrivehandlinger er deaktivert i Companion.",
      leadNotCustomer: "Leads og kunder er separate relasjonstyper — ingen automatisk sammenslåing.",
    },
  },
  sv: {
    customer: "Kund", lead: "Lead", prospect: "Prospekt", contact: "Kontakt", company: "Företag",
    owner: "Kundägare", assignedSeller: "Tilldelad säljare", partnerAttribution: "Partnerattribution",
    status: { active: "Aktiv", inactive: "Inaktiv", prospect: "Prospekt", atRisk: "Risk", open: "Öppen" },
    outcomes: {
      multipleMatches: "Flera CRM-poster matchade — granska listan eller förfina sökningen.",
      noMatch: "Ingen kund, lead eller kontakt matchade sökningen.",
      maskedContact: "Kontaktuppgifter maskeras tills din roll tillåter kontaktuppslag.",
      permissionDenied: "Din roll kan inte söka CRM-kunder eller leads.",
      providerMissing: "Ingen live CRM-katalog är ansluten till denna organisation ännu.",
      partialResult: "Aipify returnerade partiell CRM-metadata.",
      clarification: "Flera poster kan matcha — lägg till e-post, org.nr eller välj från listan.",
    },
    commandBrief: {
      newLead: "Nya leads finns i CRM-pipeline.",
      leadWithoutFollowUp: "Leads väntar på uppföljning.",
      recommendedFollowUp: "Rekommenderad uppföljning är redo för granskning.",
      customerHealthWarning: "Kunder behöver hälsoattention.",
      churnRisk: "Kunder visar förhöjd churn-risk.",
      dealStatusChange: "Affärsstatusändringar kan behöva granskas.",
      conversionDeviation: "Konverteringsmått avviker från förväntat mönster.",
      unassignedCustomer: "Kunder saknar tilldelad ägare.",
      duplicateCustomerCandidate: "Möjliga dubbletter av kundposter upptäcktes.",
    },
    warnings: {
      partnerNotOwner: "Partnerattribution är metadata — kunden tillhör din organisation på Aipify Platform.",
      writeBlocked: "CRM-skrivåtgärder är inaktiverade i Companion.",
      leadNotCustomer: "Leads och kunder är separata relationstyper.",
    },
  },
  da: {
    customer: "Kunde", lead: "Lead", prospect: "Prospekt", contact: "Kontakt", company: "Virksomhed",
    owner: "Kundeejer", assignedSeller: "Tildelt sælger", partnerAttribution: "Partnerattribution",
    status: { active: "Aktiv", inactive: "Inaktiv", prospect: "Prospekt", atRisk: "I risiko", open: "Åben" },
    outcomes: {
      multipleMatches: "Flere CRM-poster matchede — gennemgå listen eller præcisér søgningen.",
      noMatch: "Ingen kunde, lead eller kontakt matchede søgningen.",
      maskedContact: "Kontaktoplysninger maskeres, indtil din rolle tillader kontaktoppslag.",
      permissionDenied: "Din rolle kan ikke søge CRM-kunder eller leads.",
      providerMissing: "Ingen live CRM-katalog er tilkoblet denne organisation endnu.",
      partialResult: "Aipify returnerede delvis CRM-metadata.",
      clarification: "Flere poster kan matche — tilføj e-mail, CVR eller vælg fra listen.",
    },
    commandBrief: {
      newLead: "Nye leads er tilgængelige i CRM-pipeline.",
      leadWithoutFollowUp: "Leads afventer opfølgning.",
      recommendedFollowUp: "Anbefalet opfølgning er klar til gennemgang.",
      customerHealthWarning: "Kunder kræver sundhedsopmærksomhed.",
      churnRisk: "Kunder viser forhøjet churn-risiko.",
      dealStatusChange: "Aftalestatusændringer kan kræve gennemgang.",
      conversionDeviation: "Konverteringsmålinger afviger fra forventet mønster.",
      unassignedCustomer: "Kunder har ingen tildelt ejer.",
      duplicateCustomerCandidate: "Mulige duplikerede kundeposter blev fundet.",
    },
    warnings: {
      partnerNotOwner: "Partnerattribution er metadata — kunden tilhører din organisation på Aipify Platform.",
      writeBlocked: "CRM-skrivehandlinger er deaktiveret i Companion.",
      leadNotCustomer: "Leads og kunder er separate relationstyper.",
    },
  },
  es: {
    customer: "Cliente", lead: "Lead", prospect: "Prospecto", contact: "Contacto", company: "Empresa",
    owner: "Propietario del cliente", assignedSeller: "Vendedor asignado", partnerAttribution: "Atribución de partner",
    status: { active: "Activo", inactive: "Inactivo", prospect: "Prospecto", atRisk: "En riesgo", open: "Abierto" },
    outcomes: {
      multipleMatches: "Varios registros CRM coincidieron — revise la lista o refine la búsqueda.",
      noMatch: "Ningún cliente, lead o contacto coincidió con esa búsqueda.",
      maskedContact: "Los datos de contacto están enmascarados hasta que su rol lo permita.",
      permissionDenied: "Su rol no puede buscar clientes o leads de CRM.",
      providerMissing: "Aún no hay un proveedor CRM conectado para esta organización.",
      partialResult: "Aipify devolvió metadatos CRM parciales.",
      clarification: "Puede haber más de un registro — añada email, NIF o elija de la lista.",
    },
    commandBrief: {
      newLead: "Hay nuevos leads en el pipeline CRM.",
      leadWithoutFollowUp: "Leads esperan seguimiento.",
      recommendedFollowUp: "Seguimientos recomendados listos para revisión.",
      customerHealthWarning: "Clientes requieren atención de salud.",
      churnRisk: "Clientes muestran riesgo elevado de abandono.",
      dealStatusChange: "Cambios de estado de acuerdos pueden requerir revisión.",
      conversionDeviation: "Las métricas de conversión se desvían del patrón esperado.",
      unassignedCustomer: "Clientes sin propietario asignado.",
      duplicateCustomerCandidate: "Se detectaron posibles registros de clientes duplicados.",
    },
    warnings: {
      partnerNotOwner: "La atribución de partner es metadata — el cliente pertenece a su organización en Aipify Platform.",
      writeBlocked: "Las acciones de escritura CRM están deshabilitadas en Companion.",
      leadNotCustomer: "Leads y clientes son tipos de relación separados.",
    },
  },
  pl: {
    customer: "Klient", lead: "Lead", prospect: "Prospekt", contact: "Kontakt", company: "Firma",
    owner: "Właściciel klienta", assignedSeller: "Przypisany handlowiec", partnerAttribution: "Atrybucja partnera",
    status: { active: "Aktywny", inactive: "Nieaktywny", prospect: "Prospekt", atRisk: "Ryzyko", open: "Otwarty" },
    outcomes: {
      multipleMatches: "Dopasowano wiele rekordów CRM — przejrzyj listę lub doprecyzuj wyszukiwanie.",
      noMatch: "Żaden klient, lead ani kontakt nie pasuje do tego wyszukiwania.",
      maskedContact: "Dane kontaktowe są maskowane, dopóki rola na to nie zezwala.",
      permissionDenied: "Twoja rola nie może przeszukiwać klientów ani leadów CRM.",
      providerMissing: "Brak podłączonego live katalogu CRM dla tej organizacji.",
      partialResult: "Aipify zwróciło częściowe metadane CRM.",
      clarification: "Może pasować więcej niż jeden rekord — dodaj e-mail, NIP lub wybierz z listy.",
    },
    commandBrief: {
      newLead: "Nowe leady są dostępne w pipeline CRM.",
      leadWithoutFollowUp: "Leady czekają na follow-up.",
      recommendedFollowUp: "Zalecany follow-up gotowy do przeglądu.",
      customerHealthWarning: "Klienci wymagają uwagi zdrowotnej.",
      churnRisk: "Klienci wykazują podwyższone ryzyko odejścia.",
      dealStatusChange: "Zmiany statusu umów mogą wymagać przeglądu.",
      conversionDeviation: "Metryki konwersji odbiegają od oczekiwanego wzorca.",
      unassignedCustomer: "Klienci bez przypisanego właściciela.",
      duplicateCustomerCandidate: "Wykryto możliwe duplikaty rekordów klientów.",
    },
    warnings: {
      partnerNotOwner: "Atrybucja partnera to metadane — klient należy do Twojej organizacji na Aipify Platform.",
      writeBlocked: "Akcje zapisu CRM są wyłączone w Companion.",
      leadNotCustomer: "Leady i klienci to oddzielne typy relacji.",
    },
  },
  uk: {
    customer: "Клієнт", lead: "Лід", prospect: "Проспект", contact: "Контакт", company: "Компанія",
    owner: "Власник клієнта", assignedSeller: "Призначений продавець", partnerAttribution: "Атрибуція партнера",
    status: { active: "Активний", inactive: "Неактивний", prospect: "Проспект", atRisk: "У ризику", open: "Відкритий" },
    outcomes: {
      multipleMatches: "Знайдено кілька CRM-записів — перегляньте список або уточніть пошук.",
      noMatch: "Жоден клієнт, лід або контакт не відповідає цьому пошуку.",
      maskedContact: "Контактні дані маскуються, доки ваша роль не дозволить їх перегляд.",
      permissionDenied: "Ваша роль не може шукати CRM-клієнтів або лідів.",
      providerMissing: "Для цієї організації ще не підключено live CRM-кatalog.",
      partialResult: "Aipify повернув часткові CRM-метадані.",
      clarification: "Може підходити кілька записів — додайте email, ЄДРПОУ або оберіть зі списку.",
    },
    commandBrief: {
      newLead: "Нові ліди доступні в CRM-pipeline.",
      leadWithoutFollowUp: "Ліди очікують follow-up.",
      recommendedFollowUp: "Рекомендований follow-up готовий до перегляду.",
      customerHealthWarning: "Клієнти потребують уваги до здоров'я.",
      churnRisk: "Клієнти мають підвищений ризик відтоку.",
      dealStatusChange: "Зміни статусу угод можуть потребувати перегляду.",
      conversionDeviation: "Метрики конверсії відхиляються від очікуваного.",
      unassignedCustomer: "Клієнти без призначеного власника.",
      duplicateCustomerCandidate: "Виявлено можливі дублікати записів клієнтів.",
    },
    warnings: {
      partnerNotOwner: "Атрибуція партнера — це метадані; клієнт належить вашій організації на Aipify Platform.",
      writeBlocked: "Дії запису CRM вимкнено в Companion.",
      leadNotCustomer: "Ліди та клієнти — окремі типи відносин.",
    },
  },
};

for (const locale of locales) {
  const filePath = path.join(repoRoot, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  raw.companionPlatformKnowledge.directory.crm = CRM_I18N[locale];
  fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
  console.log(`Updated ${locale}/customer-app/companionPlatformKnowledge.json`);
}

console.log("CRM directory i18n generation complete.");
