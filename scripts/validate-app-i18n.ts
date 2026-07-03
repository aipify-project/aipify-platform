#!/usr/bin/env npx tsx
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { CUSTOMER_APP_SPLIT_NAMES } from "../lib/i18n/customer-app-split-config";
import { APP_LOCALES } from "../lib/i18n/app-locales";

const ROOT = process.cwd();
const APP_LOCALE_CODES = APP_LOCALES as readonly string[];

const ROOT_NAMESPACES_FOR_APP = ["common", "shell"] as const;

type MissingKeyReport = {
  locale: string;
  file: string;
  keys: string[];
};

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  const entries: string[] = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      entries.push(...flattenKeys(nested, next));
    } else {
      entries.push(next);
    }
  }
  return entries;
}

function readJson(relativePath: string): Record<string, unknown> {
  const absolute = path.join(ROOT, relativePath);
  return JSON.parse(readFileSync(absolute, "utf8")) as Record<string, unknown>;
}

function compareLocaleFiles(
  englishRelativePath: string,
  locale: string,
  relativePath: string,
): MissingKeyReport | null {
  const localizedPath = path.join(ROOT, relativePath);
  if (!existsSync(localizedPath)) return null;
  const english = readJson(englishRelativePath);
  const localized = readJson(relativePath);
  const englishKeys = flattenKeys(english);
  const localizedKeys = new Set(flattenKeys(localized));
  const missing = englishKeys.filter((key) => !localizedKeys.has(key));
  if (missing.length === 0) return null;
  return { locale, file: relativePath, keys: missing };
}

function scanHardcodedEnglish(dir: string): string[] {
  const offenders: string[] = [];
  const englishSentence = /\b(?:Title|Subtitle|Loading\.\.\.|Save preferences|Open menu|Close menu)\b/;

  function walk(current: string) {
    for (const entry of readdirSync(current)) {
      const full = path.join(current, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        if (entry === "node_modules" || entry.startsWith(".")) continue;
        walk(full);
        continue;
      }
      if (!/\.(tsx|ts)$/.test(entry)) continue;
      const content = readFileSync(full, "utf8");
      if (englishSentence.test(content) && !content.includes("labelKey") && !content.includes("titleKey")) {
        offenders.push(path.relative(ROOT, full));
      }
    }
  }

  walk(dir);
  return offenders;
}

function main() {
  const reports: MissingKeyReport[] = [];

  for (const locale of APP_LOCALE_CODES) {
    if (locale === "en") continue;

    for (const ns of ROOT_NAMESPACES_FOR_APP) {
      const report = compareLocaleFiles(
        `locales/en/${ns}.json`,
        locale,
        `locales/${locale}/${ns}.json`,
      );
      if (report) reports.push(report);
    }

    for (const split of CUSTOMER_APP_SPLIT_NAMES) {
      const report = compareLocaleFiles(
        `locales/en/customer-app/${split}.json`,
        locale,
        `locales/${locale}/customer-app/${split}.json`,
      );
      if (report) reports.push(report);
    }
  }

  const hardcoded = [
    ...scanHardcodedEnglish(path.join(ROOT, "app/app")),
    ...scanHardcodedEnglish(path.join(ROOT, "components/app")),
    ...scanHardcodedEnglish(path.join(ROOT, "lib/app")),
    ...scanHardcodedEnglish(path.join(ROOT, "lib/app-portal")),
  ].slice(0, 25);

  if (reports.length === 0) {
    console.log("APP i18n completeness: all checked locale files include English key structure.");
  } else {
    console.error("APP i18n completeness: missing keys detected.");
    for (const report of reports) {
      console.error(`\n[${report.locale}] ${report.file}`);
      for (const key of report.keys.slice(0, 20)) {
        console.error(`  - ${key}`);
      }
      if (report.keys.length > 20) {
        console.error(`  … and ${report.keys.length - 20} more`);
      }
    }
  }

  if (hardcoded.length > 0) {
    console.warn("\nPotential hardcoded English placeholders (sample):");
    for (const file of hardcoded) {
      console.warn(`  - ${file}`);
    }
  }

  if (reports.length > 0) {
    process.exitCode = 1;
  }
}

main();
