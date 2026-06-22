import {
  CORE_LOCALE_LABELS,
  CORE_LOCALES,
  DEFAULT_LOCALE,
  type CoreLocale,
} from "./config";
import { LOCALE_FLAGS, PUBLIC_FOOTER_FLAG_FILES } from "./public-locales";

/**
 * Canonical active customer locales for APP, Companion, and shared selectors.
 * Subset of CORE_LOCALES — only locales with complete APP translation coverage.
 */
export const CUSTOMER_ACTIVE_LOCALE_ORDER = [
  "no",
  "sv",
  "da",
  "en",
  "pl",
  "uk",
] as const satisfies readonly CoreLocale[];

export type CustomerActiveLocale = (typeof CUSTOMER_ACTIVE_LOCALE_ORDER)[number];

export type CustomerActiveLocaleDefinition = {
  locale: CustomerActiveLocale;
  label: string;
  nativeLabel: string;
  flagEmoji: string;
  flagSrc: string;
  enabled: true;
  direction: "ltr";
  fallbackLocale: typeof DEFAULT_LOCALE;
};

function assertActiveLocalesMatchCore(): void {
  for (const locale of CUSTOMER_ACTIVE_LOCALE_ORDER) {
    if (!CORE_LOCALES.includes(locale)) {
      throw new Error(`Customer active locale ${locale} is not in CORE_LOCALES`);
    }
  }
}

assertActiveLocalesMatchCore();

export function isCustomerActiveLocale(value: string): value is CustomerActiveLocale {
  return CUSTOMER_ACTIVE_LOCALE_ORDER.includes(value as CustomerActiveLocale);
}

export function coerceToCustomerActiveLocale(
  value: string | null | undefined,
): CustomerActiveLocale {
  if (!value) return DEFAULT_LOCALE as CustomerActiveLocale;
  const normalized = value.toLowerCase().split("-")[0];
  if (isCustomerActiveLocale(normalized)) return normalized;
  if (normalized === "nb" || normalized === "nn") return "no";
  if (normalized === "ua") return "uk";
  return DEFAULT_LOCALE as CustomerActiveLocale;
}

export function resolveCustomerActiveLocale(
  value: string | null | undefined,
): CustomerActiveLocale {
  if (value && isCustomerActiveLocale(value)) return value;
  return DEFAULT_LOCALE as CustomerActiveLocale;
}

export function getCustomerActiveLocaleDefinitions(): CustomerActiveLocaleDefinition[] {
  return CUSTOMER_ACTIVE_LOCALE_ORDER.map((locale) => ({
    locale,
    label: CORE_LOCALE_LABELS[locale],
    nativeLabel: CORE_LOCALE_LABELS[locale],
    flagEmoji: LOCALE_FLAGS[locale],
    flagSrc: PUBLIC_FOOTER_FLAG_FILES[locale],
    enabled: true as const,
    direction: "ltr" as const,
    fallbackLocale: DEFAULT_LOCALE,
  }));
}

/** Browser Accept-Language primary tags mapped to customer active locales. */
export const BROWSER_LOCALE_PREFIXES: Record<string, CustomerActiveLocale> = {
  no: "no",
  nb: "no",
  nn: "no",
  sv: "sv",
  da: "da",
  en: "en",
  pl: "pl",
  uk: "uk",
  ua: "uk",
};
