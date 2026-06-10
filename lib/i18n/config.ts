export const LOCALES = ["en", "no", "sv", "da"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "aipify-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  no: "Norsk",
  sv: "Svenska",
  da: "Dansk",
};

export const NAMESPACES = [
  "common",
  "landing",
  "dashboard",
  "assistant",
  "auth",
  "support",
  "settings",
  "install",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
