import "server-only";

import { readFileSync } from "node:fs";
import { readFile } from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { mergeDictionary } from "@/lib/i18n/merge-dictionary";
import type { Dictionary } from "@/lib/i18n/translate";

const LOCALES_ROOT = path.join(process.cwd(), "locales");

async function readHumanApprovalSplit(locale: Locale): Promise<Dictionary> {
  const filePath = path.join(LOCALES_ROOT, locale, "customer-app", "humanApproval.json");
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as Dictionary;
  } catch {
    if (locale === DEFAULT_LOCALE) {
      throw new Error(`Human Approval locale file not found: ${filePath}`);
    }
    return readHumanApprovalSplit(DEFAULT_LOCALE);
  }
}

export async function loadHumanApprovalDictionary(locale: Locale): Promise<Dictionary> {
  const localized = await readHumanApprovalSplit(locale);
  const merged =
    locale === DEFAULT_LOCALE
      ? localized
      : mergeDictionary(await readHumanApprovalSplit(DEFAULT_LOCALE), localized);
  return { customerApp: { humanApproval: merged } };
}

export function readHumanApprovalLocaleFileSync(
  locale: string,
): Record<string, unknown> {
  const filePath = path.join(LOCALES_ROOT, locale, "customer-app", "humanApproval.json");
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}
