/** Map Aipify locale codes to BCP 47 tags for Intl formatting. */

const BCP47_BY_LOCALE: Record<string, string> = {
  en: "en-GB",
  no: "nb-NO",
  sv: "sv-SE",
  da: "da-DK",
  pl: "pl-PL",
  uk: "uk-UA",
  es: "es-ES",
};

export function toBcp47Locale(locale: string | null | undefined): string {
  const key = (locale ?? "en").trim().toLowerCase().split("-")[0] ?? "en";
  return BCP47_BY_LOCALE[key] ?? key;
}

/**
 * Authoritative timezone for Platform UI.
 * Prefer an explicit zone; otherwise use the runtime environment zone.
 */
export function resolveAuthoritativeTimeZone(
  preferred?: string | null,
): string {
  const trimmed = preferred?.trim();
  if (trimmed) return trimmed;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
