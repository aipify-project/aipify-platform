import { LOCALE_LABELS, type Locale } from "./config";

/**
 * Fixed display order for the public footer language selector.
 * Nordic languages first (Bergen HQ), then international locales.
 */
export const PUBLIC_FOOTER_LOCALE_ORDER = [
  "no",
  "sv",
  "da",
  "en",
  "es",
  "de",
  "fr",
  "pl",
  "uk",
] as const;

export type PublicFooterLocaleCode = (typeof PUBLIC_FOOTER_LOCALE_ORDER)[number];

/**
 * Locales selectable on public marketing pages.
 * Requires valid Locale + common namespace on disk; marketing merges English when needed.
 * de/fr omitted until added to core locale registry and translations exist.
 */
export const PUBLIC_FOOTER_ENABLED_LOCALES = ["no", "sv", "da", "en", "es", "pl", "uk"] as const;

export type PublicFooterEnabledLocale = (typeof PUBLIC_FOOTER_ENABLED_LOCALES)[number];

/** @deprecated Use PUBLIC_FOOTER_ENABLED_LOCALES */
export const PUBLIC_MARKETING_LOCALES = PUBLIC_FOOTER_ENABLED_LOCALES;

/** @deprecated Use PublicFooterEnabledLocale */
export type PublicMarketingLocale = PublicFooterEnabledLocale;

export const PUBLIC_FOOTER_FLAG_FILES: Record<PublicFooterLocaleCode, string> = {
  no: "/flags/no.svg",
  sv: "/flags/sv.svg",
  da: "/flags/da.svg",
  en: "/flags/en.svg",
  es: "/flags/es.svg",
  de: "/flags/de.svg",
  fr: "/flags/fr.svg",
  pl: "/flags/pl.svg",
  uk: "/flags/uk.svg",
};

export function isPublicFooterEnabledLocale(value: string): value is PublicFooterEnabledLocale {
  return PUBLIC_FOOTER_ENABLED_LOCALES.includes(value as PublicFooterEnabledLocale);
}

/** @deprecated Use isPublicFooterEnabledLocale */
export function isPublicMarketingLocale(value: string): value is PublicMarketingLocale {
  return isPublicFooterEnabledLocale(value);
}

export type PublicFooterLocaleOption = {
  locale: PublicFooterEnabledLocale;
  label: string;
  nativeLabel: string;
  flagSrc: string;
  enabled: true;
};

export function publicFooterLocaleOptions(): PublicFooterLocaleOption[] {
  return PUBLIC_FOOTER_LOCALE_ORDER.filter(isPublicFooterEnabledLocale).map((locale) => ({
    locale,
    label: LOCALE_LABELS[locale as Locale],
    nativeLabel: LOCALE_LABELS[locale as Locale],
    flagSrc: PUBLIC_FOOTER_FLAG_FILES[locale],
    enabled: true as const,
  }));
}

/** @deprecated Use publicFooterLocaleOptions */
export function publicLocaleOptions(): PublicFooterLocaleOption[] {
  return publicFooterLocaleOptions();
}

export const LOCALE_FLAGS: Record<PublicFooterEnabledLocale, string> = {
  en: "🇬🇧",
  no: "🇳🇴",
  sv: "🇸🇪",
  da: "🇩🇰",
  es: "🇪🇸",
  pl: "🇵🇱",
  uk: "🇺🇦",
};
