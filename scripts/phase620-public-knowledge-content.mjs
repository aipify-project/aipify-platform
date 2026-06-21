#!/usr/bin/env node
/**
 * Phase 620 — inject Public Knowledge Center industry details, article metadata,
 * hub labels, business pack names, and warehouse detail page into marketing.json.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOCALES = ["en", "no", "sv", "da"];

const ARTICLE_SLUGS = [
  "getting-started-with-aipify",
  "governance-and-human-approval",
  "enterprise-knowledge-management",
  "hospitality-operations-with-aipify",
  "property-management-operations-with-aipify",
  "commerce-operations-with-aipify",
  "support-operations-with-aipify",
  "warehouse-operations-with-aipify",
  "professional-services-with-aipify",
  "what-is-a-business-operating-system",
  "why-organizations-need-operational-visibility",
  "how-operational-knowledge-creates-competitive-advantage",
  "the-future-of-business-operations",
  "what-is-a-business-companion",
  "companion-vs-chatbot",
  "companion-vs-ai-assistant",
  "how-companion-supports-organizations",
  "human-centered-companion-design",
];

const hubLabels = {
  en: {
    readingTimeLabel: "Reading time",
    publishedLabel: "Published",
    keyTakeawaysTitle: "Key takeaways",
    backToKnowledge: "Back to Knowledge Center",
    exploreBusinessPack: "Explore Business Pack",
    industryChallengesTitle: "Common challenges",
    industryHowAipifyHelpsTitle: "How Aipify helps",
    industryWorkflowsTitle: "Operational workflows",
    industryRecommendedPacksTitle: "Recommended Business Packs",
    industryGovernanceTitle: "Governance and control",
    industryOutcomesTitle: "Expected outcomes",
    industryRelatedArticlesTitle: "Related articles",
    industryOrgTypesTitle: "Organizations we guide",
  },
  no: {
    readingTimeLabel: "Lesetid",
    publishedLabel: "Publisert",
    keyTakeawaysTitle: "Viktige lærdommer",
    backToKnowledge: "Tilbake til Knowledge Center",
    exploreBusinessPack: "Utforsk Business Pack",
    industryChallengesTitle: "Vanlige utfordringer",
    industryHowAipifyHelpsTitle: "Slik hjelper Aipify",
    industryWorkflowsTitle: "Operative arbeidsflyter",
    industryRecommendedPacksTitle: "Anbefalte Business Packs",
    industryGovernanceTitle: "Styring og kontroll",
    industryOutcomesTitle: "Forventede resultater",
    industryRelatedArticlesTitle: "Relaterte artikler",
    industryOrgTypesTitle: "Organisasjoner vi veileder",
  },
  sv: {
    readingTimeLabel: "Lästid",
    publishedLabel: "Publicerad",
    keyTakeawaysTitle: "Viktiga slutsatser",
    backToKnowledge: "Tillbaka till Knowledge Center",
    exploreBusinessPack: "Utforska Business Pack",
    industryChallengesTitle: "Vanliga utmaningar",
    industryHowAipifyHelpsTitle: "Så hjälper Aipify",
    industryWorkflowsTitle: "Operativa arbetsflöden",
    industryRecommendedPacksTitle: "Rekommenderade Business Packs",
    industryGovernanceTitle: "Styrning och kontroll",
    industryOutcomesTitle: "Förväntade resultat",
    industryRelatedArticlesTitle: "Relaterade artiklar",
    industryOrgTypesTitle: "Organisationer vi vägleder",
  },
  da: {
    readingTimeLabel: "Læsetid",
    publishedLabel: "Publiceret",
    keyTakeawaysTitle: "Vigtige pointer",
    backToKnowledge: "Tilbage til Knowledge Center",
    exploreBusinessPack: "Udforsk Business Pack",
    industryChallengesTitle: "Almindelige udfordringer",
    industryHowAipifyHelpsTitle: "Sådan hjælper Aipify",
    industryWorkflowsTitle: "Operationelle workflows",
    industryRecommendedPacksTitle: "Anbefalede Business Packs",
    industryGovernanceTitle: "Styring og kontrol",
    industryOutcomesTitle: "Forventede resultater",
    industryRelatedArticlesTitle: "Relaterede artikler",
    industryOrgTypesTitle: "Organisationer vi guider",
  },
};

function articleMeta(locale) {
  const reading = { en: "min read", no: "min lesing", sv: "min läsning", da: "min læsning" };
  const suffix = reading[locale];
  const dates = {
    "what-is-a-business-operating-system": "2025-01-08",
    "why-organizations-need-operational-visibility": "2025-01-15",
    "how-operational-knowledge-creates-competitive-advantage": "2025-01-22",
    "the-future-of-business-operations": "2025-02-01",
    "what-is-a-business-companion": "2025-02-08",
    "companion-vs-chatbot": "2025-02-15",
    "companion-vs-ai-assistant": "2025-02-22",
    "how-companion-supports-organizations": "2025-03-01",
    "human-centered-companion-design": "2025-03-08",
    "getting-started-with-aipify": "2025-03-15",
    "governance-and-human-approval": "2025-03-22",
    "enterprise-knowledge-management": "2025-04-01",
    "hospitality-operations-with-aipify": "2025-04-08",
    "property-management-operations-with-aipify": "2025-04-15",
    "commerce-operations-with-aipify": "2025-04-22",
    "support-operations-with-aipify": "2025-05-01",
    "warehouse-operations-with-aipify": "2025-05-08",
    "professional-services-with-aipify": "2025-05-15",
  };
  const minutes = {
    "what-is-a-business-operating-system": 9,
    "why-organizations-need-operational-visibility": 8,
    "how-operational-knowledge-creates-competitive-advantage": 8,
    "the-future-of-business-operations": 7,
    "what-is-a-business-companion": 8,
    "companion-vs-chatbot": 7,
    "companion-vs-ai-assistant": 7,
    "how-companion-supports-organizations": 8,
    "human-centered-companion-design": 8,
    "getting-started-with-aipify": 10,
    "governance-and-human-approval": 9,
    "enterprise-knowledge-management": 9,
    "hospitality-operations-with-aipify": 8,
    "property-management-operations-with-aipify": 8,
    "commerce-operations-with-aipify": 8,
    "support-operations-with-aipify": 8,
    "warehouse-operations-with-aipify": 8,
    "professional-services-with-aipify": 8,
  };
  return Object.fromEntries(
    ARTICLE_SLUGS.map((slug) => [
      slug,
      {
        readingTime: `${minutes[slug]} ${suffix}`,
        publishedDate: dates[slug],
      },
    ]),
  );
}

const takeaways = {
  en: {
    "what-is-a-business-operating-system": [
      "A Business Operating System coordinates knowledge, workflows, and governance above existing tools.",
      "Modular Business Packs let organizations activate only what they need.",
      "Human approval and audit trails are built in — not optional add-ons.",
    ],
    "why-organizations-need-operational-visibility": [
      "Operational visibility reduces status-chasing without employee surveillance.",
      "Leaders need signal and recommended actions — not more dashboards.",
      "Cross-team context improves coordination and decision speed.",
    ],
    "how-operational-knowledge-creates-competitive-advantage": [
      "Approved knowledge creates consistent responses and faster onboarding.",
      "Gap detection turns uncertainty into improvement opportunities.",
      "Role-based access keeps sensitive procedures appropriately scoped.",
    ],
    "the-future-of-business-operations": [
      "Trust grows through gradual, policy-governed delegation.",
      "Companion coordinates priorities — humans retain accountability.",
      "Platforms that explain reasoning earn long-term adoption.",
    ],
    "what-is-a-business-companion": [
      "Companion is operational intelligence within Aipify — not a separate product.",
      "Insights include context, impact, and recommended next steps.",
      "One Aipify identity across Skills, Centers, and Companion capabilities.",
    ],
    "companion-vs-chatbot": [
      "Chatbots optimize conversation; Companions optimize operational outcomes.",
      "Companion connects knowledge, approvals, and Business Packs.",
      "Count-only alerts are replaced with actionable guidance.",
    ],
    "companion-vs-ai-assistant": [
      "Enterprise operations require explainability and audit trails.",
      "Customers purchase Aipify — not a model brand.",
      "Identity adaptation creates familiarity without manipulation.",
    ],
    "how-companion-supports-organizations": [
      "Executive briefings surface priorities with recommended actions.",
      "Teams receive guidance connected to knowledge and workflows.",
      "Decision support presents options and trade-offs — never dictates outcomes.",
    ],
    "human-centered-companion-design": [
      "Aipify augments people — it does not replace judgment.",
      "No surveillance of screens, keystrokes, or private files.",
      "Users control identity, attention, and memory preferences.",
    ],
    "getting-started-with-aipify": [
      "Aipify installs into systems your team already uses.",
      "Start with knowledge and support; expand packs as trust grows.",
      "Role mapping respects customer-native permissions.",
    ],
    "governance-and-human-approval": [
      "Action levels define what requires human approval.",
      "Critical actions are prohibited for automated execution.",
      "Emergency stop pauses pending actions while preserving audit history.",
    ],
    "enterprise-knowledge-management": [
      "Enterprise knowledge requires approval workflows and role-based access.",
      "Metadata-first learning avoids storing raw private content.",
      "Business DNA and Employee Knowledge serve distinct audiences.",
    ],
    "hospitality-operations-with-aipify": [
      "Aipify Hosts coordinates guest and property workflows above your PMS.",
      "Responses are prepared for staff approval — not sent blindly.",
      "Multi-property visibility supports executive briefings.",
    ],
    "property-management-operations-with-aipify": [
      "Portfolio visibility spans units, vendors, and tenant requests.",
      "Maintenance escalations include context and approval paths.",
      "Aipify orchestrates — it does not replace core property systems.",
    ],
    "commerce-operations-with-aipify": [
      "Order and fulfillment exceptions surface early with context.",
      "Support and commerce workflows share operational intelligence.",
      "Peak-period coordination reduces customer-impacting delays.",
    ],
    "support-operations-with-aipify": [
      "Confidence-based triage escalates uncertainty to humans.",
      "Business DNA keeps responses aligned with approved policies.",
      "Knowledge gaps become visible improvement opportunities.",
    ],
    "warehouse-operations-with-aipify": [
      "Shift handoffs and task coordination reduce operational friction.",
      "Exceptions include recommended resolution paths.",
      "Warehouse Operations Pack adds governed fulfillment intelligence.",
    ],
    "professional-services-with-aipify": [
      "Delivery playbooks make expertise reusable across engagements.",
      "Executive portfolio views highlight client health and risks.",
      "Finance and Support packs support billing-aware operations.",
    ],
  },
  no: {
    "what-is-a-business-operating-system": [
      "Et Business Operating System koordinerer kunnskap, arbeidsflyter og styring over eksisterende verktøy.",
      "Modulære Business Packs lar organisasjoner aktivere bare det de trenger.",
      "Menneskelig godkjenning og revisjonsspor er innebygd — ikke valgfrie tillegg.",
    ],
    "why-organizations-need-operational-visibility": [
      "Operasjonell synlighet reduserer statusjaging uten overvåkning av ansatte.",
      "Ledere trenger signal og anbefalte handlinger — ikke flere dashbord.",
      "Tverrfaglig kontekst forbedrer koordinering og beslutningstempo.",
    ],
    "how-operational-knowledge-creates-competitive-advantage": [
      "Godkjent kunnskap gir konsistente svar og raskere onboarding.",
      "Gapdeteksjon gjør usikkerhet om til forbedringsmuligheter.",
      "Rollebasert tilgang holder sensitive prosedyrer riktig avgrenset.",
    ],
    "the-future-of-business-operations": [
      "Tillit bygges gjennom gradvis, policy-styrt delegering.",
      "Companion koordinerer prioriteringer — mennesker beholder ansvar.",
      "Plattformer som forklarer resonnementer får varig adopsjon.",
    ],
    "what-is-a-business-companion": [
      "Companion er operasjonell intelligens i Aipify — ikke et eget produkt.",
      "Innsikt inkluderer kontekst, effekt og anbefalte neste steg.",
      "Én Aipify-identitet på tvers av Skills, Centers og Companion.",
    ],
    "companion-vs-chatbot": [
      "Chatboter optimaliserer samtale; Companion optimaliserer operative resultater.",
      "Companion kobler kunnskap, godkjenninger og Business Packs.",
      "Ren tallvarsling erstattes med handlingsbar veiledning.",
    ],
    "companion-vs-ai-assistant": [
      "Enterprise-drift krever forklarbarhet og revisjonsspor.",
      "Kunder kjøper Aipify — ikke en modellmerkevare.",
      "Identitetstilpasning skaper trygghet uten manipulasjon.",
    ],
    "how-companion-supports-organizations": [
      "Ledelsesbriefinger viser prioriteringer med anbefalte handlinger.",
      "Team får veiledning koblet til kunnskap og arbeidsflyter.",
      "Beslutningsstøtte presenterer alternativer — dikterer aldri utfall.",
    ],
    "human-centered-companion-design": [
      "Aipify forsterker mennesker — erstatter ikke skjønn.",
      "Ingen overvåkning av skjerm, tastetrykk eller private filer.",
      "Brukere styrer identitet, oppmerksomhet og minnepreferanser.",
    ],
    "getting-started-with-aipify": [
      "Aipify installeres i systemer teamet allerede bruker.",
      "Start med kunnskap og support; utvid packs etter hvert som tillit vokser.",
      "Rollekartlegging respekterer kundens egne tillatelser.",
    ],
    "governance-and-human-approval": [
      "Handlingsnivåer definerer hva som krever menneskelig godkjenning.",
      "Kritiske handlinger er forbudt for automatisert utførelse.",
      "Nødstopp pauser ventende handlinger mens revisjonshistorikk bevares.",
    ],
    "enterprise-knowledge-management": [
      "Enterprise-kunnskap krever godkjenningsflyter og rollebasert tilgang.",
      "Metadata-først læring unngår lagring av rå privat innhold.",
      "Business DNA og Employee Knowledge betjener ulike målgrupper.",
    ],
    "hospitality-operations-with-aipify": [
      "Aipify Hosts koordinerer gjeste- og eiendomsarbeidsflyter over PMS.",
      "Svar forberedes til godkjenning — sendes ikke blindt.",
      "Synlighet på tvers av eiendommer støtter ledelsesbriefinger.",
    ],
    "property-management-operations-with-aipify": [
      "Porteføljesynlighet dekker enheter, leverandører og leietakerhenvendelser.",
      "Vedlikeholdseskaleringer inkluderer kontekst og godkjenningsløp.",
      "Aipify orkestrerer — erstatter ikke kjernesystemer for eiendom.",
    ],
    "commerce-operations-with-aipify": [
      "Ordre- og leveringsavvik dukker opp tidlig med kontekst.",
      "Support og handel deler operasjonell intelligens.",
      "Koordinering i peak-perioder reduserer kundepåvirkende forsinkelser.",
    ],
    "support-operations-with-aipify": [
      "Konfidensbasert triage eskalerer usikkerhet til mennesker.",
      "Business DNA holder svar i tråd med godkjente retningslinjer.",
      "Kunnskapshull blir synlige forbedringsmuligheter.",
    ],
    "warehouse-operations-with-aipify": [
      "Skiftoverlevering og oppgavekoordinering reduserer friksjon.",
      "Avvik inkluderer anbefalte løsningsløp.",
      "Warehouse Operations Pack tilfører styrt fulfillment-intelligens.",
    ],
    "professional-services-with-aipify": [
      "Leveranseplaybooks gjør ekspertise gjenbrukbar på tvers av oppdrag.",
      "Porteføljevisninger for ledelse viser kundehelse og risiko.",
      "Finance- og Support-packs støtter faktureringsbevisst drift.",
    ],
  },
  sv: {
    "what-is-a-business-operating-system": [
      "Ett Business Operating System samordnar kunskap, arbetsflöden och styrning ovanpå befintliga verktyg.",
      "Modulära Business Packs låter organisationer aktivera endast det de behöver.",
      "Mänskligt godkännande och revisionsspår är inbyggda — inte valfria tillägg.",
    ],
    "why-organizations-need-operational-visibility": [
      "Operativ synlighet minskar statusjakt utan medarbetarövervakning.",
      "Ledare behöver signal och rekommenderade åtgärder — inte fler dashboards.",
      "Tvärfunktionell kontext förbättrar samordning och beslutstempo.",
    ],
    "how-operational-knowledge-creates-competitive-advantage": [
      "Godkänd kunskap ger konsekventa svar och snabbare onboarding.",
      "Gapdetektering gör osäkerhet till förbättringsmöjligheter.",
      "Rollbaserad åtkomst håller känsliga procedurer korrekt avgränsade.",
    ],
    "the-future-of-business-operations": [
      "Förtroende byggs genom gradvis, policy-styrd delegering.",
      "Companion samordnar prioriteringar — människor behåller ansvar.",
      "Plattformar som förklarar resonemang får långsiktig adoption.",
    ],
    "what-is-a-business-companion": [
      "Companion är operativ intelligens inom Aipify — inte en separat produkt.",
      "Insikter inkluderar kontext, påverkan och rekommenderade nästa steg.",
      "En Aipify-identitet över Skills, Centers och Companion.",
    ],
    "companion-vs-chatbot": [
      "Chatbotar optimerar samtal; Companion optimerar operativa resultat.",
      "Companion kopplar kunskap, godkännanden och Business Packs.",
      "Ren räkningsvarning ersätts med handlingsbar vägledning.",
    ],
    "companion-vs-ai-assistant": [
      "Enterprise-drift kräver förklarbarhet och revisionsspår.",
      "Kunder köper Aipify — inte ett modellvarumärke.",
      "Identitetsanpassning skapar trygghet utan manipulation.",
    ],
    "how-companion-supports-organizations": [
      "Ledningsbriefingar visar prioriteringar med rekommenderade åtgärder.",
      "Team får vägledning kopplad till kunskap och arbetsflöden.",
      "Beslutsstöd presenterar alternativ — dikterar aldrig utfall.",
    ],
    "human-centered-companion-design": [
      "Aipify förstärker människor — ersätter inte omdöme.",
      "Ingen övervakning av skärm, tangenttryck eller privata filer.",
      "Användare styr identitet, uppmärksamhet och minnespreferenser.",
    ],
    "getting-started-with-aipify": [
      "Aipify installeras i system teamet redan använder.",
      "Börja med kunskap och support; utöka packs i takt med förtroende.",
      "Rollkartläggning respekterar kundens egna behörigheter.",
    ],
    "governance-and-human-approval": [
      "Handlingsnivåer definierar vad som kräver mänskligt godkännande.",
      "Kritiska åtgärder är förbjudna för automatiserad körning.",
      "Nödstopp pausar väntande åtgärder med bibehållen revisionshistorik.",
    ],
    "enterprise-knowledge-management": [
      "Enterprise-kunskap kräver godkännandeflöden och rollbaserad åtkomst.",
      "Metadata-först-inlärning undviker lagring av rå privat data.",
      "Business DNA och Employee Knowledge betjänar olika målgrupper.",
    ],
    "hospitality-operations-with-aipify": [
      "Aipify Hosts samordnar gäst- och fastighetsflöden ovanpå PMS.",
      "Svar förbereds för godkännande — skickas inte blint.",
      "Synlighet över fastigheter stödjer ledningsbriefingar.",
    ],
    "property-management-operations-with-aipify": [
      "Portföljsynlighet täcker enheter, leverantörer och hyresgästförfrågningar.",
      "Underhållseskaleringar inkluderar kontext och godkännandevägar.",
      "Aipify orkestrerar — ersätter inte kärnfastighetssystem.",
    ],
    "commerce-operations-with-aipify": [
      "Order- och leveransavvikelser syns tidigt med kontext.",
      "Support och handel delar operativ intelligens.",
      "Samordning under peak minskar kundpåverkande förseningar.",
    ],
    "support-operations-with-aipify": [
      "Konfidensbaserad triage eskalerar osäkerhet till människor.",
      "Business DNA håller svar i linje med godkända policyer.",
      "Kunskapsluckor blir synliga förbättringsmöjligheter.",
    ],
    "warehouse-operations-with-aipify": [
      "Skiftöverlämning och uppgiftssamordning minskar friktion.",
      "Avvikelser inkluderar rekommenderade lösningsvägar.",
      "Warehouse Operations Pack tillför styrd fulfillment-intelligens.",
    ],
    "professional-services-with-aipify": [
      "Leveransplaybooks gör expertis återanvändbar över uppdrag.",
      "Portföljvyer för ledning visar kundhälsa och risk.",
      "Finance- och Support-packs stödjer faktureringsmedveten drift.",
    ],
  },
  da: {
    "what-is-a-business-operating-system": [
      "Et Business Operating System koordinerer viden, workflows og styring oven på eksisterende værktøjer.",
      "Modulære Business Packs lader organisationer aktivere kun det, de har brug for.",
      "Menneskelig godkendelse og revisionsspor er indbygget — ikke valgfrie tilføjelser.",
    ],
    "why-organizations-need-operational-visibility": [
      "Operationel synlighed reducerer statusjagt uden medarbejderovervågning.",
      "Ledere har brug for signal og anbefalede handlinger — ikke flere dashboards.",
      "Tværfaglig kontekst forbedrer koordinering og beslutningstempo.",
    ],
    "how-operational-knowledge-creates-competitive-advantage": [
      "Godkendt viden giver konsistente svar og hurtigere onboarding.",
      "Gapanalyse gør usikkerhed til forbedringsmuligheder.",
      "Rollebaseret adgang holder følsomme procedurer korrekt afgrænset.",
    ],
    "the-future-of-business-operations": [
      "Tillid opbygges gennem gradvis, policy-styret delegering.",
      "Companion koordinerer prioriteter — mennesker beholder ansvar.",
      "Platforme der forklarer ræsonnement opnår varig adoption.",
    ],
    "what-is-a-business-companion": [
      "Companion er operationel intelligens i Aipify — ikke et separat produkt.",
      "Indsigter inkluderer kontekst, effekt og anbefalede næste skridt.",
      "Én Aipify-identitet på tværs af Skills, Centers og Companion.",
    ],
    "companion-vs-chatbot": [
      "Chatbots optimerer samtale; Companion optimerer operationelle resultater.",
      "Companion forbinder viden, godkendelser og Business Packs.",
      "Ren tællingsalarm erstattes med handlingsbar vejledning.",
    ],
    "companion-vs-ai-assistant": [
      "Enterprise-drift kræver forklarlighed og revisionsspor.",
      "Kunder køber Aipify — ikke et modelbrand.",
      "Identitetstilpasning skaber tryghed uden manipulation.",
    ],
    "how-companion-supports-organizations": [
      "Ledelsesbriefings viser prioriteter med anbefalede handlinger.",
      "Teams får vejledning koblet til viden og workflows.",
      "Beslutningsstøtte præsenterer alternativer — dikterer aldrig udfald.",
    ],
    "human-centered-companion-design": [
      "Aipify forstærker mennesker — erstatter ikke dømmekraft.",
      "Ingen overvågning af skærm, tastetryk eller private filer.",
      "Brugere styrer identitet, opmærksomhed og hukommelsespræferencer.",
    ],
    "getting-started-with-aipify": [
      "Aipify installeres i systemer teamet allerede bruger.",
      "Start med viden og support; udvid packs i takt med tillid.",
      "Rollekortlægning respekterer kundens egne tilladelser.",
    ],
    "governance-and-human-approval": [
      "Handlingsniveauer definerer hvad der kræver menneskelig godkendelse.",
      "Kritiske handlinger er forbudt for automatiseret udførelse.",
      "Nødstop pauserer ventende handlinger med bevaret revisionshistorik.",
    ],
    "enterprise-knowledge-management": [
      "Enterprise-viden kræver godkendelsesflows og rollebaseret adgang.",
      "Metadata-først læring undgår lagring af rå privat indhold.",
      "Business DNA og Employee Knowledge betjener forskellige målgrupper.",
    ],
    "hospitality-operations-with-aipify": [
      "Aipify Hosts koordinerer gæste- og ejendomsworkflows oven på PMS.",
      "Svar forberedes til godkendelse — sendes ikke blindt.",
      "Synlighed på tværs af ejendomme understøtter ledelsesbriefings.",
    ],
    "property-management-operations-with-aipify": [
      "Porteføljesynlighed dækker enheder, leverandører og lejerhenvendelser.",
      "Vedligeholdelseseskalaeringer inkluderer kontekst og godkendelsesveje.",
      "Aipify orkestrerer — erstatter ikke kerneejendomssystemer.",
    ],
    "commerce-operations-with-aipify": [
      "Ordre- og leveringsafvigelser ses tidligt med kontekst.",
      "Support og handel deler operationel intelligens.",
      "Koordinering i peak-perioder reducerer kundepåvirkende forsinkelser.",
    ],
    "support-operations-with-aipify": [
      "Konfidensbaseret triage eskalerer usikkerhed til mennesker.",
      "Business DNA holder svar i tråd med godkendte politikker.",
      "Videnshuller bliver synlige forbedringsmuligheder.",
    ],
    "warehouse-operations-with-aipify": [
      "Skiftoverlevering og opgavekoordinering reducerer friktion.",
      "Afvigelser inkluderer anbefalede løsningsveje.",
      "Warehouse Operations Pack tilføjer styret fulfillment-intelligens.",
    ],
    "professional-services-with-aipify": [
      "Leveranceplaybooks gør ekspertise genanvendelig på tværs af opgaver.",
      "Porteføljevyer for ledelse viser kundesundhed og risiko.",
      "Finance- og Support-packs understøtter faktureringsbevidst drift.",
    ],
  },
};

const extraSections = {
  en: {
    "what-is-a-business-operating-system": [
      {
        heading: "Who benefits from a BOS",
        body: "Operations leaders gain coordinated visibility. Support teams access approved knowledge at the point of work. Executives receive briefings with context and recommended actions — not raw counts. IT and security teams retain governance controls over permissions, approvals, and audit trails.",
      },
      {
        heading: "How Aipify implements the model",
        body: "Aipify installs into customer environments and maps to native roles. Business Packs activate domain capabilities — hospitality, support, warehouse, finance — without forcing a parallel admin workflow. Companion coordinates priorities across modules while humans approve sensitive actions.",
      },
    ],
  },
};

function buildIndustryDetails(locale) {
  const t = industryContent[locale];
  return t;
}

const industryContent = {
  en: {
    hospitality: {
      metaDescription:
        "Operational guide for hospitality organizations — guest coordination, property workflows, and governed intelligence with Aipify Hosts.",
      headline: "Hospitality operations with governed intelligence",
      intro:
        "Hotels, serviced apartments, and accommodation operators coordinate guest experience across channels, properties, and shifts. Aipify brings operational visibility and prepared workflows — without replacing your PMS or front-desk judgment.",
      orgTypes: { 1: "Hotels and resorts", 2: "Serviced apartments", 3: "Boutique accommodation", 4: "Multi-property hospitality groups" },
      primaryCta: "Book a hospitality demo",
      secondaryCta: "Getting started guide",
      challengesTitle: "Challenges hospitality teams face",
      challenges: {
        1: "Guest requests scattered across booking channels, email, and messaging apps",
        2: "Housekeeping and maintenance handoffs lost between shifts",
        3: "Policy questions answered inconsistently without approved knowledge",
        4: "Leadership lacks cross-property visibility without manual status meetings",
      },
      howAipifyHelpsTitle: "How Aipify supports hospitality operations",
      howAipifyHelps: [
        {
          heading: "Guest request coordination",
          body: "Aipify triages guest messages, checks policy and availability context, and prepares responses for staff approval. Sensitive situations always escalate to humans with full context.",
        },
        {
          heading: "Property workflow visibility",
          body: "Maintenance, housekeeping, and operational checklists surface in one coordinated layer. Companion briefings highlight exceptions requiring attention today.",
        },
        {
          heading: "Knowledge-backed service",
          body: "Approved hospitality procedures — late checkout, amenities, local policies — are accessible to the right roles through governed knowledge.",
        },
      ],
      workflowsTitle: "Typical hospitality workflows",
      workflows: [
        { title: "Guest message arrives", body: "Request enters connected channel → Aipify retrieves policy → Prepares draft response → Staff approves → Logged." },
        { title: "Maintenance reported", body: "Issue flagged → Priority assessed → On-call path suggested → Manager approves dispatch → Status tracked." },
        { title: "Executive morning briefing", body: "Companion summarizes arrivals, open issues, and approvals pending — each with recommended next steps." },
      ],
      recommendedPackSlugs: ["hosts"],
      governanceTitle: "Governance for guest-impacting work",
      governanceBody:
        "Guest-impacting actions require human approval. Autonomy levels, confidence thresholds, and audit trails keep hospitality operations accountable. Aipify orchestrates intelligence above your PMS — it does not replace front-desk judgment.",
      outcomesTitle: "Outcomes hospitality operators report",
      outcomes: [
        { title: "Faster guest response preparation", body: "Staff spend less time searching policies and more time delivering service." },
        { title: "Clearer shift handoffs", body: "Operations context persists across housekeeping, maintenance, and front desk." },
        { title: "Executive visibility", body: "Multi-property summaries without daily status-chasing meetings." },
      ],
      relatedArticleSlugs: ["hospitality-operations-with-aipify", "what-is-a-business-operating-system", "governance-and-human-approval"],
    },
    "property-management": {
      metaDescription:
        "Property management operations guide — portfolio visibility, maintenance coordination, and governed workflows with Aipify.",
      headline: "Property management with portfolio-wide visibility",
      intro:
        "Property managers coordinate units, vendors, tenants, and maintenance across portfolios. Aipify provides operational intelligence and prepared workflows — not another disconnected ticketing silo.",
      orgTypes: { 1: "Residential property managers", 2: "Commercial facilities", 3: "HOA and strata operators", 4: "Mixed-use portfolios" },
      primaryCta: "Book a property demo",
      secondaryCta: "Getting started guide",
      challengesTitle: "Property management challenges",
      challenges: {
        1: "Maintenance requests tracked in email, spreadsheets, and vendor calls",
        2: "Tenant communications lack consistent policy-backed responses",
        3: "Vendor coordination without shared operational context",
        4: "Portfolio leaders cannot see risk concentration across properties",
      },
      howAipifyHelpsTitle: "How Aipify supports property operations",
      howAipifyHelps: [
        {
          heading: "Portfolio visibility",
          body: "Open issues, maintenance schedules, and escalations appear across properties with explainable priority signals.",
        },
        {
          heading: "Vendor and work order coordination",
          body: "Aipify prepares work orders, follow-ups, and escalation paths — humans approve vendor dispatch and tenant communications.",
        },
        {
          heading: "Tenant request handling",
          body: "Approved policies guide response preparation. Uncertain cases escalate with full context for property managers.",
        },
      ],
      workflowsTitle: "Property management workflows",
      workflows: [
        { title: "Urgent maintenance", body: "Tenant reports leak → Priority assessed → Vendor path suggested → Manager approves → Tracked to resolution." },
        { title: "Lease policy question", body: "Tenant inquiry → Knowledge retrieved → Draft prepared → Manager reviews → Response sent with audit." },
        { title: "Portfolio briefing", body: "Weekly summary of open issues, vendor delays, and approvals pending across properties." },
      ],
      recommendedPackSlugs: ["hosts"],
      governanceTitle: "Tenant and vendor governance",
      governanceBody:
        "Tenant-impacting and vendor-impacting actions require explicit approval. Aipify prepares coordination — property managers decide outcomes and maintain audit trails.",
      outcomesTitle: "Expected outcomes",
      outcomes: [
        { title: "Reduced response inconsistency", body: "Approved policies guide tenant communications." },
        { title: "Faster maintenance escalation", body: "Urgent issues route with context, not ad-hoc phone chains." },
        { title: "Portfolio-level clarity", body: "Leadership sees concentration of risk and backlog without micromanagement." },
      ],
      relatedArticleSlugs: ["property-management-operations-with-aipify", "hospitality-operations-with-aipify"],
    },
    commerce: {
      metaDescription:
        "Commerce operations guide — order visibility, fulfillment coordination, and support integration with Aipify.",
      headline: "Commerce operations with connected fulfillment intelligence",
      intro:
        "Retail and e-commerce teams need operational intelligence across orders, inventory signals, and customer support — especially during peak periods. Aipify connects commerce workflows with governed automation.",
      orgTypes: { 1: "E-commerce brands", 2: "Omnichannel retailers", 3: "Marketplace operators", 4: "D2C fulfillment teams" },
      primaryCta: "Book a commerce demo",
      secondaryCta: "Getting started guide",
      challengesTitle: "Commerce operational challenges",
      challenges: {
        1: "Fulfillment exceptions discovered too late for proactive customer communication",
        2: "Support agents lack order context during high-volume periods",
        3: "Inventory signals disconnected from customer-facing teams",
        4: "Peak season coordination breaks down across warehouse and support",
      },
      howAipifyHelpsTitle: "How Aipify supports commerce teams",
      howAipifyHelps: [
        {
          heading: "Fulfillment exception surfacing",
          body: "Carrier delays, stock issues, and order exceptions appear early with customer-impact context and recommended outreach.",
        },
        {
          heading: "Support-commerce connection",
          body: "Support Operations Pack brings order context into triage and response preparation — reducing back-and-forth.",
        },
        {
          heading: "Peak period coordination",
          body: "Companion briefings highlight bottlenecks across fulfillment and support so leaders act before SLAs break.",
        },
      ],
      workflowsTitle: "Commerce workflows",
      workflows: [
        { title: "Shipping delay detected", body: "Carrier exception → Customer impact assessed → Notification draft prepared → Support reviews → Proactive outreach." },
        { title: "High-volume support triage", body: "Ticket arrives with order context → Knowledge matched → Draft prepared → Agent approves." },
        { title: "Inventory exception", body: "Stock discrepancy flagged → Warehouse notified → Resolution path suggested → Supervisor approves." },
      ],
      recommendedPackSlugs: ["support", "warehouse"],
      governanceTitle: "Customer-impacting commerce actions",
      governanceBody:
        "Refunds, order changes, and customer notifications follow approval policies. Aipify prepares work — commerce leaders and support agents decide what reaches customers.",
      outcomesTitle: "Commerce outcomes",
      outcomes: [
        { title: "Proactive customer communication", body: "Exceptions surfaced before customers need to ask." },
        { title: "Support efficiency during peaks", body: "Order context reduces handle time and escalations." },
        { title: "Cross-team alignment", body: "Fulfillment and support share one operational intelligence layer." },
      ],
      relatedArticleSlugs: ["commerce-operations-with-aipify", "warehouse-operations-with-aipify", "support-operations-with-aipify"],
    },
    "support-operations": {
      metaDescription:
        "Support operations guide — governed triage, knowledge-backed responses, and escalation with Aipify Support.",
      headline: "Support operations with governed speed and consistency",
      intro:
        "Customer support teams need institutional knowledge at the point of work — with confidence scoring, escalation paths, and human control. Aipify Support combines Business DNA with governed automation.",
      orgTypes: { 1: "Customer service teams", 2: "B2B support organizations", 3: "Customer success operations", 4: "Shared service centers" },
      primaryCta: "Book a support demo",
      secondaryCta: "Getting started guide",
      challengesTitle: "Support operations challenges",
      challenges: {
        1: "Agents search multiple systems for policy answers",
        2: "Inconsistent responses create customer frustration and compliance risk",
        3: "Low-confidence cases hidden until they become escalations",
        4: "Knowledge improvements invisible until quality audits",
      },
      howAipifyHelpsTitle: "How Aipify supports support teams",
      howAipifyHelps: [
        {
          heading: "Confidence-based triage",
          body: "High-confidence, low-risk categories may auto-draft within policy. Uncertainty always routes to humans with explainable context.",
        },
        {
          heading: "Business DNA integration",
          body: "Templates, tone, and escalation rules shape every prepared response — aligned with your organization's approved knowledge.",
        },
        {
          heading: "Knowledge gap visibility",
          body: "Repeated low-confidence answers create visible gaps for knowledge improvement — humans approve content changes.",
        },
      ],
      workflowsTitle: "Support workflows",
      workflows: [
        { title: "Policy question", body: "Customer asks about warranty → Knowledge match → Draft prepared → Agent reviews → Sent with audit." },
        { title: "Low-confidence escalation", body: "No approved answer → Case escalated → Gap flagged → Knowledge team notified." },
        { title: "Support leadership briefing", body: "Queue health, SLA risks, and gap trends summarized with recommended focus areas." },
      ],
      recommendedPackSlugs: ["support"],
      governanceTitle: "Support stays under human control",
      governanceBody:
        "Auto-reply is permitted only within approved autonomy settings, confidence thresholds, and category policy. Sensitive cases always require human decision. Every action is auditable.",
      outcomesTitle: "Support outcomes",
      outcomes: [
        { title: "Faster first responses", body: "Prepared drafts reduce search time." },
        { title: "Policy consistency", body: "Approved knowledge shapes every interaction." },
        { title: "Visible improvement loop", body: "Gaps drive knowledge updates — not hidden quality decay." },
      ],
      relatedArticleSlugs: ["support-operations-with-aipify", "enterprise-knowledge-management", "companion-vs-chatbot"],
    },
    "warehouse-operations": {
      metaDescription:
        "Warehouse operations guide — task coordination, exception handling, and fulfillment visibility with Warehouse Operations Pack.",
      headline: "Warehouse operations with coordinated fulfillment",
      intro:
        "Warehouse teams depend on clear priorities, shift handoffs, and exception resolution — not dashboards nobody checks. Aipify Warehouse Operations Pack brings governed operational intelligence to fulfillment teams.",
      orgTypes: { 1: "Distribution centers", 2: "3PL operators", 3: "E-commerce fulfillment", 4: "Manufacturing warehouses" },
      primaryCta: "Book a warehouse demo",
      secondaryCta: "Getting started guide",
      challengesTitle: "Warehouse operational challenges",
      challenges: {
        1: "Pick/pack exceptions resolved through informal supervisor calls",
        2: "Shift handoffs lose context on open issues",
        3: "Inventory discrepancies discovered late in the fulfillment cycle",
        4: "Operations leaders lack explainable summaries across shifts",
      },
      howAipifyHelpsTitle: "How Aipify supports warehouse teams",
      howAipifyHelps: [
        {
          heading: "Task and handoff coordination",
          body: "Unified tasks, reminders, and accountability persist across shifts — reducing repeated explanations.",
        },
        {
          heading: "Exception handling",
          body: "Stock discrepancies and fulfillment blockers surface with recommended resolution paths for supervisor approval.",
        },
        {
          heading: "Operational reporting",
          body: "Executive summaries explain throughput, exceptions, and backlog — high signal, low noise.",
        },
      ],
      workflowsTitle: "Warehouse workflows",
      workflows: [
        { title: "Pick exception", body: "SKU mismatch flagged → Supervisor notified → Resolution suggested → Shift lead approves adjustment." },
        { title: "Shift handoff", body: "Open exceptions summarized → Next shift acknowledges → Companion tracks overdue items." },
        { title: "Inventory discrepancy", body: "Count variance detected → Escalation path prepared → Manager approves investigation." },
      ],
      recommendedPackSlugs: ["warehouse"],
      governanceTitle: "Warehouse action governance",
      governanceBody:
        "Inventory adjustments and fulfillment-impacting actions require human approval. Aipify coordinates intelligence — it does not control warehouse equipment or bypass supervisor judgment.",
      outcomesTitle: "Warehouse outcomes",
      outcomes: [
        { title: "Clearer shift continuity", body: "Handoffs preserve context on open exceptions." },
        { title: "Faster exception resolution", body: "Recommended paths reduce ad-hoc supervisor searches." },
        { title: "Leadership visibility", body: "Explainable operational summaries without floor walkthroughs." },
      ],
      relatedArticleSlugs: ["warehouse-operations-with-aipify", "commerce-operations-with-aipify", "why-organizations-need-operational-visibility"],
    },
    "professional-services": {
      metaDescription:
        "Professional services operations guide — client delivery, knowledge reuse, and executive visibility with Aipify.",
      headline: "Professional services with reusable delivery intelligence",
      intro:
        "Consulting and services firms sell expertise — operational knowledge and client visibility determine margin and quality. Aipify supports delivery playbooks, executive portfolio views, and governed client operations.",
      orgTypes: { 1: "Consulting firms", 2: "Agencies and studios", 3: "Legal and advisory practices", 4: "Managed service providers" },
      primaryCta: "Book a services demo",
      secondaryCta: "Getting started guide",
      challengesTitle: "Professional services challenges",
      challenges: {
        1: "Methodology trapped in senior consultants' experience",
        2: "Client health visible only through partner inbox noise",
        3: "Onboarding new delivery staff slow without approved playbooks",
        4: "Billing and delivery context disconnected",
      },
      howAipifyHelpsTitle: "How Aipify supports services organizations",
      howAipifyHelps: [
        {
          heading: "Delivery playbooks",
          body: "Approved methodologies and templates accessible to delivery teams — role-scoped and auditable.",
        },
        {
          heading: "Client portfolio visibility",
          body: "Partners see engagement health, risks, and milestone status — not raw communication noise.",
        },
        {
          heading: "Finance-aware operations",
          body: "Aipify Finance pack supports billing context and governed financial workflows alongside delivery.",
        },
      ],
      workflowsTitle: "Services delivery workflows",
      workflows: [
        { title: "Client onboarding", body: "Engagement starts → Checklist activated → Milestones tracked → Partner briefing prepared." },
        { title: "Delivery escalation", body: "Risk signal detected → Context summarized → Partner notified with recommended options." },
        { title: "Knowledge reuse", body: "Team member asks methodology question → Approved playbook returned → Gap flagged if outdated." },
      ],
      recommendedPackSlugs: ["finance", "support"],
      governanceTitle: "Client-sensitive governance",
      governanceBody:
        "Client-impacting communications and financial actions require explicit approval. Aipify prepares delivery intelligence — partners and delivery leads retain accountability.",
      outcomesTitle: "Services outcomes",
      outcomes: [
        { title: "Faster consultant onboarding", body: "Approved playbooks reduce ramp time." },
        { title: "Partner-level clarity", body: "Portfolio health visible without status meetings." },
        { title: "Margin protection", body: "Consistent delivery quality through reusable knowledge." },
      ],
      relatedArticleSlugs: ["professional-services-with-aipify", "enterprise-knowledge-management", "how-companion-supports-organizations"],
    },
  },
};

// Norwegian, Swedish, Danish industry translations — abbreviated keys mirror EN structure
function translateIndustries(locale) {
  if (locale === "en") return industryContent.en;
  const maps = { no: industryNo, sv: industrySv, da: industryDa };
  return maps[locale] ?? industryContent.en;
}

// Due to file size, NO/SV/DA industry content loaded from compact translations
const industryNo = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/phase620-industry-no.json"), "utf8"));
const industrySv = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/phase620-industry-sv.json"), "utf8"));
const industryDa = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/phase620-industry-da.json"), "utf8"));

const bpNameFixes = {
  en: { support: "Aipify Support", finance: "Aipify Finance" },
  no: { support: "Aipify Support", finance: "Aipify Finance" },
  sv: { support: "Aipify Support", finance: "Aipify Finance" },
  da: { support: "Aipify Support", finance: "Aipify Finance" },
};

const warehouseDetail = {
  en: {
    name: "Warehouse Operations Pack",
    label: "Warehouse Business Pack",
    audience: "Warehouse and fulfillment teams",
    value: "Inventory coordination, task handoffs, and operational visibility.",
    metaTitle: "Warehouse Operations Pack | Fulfillment Operations Business Pack",
    metaDescription:
      "Inventory coordination, task management, and operational handoffs for warehouse teams — with governed workflows and executive visibility.",
    headline: "Warehouse operations with coordinated fulfillment",
    introduction:
      "Give warehouse teams shared visibility, prioritized tasks, and exception handling with audit trails — inside the systems they already use.",
    heroCapabilities: { 1: "Pick/pack exception handling", 2: "Shift handoff coordination", 3: "Inventory discrepancy escalation", 4: "Operational reporting" },
    outcomes: {
      1: { title: "Clearer shift handoffs", body: "Open exceptions and priorities persist across shifts — less repeated explanation." },
      2: { title: "Faster exception resolution", body: "Supervisors receive context and recommended paths when SKUs or counts do not match." },
      3: { title: "Leadership visibility", body: "Executive summaries explain throughput and backlog without floor walkthroughs." },
      4: { title: "Governed adjustments", body: "Inventory-impacting changes require human approval with full audit trails." },
    },
    capabilities: {
      1: "Task and follow-up engine",
      2: "Operational alerts with recommended actions",
      3: "Approval workflows for exceptions",
      4: "Shift handoff summaries",
      5: "Inventory discrepancy escalation",
      6: "Executive operational briefings",
    },
    steps: {
      1: { title: "Connect warehouse context", body: "Link WMS, ERP inventory, and operational workflows with appropriate access levels." },
      2: { title: "Aipify surfaces exceptions", body: "Pick errors, count variances, and blockers appear with explainable priority." },
      3: { title: "Teams review and approve", body: "Supervisors approve adjustments and resolution paths — nothing silent." },
      4: { title: "Leadership receives summaries", body: "Operational briefings highlight risks, backlog, and recommended focus areas." },
    },
    governanceTitle: "Warehouse actions stay governed",
    governanceBody:
      "Inventory adjustments and fulfillment-impacting actions require explicit human approval. Aipify coordinates operational intelligence — it does not control equipment or bypass supervisor judgment.",
    whoForTitle: "Built for warehouse operators",
    whoForBody:
      "Distribution centers, 3PL operators, e-commerce fulfillment teams, and manufacturing warehouses that need coordinated visibility without replacing WMS systems.",
    planActivationTitle: "Activate on Professional",
    planActivationBody:
      "Add Warehouse Operations Pack on a Professional plan or above. Purchase the pack, activate for your organization, and grant warehouse teams governed access.",
    primaryCta: "Get Warehouse Operations Pack",
    finalCtaTitle: "READY TO MOVE FORWARD?",
    finalCtaSubtitle: "Get Warehouse Operations Pack on your plan — or book a demo to see fulfillment coordination in practice.",
  },
};

const warehouseDetailNo = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/phase620-warehouse-no.json"), "utf8"));
const warehouseDetailSv = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/phase620-warehouse-sv.json"), "utf8"));
const warehouseDetailDa = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/phase620-warehouse-da.json"), "utf8"));

const warehouseByLocale = { en: warehouseDetail.en, no: warehouseDetailNo, sv: warehouseDetailSv, da: warehouseDetailDa };

function mergeArticleExtras(marketing, locale) {
  const meta = articleMeta(locale);
  const tk = takeaways[locale];
  const extras = extraSections[locale] ?? {};
  for (const slug of ARTICLE_SLUGS) {
    if (!marketing.publicKnowledge.articles[slug]) continue;
    const article = marketing.publicKnowledge.articles[slug];
    article.readingTime = meta[slug].readingTime;
    article.publishedDate = meta[slug].publishedDate;
    article.keyTakeaways = Object.fromEntries(tk[slug].map((t, i) => [String(i + 1), t]));
    if (extras[slug]) {
      article.sections = [...(article.sections ?? []), ...extras[slug]];
    }
    // Ensure minimum section depth for substantive content
    if ((article.sections ?? []).length < 4) {
      const filler = locale === "en"
        ? {
            heading: "Putting it into practice",
            body: "Organizations typically begin with approved knowledge import and a focused pilot team. Aipify prepares operational work within governed policies — your leaders approve what reaches customers, vendors, and teams. Expand Business Packs and automation only after trust and audit review confirm the approach fits your organization.",
          }
        : locale === "no"
          ? {
              heading: "Slik kommer dere i gang",
              body: "Organisasjoner starter typisk med import av godkjent kunnskap og et fokusert pilottteam. Aipify forbereder operasjonelt arbeid innen styrte retningslinjer — ledere godkjenner hva som når kunder, leverandører og team. Utvid Business Packs og automatisering først når tillit og revisjon bekrefter at tilnærmingen passer organisasjonen.",
            }
          : locale === "sv"
            ? {
                heading: "Så kommer ni igång",
                body: "Organisationer börjar vanligtvis med godkänd kunskapsimport och ett fokuserat pilottteam. Aipify förbereder operativt arbete inom styrda policyer — ledare godkänner vad som når kunder, leverantörer och team. Utöka Business Packs och automation först när förtroende och revision bekräftar att angreppssättet passar organisationen.",
              }
            : {
                heading: "Sådan kommer I i gang",
                body: "Organisationer starter typisk med godkendt vidensimport og et fokuseret pilothold. Aipify forbereder operationelt arbejde inden for styrte politikker — ledere godkender hvad der når kunder, leverandører og teams. Udvid Business Packs og automatisering først når tillid og revision bekræfter at tilgangen passer organisationen.",
              };
      article.sections = [...(article.sections ?? []), filler];
    }
  }
}

for (const locale of LOCALES) {
  const filePath = path.join(ROOT, "locales", locale, "marketing.json");
  const marketing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  marketing.publicKnowledge ??= {};
  marketing.publicKnowledge.hub = { ...marketing.publicKnowledge.hub, ...hubLabels[locale] };
  marketing.publicKnowledge.industryDetails = translateIndustries(locale);
  mergeArticleExtras(marketing, locale);

  const fixes = bpNameFixes[locale];
  marketing.publicKnowledge.businessPacks.support.name = fixes.support;
  marketing.publicKnowledge.businessPacks.finance.name = fixes.finance;

  marketing.businessPackDetailPages ??= { shared: {}, packs: {} };
  marketing.businessPackDetailPages.packs.warehouse = warehouseByLocale[locale];
  marketing.businessPackDetailPages.packs.support.name = "Aipify Support";
  marketing.businessPackDetailPages.packs.finance.name = "Aipify Finance";

  fs.writeFileSync(filePath, `${JSON.stringify(marketing, null, 2)}\n`);
  console.log(`Updated ${locale}/marketing.json`);
}

console.log("Phase 620 public knowledge content applied.");
