import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

/**
 * Canonical global locale list for Kompis authenticated workspace.
 * Never hardcode locale unions in workspace UI — read from Core foundation.
 */
export function listKompisWorkspaceLocales(): readonly string[] {
  return LOCALES;
}

export function kompisWorkspaceLocaleFallback(): string {
  return DEFAULT_LOCALE;
}

const RTL_METADATA: Readonly<Record<string, boolean>> = Object.freeze({});

export function resolveKompisWorkspaceTextDirection(
  locale: string,
  rtlSupport?: boolean
): "ltr" | "rtl" {
  if (!rtlSupport) return "ltr";
  return RTL_METADATA[locale] === true ? "rtl" : "ltr";
}

export function resolveKompisWorkspaceLocalizedText(
  values: Record<string, string>,
  locale: string,
  fallbackLocale = DEFAULT_LOCALE
): { value: string; usedFallback: boolean; resolvedLocale: string } {
  const primary = values[locale]?.trim();
  if (primary) {
    return { value: primary, usedFallback: false, resolvedLocale: locale };
  }
  const fb = values[fallbackLocale]?.trim() || values.en?.trim() || Object.values(values).find((v) => v?.trim());
  return {
    value: (fb ?? "").trim(),
    usedFallback: true,
    resolvedLocale: fallbackLocale,
  };
}
