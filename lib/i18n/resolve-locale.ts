import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./config";
import {
  coerceToAppLocale,
  isAppLocale,
  resolveAppLocale,
  type AppLocale,
} from "./app-locales";
import { isPublicFooterEnabledLocale } from "./public-locales";

export type LocaleResolutionSource =
  | "cookie"
  | "user_preference"
  | "organization_default"
  | "browser"
  | "default";

export type ResolvedLocale = {
  locale: Locale;
  appLocale: AppLocale;
  source: LocaleResolutionSource;
};

const NORDIC_BROWSER_PREFIXES: Record<string, AppLocale> = {
  no: "no",
  nb: "no",
  nn: "no",
  sv: "sv",
  da: "da",
  en: "en",
};

export function parseAcceptLanguageHeader(header: string | null | undefined): AppLocale | null {
  if (!header) return null;

  const tokens = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const token of tokens) {
    const primary = token.split("-")[0];
    const mapped = NORDIC_BROWSER_PREFIXES[primary];
    if (mapped) return mapped;
  }

  return null;
}

export function resolvePublicLocale(input: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): ResolvedLocale {
  const cookie = input.cookieLocale?.trim();
  if (cookie && isPublicFooterEnabledLocale(cookie)) {
    return {
      locale: cookie,
      appLocale: coerceToAppLocale(cookie),
      source: "cookie",
    };
  }

  const browser = parseAcceptLanguageHeader(input.acceptLanguage);
  if (browser) {
    return { locale: browser, appLocale: browser, source: "browser" };
  }

  return {
    locale: DEFAULT_LOCALE,
    appLocale: DEFAULT_LOCALE as AppLocale,
    source: "default",
  };
}

export function resolveAppUiLocale(input: {
  cookieLocale?: string | null;
  userPreferredLocale?: string | null;
  organizationDefaultLanguage?: string | null;
  acceptLanguage?: string | null;
}): ResolvedLocale {
  const cookie = input.cookieLocale?.trim();
  if (cookie && isAppLocale(cookie)) {
    return { locale: cookie, appLocale: cookie, source: "cookie" };
  }

  const userPref = coerceToAppLocale(input.userPreferredLocale);
  if (input.userPreferredLocale && isAppLocale(userPref)) {
    return { locale: userPref, appLocale: userPref, source: "user_preference" };
  }

  const orgDefault = coerceToAppLocale(input.organizationDefaultLanguage);
  if (input.organizationDefaultLanguage && isAppLocale(orgDefault)) {
    return {
      locale: orgDefault,
      appLocale: orgDefault,
      source: "organization_default",
    };
  }

  const browser = parseAcceptLanguageHeader(input.acceptLanguage);
  if (browser) {
    return { locale: browser, appLocale: browser, source: "browser" };
  }

  return {
    locale: DEFAULT_LOCALE,
    appLocale: resolveAppLocale(DEFAULT_LOCALE),
    source: "default",
  };
}

export { LOCALE_COOKIE };
