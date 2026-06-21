/**
 * Marketing locale translator — deep-clones English trees with no/sv/da copy.
 * Used by scripts/sync-marketing-i18n.mjs only; not loaded at runtime.
 */

/** @type {Record<string, Record<string, unknown>>} */
const SECTION_OVERRIDES = {
  "no:productPageRedesign.hero": {
    eyebrow: "Aipify Business Operating System",
    title: "Én plattform for operasjonell oversikt, styrt utførelse og menneskelig kontroll.",
    subtitle:
      "Aipify kobler support, drift, kunnskap, styring og godkjente arbeidsflyter i ett koordinert Business Operating System — installert der teamene dine allerede jobber.",
    ctaPrimary: "Book demo",
    ctaSecondary: "Se hvordan Aipify fungerer",
    explorePacks: "Utforsk Business Packs",
  },
  "no:productPageRedesign.commandBrief": {
    title: "Command Brief — organisasjonen din oppsummert før du starter.",
    subtitle:
      "Aipify samler de viktigste operative endringene, fullført arbeid og beslutninger — i stedet for at du må lete i flere systemer.",
    points: {
      "1": {
        title: "Siden sist du var innom",
        body: "Nye bookinger ble bekreftet, gjesteforespørsler mottatt og operative planer endret mens du var borte.",
      },
      "2": {
        title: "Det Aipify hjalp med",
        body: "Aipify forberedte bekreftelser, koordinerte kalendere, oppdaterte rengjøringsoppgaver og hindret doble bookinger.",
      },
      "3": {
        title: "Det som krever din oppmerksomhet",
        body: "Kun beslutninger som krever din godkjenning vises — inkludert bemanning, refusjoner og spesielle gjesteforespørsler.",
      },
      "4": {
        title: "Det som skjer videre",
        body: "Godkjenn forberedte handlinger, så fortsetter Aipify å koordinere resten av det operative arbeidet.",
      },
    },
  },
  "no:productPageRedesign.servicesAndHospitalityDemo": {
    panelTitle: "Command Brief",
    panelOrganization: "Nordic Stay & Studio",
    panelContext: "Service- og gjesteoperasjoner · mandag morgen",
    headerBadge: "Drift koordinert",
    sinceLastLogin: "Siden sist du var innom",
    aipifyCompleted: "Aipify fullførte",
    needsAttention: "Krever din oppmerksomhet",
    recommendedActions: "Anbefalte handlinger",
    organizationStatus: "Organisasjonsstatus",
    sinceItems: {
      "1": "6 salongavtaler bekreftet denne uken",
      "2": "3 Airbnb-gjestemeldinger mottatt og kategorisert",
      "3": "1 avlyst time automatisk tilbudt ventelisten",
      "4": "Rengjøringsplan oppdatert for 2 ankommende gjester",
    },
    completedItems: {
      "1": "Sendte bookingbekreftelser og avtalepåminnelser",
      "2": "Forberedte innsjekkinstruksjoner for morgendagens Airbnb-ankomst",
      "3": "Tildelte riktig renholder etter endring av utsjekkingstid",
      "4": "Hindret dobbelbooking i salongkalenderen",
    },
    attentionItems: {
      "1": "Godkjenn sen utsjekking for Leilighet 2",
      "2": "Bekreft bemanning lørdag ettermiddag",
      "3": "Gjennomgå refusjonsforespørsel fra gjest før kl. 14:00",
    },
    actionItems: {
      "1": "Åpne to ledige salongtimer for ventelisten",
      "2": "Godkjenn forberedt gjestesvar",
      "3": "Legg til 15 minutters buffer etter fargebehandlinger",
      "4": "Gjennomgå Airbnb-belgningsprognose for neste uke",
    },
    statusItems: {
      "1": "✅ Salongbookinger aktive",
      "2": "✅ Hosts pack i drift",
      "3": "✅ Kalendersynkronisering OK",
      "4": "✅ Rengjøringsplan oppdatert",
      "5": "⚠️ 2 godkjenninger venter",
    },
  },
  "sv:productPageRedesign.hero": {
    eyebrow: "Aipify Business Operating System",
    title: "En plattform för operativ tydlighet, styrd exekvering och mänsklig kontroll.",
    subtitle:
      "Aipify kopplar support, drift, kunskap, styrning och godkända arbetsflöden i ett koordinerat Business Operating System — installerat där dina team redan arbetar.",
    ctaPrimary: "Boka demo",
    ctaSecondary: "Se hur Aipify fungerar",
    explorePacks: "Utforska Business Packs",
  },
  "sv:productPageRedesign.commandBrief": {
    title: "Command Brief — din organisation sammanfattad innan du börjar.",
    subtitle:
      "Aipify samlar de viktigaste operativa förändringarna, färdigt arbete och beslut — i stället för att du måste söka i flera system.",
    points: {
      "1": {
        title: "Sedan ditt senaste besök",
        body: "Nya bokningar bekräftades, gästförfrågningar mottogs och operativa scheman ändrades medan du var borta.",
      },
      "2": {
        title: "Det Aipify hjälpte till med",
        body: "Aipify förberedde bekräftelser, koordinerade kalendrar, uppdaterade städuppgifter och förhindrade dubbelbokningar.",
      },
      "3": {
        title: "Det som kräver din uppmärksamhet",
        body: "Endast beslut som kräver ditt godkännande visas — inklusive bemanning, återbetalningar och särskilda gästförfrågningar.",
      },
      "4": {
        title: "Vad som händer härnäst",
        body: "Godkänn förberedda åtgärder så fortsätter Aipify att koordinera återstående operativt arbete.",
      },
    },
  },
  "sv:productPageRedesign.servicesAndHospitalityDemo": {
    panelTitle: "Command Brief",
    panelOrganization: "Nordic Stay & Studio",
    panelContext: "Service- och gästoperativ · måndag morgon",
    headerBadge: "Drift koordinerad",
    sinceLastLogin: "Sedan ditt senaste besök",
    aipifyCompleted: "Aipify slutförde",
    needsAttention: "Kräver din uppmärksamhet",
    recommendedActions: "Rekommenderade åtgärder",
    organizationStatus: "Organisationsstatus",
    sinceItems: {
      "1": "6 salongsbokningar bekräftade denna vecka",
      "2": "3 Airbnb-gästmeddelanden mottagna och kategoriserade",
      "3": "1 avbokad tid erbjöds automatiskt till väntelistan",
      "4": "Städschema uppdaterat för 2 ankommande gäster",
    },
    completedItems: {
      "1": "Skickade bokningsbekräftelser och tidspåminnelser",
      "2": "Förberedde incheckningsinstruktioner för morgondagens Airbnb-ankomst",
      "3": "Tilldelade rätt städare efter ändrad utcheckningstid",
      "4": "Förhindrade dubbelbokning i salongskalendern",
    },
    attentionItems: {
      "1": "Godkänn sen utcheckning för Lägenhet 2",
      "2": "Bekräfta bemanning lördag eftermiddag",
      "3": "Granska återbetalningsförfrågan från gäst före kl. 14:00",
    },
    actionItems: {
      "1": "Öppna två lediga salongstider för väntelistan",
      "2": "Godkänn förberett gästsvar",
      "3": "Lägg till 15 minuters buffert efter färgbehandlingar",
      "4": "Granska Airbnb-beläggningsprognos för nästa vecka",
    },
    statusItems: {
      "1": "✅ Salongsbokningar aktiva",
      "2": "✅ Hosts pack i drift",
      "3": "✅ Kalendersynkronisering OK",
      "4": "✅ Städschema uppdaterat",
      "5": "⚠️ 2 godkännanden väntar",
    },
  },
  "da:productPageRedesign.hero": {
    eyebrow: "Aipify Business Operating System",
    title: "Én platform for operationel overblik, styret eksekvering og menneskelig kontrol.",
    subtitle:
      "Aipify forbinder support, drift, viden, styring og godkendte arbejdsgange i ét koordineret Business Operating System — installeret hvor dine teams allerede arbejder.",
    ctaPrimary: "Book demo",
    ctaSecondary: "Se hvordan Aipify fungerer",
    explorePacks: "Udforsk Business Packs",
  },
  "da:productPageRedesign.commandBrief": {
    title: "Command Brief — din organisation opsummeret før du starter.",
    subtitle:
      "Aipify samler de vigtigste operationelle ændringer, fuldført arbejde og beslutninger — i stedet for at du skal søge i flere systemer.",
    points: {
      "1": {
        title: "Siden dit sidste besøg",
        body: "Nye bookinger blev bekræftet, gæsteanmodninger modtaget og operationelle planer ændret, mens du var væk.",
      },
      "2": {
        title: "Det Aipify hjalp med",
        body: "Aipify forberedte bekræftelser, koordinerede kalendere, opdaterede rengøringsopgaver og forhindrede dobbeltbookinger.",
      },
      "3": {
        title: "Det der kræver din opmærksomhed",
        body: "Kun beslutninger der kræver din godkendelse vises — inklusive bemanding, refusioner og særlige gæsteanmodninger.",
      },
      "4": {
        title: "Det der sker herefter",
        body: "Godkend forberedte handlinger, så fortsætter Aipify med at koordinere resten af det operationelle arbejde.",
      },
    },
  },
  "da:productPageRedesign.servicesAndHospitalityDemo": {
    panelTitle: "Command Brief",
    panelOrganization: "Nordic Stay & Studio",
    panelContext: "Service- og gæstedrift · mandag morgen",
    headerBadge: "Drift koordineret",
    sinceLastLogin: "Siden dit sidste besøg",
    aipifyCompleted: "Aipify fuldførte",
    needsAttention: "Kræver din opmærksomhed",
    recommendedActions: "Anbefalede handlinger",
    organizationStatus: "Organisationsstatus",
    sinceItems: {
      "1": "6 salonaftaler bekræftet denne uge",
      "2": "3 Airbnb-gæstebeskeder modtaget og kategoriseret",
      "3": "1 aflyst tid automatisk tilbudt ventelisten",
      "4": "Rengøringsplan opdateret for 2 ankommende gæster",
    },
    completedItems: {
      "1": "Sendte bookingbekræftelser og aftalepåmindelser",
      "2": "Forberedte check-in-instruktioner til morgendagens Airbnb-ankomst",
      "3": "Tildelte korrekt rengører efter ændret check-out-tid",
      "4": "Forhindrede dobbeltbooking i salonkalenderen",
    },
    attentionItems: {
      "1": "Godkend sen check-out for Lejlighed 2",
      "2": "Bekræft bemanding lørdag eftermiddag",
      "3": "Gennemgå refusionsanmodning fra gæst før kl. 14:00",
    },
    actionItems: {
      "1": "Åbn to ledige salontider til ventelisten",
      "2": "Godkend forberedt gæstesvar",
      "3": "Tilføj 15 minutters buffer efter farvebehandlinger",
      "4": "Gennemgå Airbnb-belægningsprognose for næste uge",
    },
    statusItems: {
      "1": "✅ Salonbookinger aktive",
      "2": "✅ Hosts pack i drift",
      "3": "✅ Kalendersynkronisering OK",
      "4": "✅ Rengøringsplan opdateret",
      "5": "⚠️ 2 godkendelser afventer",
    },
  },
  "no:homepageRedesign.hero": {
    badge: "Aipify Business Operating System",
    title: "Business Operating System for moderne organisasjoner.",
    subtitle:
      "Aipify kobler support, drift, kunnskap, styring og godkjente arbeidsflyter i én koordinert plattform.",
    benefits: {
      "1": "Se hva som endret seg.",
      "2": "Vit hva som krever oppmerksomhet.",
      "3": "La Aipify forberede neste steg.",
    },
    ctaPrimary: "Book demo",
    ctaSecondary: "Se hvordan Aipify fungerer",
    explorePacks: "Utforsk Business Packs",
  },
  "sv:homepageRedesign.hero": {
    badge: "Aipify Business Operating System",
    title: "Business Operating System för moderna organisationer.",
    subtitle:
      "Aipify kopplar support, drift, kunskap, styrning och godkända arbetsflöden i en koordinerad plattform.",
    benefits: {
      "1": "Se vad som förändrats.",
      "2": "Vet vad som kräver uppmärksamhet.",
      "3": "Låt Aipify förbereda nästa steg.",
    },
    ctaPrimary: "Boka demo",
    ctaSecondary: "Se hur Aipify fungerar",
    explorePacks: "Utforska Business Packs",
  },
  "da:homepageRedesign.hero": {
    badge: "Aipify Business Operating System",
    title: "Business Operating System til moderne organisationer.",
    subtitle:
      "Aipify forbinder support, drift, viden, styring og godkendte arbejdsgange i én koordineret platform.",
    benefits: {
      "1": "Se hvad der ændrede sig.",
      "2": "Vid hvad der kræver opmærksomhed.",
      "3": "Lad Aipify forberede næste skridt.",
    },
    ctaPrimary: "Book demo",
    ctaSecondary: "Se hvordan Aipify fungerer",
    explorePacks: "Udforsk Business Packs",
  },
};

/** Phrase-level replacements applied longest-first per locale. */
const PHRASE_MAPS = {
  no: [
    ["Book Demo", "Book demo"],
    ["Book a Demo", "Book demo"],
    ["Request Early Access", "Be om tidlig tilgang"],
    ["Explore Business Packs", "Utforsk Business Packs"],
    ["See How Aipify Works", "Se hvordan Aipify fungerer"],
    ["Command Brief", "Command Brief"],
    ["Since your last visit", "Siden sist du var innom"],
    ["Since last login", "Siden sist innlogging"],
    ["Aipify completed", "Aipify fullførte"],
    ["Needs your attention", "Krever din oppmerksomhet"],
    ["Recommended actions", "Anbefalte handlinger"],
    ["Organization status", "Organisasjonsstatus"],
    ["Primary engines", "Primære motorer"],
    ["More engines", "Flere motorer"],
    ["Recommended action", "Anbefalt handling"],
    ["Detail panel", "Detaljpanel"],
    ["Context signal", "Kontekstsignal"],
    ["Full context", "Full kontekst"],
    ["Recommendation", "Anbefaling"],
    ["Approval rule", "Godkjenningsregel"],
    ["Command Brief item", "Command Brief-element"],
    ["Audit event", "Revisjonshendelse"],
    ["Signal", "Signal"],
    ["Surface", "Overflate"],
    ["Home", "Hjem"],
    ["Platform", "Plattform"],
    ["Pricing", "Priser"],
    ["Business Packs", "Business Packs"],
    ["Play", "Spill av"],
    ["Pause", "Pause"],
    ["Previous", "Forrige"],
    ["Next", "Neste"],
    ["People", "Mennesker"],
    ["Governance", "Styring"],
    ["Enterprise", "Enterprise"],
    ["Available", "Tilgjengelig"],
    ["Contact", "Kontakt"],
  ],
  sv: [
    ["Book Demo", "Boka demo"],
    ["Book a Demo", "Boka demo"],
    ["Request Early Access", "Begär tidig åtkomst"],
    ["Explore Business Packs", "Utforska Business Packs"],
    ["See How Aipify Works", "Se hur Aipify fungerar"],
    ["Since your last visit", "Sedan ditt senaste besök"],
    ["Since last login", "Sedan senaste inloggning"],
    ["Aipify completed", "Aipify slutförde"],
    ["Needs your attention", "Kräver din uppmärksamhet"],
    ["Recommended actions", "Rekommenderade åtgärder"],
    ["Organization status", "Organisationsstatus"],
    ["Primary engines", "Primära motorer"],
    ["More engines", "Fler motorer"],
    ["Recommended action", "Rekommenderad åtgärd"],
    ["Detail panel", "Detaljpanel"],
    ["Context signal", "Kontextsignal"],
    ["Full context", "Full kontext"],
    ["Recommendation", "Rekommendation"],
    ["Approval rule", "Godkänningsregel"],
    ["Command Brief item", "Command Brief-post"],
    ["Audit event", "Revisionshändelse"],
    ["Signal", "Signal"],
    ["Surface", "Yta"],
    ["Home", "Hem"],
    ["Platform", "Plattform"],
    ["Pricing", "Priser"],
    ["Business Packs", "Business Packs"],
    ["Play", "Spela"],
    ["Pause", "Pausa"],
    ["Previous", "Föregående"],
    ["Next", "Nästa"],
    ["People", "Människor"],
    ["Governance", "Styrning"],
    ["Enterprise", "Enterprise"],
    ["Available", "Tillgänglig"],
    ["Contact", "Kontakt"],
  ],
  da: [
    ["Book Demo", "Book demo"],
    ["Book a Demo", "Book demo"],
    ["Request Early Access", "Anmod om tidlig adgang"],
    ["Explore Business Packs", "Udforsk Business Packs"],
    ["See How Aipify Works", "Se hvordan Aipify fungerer"],
    ["Since your last visit", "Siden dit sidste besøg"],
    ["Since last login", "Siden sidste login"],
    ["Aipify completed", "Aipify fuldførte"],
    ["Needs your attention", "Kræver din opmærksomhed"],
    ["Recommended actions", "Anbefalede handlinger"],
    ["Organization status", "Organisationsstatus"],
    ["Primary engines", "Primære motorer"],
    ["More engines", "Flere motorer"],
    ["Recommended action", "Anbefalet handling"],
    ["Detail panel", "Detaljpanel"],
    ["Context signal", "Kontekstsignal"],
    ["Full context", "Fuld kontekst"],
    ["Recommendation", "Anbefaling"],
    ["Approval rule", "Godkendelsesregel"],
    ["Command Brief item", "Command Brief-element"],
    ["Audit event", "Revisionshændelse"],
    ["Signal", "Signal"],
    ["Surface", "Overflade"],
    ["Home", "Hjem"],
    ["Platform", "Platform"],
    ["Pricing", "Priser"],
    ["Business Packs", "Business Packs"],
    ["Play", "Afspil"],
    ["Pause", "Pause"],
    ["Previous", "Forrige"],
    ["Next", "Næste"],
    ["People", "Mennesker"],
    ["Governance", "Styring"],
    ["Enterprise", "Enterprise"],
    ["Available", "Tilgængelig"],
    ["Contact", "Kontakt"],
  ],
};

function applyPhraseMap(text, locale) {
  if (typeof text !== "string" || locale === "en") return text;
  const map = PHRASE_MAPS[locale];
  if (!map) return text;
  let out = text;
  for (const [from, to] of map) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

function deepMerge(base, overlay) {
  if (!overlay || typeof overlay !== "object" || Array.isArray(overlay)) return overlay ?? base;
  const result = { ...(base && typeof base === "object" && !Array.isArray(base) ? base : {}) };
  for (const [key, value] of Object.entries(overlay)) {
    const baseValue = result[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = deepMerge(baseValue, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function translateLeaf(value, locale) {
  if (typeof value !== "string") return value;
  return applyPhraseMap(value, locale);
}

function walkTranslate(node, locale) {
  if (typeof node === "string") return translateLeaf(node, locale);
  if (Array.isArray(node)) return node.map((item) => walkTranslate(item, locale));
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = walkTranslate(value, locale);
    }
    return out;
  }
  return node;
}

function collectOverrides(locale, sectionPath) {
  const prefix = `${locale}:${sectionPath}`;
  /** @type {Record<string, unknown>[]} */
  const matches = [];
  for (const [key, value] of Object.entries(SECTION_OVERRIDES)) {
    if (key === prefix || key.startsWith(`${prefix}.`)) {
      const subPath = key.slice(prefix.length).replace(/^\./, "");
      matches.push({ subPath, value });
    }
  }
  return matches;
}

function applyNestedOverrides(tree, locale, sectionPath) {
  let result = tree;
  for (const { subPath, value } of collectOverrides(locale, sectionPath)) {
    if (!subPath) {
      result = deepMerge(result, value);
      continue;
    }
    const parts = subPath.split(".");
    /** @type {Record<string, unknown>} */
    const cloned = JSON.parse(JSON.stringify(result));
    let cursor = cloned;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = /** @type {Record<string, unknown>} */ (cursor[part]);
    }
    cursor[parts[parts.length - 1]] = deepMerge(cursor[parts[parts.length - 1]], value);
    result = cloned;
  }
  return result;
}

/**
 * @param {unknown} tree
 * @param {string} locale
 * @param {string} sectionPath
 */
export function translateMarketingTree(tree, locale, sectionPath) {
  if (locale === "en") return tree;
  const walked = walkTranslate(tree, locale);
  return applyNestedOverrides(walked, locale, sectionPath);
}
