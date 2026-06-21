import { CORE_LOCALE_LABELS, DEFAULT_LOCALE, type CoreLocale, type Locale } from "./config";
import { LOCALE_FLAGS, PUBLIC_FOOTER_FLAG_FILES } from "./public-locales";

/** Customer App UI locales — Nordic + English (Phase 620). */
export const APP_LOCALE_ORDER = ["no", "sv", "da", "en"] as const;

export type AppLocale = (typeof APP_LOCALE_ORDER)[number];

export const APP_LOCALES: readonly AppLocale[] = APP_LOCALE_ORDER;

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALE_ORDER.includes(value as AppLocale);
}

export function resolveAppLocale(value: string | null | undefined): AppLocale {
  if (value && isAppLocale(value)) return value;
  return DEFAULT_LOCALE as AppLocale;
}

export type AppLocaleOption = {
  locale: AppLocale;
  label: string;
  nativeLabel: string;
  flagEmoji: string;
  flagSrc: string;
};

export function appLocaleOptions(): AppLocaleOption[] {
  return APP_LOCALE_ORDER.map((locale) => ({
    locale,
    label: CORE_LOCALE_LABELS[locale],
    nativeLabel: CORE_LOCALE_LABELS[locale],
    flagEmoji: LOCALE_FLAGS[locale],
    flagSrc: PUBLIC_FOOTER_FLAG_FILES[locale],
  }));
}

/** Map any locale code to the nearest supported APP locale. */
export function coerceToAppLocale(value: string | null | undefined): AppLocale {
  if (!value) return DEFAULT_LOCALE as AppLocale;
  const normalized = value.toLowerCase().split("-")[0];
  if (isAppLocale(normalized)) return normalized;
  if (normalized === "nb" || normalized === "nn") return "no";
  return DEFAULT_LOCALE as AppLocale;
}

export function isLocaleUsableInApp(value: string): value is Locale {
  return isAppLocale(value);
}
