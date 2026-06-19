import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { loadRootNamespace } from "@/lib/i18n/load-namespace";
import { createTranslator } from "@/lib/i18n/translate";

export type MarketingDictionary = Record<string, unknown>;

export async function getMarketingContext() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "marketing"]);
  const t = createTranslator(dict);
  const marketing = { ...(dict.marketing as MarketingDictionary) };

  if (!marketing.platformAuthority) {
    const enMarketing = await loadRootNamespace(DEFAULT_LOCALE, "marketing");
    marketing.platformAuthority = enMarketing.platformAuthority;
  }

  return { locale, t, marketing, common: dict.common as Record<string, string> };
}

export function marketingSection<T extends Record<string, unknown>>(
  marketing: MarketingDictionary,
  key: string
): T {
  return (marketing[key] ?? {}) as T;
}
