import { LOCALES, type Locale } from "@/lib/i18n/config";

const ALLOWED = new Set<string>(LOCALES);

export function isCspShareLocale(value: string | null | undefined): value is Locale {
  return typeof value === "string" && ALLOWED.has(value);
}

/**
 * Copies an allowlisted marketing language onto a redirect.
 * Does not read or write attribution cookies, partner ids, or capture payloads.
 */
export function appendAllowlistedShareLocale(target: URL, lang: string | null | undefined): void {
  if (!isCspShareLocale(lang)) return;
  target.searchParams.set("lang", lang);
}
