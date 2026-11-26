/**
 * Curated, read-only sales materials registry for Certified Sales Partners (PLATFORM ADMIN view).
 *
 * Only assets that already ship in `public/` are registered. Nothing is invented: categories with
 * no published asset stay empty and the UI says so. Admin publish / upload mutations are gated
 * until the materials SQL candidate is applied by the owner (see
 * `docs/platform/csp-selgere-complete-sql-candidate-v2.md`).
 *
 * Approved short copy (`CSP_SALES_COPY_REGISTRY`) follows the same rule: it is a code-reviewed,
 * catalog-based set. Platform-side publish/withdraw persistence does not exist yet, so the partner
 * UI must say the set is the approved bundle — not a live, admin-published library.
 */
import { localeBlock as L, pickLocale, type CspLocaleBlock } from "./academy/types";

export const CSP_SALES_MATERIAL_CATEGORIES = [
  "product_images",
  "logos",
  "pdf_sheets",
  "social",
  "email_templates",
  "signatures",
] as const;
export type CspSalesMaterialCategory = (typeof CSP_SALES_MATERIAL_CATEGORIES)[number];

export type CspSalesMaterialItem = {
  id: string;
  category: CspSalesMaterialCategory;
  /** i18n key suffix under `platform.sellers.ops.materials.items.*`. */
  labelKey: string;
  /** Public asset path served from `public/`. */
  href: string;
  /** File extension shown as a small format tag (not a raw status code). */
  format: "png" | "svg" | "pdf";
  /** Same as `href` — kept for panels that address assets by path. */
  assetPath: string;
  version: number;
  mimeHint: string;
  /** Always true for registered assets; unpublished assets are simply not registered. */
  published: boolean;
  /** Product keys this asset belongs to; empty = applies to every product. */
  productKeys: readonly string[];
};

export const CSP_SALES_MATERIALS_REGISTRY: readonly CspSalesMaterialItem[] = [
  {
    id: "kompis-web-product-visual",
    category: "product_images",
    labelKey: "kompisWebVisual",
    href: "/brand/kompis-web-product-visual.png",
    assetPath: "/brand/kompis-web-product-visual.png",
    format: "png",
    version: 1,
    mimeHint: "image/png",
    published: true,
    productKeys: ["kompis_web"],
  },
  {
    id: "kompis-bedrift-product-visual",
    category: "product_images",
    labelKey: "kompisBedriftVisual",
    href: "/brand/kompis-bedrift-product-visual.png",
    assetPath: "/brand/kompis-bedrift-product-visual.png",
    format: "png",
    version: 1,
    mimeHint: "image/png",
    published: true,
    productKeys: ["kompis_bedrift"],
  },
  {
    id: "aipify-companion-icon-light",
    category: "logos",
    labelKey: "companionIconLight",
    href: "/aipify-companion-launcher-icon-light.svg",
    assetPath: "/aipify-companion-launcher-icon-light.svg",
    format: "svg",
    version: 1,
    mimeHint: "image/svg+xml",
    published: true,
    productKeys: [],
  },
  {
    id: "aipify-companion-icon-dark",
    category: "logos",
    labelKey: "companionIconDark",
    href: "/aipify-companion-launcher-icon-dark.svg",
    assetPath: "/aipify-companion-launcher-icon-dark.svg",
    format: "svg",
    version: 1,
    mimeHint: "image/svg+xml",
    published: true,
    productKeys: [],
  },
];

export function listSalesMaterialsByCategory(
  category: CspSalesMaterialCategory,
  registry: readonly CspSalesMaterialItem[] = CSP_SALES_MATERIALS_REGISTRY,
): CspSalesMaterialItem[] {
  return registry.filter((item) => item.category === category);
}

/** Categories that currently hold no published asset — rendered as honest empty groups. */
export function listEmptySalesMaterialCategories(
  registry: readonly CspSalesMaterialItem[] = CSP_SALES_MATERIALS_REGISTRY,
): CspSalesMaterialCategory[] {
  return CSP_SALES_MATERIAL_CATEGORIES.filter((c) => !registry.some((i) => i.category === c));
}

/** Alias used by earlier panel/test code. */
export const CSP_SALES_MATERIALS_CATALOG = CSP_SALES_MATERIALS_REGISTRY;

/** Published assets only, optionally narrowed by product. Never returns invented assets. */
export function listPublishedSalesMaterials(
  opts: { productKey?: string; locale?: string } = {},
  registry: readonly CspSalesMaterialItem[] = CSP_SALES_MATERIALS_REGISTRY,
): CspSalesMaterialItem[] {
  return registry.filter(
    (item) =>
      item.published &&
      (!opts.productKey || item.productKeys.length === 0 || item.productKeys.includes(opts.productKey)),
  );
}

/* -------------------------------------------------------------------------- */
/* Approved short copy (partner share / sales tools)                          */
/* -------------------------------------------------------------------------- */

/** Tone variants: calm product description, first-person recommendation, one-line short form. */
export const CSP_SALES_COPY_TONES = ["informative", "personal", "short"] as const;
export type CspSalesCopyTone = (typeof CSP_SALES_COPY_TONES)[number];

export type CspSalesCopyItem = {
  readonly id: string;
  readonly productKey: string;
  readonly tone: CspSalesCopyTone;
  readonly text: CspLocaleBlock;
  readonly version: number;
  /** Always true for registered copy; unapproved copy is simply not registered. */
  readonly published: boolean;
};

/**
 * Modest, claim-free wording: no performance promises, no prices, no guarantees. Products with no
 * approved copy (future products) have no entries — the UI shows an honest empty state.
 */
export const CSP_SALES_COPY_REGISTRY: readonly CspSalesCopyItem[] = [
  {
    id: "kompis-web-informative",
    productKey: "kompis_web",
    tone: "informative",
    version: 1,
    published: true,
    text: L(
      "Kompis Web helps visitors find answers on your own website, based on content you have approved. You stay in control of what it can use.",
      "Kompis Web hjelper besøkende med å finne svar på ditt eget nettsted, basert på innhold du har godkjent. Du har kontroll over hva den kan bruke.",
      "Kompis Web hjälper besökare att hitta svar på din egen webbplats, baserat på innehåll du har godkänt. Du har kontroll över vad den får använda.",
      "Kompis Web hjælper besøgende med at finde svar på din egen hjemmeside, baseret på indhold, du har godkendt. Du bestemmer, hvad den må bruge.",
      "Kompis Web pomaga odwiedzającym znaleźć odpowiedzi na Twojej stronie, w oparciu o treści, które zatwierdzisz. Ty decydujesz, z czego może korzystać.",
      "Kompis Web допомагає відвідувачам знаходити відповіді на вашому сайті на основі матеріалів, які ви схвалили. Ви самі вирішуєте, що він може використовувати.",
      "Kompis Web ayuda a los visitantes a encontrar respuestas en tu propio sitio web, a partir del contenido que hayas aprobado. Tú controlas lo que puede usar.",
    ),
  },
  {
    id: "kompis-web-personal",
    productKey: "kompis_web",
    tone: "personal",
    version: 1,
    published: true,
    text: L(
      "I'm a Certified Aipify Sales Partner. If visitors keep asking your website the same questions, Kompis Web may be worth a look.",
      "Jeg er sertifisert Aipify-salgspartner. Hvis besøkende stadig stiller de samme spørsmålene til nettstedet ditt, kan Kompis Web være verdt å se på.",
      "Jag är certifierad Aipify-säljpartner. Om besökare ställer samma frågor till din webbplats om och om igen kan Kompis Web vara värt att titta på.",
      "Jeg er certificeret Aipify-salgspartner. Hvis besøgende gang på gang stiller de samme spørgsmål til din hjemmeside, kan Kompis Web være værd at se nærmere på.",
      "Jestem certyfikowanym partnerem sprzedaży Aipify. Jeśli odwiedzający wciąż zadają Twojej stronie te same pytania, warto przyjrzeć się Kompis Web.",
      "Я сертифікований партнер з продажу Aipify. Якщо відвідувачі раз у раз ставлять вашому сайту одні й ті самі запитання, Kompis Web, можливо, варто розглянути.",
      "Soy socio de ventas certificado de Aipify. Si los visitantes hacen una y otra vez las mismas preguntas a tu sitio web, quizá valga la pena conocer Kompis Web.",
    ),
  },
  {
    id: "kompis-web-short",
    productKey: "kompis_web",
    tone: "short",
    version: 1,
    published: true,
    text: L(
      "Kompis Web helps visitors find answers on your website, based on content you approve.",
      "Kompis Web hjelper besøkende med å finne svar på nettstedet ditt, basert på innhold du godkjenner.",
      "Kompis Web hjälper besökare att hitta svar på din webbplats, baserat på innehåll du godkänner.",
      "Kompis Web hjælper besøgende med at finde svar på din hjemmeside, baseret på indhold, du godkender.",
      "Kompis Web pomaga odwiedzającym znaleźć odpowiedzi na Twojej stronie, w oparciu o treści, które zatwierdzasz.",
      "Kompis Web допомагає відвідувачам знаходити відповіді на вашому сайті на основі матеріалів, які ви схвалюєте.",
      "Kompis Web ayuda a los visitantes a encontrar respuestas en tu sitio web, a partir del contenido que apruebas.",
    ),
  },
  {
    id: "kompis-bedrift-informative",
    productKey: "kompis_bedrift",
    tone: "informative",
    version: 1,
    published: true,
    text: L(
      "Kompis Bedrift supports your own team with internal knowledge your company has approved. People still make the decisions.",
      "Kompis Bedrift støtter ditt eget team med intern kunnskap bedriften har godkjent. Det er fortsatt mennesker som tar beslutningene.",
      "Kompis Bedrift stöttar ditt eget team med intern kunskap som företaget har godkänt. Det är fortfarande människor som fattar besluten.",
      "Kompis Bedrift støtter dit eget team med intern viden, som virksomheden har godkendt. Det er stadig mennesker, der træffer beslutningerne.",
      "Kompis Bedrift wspiera Twój zespół zatwierdzoną wiedzą wewnętrzną firmy. Decyzje nadal podejmują ludzie.",
      "Kompis Bedrift підтримує вашу команду схваленими внутрішніми знаннями компанії. Рішення, як і раніше, ухвалюють люди.",
      "Kompis Bedrift apoya a tu propio equipo con el conocimiento interno que la empresa ha aprobado. Las decisiones las siguen tomando las personas.",
    ),
  },
  {
    id: "kompis-bedrift-personal",
    productKey: "kompis_bedrift",
    tone: "personal",
    version: 1,
    published: true,
    text: L(
      "I'm a Certified Aipify Sales Partner. If your team often looks for the same internal answers, Kompis Bedrift may be worth a conversation.",
      "Jeg er sertifisert Aipify-salgspartner. Hvis teamet ditt ofte leter etter de samme interne svarene, kan Kompis Bedrift være verdt en samtale.",
      "Jag är certifierad Aipify-säljpartner. Om ditt team ofta letar efter samma interna svar kan Kompis Bedrift vara värt ett samtal.",
      "Jeg er certificeret Aipify-salgspartner. Hvis dit team ofte leder efter de samme interne svar, kan Kompis Bedrift være værd en samtale.",
      "Jestem certyfikowanym partnerem sprzedaży Aipify. Jeśli Twój zespół często szuka tych samych wewnętrznych odpowiedzi, warto porozmawiać o Kompis Bedrift.",
      "Я сертифікований партнер з продажу Aipify. Якщо ваша команда часто шукає одні й ті самі внутрішні відповіді, про Kompis Bedrift, можливо, варто поговорити.",
      "Soy socio de ventas certificado de Aipify. Si tu equipo busca a menudo las mismas respuestas internas, quizá valga la pena hablar de Kompis Bedrift.",
    ),
  },
  {
    id: "kompis-bedrift-short",
    productKey: "kompis_bedrift",
    tone: "short",
    version: 1,
    published: true,
    text: L(
      "Kompis Bedrift supports your team with approved internal knowledge.",
      "Kompis Bedrift støtter teamet ditt med godkjent intern kunnskap.",
      "Kompis Bedrift stöttar ditt team med godkänd intern kunskap.",
      "Kompis Bedrift støtter dit team med godkendt intern viden.",
      "Kompis Bedrift wspiera Twój zespół zatwierdzoną wiedzą wewnętrzną.",
      "Kompis Bedrift підтримує вашу команду схваленими внутрішніми знаннями.",
      "Kompis Bedrift apoya a tu equipo con conocimiento interno aprobado.",
    ),
  },
];

export type CspLocalizedSalesCopy = {
  id: string;
  productKey: string;
  tone: CspSalesCopyTone;
  text: string;
  version: number;
};

/**
 * Published approved copy for one marketing language.
 * Returns nothing when that language has no approved text. Does not fall back to English.
 */
export function listPublishedSalesCopyForLocale(
  opts: { productKey: string; locale: string },
  registry: readonly CspSalesCopyItem[] = CSP_SALES_COPY_REGISTRY,
): CspLocalizedSalesCopy[] {
  return registry.flatMap((item) => {
    if (!item.published || item.productKey !== opts.productKey) return [];
    const text = item.text[opts.locale as keyof CspLocaleBlock];
    if (typeof text !== "string" || text.trim().length === 0) return [];
    return [
      {
        id: item.id,
        productKey: item.productKey,
        tone: item.tone,
        text,
        version: item.version,
      },
    ];
  });
}

/** Published approved copy for a product, localized (English fallback). Never returns invented copy. */
export function listPublishedSalesCopy(
  opts: { productKey: string; locale?: string },
  registry: readonly CspSalesCopyItem[] = CSP_SALES_COPY_REGISTRY,
): CspLocalizedSalesCopy[] {
  return registry
    .filter((item) => item.published && item.productKey === opts.productKey)
    .map((item) => ({
      id: item.id,
      productKey: item.productKey,
      tone: item.tone,
      text: pickLocale(item.text, opts.locale ?? "en"),
      version: item.version,
    }));
}

/** The registered product visual for a product (png), or `null` when none is published. */
export function getPublishedProductImage(
  productKey: string,
  registry: readonly CspSalesMaterialItem[] = CSP_SALES_MATERIALS_REGISTRY,
): CspSalesMaterialItem | null {
  return (
    registry.find((i) => i.published && i.category === "product_images" && i.productKeys.includes(productKey)) ?? null
  );
}
