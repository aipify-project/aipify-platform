import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";
import type { InstallationLocalizedText } from "./types";

/**
 * Canonical global locale list for InstallationWizard.
 * Sourced from Core language foundation (`LOCALES`) — never hardcode in wizard UI.
 * Optional `registry` lets tests prove new locales work without wizard code changes.
 */
export function listInstallationLocales(
  registry: readonly string[] = LOCALES,
): readonly string[] {
  return registry;
}

export function installationLocaleFallback(): string {
  return DEFAULT_LOCALE;
}

/**
 * Direction metadata from BCP-47 primary language subtag.
 * Not a UI locale picker list — wizard tabs must not hardcode language unions.
 */
export function isInstallationLocaleRtl(locale: string, contractRtlSupport?: boolean): boolean {
  if (!contractRtlSupport) return false;
  const primary = locale.toLowerCase().split("-")[0] ?? "";
  return primary === "ar" || primary === "he" || primary === "fa" || primary === "ur";
}

export function resolveInstallationTextDirection(
  locale: string,
  contractRtlSupport?: boolean
): "ltr" | "rtl" {
  return isInstallationLocaleRtl(locale, contractRtlSupport) ? "rtl" : "ltr";
}

export type InstallationLocaleDiagnostics = {
  missingKeys: string[];
  usedFallback: boolean;
  resolvedLocale: string;
};

/**
 * Resolve localized content. Never returns raw keys to customers.
 * Prefer locale_key + dictionary; locale_map only for provider-specific content.
 */
export function resolveInstallationLocalizedText(
  text: InstallationLocalizedText,
  opts: {
    locale: string;
    translate: (key: string) => string;
    fallbackLocale?: string;
  }
): { value: string; diagnostics: InstallationLocaleDiagnostics } {
  const fallback = opts.fallbackLocale ?? installationLocaleFallback();
  const missingKeys: string[] = [];

  if (text.kind === "locale_key") {
    const primary = opts.translate(text.key);
    if (primary && primary !== text.key) {
      return {
        value: primary,
        diagnostics: { missingKeys, usedFallback: false, resolvedLocale: opts.locale },
      };
    }
    missingKeys.push(text.key);
    // English / dictionary merge is expected via translate; never surface raw key.
    return {
      value: "",
      diagnostics: { missingKeys, usedFallback: true, resolvedLocale: fallback },
    };
  }

  const map = text.values;
  const preferred = map[opts.locale];
  if (preferred?.trim()) {
    return {
      value: preferred.trim(),
      diagnostics: { missingKeys, usedFallback: false, resolvedLocale: opts.locale },
    };
  }
  const fb = text.fallbackLocale ?? fallback;
  const fallbackValue = map[fb] ?? map.en ?? Object.values(map).find((v) => v?.trim());
  return {
    value: (fallbackValue ?? "").trim(),
    diagnostics: {
      missingKeys: preferred ? missingKeys : [`locale_map:${opts.locale}`],
      usedFallback: true,
      resolvedLocale: fb,
    },
  };
}

/** Customer-safe resolver: empty string rather than raw key when missing. */
export function resolveCustomerSafeText(
  text: InstallationLocalizedText,
  opts: {
    locale: string;
    translate: (key: string) => string;
    fallbackLocale?: string;
    emptyFallback: string;
  }
): string {
  const { value } = resolveInstallationLocalizedText(text, opts);
  return value.trim() || opts.emptyFallback;
}
