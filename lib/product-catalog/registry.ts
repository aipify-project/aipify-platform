import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { CanonicalProductDefinition, ProductCatalogLocaleCode } from "./types";

function copy(
  title: string,
  tagline: string,
  description: string,
  localeApproved = true
): CanonicalProductDefinition["copy"][ProductCatalogLocaleCode] {
  return { title, tagline, description, localeApproved };
}

/**
 * Canonical Aipify products — single identity for APP Store + Sales Partner catalog.
 * Channel publication is merged at runtime with Core CSP rows (SALE) and registry defaults (APP).
 */
export const CANONICAL_PRODUCT_REGISTRY: readonly CanonicalProductDefinition[] = [
  {
    productKey: "kompis_web",
    sku: "AIP-KOMPIS-WEB",
    category: "kompis",
    defaultAppPublished: true,
    defaultSaleEligible: true,
    moduleKey: "website_kompis",
    openHref: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
    logoSrc: "/website-kompis/design-v1/brand/aipify-mark.svg",
    heroImagePath: "/brand/kompis-web-product-visual.png",
    accent: "violet",
    letter: "W",
    copy: {
      en: copy(
        "Kompis Web",
        "Website answers from approved content",
        "Aipify helps your business give visitors faster access to information from your own website, based on approved and available content."
      ),
      no: copy(
        "Kompis Web",
        "Nettstedssvar fra godkjent innhold",
        "Aipify hjelper bedriften din med å gi besøkende raskere tilgang til informasjon fra eget nettsted, basert på godkjent og tilgjengelig innhold."
      ),
      sv: copy(
        "Kompis Web",
        "Webbsvar från godkänt innehåll",
        "Aipify hjälper ditt företag att ge besökare snabbare tillgång till information från den egna webbplatsen, baserat på godkänt och tillgängligt innehåll."
      ),
      da: copy(
        "Kompis Web",
        "Hjemmesidesvar fra godkendt indhold",
        "Aipify hjælper din virksomhed med at give besøgende hurtigere adgang til information fra jeres eget website, baseret på godkendt og tilgængeligt indhold."
      ),
      pl: copy(
        "Kompis Web",
        "Odpowiedzi witryny z zatwierdzonych treści",
        "Aipify pomaga Twojej firmie szybciej udostępniać odwiedzającym informacje z własnej witryny na podstawie zatwierdzonych i dostępnych treści."
      ),
      uk: copy(
        "Kompis Web",
        "Відповіді сайту зі схваленого вмісту",
        "Aipify допомагає вашому бізнесу швидше надавати відвідувачам інформацію з власного сайту на основі схваленого та доступного вмісту."
      ),
      es: copy(
        "Kompis Web",
        "Respuestas del sitio desde contenido aprobado",
        "Aipify ayuda a tu empresa a dar a los visitantes un acceso más rápido a la información de tu propio sitio web, basada en contenido aprobado y disponible."
      ),
    },
  },
  {
    productKey: "kompis_bedrift",
    sku: "AIP-KOMPIS-BEDRIFT",
    category: "kompis",
    defaultAppPublished: true,
    defaultSaleEligible: true,
    moduleKey: "kompis_bedrift",
    openHref: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
    logoSrc: "/website-kompis/design-v1/brand/aipify-mark.svg",
    heroImagePath: "/brand/kompis-bedrift-product-visual.png",
    accent: "indigo",
    letter: "B",
    copy: {
      en: copy(
        "Kompis Bedrift",
        "Approved internal knowledge for teams",
        "Aipify helps your organisation make approved internal knowledge easier to find, share, and use across the team."
      ),
      no: copy(
        "Kompis Bedrift",
        "Godkjent intern kunnskap for team",
        "Aipify hjelper organisasjonen din med å gjøre godkjent intern kunnskap enklere å finne, dele og bruke i teamet."
      ),
      sv: copy(
        "Kompis Bedrift",
        "Godkänd intern kunskap för team",
        "Aipify hjälper din organisation att göra godkänd intern kunskap lättare att hitta, dela och använda i teamet."
      ),
      da: copy(
        "Kompis Bedrift",
        "Godkendt intern viden til teams",
        "Aipify hjælper din organisation med at gøre godkendt intern viden lettere at finde, dele og bruge i teamet."
      ),
      pl: copy(
        "Kompis Bedrift",
        "Zatwierdzona wiedza wewnętrzna dla zespołów",
        "Aipify pomaga Twojej organizacji ułatwić znajdowanie, udostępnianie i używanie zatwierdzonej wiedzy wewnętrznej w zespole."
      ),
      uk: copy(
        "Kompis Bedrift",
        "Схвалені внутрішні знання для команд",
        "Aipify допомагає вашій організації зробити схвалені внутрішні знання доступнішими для пошуку, обміну та використання в команді."
      ),
      es: copy(
        "Kompis Bedrift",
        "Conocimiento interno aprobado para equipos",
        "Aipify ayuda a tu organización a facilitar el acceso, el intercambio y el uso del conocimiento interno aprobado en el equipo."
      ),
    },
  },
  {
    productKey: "aipify_voice",
    sku: "AIP-VOICE",
    category: "voice",
    defaultAppPublished: false,
    defaultSaleEligible: true,
    moduleKey: null,
    openHref: null,
    logoSrc: "/website-kompis/design-v1/brand/aipify-mark.svg",
    heroImagePath: null,
    accent: "emerald",
    letter: "V",
    copy: {
      en: copy(
        "Aipify Voice",
        "Voice experiences — coming later",
        "Aipify is preparing a voice experience for businesses. Sales partners may see orientation information; APP purchase is not available yet.",
        true
      ),
      no: copy(
        "Aipify Voice",
        "Stemmeopplevelser — kommer senere",
        "Aipify forbereder en stemmeopplevelse for bedrifter. Selgere kan se orienteringsinformasjon; kjøp i APP er ikke tilgjengelig ennå."
      ),
      sv: copy(
        "Aipify Voice",
        "Röstupplevelser — kommer senare",
        "Aipify förbereder en röstupplevelse för företag. Säljpartners kan se orienterande information; köp i APP är inte tillgängligt ännu."
      ),
      da: copy(
        "Aipify Voice",
        "Stemmeoplevelser — kommer senere",
        "Aipify forbereder en stemmeoplevelse til virksomheder. Salgspartnere kan se orienterende information; køb i APP er endnu ikke tilgængeligt."
      ),
      pl: copy(
        "Aipify Voice",
        "Doświadczenia głosowe — wkrótce",
        "Aipify przygotowuje doświadczenie głosowe dla firm. Partnerzy sprzedaży mogą zobaczyć informacje orientacyjne; zakup w APP nie jest jeszcze dostępny."
      ),
      uk: copy(
        "Aipify Voice",
        "Голосові можливості — незабаром",
        "Aipify готує голосовий досвід для бізнесу. Партнери з продажу можуть бачити ознайомчу інформацію; купівля в APP ще недоступна."
      ),
      es: copy(
        "Aipify Voice",
        "Experiencias de voz — próximamente",
        "Aipify está preparando una experiencia de voz para empresas. Los socios de ventas pueden ver información orientativa; la compra en APP aún no está disponible."
      ),
    },
  },
];

export function getCanonicalProduct(productKey: string): CanonicalProductDefinition | null {
  return CANONICAL_PRODUCT_REGISTRY.find((p) => p.productKey === productKey) ?? null;
}
