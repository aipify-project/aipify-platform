#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const companionExperiencePatch = {
  en: {
    secondarySectionsHide: "Hide details",
    feedbackHelpful: "Helpful answer",
    feedbackNotHelpful: "Not helpful",
    feedbackOrgConfirm: "Confirm as correct for the organization",
    feedbackThanks: "Thank you — your feedback helps Aipify improve.",
    feedbackReasonTitle: "What was the issue?",
    feedbackReasonWrongInfo: "Wrong information",
    feedbackReasonOutdated: "Outdated",
    feedbackReasonMisunderstood: "Misunderstood the question",
    feedbackReasonWrongLink: "Wrong link",
    feedbackReasonTooVague: "Not specific enough",
    feedbackReasonOther: "Other",
    feedbackSubmitReason: "Send feedback",
    feedbackOrgConfirmThanks: "Confirmed for your organization. This is recorded in the audit trail.",
    sourcesTitle: "Sources used",
    sourcesShow: "Sources used",
    sourcesHide: "Hide sources",
    sourcePlatformCorpus: "Platform knowledge guide",
    sourceRouteRegistry: "APP route registry",
    sourceKnowledgeCenter: "Knowledge Center",
    sourceCustomerContext: "Verified subscription context",
    sourceOrgKnowledge: "Approved organization knowledge",
    recentDelete: "Delete conversation",
    recentActive: "Active",
    supportEscalationHint: "If you still need human help, you can create a support request with this context.",
  },
  no: {
    secondarySectionsHide: "Skjul detaljer",
    feedbackHelpful: "Nyttig svar",
    feedbackNotHelpful: "Ikke nyttig",
    feedbackOrgConfirm: "Bekreft som riktig for organisasjonen",
    feedbackThanks: "Takk — tilbakemeldingen din hjelper Aipify å bli bedre.",
    feedbackReasonTitle: "Hva var problemet?",
    feedbackReasonWrongInfo: "Feil informasjon",
    feedbackReasonOutdated: "Utdatert",
    feedbackReasonMisunderstood: "Misforstod spørsmålet",
    feedbackReasonWrongLink: "Feil lenke",
    feedbackReasonTooVague: "For lite konkret",
    feedbackReasonOther: "Annet",
    feedbackSubmitReason: "Send tilbakemelding",
    feedbackOrgConfirmThanks: "Bekreftet for organisasjonen. Dette registreres i revisjonsloggen.",
    sourcesTitle: "Kilder brukt",
    sourcesShow: "Kilder brukt",
    sourcesHide: "Skjul kilder",
    sourcePlatformCorpus: "Plattformkunnskapsguide",
    sourceRouteRegistry: "APP-ruteregister",
    sourceKnowledgeCenter: "Knowledge Center",
    sourceCustomerContext: "Verifisert abonnementskontekst",
    sourceOrgKnowledge: "Godkjent organisasjonskunnskap",
    recentDelete: "Slett samtale",
    recentActive: "Aktiv",
    supportEscalationHint: "Trenger du fortsatt menneskelig hjelp, kan du opprette en supportforespørsel med denne konteksten.",
  },
  sv: {
    secondarySectionsHide: "Dölj detaljer",
    feedbackHelpful: "Hjälpsamt svar",
    feedbackNotHelpful: "Inte hjälpsamt",
    feedbackOrgConfirm: "Bekräfta som korrekt för organisationen",
    feedbackThanks: "Tack — din feedback hjälper Aipify att förbättras.",
    feedbackReasonTitle: "Vad var problemet?",
    feedbackReasonWrongInfo: "Fel information",
    feedbackReasonOutdated: "Föråldrad",
    feedbackReasonMisunderstood: "Missförstod frågan",
    feedbackReasonWrongLink: "Fel länk",
    feedbackReasonTooVague: "För otydligt",
    feedbackReasonOther: "Annat",
    feedbackSubmitReason: "Skicka feedback",
    feedbackOrgConfirmThanks: "Bekräftat för organisationen. Detta registreras i granskningsloggen.",
    sourcesTitle: "Använda källor",
    sourcesShow: "Använda källor",
    sourcesHide: "Dölj källor",
    sourcePlatformCorpus: "Plattformsknowledgeguide",
    sourceRouteRegistry: "APP-ruttregister",
    sourceKnowledgeCenter: "Knowledge Center",
    sourceCustomerContext: "Verifierad prenumerationskontext",
    sourceOrgKnowledge: "Godkänd organisationskunskap",
    recentDelete: "Ta bort konversation",
    recentActive: "Aktiv",
    supportEscalationHint: "Om du fortfarande behöver mänsklig hjälp kan du skapa en supportförfrågan med denna kontext.",
  },
  da: {
    secondarySectionsHide: "Skjul detaljer",
    feedbackHelpful: "Nyttigt svar",
    feedbackNotHelpful: "Ikke nyttigt",
    feedbackOrgConfirm: "Bekræft som korrekt for organisationen",
    feedbackThanks: "Tak — din feedback hjælper Aipify med at blive bedre.",
    feedbackReasonTitle: "Hvad var problemet?",
    feedbackReasonWrongInfo: "Forkert information",
    feedbackReasonOutdated: "Forældet",
    feedbackReasonMisunderstood: "Misforstod spørgsmålet",
    feedbackReasonWrongLink: "Forkert link",
    feedbackReasonTooVague: "For uklart",
    feedbackReasonOther: "Andet",
    feedbackSubmitReason: "Send feedback",
    feedbackOrgConfirmThanks: "Bekræftet for organisationen. Dette registreres i revisionsloggen.",
    sourcesTitle: "Anvendte kilder",
    sourcesShow: "Anvendte kilder",
    sourcesHide: "Skjul kilder",
    sourcePlatformCorpus: "Platformsvidensguide",
    sourceRouteRegistry: "APP-ruteregister",
    sourceKnowledgeCenter: "Knowledge Center",
    sourceCustomerContext: "Verificeret abonnementskontekst",
    sourceOrgKnowledge: "Godkendt organisationsviden",
    recentDelete: "Slet samtale",
    recentActive: "Aktiv",
    supportEscalationHint: "Hvis du stadig har brug for menneskelig hjælp, kan du oprette en supportanmodning med denne kontekst.",
  },
  pl: {
    secondarySectionsHide: "Ukryj szczegóły",
    feedbackHelpful: "Pomocna odpowiedź",
    feedbackNotHelpful: "Nie pomocna",
    feedbackOrgConfirm: "Potwierdź jako poprawne dla organizacji",
    feedbackThanks: "Dziękujemy — Twoja opinia pomaga ulepszać Aipify.",
    feedbackReasonTitle: "Jaki był problem?",
    feedbackReasonWrongInfo: "Błędne informacje",
    feedbackReasonOutdated: "Nieaktualne",
    feedbackReasonMisunderstood: "Nie zrozumiano pytania",
    feedbackReasonWrongLink: "Błędny link",
    feedbackReasonTooVague: "Zbyt ogólne",
    feedbackReasonOther: "Inne",
    feedbackSubmitReason: "Wyślij opinię",
    feedbackOrgConfirmThanks: "Potwierdzono dla organizacji. Zapisano w dzienniku audytu.",
    sourcesTitle: "Wykorzystane źródła",
    sourcesShow: "Wykorzystane źródła",
    sourcesHide: "Ukryj źródła",
    sourcePlatformCorpus: "Przewodnik wiedzy platformy",
    sourceRouteRegistry: "Rejestr tras APP",
    sourceKnowledgeCenter: "Centrum wiedzy",
    sourceCustomerContext: "Zweryfikowany kontekst subskrypcji",
    sourceOrgKnowledge: "Zatwierdzona wiedza organizacji",
    recentDelete: "Usuń rozmowę",
    recentActive: "Aktywna",
    supportEscalationHint: "Jeśli nadal potrzebujesz pomocy człowieka, utwórz zgłoszenie do wsparcia z tym kontekstem.",
  },
  uk: {
    secondarySectionsHide: "Приховати деталі",
    feedbackHelpful: "Корисна відповідь",
    feedbackNotHelpful: "Не корисна",
    feedbackOrgConfirm: "Підтвердити як правильне для організації",
    feedbackThanks: "Дякуємо — ваш відгук допомагає покращувати Aipify.",
    feedbackReasonTitle: "У чому була проблема?",
    feedbackReasonWrongInfo: "Неправильна інформація",
    feedbackReasonOutdated: "Застаріла",
    feedbackReasonMisunderstood: "Неправильно зрозуміли питання",
    feedbackReasonWrongLink: "Неправильне посилання",
    feedbackReasonTooVague: "Занадто загально",
    feedbackReasonOther: "Інше",
    feedbackSubmitReason: "Надіслати відгук",
    feedbackOrgConfirmThanks: "Підтверджено для організації. Записано в журнал аудиту.",
    sourcesTitle: "Використані джерела",
    sourcesShow: "Використані джерела",
    sourcesHide: "Приховати джерела",
    sourcePlatformCorpus: "Посібник знань платформи",
    sourceRouteRegistry: "Реєстр маршрутів APP",
    sourceKnowledgeCenter: "Центр знань",
    sourceCustomerContext: "Перевірений контекст підписки",
    sourceOrgKnowledge: "Затверджені знання організації",
    recentDelete: "Видалити розмову",
    recentActive: "Активна",
    supportEscalationHint: "Якщо вам все ще потрібна допомога людини, створіть запит у підтримку з цим контекстом.",
  },
};

const platformKnowledgeArticles = {
  no: {
    permissions: {
      restrictedAction:
        "Noen handlinger krever eier- eller admin-tilgang. Kontakt organisasjonens administrator hvis du trenger hjelp.",
    },
    sources: {
      knowledgeCenter: "Basert på godkjent Knowledge Center-dokumentasjon.",
      platformGuide: "Aipify plattformkunnskapsguide",
    },
    actions: {
      teamMembers: "Åpne Teammedlemmer",
      rolesPermissions: "Åpne Roller og tilganger",
      subscription: "Åpne Abonnement",
      upgradeOptions: "Se oppgraderingsalternativer",
      invoices: "Åpne Fakturaer",
      paymentHistory: "Åpne Betalingshistorikk",
      accountSecurity: "Åpne Sikkerhetsinnstillinger",
      connectIntegration: "Koble til integrasjon",
      integrations: "Se integrasjoner",
      connectedIntegrations: "Se tilkoblede integrasjoner",
      contactSupport: "Kontakt support",
      supportRequests: "Se supportforespørsler",
      knowledgeCenter: "Les om sikker tilkobling",
      gettingStarted: "Kom i gang",
      aipifyCompanion: "Åpne Aipify Companion",
      commandBrief: "Åpne Command Brief",
      sinceLastLogin: "Siden sist innlogging",
      appNotifications: "Varsler",
      appDashboard: "Åpne Dashboard",
      availableBusinessPacks: "Utforsk Business Packs",
      installedBusinessPacks: "Installerte Business Packs",
      preferences: "Åpne Preferanser",
      profile: "Åpne Profil",
      apiAccess: "API-tilgang",
      activityOverview: "Aktivitetsoversikt",
      viewIntegrations: "Se integrasjoner",
      readSecureConnection: "Les om sikker tilkobling",
    },
    whatIsApi: {
      title: "Hva er et API?",
      directAnswer:
        "Et API er en sikker måte to systemer kan kommunisere med hverandre på. Aipify kan for eksempel bruke et API til å hente godkjent informasjon fra nettsiden, nettbutikken eller administrasjonssystemet ditt. Tilgangen begrenses til det organisasjonen har godkjent, og lesetilgang bør brukes først slik at Aipify kan hente informasjon uten å endre noe.",
      explanation: "API-er er koblingslaget mellom systemer — ikke det samme som å finne API-nøkler i admin.",
      searchTerms: "hva er api|hva er et api|what is api|what is an api|definer api",
    },
    findApiKey: {
      title: "Finn API-nøkkelen",
      directAnswer: "API-nøkler finner du under Platform → API Access. Eiere og administratorer kan se og administrere nøkler der.",
      explanation: "Del bare nøkler med godkjente systemer, og roter dem når tilgang endres.",
      step1: "Åpne Platform → API Access.",
      step2: "Finn aktiv nøkkel eller opprett en ny hvis du har tilgang.",
      searchTerms: "finn api-nøkkel|hvor finner jeg api-nøkkel|api key location|hvor er api-nøkkel",
    },
    createApiKey: {
      title: "Opprett API-nøkkel",
      directAnswer: "Opprett eller roter API-nøkler under Platform → API Access. Eiere og administratorer kan generere nøkler i tråd med sikkerhetspolicyen.",
      explanation: "Lagre nøkler sikkert og trekk tilbake ubrukte nøkler raskt.",
      step1: "Åpne Platform → API Access.",
      step2: "Velg Opprett nøkkel eller Roter nøkkel.",
      step3: "Kopier nøkkelen én gang og lagre den i godkjent secret manager.",
      searchTerms: "opprette api-nøkkel|create api key|generate api key|ny api-nøkkel",
    },
    connectSystem: {
      title: "Koble et system til Aipify",
      directAnswer: "Koble kundesystemer fra Platform → Connect Integration. Start med lesetilgang og godkjenn utvidet tilgang når du er klar.",
      explanation: "Aipify lærer godkjent metadata fra tilkoblede systemer — mennesker godkjenner aktivering.",
      step1: "Åpne Platform → Connect Integration.",
      step2: "Velg plattform og fullfør autorisering.",
      step3: "Gjennomgå oppdagede funksjoner før aktivering.",
      searchTerms: "koble system|connect system|tilkoble system|integrer system|koble til aipify",
    },
    aipifyDataAccess: {
      title: "Hva får Aipify tilgang til?",
      directAnswer: "Aipify får kun tilgang til godkjent metadata og operasjonell kontekst som kreves for lisensierte moduler. Integrasjoner starter med lesetilgang, sensitive handlinger krever godkjenning, og organisasjonen styrer tilkoblede systemer.",
      explanation: "Kundedata blir hos kunden. Aipify lagrer intelligensmønstre — ikke rå private poster med mindre det er eksplisitt godkjent.",
      step1: "Gjennomgå tilkoblede integrasjoner under Platform → Integrations.",
      step2: "Åpne Account → Security for tilgangs- og revisjonssynlighet.",
      searchTerms: "hva får aipify tilgang|what does aipify access|data access|tilgang aipify|hva kan aipify se",
    },
    apiAccess: {
      searchTerms: "api-nøkkel admin|api access|developer access|api credentials",
    },
  },
};

function patchCompanionExperience(locale) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "companion.json");
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(json.companionExperience, companionExperiencePatch[locale]);
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}

function patchPlatformKnowledge(locale) {
  const file = path.join(ROOT, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const cpk = json.companionPlatformKnowledge;
  const enFile = path.join(ROOT, "locales", "en", "customer-app", "companionPlatformKnowledge.json");
  const en = JSON.parse(fs.readFileSync(enFile, "utf8")).companionPlatformKnowledge;

  cpk.sources = { ...en.sources, ...(cpk.sources ?? {}) };
  cpk.actions = { ...en.actions, ...(cpk.actions ?? {}) };
  for (const key of ["whatIsApi", "findApiKey", "createApiKey", "connectSystem", "aipifyDataAccess"]) {
    cpk.articles[key] = en.articles[key];
  }
  if (cpk.articles.apiAccess) {
    cpk.articles.apiAccess.searchTerms = en.articles.apiAccess.searchTerms;
  }

  const localePatch = platformKnowledgeArticles[locale];
  if (localePatch) {
    Object.assign(cpk.permissions ?? {}, localePatch.permissions ?? {});
    Object.assign(cpk.sources ?? {}, localePatch.sources ?? {});
    Object.assign(cpk.actions ?? {}, localePatch.actions ?? {});
    for (const [key, value] of Object.entries(localePatch)) {
      if (["permissions", "sources", "actions"].includes(key)) continue;
      if (key === "apiAccess") {
        Object.assign(cpk.articles.apiAccess, value);
      } else {
        cpk.articles[key] = { ...cpk.articles[key], ...value };
      }
    }
  }

  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}

for (const locale of ["en", "no", "sv", "da", "pl", "uk"]) {
  patchCompanionExperience(locale);
  patchPlatformKnowledge(locale);
  console.log(`patched ${locale}`);
}
