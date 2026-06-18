import { readFile } from "fs/promises";
import "server-only";
import path from "path";
import { cache } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import type { CustomerAppSplitName } from "./customer-app-split-config";
import type { Dictionary } from "./translate";

const LOCALES_ROOT = path.join(process.cwd(), "locales");

/** Server-only: read locale JSON from disk — excluded from webpack JSON graph. */
const readLocaleJson = cache(async (absolutePath: string): Promise<Dictionary> => {
  const raw = await readFile(absolutePath, "utf8");
  return JSON.parse(raw) as Dictionary;
});

async function resolveLocaleFile(locale: Locale, ...segments: string[]): Promise<Dictionary> {
  const primary = path.join(LOCALES_ROOT, locale, ...segments);
  try {
    return await readLocaleJson(primary);
  } catch {
    if (locale === DEFAULT_LOCALE) {
      throw new Error(`Locale file not found: ${primary}`);
    }
    return resolveLocaleFile(DEFAULT_LOCALE, ...segments);
  }
}

export async function loadRootNamespace(locale: Locale, name: string): Promise<Dictionary> {
  return resolveLocaleFile(locale, `${name}.json`);
}

export async function loadCustomerAppSplit(
  locale: Locale,
  split: CustomerAppSplitName
): Promise<Dictionary> {
  return resolveLocaleFile(locale, "customer-app", `${split}.json`);
}
