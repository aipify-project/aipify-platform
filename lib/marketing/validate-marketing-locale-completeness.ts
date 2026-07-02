import { readFileSync } from "node:fs";
import path from "node:path";

/** Public marketing locales that must mirror English key structure. */
export const MARKETING_CORE_LOCALES = ["en", "no", "sv", "da"] as const;

export type MarketingCoreLocale = (typeof MARKETING_CORE_LOCALES)[number];

export type MarketingLocaleIssue = {
  locale: MarketingCoreLocale;
  key: string;
  kind: "missing" | "empty";
};

export type MarketingLocaleCompletenessResult = {
  passed: boolean;
  canonicalKeyCount: number;
  issues: MarketingLocaleIssue[];
  missingByLocale: Record<MarketingCoreLocale, number>;
  emptyByLocale: Record<MarketingCoreLocale, number>;
};

function flattenStrings(
  value: unknown,
  prefix = "",
  out: Record<string, string> = {},
): Record<string, string> {
  if (value === null || value === undefined) return out;
  if (typeof value === "string") {
    if (prefix) out[prefix] = value;
    return out;
  }
  if (Array.isArray(value)) return out;
  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenStrings(child, next, out);
    }
  }
  return out;
}

export function loadMarketingDictionary(rootDir: string, locale: MarketingCoreLocale): Record<string, unknown> {
  const filePath = path.join(rootDir, "locales", locale, "marketing.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

export function validateMarketingLocaleCompleteness(
  rootDir: string,
  options: { locales?: readonly MarketingCoreLocale[] } = {},
): MarketingLocaleCompletenessResult {
  const locales = options.locales ?? MARKETING_CORE_LOCALES;
  const canonicalLocale = "en" as const;
  const canonicalFlat = flattenStrings(loadMarketingDictionary(rootDir, canonicalLocale));
  const canonicalKeys = Object.keys(canonicalFlat);

  const issues: MarketingLocaleIssue[] = [];
  const missingByLocale = Object.fromEntries(locales.map((l) => [l, 0])) as Record<
    MarketingCoreLocale,
    number
  >;
  const emptyByLocale = Object.fromEntries(locales.map((l) => [l, 0])) as Record<
    MarketingCoreLocale,
    number
  >;

  for (const locale of locales) {
    if (locale === canonicalLocale) continue;
    const localeFlat = flattenStrings(loadMarketingDictionary(rootDir, locale));
    for (const key of canonicalKeys) {
      if (!(key in localeFlat)) {
        issues.push({ locale, key, kind: "missing" });
        missingByLocale[locale] += 1;
        continue;
      }
      const value = localeFlat[key]?.trim?.() ?? localeFlat[key];
      const canonicalValue = canonicalFlat[key]?.trim?.() ?? canonicalFlat[key];
      if (value === "" || value === undefined) {
        if (value === "" && canonicalValue === "") continue;
        issues.push({ locale, key, kind: "empty" });
        emptyByLocale[locale] += 1;
      }
    }
  }

  return {
    passed: issues.length === 0,
    canonicalKeyCount: canonicalKeys.length,
    issues,
    missingByLocale,
    emptyByLocale,
  };
}

export function formatMarketingLocaleIssues(result: MarketingLocaleCompletenessResult, limit = 20): string {
  const lines = [
    `Canonical keys: ${result.canonicalKeyCount}`,
    ...MARKETING_CORE_LOCALES.filter((l) => l !== "en").map(
      (locale) =>
        `${locale}: missing=${result.missingByLocale[locale]}, empty=${result.emptyByLocale[locale]}`,
    ),
  ];
  if (result.issues.length > 0) {
    lines.push("", "Sample issues:");
    for (const issue of result.issues.slice(0, limit)) {
      lines.push(`  [${issue.locale}] ${issue.kind}: ${issue.key}`);
    }
    if (result.issues.length > limit) {
      lines.push(`  … and ${result.issues.length - limit} more`);
    }
  }
  return lines.join("\n");
}
