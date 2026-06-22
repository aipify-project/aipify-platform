/** Default Aipify Core Language Foundation — required for every new surface. */
export const CORE_LOCALES = ["en", "no", "sv", "da", "pl", "uk"] as const;

export type CoreLocale = (typeof CORE_LOCALES)[number];

/** Additional locales enabled in the runtime picker (beyond core foundation). */
export const EXTENDED_LOCALES = ["es"] as const;

export type ExtendedLocale = (typeof EXTENDED_LOCALES)[number];

export const LOCALES = [...CORE_LOCALES, ...EXTENDED_LOCALES] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "aipify-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  no: "Norsk",
  sv: "Svenska",
  da: "Dansk",
  pl: "Polski",
  uk: "Українська",
  es: "Español",
};

export const CORE_LOCALE_LABELS: Record<CoreLocale, string> = {
  en: LOCALE_LABELS.en,
  no: LOCALE_LABELS.no,
  sv: LOCALE_LABELS.sv,
  da: LOCALE_LABELS.da,
  pl: LOCALE_LABELS.pl,
  uk: LOCALE_LABELS.uk,
};

export const NAMESPACES = [
  "common",
  "shell",
  "landing",
  "dashboard",
  "assistant",
  "auth",
  "support",
  "settings",
  "install",
  "platform",
  "pwa",
  "branding",
  "presence",
  "license",
  "hosts",
  "marketing",
  "superAdmin",
  "growthPartnerPortal",
  "growthPortal",
  "partnersPortal",
  "partnerPortal",
  "partnerAcademy",
  "partnerCommissions",
  "partnerSettlements",
  "partnerCompliance",
  "partnerMaterials",
  "partnerOpportunities",
  "partnerCommunications",
  "partnerAdvisor",
  "companionMemoryContext",
  "companionWorkspaceIntelligence",
  "companionDeviceEnvironment",
  "companionActionApproval",
  "desktopCompanion",
  "commandBar",
  "unonightAdmin",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function isCoreLocale(value: string): value is CoreLocale {
  return CORE_LOCALES.includes(value as CoreLocale);
}
