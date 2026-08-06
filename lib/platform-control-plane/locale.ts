import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Platform control plane uses the canonical runtime locale list.
 * Never hardcode a fixed Platform-only language set.
 * Optional registry parameter exists for synthetic locale tests only.
 */
export function getPlatformControlPlaneLocales(
  registry: readonly string[] = LOCALES,
): readonly string[] {
  return registry;
}

export function resolvePlatformControlPlaneLocale(value: string | null | undefined): Locale {
  if (value && (LOCALES as readonly string[]).includes(value)) {
    return value as Locale;
  }
  return DEFAULT_LOCALE;
}

export function platformLocaleSupportsRtl(locale: string): boolean {
  // Direction metadata for future RTL locales — Platform must not assume LTR-only forever.
  const rtl = new Set(["ar", "he", "fa", "ur"]);
  return rtl.has(locale.toLowerCase());
}

export function platformTextDirection(locale: string): "ltr" | "rtl" {
  return platformLocaleSupportsRtl(locale) ? "rtl" : "ltr";
}
