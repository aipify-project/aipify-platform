/**
 * Aipify-internal sales email catalog.
 *
 * Bodies are the approved Del / sales-copy texts. This module does not invent
 * product claims, prices, or discounts. A locale with no approved text is absent —
 * callers must not fall back to English.
 *
 * Future customer tenants may receive unpublished examples. Nothing here is
 * published for any tenant other than Aipify's own seller operation.
 */
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { localeBlock, type CspLocaleBlock } from "../academy/types";
import { CSP_SALES_COPY_REGISTRY, type CspSalesCopyTone } from "../sales-materials-catalog";

export const AIPIFY_INTERNAL_SALES_TENANT = "aipify_internal" as const;

export const SALES_EMAIL_TEMPLATE_TYPES = [
  "product_introduction",
  "follow_up",
  "meeting_request",
  "product_information",
] as const;
export type SalesEmailTemplateType = (typeof SALES_EMAIL_TEMPLATE_TYPES)[number];

export const SALES_EMAIL_PRODUCT_KEYS = ["kompis_web", "kompis_bedrift"] as const;
export type SalesEmailProductKey = (typeof SALES_EMAIL_PRODUCT_KEYS)[number];

/** Placeholders the renderer may resolve. Anything else is rejected. */
export const SALES_EMAIL_PLACEHOLDERS = [
  "seller_display_name",
  "seller_avatar_url",
  "seller_company",
  "seller_contact",
  "product_name",
  "product_description",
  "referral_url",
  "company_branding",
  "unsubscribe_url",
] as const;
export type SalesEmailPlaceholder = (typeof SALES_EMAIL_PLACEHOLDERS)[number];

export const SALES_EMAIL_REQUIRED_PLACEHOLDERS = [
  "seller_display_name",
  "product_name",
  "product_description",
  "referral_url",
  "company_branding",
  "unsubscribe_url",
] as const satisfies readonly SalesEmailPlaceholder[];

const TYPE_TONE: Record<SalesEmailTemplateType, CspSalesCopyTone> = {
  product_introduction: "informative",
  follow_up: "personal",
  meeting_request: "personal",
  product_information: "short",
};

const PRODUCT_NAMES: Record<SalesEmailProductKey, CspLocaleBlock> = {
  kompis_web: localeBlock(
    "Kompis Web",
    "Kompis Web",
    "Kompis Web",
    "Kompis Web",
    "Kompis Web",
    "Kompis Web",
    "Kompis Web",
  ),
  kompis_bedrift: localeBlock(
    "Kompis Bedrift",
    "Kompis Bedrift",
    "Kompis Bedrift",
    "Kompis Bedrift",
    "Kompis Bedrift",
    "Kompis Bedrift",
    "Kompis Bedrift",
  ),
};

const SUBJECTS: Record<SalesEmailTemplateType, CspLocaleBlock> = {
  product_introduction: localeBlock(
    "About {{product_name}}",
    "Om {{product_name}}",
    "Om {{product_name}}",
    "Om {{product_name}}",
    "O {{product_name}}",
    "Про {{product_name}}",
    "Sobre {{product_name}}",
  ),
  follow_up: localeBlock(
    "Following up about {{product_name}}",
    "Oppfølging om {{product_name}}",
    "Uppföljning om {{product_name}}",
    "Opfølgning om {{product_name}}",
    "Kontynuacja w sprawie {{product_name}}",
    "Продовження щодо {{product_name}}",
    "Seguimiento sobre {{product_name}}",
  ),
  meeting_request: localeBlock(
    "A short conversation about {{product_name}}",
    "En kort samtale om {{product_name}}",
    "Ett kort samtal om {{product_name}}",
    "En kort samtale om {{product_name}}",
    "Krótka rozmowa o {{product_name}}",
    "Коротка розмова про {{product_name}}",
    "Una breve conversación sobre {{product_name}}",
  ),
  product_information: localeBlock(
    "Information about {{product_name}}",
    "Informasjon om {{product_name}}",
    "Information om {{product_name}}",
    "Information om {{product_name}}",
    "Informacje o {{product_name}}",
    "Інформація про {{product_name}}",
    "Información sobre {{product_name}}",
  ),
};

const CTA: CspLocaleBlock = localeBlock(
  "Open page",
  "Åpne siden",
  "Öppna sidan",
  "Åbn siden",
  "Otwórz stronę",
  "Відкрити сторінку",
  "Abrir la página",
);

export const SALES_EMAIL_FROM = "Aipify Group AS <partners@aipify.ai>";
export const SALES_EMAIL_COMPANY_BRANDING = "Aipify Group AS, Bergen, Norway";

export type SalesEmailTemplateLocale = {
  locale: Locale;
  /** `published` only when this locale has approved body text. */
  status: "published" | "unavailable";
  subject: string;
  preheader: string;
  body: string;
  cta: string;
};

export type SalesEmailTemplate = {
  id: string;
  tenantId: typeof AIPIFY_INTERNAL_SALES_TENANT;
  productKey: SalesEmailProductKey;
  type: SalesEmailTemplateType;
  version: number;
  /** Source tone in the approved sales-copy registry. */
  copyId: string;
  locales: Record<Locale, SalesEmailTemplateLocale>;
};

function approvedBody(productKey: string, tone: CspSalesCopyTone, locale: Locale): { id: string; text: string } | null {
  const item = CSP_SALES_COPY_REGISTRY.find(
    (row) => row.published && row.productKey === productKey && row.tone === tone,
  );
  if (!item) return null;
  const text = item.text[locale];
  if (typeof text !== "string" || text.trim().length === 0) return null;
  return { id: item.id, text: text.trim() };
}

function buildTemplate(productKey: SalesEmailProductKey, type: SalesEmailTemplateType): SalesEmailTemplate {
  const tone = TYPE_TONE[type];
  const source = CSP_SALES_COPY_REGISTRY.find(
    (row) => row.published && row.productKey === productKey && row.tone === tone,
  );
  const locales = {} as Record<Locale, SalesEmailTemplateLocale>;
  for (const locale of LOCALES) {
    const body = approvedBody(productKey, tone, locale);
    const subject = SUBJECTS[type][locale];
    locales[locale] = {
      locale,
      status: body ? "published" : "unavailable",
      subject,
      preheader: body ? body.text.slice(0, 140) : "",
      body: body?.text ?? "",
      cta: CTA[locale],
    };
  }
  return {
    id: `${productKey}.${type}.v1`,
    tenantId: AIPIFY_INTERNAL_SALES_TENANT,
    productKey,
    type,
    version: source?.version ?? 1,
    copyId: source?.id ?? "",
    locales,
  };
}

export const SALES_EMAIL_TEMPLATES: readonly SalesEmailTemplate[] = SALES_EMAIL_PRODUCT_KEYS.flatMap((productKey) =>
  SALES_EMAIL_TEMPLATE_TYPES.map((type) => buildTemplate(productKey, type)),
);

export function listSalesEmailTemplates(filter?: {
  productKey?: string;
  type?: string;
  locale?: string;
  status?: "published" | "unavailable";
}): SalesEmailTemplate[] {
  return SALES_EMAIL_TEMPLATES.filter((template) => {
    if (filter?.productKey && template.productKey !== filter.productKey) return false;
    if (filter?.type && template.type !== filter.type) return false;
    if (filter?.locale || filter?.status) {
      const locale = (filter.locale ?? "en") as Locale;
      const row = template.locales[locale];
      if (!row) return false;
      if (filter.status && row.status !== filter.status) return false;
    }
    return true;
  });
}

export function getSalesEmailTemplate(id: string): SalesEmailTemplate | null {
  return SALES_EMAIL_TEMPLATES.find((template) => template.id === id) ?? null;
}

export function productNameFor(productKey: SalesEmailProductKey, locale: Locale): string {
  return PRODUCT_NAMES[productKey][locale];
}

export function isSalesEmailLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isSalesEmailProductKey(value: string): value is SalesEmailProductKey {
  return (SALES_EMAIL_PRODUCT_KEYS as readonly string[]).includes(value);
}

export function isSalesEmailTemplateType(value: string): value is SalesEmailTemplateType {
  return (SALES_EMAIL_TEMPLATE_TYPES as readonly string[]).includes(value);
}
