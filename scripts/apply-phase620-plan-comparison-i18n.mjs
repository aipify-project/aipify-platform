import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const PLAN_COMPARISON_BY_LOCALE = {
  no: {
    header: {
      eyebrow: "Plan sammenligning",
      title: "Sammenlign planer side om side",
      description:
        "Se hvordan Starter, Professional, Business og Enterprise passer organisasjonen din — fra pris og kapasitet til styring, Companion-dybde og distribusjon.",
      helpChoosing: "Usikker på hvilken plan passer teamet ditt?",
      bookDemo: "Book en demo",
    },
    categories: {
      pricing: "Priser",
      organization: "Organisasjon",
      business_packs: "Business Packs",
      operations: "Operasjoner",
      companion: "Companion",
      governance: "Styring",
      support: "Support",
      deployment: "Distribusjon",
    },
    capabilities: {
      monthly_price: "Månedspris (NOK)",
      annual_price: "Årspris",
      trial_pilot: "Prøve eller pilot",
      included_users: "Inkluderte brukere",
      additional_users: "Ekstra brukere",
      included_domains: "Inkluderte domener",
      additional_domains: "Ekstra domener",
      pack_availability: "Pakke tilgjengelighet",
      included_packs: "Inkluderte pakker",
      workflows_approvals: "Arbeidsflyt og godkjenninger",
      reporting: "Rapportering",
      companion_context: "Kontekstnivå",
      policy_controls: "Policykontroller",
      support_level: "Supportnivå",
      cloud_deployment: "Sky",
      hybrid_deployment: "Hybrid",
    },
    cellStates: {
      included: "Inkludert",
      notIncluded: "Ikke inkludert",
      addon: "Tillegg",
      custom: "Tilpasset",
      upgrade: "Oppgrader plan",
      contact: "Kontakt Aipify",
    },
    levels: {
      foundation: "Grunnmur",
      essential: "Essensielt",
      basic: "Grunnleggende",
      included: "Inkludert",
      expanded: "Utvidet",
      advanced: "Avansert",
      approvals: "Godkjenninger",
      enterprise: "Enterprise-dybde",
    },
    earlyAccess: "Tidlig tilgang",
    consultation: "Konsultasjon",
    customAssessment: "Tilpasset vurdering",
    planAudience: {
      starter: "Små team som bygger operativ synlighet",
      professional: "Voksende organisasjoner som koordinerer arbeidsflyt",
      business: "Flere avdelinger og Business Packs",
      enterprise: "Tilpasset styring, distribusjon og innkjøp",
    },
    mobile: {
      selectPlan: "Velg en plan for sammenligning",
      capabilityColumn: "Kapabilitet",
    },
    popularBadge: "Mest populær",
    finalCta: {
      headline: "Klar for å etablere Aipify-arbeidsområdet?",
      primary: "Be om tidlig tilgang",
      secondary: "Snakk med salg",
    },
    supportingText:
      "Alle planer inkluderer menneskestyrt godkjenning, revisjonslogging og tenant-isolasjon. Oppgrader kapasitet etter hvert som organisasjonen vokser — uten å bytte plattform.",
  },
  sv: {
    header: {
      eyebrow: "Planjämförelse",
      title: "Jämför planer sida vid sida",
      description:
        "Se hur Starter, Professional, Business och Enterprise matchar din organisation — från pris och kapacitet till styrning, Companion-djup och distribution.",
      helpChoosing: "Osäker på vilken plan passar ditt team?",
      bookDemo: "Boka en demo",
    },
    categories: {
      pricing: "Priser",
      organization: "Organisation",
      business_packs: "Business Packs",
      operations: "Operationer",
      companion: "Companion",
      governance: "Styrning",
      support: "Support",
      deployment: "Distribution",
    },
    capabilities: {
      monthly_price: "Månadspris (NOK)",
      annual_price: "Årspris",
      trial_pilot: "Test eller pilot",
      included_users: "Inkluderade användare",
      additional_users: "Extra användare",
      included_domains: "Inkluderade domäner",
      additional_domains: "Extra domäner",
      pack_availability: "Pakettillgänglighet",
      included_packs: "Inkluderade paket",
      workflows_approvals: "Arbetsflöden och godkännanden",
      reporting: "Rapportering",
      companion_context: "Kontextnivå",
      policy_controls: "Policykontroller",
      support_level: "Supportnivå",
      cloud_deployment: "Moln",
      hybrid_deployment: "Hybrid",
    },
    cellStates: {
      included: "Inkluderat",
      notIncluded: "Ej inkluderat",
      addon: "Tillägg",
      custom: "Anpassat",
      upgrade: "Uppgradera plan",
      contact: "Kontakta Aipify",
    },
    levels: {
      foundation: "Grund",
      essential: "Essential",
      basic: "Grundläggande",
      included: "Inkluderat",
      expanded: "Utökad",
      advanced: "Avancerad",
      approvals: "Godkännanden",
      enterprise: "Enterprise-djup",
    },
    earlyAccess: "Tidig åtkomst",
    consultation: "Konsultation",
    customAssessment: "Anpassad bedömning",
    planAudience: {
      starter: "Små team som bygger operativ synlighet",
      professional: "Växande organisationer som koordinerar arbetsflöden",
      business: "Flera avdelningar och Business Packs",
      enterprise: "Anpassad styrning, distribution och upphandling",
    },
    mobile: {
      selectPlan: "Välj en plan att jämföra",
      capabilityColumn: "Kapabilitet",
    },
    popularBadge: "Mest populär",
    finalCta: {
      headline: "Redo att etablera din Aipify-arbetsyta?",
      primary: "Begär tidig åtkomst",
      secondary: "Prata med sälj",
    },
    supportingText:
      "Alla planer inkluderar människostyrda godkännanden, revisionsspårning och tenant-isolering. Uppgradera kapacitet när organisationen växer — utan att byta plattform.",
  },
  da: {
    header: {
      eyebrow: "Plansammenligning",
      title: "Sammenlign planer side om side",
      description:
        "Se hvordan Starter, Professional, Business og Enterprise matcher din organisation — fra pris og kapacitet til styring, Companion-dybde og distribution.",
      helpChoosing: "Usikker på hvilken plan passer dit team?",
      bookDemo: "Book en demo",
    },
    categories: {
      pricing: "Priser",
      organization: "Organisation",
      business_packs: "Business Packs",
      operations: "Operationer",
      companion: "Companion",
      governance: "Styring",
      support: "Support",
      deployment: "Distribution",
    },
    capabilities: {
      monthly_price: "Månedspris (NOK)",
      annual_price: "Årspris",
      trial_pilot: "Prøve eller pilot",
      included_users: "Inkluderede brugere",
      additional_users: "Ekstra brugere",
      included_domains: "Inkluderede domener",
      additional_domains: "Ekstra domener",
      pack_availability: "Pakke tilgængelighed",
      included_packs: "Inkluderede pakker",
      workflows_approvals: "Arbejdsgange og godkendelser",
      reporting: "Rapportering",
      companion_context: "Kontekstniveau",
      policy_controls: "Policykontroller",
      support_level: "Supportniveau",
      cloud_deployment: "Sky",
      hybrid_deployment: "Hybrid",
    },
    cellStates: {
      included: "Inkluderet",
      notIncluded: "Ikke inkluderet",
      addon: "Tillæg",
      custom: "Tilpasset",
      upgrade: "Opgrader plan",
      contact: "Kontakt Aipify",
    },
    levels: {
      foundation: "Fundament",
      essential: "Essential",
      basic: "Grundlæggende",
      included: "Inkluderet",
      expanded: "Udvidet",
      advanced: "Avanceret",
      approvals: "Godkendelser",
      enterprise: "Enterprise-dybde",
    },
    earlyAccess: "Tidlig adgang",
    consultation: "Konsultation",
    customAssessment: "Tilpasset vurdering",
    planAudience: {
      starter: "Små teams der bygger operationel synlighed",
      professional: "Voksende organisationer der koordinerer arbejdsgange",
      business: "Flere afdelinger og Business Packs",
      enterprise: "Tilpasset styring, distribution og indkøb",
    },
    mobile: {
      selectPlan: "Vælg en plan til sammenligning",
      capabilityColumn: "Kapabilitet",
    },
    popularBadge: "Mest populær",
    finalCta: {
      headline: "Klar til at etablere dit Aipify-arbejdsområde?",
      primary: "Anmod om tidlig adgang",
      secondary: "Tal med salg",
    },
    supportingText:
      "Alle planer inkluderer menneskestyrede godkendelser, revisionssporing og tenant-isolation. Opgrader kapacitet efterhånden som organisationen vokser — uden at skifte platform.",
  },
};

for (const locale of ["no", "sv", "da"]) {
  const filePath = path.join(root, "locales", locale, "marketing.json");
  const marketing = JSON.parse(readFileSync(filePath, "utf8"));
  marketing.pricingPage.planComparison = PLAN_COMPARISON_BY_LOCALE[locale];
  writeFileSync(filePath, `${JSON.stringify(marketing, null, 2)}\n`, "utf8");
  console.log(`Updated ${locale}/marketing.json planComparison`);
}
