/**
 * CSP product catalog — canonical DISPLAY metadata for partner-facing product cards (pure, client-safe).
 *
 * Scope: names, descriptions, category, and whether a product is sellable today.
 * It is NOT commercial truth:
 *  - Commission amounts are never defined here — they come from Core (published product rows) only.
 *  - Customer prices shown here are the PLANNED reference catalog (`KOMPIS_WEB_PLANNED_CATALOG`,
 *    status `planned_not_stripe_live`) and must always be labelled as planned / reference.
 *  - Partners never purchase; there is no checkout concept in this module.
 */
import { KOMPIS_WEB_PLANNED_CATALOG } from "./academy/kompis-web-lessons";
import { localeBlock as L, pickLocale, type CspLocaleBlock } from "./academy/types";

export const CSP_CATALOG_PRODUCT_KEYS = ["kompis_web", "kompis_bedrift", "aipify_voice"] as const;
export type CspCatalogProductKey = (typeof CSP_CATALOG_PRODUCT_KEYS)[number];

export const CSP_CATALOG_CATEGORIES = ["kompis", "voice"] as const;
export type CspCatalogCategory = (typeof CSP_CATALOG_CATEGORIES)[number];

export const CSP_CATALOG_FILTERS = ["all", ...CSP_CATALOG_CATEGORIES] as const;
export type CspCatalogFilter = (typeof CSP_CATALOG_FILTERS)[number];

/** Planned reference price (NOT a binding offer, not live in billing). */
export type CspPlannedReferencePrice = {
  readonly currency: "NOK";
  /** Lowest planned paid monthly price — shown as "from …". */
  readonly fromMonthly: number;
  readonly status: typeof KOMPIS_WEB_PLANNED_CATALOG.status;
};

export type CspCatalogProduct = {
  readonly key: CspCatalogProductKey;
  /** Future products are shown for orientation only — never sellable, no link, no training. */
  readonly future: boolean;
  /** True only when a partner may currently sell the product (still gated by Core). */
  readonly sellable: boolean;
  /** Academy track exists for this product. */
  readonly hasTraining: boolean;
  readonly category: CspCatalogCategory;
  readonly title: CspLocaleBlock;
  readonly description: CspLocaleBlock;
  /** Who the product fits — modest, claim-free. */
  readonly audience: CspLocaleBlock;
  /** Documented product strengths — never invented performance claims. */
  readonly benefits: readonly CspLocaleBlock[];
  /** Planned reference price, or null when no planned catalog is defined. */
  readonly plannedReferencePrice: CspPlannedReferencePrice | null;
  /** Official product visual served from `public/brand/*`; null when no approved visual exists. */
  readonly imagePath: string | null;
};

export const CSP_CATALOG_PRODUCTS: readonly CspCatalogProduct[] = [
  {
    key: "kompis_web",
    category: "kompis",
    future: false,
    sellable: true,
    hasTraining: true,
    title: L("Buddy Web", "Kompis Web", "Kompis Web", "Kompis Web", "Buddy Web", "Buddy Web", "Buddy Web"),
    description: L(
      "Give visitors faster access to information from the company's own website. Buddy helps customers find relevant answers based on approved and available content.",
      "Gi besøkende rask tilgang til informasjon fra bedriftens eget nettsted. Kompis hjelper kundene med å finne relevante svar basert på godkjent og tilgjengelig innhold.",
      "Ge besökare snabbare tillgång till information från företagets egen webbplats. Kompis hjälper kunderna att hitta relevanta svar baserat på godkänt och tillgängligt innehåll.",
      "Giv besøgende hurtig adgang til information fra virksomhedens egen hjemmeside. Kompis hjælper kunderne med at finde relevante svar baseret på godkendt og tilgængeligt indhold.",
      "Zapewnij odwiedzającym szybki dostęp do informacji z własnej witryny firmy. Buddy pomaga klientom znaleźć trafne odpowiedzi na podstawie zatwierdzonych i dostępnych treści.",
      "Дайте відвідувачам швидший доступ до інформації з власного сайту компанії. Buddy допомагає клієнтам знаходити релевантні відповіді на основі схваленого й доступного вмісту.",
      "Da a los visitantes un acceso más rápido a la información del propio sitio web de la empresa. Buddy ayuda a encontrar respuestas relevantes a partir de contenido aprobado y disponible.",
    ),
    audience: L(
      "Businesses that want clearer website answers, a better visitor experience, and fewer repeated questions.",
      "Bedrifter som ønsker å gjøre informasjon enklere tilgjengelig, forbedre kundeopplevelsen og redusere gjentakende spørsmål.",
      "Företag som vill göra information lättare att hitta, förbättra besökarupplevelsen och minska återkommande frågor.",
      "Virksomheder, der vil gøre information lettere tilgængelig, forbedre kundeoplevelsen og reducere gentagne spørgsmål.",
      "Firmy, które chcą ułatwić dostęp do informacji, poprawić doświadczenie odwiedzających i ograniczyć powtarzające się pytania.",
      "Компанії, які хочуть зробити інформацію доступнішою, покращити досвід відвідувачів і зменшити повторювані запитання.",
      "Empresas que quieren hacer la información más accesible, mejorar la experiencia del visitante y reducir preguntas repetidas.",
    ),
    benefits: [
      L(
        "Answers based on approved website content",
        "Svar basert på godkjent nettstedsinnhold",
        "Svar baserat på godkänt webbplatsinnehåll",
        "Svar baseret på godkendt hjemmesideindhold",
        "Odpowiedzi na podstawie zatwierdzonych treści witryny",
        "Відповіді на основі схваленого вмісту сайту",
        "Respuestas basadas en contenido web aprobado",
      ),
      L(
        "Visitors find relevant information faster",
        "Besøkende finner relevant informasjon raskere",
        "Besökare hittar relevant information snabbare",
        "Besøgende finder relevant information hurtigere",
        "Odwiedzający szybciej znajdują trafne informacje",
        "Відвідувачі швидше знаходять релевантну інформацію",
        "Los visitantes encuentran información relevante antes",
      ),
      L(
        "Fewer repetitive day-to-day questions",
        "Færre gjentakende spørsmål i hverdagen",
        "Färre återkommande vardagsfrågor",
        "Færre gentagne spørgsmål i hverdagen",
        "Mniej powtarzających się codziennych pytań",
        "Менше повторюваних повсякденних запитань",
        "Menos preguntas repetidas del día a día",
      ),
    ],
    plannedReferencePrice: {
      currency: KOMPIS_WEB_PLANNED_CATALOG.currency,
      fromMonthly: KOMPIS_WEB_PLANNED_CATALOG.standard.monthlyPriceNok,
      status: KOMPIS_WEB_PLANNED_CATALOG.status,
    },
    imagePath: "/brand/kompis-web-product-visual.png",
  },
  {
    key: "kompis_bedrift",
    category: "kompis",
    future: false,
    sellable: true,
    hasTraining: false,
    title: L(
      "Buddy Business",
      "Buddy Business",
      "Buddy Business",
      "Buddy Business",
      "Kompis Bedrift",
      "Kompis Bedrift",
      "Kompis Bedrift",
    ),
    description: L(
      "A digital companion for businesses that want better access to approved internal knowledge, clearer workflows and more effective information sharing. Training for this product is not published yet.",
      "En digital assistent for bedrifter som ønsker bedre tilgang til godkjent intern kunnskap, tydeligere arbeidsflyt og mer effektiv informasjonsdeling. Opplæring for dette produktet er ikke publisert ennå.",
      "En digital följeslagare för företag som vill ha bättre tillgång till godkänd intern kunskap, tydligare arbetsflöden och mer effektiv informationsdelning. Utbildning för den här produkten är inte publicerad ännu.",
      "En digital assistent for virksomheder, der ønsker bedre adgang til godkendt intern viden, tydeligere arbejdsgange og mere effektiv informationsdeling. Uddannelse til dette produkt er endnu ikke publiceret.",
      "Cyfrowy towarzysz dla firm, które chcą lepszego dostępu do zatwierdzonej wiedzy wewnętrznej, jaśniejszych procesów i skuteczniejszego dzielenia się informacją. Szkolenie dla tego produktu nie zostało jeszcze opublikowane.",
      "Цифровий помічник для компаній, які хочуть кращого доступу до схвалених внутрішніх знань, чіткіших робочих процесів і ефективнішого обміну інформацією. Навчання для цього продукту ще не опубліковано.",
      "Un compañero digital para empresas que quieren mejor acceso al conocimiento interno aprobado, flujos de trabajo más claros y un intercambio de información más eficaz. La formación de este producto aún no está publicada.",
    ),
    audience: L(
      "Organisations that want approved internal knowledge easier to find and share across the team.",
      "Organisasjoner som vil gjøre godkjent intern kunnskap enklere å finne og dele i teamet.",
      "Organisationer som vill göra godkänd intern kunskap lättare att hitta och dela i teamet.",
      "Organisationer, der vil gøre godkendt intern viden lettere at finde og dele i teamet.",
      "Organizacje, które chcą ułatwić dostęp do zatwierdzonej wiedzy wewnętrznej i jej udostępnianie w zespole.",
      "Організації, які хочуть зробити схвалені внутрішні знання доступнішими для команди.",
      "Organizaciones que quieren facilitar el acceso y el intercambio de conocimiento interno aprobado en el equipo.",
    ),
    benefits: [
      L(
        "Access to approved internal knowledge",
        "Tilgang til godkjent intern kunnskap",
        "Tillgång till godkänd intern kunskap",
        "Adgang til godkendt intern viden",
        "Dostęp do zatwierdzonej wiedzy wewnętrznej",
        "Доступ до схвалених внутрішніх знань",
        "Acceso a conocimiento interno aprobado",
      ),
      L(
        "Clearer day-to-day information flow",
        "Tydeligere informasjonsflyt i hverdagen",
        "Tydligare informationsflöde i vardagen",
        "Tydeligere informationsflow i hverdagen",
        "Wyraźniejszy przepływ informacji na co dzień",
        "Чіткіший інформаційний потік у повсякденні",
        "Flujo de información más claro día a día",
      ),
      L(
        "People stay in control of decisions",
        "Mennesker beholder beslutningskontrollen",
        "Människor behåller beslutsrätten",
        "Mennesker beholder beslutningskontrollen",
        "Ludzie zachowują kontrolę nad decyzjami",
        "Люди зберігають контроль над рішеннями",
        "Las personas siguen decidiendo",
      ),
    ],
    plannedReferencePrice: null,
    imagePath: "/brand/kompis-bedrift-product-visual.png",
  },
  {
    key: "aipify_voice",
    category: "voice",
    future: true,
    sellable: false,
    hasTraining: false,
    title: L(
      "Aipify Voice",
      "Aipify Voice",
      "Aipify Voice",
      "Aipify Voice",
      "Aipify Voice",
      "Aipify Voice",
      "Aipify Voice",
    ),
    description: L(
      "A future voice capability from Aipify. Not available for sale and not part of the certification yet.",
      "En fremtidig stemmefunksjon fra Aipify. Ikke tilgjengelig for salg og ikke en del av sertifiseringen ennå.",
      "En framtida röstfunktion från Aipify. Inte tillgänglig för försäljning och inte en del av certifieringen ännu.",
      "En fremtidig stemmefunktion fra Aipify. Ikke tilgængelig til salg og endnu ikke en del af certificeringen.",
      "Przyszła funkcja głosowa Aipify. Niedostępna do sprzedaży i jeszcze nie objęta certyfikacją.",
      "Майбутня голосова можливість Aipify. Недоступна для продажу й ще не входить до сертифікації.",
      "Una futura capacidad de voz de Aipify. No está disponible para la venta y aún no forma parte de la certificación.",
    ),
    audience: L(
      "Not available for sale yet.",
      "Ikke tilgjengelig for salg ennå.",
      "Inte tillgänglig för försäljning ännu.",
      "Ikke tilgængelig til salg endnu.",
      "Jeszcze niedostępne do sprzedaży.",
      "Ще недоступно для продажу.",
      "Aún no disponible para la venta.",
    ),
    benefits: [],
    plannedReferencePrice: null,
    imagePath: null,
  },
];

export type CspLocalizedCatalogProduct = {
  readonly key: CspCatalogProductKey;
  readonly category: CspCatalogCategory;
  readonly future: boolean;
  readonly sellable: boolean;
  readonly hasTraining: boolean;
  readonly title: string;
  readonly description: string;
  readonly audience: string;
  readonly benefits: readonly string[];
  readonly plannedReferencePrice: CspPlannedReferencePrice | null;
  readonly imagePath: string | null;
};

export function isCspCatalogFilter(value: unknown): value is CspCatalogFilter {
  return typeof value === "string" && (CSP_CATALOG_FILTERS as readonly string[]).includes(value);
}

export function filterCspCatalogProducts(
  filter: CspCatalogFilter,
  products: readonly CspCatalogProduct[] = CSP_CATALOG_PRODUCTS,
): CspCatalogProduct[] {
  return filter === "all" ? products.slice() : products.filter((product) => product.category === filter);
}

export function localizeCspCatalogProduct(product: CspCatalogProduct, locale: string): CspLocalizedCatalogProduct {
  return {
    key: product.key,
    category: product.category,
    future: product.future,
    sellable: product.sellable,
    hasTraining: product.hasTraining,
    title: pickLocale(product.title, locale),
    description: pickLocale(product.description, locale),
    audience: pickLocale(product.audience, locale),
    benefits: product.benefits.map((b) => pickLocale(b, locale)),
    plannedReferencePrice: product.plannedReferencePrice,
    imagePath: product.imagePath,
  };
}

export function getLocalizedCspCatalogProducts(
  locale: string,
  filter: CspCatalogFilter = "all",
): CspLocalizedCatalogProduct[] {
  return filterCspCatalogProducts(filter).map((product) => localizeCspCatalogProduct(product, locale));
}
