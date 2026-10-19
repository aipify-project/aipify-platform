import { WPKF_LOCALES } from "@/lib/website-kompis-faq/constants";
import { canonicalFaqContentLanguage } from "@/lib/website-kompis-faq/content-languages";

export const FAQ_IMPORT_SCHEMA_VERSION = "kompis-web-faq-import-v1";
export const FAQ_IMPORT_MAX_ROWS = 100;
export const FAQ_IMPORT_MAX_BYTES = 1_048_576;
export const FAQ_IMPORT_DUPLICATE_PAGE_SIZE = 500;
export const FAQ_IMPORT_DUPLICATE_MAX_PAGES = 3;

export const FAQ_IMPORT_FIELDS = [
  "question",
  "title",
  "answer",
  "category",
  "locale",
  "tags",
  "permanent",
  "validFrom",
  "validUntil",
  "reference",
] as const;

export type FaqImportField = (typeof FAQ_IMPORT_FIELDS)[number];
export type FaqImportColumnTarget = FaqImportField | "ignore" | "status";

export const FAQ_IMPORT_REQUIRED_FIELDS = ["question", "answer", "category", "locale"] as const;

export const FAQ_IMPORT_TEMPLATE_HEADERS = [
  "Spørsmål",
  "Tittel",
  "Svar",
  "Kategori",
  "Språk",
  "Emneord",
  "Permanent",
  "Gyldig fra",
  "Gyldig til",
] as const;

const HEADER_ALIASES: Record<string, FaqImportColumnTarget> = {
  spørsmål: "question",
  sporsmal: "question",
  question: "question",
  tittel: "title",
  title: "title",
  svar: "answer",
  answer: "answer",
  kategori: "category",
  category: "category",
  språk: "locale",
  sprak: "locale",
  language: "locale",
  locale: "locale",
  emneord: "tags",
  tags: "tags",
  keywords: "tags",
  permanent: "permanent",
  "gyldig fra": "validFrom",
  "valid from": "validFrom",
  validfrom: "validFrom",
  valid_from: "validFrom",
  "gyldig til": "validUntil",
  "valid until": "validUntil",
  validuntil: "validUntil",
  valid_until: "validUntil",
  "intern referanse": "reference",
  reference: "reference",
  status: "status",
};

export function normalizeFaqImportHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function suggestFaqImportMapping(headers: string[]): Record<string, FaqImportColumnTarget> {
  const mapping: Record<string, FaqImportColumnTarget> = {};
  for (const header of headers) {
    const key = normalizeFaqImportHeader(header);
    mapping[header] = HEADER_ALIASES[key] ?? "ignore";
  }
  return mapping;
}

export function canonicalFaqLocale(value: string): (typeof WPKF_LOCALES)[number] | null {
  return canonicalFaqContentLanguage(value);
}

export function supportedFaqImportLocales(): readonly string[] {
  return WPKF_LOCALES;
}
