// Dynamic locale registry helper for the APP + Website Kompis delivery surface.
// Never hardcode language switches in components — read the active locale set
// from lib/i18n/config so new core locales are picked up automatically.

import { CORE_LOCALES, type CoreLocale } from "@/lib/i18n/config";

/** Active core locale set for delivery UI/labels — single source of truth. */
export function discoverPlatformLocales(): readonly CoreLocale[] {
  return CORE_LOCALES;
}

/**
 * File reader injected by the caller (e.g. a filesystem read in tests) —
 * keeps this module free of filesystem imports so it stays safe in client
 * bundles.
 */
export type PlatformLocaleFileReader = (localeFilePath: string) => string;

export type DeliveryLocaleParityIssue = {
  locale: CoreLocale;
  missingKeys: string[];
};

function collectKeyPaths(value: unknown, prefix = ""): string[] {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }
  const paths: string[] = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    paths.push(...collectKeyPaths(nested, nextPrefix));
  }
  return paths;
}

function readSection(
  parsed: Record<string, unknown>,
  sectionPath: string[],
): unknown {
  let section: unknown = parsed;
  for (const segment of sectionPath) {
    section =
      section && typeof section === "object" && !Array.isArray(section)
        ? (section as Record<string, unknown>)[segment]
        : undefined;
  }
  return section;
}

/**
 * Compares the `customers.appKompisDelivery` (by default) key set across all
 * core locales and reports any locale missing keys present elsewhere, or
 * carrying keys no other locale has. Used by tests — never by runtime code.
 */
export function assertDeliveryLocaleParity(
  readLocalePlatformJson: PlatformLocaleFileReader,
  sectionPath: string[] = ["customers", "appKompisDelivery"],
  locales: readonly CoreLocale[] = discoverPlatformLocales(),
): DeliveryLocaleParityIssue[] {
  const keysByLocale = new Map<CoreLocale, Set<string>>();

  for (const locale of locales) {
    const raw = readLocalePlatformJson(`locales/${locale}/platform.json`);
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const section = readSection(parsed, sectionPath);
    keysByLocale.set(locale, new Set(collectKeyPaths(section)));
  }

  const unionKeys = new Set<string>();
  for (const keys of keysByLocale.values()) {
    for (const key of keys) unionKeys.add(key);
  }

  const issues: DeliveryLocaleParityIssue[] = [];
  for (const locale of locales) {
    const keys = keysByLocale.get(locale) ?? new Set<string>();
    const missingKeys = [...unionKeys].filter((key) => !keys.has(key)).sort();
    if (missingKeys.length > 0) {
      issues.push({ locale, missingKeys });
    }
  }

  return issues;
}
