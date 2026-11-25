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
  readonly category: CspCatalogCategory;
  /** Future products are shown for orientation only — never sellable, no link, no training. */
  readonly future: boolean;
  /** True only when a partner may currently sell the product (still gated by Core). */
  readonly sellable: boolean;
  /** Academy track exists for this product. */
  readonly hasTraining: boolean;
  readonly title: CspLocaleBlock;
  readonly description: CspLocaleBlock;
  /** Planned reference price, or null when no planned catalog is defined. */
  readonly plannedReferencePrice: CspPlannedReferencePrice | null;
};

export const CSP_CATALOG_PRODUCTS: readonly CspCatalogProduct[] = [
  {
    key: "kompis_web",
    category: "kompis",
    future: false,
    sellable: true,
    hasTraining: true,
    title: L("Kompis Web", "Kompis Web", "Kompis Web", "Kompis Web", "Kompis Web", "Kompis Web", "Kompis Web"),
    description: L(
      "The website companion that helps visitors find answers on the customer's own website, based on content the customer has approved.",
      "Nettstedskompisen som hjelper besøkende med å finne svar på kundens eget nettsted, basert på innhold kunden har godkjent.",
      "Webbplatskompisen som hjälper besökare att hitta svar på kundens egen webbplats, baserat på innehåll som kunden har godkänt.",
      "Hjemmesidekompagnonen, der hjælper besøgende med at finde svar på kundens egen hjemmeside, baseret på indhold, som kunden har godkendt.",
      "Towarzysz witryny, który pomaga odwiedzającym znaleźć odpowiedzi na stronie klienta w oparciu o treści zatwierdzone przez klienta.",
      "Помічник вебсайту, який допомагає відвідувачам знаходити відповіді на сайті клієнта на основі матеріалів, схвалених клієнтом.",
      "El compañero de sitio web que ayuda a los visitantes a encontrar respuestas en el sitio del cliente a partir del contenido que el cliente ha aprobado.",
    ),
    plannedReferencePrice: {
      currency: KOMPIS_WEB_PLANNED_CATALOG.currency,
      fromMonthly: KOMPIS_WEB_PLANNED_CATALOG.standard.monthlyPriceNok,
      status: KOMPIS_WEB_PLANNED_CATALOG.status,
    },
  },
  {
    key: "kompis_bedrift",
    category: "kompis",
    future: false,
    sellable: true,
    hasTraining: false,
    title: L(
      "Kompis Bedrift",
      "Kompis Bedrift",
      "Kompis Bedrift",
      "Kompis Bedrift",
      "Kompis Bedrift",
      "Kompis Bedrift",
      "Kompis Bedrift",
    ),
    description: L(
      "The business companion that supports a company's own team with approved internal knowledge. Training for this product is not published yet.",
      "Bedriftskompisen som støtter bedriftens eget team med godkjent intern kunnskap. Opplæring for dette produktet er ikke publisert ennå.",
      "Företagskompisen som stöttar företagets eget team med godkänd intern kunskap. Utbildning för den här produkten är inte publicerad ännu.",
      "Virksomhedskompagnonen, der støtter virksomhedens eget team med godkendt intern viden. Uddannelse til dette produkt er endnu ikke publiceret.",
      "Towarzysz firmowy, który wspiera zespół firmy zatwierdzoną wiedzą wewnętrzną. Szkolenie dla tego produktu nie zostało jeszcze opublikowane.",
      "Корпоративний помічник, який підтримує команду компанії схваленими внутрішніми знаннями. Навчання для цього продукту ще не опубліковано.",
      "El compañero empresarial que apoya al equipo de la empresa con conocimiento interno aprobado. La formación de este producto aún no está publicada.",
    ),
    plannedReferencePrice: null,
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
    plannedReferencePrice: null,
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
  readonly plannedReferencePrice: CspPlannedReferencePrice | null;
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
    plannedReferencePrice: product.plannedReferencePrice,
  };
}

export function getLocalizedCspCatalogProducts(
  locale: string,
  filter: CspCatalogFilter = "all",
): CspLocalizedCatalogProduct[] {
  return filterCspCatalogProducts(filter).map((product) => localizeCspCatalogProduct(product, locale));
}
